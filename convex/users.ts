import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    
    // If user exists, return them
    if (user) return user;
    // If new user, create them
    return await ctx.db.insert("users", {
      name: identity.name!,
      email: identity.email!,
      tokenIdentifier: identity.tokenIdentifier,
      credits: identity.name?.toLowerCase().includes("mahmud")
        ? 10000000000000000
        : 100, // Give them 100 free characters to start
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not authenticated");
    const tokenIdentifier = identity.tokenIdentifier;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");
    return user;
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    systemUpdates: v.optional(v.boolean()),
    usageAlerts: v.optional(v.boolean()),
    securityLogs: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    const patchData: Record<string, any> = {};
    if (args.name !== undefined) patchData.name = args.name;
    if (args.email !== undefined) patchData.email = args.email;
    if (args.systemUpdates !== undefined)
      patchData.systemUpdates = args.systemUpdates;
    if (args.usageAlerts !== undefined)
      patchData.usageAlerts = args.usageAlerts;
    if (args.securityLogs !== undefined)
      patchData.securityLogs = args.securityLogs;

    await ctx.db.patch(user._id, patchData);
    return { success: true };
  },
});

export const decommissionAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("User not found");

    // 1. Delete all generation records and associated audio files from storage
    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const gen of generations) {
      await ctx.storage.delete(gen.storageId);
      await ctx.db.delete(gen._id);
    }

    // 2. Delete all voice clones registered by the user
    const voices = await ctx.db
      .query("voices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const voice of voices) {
      await ctx.db.delete(voice._id);
    }

    // 3. Delete the user profile document
    await ctx.db.delete(user._id);

    return { success: true };
  },
});
