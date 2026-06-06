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
  Sparkles,
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
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/20",
      hoverBgClass: "group-hover:bg-primary/20",
      hoverBorderClass: "group-hover:border-primary/30",
      href: "/app/text-to-speech",
    },
    {
      title: "Voice Library",
      description:
        "Access a beautifully curated collection of high-fidelity voices spanning multiple languages.",
      icon: Volume2,
      colorClass: "text-sky-400",
      bgClass: "bg-sky-500/10",
      borderClass: "border-sky-500/20",
      hoverBgClass: "group-hover:bg-sky-500/20",
      hoverBorderClass: "group-hover:border-sky-500/30",
      href: "/app/voices",
    },
    {
      title: "Voice Cloning",
      description:
        "Create a tailored dynamic replica of a specific voice using minimal sample audio.",
      icon: Mic2,
      colorClass: "text-pink-400",
      bgClass: "bg-pink-500/10",
      borderClass: "border-pink-500/20",
      hoverBgClass: "group-hover:bg-pink-500/20",
      hoverBorderClass: "group-hover:border-pink-500/30",
      href: "/app/voice-cloning",
    },
  ];

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      toast.success("Voice loaded successfully!");
      router.push("/app/text-to-speech");
    }
  };

  const showcaseVoices: Doc<"voices">[] = (topVoices as Doc<"voices">[]) || [];

  const stats = [
    {
      label: "TOTAL GENERATIONS",
      value:
        numberOfUserGenerations !== undefined
          ? String(numberOfUserGenerations)
          : "0",
      status: "Active",
      loading: numberOfUserGenerations === undefined,
    },
    {
      label: "CUSTOM SAVED VOICES",
      value:
        numberOfUserVoices !== undefined ? String(numberOfUserVoices) : "0",
      status: "Ready",
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
    <div className="min-h-screen text-foreground font-sans relative selection:bg-primary/20 selection:text-white pb-20">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 animate-fade-up">
        
        {/* Clean Editorial Greeting Header */}
        <header className="mb-14 pt-12 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 text-xs font-medium text-primary">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Studio Connected
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            <UserGreeting />
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl font-normal leading-relaxed">
            Welcome to your creative dashboard. Your digital narration space is active, fully prepared, and waiting for your next text input.
          </p>
        </header>

        {/* Studio Features Section */}
        <section className="mb-16 stagger-1">
          <div className="flex items-center justify-between mb-8 pb-2">
            <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary" />
              Creative Workspaces
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group block">
                <div className="glass-card rounded-[2rem] p-8 h-full flex flex-col justify-between min-h-[260px]">
                  
                  <div className="space-y-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${feature.bgClass} ${feature.borderClass} border ${feature.hoverBgClass} ${feature.hoverBorderClass}`}>
                      <feature.icon className={`w-6 h-6 transition-colors ${feature.colorClass}`} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-semibold text-white group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 font-sans text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Open Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Voice Discovery and Activity Trackers */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 stagger-2">
          
          {/* Curated Voice Profiles Portfolio */}
          <section className="lg:col-span-8 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Featured Voice Styles
              </h2>
              <Link href="/app/voices" className="text-xs font-medium text-primary hover:text-white transition-colors">
                Browse Full Library
              </Link>
            </div>

            <div className="divide-y divide-white/5 flex-1 flex flex-col justify-center">
              {isRegistryLoading ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground font-sans text-sm">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span>Loading profiles...</span>
                </div>
              ) : showcaseVoices.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground font-sans text-sm">
                  No voice profiles are available at this moment.
                </div>
              ) : (
                showcaseVoices.map((voice, i) => (
                  <div
                    key={i}
                    onClick={() => voice.inworldVoiceId && handleUseVoice(voice.inworldVoiceId)}
                    className="p-5 hover:bg-white/[0.03] transition-all duration-300 flex items-center gap-5 group cursor-pointer"
                  >
                    {/* Activation Icon Button Container */}
                    <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary transition-all shrink-0 relative overflow-hidden shadow-sm">
                      <Sparkles className="w-4 h-4 text-muted-foreground group-hover:opacity-0 transition-opacity absolute" />
                      <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute fill-white ml-1" />
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                      <div className="min-w-0">
                        <div className="font-heading text-base font-semibold text-white group-hover:text-primary transition-colors truncate">
                          {voice.displayName}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground mt-1">
                          {voice.langCode}
                        </div>
                      </div>

                      <div className="hidden sm:block font-sans text-sm text-muted-foreground truncate">
                        <span className="text-white/80">{voice.tags?.join(", ")}</span>
                      </div>

                      <div className="flex justify-end sm:justify-start items-center gap-2 font-sans text-sm font-medium">
                        <Activity className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-muted-foreground group-hover:text-white transition-colors">
                          {voice.playCount || 0} plays
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
            <div className="glass-panel rounded-[2.5rem] p-6 h-full flex flex-col justify-between">
              <h2 className="text-sm font-semibold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Studio Activity
              </h2>

              <div className="flex-1 flex flex-col justify-center gap-5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] relative overflow-hidden group min-h-[100px] flex flex-col justify-center transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.04]"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 group-hover:bg-primary transition-colors" />

                    {stat.loading ? (
                      <div className="flex items-center justify-between font-sans text-xs text-muted-foreground">
                        <span>{stat.label}</span>
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="flex justify-between items-end pl-2">
                        <div>
                          <div className="font-sans text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                            {stat.label}
                          </div>
                          <div className="font-heading text-3xl font-bold text-white group-hover:text-primary transition-colors">
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 font-sans font-medium">
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
        <section className="glass-panel rounded-[2rem] w-full overflow-hidden stagger-3">
          <div className="border-b border-white/5 p-4 bg-white/[0.02] flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-white">
              Supported Regions
            </h2>
          </div>
          
          <div className="relative py-6 flex items-center">
            {/* Visual gradient mask overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030305] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030305] to-transparent z-20 pointer-events-none" />
            
            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] gap-6 px-4">
              {targetLocales.map((lang, idx) => (
                <div
                  key={idx}
                  className="font-mono text-sm font-semibold border border-white/10 bg-white/5 px-6 py-3 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default whitespace-nowrap"
                >
                  {lang}
                </div>
              ))}
              {targetLocales.map((lang, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="font-mono text-sm font-semibold border border-white/10 bg-white/5 px-6 py-3 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-default whitespace-nowrap"
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