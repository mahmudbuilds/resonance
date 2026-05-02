import { InworldTTS } from "@inworld/tts";
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listVoices = action({
    args: {},
    handler: async (ctx) => {
        const tts = InworldTTS();
        return await tts.listVoices();
    }
})