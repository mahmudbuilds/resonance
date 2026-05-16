"use node";
import { ApiError, InworldTTS } from "@inworld/tts";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

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

    const tts = InworldTTS({ timeout: 300_000 });
    try {
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
        console.log("Cloned Voice ID:", clonedVoiceId);

        await ctx.runMutation(internal.cloneVoice.saveClonedVoice, {
          voiceId: clonedVoiceId,
          userId: user._id,
          name,
          lang_code,
          transcriptions,
          tags,
          description,
        });
        return clonedVoiceId;
      } else {
        console.error("Inworld response missing voice data:", clonedVoice);
        throw new Error(
          "Inworld cloned the voice but did not return a voice identifier.",
        );
      }
    } catch (error) {
      console.error("Inworld Clone Error:", error);
      throw new Error(
        `Failed to clone voice: ${getInworldErrorMessage(error)}`,
      );
    }
  },
});

export const saveClonedVoice = internalMutation({
  args: {
    voiceId: v.string(),
    userId: v.id("users"),
    name: v.string(),
    lang_code: v.optional(v.string()),
    transcriptions: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { voiceId, userId, name, lang_code, tags, description },
  ) => {
    return await ctx.db.insert("voices", {
      inworldVoiceId: voiceId,
      userId,
      displayName: name,
      langCode: lang_code,
      isPublic: false,
      tags,
      description,
    });
  },
});
