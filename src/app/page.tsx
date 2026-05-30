"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Mic, 
  Sparkles, 
  Volume2, 
  Zap, 
  Globe,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [waveHeights, setWaveHeights] = useState<number[]>([]);

  useEffect(() => {
    setWaveHeights(Array.from({ length: 24 }, () => Math.random() * 60 + 10));
  }, []);
  return (
    <div className="min-h-screen bg-black relative selection:bg-primary selection:text-black font-sans text-white overflow-hidden">
      {/* Brutalist Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .brutal-border {
          border: 1px solid #222;
        }
      `}}></style>

      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-[#222] bg-black/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 h-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black relative flex items-center justify-center">
              <Image src="/logo.png" alt="Resonance Logo" fill className="object-contain mix-blend-screen" />
            </div>
            <span className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-widest text-white">RESONANCE</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden sm:inline-flex font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              SYS.STATUS: <span className="text-primary ml-2 flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-none animate-pulse"></span> ONLINE</span>
            </span>
            <Link href="/app">
              <Button className="rounded-none bg-primary text-black hover:bg-white hover:text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest h-10 sm:h-12 px-4 sm:px-8 border border-primary transition-colors">
                Initialize <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 pt-20 sm:pt-32 pb-24 sm:pb-40 max-w-[1600px] mx-auto border-x-0 sm:border-x border-[#222] min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-transparent" />
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 relative">
              <div className="inline-flex items-center gap-3 border border-[#222] bg-[#050505] px-4 py-2 mb-8 sm:mb-12">
                <Activity className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-primary">Vocal Synthesis Engine v2.0.4</span>
              </div>
              
              <h1 className="fluid-heading-xl mb-8 sm:mb-10 text-white">
                SYNTHESIZE <br />
                <span className="text-primary">REALITY.</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl font-sans text-[#888] max-w-2xl mb-10 sm:mb-12 leading-relaxed">
                Hyper-realistic text-to-speech and neural voice cloning. Built for industrial-scale creation. Precision audio engineering meets deep learning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/app">
                  <Button size="lg" className="rounded-none h-14 sm:h-16 px-8 sm:px-10 bg-primary text-black hover:bg-white hover:text-black font-mono uppercase tracking-widest text-xs sm:text-sm transition-colors border border-primary w-full sm:w-auto">
                    Launch Console
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 px-6 border border-[#222] bg-[#050505] h-14 sm:h-16 w-full sm:w-auto justify-center sm:justify-start">
                  <span className="font-mono text-[10px] text-[#888]">LATENCY</span>
                  <span className="font-mono text-xs sm:text-sm text-white">{"<"} 400ms</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 hidden lg:block">
              <div className="w-full aspect-square border border-[#222] relative bg-[#050505] overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-4 left-4 font-mono text-[10px] text-[#555]">FIG. 1 - NEURAL WAVEFORM</div>
                <div className="absolute bottom-4 right-4 font-mono text-[10px] text-primary animate-pulse">RECORDING...</div>
                
                {/* Simulated Audio Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 px-8">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-primary/20 sound-wave-bar origin-bottom group-hover:bg-primary transition-colors"
                      style={{ 
                        height: waveHeights[i] ? `${waveHeights[i]}%` : '10%',
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="w-full border-y border-[#222] bg-[#050505] py-6 sm:py-8 overflow-hidden relative">
          <div className="flex w-max animate-marquee">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-12 sm:gap-20 items-center px-6 sm:px-10">
                {['ACME_CORP', 'GLOBAL_NET', 'NEXUS_AI', 'QUANTUM_STD', 'VANGUARD', 'STARLIGHT', 'PINNACLE'].map((brand, j) => (
                  <span key={j} className="text-xl sm:text-2xl font-heading font-bold text-[#333] uppercase tracking-widest whitespace-nowrap hover:text-primary transition-colors cursor-default">
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 sm:py-40 px-4 sm:px-6 max-w-[1600px] mx-auto border-x-0 sm:border-x border-[#222]">
          <div className="mb-16 sm:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="font-mono text-primary text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">01 // Architecture</span>
              <h2 className="fluid-heading-lg text-white">System Specs</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#888] max-w-md uppercase leading-relaxed">
              Industrial-grade infrastructure engineered for zero-compromise audio generation and manipulation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#222]">
            {/* Feature 1 */}
            <div className="group border-b lg:border-b-0 lg:border-r border-[#222] p-8 sm:p-12 bg-[#050505] hover:bg-[#0a0a0a] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="font-mono text-[10px] sm:text-xs text-[#555] mb-6 sm:mb-8 group-hover:text-primary transition-colors">MDL.001</div>
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-6 sm:mb-8 group-hover:text-primary transition-colors" />
              <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase mb-4 text-white">Neural TTS</h3>
              <p className="font-sans text-sm sm:text-base text-[#888] leading-relaxed">
                Parametric voice synthesis with complete emotional control. 
                Adjust intonation, pacing, and timber with surgical precision.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group border-b lg:border-b-0 lg:border-r border-[#222] p-8 sm:p-12 bg-[#050505] hover:bg-[#0a0a0a] transition-colors relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="font-mono text-[10px] sm:text-xs text-[#555] mb-6 sm:mb-8 group-hover:text-primary transition-colors">MDL.002</div>
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-6 sm:mb-8 group-hover:text-primary transition-colors" />
              <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase mb-4 text-white">Voice Cloning</h3>
              <p className="font-sans text-sm sm:text-base text-[#888] leading-relaxed">
                Extract acoustic features from a 10-second sample. 
                Generate a perfect digital replica indistinguishable from the source.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 sm:p-12 bg-[#050505] hover:bg-[#0a0a0a] transition-colors relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="font-mono text-[10px] sm:text-xs text-[#555] mb-6 sm:mb-8 group-hover:text-primary transition-colors">MDL.003</div>
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-6 sm:mb-8 group-hover:text-primary transition-colors" />
              <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase mb-4 text-white">Zero Latency</h3>
              <p className="font-sans text-sm sm:text-base text-[#888] leading-relaxed">
                Optimized inference pipeline. Stream generated audio packets 
                in real-time for interactive AI agents and dynamic content.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#222] bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-20 sm:py-32 border-x-0 sm:border-x border-[#222] relative z-10 flex flex-col items-center text-center">
            <h2 className="fluid-heading-lg text-black mb-6 sm:mb-8">
              INITIALIZE <br /> SYSTEM
            </h2>
            <p className="font-mono text-black/70 mb-10 sm:mb-12 max-w-xl uppercase tracking-widest text-xs sm:text-sm">
              Deploy the resonance engine to your workflow today.
            </p>
            <Link href="/app">
              <Button size="lg" className="rounded-none h-16 sm:h-20 px-10 sm:px-16 bg-black text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-base sm:text-lg transition-colors border border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] sm:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] sm:hover:translate-x-[10px] sm:hover:translate-y-[10px]">
                Access Terminal
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
