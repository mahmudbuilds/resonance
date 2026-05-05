import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import { InworldTTS } from "@inworld/tts";
export const seedDefaultVoices = action({
  args: {},
  handler: async (ctx) => {
    const tts = InworldTTS();
    const voices = await tts.listVoices();
    for (const voice of voices) {
        const isVoicePresent = await ctx.runQuery(internal.voice.isVoicePresent, {inworldVoiceId: voice.voiceId})
        if (isVoicePresent) { continue }
      await ctx.runMutation(internal.voice.addDefaultVoices, {
        displayName: voice.displayName,
        inworldVoiceId: voice.voiceId,
        description: voice.description,
        langCode: voice.langCode,
        tags: voice.tags,
      });
    }
  },
});

export const isVoicePresent = internalQuery({
  args: {
    inworldVoiceId: v.string(),
  },
  handler: async (ctx, { inworldVoiceId }) => {
    try {
    const user = ctx.db
      .query("voices")
      .withIndex("by_voiceID", (q) => 
        q.eq("inworldVoiceId", inworldVoiceId)
      )
      .unique();
      return user;
    } catch (err) {
        return false
    }
      
  },
});

export const addDefaultVoices = internalMutation({
  args: {
    displayName: v.string(),
    inworldVoiceId: v.string(),
    description: v.optional(v.string()),
    langCode: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    { displayName, inworldVoiceId, description, langCode, tags },
  ) => {
    return await ctx.db.insert("voices", {
      displayName,
      inworldVoiceId,
      isPublic: true,
      description,
      langCode,
      tags,
    });
  },
});

export const getUserVoices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("voices").collect();
  },
});