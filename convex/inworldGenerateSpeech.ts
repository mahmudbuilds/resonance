"use node";
import { performance } from "node:perf_hooks";

import { InworldTTS } from "@inworld/tts";
import { action } from "./_generated/server";
import { convexToJson, v } from "convex/values";
import { api, internal } from "./_generated/api";

if (!globalThis.performance) {
  (globalThis as any).performance = performance;
}

// Shared helper to extract a voice ID from an Inworld clone response
type CloneVoiceResponse = {
  voice?: { voiceId?: string; id?: string; name?: string };
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

export const listVoices = action({
  args: {},
  handler: async (ctx) => {
    const keys = [
      process.env.INWORLD_API_KEY,
      process.env.INWORLD_API_KEY2,
      process.env.INWORLD_API_KEY3,
    ].filter((key): key is string => typeof key === "string" && key.trim() !== "");

    if (keys.length === 0) {
      throw new Error("No Inworld API keys configured.");
    }

    for (const key of keys) {
      try {
        const tts = InworldTTS({ apiKey: key });
        return await tts.listVoices();
      } catch (error: any) {
        const errorMessage = error?.message?.toLowerCase() || "";
        const statusCode = error?.status || error?.code || error?.response?.status;
        if (errorMessage.includes("no credits remaining") || statusCode === 402) {
          console.warn("Inworld API key out of credits, trying next key...");
          continue;
        }
        throw error;
      }
    }
    throw new Error("All Inworld API keys are exhausted.");
  },
});

export const generateSpeech = action({
  args: {
    text: v.string(),
    voice: v.string(),
    model: v.string(),
    speakingRate: v.number(),
    temperature: v.number(),
  },
  handler: async (ctx, { text, voice, model, speakingRate, temperature }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.runMutation(api.inworld.getCurrentUser, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!user) throw new Error("User not found");

    const keys = [
      process.env.INWORLD_API_KEY,
      process.env.INWORLD_API_KEY2,
      process.env.INWORLD_API_KEY3,
    ].filter((key): key is string => typeof key === "string" && key.trim() !== "");

    if (keys.length === 0) {
      throw new Error("No Inworld API keys configured.");
    }

    // Look up the voice document once (may be null for stock voices)
    const voiceDoc = await ctx.runQuery(internal.voice.getVoiceByInworldId, {
      inworldVoiceId: voice,
    });

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const keySlot = String(i);

      try {

        // --- Lazy Auto-Clone: resolve the correct voice ID for this key slot ---
        let effectiveVoiceId = voice;

        if (voiceDoc && voiceDoc.voiceIdByKeySlot) {
          const mappedId = voiceDoc.voiceIdByKeySlot[keySlot];
          if (mappedId) {
            // This key slot already has a cloned voice ID — use it
            effectiveVoiceId = mappedId;
            console.log(`Using cached voice ID "${mappedId}" for key slot ${keySlot}`);
          } else if (voiceDoc.sampleStorageId) {
            // Fallback key with no mapped ID — auto-clone from cached audio
            console.log(`Auto-cloning voice "${voiceDoc.displayName}" for key slot ${keySlot}...`);

            const sampleBlob = await ctx.storage.get(voiceDoc.sampleStorageId);
            if (sampleBlob) {
              const sampleBytes = await sampleBlob.arrayBuffer();
              const ttsClone = InworldTTS({ apiKey: key, timeout: 300_000 });
              const clonedVoice = await ttsClone.cloneVoice({
                audioSamples: [new Uint8Array(sampleBytes)],
                displayName: voiceDoc.displayName,
                lang: voiceDoc.langCode || "EN_US",
                removeBackgroundNoise: true,
              });

              const newVoiceId = getClonedVoiceId(clonedVoice);
              if (newVoiceId) {
                // Persist the new mapping so future requests skip the clone step
                await ctx.runMutation(internal.voice.saveKeySlotVoiceId, {
                  voiceDocId: voiceDoc._id,
                  keySlot,
                  inworldVoiceId: newVoiceId,
                });
                effectiveVoiceId = newVoiceId;
                console.log(`Auto-cloned voice ID "${newVoiceId}" saved for key slot ${keySlot}`);
              } else {
                console.warn(`Auto-clone returned no voice ID for key slot ${keySlot}, falling back to original`);
              }
            } else {
              console.warn(`Cached audio sample not found for voice "${voiceDoc.displayName}", using original voice ID`);
            }
          }
        }
        // For stock/public voices (no voiceDoc or no voiceIdByKeySlot), effectiveVoiceId stays as the original

        // --- Generate speech with the resolved voice ID ---
        const tts = InworldTTS({ apiKey: key });
        const audio = await tts.generate({
          text,
          voice: effectiveVoiceId,
          model,
          speakingRate,
          temperature,
          encoding: "MP3",
        });

        const audioBlob = new Blob([audio as unknown as Uint8Array<ArrayBuffer>], {
          type: "audio/mpeg",
        });

        const storedAudioBlobUrl = await ctx.storage.store(audioBlob);
        const audioUrl = await ctx.storage.getUrl(storedAudioBlobUrl);
        await ctx.runMutation(api.inworld.saveAudio, {
          userId: user._id,
          inworldVoiceId: voice, // Keep original voice ID for the generations record
          prompt: text,
          storageId: storedAudioBlobUrl,
          audioUrl: audioUrl!,
        });
        return [storedAudioBlobUrl, audioUrl];
      } catch (error: any) {
        const errorMessage = error?.message?.toLowerCase() || "";
        const statusCode = error?.status || error?.code || error?.response?.status;
        if (errorMessage.includes("no credits remaining") || statusCode === 402) {
          console.warn(`Inworld API key out of credits (slot ${i}), trying next key...`);
          continue;
        }
        throw error;
      }
    }
    
    throw new Error("All Inworld API keys are exhausted.");
  },
});


export const generatePreviewSpeeches = action({
  args: {voiceIds: v.array(v.string())}, 
  handler: async(ctx, {voiceIds}) => {

  const tts = InworldTTS();
  const audioUrls = voiceIds.map(async(voiceId) => {
    const audio = await tts.generate({
      text: "Hi everyone! I am so excited to give you an exclusive first look at what we've been working on. This is just a quick preview to set the stage for what’s coming next, so let's get right into it!",
      voice: voiceId,
      model: "inworld-tts-2",
      speakingRate: 1,
      temperature: 0.7,
      encoding: "MP3",
    });
    const audioBlob = new Blob([audio as unknown as Uint8Array<ArrayBuffer>], {
      type: "audio/mpeg",
    });
    const storedAudioBlobUrl = await ctx.storage.store(audioBlob);
    const audioUrl = await ctx.storage.getUrl(storedAudioBlobUrl);
    await ctx.runMutation(api.inworld.saveAudio, {
      inworldVoiceId: voiceId,
      prompt: "Hi everyone! I am so excited to give you an exclusive first look at what we've been working on. This is just a quick preview to set the stage for what’s coming next, so let's get right into it!",
      storageId: storedAudioBlobUrl,
      audioUrl: audioUrl!,
    });
  })
 

  }})