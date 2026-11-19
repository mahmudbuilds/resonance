import {
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

const WORKFLOW_CAPABILITIES = [
  {
    title: "Record or upload",
    detail:
      "Capture 5 to 15 seconds in your browser or drop in MP3 and WAV files.",
  },
  {
    title: "Calibrate profile",
    detail: "Tag language, tone, and notes so your speaker stays organized.",
  },
  {
    title: "Narrate scripts",
    detail: "Switch between plain text and SSML tags, then export clean audio.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Single-line navigation (64px) */}
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.png"
              alt="Resonance"
              width={32}
              height={32}
              className="size-8 object-contain dark:invert-0 invert transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
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

          <div className="flex items-center gap-2.5 shrink-0">
            <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
            <Button
              asChild
              className="rounded-full h-9 px-5 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs sm:text-sm whitespace-nowrap active:scale-[0.98] transition-transform"
            >
              <Link href="/app">Open Studio</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: Asymmetric 7+5 Split fitting cleanly above the fold */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-14 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="animate-editorial-enter text-4xl sm:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.035em] leading-[1.03] text-foreground max-w-xl">
                Studio voices, without the booth.
              </h1>

              <p className="animate-editorial-enter animate-stagger-1 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[44ch]">
                Write a script, audition natural speakers, and export clean
                narration in seconds.
              </p>

              <div className="animate-editorial-enter animate-stagger-2 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-medium text-sm whitespace-nowrap group transition-[background-color,transform]"
                >
                  <Link href="/app/voice-cloning">
                    Clone a Voice
                    <ArrowUpRightIcon className="size-4 ml-1.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-7 border-border bg-card hover:bg-accent active:scale-[0.98] text-foreground font-medium text-sm whitespace-nowrap transition-[background-color,transform]"
                >
                  <Link href="/app/text-to-speech">Try Text to Speech</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-card group">
                <Image
                  src="/images/studio-booth-hero.jpg"
                  alt="Scandinavian vocal studio with a brushed silver condenser microphone over a concrete desk"
                  width={1200}
                  height={900}
                  priority
                  className="w-full aspect-[4/3] object-cover animate-hero-media transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              </div>

              <div className="animate-editorial-enter animate-stagger-3">
                <HeroAudioAudition />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Asymmetric 5-Cell Bento Architecture */}
        <section className="border-t border-border">
          <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 space-y-10">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground leading-tight">
                Engineered for spoken clarity
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Every workspace connects directly into your private library and
                real-time generation history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
              {/* Cell 1: Voice Library (7 cols) */}
              <Link
                href="/app/voices"
                className="md:col-span-7 studio-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-8 group"
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
                      or tag, then hand off any voice straight into the editor.
                    </p>
                  </div>
                  <ArrowUpRightIcon className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform] duration-200 shrink-0" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {["EN-US", "JA-JP", "ES-ES", "FR-FR"].map((code) => (
                    <div
                      key={code}
                      className="rounded-xl border border-border bg-secondary/60 px-3 py-2.5 flex items-center justify-between font-mono text-xs text-foreground"
                    >
                      <span>{code}</span>
                      <GlobeHemisphereWestIcon className="size-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </Link>

              {/* Cell 2: Photographic Voice Cloning Tile (5 cols) */}
              <Link
                href="/app/voice-cloning"
                className="md:col-span-5 studio-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="overflow-hidden border-b border-border bg-secondary">
                  <Image
                    src="/images/studio-headphones-auth.jpg"
                    alt="Open-back studio reference headphones on a dark basalt desk"
                    width={960}
                    height={720}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      5 to 15 Second Cloning
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Record with guided calibration prompts or upload an
                      existing recording.
                    </p>
                  </div>
                  <MicrophoneStageIcon className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>

              {/* Cell 3: SSML Markup (5 cols) */}
              <div className="md:col-span-5 studio-panel rounded-2xl p-6 flex flex-col justify-between gap-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Structured SSML Mode
                  </h3>
                  <CodeSimpleIcon className="size-4 text-muted-foreground" />
                </div>

                <pre className="rounded-xl border border-border bg-secondary/70 p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
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
                  Toggle line-numbered SSML editing when documentaries or
                  product tours require exact pauses.
                </p>
              </div>

              {/* Cell 4: Cadence & Temperature (4 cols) */}
              <div className="md:col-span-4 studio-panel rounded-2xl p-6 flex flex-col justify-between gap-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Acoustic Tuning
                  </h3>
                  <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Speaking Rate
                    </span>
                    <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                      0.5x - 1.5x
                    </span>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Temperature
                    </span>
                    <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                      0.00 - 1.00
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dial pacing and vocal expressiveness per take without
                  rewriting your script.
                </p>
              </div>

              {/* Cell 5: Inworld Models (3 cols, cobalt-tinted accent surface) */}
              <div className="md:col-span-3 rounded-2xl border border-primary/25 bg-primary/[0.06] dark:bg-primary/[0.12] p-6 flex flex-col justify-between gap-5">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Three TTS Models
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
          </ScrollReveal>
        </section>

        {/* Section 3: Studio Hardware Split Showcase */}
        <section className="border-t border-border bg-secondary/45">
          <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-border bg-card group">
                <Image
                  src="/images/studio-preamp-detail.jpg"
                  alt="Matte charcoal anodized audio preamp with rotary gain knobs and cobalt indicator on grey limestone"
                  width={1280}
                  height={720}
                  className="w-full aspect-video object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground leading-tight">
                One clean take, reusable across every script
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Keep every voice profile and exported track inside your isolated
                workspace. Move from microphone calibration to finished audio
                without leaving the browser.
              </p>

              <div className="space-y-4 pt-2 border-t border-border">
                {WORKFLOW_CAPABILITIES.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full h-11 px-6 border-border bg-card hover:bg-accent text-foreground font-medium text-sm whitespace-nowrap group"
                >
                  <Link href="/app/voices">
                    Explore Voice Library
                    <ArrowUpRightIcon className="size-4 ml-1.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Section 4: Kinetic Locale Ribbon (Single Marquee) & Closing CTA */}
        <section className="border-t border-border overflow-hidden">
          <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 lg:pt-24 pb-10">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
                Sixteen locales, natural inflection
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Synthesize narration across international languages with steady
                timbre and clear pronunciation.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative py-4 border-y border-border bg-card/60 overflow-hidden">
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

          <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
            <div className="studio-panel rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
                  Ready when your script is.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Open the workspace to browse voices or generate your first
                  track.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-medium text-sm whitespace-nowrap shrink-0 transition-[background-color,transform]"
              >
                <Link href="/app">Open Studio</Link>
              </Button>
            </div>
          </ScrollReveal>
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
