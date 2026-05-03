import { InworldTTS } from "@inworld/tts";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("User not authenticated");

    const user = await ctx.runMutation(api.inworld.getCurrentUser, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!user) throw new Error("User not found");

    ctx.runMutation(api.inworld.saveAudio, {
      userId: user._id,
      voiceId: voice,
      prompt: text,
      storageId: storedAudioBlobUrl,
    });

  },
});

export const getCurrentUser = mutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { tokenIdentifier }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");
    return user;
  },
});
export const saveAudio = mutation({
  args: {
    userId: v.id("users"),
    voiceId: v.string(),
    prompt: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { userId, voiceId, prompt, storageId }) => {
    return await ctx.db.insert("generations", {
      userId,
      voiceId,
      prompt,
      storageId,
      format: "mp3",
    });
  },
});
