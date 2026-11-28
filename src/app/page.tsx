import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeSimpleIcon,
  GlobeHemisphereWestIcon,
  MicrophoneStageIcon,
  SlidersHorizontalIcon,
  WaveformIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { HeroAudioAudition } from "@/components/home/HeroAudioAudition";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const SUPPORTED_LOCALES = [
  { code: "EN-US", label: "English" },
  { code: "ES-ES", label: "Spanish" },
  { code: "FR-FR", label: "French" },
  { code: "DE-DE", label: "German" },
  { code: "JA-JP", label: "Japanese" },
  { code: "KO-KR", label: "Korean" },
  { code: "ZH-CN", label: "Chinese" },
  { code: "HI-IN", label: "Hindi" },
  { code: "AR-SA", label: "Arabic" },
  { code: "PT-BR", label: "Portuguese" },
  { code: "IT-IT", label: "Italian" },
  { code: "PL-PL", label: "Polish" },
  { code: "NL-NL", label: "Dutch" },
  { code: "RU-RU", label: "Russian" },
  { code: "HE-IL", label: "Hebrew" },
  { code: "AUTO", label: "Auto-detect" },
];

const INWORLD_MODELS = [
  { name: "inworld-tts-2", note: "Flagship natural prosody" },
  { name: "inworld-tts-1.5-max", note: "Extended expressive range" },
  { name: "inworld-tts-1.5-mini", note: "Low-latency drafts" },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Single-line navigation (64px) */}
      <header className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.png"
              alt="Resonance"
              width={28}
              height={28}
              className="size-7 object-contain dark:invert-0 invert transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Resonance
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground"
          >
            <Link
              href="/app/voices"
              className="hover:text-foreground transition-colors duration-150 whitespace-nowrap"
            >
              Voices
            </Link>
            <Link
              href="/app/text-to-speech"
              className="hover:text-foreground transition-colors duration-150 whitespace-nowrap"
            >
              Text to Speech
            </Link>
            <Link
              href="/app/voice-cloning"
              className="hover:text-foreground transition-colors duration-150 whitespace-nowrap"
            >
              Voice Cloning
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 whitespace-nowrap"
            >
              Sign in
            </Link>
            <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
            <Button
              asChild
              variant="outline"
              className="rounded-full h-9 px-4 sm:px-5 border-border bg-card hover:bg-accent text-foreground font-medium text-xs sm:text-sm whitespace-nowrap active:scale-[0.98] transition-transform"
            >
              <Link href="/app">
                Open Studio
                <ArrowUpRightIcon className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: Swiss Editorial Header + Wide Floating Interactive Stage */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 lg:pt-12 pb-14 lg:pb-20 space-y-8 lg:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <h1 className="animate-editorial-enter text-4xl sm:text-5xl lg:text-[3.85rem] font-semibold tracking-[-0.035em] leading-[1.06] text-foreground">
                Voice Anything
                <span className="block text-muted-foreground/75">
                  with studio clarity.
                </span>
              </h1>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:items-center justify-between gap-5 lg:pb-1.5 animate-editorial-enter animate-stagger-1">
              <div className="flex items-start gap-4 max-w-[30ch]">
                <span
                  aria-hidden="true"
                  className="hidden sm:inline-block text-2xl font-light text-border select-none leading-none mt-0.5"
                >
                  /
                </span>
                <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                  Write scripts, audition natural speakers, and export clean
                  narration in seconds.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-full h-11 px-6 bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] font-medium text-sm whitespace-nowrap shrink-0 group transition-[background-color,transform]"
              >
                <Link href="/app">
                  Open Studio
                  <ArrowRightIcon className="size-4 ml-1.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Wide Rounded Visual Stage with Floating Interactive Composer */}
          <div className="animate-editorial-enter animate-stagger-2 relative overflow-hidden rounded-[28px] border border-border/80 canvas-dot-grid px-4 py-10 sm:px-8 sm:py-16 lg:py-20">
            <Image
              src="/images/resonance-editorial-art.jpg"
              alt="Geometric acoustic soundwaves and minimalist studio microphone illustration"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center opacity-55 dark:opacity-25 pointer-events-none select-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/30 to-background/45 dark:from-background/40 dark:via-background/60 dark:to-background/75 pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center justify-center gap-5">
              <HeroAudioAudition />

              <p className="text-xs sm:text-sm text-foreground/80 font-medium text-center">
                Need a custom speaker?{" "}
                <Link
                  href="/app/voice-cloning"
                  className="underline decoration-primary/60 underline-offset-4 hover:text-primary transition-colors"
                >
                  Clone a voice
                </Link>{" "}
                from a 15-second clip.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Tactile Dot-Grid Workspace Showcase */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-14">
          <ScrollReveal className="rounded-[28px] border border-border/80 canvas-dot-grid px-5 py-14 sm:px-10 sm:py-20 space-y-12 lg:space-y-16">
            <div className="max-w-2xl mx-auto text-center space-y-5">
              <div className="mx-auto size-12 rounded-2xl tactile-tile flex items-center justify-center">
                <WaveformIcon weight="fill" className="size-6 text-primary" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.08] text-foreground">
                Write, direct, and export
                <span className="block text-muted-foreground/75">
                  all in one place.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[46ch] mx-auto">
                Keep your speakers, SSML scripts, and audio renders inside one
                fast studio workspace.
              </p>

              <div className="pt-1">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-11 px-7 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-medium text-sm whitespace-nowrap transition-[background-color,transform]"
                >
                  <Link href="/app/text-to-speech">Try Text to Speech</Link>
                </Button>
              </div>
            </div>

            {/* Asymmetric 4-Tile Tactile Grid (Exact 4 cells, varied visual treatments) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Tile 1: Voice Library (7 cols) */}
              <Link
                href="/app/voices"
                className="md:col-span-7 tactile-tile rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-8 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2.5 max-w-md">
                    <div className="size-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200">
                      <WaveformIcon className="size-5" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      Voice Library
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Filter curated speakers and your cloned profiles by locale
                      or tone, then send any voice straight to the editor.
                    </p>
                  </div>
                  <ArrowUpRightIcon className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform] duration-200 shrink-0" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["EN-US", "JA-JP", "ES-ES", "FR-FR"].map((code) => (
                    <div
                      key={code}
                      className="rounded-xl border border-border/80 bg-secondary/70 px-3 py-2.5 flex items-center justify-between font-mono text-xs text-foreground"
                    >
                      <span>{code}</span>
                      <GlobeHemisphereWestIcon className="size-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </Link>

              {/* Tile 2: Photographic Cloning Card (5 cols) */}
              <Link
                href="/app/voice-cloning"
                className="md:col-span-5 tactile-tile rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="overflow-hidden border-b border-border/80 bg-secondary">
                  <Image
                    src="/images/studio-booth-hero.jpg"
                    alt="Studio condenser microphone on a minimalist concrete desk"
                    width={960}
                    height={640}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      5 to 15 Second Cloning
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Record directly in the browser or upload WAV and MP3
                      samples.
                    </p>
                  </div>
                  <MicrophoneStageIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>

              {/* Tile 3: Structured SSML Card (5 cols) */}
              <div className="md:col-span-5 tactile-tile rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Structured SSML Mode
                  </h3>
                  <CodeSimpleIcon className="size-4 text-muted-foreground" />
                </div>

                <pre className="rounded-xl border border-border/80 bg-secondary/75 p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
                  <code>
                    <span className="accent-ink">&lt;speak&gt;</span>
                    {"\n  Keep the opening measured."}
                    {"\n  "}
                    <span className="accent-ink">
                      &lt;break time=&quot;350ms&quot; /&gt;
                    </span>
                    {"\n  Then land the final line."}
                    {"\n"}
                    <span className="accent-ink">&lt;/speak&gt;</span>
                  </code>
                </pre>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Switch to line-numbered SSML editing whenever product tours or
                  films need exact pauses.
                </p>
              </div>

              {/* Tile 4: Acoustic Tuning & Models (7 cols, cobalt-tinted visual anchor) */}
              <div className="md:col-span-7 rounded-2xl border border-primary/20 bg-primary/[0.05] dark:bg-primary/[0.11] p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-between">
                <div className="flex flex-col justify-between gap-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      Acoustic Tuning
                    </h3>
                    <SlidersHorizontalIcon className="size-4 text-primary" />
                  </div>

                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-border/80 bg-card/90 px-4 py-3 flex items-baseline justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Speaking Rate
                      </span>
                      <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                        0.5x - 1.5x
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-card/90 px-4 py-3 flex items-baseline justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Temperature
                      </span>
                      <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                        0.00 - 1.00
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 sm:border-l sm:border-primary/15 sm:pl-6">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Three Inworld Models
                  </h3>

                  <ul className="space-y-3">
                    {INWORLD_MODELS.map((m) => (
                      <li
                        key={m.name}
                        className="pb-2.5 border-b border-primary/15 last:border-b-0 last:pb-0"
                      >
                        <div className="font-mono text-xs font-semibold accent-ink">
                          {m.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {m.note}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Section 3: Sixteen Locales Ribbon (Single Marquee) */}
        <section className="py-14 lg:py-20 overflow-hidden">
          <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-8">
            <div className="max-w-xl space-y-2.5">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
                Sixteen locales, natural inflection
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Synthesize narration across international languages with steady
                timbre and clear pronunciation.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative py-4 border-y border-border/70 bg-card/60 overflow-hidden">
            <div className="flex w-max gap-3 animate-locale-marquee">
              {[...SUPPORTED_LOCALES, ...SUPPORTED_LOCALES].map((loc, idx) => (
                <div
                  key={`${loc.code}-${idx}`}
                  className="rounded-full border border-border bg-background px-4 py-2 flex items-center gap-2.5 shrink-0"
                >
                  <span className="font-mono text-xs font-semibold accent-ink">
                    {loc.code}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {loc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Editorial Closing Band */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 lg:pb-24">
          <ScrollReveal>
            <div className="tactile-tile rounded-[28px] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground">
                  Ready when your script is.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-[44ch]">
                  Open the workspace to browse voices or generate your first
                  track.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-11 px-6 border-border bg-background hover:bg-accent text-foreground font-medium text-sm whitespace-nowrap"
                >
                  <Link href="/sign-up">Create account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-11 px-7 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-medium text-sm whitespace-nowrap transition-[background-color,transform]"
                >
                  <Link href="/app">Open Studio</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
