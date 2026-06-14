# Resonance

> Next-Generation AI Voice Generator. Text-to-Speech, Voice Library & Voice Cloning — create human-sounding voiceovers in seconds.

---

## Live Demo

[tryresonance.vercel.app](https://tryresonance.vercel.app)

---

## Features

- **Text to Speech** — Type any script and generate studio-quality voiceovers with natural pacing and emotion.
- **Voice Library** — Browse a curated collection of high-fidelity AI voices spanning 9+ languages and regions.
- **Voice Cloning** — Create a perfect digital replica of your own voice using just 60 seconds of audio.
- **Multi-Language Support** — EN-US, ES-ES, JA-JP, ZH-CN, KO-KR, AR-SA, HI-IN, HE-IL, PL-PL, and more.
- **Real-Time Dashboard** — Track generations, saved voices, and studio activity at a glance.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Backend:** [Convex](https://convex.dev) — real-time database and serverless functions
- **Auth:** [Clerk](https://clerk.com) — user authentication and session management
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Custom CSS keyframes, 3D perspective transforms
- **Icons:** Lucide React + Remix Icons
- **Charts:** Recharts

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
├── convex/              # Convex backend — schemas, queries, mutations
├── public/              # Static assets (logo, images)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # Landing page
│   │   ├── app/         # Authenticated dashboard
│   │   │   ├── page.tsx
│   │   │   ├── voices/
│   │   │   ├── text-to-speech/
│   │   │   ├── voice-cloning/
│   │   │   ├── settings/
│   │   │   └── support/
│   │   ├── (auth)/      # Auth routes (sign-in, sign-up)
│   │   └── layout.tsx
│   └── components/      # React components & UI primitives
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
| `bun run build` | Production build |
| `bun run lint` | Check code with Biome |
| `bun run format` | Format code with Biome |

---

## Deployment

This project is optimized for [Vercel](https://vercel.com/).

1. Connect your GitHub repository to Vercel.
2. Add your environment variables in **Project Settings > Environment Variables**.
3. Push to `main` — Vercel will build and deploy automatically.

---

## License

© 2026 Resonance Inc. All rights reserved.

---

<p align="center">
  <a href="https://tryresonance.vercel.app">Live Demo</a> &middot;
  <a href="https://nextjs.org/docs">Next.js Docs</a> &middot;
  <a href="https://docs.convex.dev">Convex Docs</a> &middot;
  <a href="https://clerk.com/docs">Clerk Docs</a>
</p>
