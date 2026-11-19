"use client";

import {
  ArrowUpRightIcon,
  GlobeHemisphereWestIcon,
  MicrophoneStageIcon,
  PlayIcon,
  PulseIcon,
  SquaresFourIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserGreeting from "@/components/dashboard/UserGreeting";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

const TARGET_LOCALES = [
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
];

export default function DashboardOverviewPage() {
  const trigger = useHaptics();
  const router = useRouter();

  const numberOfUserGenerations = useQuery(api.voice.getNumberOfGenerations);
  const numberOfUserVoices = useQuery(api.voice.getNumberOfUserVoices);
  const topVoices = useQuery(api.voice.getTopVoices);
  const currentUser = useQuery(api.users.getCurrentUser);

  const isRegistryLoading = topVoices === undefined;
  const showcaseVoices: Doc<"voices">[] = (topVoices as Doc<"voices">[]) || [];

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      trigger("success");
      toast.success("Voice loaded into Text to Speech");
      router.push("/app/text-to-speech");
    }
  };

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8 animate-editorial-enter">
        {/* Studio Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
              <UserGreeting />
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Launch a script session, audition speakers, or capture a new voice
              clone from your workspace.
            </p>
          </div>

          {currentUser && (
            <div className="studio-panel rounded-xl px-4 py-2.5 flex items-center gap-3 w-fit shrink-0">
              <span className="text-xs text-muted-foreground font-medium">
                Character Credits
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums accent-ink">
                {currentUser.credits.toLocaleString()}
              </span>
            </div>
          )}
        </header>

        {/* Asymmetric Studio Launcher (replaces generic 3-equal-card row) */}
        <section
          aria-label="Workspaces"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        >
          <Link
            href="/app/text-to-speech"
            className="lg:col-span-7 rounded-2xl border border-primary/25 bg-primary/[0.06] dark:bg-primary/[0.12] hover:border-primary/50 p-6 sm:p-7 flex flex-col justify-between gap-8 group active:scale-[0.99] transition-[border-color,background-color,transform] duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <WaveformIcon weight="fill" className="size-5" />
              </div>
              <ArrowUpRightIcon className="size-5 accent-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Text to Speech
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[46ch]">
                Draft plain narration or structured SSML scripts, dial speaking
                rate and temperature, and export clean studio audio.
              </p>
            </div>

            <div className="pt-4 border-t border-primary/15 flex items-center justify-between text-xs font-medium accent-ink">
              <span>Open Script Editor</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                3 Inworld models
              </span>
            </div>
          </Link>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link
              href="/app/voices"
              className="studio-card rounded-2xl p-5 flex items-start justify-between gap-4 group active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200 shrink-0">
                  <SquaresFourIcon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Voice Library
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Search curated speakers and cloned profiles across 16
                    locales.
                  </p>
                </div>
              </div>
              <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform] shrink-0 mt-1" />
            </Link>

            <Link
              href="/app/voice-cloning"
              className="studio-card rounded-2xl p-5 flex items-start justify-between gap-4 group active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200 shrink-0">
                  <MicrophoneStageIcon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Voice Cloning
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Record or upload a 5 to 15 second sample for a reusable
                    voice.
                  </p>
                </div>
              </div>
              <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform] shrink-0 mt-1" />
            </Link>
          </div>
        </section>

        {/* Featured Voices & Activity Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Featured Voice Styles */}
          <section className="lg:col-span-8 studio-panel rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary/45">
              <h2 className="text-sm font-semibold text-foreground">
                Featured Voice Styles
              </h2>
              <Link
                href="/app/voices"
                className="text-xs font-medium accent-ink hover:underline"
              >
                View full library
              </Link>
            </div>

            {isRegistryLoading ? (
              <div className="divide-y divide-border">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:px-5 flex items-center gap-4"
                  >
                    <Skeleton className="size-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : showcaseVoices.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No voice profiles are available right now.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {showcaseVoices.map((voice) => (
                  <button
                    key={voice._id}
                    type="button"
                    onClick={() =>
                      voice.inworldVoiceId &&
                      handleUseVoice(voice.inworldVoiceId)
                    }
                    className="w-full text-left px-5 py-4 hover:bg-secondary/55 transition-colors flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="size-10 rounded-xl border border-border bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
                      <PlayIcon weight="fill" className="size-4 ml-0.5" />
                    </div>

                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {voice.displayName}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {voice.langCode || "EN-US"}
                        </div>
                      </div>

                      <div className="hidden sm:block text-xs text-muted-foreground truncate">
                        {voice.tags?.length
                          ? voice.tags.join(", ")
                          : "General narration"}
                      </div>

                      <div className="flex sm:justify-end items-center gap-1.5 text-xs text-muted-foreground font-mono tabular-nums">
                        <PulseIcon className="size-3.5" />
                        <span>
                          {(voice.playCount || 0).toLocaleString()} plays
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Studio Activity & Supported Regions */}
          <aside className="lg:col-span-4 space-y-6">
            <section className="studio-panel rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground pb-3 border-b border-border">
                Studio Activity
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="rounded-xl border border-border bg-secondary/45 p-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Total Generations
                    </div>
                    {numberOfUserGenerations === undefined ? (
                      <Skeleton className="h-8 w-14" />
                    ) : (
                      <div className="text-2xl font-semibold tabular-nums text-foreground">
                        {numberOfUserGenerations.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Audio clips
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-secondary/45 p-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Saved Voices
                    </div>
                    {numberOfUserVoices === undefined ? (
                      <Skeleton className="h-8 w-14" />
                    ) : (
                      <div className="text-2xl font-semibold tabular-nums text-foreground">
                        {numberOfUserVoices.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Profiles
                  </span>
                </div>
              </div>
            </section>

            <section className="studio-panel rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <GlobeHemisphereWestIcon className="size-4 text-muted-foreground" />
                  Supported Locales
                </h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {TARGET_LOCALES.length}+
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {TARGET_LOCALES.map((lang) => (
                  <span
                    key={lang}
                    className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border bg-secondary/50 text-muted-foreground"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
