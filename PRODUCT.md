# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Creators, storytellers, podcasters, and video narrators who need natural-sounding voiceovers and custom cloned voices quickly without wading through bloated or sluggish audio software.

## Product Purpose

Resonance is a web-based neural voice synthesis and voice cloning studio built on Next.js, Convex, Clerk, and Inworld TTS. Users can browse curated and cloned voice profiles, write or paste scripts (including SSML) to generate downloadable speech with rate and temperature tuning, and clone custom voices from uploaded audio or live microphone recordings.

## Positioning

A focused, responsive vocal synthesis workspace where creators move directly from voice discovery or a 5-15 second sample recording to finished narration, backed by real-time Convex history, multiple Inworld TTS models (`inworld-tts-2`, `inworld-tts-1.5-mini`, `inworld-tts-1.5-max`), and 15+ supported language codes.

## Operating Context

- Landing page (`/`) introduces Resonance and routes creators into Voice Library (`/app/voices`), Text to Speech (`/app/text-to-speech`), Voice Cloning (`/app/voice-cloning`), or the studio Dashboard (`/app`).
- Authentication via Clerk (`/sign-in`, `/sign-up`) with light and dark theme parity.
- Studio workspace (`/app/*`) includes Dashboard overview, Voice Library (Profiles + History Logs with WaveSurfer playback), Text to Speech (script editor, SSML mode with line numbers, speaking rate 0.5x-1.5x, temperature 0.00-1.00, credit balance tracking, audio history with play/download/delete), Voice Cloning (upload or record with guided prompts, metadata/tags, cloned voice list), Studio Settings (Clerk profile, notifications/haptics toggles, account deletion), and Support (FAQ + `support@resonance.ai`).

## Capabilities and Constraints

- Preserve all existing Convex queries/mutations/actions, Clerk authentication flows, Inworld TTS synthesis/cloning integrations, localStorage `selectedVoice` / `model` handoff, and WaveSurfer audio playback/recording.
- Performance is a primary requirement: remove GPU-heavy full-screen blur animations, continuous `mousemove` React state re-renders, and full-page 3D CSS transforms so both marketing and studio pages feel instantaneous and smooth on desktop and mobile.
- Support both light and dark modes with crisp accessibility contrast.
- Creative constraint from user: editorial and airy visual character with generous whitespace, sharp typographic hierarchy, and understated surfaces across the entire web app.

## Brand Commitments

- Brand name: Resonance
- Logo asset: `public/logo.png`
- Support contact: `support@resonance.ai`
- Editorial, airy aesthetic: generous whitespace, sharp typographic hierarchy, understated surfaces.

## Evidence on Hand

- Existing routes and components under `src/app/` and `src/components/`
- Brand mark at `public/logo.png`
- Real Convex schema and backend integrations in `convex/`
- Do not invent unverified customer logos, benchmarks, pricing tiers, or testimonials.

## Product Principles

1. **Speed as craft:** Instant interaction and smooth 60fps rendering with zero layout thrash or heavy background compositor traps.
2. **Editorial clarity:** Generous breathing room, crisp hierarchy, and understated surfaces let scripts, voices, and waveforms take center stage.
3. **Zero-friction creator flow:** Moving from voice selection or cloning to speech synthesis should feel immediate and uninterrupted.
4. **Honest studio restraint:** Every control earns its space; keep labels functional, states explicit, and data real.
