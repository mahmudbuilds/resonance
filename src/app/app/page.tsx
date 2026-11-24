"use client";

import {
  ArrowUpRightIcon,
  CoinsIcon,
  DotsThreeCircleIcon,
  GlobeHemisphereWestIcon,
  MicrophoneStageIcon,
  PlayIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface ChartDatum {
  month: string;
  generations: number;
  charsUnits: number;
  rawChars: number;
}

function ActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg flex items-center gap-2 tabular-nums">
      <span>{label}</span>
      <span className="opacity-50">•</span>
      <span>{item.generations} clips</span>
      {item.rawChars > 0 && (
        <>
          <span className="opacity-50">•</span>
          <span>{formatCompact(item.rawChars)} chars</span>
        </>
      )}
    </div>
  );
}

export default function DashboardOverviewPage() {
  const trigger = useHaptics();
  const router = useRouter();
  const [localeFilter, setLocaleFilter] = useState<string>("ALL");

  const numberOfUserGenerations = useQuery(api.voice.getNumberOfGenerations);
  const numberOfUserVoices = useQuery(api.voice.getNumberOfUserVoices);
  const clonedVoices = useQuery(api.voice.listClonedVoices);
  const topVoices = useQuery(api.voice.getTopVoices);
  const currentUser = useQuery(api.users.getCurrentUser);
  const userGenerations = useQuery(api.inworld.listUserGenerations);

  const isRegistryLoading = topVoices === undefined;
  const showcaseVoices: Doc<"voices">[] = (topVoices as Doc<"voices">[]) || [];

  const availableLocales = useMemo(() => {
    const set = new Set<string>();
    for (const v of showcaseVoices) {
      if (v.langCode) set.add(v.langCode);
    }
    return Array.from(set).sort();
  }, [showcaseVoices]);

  const filteredVoices = useMemo(() => {
    if (localeFilter === "ALL") return showcaseVoices;
    return showcaseVoices.filter(
      (v) => (v.langCode || "EN-US") === localeFilter,
    );
  }, [showcaseVoices, localeFilter]);

  const chartData = useMemo<ChartDatum[]>(() => {
    const buckets: ChartDatum[] = MONTHS.map((month) => ({
      month,
      generations: 0,
      charsUnits: 0,
      rawChars: 0,
    }));

    if (userGenerations?.length) {
      for (const gen of userGenerations) {
        const d = new Date(gen._creationTime);
        const m = d.getMonth();
        buckets[m].generations += 1;
        const chars = gen.prompt?.length || 0;
        buckets[m].rawChars += chars;
        buckets[m].charsUnits = Math.max(
          buckets[m].charsUnits,
          Math.ceil(buckets[m].rawChars / 120),
        );
      }
    }
    return buckets;
  }, [userGenerations]);

  const recentGenerations = useMemo(() => {
    if (!userGenerations?.length) return [];
    return [...userGenerations]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 3);
  }, [userGenerations]);

  const hasChartActivity = (userGenerations?.length || 0) > 0;

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      trigger("success");
      toast.success("Voice loaded into Text to Speech");
      router.push("/app/text-to-speech");
    }
  };

  const quickStats = [
    {
      label: "Credits Left",
      value:
        currentUser === undefined
          ? null
          : formatCompact(currentUser?.credits ?? 0),
      icon: CoinsIcon,
      href: "/app/settings",
      featured: false,
    },
    {
      label: "Generations",
      value:
        numberOfUserGenerations === undefined
          ? null
          : formatCompact(numberOfUserGenerations),
      icon: WaveformIcon,
      href: "/app/text-to-speech",
      featured: false,
    },
    {
      label: "Saved Voices",
      value:
        numberOfUserVoices === undefined
          ? null
          : formatCompact(numberOfUserVoices),
      icon: SquaresFourIcon,
      href: "/app/voices",
      featured: true,
    },
    {
      label: "Cloned Voices",
      value:
        clonedVoices === undefined ? null : formatCompact(clonedVoices.length),
      icon: MicrophoneStageIcon,
      href: "/app/voice-cloning",
      featured: false,
    },
    {
      label: "TTS Models",
      value: "3",
      icon: SlidersHorizontalIcon,
      href: "/app/text-to-speech",
      featured: false,
    },
    {
      label: "Locales",
      value: "16+",
      icon: GlobeHemisphereWestIcon,
      href: "/app/voices",
      featured: false,
    },
  ];

  return (
    <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-6 animate-editorial-enter">
        {/* ZONE 1: Quick Stats Strip */}
        <section
          aria-label="Quick Stats"
          className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-6"
        >
          <div className="xl:w-[172px] shrink-0 space-y-1.5">
            <h1 className="text-[22px] font-bold tracking-[-0.03em] text-foreground">
              Quick Stats
            </h1>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Your vocal studio snapshot across scripts and voices.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pb-2">
            {quickStats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="bento-capsule relative flex flex-col items-center justify-center text-center px-3 pt-5 pb-6 group"
              >
                <div
                  className={`mb-3.5 flex size-11 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${
                    stat.featured
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground/80"
                  }`}
                >
                  <stat.icon
                    weight={stat.featured ? "fill" : "regular"}
                    className="size-[19px]"
                  />
                </div>

                {stat.value === null ? (
                  <Skeleton className="h-6 w-12 rounded-full mb-1.5" />
                ) : (
                  <div className="text-[21px] font-bold tracking-[-0.03em] tabular-nums text-foreground leading-tight">
                    {stat.value}
                  </div>
                )}

                <div className="mt-1 text-[11.5px] font-medium text-muted-foreground leading-snug">
                  {stat.label}
                </div>

                {stat.featured && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex size-7 items-center justify-center rounded-full bg-card text-foreground shadow-[0_4px_12px_rgba(13,13,15,0.12)] border border-border transition-transform duration-200 group-hover:translate-y-[-2px]"
                  >
                    <ArrowUpRightIcon weight="bold" className="size-3.5" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* ZONE 2: Statistics Chart + Recent Activity / Quick Launch */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Statistics Pill-Bar Chart */}
          <div className="bento-card xl:col-span-7 p-6 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
                  Studio Statistics
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly speech renders and character output
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11.5px] font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  Renders
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/30" />
                  Volume
                </span>
              </div>
            </div>

            <div className="relative h-[225px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 4, left: -24, bottom: 0 }}
                  barGap={3}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--studio-row)", radius: 10 }}
                    content={<ActivityTooltip />}
                  />
                  <Bar
                    dataKey="generations"
                    fill="var(--primary)"
                    radius={[99, 99, 99, 99]}
                    barSize={7}
                  />
                  <Bar
                    dataKey="charsUnits"
                    fill="var(--muted-foreground)"
                    fillOpacity={0.28}
                    radius={[99, 99, 99, 99]}
                    barSize={7}
                  />
                </BarChart>
              </ResponsiveContainer>

              {userGenerations !== undefined && !hasChartActivity && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/75 backdrop-blur-[1px] rounded-2xl text-center px-4">
                  <p className="text-sm font-semibold text-foreground">
                    No renders logged yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
                    Generate your first speech clip to track monthly activity
                    here.
                  </p>
                  <Link
                    href="/app/text-to-speech"
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <PlusIcon weight="bold" className="size-3.5" />
                    Start Synthesizing
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Card: Recent Renders or Quick Launchers */}
          <div className="bento-card xl:col-span-5 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
                {recentGenerations.length > 0
                  ? "Recent Renders"
                  : "Quick Launch"}
              </h2>
              <Link
                href="/app/text-to-speech"
                aria-label="Open Text to Speech"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <DotsThreeCircleIcon className="size-6" />
              </Link>
            </div>

            {userGenerations === undefined ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3.5 py-2">
                    <Skeleton className="size-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-32 rounded-full" />
                      <Skeleton className="h-3 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentGenerations.length > 0 ? (
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {recentGenerations.map((gen) => (
                  <Link
                    key={gen._id}
                    href="/app/text-to-speech"
                    className="group flex items-center justify-between gap-3 rounded-2xl p-2 -mx-2 hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <WaveformIcon weight="fill" className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-foreground truncate">
                          {gen.prompt || "Untitled audio clip"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                          {format(new Date(gen._creationTime), "MMM dd HH:mm")}{" "}
                          • {gen.inworldVoiceId}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-foreground/80 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {gen.format?.toUpperCase() || "MP3"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {[
                  {
                    title: "Text to Speech",
                    subtitle: "Plain scripts & SSML editor",
                    badge: "Open",
                    href: "/app/text-to-speech",
                    icon: WaveformIcon,
                  },
                  {
                    title: "Voice Cloning",
                    subtitle: "5–15s sample to custom voice",
                    badge: "Clone",
                    href: "/app/voice-cloning",
                    icon: MicrophoneStageIcon,
                  },
                  {
                    title: "Voice Library",
                    subtitle: "Curated speakers & history",
                    badge: "Browse",
                    href: "/app/voices",
                    icon: SquaresFourIcon,
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between gap-3 rounded-2xl p-2 -mx-2 hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon weight="fill" className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-foreground truncate">
                          {item.title}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground mt-0.5 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-secondary px-3.5 py-1 text-[11px] font-semibold text-foreground/80 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ZONE 3: Full-Width Soft-Row Table (Featured Voices) */}
        <section className="bento-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
                Featured Voices
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any speaker to load directly into the synthesis desk
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Select value={localeFilter} onValueChange={setLocaleFilter}>
                <SelectTrigger className="h-9 w-[132px] rounded-full border-border bg-card px-4 text-xs font-medium text-foreground shadow-none">
                  <SelectValue placeholder="Locale" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="ALL">All Locales</SelectItem>
                  {availableLocales.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Link
                href="/app/text-to-speech"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <PlusIcon weight="bold" className="size-3.5" />
                New Speech
              </Link>
            </div>
          </div>

          {/* Column Labels */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2.5 text-[11.5px] font-medium text-muted-foreground">
            <div className="col-span-4">Voice Profile</div>
            <div className="col-span-2">Locale</div>
            <div className="col-span-3">Style Tags</div>
            <div className="col-span-2">Usage</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {isRegistryLoading ? (
            <div className="space-y-2.5">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="bento-row px-4 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredVoices.length === 0 ? (
            <div className="bento-row py-10 text-center text-sm text-muted-foreground">
              No voice profiles match the selected locale.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredVoices.map((voice) => (
                <button
                  key={voice._id}
                  type="button"
                  onClick={() =>
                    voice.inworldVoiceId && handleUseVoice(voice.inworldVoiceId)
                  }
                  className="bento-row w-full text-left px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center group cursor-pointer"
                >
                  <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <PlayIcon weight="fill" className="size-3.5 ml-0.5" />
                    </span>
                    <span className="text-[13.5px] font-semibold text-foreground truncate">
                      {voice.displayName}
                    </span>
                  </div>

                  <div className="md:col-span-2 flex items-center">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      {voice.langCode || "EN-US"}
                    </span>
                  </div>

                  <div className="md:col-span-3 text-xs text-muted-foreground truncate">
                    {voice.tags?.length
                      ? voice.tags.slice(0, 3).join(", ")
                      : "General narration"}
                  </div>

                  <div className="md:col-span-2">
                    <span className="inline-flex items-center rounded-full bg-card px-3 py-1 text-[11px] font-semibold tabular-nums text-foreground/80 shadow-2xs">
                      {(voice.playCount || 0).toLocaleString()} plays
                    </span>
                  </div>

                  <div className="md:col-span-1 flex md:justify-end">
                    <span className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowUpRightIcon weight="bold" className="size-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
