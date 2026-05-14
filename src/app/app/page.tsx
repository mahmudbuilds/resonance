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
  Wand2,
  Terminal,
  Cpu,
  Radio
} from "lucide-react";
import Link from "next/link";
import UserGreeting from "@/components/dashboard/UserGreeting";

export default function Home() {
  const features = [
    {
      title: "Text to Speech",
      description: "Parametric synthesis engine. Generate studio-quality audio with precise emotional control.",
      icon: AudioLines,
      href: "/app/text-to-speech",
      id: "MDL-01"
    },
    {
      title: "Voice Library",
      description: "Access a global registry of 140+ neural voice models spanning 40+ languages.",
      icon: Volume2,
      href: "/app/voices",
      id: "MDL-02"
    },
    {
      title: "Voice Cloning",
      description: "Neural acoustic extraction. Replicate vocal signatures from minimal sample data.",
      icon: Mic2,
      href: "/app/voice-cloning",
      id: "MDL-03"
    },
  ];

  const showcaseVoices = [
    { name: "Marcus", class: "ALPHA", freq: "120Hz", plays: "2.4M", code: "US-EN" },
    { name: "Elara", class: "BETA", freq: "210Hz", plays: "1.8M", code: "UK-EN" },
    { name: "Kai", class: "GAMMA", freq: "150Hz", plays: "1.2M", code: "AU-EN" },
    { name: "Nadia", class: "DELTA", freq: "190Hz", plays: "980K", code: "RU-RU" },
  ];

  const stats = [
    { label: "SYS.LOAD", value: "84%", change: "+12.4%" },
    { label: "GENERATIONS", value: "1,204", change: "NOMINAL" },
    { label: "ACTIVE MODELS", value: "142", change: "SYNCED" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black pb-20">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-[1600px] mx-auto border-x border-[#222] min-h-screen">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-[#222] pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-8 font-mono text-xs uppercase text-primary">
            <Radio className="w-3 h-3 animate-pulse" />
            Terminal Session Active
          </div>
          <div className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-white">
            <UserGreeting />
          </div>
          <p className="font-mono text-sm text-[#888] max-w-2xl uppercase leading-relaxed tracking-wider">
            Welcome to the command center. System telemetry is nominal. 
            All synthesis modules online and ready for input.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-[#222] pb-4">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
              <Cpu className="w-6 h-6 text-primary" />
              Core Modules
            </h2>
            <Link href="/app/text-to-speech" className="font-mono text-xs uppercase tracking-widest text-[#888] hover:text-primary transition-colors flex items-center gap-2">
              Execute <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group block">
                <div className="border border-[#222] bg-[#050505] p-8 h-full transition-all duration-300 hover:border-primary hover:bg-[#0a0a0a] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 font-mono text-xs text-[#444] group-hover:text-primary transition-colors">
                    [{feature.id}]
                  </div>
                  
                  <div className="w-12 h-12 bg-[#111] border border-[#333] flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold uppercase mb-3 text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="font-sans text-sm text-[#888] leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#555] group-hover:text-primary transition-colors">
                    Initialize <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid lg:grid-cols-12 gap-6 mb-20">
          
          {/* Trending Voices */}
          <section className="lg:col-span-8 border border-[#222] bg-[#050505]">
            <div className="p-6 border-b border-[#222] flex items-center justify-between bg-[#0a0a0a]">
              <h2 className="font-mono text-sm uppercase tracking-widest text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Active Voice Registry
              </h2>
              <Link href="/app/voices" className="font-mono text-xs text-primary hover:underline">
                VIEW_ALL
              </Link>
            </div>
            
            <div className="divide-y divide-[#222]">
              {showcaseVoices.map((voice, i) => (
                <div key={voice.name} className="p-4 sm:p-6 hover:bg-[#0a0a0a] transition-colors flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 border border-[#333] bg-[#111] flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                    <span className="font-mono font-bold text-white group-hover:text-black">0{i+1}</span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-heading font-bold uppercase text-white group-hover:text-primary transition-colors">{voice.name}</div>
                      <div className="font-mono text-[10px] text-[#666]">ID: {voice.code}</div>
                    </div>
                    
                    <div className="hidden sm:block font-mono text-xs text-[#888]">
                      CLS: <span className="text-white">{voice.class}</span>
                    </div>
                    
                    <div className="hidden sm:block font-mono text-xs text-[#888]">
                      FRQ: <span className="text-white">{voice.freq}</span>
                    </div>
                    
                    <div className="flex justify-end sm:justify-start items-center gap-2 font-mono text-xs">
                      <Activity className="w-3 h-3 text-[#555] group-hover:text-primary" />
                      <span className="text-[#888]">{voice.plays}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Overview */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-[#222] bg-[#050505] p-6 h-full flex flex-col">
              <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-[#222] pb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Telemetry
              </h2>
              
              <div className="flex-1 flex flex-col justify-between gap-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="border border-[#222] p-4 bg-[#0a0a0a] relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#222] group-hover:bg-primary transition-colors" />
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="font-mono text-[10px] text-[#666] mb-1">{stat.label}</div>
                        <div className="font-heading text-3xl font-bold text-white group-hover:text-primary transition-colors">{stat.value}</div>
                      </div>
                      <div className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Global Languages */}
        <section className="border border-[#222] bg-[#050505] overflow-hidden">
          <div className="border-b border-[#222] p-4 bg-[#0a0a0a] flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-mono text-sm uppercase tracking-widest text-white">Supported Locales</h2>
          </div>
          <div className="py-6 flex">
            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] gap-4 px-4">
              {[
                "EN-US", "EN-UK", "ES-ES", "FR-FR", "DE-DE", "IT-IT", "PT-BR", "JA-JP", 
                "KO-KR", "ZH-CN", "AR-SA", "RU-RU", "HI-IN", "NL-NL", "PL-PL", "SV-SE",
                "TR-TR", "VI-VN", "TH-TH", "ID-ID"
              ].map((lang, idx) => (
                <div key={idx} className="font-mono text-xs border border-[#333] bg-[#111] px-4 py-2 text-[#888] hover:text-primary hover:border-primary transition-colors cursor-default">
                  {lang}
                </div>
              ))}
              {[
                "EN-US", "EN-UK", "ES-ES", "FR-FR", "DE-DE", "IT-IT", "PT-BR", "JA-JP", 
                "KO-KR", "ZH-CN", "AR-SA", "RU-RU", "HI-IN", "NL-NL", "PL-PL", "SV-SE",
                "TR-TR", "VI-VN", "TH-TH", "ID-ID"
              ].map((lang, idx) => (
                <div key={`dup-${idx}`} className="font-mono text-xs border border-[#333] bg-[#111] px-4 py-2 text-[#888] hover:text-primary hover:border-primary transition-colors cursor-default">
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
