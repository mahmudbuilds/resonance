"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Feather, 
  Compass, 
  AudioLines,
  Play,
  Pause,
  Waves,
  Infinity as InfinityIcon,
  Music,
  Sliders,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isAuditioning, setIsAuditioning] = useState(false);
  const [activeProfile, setActiveProfile] = useState("velvet");
  const [fluidRhythms, setFluidRhythms] = useState<number[]>([]);
  const [resonanceDepth, setResonanceDepth] = useState(72);

  useEffect(() => {
    // Populate fluid sculptural rhythm lines
    setFluidRhythms(Array.from({ length: 35 }, () => Math.random() * 60 + 15));
    
    const interval = setInterval(() => {
      setFluidRhythms(prev => prev.map((val, i) => {
        if (isAuditioning) {
          return Math.max(10, Math.min(100, val + (Math.random() * 24 - 12)));
        } else {
          return 40 + Math.sin((Date.now() / 500) + i * 0.25) * 12;
        }
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isAuditioning]);

  const acousticProfiles = [
    { id: "velvet", name: "Satin Warmth", tone: "Rich Editorial Narrative", space: "Studio Context", description: "Deeply resonant lower registers engineered for fine literary prose and long-form biographical pieces." },
    { id: "ivory", name: "Alabaster Clear", tone: "Bright Articulate Prose", space: "Cinematic Atmosphere", description: "Crisp mid-tones optimized for clarity, structural descriptions, and sophisticated modern educational delivery." },
    { id: "amber", name: "Amber Resonance", tone: "Deep Atmospheric Presence", space: "Intimate Whisper", description: "Velvety, close-mic dynamic text processing created specifically for luxurious spatial design and art galleries." },
  ];

  const currentProfileData = acousticProfiles.find(p => p.id === activeProfile) || acousticProfiles[0];

  return (
    <div className="min-h-screen bg-[#0b0908] text-[#fcfbf7] font-body relative selection:bg-[#e0a96d]/20 selection:text-[#e0a96d]">
      
      {/* Background Radial Ambiance */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[80vw] h-[50vw] rounded-full bg-gradient-to-br from-[#e0a96d]/5 via-transparent to-transparent blur-3xl animate-organic-drift" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#948880]/3 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Floating Editorial Navigation */}
      <nav className="relative z-50 w-full border-b border-white/5 bg-[#0b0908]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-24">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xl sm:text-2xl font-light tracking-[0.25em] text-white">
              RESONANCE
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[12px] font-medium tracking-[0.15em] text-[#948880] uppercase">
            <a href="#philosophy" className="hover:text-[#e0a96d] transition-colors duration-300">The Philosophy</a>
            <a href="#atelier" className="hover:text-[#e0a96d] transition-colors duration-300">The Audition Room</a>
            <a href="#curation" className="hover:text-[#e0a96d] transition-colors duration-300">The Curation</a>
          </div>

          <div>
            <Link href="/app">
              <Button className="rounded-full bg-[#e0a96d] text-[#0b0908] hover:bg-white hover:text-black font-medium text-xs tracking-wider h-11 px-6 transition-all duration-500 shadow-xl shadow-[#e0a96d]/5">
                Studio Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Symphony Block */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 text-center space-y-8 animate-soft-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.01] text-[#e0a96d]">
          <Feather className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">The Acoustic Paradigm Shift</span>
        </div>

        <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
          Resonance: The Living Narrative.<br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#e0a96d] via-[#fcfbf7] to-[#948880]">
            Where prose becomes poetry.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#948880] max-w-2xl mx-auto font-normal leading-relaxed">
          Strip away machine monotony. Infuse digital layouts, publications, and narratives with premium acoustic textures modeled after master vocal storytellers.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/app">
            <Button size="lg" className="rounded-full h-14 px-10 bg-gradient-to-r from-[#e0a96d] to-[#cfa064] text-[#0b0908] hover:opacity-95 font-medium tracking-wider text-xs transition-all duration-300 shadow-2xl shadow-[#e0a96d]/10 group">
              Enter Interactive Atelier Studio
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Panoramic Marquee Band */}
      <section className="w-full py-12 overflow-hidden relative border-y border-white/5 bg-white/[0.005]">
        <div className="w-full mask-luxury-fade relative py-1">
          <div className="flex w-max space-x-32 animate-marquee-luxury">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-32 items-center text-[11px] tracking-[0.3em] font-light text-[#948880]/50 uppercase">
                <span>Aura Publishing House</span>
                <span className="text-[#e0a96d]/30 font-sans">/</span>
                <span>Verdant Narrative Foundation</span>
                <span className="text-[#e0a96d]/30 font-sans">/</span>
                <span>Atelier House Cinematic</span>
                <span className="text-[#e0a96d]/30 font-sans">/</span>
                <span>Vivid Acoustics Europe</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Framework Sections */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 space-y-40">
        
        {/* Section 1: The Curation Portfolio Map */}
        <section id="curation" className="space-y-12">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#e0a96d] font-semibold">01 // The Curation Framework</p>
            <h2 className="text-3xl font-sans font-light tracking-tight text-white">Sculpted Framework Artifacts</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Elegant Main Feature Card */}
            <div className="lg:col-span-7 silk-panel rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between silk-card-hover min-h-[440px]">
              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-[#e0a96d] w-fit">
                <AudioLines className="w-5 h-5" />
              </div>
              <div className="space-y-4 max-w-xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#e0a96d]/70">Curation Suite</span>
                <h3 className="text-2xl sm:text-3xl font-sans font-light text-white">The Symphony Engine</h3>
                <p className="text-sm text-[#948880] leading-relaxed">
                  Automatically balances multi-layered vocal tracks while introducing microscopic human pauses, authentic inhalation signatures, and contextual speech cadence variations perfectly across paragraphs.
                </p>
              </div>
            </div>

            {/* Side Column Stack */}
            <div className="lg:col-span-5 grid sm:grid-cols-1 gap-8">
              
              {/* Secondary Block A */}
              <div className="silk-panel rounded-[2.5rem] p-8 flex flex-col justify-between silk-card-hover">
                <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-[#e0a96d] w-fit">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="space-y-2 mt-12">
                  <h4 className="text-lg font-sans font-light text-white">Bespoke Architectural Tone</h4>
                  <p className="text-xs text-[#948880] leading-relaxed">
                    Tailor acoustic frequencies precisely for art exhibits, continuous spatial atmospheres, or high-end soundbooks.
                  </p>
                </div>
              </div>

              {/* Secondary Block B */}
              <div className="silk-panel rounded-[2.5rem] p-8 flex flex-col justify-between silk-card-hover">
                <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-[#e0a96d] w-fit">
                  <InfinityIcon className="w-4 h-4" />
                </div>
                <div className="space-y-2 mt-12">
                  <h4 className="text-lg font-sans font-light text-white">Infinite Continuum Synthesis</h4>
                  <p className="text-xs text-[#948880] leading-relaxed">
                    Stream high-resolution conversational audio vectors smoothly and seamlessly to global delivery end-points instantly.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Highly Intuitive Mixing Board Audition Desk */}
        <section id="atelier" className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#e0a96d] font-semibold">02 // Voice Preview</p>
            <h2 className="text-3xl font-sans font-light tracking-tight text-white">The Audition Room</h2>
            <p className="text-sm text-[#948880] max-w-xl">
              Select a master profile to view its acoustic architectural tuning and test live sample vectors.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Profile Selection list */}
            <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-[#948880] font-medium">Select Vocal Profile</p>
                <div className="space-y-3">
                  {acousticProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProfile(p.id)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 block relative overflow-hidden ${
                        activeProfile === p.id 
                          ? "bg-white/[0.03] border-[#e0a96d]/40 shadow-lg shadow-black/40" 
                          : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-sans font-normal text-white">{p.name}</h3>
                          <p className="text-xs text-[#948880] mt-0.5">{p.tone}</p>
                        </div>
                        <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                          activeProfile === p.id 
                            ? "text-[#e0a96d] border-[#e0a96d]/20 bg-[#e0a96d]/5" 
                            : "text-[#948880]/70 border-white/5"
                        }`}>
                          {p.space}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Engine Status Callout */}
              <div className="silk-panel rounded-2xl p-4 flex items-center gap-3 border border-white/5 bg-white/[0.01]">
                <div className="w-2 h-2 rounded-full bg-[#e0a96d] animate-pulse" />
                <span className="text-[11px] tracking-wide text-[#948880]">
                  Engine Matrix: <span className="text-white font-medium">Calibrated for Ultra-High Fidelity</span>
                </span>
              </div>
            </div>

            {/* Right Column: Unified Tuning Controls */}
            <div className="lg:col-span-7 silk-panel rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between border border-white/5 relative bg-gradient-to-b from-white/[0.01] to-transparent">
              
              {/* Dynamic Information Block */}
              <div className="space-y-3 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#e0a96d] uppercase tracking-widest">
                  <Music className="w-3 h-3" />
                  <span>Active Configuration</span>
                </div>
                <h4 className="text-xl font-sans text-white font-light">
                  {currentProfileData.name} — <span className="italic text-[#948880] text-lg font-normal">{currentProfileData.tone}</span>
                </h4>
                <p className="text-sm text-[#948880] leading-relaxed max-w-xl">
                  {currentProfileData.description}
                </p>
              </div>

              {/* Audio Controls Matrix */}
              <div className="space-y-6 pt-6">
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#948880] flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-[#e0a96d]" /> Custom Vector Balance
                    </span>
                    <span className="font-mono text-[#e0a96d] uppercase tracking-widest text-[10px]">
                      {isAuditioning ? "Streaming Active Sample" : "Quiescent Mode"}
                    </span>
                  </div>

                  {/* Clean Visual Waveform Block */}
                  <div className="h-12 flex items-center justify-between gap-[4px] px-1">
                    {fluidRhythms.map((height, i) => (
                      <div 
                        key={i} 
                        className={`w-full rounded-full transition-all duration-150 origin-center ${
                          isAuditioning ? "bg-[#e0a96d]" : "bg-white/10"
                        }`}
                        style={{ height: `${height}%`, transform: `scaleY(${isAuditioning ? 1 : 0.4})` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Saturation Parameters Mixer Row */}
                <div className="grid sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#948880]">Saturation Depth</span>
                      <span className="text-[#e0a96d] font-mono">{resonanceDepth}%</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" value={resonanceDepth}
                      onChange={(e) => setResonanceDepth(Number(e.target.value))}
                      className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e0a96d]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <Button 
                      onClick={() => setIsAuditioning(!isAuditioning)}
                      className={`w-full h-12 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 ${
                        isAuditioning 
                          ? "bg-[#fcfbf7] text-[#0b0908] hover:bg-neutral-200 shadow-xl shadow-white/5" 
                          : "bg-transparent border border-white/10 text-white hover:bg-white/5"
                      }`}
                    >
                      {isAuditioning ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-[#0b0908]" /> Stop Sample
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" /> Audition Texture
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Section 3: The Grand Architectural Call to Action */}
        <section id="philosophy" className="relative rounded-[3.5rem] overflow-hidden p-[1px] bg-gradient-to-b from-white/10 via-transparent to-transparent">
          <div className="w-full bg-gradient-to-b from-[#13100e] to-[#0b0908] rounded-[3.4rem] py-28 px-6 text-center space-y-8 relative overflow-hidden">
            
            {/* Abstract Decorative Element */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full border border-[#e0a96d]/10 blur-[2px]" />
            </div>

            <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0a96d]">The Resonance Invitation</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-light tracking-tight text-white leading-tight">
                Step into a brand new era of <br />
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#e0a96d] to-white">vocal eloquence.</span>
              </h2>
            </div>

            <p className="text-sm text-[#948880] max-w-md mx-auto relative z-10 leading-relaxed font-light">
              Experience synthetic audio custom engineering tailored for beautiful editorial design. Open your studio layout today.
            </p>

            <div className="relative z-10 pt-4">
              <Link href="/app">
                <Button size="lg" className="rounded-full h-16 px-12 bg-[#e0a96d] text-[#0b0908] hover:bg-white hover:text-black font-medium tracking-widest text-xs uppercase transition-all duration-500 shadow-2xl shadow-[#e0a96d]/10">
                  Enter Interactive Atelier Studio
                </Button>
              </Link>
            </div>
            
          </div>
        </section>

      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 text-center text-xs text-[#948880]/50 tracking-wider">
        <p>© 2026 Resonance Acoustics Inc. Crafted Frame Mechanics.</p>
      </footer>

    </div>
  );
}