"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Mic, 
  Sparkles, 
  Volume2, 
  Zap, 
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary font-sans text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-primary/20 blur-[120px] rounded-[100%] opacity-50" />
        <div className="absolute top-1/4 -left-[20%] w-[50vw] h-[50vh] bg-blue-500/10 blur-[120px] rounded-[100%] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-purple-500/10 blur-[120px] rounded-[100%] opacity-30 mix-blend-screen" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Override global font for the landing page to look sleek */
        .landing-wrapper {
          font-family: var(--font-sans, system-ui, sans-serif);
        }
      `}}></style>

      {/* Navigation */}
      <nav className="relative z-50 w-full px-6 py-6 max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">Resonance</span>
        </div>
        <div>
          <Link href="/app">
            <Button className="bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full px-8 h-12 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0 font-bold gap-2 text-base">
              Enter App <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center landing-wrapper">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 pt-24 md:pt-32 pb-32 text-center max-w-5xl mx-auto min-h-[75vh]">
          <Badge variant="outline" className="mb-8 rounded-full border-primary/30 bg-primary/5 text-primary py-2 px-5 shadow-[0_0_20px_rgba(var(--primary),0.1)] backdrop-blur-md text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Vocal Synthesis Engine v2.0
          </Badge>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 leading-[1.05] drop-shadow-sm">
            Give your ideas a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/40 pb-2">
              voice that resonates.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-medium">
            Ultra-realistic text-to-speech and instant voice cloning. 
            Built for creators, developers, and visionary teams.
          </p>

          <Link href="/app">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] hover:-translate-y-1 font-bold group">
              Launch Console
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </section>

        {/* Marquee */}
        <section className="w-full py-12 border-y border-border/10 bg-black/10 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-24 items-center px-12">
                {['Acme Corp', 'GlobalNet', 'Nexus AI', 'Quantum Studios', 'Vanguard', 'Starlight Media', 'Pinnacle'].map((brand, j) => (
                  <span key={j} className="text-3xl md:text-4xl font-black text-muted-foreground/20 uppercase tracking-tighter whitespace-nowrap">
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Engineered for Excellence</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Everything you need to produce studio-grade audio experiences, packed into a blazing-fast dashboard.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Main feature */}
            <div className="md:col-span-2 relative rounded-[2rem] border border-border/30 bg-card/10 backdrop-blur-xl p-10 overflow-hidden group hover:border-primary/40 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col h-full justify-end">
                <Volume2 className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Neural Text-to-Speech</h3>
                <p className="text-muted-foreground text-lg md:text-xl max-w-lg">Generate lifelike speech with natural intonation. Our AI understands context to emphasize the right words at the right time.</p>
              </div>
            </div>
            
            {/* Small feature 1 */}
            <div className="relative rounded-[2rem] border border-border/30 bg-card/10 backdrop-blur-xl p-8 overflow-hidden group hover:border-purple-500/40 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col h-full justify-end">
                <Mic className="w-10 h-10 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Voice Cloning</h3>
                <p className="text-muted-foreground text-lg">Create a perfect digital replica of any voice using just a 10-second sample.</p>
              </div>
            </div>

            {/* Small feature 2 */}
            <div className="relative rounded-[2rem] border border-border/30 bg-card/10 backdrop-blur-xl p-8 overflow-hidden group hover:border-blue-500/40 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col h-full justify-end">
                <Zap className="w-10 h-10 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Ultra-Low Latency</h3>
                <p className="text-muted-foreground text-lg">Stream high-fidelity audio in real-time, perfect for interactive AI agents.</p>
              </div>
            </div>

            {/* Main feature 2 */}
            <div className="md:col-span-2 relative rounded-[2rem] border border-border/30 bg-card/10 backdrop-blur-xl p-10 overflow-hidden group hover:border-emerald-500/40 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 group-hover:bg-emerald-500/10 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col h-full justify-end">
                <Globe className="w-12 h-12 text-emerald-400 mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Global Reach</h3>
                <p className="text-muted-foreground text-lg md:text-xl max-w-lg">Break language barriers. Access over 40 languages and a multitude of localized accents to reach a worldwide audience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="w-full py-32 border-t border-border/10 bg-black/20 backdrop-blur-md relative overflow-hidden mt-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Ready to create?</h2>
            <p className="text-xl text-muted-foreground mb-10">Step into the studio and transform your text into lifelike speech in seconds.</p>
            <Link href="/app">
              <Button size="lg" className="rounded-full h-16 px-12 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-1 group">
                Open App Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
