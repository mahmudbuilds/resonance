"use client";

import { useQuery } from "convex/react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe2,
  History,
  LayoutGrid,
  List,
  Loader2,
  Music,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaveformPlayer } from "@/components/waveform-player/WaveformPlayer";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

const NO_DESCRIPTION = "No vocal description available for this voice.";

export default function VoicesPage() {
  const trigger = useHaptics();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("registry");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Convex Queries
  const voices = useQuery(api.voice.getUserVoices);
  const generations = useQuery(api.inworld.listUserGenerations);

  const voicesList: Doc<"voices">[] = voices ?? [];
  const historyList: Doc<"generations">[] = (generations ?? []).filter(
    (g) => !g.isPreview,
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

  const handleUseVoice = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(id));
      trigger("success");
      toast.success("Voice profile loaded into speech module");
      router.push("/app/text-to-speech");
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredVoices = voicesList.filter((voice) => {
    const name = voice.displayName ?? "Unnamed voice";
    const desc = voice.description ?? "";
    const searchMatch =
      searchQuery === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

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

  return (
    <div className="min-h-screen text-foreground font-sans relative selection:bg-primary/20 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-up">
        {/* Header Block */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8 mb-8">
          <div className="space-y-3 w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full font-medium text-xs text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Studio Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-heading">
              Voice Library
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <p className="text-sm text-muted-foreground max-w-sm font-normal leading-relaxed">
              Explore your refined repository of highly parameterized neural
              voice profiles built for creative narration.
            </p>
            <Button
              asChild
              className="rounded-full bg-white text-black hover:bg-zinc-200 font-sans text-xs tracking-wider h-11 px-6 transition-all duration-300 font-medium shrink-0 w-full sm:w-auto shadow-lg"
            >
              <Link href="/app/voice-cloning">
                <Plus className="w-4 h-4 mr-2" /> Clone Custom Voice
              </Link>
            </Button>
          </div>
        </header>

        {/* Controls Switcher Bar */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-white/5 pb-4">
            <TabsList className="glass-card p-1 rounded-xl sm:rounded-full h-12 w-full sm:w-auto flex border-white/5">
              <TabsTrigger
                value="registry"
                className="flex-1 rounded-lg sm:rounded-full data-[state=active]:bg-primary data-[state=active]:text-white text-xs font-medium h-full px-6 gap-2 transition-all"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Profiles</span>
              </TabsTrigger>
              <TabsTrigger
                value="generations"
                className="flex-1 rounded-lg sm:rounded-full data-[state=active]:bg-primary data-[state=active]:text-white text-xs font-medium h-full px-6 gap-2 transition-all"
              >
                <History className="w-4 h-4" />
                <span>History Logs</span>
                {historyList.length > 0 && (
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full ml-1">
                    {historyList.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Layout Switchers */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center gap-1 border border-white/5 bg-white/5 p-1 rounded-xl">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("grid")}
                  className={`h-9 w-9 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("list")}
                  className={`h-9 w-9 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {viewMode === "grid" &&
                filteredVoices.length > 0 &&
                activeTab === "registry" && (
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll("left")}
                      className="h-10 w-10 rounded-full bg-white/5 border-white/10 hover:border-primary hover:text-primary transition-all text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll("right")}
                      className="h-10 w-10 rounded-full bg-white/5 border-white/10 hover:border-primary hover:text-primary transition-all text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
            </div>
          </div>

          {/* Filtering Dropdowns */}
          {activeTab === "registry" && (
            <div className="glass-panel rounded-2xl p-4 relative z-50 border border-white/5">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search profiles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 glass-card border-white/5 h-11 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-primary/50 transition-all w-full text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 w-full lg:w-auto">
                  {/* Locale Dropdown */}
                  <Select
                    value={selectedLocale}
                    onValueChange={setSelectedLocale}
                  >
                    <SelectTrigger className="w-full lg:w-[180px] glass-card border-white/5 h-11 rounded-xl text-white text-xs px-4 focus:ring-1 focus:ring-primary">
                      <div className="flex items-center gap-2 truncate">
                        <Globe2 className="w-4 h-4 text-primary shrink-0" />
                        <SelectValue placeholder="Locales" />
                      </div>
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      sideOffset={8}
                      className="w-[210px] max-h-[240px] overflow-y-auto border border-white/10 rounded-xl text-white text-xs shadow-xl z-[100] p-2 space-y-1"
                    >
                      <SelectItem
                        value="all"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        All Locales
                      </SelectItem>
                      <SelectItem
                        value="en"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        English (EN)
                      </SelectItem>
                      <SelectItem
                        value="fr"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Français (FR)
                      </SelectItem>
                      <SelectItem
                        value="hi"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Hindi (HI)
                      </SelectItem>
                      <SelectItem
                        value="es"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Español (ES)
                      </SelectItem>
                      <SelectItem
                        value="de"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Deutsch (DE)
                      </SelectItem>
                      <SelectItem
                        value="ja"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        日本語 (JA)
                      </SelectItem>
                      <SelectItem
                        value="it"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Italiano (IT)
                      </SelectItem>
                      <SelectItem
                        value="zh"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        中文 (ZH)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Class Dropdown */}
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="w-full lg:w-[180px] glass-card border-white/5 h-11 rounded-xl text-white text-xs px-4 focus:ring-1 focus:ring-primary">
                      <div className="flex items-center gap-2 truncate">
                        <Filter className="w-4 h-4 text-primary shrink-0" />
                        <SelectValue placeholder="Classes" />
                      </div>
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      sideOffset={8}
                      className="w-[210px] border border-white/10 rounded-xl text-white text-xs shadow-xl z-[100] p-2 space-y-1"
                    >
                      <SelectItem
                        value="all"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        All Classes
                      </SelectItem>
                      <SelectItem
                        value="public"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Public Studio
                      </SelectItem>
                      <SelectItem
                        value="cloned"
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-left focus:bg-white/10 focus:text-white transition-colors outline-none"
                      >
                        Cloned Voice
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Voices Registry Content */}
          <TabsContent
            value="registry"
            className="mt-0 outline-none relative z-10 w-full stagger-1"
          >
            {voices === undefined ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border border-white/5 glass-panel rounded-3xl">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground font-medium">
                  Syncing library...
                </span>
              </div>
            ) : voicesList.length === 0 ? (
              <div className="text-center py-28 border border-white/10 glass-panel rounded-3xl px-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  No voice profiles found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                  Your voice library is empty. Clone a voice to get started.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-white text-black hover:bg-zinc-200 font-sans text-xs tracking-wider h-11 px-6 transition-all duration-300 font-medium shadow-lg"
                >
                  <Link href="/app/voice-cloning">
                    <Plus className="w-4 h-4 mr-2" /> Clone Custom Voice
                  </Link>
                </Button>
              </div>
            ) : filteredVoices.length === 0 ? (
              <div className="text-center py-20 border border-white/10 glass-panel rounded-3xl">
                <Music className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No active parameters match your search filters.
                </p>
              </div>
            ) : viewMode === "list" ? (
              /* Data Table View */
              <>
                {/* Mobile + portrait tablet card list */}
                <div className="flex flex-col gap-3 md:hidden">
                  {filteredVoices.map((voice) => {
                    const isCloned = !voice.isPublic;
                    const voiceName = voice.displayName || "Unnamed voice";
                    const description = voice.description?.trim() || null;
                    const plays = voice.playCount?.toLocaleString() ?? "0";
                    return (
                      <div
                        key={voice._id}
                        className="glass-card rounded-2xl p-5 space-y-4 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold shrink-0">
                            {voiceName[0]}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-white truncate">
                                {voiceName}
                              </span>
                              <span
                                className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full shrink-0 ${isCloned ? "bg-pink-500/20 text-pink-300" : "bg-primary/20 text-primary"}`}
                              >
                                {isCloned ? "Cloned" : "Public"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Globe2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="font-mono">
                                {voice.langCode ?? "—"}
                              </span>
                              <span className="ml-auto flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                {plays}
                              </span>
                            </div>
                          </div>
                        </div>

                        {description ? (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {description}
                          </p>
                        ) : (
                          <p className="text-sm italic text-muted-foreground/70 leading-relaxed">
                            {NO_DESCRIPTION}
                          </p>
                        )}

                        <Button
                          onClick={() =>
                            handleUseVoice(voice.inworldVoiceId ?? voice._id)
                          }
                          className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs h-10 transition-all duration-300 font-medium"
                        >
                          Select Voice
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet + desktop table */}
                <div className="hidden md:block border border-white/5 glass-panel rounded-[24px] overflow-hidden shadow-2xl w-full">
                  <div className="w-full overflow-x-auto lg:overflow-visible">
                    <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-muted-foreground">
                        <th className="pl-8 pr-4 py-5 w-14">Avatar</th>
                        <th className="px-6 py-5 w-44">Name</th>
                        <th className="px-6 py-5 w-28">Locale</th>
                        <th className="px-6 py-5">Vocal Description</th>
                        <th className="px-6 py-5 text-right w-24">
                          Plays
                        </th>
                        <th className="pl-4 pr-8 py-5 text-right w-28">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-white">
                      {filteredVoices.map((voice) => {
                        const isCloned = !voice.isPublic;
                        const voiceName =
                          voice.displayName || "Unnamed voice";
                        const description = voice.description?.trim() || null;
                        const plays =
                          voice.playCount?.toLocaleString() ?? "0";
                        return (
                          <tr
                            key={voice._id}
                            className="hover:bg-white/5 transition-all group duration-200"
                          >
                            <td className="pl-8 pr-4 py-4">
                              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold">
                                {voiceName[0]}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1.5 min-w-0">
                                <span className="font-semibold truncate max-w-[10rem]">
                                  {voiceName}
                                </span>
                                <span
                                  className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 w-fit rounded-full ${isCloned ? "bg-pink-500/20 text-pink-300" : "bg-primary/20 text-primary"}`}
                                >
                                  {isCloned ? "Cloned" : "Public"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-primary font-mono text-xs">
                              {voice.langCode ?? "—"}
                            </td>
                            <td className="px-6 py-4 max-w-md xl:max-w-xl text-xs">
                              {description ? (
                                <span className="text-muted-foreground truncate block">
                                  {description}
                                </span>
                              ) : (
                                <span className="italic text-muted-foreground/70">
                                  {NO_DESCRIPTION}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">
                              {plays}
                            </td>
                            <td className="pl-4 pr-8 py-4 text-right">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUseVoice(
                                    voice.inworldVoiceId ?? voice._id,
                                  )
                                }
                                className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs px-6 h-9 transition-all duration-300 border-none font-medium"
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
              </>
            ) : (
              /* Carousel Grid View */
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth w-full custom-scrollbar"
              >
                {filteredVoices.map((voice) => {
                  const voiceName = voice.displayName || "Unnamed voice";
                  const isCloned = !voice.isPublic;
                  const description = voice.description?.trim() || null;
                  const mood = voice.tags?.[0]?.toLowerCase() ?? "balanced";
                  const plays = voice.playCount?.toLocaleString() ?? "0";
                  return (
                    <div
                      key={voice._id}
                      className="snap-start shrink-0 w-full sm:w-[310px] rounded-[24px] border border-white/5 glass-card hover:bg-white/10 transition-all duration-300 hover:border-primary/30 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                    >
                      <div className="pt-6 px-6 pb-2 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${isCloned ? "bg-pink-500/20 text-pink-300" : "bg-primary/20 text-primary"}`}
                        >
                          {isCloned ? "Cloned Voice" : "Public Studio"}
                        </span>
                        <Star className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                      </div>

                      <div className="px-6 pt-3 pb-6 flex flex-col gap-4 flex-1">
                        <div className="flex justify-between items-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-heading font-semibold text-lg text-white">
                            {voiceName[0]}
                          </div>
                          <Button
                            size="icon"
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId ?? voice._id)
                            }
                            className="h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 border-none group-hover:scale-105"
                          >
                            <Play
                              className="w-4 h-4 ml-0.5"
                              fill="currentColor"
                            />
                          </Button>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-xl font-heading font-semibold text-white truncate">
                            {voiceName}
                          </h3>
                          <div className="flex gap-1.5">
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {voice.langCode ?? "—"}
                            </span>
                          </div>
                        </div>

                        {description ? (
                          <p className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-white/5 min-h-[72px] line-clamp-3">
                            {description}
                          </p>
                        ) : (
                          <p className="text-sm italic text-muted-foreground/70 leading-relaxed pt-3 border-t border-white/5 min-h-[72px] line-clamp-3">
                            {NO_DESCRIPTION}
                          </p>
                        )}
                      </div>

                      <div className="px-6 py-4 border-t border-white/5 bg-white/5 flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span className="uppercase">{mood}</span>
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-primary" />{" "}
                          {plays}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Logs Content */}
          <TabsContent
            value="generations"
            className="mt-0 outline-none relative z-10 w-full"
          >
            {generations === undefined ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border border-white/5 glass-panel rounded-3xl">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">
                  Fetching history...
                </span>
              </div>
            ) : historyList.length === 0 ? (
              <div className="text-center py-28 border border-white/10 glass-panel rounded-3xl px-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  No History Logs
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Generate audio from the speech module to populate your
                  history.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile + portrait tablet card layout */}
                <div className="flex flex-col gap-3 md:hidden">
                  {historyList.map((g) => {
                    const voiceName =
                      voiceNameByInworldId.get(g.inworldVoiceId ?? "") ??
                      "Unknown voice";
                    return (
                      <div
                        key={g._id}
                        className="border border-white/5 glass-card rounded-2xl p-4 space-y-4 hover:border-white/10 transition-all"
                      >
                        <WaveformPlayer url={g.audioUrl} />
                        <p className="text-sm text-white leading-relaxed line-clamp-4">
                          {g.prompt}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground pt-3 border-t border-white/5">
                          <span className="font-semibold text-white flex items-center gap-1.5 min-w-0">
                            <Music className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{voiceName}</span>
                          </span>
                          <span className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                            {g.format}
                          </span>
                          <span className="font-mono text-[10px] ml-auto">
                            {new Date(g._creationTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet + desktop table layout */}
                <div className="hidden md:block border border-white/5 glass-panel rounded-[24px] overflow-hidden shadow-2xl w-full">
                  <div className="w-full overflow-x-auto lg:overflow-visible">
                    <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-muted-foreground">
                        <th className="pl-8 pr-4 py-5 w-72">Preview</th>
                        <th className="px-6 py-5">Prompt</th>
                        <th className="px-6 py-5 w-56">Voice</th>
                        <th className="px-6 py-5 w-24">Format</th>
                        <th className="pl-4 pr-8 py-5 text-right w-40">
                          Generated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-white">
                      {historyList.map((g) => {
                        const voiceName =
                          voiceNameByInworldId.get(g.inworldVoiceId ?? "") ??
                          "Unknown voice";
                        return (
                          <tr
                            key={g._id}
                            className="hover:bg-white/5 transition-all duration-200"
                          >
                            <td className="pl-8 pr-4 py-4">
                              <WaveformPlayer url={g.audioUrl} />
                            </td>
                            <td className="px-6 py-4 max-w-md xl:max-w-xl">
                              <span className="text-xs text-muted-foreground line-clamp-2 block">
                                {g.prompt}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-white font-medium truncate block max-w-[14rem]">
                                {voiceName}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs">
                              <span className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                                {g.format}
                              </span>
                            </td>
                            <td className="pl-4 pr-8 py-4 text-right font-mono text-xs text-muted-foreground">
                              {new Date(g._creationTime).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
