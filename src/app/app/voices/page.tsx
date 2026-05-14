"use client";

import {
  Activity,
  Filter,
  Globe2,
  LayoutGrid,
  Play,
  Plus,
  Search,
  Star,
  Terminal
} from "lucide-react";
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

export default function VoicesPage() {
  const library = [
    {
      name: "Marcus",
      gender: "MALE",
      accent: "EN-US",
      mood: "AUTHORITATIVE",
      type: "PRO",
      plays: "2.4M",
      desc: "Deep, resonant acoustic profile. Ideal for heavy exposition.",
      id: "VOX-01"
    },
    {
      name: "Elara",
      gender: "FEMALE",
      accent: "EN-UK",
      mood: "WARM",
      type: "STD",
      plays: "1.8M",
      desc: "High fidelity conversational tone with natural mid-range.",
      id: "VOX-02"
    },
    {
      name: "Kai",
      gender: "NEUTRAL",
      accent: "EN-AU",
      mood: "CASUAL",
      type: "STD",
      plays: "1.2M",
      desc: "Energetic frequency response. Optimized for broadcast.",
      id: "VOX-03"
    },
    {
      name: "Nadia",
      gender: "FEMALE",
      accent: "RU-RU",
      mood: "PROFESSIONAL",
      type: "PRO",
      plays: "980K",
      desc: "Strict timing parameters. Perfect for corporate instruction.",
      id: "VOX-04"
    },
    {
      name: "Theo",
      gender: "MALE",
      accent: "FR-FR",
      mood: "ROMANTIC",
      type: "STD",
      plays: "875K",
      desc: "Smooth velocity curve. Designed for narrative immersion.",
      id: "VOX-05"
    },
    {
      name: "Zara",
      gender: "FEMALE",
      accent: "NG-NG",
      mood: "ENERGETIC",
      type: "PRO",
      plays: "762K",
      desc: "High-amplitude delivery. Sharp transients for commercial impact.",
      id: "VOX-06"
    },
    {
      name: "Jin",
      gender: "MALE",
      accent: "KO-KR",
      mood: "CALM",
      type: "STD",
      plays: "640K",
      desc: "Low-noise, subdued output. Calibrated for ambient contexts.",
      id: "VOX-07"
    },
    {
      name: "Sofia",
      gender: "FEMALE",
      accent: "ES-ES",
      mood: "UPBEAT",
      type: "STD",
      plays: "590K",
      desc: "Clear articulation index. Suitable for semantic analysis tasks.",
      id: "VOX-08"
    },
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white font-sans selection:bg-primary selection:text-black pb-20">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-[1600px] mx-auto border-x border-[#222] min-h-screen">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-[#222] pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-8 font-mono text-xs uppercase text-primary">
              <Terminal className="w-3 h-3" />
              Database: Acoustic Models
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              VOICE <span className="text-primary">REGISTRY</span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="font-mono text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
              Access the global repository of parameterized neural voices.
            </p>
            <Button className="rounded-none bg-primary text-black hover:bg-white border border-primary font-mono text-xs uppercase tracking-widest h-10 px-6 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> ADD_MODEL
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="border border-[#222] bg-[#050505] p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <Input
                placeholder="QUERY_DATABASE..."
                className="pl-12 bg-[#111] border-[#333] h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary w-full font-mono uppercase placeholder:text-[#555] text-white"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 shrink-0 min-w-0">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] shrink-0 bg-[#111] border-[#333] h-14 rounded-none focus:ring-primary font-mono uppercase text-white">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <Globe2 className="w-4 h-4 text-primary shrink-0" />{" "}
                    <SelectValue placeholder="LOCALE" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                  <SelectItem value="all" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">ALL_LOCALES</SelectItem>
                  <SelectItem value="en" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">EN_US</SelectItem>
                  <SelectItem value="es" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">ES_ES</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] shrink-0 bg-[#111] border-[#333] h-14 rounded-none focus:ring-primary font-mono uppercase text-white">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <Filter className="w-4 h-4 text-primary shrink-0" />{" "}
                    <SelectValue placeholder="CLASS" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                  <SelectItem value="all" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">ALL_CLASSES</SelectItem>
                  <SelectItem value="pro" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">PRO_TIER</SelectItem>
                  <SelectItem value="standard" className="focus:bg-primary focus:text-black rounded-none cursor-pointer">STD_TIER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Voices Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-full">
          {library.map((voice) => (
            <div
              key={voice.name}
              className="group relative border border-[#222] bg-[#050505] hover:bg-[#0a0a0a] transition-colors flex flex-col w-full max-w-full overflow-hidden"
            >
              {/* Top Banner */}
              <div className="h-10 w-full border-b border-[#222] bg-[#111] flex items-center justify-between px-4">
                <span className="font-mono text-[10px] text-[#666] uppercase">{voice.id}</span>
                <div className="flex items-center gap-2">
                  {voice.type === "PRO" && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-black bg-primary px-1.5 py-0.5">
                      PRO
                    </span>
                  )}
                  <Star className="w-3.5 h-3.5 text-[#555] group-hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-[#111] border border-[#333] flex items-center justify-center font-heading font-black text-2xl text-white group-hover:border-primary transition-colors">
                    {voice.name[0]}
                  </div>
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-none bg-primary hover:bg-white text-black transition-colors outline-none border border-primary"
                  >
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </Button>
                </div>

                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2 group-hover:text-primary transition-colors">{voice.name}</h3>
                
                <div className="flex gap-2 mb-4">
                  <span className="font-mono text-[10px] text-primary border border-primary/30 px-1.5 py-0.5">{voice.accent}</span>
                  <span className="font-mono text-[10px] text-[#888] border border-[#333] px-1.5 py-0.5">{voice.gender}</span>
                </div>

                <p className="font-mono text-xs text-[#888] uppercase leading-relaxed flex-1">
                  {voice.desc}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#555] border border-[#333] px-2 py-1">
                  {voice.mood}
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] text-[#666]">
                  <Activity className="w-3 h-3 text-primary" />
                  {voice.plays}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
