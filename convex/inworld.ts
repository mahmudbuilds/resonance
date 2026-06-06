import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
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
    userId: v.optional(v.id("users")),
    inworldVoiceId: v.string(),
    prompt: v.string(),
    storageId: v.id("_storage"),
    audioUrl: v.string(),
    isPreview: v.optional(v.boolean())
  },
  handler: async (ctx, { userId, inworldVoiceId, prompt, storageId, audioUrl, isPreview }) => {
    const voice = await ctx.db.query("voices").withIndex("by_voiceID", (q) => q.eq("inworldVoiceId", inworldVoiceId)).first();
    if (!voice) throw new Error("Voice not found");
    await ctx.db.patch(voice._id, { playCount: (voice.playCount || 0) + 1 });

    if (!isPreview) {isPreview == false}
    
    return await ctx.db.insert("generations", {
      userId,
      inworldVoiceId,
      prompt,
      storageId,
      format: "mp3",
      audioUrl,
      isPreview
    });
  },
});

export const listUserGenerations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not found");
    const tokenIdentifier = identity.tokenIdentifier;
    const currentUser = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier)).unique();
    if (!currentUser) throw new Error("User not found");
    return await ctx.db.query("generations").withIndex("by_user", (q) => q.eq("userId", currentUser._id)).collect();
  },
});


export const deleteUserGeneration = mutation({
  args: {
    generationId: v.id("generations"),
  },
  handler: async (ctx, { generationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not found");
    const tokenIdentifier = identity.tokenIdentifier;
    const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier)).unique();
    if (!user) throw new Error("User not found");
    const generation = await ctx.db.get(generationId);
    if (!generation) throw new Error("Generation not found");
    if (generation.userId !== user._id) throw new Error("User not authorized");
    await ctx.db.delete(generationId);
  },
});
