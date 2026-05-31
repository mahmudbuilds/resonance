"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  Filter,
  Globe2,
  LayoutGrid,
  List,
  Play,
  Plus,
  Search,
  Star,
  History,
  Music,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const library = [
    { displayName: "Aanya", langCode: "HI_IN", mood: "BALANCED", plays: "0", description: "A professional adult female with a clear, formal, and authoritative voice, speaking Hindi in a studio environment." },
    { displayName: "Aarav", langCode: "HI_IN", mood: "BALANCED", plays: "0", description: "A thoughtful adult male with an Indian accent speaking earnestly in a room with some background hum." },
    { displayName: "Abby", langCode: "EN_US", mood: "BALANCED", plays: "3", description: "Bright, eager American female child voice, ideal for animated characters, upbeat educational content, and lively kids' commercials." },
    { displayName: "Alain", langCode: "FR_FR", mood: "BALANCED", plays: "0", description: "Deep, smooth middle-aged male French voice. Composed and calm." },
    { displayName: "Marcus", langCode: "EN_US", mood: "AUTHORITATIVE", plays: "12K", description: "Deep, resonant acoustic profile. Ideal for heavy cinematic exposition." },
    { displayName: "Elara", langCode: "EN_UK", mood: "WARM", plays: "8K", description: "High fidelity conversational tone with natural mid-range presentation." },
    { displayName: "Kai", langCode: "EN_AU", mood: "CASUAL", plays: "950", description: "Energetic frequency response. Optimized for modern broadcast streams." },
    { displayName: "Nadia", langCode: "RU_RU", mood: "PROFESSIONAL", plays: "4.1K", description: "Strict timing parameters. Perfect for pristine corporate instructions." }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeTab, setActiveTab] = useState("registry");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Convex Queries
  const voices = useQuery(api.voice.getUserVoices);
  const generations = useQuery(api.inworld.listUserGenerations);

  const voicesList: any[] = voices && voices.length > 0 ? voices : library;

  const handleUseVoice = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(id));
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

  const filteredVoices = voicesList.filter((voice: any) => {
    const name = voice.displayName || voice.name || "";
    const desc = voice.description || voice.desc || "";
    const searchMatch = searchQuery === "" || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const accent = voice.langCode || voice.accent || "";
    const localeMatch = selectedLocale === "all" || accent.toLowerCase().startsWith(selectedLocale.toLowerCase());

    const isCloned = voice.isCloned || voice.source === "cloned" || false; 
    const classMatch = selectedClass === "all" || 
      (selectedClass === "public" && !isCloned) ||
      (selectedClass === "cloned" && isCloned);

    return searchMatch && localeMatch && classMatch;
  });

  return (
    <div className="min-h-screen w-full bg-[#0a0807] text-stone-100 font-sans pb-32 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-10 space-y-8 sm:space-y-10">
        
        {/* Header Block */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2 w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-full font-medium text-[10px] tracking-widest uppercase text-[#e0a96d]">
              <Sparkles className="w-3 h-3" /> Atelier Audio Studio
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight uppercase text-stone-100">
              Voice <span className="text-[#e0a96d] font-serif italic normal-case tracking-normal">Library</span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <p className="text-xs text-stone-400 max-w-sm font-light leading-relaxed">
              Explore your refined repository of highly parameterized neural voice profiles built for creative narration.
            </p>
            <Button
              asChild
              className="rounded-full bg-[#e0a96d] text-[#0a0807] hover:bg-stone-100 font-sans text-xs tracking-wider h-10 px-5 transition-all duration-300 font-medium shrink-0 w-full sm:w-auto text-center justify-center"
            >
              <Link href="/app/voice-cloning">
                <Plus className="w-4 h-4 mr-1" /> Clone Custom Voice
              </Link>
            </Button>
          </div>
        </header>

        {/* Controls Switcher Bar */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-white/5 pb-4">
            <TabsList className="bg-stone-900/40 backdrop-blur-md p-1 rounded-xl sm:rounded-full h-10 w-full sm:w-[280px] flex border border-white/5">
              <TabsTrigger
                value="registry"
                className="flex-1 rounded-lg sm:rounded-full data-[state=active]:bg-white/[0.05] data-[state=active]:text-[#e0a96d] text-xs h-full gap-2 transition-all"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Profiles</span>
              </TabsTrigger>
              <TabsTrigger
                value="generations"
                className="flex-1 rounded-lg sm:rounded-full data-[state=active]:bg-white/[0.05] data-[state=active]:text-[#e0a96d] text-xs h-full gap-2 transition-all"
              >
                <History className="w-3.5 h-3.5" />
                <span>History Logs</span>
                {generations && generations.length > 0 && (
                  <span className="text-[10px] bg-white/5 text-stone-400 px-1.5 rounded-full">
                    {generations.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Layout Switchers */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center gap-1 border border-white/5 bg-stone-900/20 p-1 rounded-xl">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/[0.05] text-[#e0a96d]" : "text-stone-400"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setViewMode("list")}
                  className={`h-8 w-8 rounded-lg transition-all ${viewMode === "list" ? "bg-white/[0.05] text-[#e0a96d]" : "text-stone-400"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {viewMode === "grid" && filteredVoices.length > 0 && activeTab === "registry" && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("left")}
                    className="h-8 w-8 rounded-full bg-stone-900/40 border-white/5 hover:border-[#e0a96d]/40 text-stone-400 hover:text-[#e0a96d] transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("right")}
                    className="h-8 w-8 rounded-full bg-stone-900/40 border-white/5 hover:border-[#e0a96d]/40 text-stone-400 hover:text-[#e0a96d] transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Filtering Dropdowns */}
          {activeTab === "registry" && (
            <div className="border border-white/5 bg-[#110f0e] rounded-2xl p-4 relative z-50 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <Input
                    placeholder="Search across neural attributes and profiles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-white/[0.01] border-white/5 h-11 rounded-xl text-sm placeholder:text-stone-600 focus-visible:ring-[#e0a96d]/20 transition-all w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 w-full lg:w-auto">
                  {/* Locale Dropdown with Active Vertical Scrolling */}
                  <Select value={selectedLocale} onValueChange={setSelectedLocale}>
                    <SelectTrigger className="w-full lg:w-[180px] bg-white/[0.02] border-white/5 h-11 rounded-xl text-stone-300 text-xs px-4 focus:ring-1 focus:ring-[#e0a96d]/30">
                      <div className="flex items-center gap-2 truncate">
                        <Globe2 className="w-3.5 h-3.5 text-[#e0a96d] shrink-0" />
                        <SelectValue placeholder="Locales" />
                      </div>
                    </SelectTrigger>
                    
                    <SelectContent 
                      position="popper" 
                      sideOffset={8}
                      className="w-[210px] max-h-[240px] overflow-y-auto bg-[#141211] border border-white/10 rounded-xl text-stone-300 text-xs shadow-2xl z-[100] p-2.5 space-y-1"
                    >
                      <SelectItem value="all" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">All Locales</SelectItem>
                      <SelectItem value="en" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">English (EN)</SelectItem>
                      <SelectItem value="fr" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Français (FR)</SelectItem>
                      <SelectItem value="hi" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Hindi (HI)</SelectItem>
                      <SelectItem value="es" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Español (ES)</SelectItem>
                      <SelectItem value="de" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Deutsch (DE)</SelectItem>
                      <SelectItem value="ja" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">日本語 (JA)</SelectItem>
                      <SelectItem value="it" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Italiano (IT)</SelectItem>
                      <SelectItem value="zh" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">中文 (ZH)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Class Dropdown */}
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full lg:w-[180px] bg-white/[0.02] border-white/5 h-11 rounded-xl text-stone-300 text-xs px-4 focus:ring-1 focus:ring-[#e0a96d]/30">
                      <div className="flex items-center gap-2 truncate">
                        <Filter className="w-3.5 h-3.5 text-[#e0a96d] shrink-0" />
                        <SelectValue placeholder="Classes" />
                      </div>
                    </SelectTrigger>
                    
                    <SelectContent 
                      position="popper"
                      sideOffset={8}
                      className="w-[210px] bg-[#141211] border border-white/10 rounded-xl text-stone-300 text-xs shadow-2xl z-[100] p-2.5 space-y-1"
                    >
                      <SelectItem value="all" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">All Classes</SelectItem>
                      <SelectItem value="public" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Public Studio</SelectItem>
                      <SelectItem value="cloned" className="cursor-pointer rounded-lg px-4 py-3 text-left focus:bg-white/5 focus:text-[#e0a96d] transition-colors outline-none">Cloned Voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Voices Registry Content */}
          <TabsContent value="registry" className="mt-0 outline-none relative z-10 w-full">
            {voices === undefined ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border border-white/5 bg-[#110f0e] rounded-2xl">
                <Loader2 className="w-5 h-5 text-[#e0a96d] animate-spin" />
                <span className="text-xs text-stone-400 font-light">Syncing global audio library...</span>
              </div>
            ) : filteredVoices.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 bg-[#110f0e] rounded-2xl">
                <Music className="w-7 h-7 text-stone-600 mx-auto mb-2" />
                <p className="text-xs text-stone-400">No active parameters match your search filters.</p>
              </div>
            ) : viewMode === "list" ? (
              /* Data Table View */
              <div className="border border-white/5 bg-[#110f0e] rounded-[24px] overflow-hidden shadow-2xl w-full">
                <div className="w-full overflow-x-auto block alignment-scroller">
                  <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-[11px] tracking-wider text-stone-400 uppercase font-light">
                        <th className="pl-8 pr-4 py-5 font-normal w-16">Avatar</th>
                        <th className="px-6 py-5 font-normal w-40">Name</th>
                        <th className="px-6 py-5 font-normal w-32">Locale Accent</th>
                        <th className="px-6 py-5 font-normal">Vocal Description</th>
                        <th className="px-6 py-5 font-normal text-right w-32">Studio Plays</th>
                        <th className="pl-4 pr-8 py-5 text-right font-normal w-28">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-stone-300 font-light">
                      {filteredVoices.map((voice: any, i) => {
                        const isCloned = voice.isCloned || voice.source === "cloned";
                        return (
                          <tr key={i} className="hover:bg-white/[0.01] transition-all group duration-200">
                            <td className="pl-8 pr-4 py-4">
                              <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-xs font-semibold">
                                {(voice.displayName || voice.name || "U")[0]}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stone-100">{voice.displayName || voice.name}</span>
                                <span className={`text-[9px] tracking-wider uppercase font-medium px-1.5 py-0.5 rounded ${isCloned ? 'bg-amber-500/10 text-amber-400' : 'bg-[#e0a96d]/10 text-[#e0a96d]'}`}>
                                  {isCloned ? "Cloned" : "Public"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#e0a96d] font-mono">{voice.langCode || voice.accent}</td>
                            <td className="px-6 py-4 text-stone-400 max-w-md xl:max-w-xl truncate">{voice.description || voice.desc}</td>
                            <td className="px-6 py-4 text-right text-stone-200 font-mono">{voice.plays || "0"}</td>
                            <td className="pl-4 pr-8 py-4 text-right">
                              <Button
                                size="sm"
                                onClick={() => handleUseVoice(voice.inworldVoiceId || voice.id)}
                                className="rounded-xl bg-[#e0a96d]/10 text-[#e0a96d] hover:bg-[#e0a96d] hover:text-[#0a0807] text-xs px-5 h-8 border border-[#e0a96d]/20 transition-all duration-300"
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
              /* Carousel Grid View */
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth md:scrollbar-none w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredVoices.map((voice: any, i) => {
                  const voiceName = voice.displayName || voice.name || "Unknown";
                  const isCloned = voice.isCloned || voice.source === "cloned";
                  return (
                    <div
                      key={i}
                      className="snap-start shrink-0 w-full sm:w-[310px] rounded-[24px] border border-white/5 bg-[#110f0e] hover:bg-[#161311] transition-all duration-300 hover:border-[#e0a96d]/30 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    >
                      <div className="pt-6 px-6 pb-2 flex items-center justify-between">
                        <span className={`text-[10px] tracking-widest uppercase font-medium ${isCloned ? 'text-amber-400/80' : 'text-[#e0a96d]/80'}`}>
                          • {isCloned ? "Cloned Voice" : "Public Studio"}
                        </span>
                        <Star className="w-3.5 h-3.5 text-stone-600 hover:text-[#e0a96d] cursor-pointer transition-colors" />
                      </div>

                      <div className="px-6 pt-3 pb-6 flex flex-col gap-4 flex-1">
                        <div className="flex justify-between items-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center font-sans font-semibold text-lg text-stone-200">
                            {voiceName[0]}
                          </div>
                          <Button
                            size="icon"
                            onClick={() => handleUseVoice(voice.inworldVoiceId || voice.id)}
                            className="h-10 w-10 rounded-full bg-[#e0a96d]/10 text-[#e0a96d] hover:bg-[#e0a96d] hover:text-[#0a0807] border border-[#e0a96d]/20 transition-all duration-300"
                          >
                            <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                          </Button>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-xl font-normal text-stone-100 tracking-wide truncate">
                            {voiceName}
                          </h3>
                          <div className="flex gap-1.5">
                            <span className="font-mono text-[9px] text-[#e0a96d] border border-[#e0a96d]/10 px-1.5 py-0.5 rounded bg-[#e0a96d]/5">
                              {voice.langCode || voice.accent}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-light text-stone-400 leading-relaxed pt-3 border-t border-white/5 min-h-[72px] line-clamp-3">
                          {voice.description || voice.desc}
                        </p>
                      </div>

                      <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] text-stone-400 font-light">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 uppercase tracking-widest font-mono text-[9px]">
                          {voice.mood?.toLowerCase() || "BALANCED"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#e0a96d]" /> {voice.plays || "0"} plays
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* History Logs Content */}
          <TabsContent value="generations" className="mt-0 outline-none relative z-10 w-full">
            {generations === undefined ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border border-white/5 bg-[#110f0e] rounded-2xl">
                <Loader2 className="w-5 h-5 text-[#e0a96d] animate-spin" />
                <span className="text-xs text-stone-400 font-light">Fetching generation history...</span>
              </div>
            ) : generations.length === 0 ? (
              <div className="text-center py-28 border border-dashed border-white/10 bg-[#110f0e] rounded-[24px] px-4">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-5 h-5 text-stone-500" />
                </div>
                <h3 className="text-sm font-medium text-stone-200 mb-1">No History Logs</h3>
                <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
                  You haven't generated any audio tracks yet. Use the speech module to synthesize voices and your logs will appear here.
                </p>
              </div>
            ) : (
              <div className="border border-white/5 bg-[#110f0e] rounded-[24px] overflow-hidden shadow-2xl w-full">
                 <div className="p-10 text-center text-xs text-stone-400">
                    History logs populated ({generations.length} items)
                 </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}