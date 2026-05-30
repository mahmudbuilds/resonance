import { action, internalMutation, internalQuery, query, QueryCtx, mutation } from "./_generated/server";
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


export const getCurrentUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw "User not authenticated";
  const tokenIdentifier = identity.tokenIdentifier;
  const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier)).unique();
  if (!user) throw "User not found";
  return user;
}

export const getUserVoices = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not found");
    const userOwnedVoices = await ctx.db.query("voices").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    const publicVoices = await ctx.db.query("voices").withIndex("by_public", (q) => q.eq("isPublic", true)).collect();
    return [...userOwnedVoices, ...publicVoices];
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
    sampleStorageId: v.optional(v.id("_storage")),
    voiceIdByKeySlot: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (
    ctx,
    { voiceId, userId, name, lang_code, tags, description, sampleStorageId, voiceIdByKeySlot },
  ) => {
    return await ctx.db.insert("voices", {
      inworldVoiceId: voiceId,
      userId,
      displayName: name,
      langCode: lang_code,
      isPublic: false,
      tags,
      description,
      sampleStorageId,
      voiceIdByKeySlot,
    });
  },
});

export const getVoiceByInworldId = internalQuery({
  args: { inworldVoiceId: v.string() },
  handler: async (ctx, { inworldVoiceId }) => {
    return await ctx.db
      .query("voices")
      .withIndex("by_voiceID", (q) => q.eq("inworldVoiceId", inworldVoiceId))
      .first();
  },
});

export const saveKeySlotVoiceId = internalMutation({
  args: {
    voiceDocId: v.id("voices"),
    keySlot: v.string(),
    inworldVoiceId: v.string(),
  },
  handler: async (ctx, { voiceDocId, keySlot, inworldVoiceId }) => {
    const voice = await ctx.db.get(voiceDocId);
    if (!voice) throw new Error("Voice document not found");
    const existing = voice.voiceIdByKeySlot ?? {};
    await ctx.db.patch(voiceDocId, {
      voiceIdByKeySlot: { ...existing, [keySlot]: inworldVoiceId },
    });
  },
});

export const listClonedVoices = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not identified");

    return await ctx.db
      .query("voices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const listClonedVoice = listClonedVoices;

export const deleteClonedVoice = mutation({
  args: {
    voiceId: v.id("voices"),
  },
  handler: async (ctx, { voiceId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not identified");

    const voice = await ctx.db.get(voiceId);
    if (!voice) throw new Error("Voice not found");

    if (voice.userId !== user._id) {
      throw new Error("Unauthorized to delete this voice");
    }

    await ctx.db.delete(voiceId);
    return true;
  },
});


export const getNumberOfGenerations = query({args: {}, handler: async(ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("User not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
  if (!user) throw new Error("User not identified");
  const userGenerations = await ctx.db.query("generations").withIndex("by_user", (q) => q.eq("userId", user._id));
  return (await userGenerations.collect()).length;

}});

export const getNumberOfUserVoices = query({args: {}, handler: async(ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("User not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
  if (!user) throw new Error("User not identified");
  const userVoices = await ctx.db.query("voices").withIndex("by_user", (q) => q.eq("userId", user._id));
  const publicVoices = await ctx.db.query("voices").withIndex("by_public", (q) => q.eq("isPublic", true));
  return (await userVoices.collect()).length + (await publicVoices.collect()).length;

}});

export const getTopVoices = query({args: {}, handler: async(ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("User not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
  if (!user) throw new Error("User not identified");
  const top3PublicVoices = await ctx.db.query("voices").withIndex("by_playCount").order("desc").take(3);
  const topUserVoice = await ctx.db.query("voices").withIndex("by_plays_and_user", (q) => q.eq("userId", user._id)).order("desc").take(1);
  return [...top3PublicVoices, ...topUserVoice];
}})

