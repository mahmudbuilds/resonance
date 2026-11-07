"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowUpRight, 
  AudioLines,
  Mic2,
  Play,
  Zap,
  Disc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const kineticStyles = `
  @keyframes wave-dna {
    0%, 100% { transform: scaleY(0.15) translateZ(10px); }
    50% { transform: scaleY(1.1) translateZ(60px); }
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
    <div className="min-h-screen text-foreground bg-background overflow-hidden selection:bg-primary/30 relative font-sans">
      <style dangerouslySetInnerHTML={{ __html: kineticStyles }} />
      
      {/* Structural Atmospheric Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 sonic-grid-bg opacity-70" />
        
        {/* Kinetic Light Orbs */}
        <div 
          className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-primary/25 lg:bg-primary/10 rounded-full dark:mix-blend-screen"
          style={{
            animation: "fluid-pulse 12s ease-in-out infinite",
            transform: `translate(${mouseCoord.x * -50}px, ${mouseCoord.y * -50}px)`
          }}
        />
        <div 
          className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] bg-pink-600/25 lg:bg-pink-600/10 rounded-full dark:mix-blend-screen"
          style={{
            animation: "fluid-pulse 16s ease-in-out infinite",
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
          <div className="max-w-7xl mx-auto flex items-center justify-between h-full lg:h-auto border-b border-border w-full lg:pb-6">
            <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer">
              <Image
                src="/logo.png"
                alt="Resonance"
                width={56}
                height={56}
                className="w-10 h-10 lg:w-14 lg:h-14 group-hover:scale-110 transition-transform duration-500 object-contain dark:invert-0 invert"
              />
              <span className="text-lg lg:text-xl font-bold tracking-tight text-foreground">
                Resonance
              </span>
            </div>
            
            {/* Context Paths Nested Inside /app */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <Link href="/app/voices" className="hover:text-foreground transition-colors">Voices</Link>
              <Link href="/app/text-to-speech" className="hover:text-foreground transition-colors">Text to Speech</Link>
              <Link href="/app/voice-cloning" className="hover:text-foreground transition-colors">Voice Cloning</Link>
            </div>

            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link href="/app">
                <Button className="rounded-full border border-border bg-secondary lg:bg-transparent text-foreground hover:bg-accent hover:text-foreground font-medium text-sm h-9 lg:h-10 px-5 lg:px-6 transition-all duration-300">
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
            <h1 className="text-5xl sm:text-7xl lg:text-[6.25rem] font-bold tracking-[-0.03em] leading-[1.08] lg:leading-[0.98] preserve-3d">
              <span className="block transform translate-z-[60px] text-foreground pb-2">
                Voices that
              </span>
              <span className="block transform translate-z-[110px] text-primary">
                sound human.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-xl leading-relaxed transform translate-z-[40px]">
              Create incredibly realistic, human-sounding voiceovers in seconds. Perfect for creators, developers, and businesses looking to bring their words to life.
            </p>

            {/* Mobile-only mini visualizer for visual interest */}
            <div className="lg:hidden flex items-center gap-3 p-4 rounded-2xl border border-border bg-secondary/80 backdrop-blur-xl">
              <Disc className="w-5 h-5 text-primary animate-[spin_4s_linear_infinite] shrink-0" />
              <div className="flex-1 flex items-center gap-1 h-10">
                {[...Array(14)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-primary/70 rounded-full"
                    style={{
                      height: '100%',
                      animation: `wave-dna ${1.2 + (i * 0.05)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">98% match</span>
            </div>

            <div className="pt-2 lg:pt-6 flex flex-col sm:flex-row gap-3 lg:gap-4 transform translate-z-[80px]">
              <Link href="/app/voice-cloning" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                  Clone Your Voice
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/app/text-to-speech" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 bg-secondary lg:bg-transparent border-border hover:border-primary/40 hover:bg-accent text-foreground font-semibold text-base transition-all duration-300">
                  <Play className="w-5 h-5 mr-2 fill-current text-primary" /> Try Text to Speech
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Element */}
          <div className="lg:col-span-5 w-full h-[520px] relative preserve-3d hidden lg:block z-10 transform translate-z-[40px] translate-y-6">
            <div className="absolute inset-0 border border-border bg-secondary/80 dark:bg-black/40 backdrop-blur-3xl p-8 flex flex-col justify-between preserve-3d rounded-3xl shadow-2xl dark:shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              
              <div className="flex justify-between items-center border-b border-border pb-4 transform translate-z-[30px]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-sm text-foreground">Studio Engine Active</span>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">24-bit • 48kHz</span>
              </div>

              {/* Kinetic Sound Grid Visualizer */}
              <div className="py-8 flex flex-col justify-center gap-6 preserve-3d">
                <div className="flex justify-between items-end gap-1.5 h-36 preserve-3d px-2">
                  {[...Array(18)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-primary/80 hover:bg-primary transition-colors rounded-full"
                      style={{
                        height: '100%',
                        animation: `wave-dna ${1.2 + (i * 0.05)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-2 font-mono">
                  <span>00:04.2</span>
                  <span className="text-foreground font-sans font-medium">Sarah — Documentary Timbre</span>
                  <span>00:15.0</span>
                </div>
              </div>

              <div className="border-t border-border pt-5 space-y-3 transform translate-z-[50px]">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Neural Fidelity Score</span>
                  <span className="text-foreground font-semibold">98.4% match</span>
                </div>
                <div className="w-full h-1.5 bg-secondary relative overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-[98.4%] bg-primary rounded-full" />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Features Section */}
        <main className="max-w-7xl mx-auto w-full px-5 lg:px-16 pt-20 lg:pt-32 pb-24 preserve-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-12 lg:mb-16 border-t border-border pt-12">
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Studio-grade acoustic architecture
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
                Everything you need to generate, clone, and orchestrate AI voices with natural timbre, zero robotic cadence, and multi-language inflection.
              </p>
            </div>
          </div>

          {/* Interactive Stacked Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch preserve-3d">
            
            {/* App Action 1: Voices */}
            <Link href="/app/voices" className="group preserve-3d block">
              <div className="border border-border bg-card/60 backdrop-blur-md p-6 lg:p-8 h-full flex flex-col justify-between gap-6 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 relative transform group-hover:-translate-y-1 rounded-3xl shadow-sm">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <AudioLines className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Voice Library</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Browse curated voices spanning 9+ international languages with natural emotive inflections.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">9+ Languages</span>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Neural Timbre</span>
                </div>
              </div>
            </Link>

            {/* App Action 2: Text to Speech */}
            <Link href="/app/text-to-speech" className="group preserve-3d block">
              <div className="border border-border bg-card/60 backdrop-blur-md p-6 lg:p-8 h-full flex flex-col justify-between gap-6 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 relative transform group-hover:-translate-y-1 rounded-3xl shadow-sm">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Text to Speech</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Type your script and generate studio-quality voiceovers with micro-pacing and temperature controls.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Micro-Pacing</span>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Real-time Preview</span>
                </div>
              </div>
            </Link>

            {/* App Action 3: Voice Cloning */}
            <Link href="/app/voice-cloning" className="group preserve-3d block">
              <div className="border border-border bg-card/60 backdrop-blur-md p-6 lg:p-8 h-full flex flex-col justify-between gap-6 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 relative transform group-hover:-translate-y-1 rounded-3xl shadow-sm">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mic2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Voice Cloning</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Create a high-fidelity digital replica from sample recordings with automatic acoustic isolation.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">60s Audio Input</span>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Zero-shot Match</span>
                </div>
              </div>
            </Link>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-border bg-background/80 backdrop-blur-xl py-8 px-6 lg:px-16 preserve-3d transform translate-z-[40px]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 Resonance Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All systems operational</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}