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

export default function VoicesPage() {
  const router = useRouter();
  const library = [
    {
      name: "Marcus",
      gender: "MALE",
      accent: "EN-US",
      mood: "AUTHORITATIVE",
      type: "PRO",
      plays: "2.4M",
      desc: "Deep, resonant acoustic profile. Ideal for heavy exposition.",
      id: "VOX-01",
    },
    {
      name: "Elara",
      gender: "FEMALE",
      accent: "EN-UK",
      mood: "WARM",
      type: "STD",
      plays: "1.8M",
      desc: "High fidelity conversational tone with natural mid-range.",
      id: "VOX-02",
    },
    {
      name: "Kai",
      gender: "NEUTRAL",
      accent: "EN-AU",
      mood: "CASUAL",
      type: "STD",
      plays: "1.2M",
      desc: "Energetic frequency response. Optimized for broadcast.",
      id: "VOX-03",
    },
    {
      name: "Nadia",
      gender: "FEMALE",
      accent: "RU-RU",
      mood: "PROFESSIONAL",
      type: "PRO",
      plays: "980K",
      desc: "Strict timing parameters. Perfect for corporate instruction.",
      id: "VOX-04",
    },
    {
      name: "Theo",
      gender: "MALE",
      accent: "FR-FR",
      mood: "ROMANTIC",
      type: "STD",
      plays: "875K",
      desc: "Smooth velocity curve. Designed for narrative immersion.",
      id: "VOX-05",
    },
    {
      name: "Zara",
      gender: "FEMALE",
      accent: "NG-NG",
      mood: "ENERGETIC",
      type: "PRO",
      plays: "762K",
      desc: "High-amplitude delivery. Sharp transients for commercial impact.",
      id: "VOX-06",
    },
    {
      name: "Jin",
      gender: "MALE",
      accent: "KO-KR",
      mood: "CALM",
      type: "STD",
      plays: "640K",
      desc: "Low-noise, subdued output. Calibrated for ambient contexts.",
      id: "VOX-07",
    },
    {
      name: "Sofia",
      gender: "FEMALE",
      accent: "ES-ES",
      mood: "UPBEAT",
      type: "STD",
      plays: "590K",
      desc: "Clear articulation index. Suitable for semantic analysis tasks.",
      id: "VOX-08",
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
  const voicesList = voices && voices.length > 0 ? voices : library;

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
    const nameMatch = voiceName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descMatch = voiceDesc
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const searchMatch = searchQuery === "" || nameMatch || descMatch;

    const accentVal = voice.langCode || voice.accent || "";
    const localeMatch =
      selectedLocale === "all" ||
      accentVal.toLowerCase().startsWith(selectedLocale.toLowerCase());

    const typeVal = voice.type || (voice.isPublic ? "STD" : "PRO");
    const classMatch =
      selectedClass === "all" ||
      (selectedClass === "pro" && typeVal === "PRO") ||
      (selectedClass === "standard" && typeVal === "STD");

    return searchMatch && localeMatch && classMatch;
  });

  const filteredGenerations = (generations || []).filter((gen) => {
    const promptMatch = gen.prompt
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const voiceIdMatch = gen.voiceId
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const voiceObj = voicesList.find(
      (v: any) => v.inworldVoiceId === gen.voiceId || v.id === gen.voiceId,
    );
    const voiceName = voiceObj
      ? voiceObj.displayName || voiceObj.name || ""
      : gen.voiceId;
    const voiceNameMatch = voiceName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const searchMatch =
      searchQuery === "" || promptMatch || voiceIdMatch || voiceNameMatch;

    const voiceAccent = voiceObj
      ? voiceObj.langCode || voiceObj.accent || ""
      : "";
    const localeMatch =
      selectedLocale === "all" ||
      voiceAccent.toLowerCase().startsWith(selectedLocale.toLowerCase());

    const isPublic = voiceObj ? (voiceObj.isPublic ?? true) : true;
    const classMatch =
      selectedClass === "all" ||
      (selectedClass === "pro" && !isPublic) ||
      (selectedClass === "standard" && isPublic);

    return searchMatch && localeMatch && classMatch;
  });

  // Pagination calculation
  const totalItems =
    activeTab === "registry"
      ? filteredVoices.length
      : filteredGenerations.length;
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
                <Select
                  value={selectedLocale}
                  onValueChange={setSelectedLocale}
                >
                  <SelectTrigger className="w-[140px] sm:w-[160px] shrink-0 bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus:ring-primary font-mono uppercase text-white text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2 overflow-hidden min-w-0">
                      <Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      <SelectValue placeholder="LOCALE" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                    <SelectItem
                      value="all"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      ALL_LOCALES
                    </SelectItem>
                    <SelectItem
                      value="en"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      EN
                    </SelectItem>
                    <SelectItem
                      value="es"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      ES
                    </SelectItem>
                    <SelectItem
                      value="ko"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      KO
                    </SelectItem>
                    <SelectItem
                      value="ru"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      RU
                    </SelectItem>
                    <SelectItem
                      value="fr"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      FR
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
                    <SelectItem
                      value="all"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      ALL_CLASSES
                    </SelectItem>
                    <SelectItem
                      value="pro"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      PRO / CLONED
                    </SelectItem>
                    <SelectItem
                      value="standard"
                      className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                    >
                      STANDARD
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
              /* SLEEK HIGH DENSITY LIST VIEW WITH COMFORTABLE SPACING */
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
                    const accent = voice.langCode || voice.accent || "EN-US";
                    const gender = voice.gender || "FEMALE";
                    const moodVal = voice.mood || "BALANCED";
                    const playsVal = voice.plays || "0";
                    const description =
                      voice.description ||
                      voice.desc ||
                      "Neural voice profile mapped with nominal characteristics.";
                    const isCloned = !isPublic;
                    const typeVal = voice.type || (isCloned ? "CLONED" : "PRO");
                    const idVal = voice.inworldVoiceId
                      ? voice.inworldVoiceId.substring(0, 8).toUpperCase()
                      : voice.id || "VOX-00";
                    const voiceDisplayName = voice.displayName || voice.name;

                    return (
                      <div
                        key={voiceDisplayName}
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
                        <div className="w-48 shrink-0 pl-0 md:pl-4 flex items-center gap-3">
                          <div className="md:hidden w-8 h-8 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-xs text-white">
                            {voiceDisplayName[0]}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-white group-hover:text-primary transition-colors text-sm uppercase tracking-wide">
                              {voiceDisplayName}
                            </span>
                            <span className="block md:hidden font-mono text-[8px] uppercase tracking-wider text-black bg-primary px-1 py-0.5 mt-1 w-max">
                              {typeVal}
                            </span>
                          </div>
                          <span className="hidden md:inline font-mono text-[8px] uppercase tracking-wider text-black bg-primary px-1.5 py-0.5">
                            {typeVal}
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
                        {/* Play Action */}
                        <div className="w-24 shrink-0 text-right flex justify-end">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId || voice.id)
                            }
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
              /* GRID VIEW WITH GENEROUS SPACING (gap-6 sm:gap-8) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 w-full max-w-full">
                {paginatedVoices.map((voice: any) => {
                  const isPublic = voice.isPublic ?? true;
                  const accent = voice.langCode || voice.accent || "EN-US";
                  const gender = voice.gender || "FEMALE";
                  const moodVal = voice.mood || "BALANCED";
                  const playsVal = voice.plays || "0";
                  const description =
                    voice.description ||
                    voice.desc ||
                    "Neural voice profile mapped with nominal characteristics.";
                  const isCloned = !isPublic;
                  const typeVal = voice.type || (isCloned ? "CLONED" : "PRO");
                  const idVal = voice.inworldVoiceId
                    ? voice.inworldVoiceId.substring(0, 8).toUpperCase()
                    : voice.id || "VOX-00";
                  const voiceDisplayName = voice.displayName || voice.name;

                  return (
                    <div
                      key={voiceDisplayName}
                      className="group relative border border-[#222] bg-[#050505] hover:bg-[#0a0a0a] transition-all hover:border-primary/50 flex flex-col w-full max-w-full overflow-hidden"
                    >
                      {/* Top Banner */}
                      <div className="h-10 w-full border-b border-[#222] bg-[#111] flex items-center justify-between px-4">
                        <span className="font-mono text-[9px] sm:text-[10px] text-[#666] uppercase">
                          ID: {idVal}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-black bg-primary px-1.5 py-0.5">
                            {typeVal}
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
                            onClick={() =>
                              handleUseVoice(voice.inworldVoiceId || voice.id)
                            }
                            className="h-11 w-11 rounded-none bg-primary hover:bg-white text-black transition-colors border border-primary"
                          >
                            <Play
                              className="w-4 h-4 ml-0.5"
                              fill="currentColor"
                            />
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
                          <Activity className="w-3 h-3 text-primary" />
                          {playsVal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Generated Log/History Tab Listing */}
          <TabsContent value="generations" className="mt-0 outline-none w-full">
            {generations === undefined ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4 border border-[#222] bg-[#050505]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="font-mono text-xs text-[#666] uppercase tracking-widest animate-pulse">
                  RETRIEVING GENERATION ARCHIVES...
                </span>
              </div>
            ) : filteredGenerations.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#222] bg-[#050505]">
                <Terminal className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <p className="font-mono text-xs text-[#666] uppercase tracking-widest mb-2">
                  NO_GENERATIONS_FOUND
                </p>
                <p className="font-mono text-[10px] text-[#444] uppercase leading-relaxed max-w-sm mx-auto px-4">
                  {searchQuery
                    ? "No generated signatures match the active telemetry filters."
                    : "No neural voice generations synthesized yet. Initialize speech synthesis to populate log."}
                </p>
              </div>
            ) : viewMode === "list" ? (
              /* SLEEK HIGH DENSITY LIST VIEW WITH COMFORTABLE SPACING */
              <div className="border border-[#222] bg-[#050505] divide-y divide-[#222] overflow-x-auto w-full">
                {/* Headers */}
                <div className="hidden md:flex items-center px-6 py-4 bg-[#111] font-mono text-[10px] uppercase tracking-widest text-[#666]">
                  <div className="w-24 shrink-0">ID</div>
                  <div className="w-12 shrink-0"></div>
                  <div className="w-48 shrink-0 pl-4">Voice</div>
                  <div className="w-28 shrink-0">Accent</div>
                  <div className="w-28 shrink-0">Gender</div>
                  <div className="flex-1 px-4">Generated Neural Prompt</div>
                  <div className="w-36 shrink-0">Timestamp</div>
                  <div className="w-28 shrink-0 text-right">Actions</div>
                </div>
                {/* Rows */}
                <div className="flex flex-col divide-y divide-[#222]">
                  {paginatedGenerations.map((gen) => {
                    const voiceObj = voicesList.find(
                      (v: any) =>
                        v.inworldVoiceId === gen.voiceId ||
                        v.id === gen.voiceId,
                    );
                    const voiceName = voiceObj
                      ? voiceObj.displayName || voiceObj.name || ""
                      : "Custom Voice";
                    const voiceAccent = voiceObj
                      ? voiceObj.langCode || voiceObj.accent || "EN-US"
                      : "EN-US";
                    const voiceGender = voiceObj
                      ? voiceObj.gender || "NEUTRAL"
                      : "NEUTRAL";

                    const date = new Date(gen._creationTime);
                    const dateStr = date.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    });
                    const timeStr = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });

                    return (
                      <div
                        key={gen._id}
                        className="flex flex-col md:flex-row md:items-center px-6 py-5 md:py-4 hover:bg-[#0a0a0a] transition-colors gap-4 md:gap-0 font-sans"
                      >
                        {/* ID Column */}
                        <div className="w-24 shrink-0 font-mono text-[11px] text-[#666] flex items-center justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            ID:{" "}
                          </span>
                          <span>{gen._id.substring(3, 10).toUpperCase()}</span>
                        </div>
                        {/* Play/Pause Button */}
                        <div className="w-12 shrink-0 flex items-center justify-center">
                          <Button
                            size="icon"
                            onClick={() => {
                              const audio = document.getElementById(
                                `audio-${gen._id}`,
                              ) as HTMLAudioElement;
                              if (audio) {
                                if (audio.paused) {
                                  document
                                    .querySelectorAll("audio")
                                    .forEach((a) => {
                                      if (a.id !== `audio-${gen._id}`)
                                        a.pause();
                                    });
                                  audio.play();
                                } else {
                                  audio.pause();
                                }
                              }
                            }}
                            className={`h-8 w-8 rounded-none transition-colors border ${playingId === gen._id ? "bg-primary border-primary text-black" : "bg-[#111] border-[#333] hover:border-primary hover:text-primary text-white"}`}
                          >
                            {playingId === gen._id ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play
                                className="w-3.5 h-3.5 ml-0.5"
                                fill="currentColor"
                              />
                            )}
                          </Button>
                          <audio
                            id={`audio-${gen._id}`}
                            src={gen.audioUrl}
                            className="hidden"
                            onPlay={() => setPlayingId(gen._id)}
                            onPause={() =>
                              setPlayingId((current) =>
                                current === gen._id ? null : current,
                              )
                            }
                            onEnded={() =>
                              setPlayingId((current) =>
                                current === gen._id ? null : current,
                              )
                            }
                          />
                        </div>
                        {/* Voice Name */}
                        <div className="w-48 shrink-0 pl-0 md:pl-4 flex items-center gap-3">
                          <span className="font-heading font-bold text-white group-hover:text-primary transition-colors text-sm uppercase tracking-wide">
                            {voiceName}
                          </span>
                        </div>
                        {/* Accent */}
                        <div className="w-28 shrink-0 font-mono text-xs flex justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Accent:{" "}
                          </span>
                          <span className="text-primary">{voiceAccent}</span>
                        </div>
                        {/* Gender */}
                        <div className="w-28 shrink-0 font-mono text-xs flex justify-between md:block">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Gender:{" "}
                          </span>
                          <span className="text-[#888]">{voiceGender}</span>
                        </div>
                        {/* Prompt */}
                        <div className="flex-1 px-0 md:px-4 text-xs text-[#888] font-mono leading-relaxed line-clamp-1 md:line-clamp-2 uppercase">
                          &quot;{gen.prompt}&quot;
                        </div>
                        {/* Timestamp */}
                        <div className="w-36 shrink-0 font-mono text-xs flex justify-between md:block text-[#666]">
                          <span className="md:hidden text-[#444] uppercase tracking-wider">
                            Created:{" "}
                          </span>
                          <span>
                            {dateStr} {timeStr}
                          </span>
                        </div>
                        {/* Download & Delete */}
                        <div className="w-28 shrink-0 flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-none bg-[#111] border border-[#333] hover:border-primary hover:text-primary text-[#888]"
                            disabled={
                              downloadingId === gen._id || !gen.audioUrl
                            }
                            onClick={async () => {
                              if (!gen.audioUrl) return;
                              try {
                                setDownloadingId(gen._id);
                                const response = await fetch(gen.audioUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.style.display = "none";
                                a.href = url;
                                a.download = `voice-generation-${gen._id}.mp3`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error("Download failed:", error);
                              } finally {
                                setDownloadingId(null);
                              }
                            }}
                          >
                            {downloadingId === gen._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteGeneration(gen._id)}
                            className="h-8 w-8 rounded-none bg-[#111] border border-[#333] hover:border-red-500 hover:text-red-500 text-[#888]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* GRID VIEW WITH GENEROUS SPACING (gap-6 sm:gap-8) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 w-full max-w-full">
                {paginatedGenerations.map((gen) => {
                  const voiceObj = voicesList.find(
                    (v: any) =>
                      v.inworldVoiceId === gen.voiceId || v.id === gen.voiceId,
                  );
                  const voiceName = voiceObj
                    ? voiceObj.displayName || voiceObj.name || ""
                    : "Custom Voice";
                  const voiceAccent = voiceObj
                    ? voiceObj.langCode || voiceObj.accent || "EN-US"
                    : "EN-US";
                  const voiceGender = voiceObj
                    ? voiceObj.gender || "NEUTRAL"
                    : "NEUTRAL";

                  const date = new Date(gen._creationTime);
                  const dateStr = date.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });
                  const timeStr = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  return (
                    <div
                      key={gen._id}
                      className="group relative border border-[#222] bg-[#050505] hover:bg-[#0a0a0a] transition-all hover:border-primary/50 flex flex-col w-full max-w-full overflow-hidden"
                    >
                      {/* Top Banner */}
                      <div className="h-10 w-full border-b border-[#222] bg-[#111] flex items-center justify-between px-4">
                        <span className="font-mono text-[8px] sm:text-[9px] text-[#666] uppercase">
                          ID: {gen._id.substring(3, 10).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-[#888] bg-[#222] px-1.5 py-0.5">
                            {gen.format?.toUpperCase() || "MP3"}
                          </span>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-6 flex flex-col flex-1 gap-5">
                        <div className="flex justify-between items-start">
                          <div className="w-16 h-16 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-xl text-white group-hover:border-primary transition-colors relative">
                            <Music className="w-6 h-6 text-[#555] group-hover:text-primary transition-colors" />
                            {playingId === gen._id && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <span className="flex items-end gap-0.5 h-6">
                                  <span
                                    className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-full"
                                    style={{ animationDelay: "0.1s" }}
                                  />
                                  <span
                                    className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-3"
                                    style={{ animationDelay: "0.3s" }}
                                  />
                                  <span
                                    className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-5"
                                    style={{ animationDelay: "0.5s" }}
                                  />
                                </span>
                              </span>
                            )}
                          </div>

                          <Button
                            size="icon"
                            onClick={() => {
                              const audio = document.getElementById(
                                `audio-${gen._id}`,
                              ) as HTMLAudioElement;
                              if (audio) {
                                if (audio.paused) {
                                  document
                                    .querySelectorAll("audio")
                                    .forEach((a) => {
                                      if (a.id !== `audio-${gen._id}`)
                                        a.pause();
                                    });
                                  audio.play();
                                } else {
                                  audio.pause();
                                }
                              }
                            }}
                            className={`h-11 w-11 rounded-none transition-colors border ${playingId === gen._id ? "bg-primary border-primary text-black" : "bg-[#111] border-[#333] hover:border-primary hover:text-primary text-white"}`}
                          >
                            {playingId === gen._id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play
                                className="w-4 h-4 ml-0.5"
                                fill="currentColor"
                              />
                            )}
                          </Button>
                          <audio
                            id={`audio-${gen._id}`}
                            src={gen.audioUrl}
                            className="hidden"
                            onPlay={() => setPlayingId(gen._id)}
                            onPause={() =>
                              setPlayingId((current) =>
                                current === gen._id ? null : current,
                              )
                            }
                            onEnded={() =>
                              setPlayingId((current) =>
                                current === gen._id ? null : current,
                              )
                            }
                          />
                        </div>

                        <div>
                          <h3 className="font-heading text-xl font-bold uppercase text-white group-hover:text-primary transition-colors truncate">
                            {voiceName}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            <span className="font-mono text-[9px] sm:text-[10px] text-primary border border-primary/30 px-2 py-0.5 bg-primary/5">
                              {voiceAccent}
                            </span>
                            <span className="font-mono text-[9px] sm:text-[10px] text-[#888] border border-[#333] px-2 py-0.5 bg-[#111]">
                              {voiceGender}
                            </span>
                          </div>
                        </div>

                        <p className="font-mono text-[11px] sm:text-xs text-[#888] uppercase leading-relaxed flex-1 line-clamp-3 bg-[#111]/30 border border-[#222]/30 p-3 overflow-hidden text-ellipsis">
                          &quot;{gen.prompt}&quot;
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between gap-4">
                        <span className="font-mono text-[9px] sm:text-[10px] text-[#555] border border-[#333] px-2 py-1 shrink-0">
                          {dateStr} {timeStr}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-none bg-[#111] border border-[#333] hover:border-primary hover:text-primary text-[#888]"
                            disabled={
                              downloadingId === gen._id || !gen.audioUrl
                            }
                            onClick={async () => {
                              if (!gen.audioUrl) return;
                              try {
                                setDownloadingId(gen._id);
                                const response = await fetch(gen.audioUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.style.display = "none";
                                a.href = url;
                                a.download = `voice-generation-${gen._id}.mp3`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error("Download failed:", error);
                              } finally {
                                setDownloadingId(null);
                              }
                            }}
                          >
                            {downloadingId === gen._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteGeneration(gen._id)}
                            className="h-8 w-8 rounded-none bg-[#111] border border-[#333] hover:border-red-500 hover:text-red-500 text-[#888]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TELEMETRY RETRO PAGINATION PANEL (Unified for both tabs) */}
          {totalPages > 1 && (
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between border border-[#222] bg-[#050505] p-5 gap-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
              <div className="text-[#666]">
                Showing{" "}
                <span className="text-white">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                -{" "}
                <span className="text-white">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                </span>{" "}
                of <span className="text-white">{totalItems}</span> telemetry
                records
              </div>
              <div className="flex items-center gap-3">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  variant="outline"
                  className="rounded-none border-[#333] hover:border-primary bg-[#111] hover:bg-primary hover:text-black font-mono text-[10px] uppercase h-10 px-5 disabled:opacity-30 transition-all font-bold"
                >
                  &lt;&lt; PREV
                </Button>
                <div className="border border-[#222] bg-[#111] h-10 px-5 flex items-center justify-center font-bold text-primary font-mono text-[11px]">
                  PAGE {currentPage} / {totalPages}
                </div>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  variant="outline"
                  className="rounded-none border-[#333] hover:border-primary bg-[#111] hover:bg-primary hover:text-black font-mono text-[10px] uppercase h-10 px-5 disabled:opacity-30 transition-all font-bold"
                >
                  NEXT &gt;&gt;
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      {/* Bounce animation keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `,
        }}
      />
    </div>
  );
}
