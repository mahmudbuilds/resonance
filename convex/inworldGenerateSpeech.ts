"use node";
import { performance } from "node:perf_hooks";

import { InworldTTS } from "@inworld/tts";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

if (!globalThis.performance) {
  (globalThis as any).performance = performance;
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
        process.env.INWORLD_API_KEY = key;
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

    for (const key of keys) {
      try {
        process.env.INWORLD_API_KEY = key; // Fallback in case apiKey is read from env
        const tts = InworldTTS({ apiKey: key });
        const audio = await tts.generate({
          text,
          voice,
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
          inworldVoiceId: voice,
          prompt: text,
          storageId: storedAudioBlobUrl,
          audioUrl: audioUrl!,
        });
        return [storedAudioBlobUrl, audioUrl];
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
