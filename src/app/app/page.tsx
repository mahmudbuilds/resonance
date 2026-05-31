"use client";

import {
  Activity,
  ArrowRight,
  AudioLines,
  ChevronRight,
  Globe,
  Mic2,
  Play,
  Volume2,
  Cpu,
  Radio,
  Loader2,
  Music,
} from "lucide-react";
import Link from "next/link";
import UserGreeting from "@/components/dashboard/UserGreeting";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  // External data requests
  const numberOfUserGenerations = useQuery(api.voice.getNumberOfGenerations);
  const numberOfUserVoices = useQuery(api.voice.getNumberOfUserVoices);
  const topVoices = useQuery(api.voice.getTopVoices);

  const isRegistryLoading = topVoices === undefined;

  const features = [
    {
      title: "Text to Speech",
      description:
        "Generate stunning, fluid voiceovers and narrative tracks with premium vocal textures.",
      icon: AudioLines,
      href: "/app/text-to-speech",
      id: "01",
    },
    {
      title: "Voice Library",
      description:
        "Access a beautifully curated collection of high-fidelity voices spanning multiple languages.",
      icon: Volume2,
      href: "/app/voices",
      id: "02",
    },
    {
      title: "Voice Cloning",
      description:
        "Create a tailored dynamic replica of a specific voice using minimal sample audio.",
      icon: Mic2,
      href: "/app/voice-cloning",
      id: "03",
    },
  ];

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      toast.success("VOCAL STYLE LOADED SUCCESSFULLY");
      router.push("/app/text-to-speech");
    }
  };

  const showcaseVoices: Doc<"voices">[] = (topVoices as Doc<"voices">[]) || [];

  const stats = [
    {
      label: "TOTAL AUDIO GENERATIONS",
      value:
        numberOfUserGenerations !== undefined
          ? String(numberOfUserGenerations)
          : "0",
      status: "ACTIVE",
      loading: numberOfUserGenerations === undefined,
    },
    {
      label: "MY CUSTOM SAVED VOICES",
      value:
        numberOfUserVoices !== undefined ? String(numberOfUserVoices) : "0",
      status: "READY",
      loading: numberOfUserVoices === undefined,
    },
  ];

  const targetLocales = [
    "AR-SA",
    "EN-US",
    "ES-ES",
    "HE-IL",
    "HI-IN",
    "JA-JP",
    "KO-KR",
    "PL-PL",
    "ZH-CN",
  ];

  return (
    <div className="min-h-screen bg-[#0b0908] text-[#fcfbf7] font-body relative selection:bg-[#e0a96d]/20 selection:text-[#e0a96d] pb-20">
      
      {/* Editorial Fluid Light Sculpture Background Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-[#e0a96d]/5 to-transparent blur-3xl" />
        <div className="absolute bottom-[5%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#948880]/3 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Clean Editorial Greeting Header */}
        <header className="mb-14 pt-12 border-b border-white/5 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/[0.02] border border-white/5 mb-6 text-[10px] tracking-[0.2em] uppercase text-[#e0a96d]">
            <Radio className="w-3 h-3 text-[#e0a96d] animate-pulse" />
            Atelier Studio Connected
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            <UserGreeting />
          </h1>
          <p className="text-sm text-[#948880] max-w-2xl font-light leading-relaxed">
            Welcome to your creative dashboard. Your digital narration space is active, fully prepared, and waiting for your next text input.
          </p>
        </header>

        {/* Studio Features Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="font-sans text-lg tracking-wider text-white flex items-center gap-3 font-light">
              <Cpu className="w-4 h-4 text-[#e0a96d]" />
              Creative Studio Workspaces
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group block">
                <div className="silk-panel rounded-[2rem] p-8 h-full transition-all duration-500 border border-white/5 bg-[#0e0c0b] hover:border-[#e0a96d]/30 hover:bg-white/[0.01] relative flex flex-col justify-between group min-h-[260px]">
                  
                  <div className="absolute top-6 right-8 font-sans text-[11px] tracking-wider text-[#444] group-hover:text-[#e0a96d] transition-colors">
                    Studio Card {feature.id}
                  </div>

                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-center group-hover:border-[#e0a96d]/20 group-hover:bg-[#e0a96d]/5 transition-all">
                      <feature.icon className="w-5 h-5 text-white/80 group-hover:text-[#e0a96d] transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-sans text-lg font-light tracking-tight text-white group-hover:text-[#e0a96d] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#948880] leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 font-sans text-[11px] tracking-wider text-[#555] group-hover:text-white transition-colors">
                    Open Tool <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Voice Discovery and Activity Trackers */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          
          {/* Curated Voice Profiles Portfolio */}
          <section className="lg:col-span-8 silk-panel rounded-[2.5rem] bg-[#0e0c0b] border border-white/5 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.005]">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 font-medium">
                <Music className="w-4 h-4 text-[#e0a96d]" />
                Featured Voice Styles
              </h2>
              <Link href="/app/voices" className="text-[11px] uppercase tracking-wider text-[#e0a96d] hover:text-white transition-colors font-medium">
                Browse Full Library
              </Link>
            </div>

            <div className="divide-y divide-white/5 flex-1 flex flex-col justify-center">
              {isRegistryLoading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3 text-[#948880] font-sans text-xs tracking-wider">
                  <Loader2 className="w-5 h-5 text-[#e0a96d] animate-spin" />
                  <span>Loading vocal profiles...</span>
                </div>
              ) : showcaseVoices.length === 0 ? (
                <div className="p-16 text-center text-[#948880] font-sans text-xs tracking-wider italic">
                  No voice profiles are available at this moment.
                </div>
              ) : (
                showcaseVoices.map((voice, i) => (
                  <div
                    key={i}
                    onClick={() => voice.inworldVoiceId && handleUseVoice(voice.inworldVoiceId)}
                    className="p-5 hover:bg-white/[0.01] transition-all duration-300 flex items-center gap-5 group cursor-pointer"
                  >
                    {/* Activation Icon Button Container */}
                    <div className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-center group-hover:border-[#e0a96d]/40 group-hover:bg-[#e0a96d] transition-all shrink-0 relative overflow-hidden">
                      <span className="font-sans text-xs text-[#948880] group-hover:opacity-0 transition-opacity absolute">
                        0{i + 1}
                      </span>
                      <Play className="w-3.5 h-3.5 text-[#0b0908] opacity-0 group-hover:opacity-100 transition-opacity absolute fill-[#0b0908]" />
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                      <div className="min-w-0">
                        <div className="font-sans text-sm font-medium text-white group-hover:text-[#e0a96d] transition-colors truncate">
                          {voice.displayName}
                        </div>
                        <div className="font-sans text-[10px] text-[#555] mt-0.5">
                          Language Code: {voice.langCode}
                        </div>
                      </div>

                      <div className="hidden sm:block font-sans text-xs text-[#948880] font-light truncate">
                        Tone: <span className="text-white/70">{voice.tags?.join(", ")}</span>
                      </div>

                      <div className="flex justify-end sm:justify-start items-center gap-2 font-sans text-xs tracking-wide">
                        <Activity className="w-3.5 h-3.5 text-[#444] group-hover:text-[#e0a96d] transition-colors" />
                        <span className="text-[#948880] group-hover:text-white transition-colors">
                          {voice.playCount || 0} listen{voice.playCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Simple Studio Activity Stats */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="silk-panel rounded-[2.5rem] bg-[#0e0c0b] border border-white/5 p-6 h-full flex flex-col justify-between">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-[#e0a96d]" />
                Studio Activity
              </h2>

              <div className="flex-1 flex flex-col justify-center gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/5 rounded-2xl p-5 bg-white/[0.005] relative overflow-hidden group min-h-[90px] flex flex-col justify-center transition-all duration-500 hover:border-[#e0a96d]/20"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 group-hover:bg-[#e0a96d] transition-colors" />

                    {stat.loading ? (
                      <div className="flex items-center justify-between font-sans text-[11px] text-[#555] tracking-wide">
                        <span>{stat.label}</span>
                        <Loader2 className="w-3.5 h-3.5 text-[#e0a96d] animate-spin" />
                      </div>
                    ) : (
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="font-sans text-[10px] tracking-wider text-[#666] uppercase mb-1">
                            {stat.label}
                          </div>
                          <div className="font-sans text-2xl font-light text-white group-hover:text-[#e0a96d] transition-colors tracking-tight">
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-[10px] tracking-widest text-[#e0a96d] bg-[#e0a96d]/5 px-2.5 py-1 rounded-md border border-[#e0a96d]/10 font-sans font-medium">
                          {stat.status}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Global Languages Ribbon Strip */}
        <section className="silk-panel rounded-[2rem] bg-[#0e0c0b] border border-white/5 w-full overflow-hidden">
          <div className="border-b border-white/5 p-4 bg-white/[0.005] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#e0a96d]" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-white font-medium">
              Supported Accent Regions
            </h2>
          </div>
          
          <div className="relative py-5 flex items-center">
            {/* Visual gradient mask overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0e0c0b] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0e0c0b] to-transparent z-20 pointer-events-none" />
            
            <div className="flex shrink-0 animate-[marquee_30s_linear_infinite] gap-5 px-4">
              {targetLocales.map((lang, idx) => (
                <div
                  key={idx}
                  className="font-sans text-xs border border-white/5 bg-white/[0.01] px-5 py-2.5 rounded-xl text-[#948880] hover:text-[#e0a96d] hover:border-[#e0a96d]/20 transition-all cursor-default whitespace-nowrap tracking-widest"
                >
                  {lang}
                </div>
              ))}
              {targetLocales.map((lang, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="font-sans text-xs border border-white/5 bg-white/[0.01] px-5 py-2.5 rounded-xl text-[#948880] hover:text-[#e0a96d] hover:border-[#e0a96d]/20 transition-all cursor-default whitespace-nowrap tracking-widest"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `,
        }}
      />
    </div>
  );
}