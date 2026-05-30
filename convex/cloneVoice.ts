"use node";
import { ApiError, InworldTTS } from "@inworld/tts";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";

type CloneVoiceResponse = {
  voice?: {
    voiceId?: string;
    id?: string;
    name?: string;
  };
  voiceId?: string;
  id?: string;
  name?: string;
};

function getClonedVoiceId(response: CloneVoiceResponse) {
  return (
    response.voice?.voiceId ??
    response.voice?.id ??
    response.voice?.name ??
    response.voiceId ??
    response.id ??
    response.name
  );
}

function getInworldErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const details =
      Object.keys(error.details ?? {}).length > 0
        ? ` Details: ${JSON.stringify(error.details)}`
        : "";
    return `Inworld API error${error.code ? ` ${error.code}` : ""}: ${error.message}${details}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

export const cloneVoice = action({
  args: {
    name: v.string(),
    lang_code: v.optional(v.string()),
    transcriptions: v.optional(v.array(v.string())),
    audioSample: v.bytes(),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { name, lang_code, transcriptions, description, audioSample, tags },
  ) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);
    if (!user) throw new Error("User not found");

    if (audioSample.byteLength === 0) {
      throw new Error("Audio sample is empty");
    }

    // Cache the raw audio in Convex storage for future auto-cloning on fallback keys
    const sampleStorageId = await ctx.storage.store(
      new Blob([audioSample], { type: "audio/wav" }),
    );

    const keys = [
      process.env.INWORLD_API_KEY,
      process.env.INWORLD_API_KEY2,
      process.env.INWORLD_API_KEY3,
    ].filter((key): key is string => typeof key === "string" && key.trim() !== "");

    if (keys.length === 0) {
      throw new Error("No Inworld API keys configured.");
    }

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const keySlot = String(i);
      try {
        const tts = InworldTTS({ apiKey: key, timeout: 300_000 });
        const clonedVoice = await tts.cloneVoice({
          audioSamples: [new Uint8Array(audioSample)],
          displayName: name,
          lang: lang_code || "EN_US",
          transcriptions,
          tags,
          description,
          removeBackgroundNoise: true,
        });

        const clonedVoiceId = getClonedVoiceId(clonedVoice);
        if (clonedVoiceId) {
          console.log("Cloned Voice ID:", clonedVoiceId, "on key slot:", keySlot);

          await ctx.runMutation(internal.voice.saveClonedVoice, {
            voiceId: clonedVoiceId,
            userId: user._id,
            name,
            lang_code,
            transcriptions,
            tags,
            description,
            sampleStorageId,
            voiceIdByKeySlot: { [keySlot]: clonedVoiceId },
          });
          return clonedVoiceId;
        } else {
          console.error("Inworld response missing voice data:", clonedVoice);
          throw new Error(
            "Inworld cloned the voice but did not return a voice identifier.",
          );
        }
      } catch (error: any) {
        const errorMessage = error?.message?.toLowerCase() || "";
        const statusCode = error?.status || error?.code || error?.response?.status;
        
        if (errorMessage.includes("no credits remaining") || statusCode === 402) {
          console.warn(`Inworld API key out of credits or failed (status ${statusCode}), trying next key...`);
          continue;
        }
        
        console.error("Inworld Clone Error:", error);
        throw new Error(
          `Failed to clone voice: ${getInworldErrorMessage(error)}`,
        );
      }
    }
    
    throw new Error("All Inworld API keys are exhausted.");
  },
});
