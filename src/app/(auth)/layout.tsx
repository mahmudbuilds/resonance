import {
  ArrowLeftIcon,
  GlobeHemisphereWestIcon,
  MicrophoneStageIcon,
  WaveformIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";

const STUDIO_HIGHLIGHTS = [
  {
    icon: WaveformIcon,
    label: "48kHz Audio",
    detail: "Broadcast clarity",
  },
  {
    icon: MicrophoneStageIcon,
    label: "5-15s Cloning",
    detail: "Browser capture",
  },
  {
    icon: GlobeHemisphereWestIcon,
    label: "16 Locales",
    detail: "Natural inflection",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground">
      {/* Left Framed Tactile Studio Showcase */}
      <aside className="hidden lg:flex lg:col-span-6 p-4 xl:p-5">
        <div className="w-full rounded-[28px] border border-border/80 canvas-dot-grid p-8 xl:p-12 flex flex-col justify-between relative overflow-hidden">
          <Link href="/" className="flex items-center gap-2.5 w-fit group z-10">
            <Image
              src="/logo.png"
              alt="Resonance"
              width={28}
              height={28}
              className="size-7 object-contain dark:invert-0 invert transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Resonance
            </span>
          </Link>

          <div className="space-y-7 max-w-lg my-auto py-8 z-10">
            <div className="space-y-2.5">
              <h1 className="text-3xl xl:text-4xl font-semibold tracking-[-0.035em] leading-[1.1] text-foreground">
                Your vocal studio,
                <span className="block text-muted-foreground/75">
                  ready when you are.
                </span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[42ch]">
                Access your custom voice profiles, structured SSML script
                editor, and private generation history.
              </p>
            </div>

            <div className="tactile-tile rounded-2xl overflow-hidden bg-card">
              <Image
                src="/images/resonance-editorial-art.jpg"
                alt="Geometric acoustic soundwaves and studio microphone illustration"
                width={1200}
                height={900}
                priority
                className="w-full aspect-[16/10] object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {STUDIO_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="tactile-tile rounded-xl p-3.5 space-y-1.5"
                  >
                    <Icon className="size-4 text-primary" />
                    <div className="text-xs font-semibold text-foreground">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground z-10">
            <span>© 2026 Resonance Inc.</span>
            <Link
              href="/app/support"
              className="hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </aside>

      {/* Right Auth Column */}
      <main className="lg:col-span-6 flex flex-col min-h-[100dvh] px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeftIcon className="size-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Back to Resonance</span>
          </Link>

          <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="w-full max-w-[420px] space-y-6">
            <Link
              href="/"
              className="flex lg:hidden items-center justify-center gap-2.5"
            >
              <Image
                src="/logo.png"
                alt="Resonance"
                width={28}
                height={28}
                className="size-7 object-contain dark:invert-0 invert"
              />
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                Resonance
              </span>
            </Link>

            <div className="w-full flex justify-center animate-editorial-enter">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
