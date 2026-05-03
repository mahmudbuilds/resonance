import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Users & Preferences
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    tokenIdentifier: v.string(), // For authentication (Clerk/Auth0)
    credits: v.number(),         // Track how many characters they have left
  }).index("by_token", ["tokenIdentifier"]),

  // 2. The Cloned Voices
  voices: defineTable({
    userId: v.optional(v.id("users")),
    displayName: v.string(),
    // This is the ID gotten from Inworld after cloning
    inworldVoiceId: v.optional(v.string()), 
    sampleUrl: v.optional(v.string()), // URL to the original 10s clip
    isPublic: v.boolean(),
    langCode: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
  }).index("by_user", ["userId"]),

  // 3. Generation History
  generations: defineTable({
    userId: v.id("users"),
    voiceId: v.string(),
    prompt: v.string(),
    // Store the audio in Convex's built-in file storage
    storageId: v.id("_storage"), 
    format: v.string(), // e.g., "mp3" or "wav"
  }).index("by_user", ["userId"]),
});