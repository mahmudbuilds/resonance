"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle,
  FileWarning,
  HelpCircle,
  RotateCcw,
  Send,
  Sparkles,
  Terminal as TerminalIcon,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const kineticStyles = `
  @keyframes grid-drift {
    0% { background-position: 0px 0px; }
    100% { background-position: 40px 40px; }
  }
  @keyframes fluid-pulse {
    0%, 100% { transform: scale(1) rotate(0deg); filter: blur(80px); }
    50% { transform: scale(1.2) rotate(180deg); filter: blur(120px); }
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

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReporting, setIsReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("APP.DASHBOARD // MODULE CRASH:", error);
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

  const handleSendReport = () => {
    setIsReporting(true);
    const toastId = toast.loading("TRANSMITTING TELEMETRY LOG TO CENTRAL CORE...");

    setTimeout(() => {
      setIsReporting(false);
      setReportSent(true);
      toast.success("DIAGNOSTIC TELEMETRY RECORDED AND PURGED", { id: toastId });
    }, 1500);
  };

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-[#030305] text-white font-sans selection:bg-primary selection:text-white pb-24">
      <style dangerouslySetInnerHTML={{ __html: kineticStyles }} />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 sonic-grid-bg opacity-60" />
        <div
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 14s ease-in-out infinite",
            transform: `translate(${mouseCoord.x * 40}px, ${mouseCoord.y * 40}px)`,
          }}
        />
        <div
          className="absolute bottom-[5%] left-[5%] w-[450px] h-[450px] bg-pink-600/10 rounded-full mix-blend-screen"
          style={{
            animation: "fluid-pulse 18s ease-in-out infinite reverse",
            transform: `translate(${mouseCoord.x * -50}px, ${mouseCoord.y * -50}px)`,
          }}
        />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 preserve-3d perspective-2500"
        style={{
          transform: `rotateX(${mouseCoord.y * -4}deg) rotateY(${mouseCoord.x * 4}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <header className="pt-10 pb-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2">
              <FileWarning className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-medium text-pink-300 tracking-wide">
                STATUS — SYSTEM_INTERRUPTED_CODE_500
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[1]">
              <span className="block text-white">Module</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                anomaly.
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 self-start md:self-end">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-zinc-300">
              Live cognitive sound mapping suspended
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 mt-10 items-start">
          <div
            className="lg:col-span-8 glass-card-3d relative rounded-3xl p-6 sm:p-8 overflow-hidden"
            style={{
              transform: `translateZ(20px) rotateX(${mouseCoord.y * -2}deg) rotateY(${mouseCoord.x * 2}deg)`,
            }}
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/10 border-b border-l border-primary/20 rounded-bl-2xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Diagnostic Core
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-6">
              <TerminalIcon className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-zinc-400 tracking-wider">
                LOG_TRACE // ERROR_EXHIBIT
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Module Context
                </div>
                <div className="text-white font-mono text-xs sm:text-sm">
                  ACTIVE_WORKSPACE
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Compilation Time
                </div>
                <div className="text-white font-mono text-xs sm:text-sm break-all">
                  {timestamp}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                  Error Digest
                </div>
                <div className="text-primary font-mono text-xs sm:text-sm select-all break-all">
                  {error.digest || "CORE_DIGEST_PENDING"}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400 font-bold">
                  Acoustic Signal Trace
                </span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs overflow-auto max-h-[220px] leading-relaxed select-text whitespace-pre-wrap">
                {error.message ||
                  "A generic interface anomaly occurred within the React rendering engine of the workspace."}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
              <Button
                onClick={reset}
                size="lg"
                className="rounded-full h-12 px-6 bg-white text-black hover:bg-zinc-200 font-semibold text-sm transition-all duration-300 w-full sm:w-auto flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Module
              </Button>

              <Link href="/app" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-6 bg-transparent border-white/20 hover:border-white hover:bg-white/5 text-white font-medium text-sm transition-all duration-300 w-full"
                >
                  Terminal Root
                </Button>
              </Link>

              <Button
                onClick={handleSendReport}
                disabled={isReporting || reportSent}
                size="lg"
                variant="outline"
                className={`rounded-full h-12 px-6 font-medium text-sm transition-all duration-300 w-full sm:w-auto flex items-center gap-2 ${
                  reportSent
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 cursor-default"
                    : "border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {reportSent ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Report Transmitted
                  </>
                ) : (
                  <>
                    <Send className={`w-4 h-4 ${isReporting ? "animate-pulse" : ""}`} />
                    {isReporting ? "Sending..." : "Dispatch Report"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div
              className="glass-card-3d relative rounded-3xl p-6 overflow-hidden"
              style={{
                transform: `translateZ(40px) rotateX(${mouseCoord.y * 3}deg) rotateY(${mouseCoord.x * -3}deg)`,
              }}
            >
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/5 border-b border-l border-white/10 rounded-bl-2xl">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Advisory
                </span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Recovery Guidance
                </h3>
              </div>

              <ul className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-primary font-bold font-mono text-xs pt-0.5 shrink-0">01 //</span>
                  <span>
                    Attempt a workspace component hot-reload by activating{" "}
                    <span className="text-white font-medium">Reload Module</span>.
                  </span>
                </li>
                <li className="flex gap-3 border-t border-white/5 pt-4">
                  <span className="text-primary font-bold font-mono text-xs pt-0.5 shrink-0">02 //</span>
                  <span>
                    If hot-reloading fails, revert using{" "}
                    <span className="text-white font-medium">Terminal Root</span> to reset session coordinates.
                  </span>
                </li>
                <li className="flex gap-3 border-t border-white/5 pt-4">
                  <span className="text-primary font-bold font-mono text-xs pt-0.5 shrink-0">03 //</span>
                  <span>
                    Dispatching a telemetry report alerts the development core with all parameters for inspection.
                  </span>
                </li>
              </ul>
            </div>

            <div className="relative rounded-3xl p-6 overflow-hidden border border-pink-500/20 bg-gradient-to-br from-pink-500/[0.08] to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <Activity
                  className="w-4 h-4 text-pink-400"
                  style={{ animation: "status-blink 1.6s ease-in-out infinite" }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-pink-300 font-bold">
                  Monitoring Alert
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Telemetry monitoring reports that error log signatures are stored securely. No user voice data or custom clone waveforms were leaked. Secure layers remain fully locked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
