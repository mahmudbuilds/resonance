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
    userId: v.id("users"),
    voiceId: v.string(),
    prompt: v.string(),
    storageId: v.id("_storage"),
    audioUrl: v.string(),
  },
  handler: async (ctx, { userId, voiceId, prompt, storageId, audioUrl }) => {
    return await ctx.db.insert("generations", {
      userId,
      voiceId,
      prompt,
      storageId,
      format: "mp3",
      audioUrl,
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
