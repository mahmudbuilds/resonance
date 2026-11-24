"use client";

import {
  ClockCounterClockwiseIcon,
  FunnelSimpleIcon,
  GlobeHemisphereWestIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  MusicNotesSimpleIcon,
  PlayIcon,
  PlusIcon,
  PulseIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaveformPlayer } from "@/components/waveform-player/WaveformPlayer";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

const NO_DESCRIPTION = "No vocal description available for this voice.";

export default function VoicesPage() {
  const trigger = useHaptics();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("registry");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const voices = useQuery(api.voice.getUserVoices);
  const generations = useQuery(api.inworld.listUserGenerations);

  const voicesList: Doc<"voices">[] = voices ?? [];
  const historyList: Doc<"generations">[] = useMemo(
    () => (generations ?? []).filter((g) => !g.isPreview),
    [generations],
  );

  const voiceNameByInworldId = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of voicesList) {
      if (v.inworldVoiceId) {
        map.set(v.inworldVoiceId, v.displayName || "Unnamed voice");
      }
    }
    return map;
  }, [voicesList]);

  const filteredVoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return voicesList.filter((voice) => {
      const name = voice.displayName ?? "Unnamed voice";
      const desc = voice.description ?? "";
      const searchMatch =
        q === "" ||
        name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);

      const accent = voice.langCode ?? "";
      const localeMatch =
        selectedLocale === "all" ||
        accent.toLowerCase().startsWith(selectedLocale.toLowerCase());

      const isCloned = !voice.isPublic;
      const classMatch =
        selectedClass === "all" ||
        (selectedClass === "public" && !isCloned) ||
        (selectedClass === "cloned" && isCloned);

      return searchMatch && localeMatch && classMatch;
    });
  }, [voicesList, searchQuery, selectedLocale, selectedClass]);

  const handleUseVoice = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(id));
      trigger("success");
      toast.success("Voice profile loaded into Text to Speech");
      router.push("/app/text-to-speech");
    }
  };

  return (
    <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-6 animate-editorial-enter">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-foreground">
              Voice Library
            </h1>
            <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
              Browse studio speakers and your cloned profiles, or replay past
              audio generations.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 text-xs font-semibold shrink-0 w-full sm:w-auto"
          >
            <Link href="/app/voice-cloning">
              <PlusIcon weight="bold" className="size-3.5 mr-1.5" />
              Clone Custom Voice
            </Link>
          </Button>
        </header>

        {/* Tabs & View Switcher */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="bg-card p-1.5 rounded-full h-11 w-full sm:w-auto shadow-xs border-0">
              <TabsTrigger
                value="registry"
                className="flex-1 sm:flex-initial rounded-full px-5 h-8 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs gap-2 transition-all"
              >
                <SquaresFourIcon className="size-3.5" />
                <span>Profiles</span>
                {voices && (
                  <span className="font-mono text-[11px] opacity-75">
                    {voicesList.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="generations"
                className="flex-1 sm:flex-initial rounded-full px-5 h-8 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs gap-2 transition-all"
              >
                <ClockCounterClockwiseIcon className="size-3.5" />
                <span>History Logs</span>
                {historyList.length > 0 && (
                  <span className="font-mono text-[11px] opacity-75">
                    {historyList.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {activeTab === "registry" && (
              <div className="inline-flex items-center gap-1 bg-card p-1.5 rounded-full shadow-xs self-end sm:self-auto">
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                  className={`flex size-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListBulletsIcon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={`flex size-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <SquaresFourIcon className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          {activeTab === "registry" && (
            <div className="bento-card p-3.5 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search voice names or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 bg-secondary/75 border-0 h-10 rounded-full text-sm shadow-none focus-visible:ring-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
                  <Select
                    value={selectedLocale}
                    onValueChange={setSelectedLocale}
                  >
                    <SelectTrigger className="w-full lg:w-[175px] bg-secondary/75 border-0 h-10 rounded-full text-xs font-medium px-4 shadow-none">
                      <div className="flex items-center gap-2 truncate">
                        <GlobeHemisphereWestIcon className="size-3.5 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="All Locales" />
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="rounded-2xl"
                    >
                      <SelectItem value="all">All Locales</SelectItem>
                      <SelectItem value="en">English (EN)</SelectItem>
                      <SelectItem value="fr">Francais (FR)</SelectItem>
                      <SelectItem value="hi">Hindi (HI)</SelectItem>
                      <SelectItem value="es">Espanol (ES)</SelectItem>
                      <SelectItem value="de">Deutsch (DE)</SelectItem>
                      <SelectItem value="ja">Japanese (JA)</SelectItem>
                      <SelectItem value="it">Italiano (IT)</SelectItem>
                      <SelectItem value="zh">Chinese (ZH)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="w-full lg:w-[175px] bg-secondary/75 border-0 h-10 rounded-full text-xs font-medium px-4 shadow-none">
                      <div className="flex items-center gap-2 truncate">
                        <FunnelSimpleIcon className="size-3.5 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="All Classes" />
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="rounded-2xl"
                    >
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="public">Public Studio</SelectItem>
                      <SelectItem value="cloned">Cloned Voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Voices Registry Tab */}
          <TabsContent value="registry" className="mt-0 outline-none">
            {voices === undefined ? (
              <div className="bento-card p-6 space-y-2.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="bento-row p-4 flex items-center gap-4"
                  >
                    <Skeleton className="size-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40 rounded-full" />
                      <Skeleton className="h-3 w-64 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : voicesList.length === 0 ? (
              <div className="bento-card text-center py-20 px-6">
                <div className="size-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <MusicNotesSimpleIcon className="size-5 text-muted-foreground" />
                </div>
                <h2 className="text-base font-bold text-foreground mb-1.5">
                  No voice profiles found
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                  Your library is currently empty. Clone your first voice to
                  start generating narration.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-xs font-semibold"
                >
                  <Link href="/app/voice-cloning">
                    <PlusIcon weight="bold" className="size-3.5 mr-1.5" />
                    Clone Custom Voice
                  </Link>
                </Button>
              </div>
            ) : filteredVoices.length === 0 ? (
              <div className="bento-card text-center py-16 px-6 space-y-4 animate-panel-swap">
                <p className="text-sm text-muted-foreground">
                  No voices match your current search or filters.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLocale("all");
                    setSelectedClass("all");
                  }}
                  className="rounded-full h-9 px-5 text-xs font-semibold"
                >
                  Reset filters
                </Button>
              </div>
            ) : viewMode === "list" ? (
              <div
                key="list-view"
                className="bento-card p-5 sm:p-6 animate-panel-swap"
              >
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 text-[11.5px] font-medium text-muted-foreground">
                  <div className="col-span-4">Voice</div>
                  <div className="col-span-2">Locale</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-1 text-right">Plays</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="space-y-2.5">
                  {filteredVoices.map((voice) => {
                    const isCloned = !voice.isPublic;
                    const voiceName = voice.displayName || "Unnamed voice";
                    const description = voice.description?.trim() || null;
                    const plays = voice.playCount?.toLocaleString() ?? "0";
                    return (
                      <div
                        key={voice._id}
                        className="bento-row px-4 py-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center group"
                      >
                        <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-full bg-card shadow-2xs flex items-center justify-center text-xs font-bold text-foreground shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {voiceName[0]}
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[13.5px] font-semibold text-foreground truncate">
                              {voiceName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                                isCloned
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card text-muted-foreground shadow-2xs"
                              }`}
                            >
                              {isCloned ? "Cloned" : "Public"}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-2 font-mono text-xs text-muted-foreground">
                          {voice.langCode ?? "N/A"}
                        </div>

                        <div className="md:col-span-3 text-xs text-muted-foreground line-clamp-1">
                          {description ?? (
                            <span className="italic">{NO_DESCRIPTION}</span>
                          )}
                        </div>

                        <div className="md:col-span-1 md:text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {plays}
                        </div>

                        <div className="md:col-span-2 flex md:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId ?? voice._id)
                            }
                            className="rounded-full bg-card hover:bg-primary text-foreground hover:text-primary-foreground shadow-2xs text-xs font-semibold px-4 h-8 transition-colors cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                key="grid-view"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-panel-swap"
              >
                {filteredVoices.map((voice) => {
                  const voiceName = voice.displayName || "Unnamed voice";
                  const isCloned = !voice.isPublic;
                  const description = voice.description?.trim() || null;
                  const mood = voice.tags?.[0] ?? "Balanced";
                  const plays = voice.playCount?.toLocaleString() ?? "0";
                  return (
                    <div
                      key={voice._id}
                      className="bento-card p-5 flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10.5px] font-semibold px-3 py-1 rounded-full ${
                              isCloned
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isCloned ? "Cloned Voice" : "Public Studio"}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {voice.langCode ?? "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground shrink-0">
                              {voiceName[0]}
                            </div>
                            <h3 className="text-[15px] font-bold text-foreground truncate">
                              {voiceName}
                            </h3>
                          </div>

                          <button
                            type="button"
                            aria-label={`Use ${voiceName}`}
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId ?? voice._id)
                            }
                            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
                          >
                            <PlayIcon
                              weight="fill"
                              className="size-3.5 ml-0.5"
                            />
                          </button>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {description ?? (
                            <span className="italic">{NO_DESCRIPTION}</span>
                          )}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize font-medium">{mood}</span>
                        <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                          <PulseIcon className="size-3.5" />
                          {plays}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Logs Tab */}
          <TabsContent value="generations" className="mt-0 outline-none">
            {generations === undefined ? (
              <div className="bento-card p-6 space-y-2.5">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="bento-row p-4 flex items-center gap-4"
                  >
                    <Skeleton className="h-8 w-64 rounded-full" />
                    <Skeleton className="h-4 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            ) : historyList.length === 0 ? (
              <div className="bento-card text-center py-20 px-6">
                <div className="size-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockCounterClockwiseIcon className="size-5 text-muted-foreground" />
                </div>
                <h2 className="text-base font-bold text-foreground mb-1.5">
                  No history logs yet
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Generate audio in Text to Speech to see your exported tracks
                  here.
                </p>
              </div>
            ) : (
              <div className="bento-card p-5 sm:p-6 space-y-2.5">
                {historyList.map((g) => {
                  const voiceName =
                    voiceNameByInworldId.get(g.inworldVoiceId ?? "") ??
                    "Unknown voice";
                  return (
                    <div
                      key={g._id}
                      className="bento-row p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                    >
                      <WaveformPlayer
                        url={g.audioUrl}
                        className="w-full lg:w-72 shrink-0"
                      />

                      <p className="text-[13.5px] font-medium text-foreground leading-relaxed line-clamp-2 flex-1 min-w-0">
                        {g.prompt}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground shrink-0">
                        <span className="font-semibold text-foreground">
                          {voiceName}
                        </span>
                        <span className="font-mono text-[10.5px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-card shadow-2xs">
                          {g.format}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums">
                          {new Date(g._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
