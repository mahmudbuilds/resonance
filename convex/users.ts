import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

      console.log(identity)
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
