import {
  ArrowUpRight,
  AudioLines,
  Mic2,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroAudioAudition } from "@/components/home/HeroAudioAudition";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const WORKSPACE_ROWS = [
  {
    title: "Voice Library",
    description:
      "Browse curated voices across 16 locale codes with clear descriptions, tags, and instant handoff into the editor.",
    meta: "16 Locales",
    href: "/app/voices",
    icon: AudioLines,
  },
  {
    title: "Text to Speech",
    description:
      "Draft narration or structured SSML scripts with speaking rate and temperature controls, plus downloadable history.",
    meta: "SSML + Tuning",
    href: "/app/text-to-speech",
    icon: SlidersHorizontal,
  },
  {
    title: "Voice Cloning",
    description:
      "Upload an audio file or record a guided 5 to 15 second sample directly in the browser to create a reusable voice.",
    meta: "5-15s Sample",
    href: "/app/voice-cloning",
    icon: Mic2,
  },
];

const SUPPORTED_LOCALES = [
  "EN-US",
  "ES-ES",
  "FR-FR",
  "DE-DE",
  "JA-JP",
  "KO-KR",
  "ZH-CN",
  "HI-IN",
  "AR-SA",
  "PT-BR",
  "IT-IT",
  "PL-PL",
  "NL-NL",
  "RU-RU",
  "HE-IL",
  "AUTO",
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Single-line navigation (64px) */}
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logo.png"
              alt="Resonance"
              width={32}
              height={32}
              className="size-8 object-contain dark:invert-0 invert"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              Resonance
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground"
          >
            <Link
              href="/app/voices"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Voices
            </Link>
            <Link
              href="/app/text-to-speech"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Text to Speech
            </Link>
            <Link
              href="/app/voice-cloning"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Voice Cloning
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
            <Button
              asChild
              className="rounded-full h-9 px-5 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              <Link href="/app">Open Studio</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: Asymmetric editorial opening */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-16 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.03em] leading-[1.04] text-foreground max-w-xl">
                Voices that sound human.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[46ch]">
                Write a script, audition natural speakers, and export studio
                narration in seconds without robotic cadence.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm whitespace-nowrap"
                >
                  <Link href="/app/voice-cloning">
                    Clone a Voice
                    <ArrowUpRight className="size-4 ml-1.5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-7 border-border bg-card hover:bg-accent text-foreground font-medium text-sm whitespace-nowrap"
                >
                  <Link href="/app/text-to-speech">Try Text to Speech</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src="/images/studio-hero.webp"
                  alt="Minimalist architectural recording room with a brushed aluminum condenser microphone in soft daylight"
                  width={1200}
                  height={896}
                  priority
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <HeroAudioAudition />
            </div>
          </div>
        </section>

        {/* Core Workspaces: Asymmetric 4+8 Ruled Index */}
        <section className="border-t border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
                Built for spoken clarity
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[36ch]">
                Three focused workspaces take you from voice discovery to final
                audio export with zero clutter.
              </p>
            </div>

            <div className="lg:col-span-8 border-t border-b border-border divide-y divide-border">
              {WORKSPACE_ROWS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/60 transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-lg"
                >
                  <div className="flex items-start gap-4 max-w-xl">
                    <div className="size-10 rounded-lg border border-border bg-card flex items-center justify-center text-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors shrink-0 mt-0.5">
                      <item.icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0 pl-14 sm:pl-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.meta}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Craft Showcase: Editorial 2-column split */}
        <section className="border-t border-border bg-secondary/40">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src="/images/studio-acoustic-detail.webp"
                  alt="Matte dark anodized studio audio interface next to an acoustic foam baffle on stone"
                  width={1200}
                  height={670}
                  className="w-full aspect-video object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight max-w-md">
                From one clean take to a reusable voice
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[54ch]">
                Record directly in the studio with guided calibration sentences
                or drop in an existing MP3 or WAV recording. Resonance stores
                your profile in your private library so you can narrate new
                scripts anytime.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[54ch]">
                Switch seamlessly between plain prose and SSML markup when a
                documentary or product tour needs exact pauses and pacing.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full h-11 px-6 border-border bg-card hover:bg-accent text-foreground font-medium text-sm whitespace-nowrap"
                >
                  <Link href="/app/voices">
                    Explore Voice Library
                    <ArrowUpRight className="size-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Locales & Close */}
        <section className="border-t border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 space-y-12">
            <div className="max-w-xl space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Sixteen locales, natural inflection
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Synthesize scripts across international languages with
                consistent timbre and clean pronunciation.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {SUPPORTED_LOCALES.map((code) => (
                <div
                  key={code}
                  className="studio-panel rounded-lg py-3 px-3 text-center font-mono text-xs font-medium text-foreground"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Ready when your script is.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the studio workspace to browse voices or generate your
                  first track.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm whitespace-nowrap shrink-0"
              >
                <Link href="/app">Enter Resonance</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Resonance Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link
              href="/app/voices"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Voice Library
            </Link>
            <Link
              href="/app/text-to-speech"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Text to Speech
            </Link>
            <Link
              href="/app/voice-cloning"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Voice Cloning
            </Link>
            <Link
              href="/app/support"
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
