"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  AudioLines,
  Mic2,
  Volume2,
  Sparkles,
  Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen text-foreground font-sans relative selection:bg-primary/20 selection:text-white pb-20">
      
      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-md animate-fade-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight text-white">
              Resonance
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors duration-300">Features</a>
            <a href="#technology" className="hover:text-white transition-colors duration-300">Technology</a>
          </div>

          <div>
            <Link href="/app">
              <Button className="rounded-full bg-primary text-white hover:bg-primary/90 font-medium text-sm h-10 px-6 transition-all duration-300 shadow-lg shadow-primary/20">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 text-center space-y-8">
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold tracking-wider uppercase">Next-Generation Voice Synthesis</span>
        </div>

        <h1 className="animate-fade-up stagger-1 font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
          Breathe life into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            digital words.
          </span>
        </h1>

        <p className="animate-fade-up stagger-2 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
          Generate stunning voiceovers, clone voices with minimal audio samples, and explore a vast library of expressive AI voices engineered for creators.
        </p>

        <div className="animate-fade-up stagger-3 pt-6 flex justify-center gap-4 flex-col sm:flex-row items-center">
          <Link href="/app">
            <Button size="lg" className="rounded-full h-14 px-8 bg-primary text-white hover:bg-primary/90 hover:scale-105 font-medium tracking-wide text-sm transition-all duration-300 shadow-xl shadow-primary/25 group w-full sm:w-auto">
              Start Creating
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 font-medium tracking-wide text-sm transition-all duration-300 w-full sm:w-auto">
            Explore Voices
          </Button>
        </div>
      </header>

      {/* Feature Showcase */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 space-y-32">
        
        <section id="features" className="space-y-16">
          <div className="space-y-4 text-center animate-fade-up">
            <h2 className="text-4xl sm:text-5xl font-heading font-semibold tracking-tight text-white">Powerful Audio Creation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to produce high-fidelity voice content in one seamless, beautiful workspace.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col items-start gap-6 animate-fade-up stagger-1 group">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary w-fit group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <AudioLines className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-semibold text-white">Text to Speech</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert text into lifelike audio instantly. Adjust pacing, tone, and inflection with our intuitive parameters to get the exact read you need.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col items-start gap-6 animate-fade-up stagger-2 group">
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 w-fit group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300">
                <Mic2 className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-semibold text-white">Voice Cloning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create an accurate digital replica of any voice using just a few minutes of audio. Perfect for scalable narration while maintaining brand identity.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col items-start gap-6 animate-fade-up stagger-3 group">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-300">
                <Volume2 className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-heading font-semibold text-white">Voice Library</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse a beautifully curated collection of high-fidelity voices across multiple languages, accents, and emotional tones.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* The Call to Action */}
        <section className="relative rounded-[3rem] overflow-hidden p-[1px] glass-panel animate-fade-up">
          <div className="w-full rounded-[3rem] py-24 px-6 text-center space-y-8 relative overflow-hidden bg-background/50">
            
            <div className="space-y-6 relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-heading font-semibold tracking-tight text-white leading-tight">
                Ready to hear the difference?
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Join thousands of creators producing studio-quality audio in minutes.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex justify-center">
              <Link href="/app">
                <Button size="lg" className="rounded-full h-14 px-10 bg-white text-black hover:bg-zinc-200 hover:scale-105 font-medium tracking-wide text-sm transition-all duration-300 shadow-2xl">
                  Open Studio Dashboard
                </Button>
              </Link>
            </div>
            
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 text-center text-sm text-muted-foreground/60 tracking-wide mt-24">
        <p>© 2026 Resonance Platform. Next-generation acoustic synthesis.</p>
      </footer>

    </div>
  );
}