# Resonance

> Next-Generation AI Voice Generator. Text-to-Speech, Voice Library & Voice Cloning — create human-sounding voiceovers in seconds.

---

## Live Demo

[tryresonance.vercel.app](https://tryresonance.vercel.app)

---

## Features

- **Text to Speech** — Type any script and generate studio-quality voiceovers with natural pacing, temperature control, and emotion.
- **Voice Library** — Browse a curated collection of high-fidelity AI voices spanning 9+ languages and regions.
- **Voice Cloning** — Create a digital replica of your own voice using sample audio recordings or file uploads.
- **Credit Balancing** — Character-level credit tracking with automatic deduction and validation.
- **Key Rotation & Auto-Cloning** — Automatic failover across multiple Inworld API keys with auto-cloning from cached audio samples.
- **Multi-Language Support** — EN-US, ES-ES, JA-JP, ZH-CN, KO-KR, AR-SA, HI-IN, HE-IL, PL-PL, and more.
- **Real-Time Dashboard** — Real-time telemetry, generation histories, and waveform audio previews.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, Next.js 16 with `proxy.ts`)
- **Backend & Database:** [Convex](https://convex.dev) — real-time database, serverless actions & file storage
- **AI Audio:** [Inworld TTS](https://inworld.ai) (`@inworld/tts`) — neural vocal synthesis and voice cloning
- **Auth:** [Clerk](https://clerk.com) — user authentication and session management
- **Audio Visualizer:** [Wavesurfer.js](https://wavesurfer.xyz) — waveform audio players and live microphone recording
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Haptics:** Web Haptics API integration for tactile feedback

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Bun](https://bun.sh) (recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd resonance

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
CONVEX_DEPLOY_KEY=your_convex_deploy_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Inworld TTS
INWORLD_API_KEY=your_inworld_api_key
INWORLD_API_KEY2=your_inworld_fallback_api_key_2   # Optional key rotation
INWORLD_API_KEY3=your_inworld_fallback_api_key_3   # Optional key rotation
```

### Development

```bash
# Start the Next.js dev server and Convex backend concurrently
bun run dev

# Or start them individually
bun run dev:web      # Next.js
bun run dev:backend  # Convex
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
resonance/
├── convex/              # Convex backend — schemas, queries, mutations, actions
│   ├── schema.ts        # Database table definitions & indexes
│   ├── users.ts         # User profiles, credits, and account decommissioning
│   ├── voice.ts         # Voice library queries, default voices, rankings
│   ├── cloneVoice.ts    # Voice cloning action with Inworld & fallback keys
│   └── inworldGenerateSpeech.ts # Neural speech generation & preview actions
├── public/              # Static assets (logo, icons)
├── src/
│   ├── proxy.ts         # Next.js 16 route protection with Clerk
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # 3D interactive landing page
│   │   ├── app/         # Authenticated studio dashboard
│   │   │   ├── page.tsx           # Dashboard home & quick stats
│   │   │   ├── voices/            # Voice library & generation history
│   │   │   ├── text-to-speech/    # Script editor & vocal synthesizer
│   │   │   ├── voice-cloning/     # Microphone recorder & voice clone creator
│   │   │   ├── settings/          # Profile, notifications & account purge
│   │   │   └── support/           # Knowledge base & FAQs
│   │   ├── (auth)/      # Sign-in & Sign-up routes
│   │   └── layout.tsx   # Root layout, theme & Convex providers
│   └── components/      # UI components, WaveformPlayer, Sidebar, Navbar
├── package.json
└── next.config.ts
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Next.js + Convex concurrently |
| `bun run dev:web` | Start Next.js dev server only |
| `bun run dev:backend` | Start Convex dev server only |
| `bun run build` | Production Next.js build |
| `bun run typecheck` | Standalone TypeScript verification (`tsc --noEmit`) |
| `bun run lint` | Check code with Biome |
| `bun run format` | Format code with Biome |

---

## Deployment

This project is optimized for [Vercel](https://vercel.com/).

1. Connect your GitHub repository to Vercel.
2. Add your environment variables in **Project Settings > Environment Variables**.
3. Push to `main` or `master` — Vercel will build and deploy automatically.

---

## License

© 2026 Resonance Inc. All rights reserved.
