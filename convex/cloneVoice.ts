import { InworldTTS } from "@inworld/tts";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

export const cloneVoice = action({
  args: {
    name: v.string(),
    lang_code: v.optional(v.string()),
    transcriptions: v.optional(v.array(v.string())),
    audioSample: v.bytes(),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { name, lang_code, transcriptions, description, audioSample, tags },
  ) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);
    if (!user) throw new Error("User not found");
    const tts = InworldTTS();
    try {
      const clonedVoice = await tts.cloneVoice({
        audioSamples: [new Uint8Array(audioSample)],
        displayName: name,
        lang: lang_code,
        transcriptions,
        tags,
        description,
        removeBackgroundNoise: true,
      });
      const clonedVoiceId = clonedVoice.voice.voiceId
      if (clonedVoice) {
        await ctx.runMutation(internal.cloneVoice.saveClonedVoice, {
          voiceId: clonedVoiceId,
          userId: user._id,
          name,
          lang_code,
          transcriptions,
          tags,
          description,
        });
        return clonedVoiceId
      } else {
        throw new Error("Failed to generate new cloned voice. Please try again.")
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to clone voice");
    }
    
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
  },
  handler: async (
    ctx,
    { voiceId, userId, name, lang_code, transcriptions, tags, description },
  ) => {
    return await ctx.db.insert("voices", {
      inworldVoiceId: voiceId,
      userId,
      displayName: name,
      langCode: lang_code,
      isPublic: false,
      tags,
      description,
    });
  },
});
