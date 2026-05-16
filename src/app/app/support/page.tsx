"use client";

import {
  ArrowRight,
  ChevronDown,
  Mail,
  MessageSquare,
  Search,
  Terminal,
  Cpu,
  Globe,
  Plus,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      <div className="relative z-10 responsive-container">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 border-b border-[#222] pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
              <Terminal className="w-3 h-3" />
              Support Protocol
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              SYSTEM <span className="text-primary">ASSIST</span>
            </h1>
          </div>
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
            Initialize diagnostic help or contact the core engineering team.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 w-full max-w-full">
          {/* FAQ Section */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 border-b border-[#222] pb-4 mb-6 sm:mb-8">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-widest text-white">Knowledge Base</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-[#222] bg-[#050505] px-4 sm:px-6 py-2 rounded-none data-[state=open]:border-primary transition-colors">
                  <AccordionTrigger className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-white hover:text-primary transition-colors hover:no-underline text-left py-4 sm:py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-xs sm:text-sm text-[#888] leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative h-full flex flex-col">
              <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                Direct Comms
              </div>

              <div className="mt-4 space-y-6 sm:space-y-8 flex-1">
                <div className="space-y-4">
                  <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-white">Emergency Uplink</h3>
                  <p className="font-mono text-[10px] sm:text-xs text-[#888] uppercase leading-relaxed">
                    If you require immediate technical intervention, 
                    transmit your query through our secure channel.
                  </p>
                </div>

                <div className="space-y-4 pt-6 sm:pt-8 border-t border-[#222]">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#333] bg-[#111] flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-black" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] sm:text-[10px] text-[#555] uppercase">Secure Email</div>
                      <div className="font-mono text-xs sm:text-sm text-white group-hover:text-primary">SUPPORT@RESONANCE.AI</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#333] bg-[#111] flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
                      <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-black" />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] sm:text-[10px] text-[#555] uppercase">Global Discord</div>
                      <div className="font-mono text-xs sm:text-sm text-white group-hover:text-primary">JOIN_COMMUNITY_SERVER</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 mt-auto">
                  <Button className="w-full rounded-none bg-primary text-black hover:bg-white border border-primary font-mono text-[10px] sm:text-xs uppercase tracking-widest h-14 sm:h-16 transition-colors shadow-[5px_5px_0px_rgba(204,255,0,0.2)] hover:shadow-none">
                    Initialize Chat <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

