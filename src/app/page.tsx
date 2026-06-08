"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUpRight, 
  AudioLines,
  Mic2,
  Sparkles,
  Waves,
  Play,
  Zap,
  Disc
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Injected Avant-Garde Kinetic Styles ---
const kineticStyles = `
  @keyframes grid-drift {
    0% { background-position: 0px 0px; }
    100% { background-position: 40px 40px; }
  }
  @keyframes fluid-pulse {
    0%, 100% { transform: scale(1) rotate(0deg); filter: blur(80px); }
    50% { transform: scale(1.2) rotate(180deg); filter: blur(120px); }
  }
  @keyframes wave-dna {
    0%, 100% { transform: scaleY(0.15) translateZ(10px); }
    50% { transform: scaleY(1.1) translateZ(60px); }
  }
  .preserve-3d { transform-style: preserve-3d; }
  .perspective-2500 { perspective: 2500px; }
  
  .sonic-grid-bg {
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: grid-drift 20s linear infinite;
  }

  .text-stroke-custom {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.5);
  }
  
  .text-stroke-custom:hover {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
    color: rgba(255, 255, 255, 1);
    transition: all 0.4s ease;
  }
`;

export default function LandingPage() {
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      // Normalize values between -0.5 and 0.5
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMouseCoord({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen text-white bg-[#030305] overflow-hidden selection:bg-pink-500/30 relative font-sans">
      <style dangerouslySetInnerHTML={{ __html: kineticStyles }} />
      
      {/* Structural Atmospheric Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 sonic-grid-bg opacity-70" />
        
        {/* Kinetic Light Orbs */}
        <div 
          className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-primary/25 lg:bg-primary/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 12s ease-in-out infinite",
            transform: `translate(${mouseCoord.x * -50}px, ${mouseCoord.y * -50}px)`
          }}
        />
        <div 
          className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] bg-pink-600/25 lg:bg-pink-600/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 16s ease-in-out infinite red",
            transform: `translate(${mouseCoord.x * 70}px, ${mouseCoord.y * 70}px)`
          }}
        />
      </div>

      {/* Main 3D Kinetic Field */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full min-h-screen preserve-3d perspective-2500 flex flex-col justify-between"
        style={{
          transform: `rotateX(${mouseCoord.y * -12}deg) rotateY(${mouseCoord.x * 12}deg)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        
        {/* Navigation */}
        <nav className="w-full h-24 lg:h-auto lg:pt-8 px-5 lg:px-16 preserve-3d transform translate-z-[50px]">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-full lg:h-auto border-b border-white/10 w-full lg:pb-6">
            <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer">
              <Image
                src="/logo.png"
                alt="Resonance"
                width={56}
                height={56}
                className="w-10 h-10 lg:w-14 lg:h-14 group-hover:scale-110 transition-transform duration-500 object-contain"
              />
              <span className="text-lg lg:text-xl font-bold tracking-tight text-white">
                Resonance
              </span>
            </div>
            
            {/* Context Paths Nested Inside /app */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="/app/voices" className="hover:text-white transition-colors">Voices</Link>
              <Link href="/app/text-to-speech" className="hover:text-white transition-colors">Text to Speech</Link>
              <Link href="/app/voice-cloning" className="hover:text-white transition-colors">Voice Cloning</Link>
            </div>

            <div>
              <Link href="/app">
                <Button className="rounded-full border border-white/30 lg:border-white/20 bg-white/10 lg:bg-transparent text-white hover:bg-white hover:text-black font-medium text-sm h-9 lg:h-10 px-5 lg:px-6 transition-all duration-300">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Area */}
        <header className="max-w-7xl mx-auto w-full px-5 lg:px-16 pt-12 lg:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start preserve-3d">
          
          {/* Typography Matrix */}
          <div className="lg:col-span-7 space-y-10 lg:space-y-8 text-left preserve-3d z-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 lg:bg-white/5 lg:from-transparent lg:to-transparent rounded-full px-4 py-2 border border-pink-500/30 lg:border-white/10">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-white lg:text-zinc-300">Next-Generation AI Voice Generator</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tight leading-[1.15] lg:leading-[1] preserve-3d">
              <span className="block transform translate-z-[60px] text-white pb-3 lg:pb-2">
                Voices that
              </span>
              <span className="block transform translate-z-[110px] text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                sound human.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-200 lg:text-zinc-400 max-w-xl leading-relaxed transform translate-z-[40px]">
              Create incredibly realistic, human-sounding voiceovers in seconds. Perfect for creators, developers, and businesses looking to bring their words to life.
            </p>

            {/* Mobile-only mini visualizer for visual interest */}
            <div className="lg:hidden flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <Disc className="w-5 h-5 text-primary animate-[spin_4s_linear_infinite] shrink-0" />
              <div className="flex-1 flex items-center gap-1 h-10">
                {[...Array(14)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-gradient-to-t from-primary via-purple-500 to-pink-500 rounded-full"
                    style={{
                      height: '100%',
                      animation: `wave-dna ${1.2 + (i * 0.05)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-pink-400 bg-pink-500/15 px-2.5 py-1 rounded-full shrink-0">98%</span>
            </div>

            <div className="pt-2 lg:pt-6 flex flex-col sm:flex-row gap-3 lg:gap-4 transform translate-z-[80px]">
              <Link href="/app/voice-cloning" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 bg-white text-black hover:bg-zinc-200 font-semibold text-base transition-all duration-300 shadow-2xl flex items-center justify-center gap-2">
                  Clone Your Voice
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/app/text-to-speech" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 bg-white/5 lg:bg-transparent border-white/30 lg:border-white/20 hover:border-white hover:bg-white/5 text-white font-semibold text-base transition-all duration-300">
                  <Play className="w-5 h-5 mr-2 fill-current text-pink-500" /> Try Text to Speech
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Element */}
          <div className="lg:col-span-5 w-full h-[520px] relative preserve-3d hidden lg:block z-10 transform translate-z-[40px] translate-y-6">
            <div className="absolute inset-0 border border-white/10 bg-black/40 backdrop-blur-3xl p-8 flex flex-col justify-between preserve-3d rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4 transform translate-z-[30px]">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-primary animate-[spin_4s_linear_infinite]" />
                  <span className="font-medium text-sm text-zinc-400">Generating Voice...</span>
                </div>
                <span className="text-xs font-semibold text-pink-500 bg-pink-500/10 px-3 py-1 rounded-full">High Quality</span>
              </div>

              {/* Kinetic Sound Grid Visualizer */}
              <div className="py-12 flex justify-between items-center gap-1.5 h-48 preserve-3d">
                {[...Array(18)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-gradient-to-t from-primary/40 via-purple-500 to-pink-500 rounded-full"
                    style={{
                      height: '100%',
                      animation: `wave-dna ${1.2 + (i * 0.05)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              <div className="border-t border-white/5 pt-5 space-y-3 transform translate-z-[50px]">
                <div className="flex justify-between text-sm font-medium text-zinc-400">
                  <span>Realism Score</span>
                  <span className="text-white">98.43% match</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 relative overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-4/5 bg-gradient-to-r from-primary to-pink-500 rounded-full" />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Features Section */}
        <main className="max-w-7xl mx-auto w-full px-5 lg:px-16 pt-20 lg:pt-32 pb-24 preserve-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-12 lg:mb-16 border-t border-white/5 pt-12">
            <div className="lg:col-span-5">
              <h2 className="text-sm font-semibold text-pink-400 lg:text-pink-500 mb-3 uppercase tracking-wider lg:tracking-normal lg:normal-case">Explore Features</h2>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Powerful AI Audio Tools
              </p>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base text-zinc-300 lg:text-zinc-400 max-w-lg leading-relaxed">
                Everything you need to generate, clone, and manage AI voices with stunning realism and emotion. Designed to be as simple as typing.
              </p>
            </div>
          </div>

          {/* Interactive Stacked Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start preserve-3d">
            
            {/* App Action 1: Voices */}
            <Link href="/app/voices" className="group preserve-3d block">
              <div className="border border-primary/30 lg:border-white/5 bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent lg:from-white/[0.02] lg:via-white/[0.02] p-6 lg:p-8 h-auto lg:h-[340px] flex flex-col justify-between gap-6 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-primary/[0.02] relative transform group-hover:translate-z-[30px] rounded-3xl">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-primary/20 lg:bg-white/5 flex items-center justify-center text-primary border border-primary/40 lg:border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <AudioLines className="w-5 h-5" />
                  </div>
                  <div className="text-stroke-custom text-5xl font-extrabold select-none">01</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Voice Library</h3>
                  <p className="text-sm text-zinc-300 lg:text-zinc-400 leading-relaxed">Browse our collection of highly realistic AI voices ready for your next project.</p>
                </div>
              </div>
            </Link>

            {/* App Action 2: Text to Speech */}
            <Link href="/app/text-to-speech" className="group preserve-3d block">
              <div className="border border-purple-500/30 lg:border-white/5 bg-gradient-to-br from-purple-500/10 via-white/[0.02] to-transparent lg:from-white/[0.02] lg:via-white/[0.02] p-6 lg:p-8 h-auto lg:h-[340px] flex flex-col justify-between gap-6 transition-all duration-500 group-hover:border-purple-500/40 group-hover:bg-purple-500/[0.02] relative transform group-hover:translate-z-[50px] md:-translate-y-4 rounded-3xl">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 lg:bg-white/5 flex items-center justify-center text-purple-300 lg:text-purple-400 border border-purple-500/40 lg:border-white/10 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="text-stroke-custom text-5xl font-extrabold select-none">02</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Text to Speech</h3>
                  <p className="text-sm text-zinc-300 lg:text-zinc-400 leading-relaxed">Type your script and generate studio-quality voiceovers with natural pacing and emotion.</p>
                </div>
              </div>
            </Link>

            {/* App Action 3: Voice Cloning */}
            <Link href="/app/voice-cloning" className="group preserve-3d block">
              <div className="border border-pink-500/30 lg:border-white/5 bg-gradient-to-br from-pink-500/10 via-white/[0.02] to-transparent lg:from-white/[0.02] lg:via-white/[0.02] p-6 lg:p-8 h-auto lg:h-[340px] flex flex-col justify-between gap-6 transition-all duration-500 group-hover:border-pink-500/40 group-hover:bg-pink-500/[0.02] relative transform group-hover:translate-z-[30px] md:translate-y-4 rounded-3xl">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 lg:bg-white/5 flex items-center justify-center text-pink-300 lg:text-pink-400 border border-pink-500/40 lg:border-white/10 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
                    <Mic2 className="w-5 h-5" />
                  </div>
                  <div className="text-stroke-custom text-5xl font-extrabold select-none">03</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Voice Cloning</h3>
                  <p className="text-sm text-zinc-300 lg:text-zinc-400 leading-relaxed">Create a perfect digital replica of your own voice using just 60 seconds of audio.</p>
                </div>
              </div>
            </Link>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-xl py-8 px-6 lg:px-16 preserve-3d transform translate-z-[40px]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 Resonance Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All systems operational</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}