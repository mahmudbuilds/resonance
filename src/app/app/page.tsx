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
  Terminal,
  Cpu,
  Radio,
  Loader2, // Added for high-tech loading spinners
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

  // External convex requests
  const numberOfUserGenerations = useQuery(api.voice.getNumberOfGenerations);
  const numberOfUserVoices = useQuery(api.voice.getNumberOfUserVoices);
  const topVoices = useQuery(api.voice.getTopVoices);

  // Determine if specific segments are still loading
  const isTelemetryLoading =
    numberOfUserGenerations === undefined || numberOfUserVoices === undefined;
  const isRegistryLoading = topVoices === undefined;

  const features = [
    {
      title: "Text to Speech",
      description:
        "Parametric synthesis engine. Generate studio-quality audio with precise emotional control.",
      icon: AudioLines,
      href: "/app/text-to-speech",
      id: "MDL-01",
    },
    {
      title: "Voice Library",
      description:
        "Access a global registry of 140+ neural voice models spanning 40+ languages.",
      icon: Volume2,
      href: "/app/voices",
      id: "MDL-02",
    },
    {
      title: "Voice Cloning",
      description:
        "Neural acoustic extraction. Replicate vocal signatures from minimal sample data.",
      icon: Mic2,
      href: "/app/voice-cloning",
      id: "MDL-03",
    },
  ];

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      toast.success("ACTIVE VOICE LOADED INTO SPEECH MODULE");
      router.push("/app/text-to-speech");
    }
  };

  const showcaseVoices: Doc<"voices">[] = (topVoices as Doc<"voices">[]) || [];

  const stats = [
    { label: "SYS.LOAD", value: "84%", change: "+12.4%", loading: false },
    {
      label: "GENERATIONS",
      value:
        numberOfUserGenerations !== undefined
          ? String(numberOfUserGenerations)
          : "0",
      change: "NOMINAL",
      loading: numberOfUserGenerations === undefined,
    },
    {
      label: "ACTIVE MODELS",
      value:
        numberOfUserVoices !== undefined ? String(numberOfUserVoices) : "0",
      change: "SYNCED",
      loading: numberOfUserVoices === undefined,
    },
  ];

  // Verified target locale matrix
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 border-b border-[#222] pb-8 sm:pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
            <Radio className="w-3 h-3 animate-pulse" />
            Terminal Session Active
          </div>
          <div className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-white">
            <UserGreeting />
          </div>
          <p className="font-mono text-xs sm:text-sm text-[#888] max-w-2xl uppercase leading-relaxed tracking-wider">
            Welcome to the command center. System telemetry is nominal. All
            synthesis modules online and ready for input.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="mb-16 sm:mb-20">
          <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-[#222] pb-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Core Modules
            </h2>
            <Link
              href="/app/text-to-speech"
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888] hover:text-primary transition-colors flex items-center gap-2"
            >
              Execute <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block"
              >
                <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 h-full transition-all duration-300 hover:border-primary hover:bg-[#0a0a0a] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 font-mono text-[10px] sm:text-xs text-[#444] group-hover:text-primary transition-colors">
                    [{feature.id}]
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#111] border border-[#333] flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-bold uppercase mb-3 text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#888] leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#555] group-hover:text-primary transition-colors">
                    Initialize <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16 sm:mb-20">
          {/* Active Voice Registry */}
          <section className="lg:col-span-8 border border-[#222] bg-[#050505]">
            <div className="p-4 sm:p-6 border-b border-[#222] flex items-center justify-between bg-[#0a0a0a]">
              <h2 className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Active Voice Registry
              </h2>
              <Link
                href="/app/voices"
                className="font-mono text-[10px] sm:text-xs text-primary hover:underline"
              >
                VIEW_ALL
              </Link>
            </div>

            <div className="divide-y divide-[#222]">
              {isRegistryLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#555] font-mono text-xs uppercase">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span>Fetching remote matrix models...</span>
                </div>
              ) : showcaseVoices.length === 0 ? (
                <div className="p-12 text-center text-[#555] font-mono text-xs uppercase">
                  No active voice profiles synced.
                </div>
              ) : (
                showcaseVoices.map((voice, i) => (
                  <div
                    key={voice.displayName}
                    className="p-4 sm:p-6 hover:bg-[#0a0a0a] transition-colors flex items-center gap-4 group cursor-pointer"
                  >
                    {/* Visual Indicator Container */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#333] bg-[#111] flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all shrink-0 relative overflow-hidden">
                      <span className="font-mono font-bold text-xs sm:text-sm text-white group-hover:opacity-0 transition-opacity absolute">
                        0{i + 1}
                      </span>
                      <Play
                        onClick={() => {
                          if (!voice.inworldVoiceId) {
                            return;
                          }
                          handleUseVoice(voice.inworldVoiceId);
                        }}
                        className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity absolute fill-black"
                      />
                    </div>

                    {/* Clean Content Fields Grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                      <div className="min-w-0">
                        <div className="font-heading font-bold uppercase text-sm sm:text-base text-white group-hover:text-primary transition-colors truncate">
                          {voice.displayName}
                        </div>
                        <div className="font-mono text-[9px] sm:text-[10px] text-[#666]">
                          {voice.langCode}
                        </div>
                      </div>

                      <div className="hidden sm:block font-mono text-[10px] sm:text-xs text-[#888]">
                        Tags:{" "}
                        <span className="text-white">
                          {voice.tags?.join(", ")}
                        </span>
                      </div>

                      <div className="flex justify-end sm:justify-start items-center gap-2 font-mono text-[10px] sm:text-xs">
                        <Activity className="w-3 h-3 text-[#555] group-hover:text-primary transition-colors" />
                        <span className="text-[#888] group-hover:text-white transition-colors">
                          {voice.playCount || 0} PLAY
                          {voice.playCount === 1 ? "" : "S"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Activity Overview / Telemetry */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-[#222] bg-[#050505] p-6 h-full flex flex-col">
              <h2 className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white mb-6 border-b border-[#222] pb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Telemetry
              </h2>

              <div className="flex-1 flex flex-col justify-between gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="border border-[#222] p-4 bg-[#0a0a0a] relative overflow-hidden group min-h-[82px] flex flex-col justify-center"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#222] group-hover:bg-primary transition-colors" />

                    {stat.loading ? (
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#444] uppercase">
                        <span className="tracking-wider">{stat.label}</span>
                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="font-mono text-[9px] sm:text-[10px] text-[#666] mb-1">
                            {stat.label}
                          </div>
                          <div className="font-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                            {stat.value}
                          </div>
                        </div>
                        <div className="font-mono text-[9px] sm:text-[10px] text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                          {stat.change}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Global Languages - Full width with custom high-tech edge fading masks */}
        <section className="border border-[#222] bg-[#050505] w-full overflow-hidden">
          <div className="border-b border-[#222] p-4 bg-[#0a0a0a] flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white">
              Supported Matrix Locales
            </h2>
          </div>
          
          <div className="relative py-4 sm:py-5 flex items-center">
            {/* Visual gradient mask overlays to soften scrolling cuts */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />
            
            <div className="flex shrink-0 animate-[marquee_25s_linear_infinite] gap-4 md:gap-6 px-4">
              {targetLocales.map((lang, idx) => (
                <div
                  key={idx}
                  className="font-mono text-[10px] sm:text-xs border border-[#222] bg-[#111] px-4 py-2 text-[#888] hover:text-primary hover:border-primary transition-colors cursor-default whitespace-nowrap tracking-wider"
                >
                  {lang}
                </div>
              ))}
              {targetLocales.map((lang, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="font-mono text-[10px] sm:text-xs border border-[#222] bg-[#111] px-4 py-2 text-[#888] hover:text-primary hover:border-primary transition-colors cursor-default whitespace-nowrap tracking-wider"
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