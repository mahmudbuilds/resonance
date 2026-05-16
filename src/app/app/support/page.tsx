"use client";

import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  LifeBuoy,
  Mail,
  MessageSquare,
  Search,
  Terminal,
  Cpu,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SupportPage() {
  const faqs = [
    {
      q: "HOW_DOES_VOICE_CLONING_WORK?",
      a: "NEURAL EXTRACTION PROTOCOL: Provide 30-300 seconds of clean audio. The engine maps acoustic topography to synthesize a unique vocal profile in < 15s.",
    },
    {
      q: "SUPPORTED_STREAM_FORMATS?",
      a: "MP3, WAV, FLAC, OGG. MAX_PAYLOAD: 25MB.",
    },
    {
      q: "DATA_PRIVACY_ENCRYPTION?",
      a: "ALL NEURAL MAPS ARE ENCRYPTED AND STORED IN ISOLATED WORKSPACES. NO CROSS-MODEL TRAINING WITHOUT EXPLICIT AUTHORIZATION.",
    },
    {
      q: "SSML_PRECISION_INPUT?",
      a: "ENABLE SSML MODE IN SCRIPT_EDITOR. USE <BREAK>, <PHONEME>, AND <PROSODY> TAGS FOR GRANULAR SYNTHESIS CONTROL.",
    },
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white selection:bg-primary selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-[1200px] mx-auto border-x border-[#222] min-h-screen pb-20">
        {/* Header Section */}
        <header className="mb-20 border-b border-[#222] pb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-8 font-mono text-xs uppercase text-primary">
            <LifeBuoy className="w-3 h-3" />
            Module: Central Support
          </div>
          
          <h1 className="font-heading text-4xl md:text-7xl font-bold uppercase tracking-tighter text-white mb-8">
            SYSTEM <span className="text-primary">ASSISTANCE</span>
          </h1>

          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444] group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="QUERY_KNOWLEDGE_BASE..."
              className="w-full bg-[#050505] border border-[#333] focus:border-primary/50 outline-none h-16 pl-12 pr-32 font-mono text-xs uppercase tracking-widest transition-all placeholder:text-[#333]"
            />
            <Button className="absolute right-2 top-2 bottom-2 px-6 rounded-none bg-primary hover:bg-white text-black font-mono text-xs uppercase tracking-widest transition-colors border border-primary">
              SEARCH
            </Button>
          </div>
        </header>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="group border border-[#222] bg-[#050505] p-10 relative cursor-pointer hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#111] border-b border-l border-[#333] font-mono text-[8px] text-[#555] uppercase">
              DOC_V2.4
            </div>
            <div className="w-16 h-16 border border-[#222] bg-[#111] flex items-center justify-center mb-8 group-hover:border-primary/30 transition-colors">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase mb-4">Documentation</h2>
            <p className="font-mono text-xs text-[#888] uppercase leading-relaxed mb-8">
              Comprehensive technical specifications for API integration, 
              synthesis parameters, and authentication protocols.
            </p>
            <div className="flex items-center text-primary font-mono text-xs uppercase tracking-widest group-hover:gap-4 gap-2 transition-all">
              Initialize Access <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="group border border-[#222] bg-[#050505] p-10 relative cursor-pointer hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#111] border-b border-l border-[#333] font-mono text-[8px] text-[#555] uppercase">
              NET_CORE
            </div>
            <div className="w-16 h-16 border border-[#222] bg-[#111] flex items-center justify-center mb-8 group-hover:border-primary/30 transition-colors">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase mb-4">Community Node</h2>
            <p className="font-mono text-xs text-[#888] uppercase leading-relaxed mb-8">
              Join the neural network of creators sharing voice recipes, 
              custom models, and technical optimization techniques.
            </p>
            <div className="flex items-center text-primary font-mono text-xs uppercase tracking-widest group-hover:gap-4 gap-2 transition-all">
              Connect to Discord <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="space-y-12 mb-20">
          <div className="flex items-center gap-4">
            <h2 className="font-heading text-3xl font-bold uppercase">Frequently Asked Queries</h2>
            <div className="flex-1 h-px bg-[#222]" />
          </div>
          
          <div className="border border-[#222] bg-[#050505] divide-y divide-[#222]">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-8 group cursor-pointer hover:bg-primary/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-[#444]">0{i + 1}</span>
                    <h3 className="font-mono text-sm uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                      {faq.q}
                    </h3>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#444] group-hover:text-primary transition-colors" />
                </div>
                {i === 0 && (
                  <div className="mt-8 pl-10 border-l border-primary/20">
                    <p className="font-mono text-xs text-[#888] uppercase leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Block */}
        <div className="border border-primary bg-primary/5 p-12 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu className="w-80 h-80 text-primary" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="max-w-xl">
              <h3 className="font-heading text-3xl font-bold uppercase mb-4">Unresolved Discrepancies?</h3>
              <p className="font-mono text-xs text-[#aaa] uppercase leading-relaxed">
                If the automated knowledge base fails to resolve your technical anomaly, 
                our primary support units are standing by for direct intervention.
              </p>
            </div>
            <Button className="h-16 px-12 rounded-none bg-primary hover:bg-white text-black font-mono text-sm uppercase tracking-widest transition-colors border border-primary shrink-0 w-full md:w-auto">
              <Mail className="w-5 h-5 mr-3" /> Open Secure Channel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
