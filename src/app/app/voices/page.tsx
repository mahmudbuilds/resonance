"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  Filter,
  Globe2,
  LayoutGrid,
  List,
  Play,
  Pause,
  Plus,
  Search,
  Star,
  Terminal,
  Download,
  Trash2,
  History,
  Music,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

export default function VoicesPage() {
  const router = useRouter();
  const library = [
    {
      displayName: "Marcus",
      gender: "MALE",
      langCode: "EN_US",
      mood: "AUTHORITATIVE",
      plays: "2.4M",
      description: "Deep, resonant acoustic profile. Ideal for heavy exposition.",
      inworldVoiceId: "VOX-01",
      isPublic: true,
    },
    {
      displayName: "Elara",
      gender: "FEMALE",
      langCode: "EN_UK",
      mood: "WARM",
      plays: "1.8M",
      description: "High fidelity conversational tone with natural mid-range.",
      inworldVoiceId: "VOX-02",
      isPublic: true,
    },
    {
      displayName: "Kai",
      gender: "NEUTRAL",
      langCode: "EN_AU",
      mood: "CASUAL",
      plays: "1.2M",
      description: "Energetic frequency response. Optimized for broadcast.",
      inworldVoiceId: "VOX-03",
      isPublic: true,
    },
    {
      displayName: "Nadia",
      gender: "FEMALE",
      langCode: "RU_RU",
      mood: "PROFESSIONAL",
      plays: "980K",
      description: "Strict timing parameters. Perfect for corporate instruction.",
      inworldVoiceId: "VOX-04",
      isPublic: true,
    },
    {
      displayName: "Theo",
      gender: "MALE",
      langCode: "FR_FR",
      mood: "ROMANTIC",
      plays: "875K",
      description: "Smooth velocity curve. Designed for narrative immersion.",
      inworldVoiceId: "VOX-05",
      isPublic: true,
    },
    {
      displayName: "Zara",
      gender: "FEMALE",
      langCode: "NG_NG",
      mood: "ENERGETIC",
      plays: "762K",
      description: "High-amplitude delivery. Sharp transients for commercial impact.",
      inworldVoiceId: "VOX-06",
      isPublic: true,
    },
    {
      displayName: "Jin",
      gender: "MALE",
      langCode: "KO_KR",
      mood: "CALM",
      plays: "640K",
      description: "Low-noise, subdued output. Calibrated for ambient contexts.",
      inworldVoiceId: "VOX-07",
      isPublic: true,
    },
    {
      displayName: "Sofia",
      gender: "FEMALE",
      langCode: "ES_ES",
      mood: "UPBEAT",
      plays: "590K",
      description: "Clear articulation index. Suitable for semantic analysis tasks.",
      inworldVoiceId: "VOX-08",
      isPublic: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("registry");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Convex Queries
  const voices = useQuery(api.voice.getUserVoices);
  const generations = useQuery(api.inworld.listUserGenerations);
  const deleteGeneration = useMutation(api.inworld.deleteUserGeneration);

  // Reset page number on filter/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocale, selectedClass, activeTab]);

  // Dynamic voice data using DB query falling back to static predefined array
  const voicesList: any[] = voices && voices.length > 0 ? voices : library;

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      toast.success("ACTIVE VOICE LOADED INTO SPEECH MODULE");
      router.push("/app/text-to-speech");
    }
  };

  const handleDeleteGeneration = async (id: any) => {
    const toastId = toast.loading("PURGING GENERATION FROM REGISTRY...");
    try {
      await deleteGeneration({ generationId: id });
      toast.success("GENERATION PURGED SUCCESSFULLY", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("FAILED TO PURGE GENERATION", { id: toastId });
    }
  };

  // Filters logic
  const filteredVoices = voicesList.filter((voice: any) => {
    const voiceName = voice.displayName || voice.name || "";
    const voiceDesc = voice.description || voice.desc || "";
    const nameMatch = voiceName.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = voiceDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatch = searchQuery === "" || nameMatch || descMatch;

    const accentVal = voice.langCode || voice.accent || "";
    const localeMatch =
      selectedLocale === "all" ||
      accentVal.toLowerCase().startsWith(selectedLocale.toLowerCase());

    const isPublic = voice.isPublic ?? true;
    const classMatch =
      selectedClass === "all" ||
      (selectedClass === "public" && isPublic) ||
      (selectedClass === "cloned" && !isPublic);

    return searchMatch && localeMatch && classMatch;
  });

  const filteredGenerations = (generations || []).filter((gen) => {
    const promptMatch = (gen.prompt || "").toLowerCase().includes(searchQuery.toLowerCase());
    const voiceIdMatch = (gen.inworldVoiceId || "").toLowerCase().includes(searchQuery.toLowerCase());

    const voiceObj = voicesList.find(
      (v: any) => v.inworldVoiceId === gen.inworldVoiceId || v.id === gen.inworldVoiceId,
    );
    const voiceName = voiceObj
      ? voiceObj.displayName || voiceObj.name || ""
      : gen.inworldVoiceId || "";
    const voiceNameMatch = voiceName.toLowerCase().includes(searchQuery.toLowerCase());

    const searchMatch = searchQuery === "" || promptMatch || voiceIdMatch || voiceNameMatch;

    const voiceAccent = voiceObj ? voiceObj.langCode || voiceObj.accent || "" : "";
    const localeMatch =
      selectedLocale === "all" ||
      voiceAccent.toLowerCase().startsWith(selectedLocale.toLowerCase());

    const isPublic = voiceObj ? (voiceObj.isPublic ?? true) : true;
    const classMatch =
      selectedClass === "all" ||
      (selectedClass === "public" && isPublic) ||
      (selectedClass === "cloned" && !isPublic);

    return searchMatch && localeMatch && classMatch;
  });

  // Pagination calculation
  const totalItems = activeTab === "registry" ? filteredVoices.length : filteredGenerations.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedVoices = filteredVoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const paginatedGenerations = filteredGenerations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white font-sans selection:bg-primary selection:text-black pb-24 sm:pb-32">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 sm:mb-20 border-b border-[#222] pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
              <Terminal className="w-3.5 h-3.5" />
              Database: Acoustic Models
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white">
              VOICE <span className="text-primary">REGISTRY</span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
              Access the global repository of parameterized neural voices.
            </p>
            <Button
              asChild
              className="rounded-none bg-primary text-black hover:bg-white border border-primary font-mono text-xs uppercase tracking-widest h-12 px-8 transition-colors w-full sm:w-auto font-bold"
            >
              <Link href="/app/voice-cloning">
                <Plus className="w-4 h-4 mr-2" /> ADD_MODEL
              </Link>
            </Button>
          </div>
        </header>

        {/* Tabs and Views Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 sm:mb-12 border-b border-[#222]/30 pb-4">
            <TabsList className="bg-transparent p-0 rounded-none h-12 w-full sm:w-[380px] flex border border-[#222] overflow-hidden">
              <TabsTrigger
                value="registry"
                className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2 transition-colors border-r border-[#222]"
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>Profiles</span>
              </TabsTrigger>
              <TabsTrigger
                value="generations"
                className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2 transition-colors"
              >
                <History className="w-3.5 h-3.5 shrink-0" />
                <span>Logs</span>
                {generations && generations.length > 0 && (
                  <span className="ml-1 text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 font-bold font-mono">
                    {generations.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* View Mode Toggle Switcher */}
            <div className="flex items-center justify-end gap-3 font-mono text-xs text-[#666]">
              <span className="uppercase tracking-wider hidden xs:inline">
                Layout View:
              </span>
              <div className="flex items-center border border-[#222] bg-[#050505] p-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("grid")}
                  className={`h-9 w-9 rounded-none transition-colors ${viewMode === "grid" ? "bg-primary text-black hover:bg-primary" : "text-[#888] hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("list")}
                  className={`h-9 w-9 rounded-none transition-colors ${viewMode === "list" ? "bg-primary text-black hover:bg-primary" : "text-[#888] hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Dashboard */}
          <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 mb-10 sm:mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary/10 border-b border-l border-[#222] font-mono text-[9px] text-[#666] uppercase tracking-widest">
              TELEMETRY_FILTER
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center mt-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <Input
                  placeholder="QUERY_DATABASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary w-full font-mono uppercase placeholder:text-[#444] text-white text-xs sm:text-sm tracking-wider"
                />
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 shrink-0 min-w-0">
                <Select value={selectedLocale} onValueChange={setSelectedLocale}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] shrink-0 bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus:ring-primary font-mono uppercase text-white text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2 overflow-hidden min-w-0">
                      <Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      <SelectValue placeholder="LOCALE" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                    <SelectItem value="all" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      ALL_LOCALES
                    </SelectItem>
                    <SelectItem value="ar" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      AR
                    </SelectItem>
                    <SelectItem value="en" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      EN
                    </SelectItem>
                    <SelectItem value="es" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      ES
                    </SelectItem>
                    <SelectItem value="fr" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      FR
                    </SelectItem>
                    <SelectItem value="hi" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      HI
                    </SelectItem>
                    <SelectItem value="it" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      IT
                    </SelectItem>
                    <SelectItem value="ja" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      JA
                    </SelectItem>
                    <SelectItem value="ko" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      KO
                    </SelectItem>
                    <SelectItem value="nl" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      NL
                    </SelectItem>
                    <SelectItem value="pt" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      PT
                    </SelectItem>
                    <SelectItem value="ru" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      RU
                    </SelectItem>
                    <SelectItem value="zh" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      ZH
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px] sm:w-[160px] shrink-0 bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus:ring-primary font-mono uppercase text-white text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2 overflow-hidden min-w-0">
                      <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      <SelectValue placeholder="CLASS" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                    <SelectItem value="all" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      ALL_CLASSES
                    </SelectItem>
                    <SelectItem value="public" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      PUBLIC
                    </SelectItem>
                    <SelectItem value="cloned" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">
                      CLONED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Voices Profiles Listing */}
          <TabsContent value="registry" className="mt-0 outline-none w-full">
            {voices === undefined ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4 border border-[#222] bg-[#050505]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="font-mono text-xs text-[#666] uppercase tracking-widest animate-pulse">
                  RETRIEVING NEURAL MODELS...
                </span>
              </div>
            ) : filteredVoices.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#222] bg-[#050505]">
                <Terminal className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <p className="font-mono text-xs text-[#666] uppercase tracking-widest mb-2">
                  NO_PROFILES_FOUND
                </p>
                <p className="font-mono text-[10px] text-[#444] uppercase leading-relaxed max-w-sm mx-auto px-4">
                  No voice profiles match the active database query parameters.
                </p>
              </div>
            ) : viewMode === "list" ? (
              <div className="border border-[#222] bg-[#050505] divide-y divide-[#222] overflow-x-auto w-full">
                {/* Headers */}
                <div className="hidden md:flex items-center px-6 py-4 bg-[#111] font-mono text-[10px] uppercase tracking-widest text-[#666]">
                  <div className="w-24 shrink-0">ID</div>
                  <div className="w-16 shrink-0 text-center">Avatar</div>
                  <div className="w-48 shrink-0 pl-4">Name</div>
                  <div className="w-28 shrink-0">Accent</div>
                  <div className="w-28 shrink-0">Gender</div>
                  <div className="flex-1 px-4">Description</div>
                  <div className="w-32 shrink-0">Mood</div>
                  <div className="w-32 shrink-0 text-right">Plays</div>
                  <div className="w-24 shrink-0 text-right">Use</div>
                </div>
                {/* Rows */}
                <div className="flex flex-col divide-y divide-[#222]">
                  {paginatedVoices.map((voice: any) => {
                    const isPublic = voice.isPublic ?? true;
                    const accent = voice.langCode || voice.accent || "EN_US";
                    const gender = voice.gender || "FEMALE";
                    const moodVal = voice.mood || "BALANCED";
                    const playsVal = voice.plays || voice.playCount || "0";
                    const description =
                      voice.description ||
                      voice.desc ||
                      "Neural voice profile mapped with nominal characteristics.";
                    const idVal = voice.inworldVoiceId
                      ? voice.inworldVoiceId.substring(0, 8).toUpperCase()
                      : (voice.id || "VOX-00").substring(0, 8).toUpperCase();
                    const voiceDisplayName = voice.displayName || voice.name || "Unknown";

                    return (
                      <div
                        key={voice.inworldVoiceId || voice.id}
                        className="flex flex-col md:flex-row md:items-center px-6 py-5 md:py-4 hover:bg-[#0a0a0a] transition-colors gap-4 md:gap-0 font-sans"
                      >
                        {/* ID Column */}
                        <div className="w-24 shrink-0 font-mono text-[11px] text-[#666] flex items-center justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            ID:{" "}
                          </span>
                          <span>{idVal}</span>
                        </div>
                        {/* Avatar */}
                        <div className="w-16 shrink-0 hidden md:flex items-center justify-center">
                          <div className="w-9 h-9 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-sm text-white">
                            {voiceDisplayName[0]}
                          </div>
                        </div>
                        {/* Name */}
                        <div className="w-48 shrink-0 pl-4 flex items-center gap-3">
                          <div className="md:hidden w-8 h-8 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-xs text-white">
                            {voiceDisplayName[0]}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-white group-hover:text-primary transition-colors text-sm uppercase tracking-wide">
                              {voiceDisplayName}
                            </span>
                          </div>
                          <span className="font-mono text-[8px] uppercase tracking-wider text-black bg-primary px-1.5 py-0.5">
                            {isPublic ? "PUBLIC" : "CLONED"}
                          </span>
                        </div>
                        {/* Accent */}
                        <div className="w-28 shrink-0 font-mono text-xs flex justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Accent:{" "}
                          </span>
                          <span className="text-primary">{accent}</span>
                        </div>
                        {/* Gender */}
                        <div className="w-28 shrink-0 font-mono text-xs flex justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Gender:{" "}
                          </span>
                          <span className="text-[#888]">{gender}</span>
                        </div>
                        {/* Description */}
                        <div className="flex-1 px-0 md:px-4 text-xs text-[#888] font-mono leading-relaxed line-clamp-1 md:line-clamp-2 uppercase">
                          {description}
                        </div>
                        {/* Mood */}
                        <div className="w-32 shrink-0 font-mono text-xs flex justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Mood:{" "}
                          </span>
                          <span className="border border-[#333] px-2 py-0.5 text-[#666] bg-[#0c0c0c]">
                            {moodVal}
                          </span>
                        </div>
                        {/* Plays */}
                        <div className="w-32 shrink-0 font-mono text-xs flex justify-between md:block md:text-right">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Plays:{" "}
                          </span>
                          <span className="text-white">{playsVal}</span>
                        </div>
                        {/* Use Action */}
                        <div className="w-24 shrink-0 text-right flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleUseVoice(voice.inworldVoiceId || voice.id)}
                            className="rounded-none bg-primary hover:bg-white text-black font-mono text-[10px] uppercase h-8 px-4 border border-primary font-bold"
                          >
                            Use
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* GRID VIEW WITH GENEROUS SPACING */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 w-full max-w-full">
                {paginatedVoices.map((voice: any) => {
                  const isPublic = voice.isPublic ?? true;
                  const accent = voice.langCode || voice.accent || "EN_US";
                  const gender = voice.gender || "FEMALE";
                  const moodVal = voice.mood || "BALANCED";
                  const playsVal = voice.plays || voice.playCount || "0";
                  const description =
                    voice.description ||
                    voice.desc ||
                    "Neural voice profile mapped with nominal characteristics.";
                  const idVal = voice.inworldVoiceId
                    ? voice.inworldVoiceId.substring(0, 8).toUpperCase()
                    : (voice.id || "VOX-00").substring(0, 8).toUpperCase();
                  const voiceDisplayName = voice.displayName || voice.name || "Unknown";

                  return (
                    <div
                      key={voice.inworldVoiceId || voice.id}
                      className="group relative border border-[#222] bg-[#050505] hover:bg-[#0a0a0a] transition-all hover:border-primary/50 flex flex-col w-full max-w-full overflow-hidden"
                    >
                      {/* Top Banner */}
                      <div className="h-10 w-full border-b border-[#222] bg-[#111] flex items-center justify-between px-4">
                        <span className="font-mono text-[9px] sm:text-[10px] text-[#666] uppercase">
                          ID: {idVal}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-black bg-primary px-1.5 py-0.5">
                            {isPublic ? "PUBLIC" : "CLONED"}
                          </span>
                          <Star className="w-3.5 h-3.5 text-[#555] group-hover:text-primary transition-colors cursor-pointer" />
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-6 flex flex-col flex-1 gap-4">
                        <div className="flex justify-between items-start">
                          <div className="w-16 h-16 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-2xl text-white group-hover:border-primary transition-colors">
                            {voiceDisplayName[0]}
                          </div>
                          <Button
                            size="icon"
                            onClick={() => handleUseVoice(voice.inworldVoiceId || voice.id)}
                            className="h-11 w-11 rounded-none bg-primary hover:bg-white text-black transition-colors border border-primary"
                          >
                            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-heading text-2xl font-bold uppercase text-white group-hover:text-primary transition-colors truncate">
                            {voiceDisplayName}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            <span className="font-mono text-[9px] sm:text-[10px] text-primary border border-primary/30 px-2 py-0.5 bg-primary/5">
                              {accent}
                            </span>
                            <span className="font-mono text-[9px] sm:text-[10px] text-[#888] border border-[#333] px-2 py-0.5 bg-[#111]">
                              {gender}
                            </span>
                          </div>
                        </div>

                        <p className="font-mono text-[11px] sm:text-xs text-[#888] uppercase leading-relaxed flex-1 pt-2 border-t border-[#111]">
                          {description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between">
                        <span className="font-mono text-[9px] sm:text-[10px] text-[#555] border border-[#333] px-2 py-1">
                          {moodVal}
                        </span>
                        <span className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-[#666]">
                          <Activity className="w-3.5 h-3.5 text-primary" /> {playsVal} PLAYS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Logs / Generations Content can go here */}
        </Tabs>
      </div>
    </div>
  );
}