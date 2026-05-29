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
    const tts = InworldTTS();
    return await tts.listVoices();
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
    const tts = InworldTTS();
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
  },
});
