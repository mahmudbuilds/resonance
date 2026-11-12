"use client";

import { useQuery } from "convex/react";
import {
  Activity,
  Filter,
  Globe2,
  History,
  LayoutGrid,
  List,
  Music,
  Play,
  Plus,
  Search,
} from "lucide-react";
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
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-6 animate-editorial-enter">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Voice Library
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Browse studio speakers and your cloned profiles, or replay past
              audio generations.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 text-xs sm:text-sm font-medium shrink-0 w-full sm:w-auto"
          >
            <Link href="/app/voice-cloning">
              <Plus className="size-4 mr-1.5" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-secondary border border-border p-1 rounded-lg h-10 w-full sm:w-auto">
              <TabsTrigger
                value="registry"
                className="flex-1 sm:flex-initial rounded-md px-4 h-8 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs gap-2"
              >
                <LayoutGrid className="size-3.5" />
                <span>Profiles</span>
                {voices && (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {voicesList.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="generations"
                className="flex-1 sm:flex-initial rounded-md px-4 h-8 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs gap-2"
              >
                <History className="size-3.5" />
                <span>History Logs</span>
                {historyList.length > 0 && (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {historyList.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {activeTab === "registry" && (
              <div className="flex items-center gap-1 border border-border bg-secondary p-1 rounded-lg self-end sm:self-auto">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                  className={`size-8 rounded-md ${
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={`size-8 rounded-md ${
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          {activeTab === "registry" && (
            <div className="studio-panel rounded-xl p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search voice names or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-input h-10 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                  <Select
                    value={selectedLocale}
                    onValueChange={setSelectedLocale}
                  >
                    <SelectTrigger className="w-full lg:w-[175px] bg-background border-input h-10 rounded-lg text-xs px-3">
                      <div className="flex items-center gap-2 truncate">
                        <Globe2 className="size-3.5 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="All Locales" />
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="rounded-lg"
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
                    <SelectTrigger className="w-full lg:w-[175px] bg-background border-input h-10 rounded-lg text-xs px-3">
                      <div className="flex items-center gap-2 truncate">
                        <Filter className="size-3.5 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="All Classes" />
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="rounded-lg"
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
              <div className="studio-panel rounded-xl divide-y divide-border">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:px-6 flex items-center gap-4"
                  >
                    <Skeleton className="size-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : voicesList.length === 0 ? (
              <div className="studio-panel rounded-xl text-center py-20 px-6">
                <div className="size-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-border">
                  <Music className="size-5 text-muted-foreground" />
                </div>
                <h2 className="text-base font-semibold text-foreground mb-1.5">
                  No voice profiles found
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                  Your library is currently empty. Clone your first voice to
                  start generating narration.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-xs font-medium"
                >
                  <Link href="/app/voice-cloning">
                    <Plus className="size-4 mr-1.5" />
                    Clone Custom Voice
                  </Link>
                </Button>
              </div>
            ) : filteredVoices.length === 0 ? (
              <div className="studio-panel rounded-xl text-center py-16 px-6">
                <p className="text-sm text-muted-foreground">
                  No voices match your current search or filters.
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="studio-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50 text-xs font-medium text-muted-foreground">
                        <th className="pl-6 pr-3 py-3.5 w-12" />
                        <th className="px-4 py-3.5">Voice</th>
                        <th className="px-4 py-3.5 hidden sm:table-cell">
                          Locale
                        </th>
                        <th className="px-4 py-3.5 hidden lg:table-cell">
                          Description
                        </th>
                        <th className="px-4 py-3.5 text-right hidden md:table-cell">
                          Plays
                        </th>
                        <th className="pl-4 pr-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {filteredVoices.map((voice) => {
                        const isCloned = !voice.isPublic;
                        const voiceName = voice.displayName || "Unnamed voice";
                        const description = voice.description?.trim() || null;
                        const plays = voice.playCount?.toLocaleString() ?? "0";
                        return (
                          <tr
                            key={voice._id}
                            className="hover:bg-secondary/40 transition-colors"
                          >
                            <td className="pl-6 pr-3 py-3.5">
                              <div className="size-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                                {voiceName[0]}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-foreground truncate max-w-[12rem]">
                                  {voiceName}
                                </span>
                                <span
                                  className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                    isCloned
                                      ? "bg-primary/15 accent-ink"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {isCloned ? "Cloned" : "Public"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground hidden sm:table-cell">
                              {voice.langCode ?? "N/A"}
                            </td>
                            <td className="px-4 py-3.5 max-w-md hidden lg:table-cell">
                              {description ? (
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  {description}
                                </span>
                              ) : (
                                <span className="text-xs italic text-muted-foreground">
                                  {NO_DESCRIPTION}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-xs tabular-nums text-muted-foreground hidden md:table-cell">
                              {plays}
                            </td>
                            <td className="pl-4 pr-6 py-3.5 text-right">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUseVoice(
                                    voice.inworldVoiceId ?? voice._id,
                                  )
                                }
                                className="rounded-full bg-secondary hover:bg-primary text-foreground hover:text-primary-foreground border border-border hover:border-primary text-xs px-4 h-8 transition-colors font-medium"
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVoices.map((voice) => {
                  const voiceName = voice.displayName || "Unnamed voice";
                  const isCloned = !voice.isPublic;
                  const description = voice.description?.trim() || null;
                  const mood = voice.tags?.[0] ?? "Balanced";
                  const plays = voice.playCount?.toLocaleString() ?? "0";
                  return (
                    <div
                      key={voice._id}
                      className="studio-card rounded-xl p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                              isCloned
                                ? "bg-primary/15 accent-ink"
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
                            <div className="size-10 rounded-lg bg-secondary border border-border flex items-center justify-center font-semibold text-sm text-foreground shrink-0">
                              {voiceName[0]}
                            </div>
                            <h3 className="text-base font-semibold text-foreground truncate">
                              {voiceName}
                            </h3>
                          </div>

                          <Button
                            size="icon"
                            aria-label={`Use ${voiceName}`}
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId ?? voice._id)
                            }
                            className="size-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                          >
                            <Play className="size-3.5 ml-0.5 fill-current" />
                          </Button>
                        </div>

                        {description ? (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {description}
                          </p>
                        ) : (
                          <p className="text-xs italic text-muted-foreground leading-relaxed">
                            {NO_DESCRIPTION}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">{mood}</span>
                        <span className="flex items-center gap-1.5 font-mono tabular-nums">
                          <Activity className="size-3.5" />
                          {plays}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Logs Tab (Single responsive DOM tree — zero duplicate player mounts) */}
          <TabsContent value="generations" className="mt-0 outline-none">
            {generations === undefined ? (
              <div className="studio-panel rounded-xl divide-y divide-border">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="p-5 flex items-center gap-4">
                    <Skeleton className="h-8 w-64 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : historyList.length === 0 ? (
              <div className="studio-panel rounded-xl text-center py-20 px-6">
                <div className="size-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4 border border-border">
                  <History className="size-5 text-muted-foreground" />
                </div>
                <h2 className="text-base font-semibold text-foreground mb-1.5">
                  No history logs yet
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Generate audio in Text to Speech to see your exported tracks
                  here.
                </p>
              </div>
            ) : (
              <div className="studio-panel rounded-xl divide-y divide-border">
                {historyList.map((g) => {
                  const voiceName =
                    voiceNameByInworldId.get(g.inworldVoiceId ?? "") ??
                    "Unknown voice";
                  return (
                    <div
                      key={g._id}
                      className="p-4 sm:px-6 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-secondary/30 transition-colors"
                    >
                      <WaveformPlayer
                        url={g.audioUrl}
                        className="w-full lg:w-72 shrink-0"
                      />

                      <p className="text-sm text-foreground leading-relaxed line-clamp-2 flex-1 min-w-0">
                        {g.prompt}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="font-medium text-foreground">
                          {voiceName}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border">
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
