"use client";

import { useEffect } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  ArrowRight, 
  Mic, 
  RefreshCw, 
  Home, 
  ShieldAlert,
  Terminal as TerminalIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or an analytics service
    console.error("SYS.LOG // CRITICAL ANOMALY DETECTED:", error);
  }, [error]);

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen bg-black relative selection:bg-primary selection:text-black font-sans text-white overflow-hidden flex flex-col justify-between">
      {/* Brutalist Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-[#222] bg-black/80 backdrop-blur-md shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 h-20">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <span className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-widest text-white">RESONANCE</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-mono text-[10px] text-destructive uppercase tracking-widest flex items-center gap-2 border border-destructive/20 bg-destructive/5 px-3 py-1">
              SYS.STATUS: <span className="text-destructive ml-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-destructive rounded-none animate-pulse"></span> FAULT_DETECTED</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 py-12 max-w-[1600px] mx-auto w-full border-x-0 sm:border-x border-[#222]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-destructive to-transparent" />
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative">
            <div className="inline-flex items-center gap-3 border border-destructive/30 bg-destructive/5 px-4 py-2 mb-8">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-destructive">CORE_EXCEPTION_PROTOCOL_V5.0</span>
            </div>
            
            <h1 className="fluid-heading-lg mb-6 text-white text-4xl sm:text-6xl md:text-7xl font-heading font-bold uppercase tracking-tighter leading-none">
              CRITICAL <br />
              <span className="text-destructive">SYSTEM_FAULT.</span>
            </h1>
            
            <p className="text-lg sm:text-xl font-sans text-[#888] max-w-2xl mb-10 leading-relaxed uppercase">
              An unhandled exception has interrupted the acoustic synthesis pipeline. The neural cognitive module responded with a termination state.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Button 
                onClick={reset}
                size="lg" 
                className="rounded-none h-14 sm:h-16 px-8 sm:px-10 bg-primary text-black hover:bg-white hover:text-black font-mono uppercase tracking-widest text-xs sm:text-sm transition-colors border border-primary w-full sm:w-auto font-bold"
              >
                <RefreshCw className="w-4 h-4 mr-2.5 animate-spin" />
                Reboot Module
              </Button>
              <Link href="/app" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="rounded-none h-14 sm:h-16 px-8 sm:px-10 border border-[#222] bg-[#050505] text-white hover:bg-[#111] font-mono uppercase tracking-widest text-xs sm:text-sm transition-colors w-full"
                >
                  <Home className="w-4 h-4 mr-2.5" />
                  Console Home
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 w-full">
            <div className="w-full border border-destructive/20 relative bg-[#050505] overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-destructive/10 border-b border-l border-destructive/20 font-mono text-[9px] text-destructive uppercase tracking-widest">
                FAULT_TRACE
              </div>
              
              {/* Terminal Diagnostics */}
              <div className="p-6 sm:p-8 font-mono text-xs text-[#888] flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[#222] pb-3 text-[#555]">
                  <TerminalIcon className="w-4 h-4 text-destructive" />
                  <span>DIAGNOSTIC ARCHIVE // AT_TIME_{timestamp.replace(/[^0-9]/g, "").substring(0, 14)}</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between border-b border-[#111] py-1">
                    <span className="text-[#555]">EXCEPTION_ID:</span>
                    <span className="text-white select-all">{error.digest || "ERR_0x9A7C8E"}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#111] py-1">
                    <span className="text-[#555]">TIMESTAMP:</span>
                    <span className="text-white select-all">{timestamp}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#111] py-1">
                    <span className="text-[#555]">MODULE_REF:</span>
                    <span className="text-primary">RESONANCE_ROUTER</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-destructive font-bold uppercase tracking-wider block mb-2">FAULT_MESSAGE:</span>
                  <div className="bg-[#0a0a0a] border border-[#222] p-4 text-white font-mono text-[11px] overflow-auto max-h-[160px] leading-relaxed select-text uppercase whitespace-pre-wrap">
                    {error.message || "An unknown interruption occurred within the Next.js runtime routing framework."}
                  </div>
                </div>

                <div className="mt-2 text-[9px] text-[#444] uppercase tracking-wider text-center">
                  WARNING: DO NOT ATTEMPT TO FORCE SYNTHESIS WITHOUT REBOOTING INTERNALS.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-50 w-full border-t border-[#222] bg-[#050505] py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="font-mono text-[9px] text-[#444] uppercase tracking-widest">
            © 2026 RESONANCE INC. COGNITIVE SYNTHESIS LABS.
          </span>
          <span className="font-mono text-[9px] text-[#666] uppercase tracking-widest">
            SECURE PROTOCOL // SSL_TLS_v1.3
          </span>
        </div>
      </footer>
    </div>
  );
}
