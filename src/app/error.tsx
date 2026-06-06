"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowUpRight,
  Disc,
  Home,
  RefreshCw,
  Sparkles,
  Terminal as TerminalIcon,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const kineticStyles = `
  @keyframes grid-drift {
    0% { background-position: 0px 0px; }
    100% { background-position: 40px 40px; }
  }
  @keyframes fluid-pulse {
    0%, 100% { transform: scale(1) rotate(0deg); filter: blur(80px); }
    50% { transform: scale(1.2) rotate(180deg); filter: blur(120px); }
  }
  @keyframes wave-glitch {
    0%, 100% { transform: scaleY(0.15) translateZ(10px); opacity: 0.45; }
    25% { transform: scaleY(0.9) translateZ(40px); opacity: 0.85; }
    50% { transform: scaleY(0.2) translateZ(15px); opacity: 0.3; }
    75% { transform: scaleY(1.1) translateZ(60px); opacity: 0.9; }
  }
  @keyframes status-blink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
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
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.12);
    color: transparent;
  }

  .glass-card-3d {
    background: linear-gradient(135deg, rgba(20, 20, 25, 0.4) 0%, rgba(10, 10, 15, 0.6) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
  }

  .glass-card-3d::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06), transparent 40%);
    z-index: 1;
    pointer-events: none;
  }

  .glass-card-3d > * {
    transform: translateZ(30px);
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("SYS.LOG // CRITICAL ANOMALY DETECTED:", error);
  }, [error]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMouseCoord({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen text-white bg-[#030305] overflow-hidden selection:bg-pink-500/30 relative font-sans">
      <style dangerouslySetInnerHTML={{ __html: kineticStyles }} />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 sonic-grid-bg opacity-70" />

        <div
          className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 12s ease-in-out infinite",
            transform: `translate(${mouseCoord.x * -50}px, ${mouseCoord.y * -50}px)`,
          }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-pink-600/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 16s ease-in-out infinite reverse",
            transform: `translate(${mouseCoord.x * 70}px, ${mouseCoord.y * 70}px)`,
          }}
        />
        <div
          className="absolute top-[35%] left-[45%] w-[400px] h-[400px] bg-sky-500/5 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 22s ease-in-out infinite",
            transform: `translate(${mouseCoord.x * 40}px, ${mouseCoord.y * -60}px)`,
          }}
        />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 w-full min-h-screen preserve-3d perspective-2500 flex flex-col"
        style={{
          transform: `rotateX(${mouseCoord.y * -8}deg) rotateY(${mouseCoord.x * 8}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <nav className="w-full pt-8 px-6 lg:px-16 preserve-3d transform translate-z-[50px] shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Resonance"
                width={56}
                height={56}
                className="w-14 h-14 group-hover:scale-110 transition-transform duration-500 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Resonance
              </span>
            </Link>

            <div className="inline-flex items-center gap-2.5 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2">
              <span
                className="w-2 h-2 rounded-full bg-pink-500"
                style={{ animation: "status-blink 1.4s ease-in-out infinite" }}
              />
              <span className="text-xs font-medium text-pink-400 tracking-wide">
                SYS.STATUS — FAULT_DETECTED
              </span>
            </div>
          </div>
        </nav>

        <header className="max-w-7xl mx-auto w-full px-6 lg:px-16 pt-20 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center preserve-3d flex-1">
          <div className="lg:col-span-7 space-y-8 text-left preserve-3d z-20">
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-zinc-300">
                Cognitive synthesis has been interrupted
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1] preserve-3d">
              <span className="block transform translate-z-[60px] text-white pb-2">
                Critical
              </span>
              <span className="block transform translate-z-[110px] text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                system fault.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed transform translate-z-[40px]">
              An unhandled exception interrupted the acoustic synthesis pipeline. The neural cognitive module returned a termination state — but the system can be reactivated below.
            </p>

            <div className="pt-6 flex flex-wrap gap-4 transform translate-z-[80px]">
              <Button
                onClick={reset}
                size="lg"
                className="rounded-full h-14 px-8 bg-white text-black hover:bg-zinc-200 font-semibold text-base transition-all duration-300 shadow-2xl flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reboot Module
                <ArrowUpRight className="w-5 h-5" />
              </Button>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-8 bg-transparent border-white/20 hover:border-white hover:bg-white/5 text-white font-semibold text-base transition-all duration-300"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 w-full h-[480px] relative preserve-3d z-10 transform translate-z-[40px] hidden lg:block">
            <div
              className="absolute inset-0 border border-white/10 bg-black/40 backdrop-blur-3xl p-8 flex flex-col justify-between preserve-3d rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              style={{
                transform: `translateZ(20px) rotateX(${mouseCoord.y * -4}deg) rotateY(${mouseCoord.x * 4}deg)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 transform translate-z-[30px]">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-pink-500" style={{ animation: "status-blink 2s ease-in-out infinite" }} />
                  <span className="font-medium text-sm text-zinc-400">
                    Signal interrupted...
                  </span>
                </div>
                <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">
                  Fault Trace
                </span>
              </div>

              <div className="py-8 flex justify-between items-center gap-1.5 h-44 preserve-3d">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full rounded-full"
                    style={{
                      height: "100%",
                      background: i % 3 === 0
                        ? "linear-gradient(to top, rgba(236, 72, 153, 0.5), rgba(236, 72, 153, 0.9))"
                        : "linear-gradient(to top, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.9))",
                      animation: `wave-glitch ${1.0 + (i * 0.06)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                ))}
              </div>

              <div className="border-t border-white/5 pt-5 space-y-3 transform translate-z-[50px]">
                <div className="flex justify-between text-sm font-medium text-zinc-400">
                  <span>Pipeline integrity</span>
                  <span className="text-pink-400">42.18% degraded</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 relative overflow-hidden rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: "42%",
                      background: "linear-gradient(to right, #6366f1, #ec4899)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto w-full px-6 lg:px-16 pb-16 preserve-3d">
          <div className="glass-card-3d relative rounded-3xl p-8 sm:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-pink-500/10 border-b border-l border-pink-500/20 rounded-bl-2xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400">
                Fault Trace
              </span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <TerminalIcon className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-zinc-400 tracking-wider">
                DIAGNOSTIC_ARCHIVE // {timestamp.replace(/[^0-9]/g, "").substring(0, 14)}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Exception ID
                </div>
                <div className="text-white font-mono text-sm select-all break-all">
                  {error.digest || "ERR_0x9A7C8E"}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Timestamp
                </div>
                <div className="text-white font-mono text-sm select-all break-all">
                  {timestamp}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Module Ref
                </div>
                <div className="text-primary font-mono text-sm">
                  RESONANCE_ROUTER
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400 font-bold">
                  Fault Message
                </span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs overflow-auto max-h-[160px] leading-relaxed select-text whitespace-pre-wrap">
                {error.message ||
                  "An unknown interruption occurred within the Next.js runtime routing framework."}
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-xl py-6 px-6 lg:px-16 preserve-3d transform translate-z-[40px] shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">
              © 2026 Resonance Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-400">
              <Waves className="w-4 h-4 text-primary" />
              <span>Secure protocol — SSL_TLS_v1.3</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
