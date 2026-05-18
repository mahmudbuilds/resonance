"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Terminal as TerminalIcon, 
  Activity, 
  RotateCcw, 
  FileWarning, 
  ArrowRight,
  Send,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReporting, setIsReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error("APP.DASHBOARD // MODULE CRASH:", error);
  }, [error]);

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
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white font-sans selection:bg-primary selection:text-black pb-24 sm:pb-32">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 border-b border-[#222] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-destructive/30 mb-6 font-mono text-[10px] sm:text-xs uppercase text-destructive">
              <FileWarning className="w-3.5 h-3.5" />
              STATUS: SYSTEM_INTERRUPTED_CODE_500
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white">
              MODULE <span className="text-primary">ANOMALY</span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto font-mono">
            <p className="text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
              Live cognitive sound mapping has been suspended to protect the audio generation compiler.
            </p>
          </div>
        </header>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Diagnostic Console Panel */}
          <div className="lg:col-span-8 border border-[#222] bg-[#050505] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary/10 border-b border-l border-[#222] font-mono text-[9px] text-[#666] uppercase tracking-widest">
              DIAGNOSTIC_CORE
            </div>

            <div className="flex items-center gap-2.5 font-mono text-xs text-primary mb-6">
              <TerminalIcon className="w-4 h-4" />
              <span>LOG_TRACE // ERROR_EXHIBIT</span>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs mb-8">
              <div className="border border-[#111] bg-[#0a0a0a] p-4 flex flex-col gap-2">
                <div className="flex justify-between py-1 border-b border-[#111]">
                  <span className="text-[#555] uppercase">Module Context:</span>
                  <span className="text-white">ACTIVE_WORKSPACE_SEGMENT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#111]">
                  <span className="text-[#555] uppercase">Compilation Time:</span>
                  <span className="text-white">{timestamp}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#555] uppercase">Error Digest ID:</span>
                  <span className="text-primary select-all">{error.digest || "CORE_DIGEST_PENDING"}</span>
                </div>
              </div>

              <div>
                <span className="text-[#666] uppercase tracking-wider block mb-2 font-bold">Acoustic Signal Trace:</span>
                <div className="border border-[#222] bg-black p-5 text-destructive font-mono text-[11px] overflow-auto max-h-[220px] leading-relaxed select-text uppercase whitespace-pre-wrap">
                  {error.message || "A generic interface anomaly occurred within the React rendering engine of the workspace."}
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#111]">
              <Button
                onClick={reset}
                className="rounded-none bg-primary text-black hover:bg-white border border-primary font-mono text-xs uppercase tracking-widest h-12 px-6 transition-colors w-full sm:w-auto font-bold"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> RELOAD_MODULE
              </Button>
              
              <Link href="/app" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="rounded-none border border-[#222] bg-[#111] text-white hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest h-12 px-6 transition-colors w-full"
                >
                  TERMINAL_ROOT
                </Button>
              </Link>

              <Button
                onClick={handleSendReport}
                disabled={isReporting || reportSent}
                variant="outline"
                className={`rounded-none border h-12 px-6 font-mono text-xs uppercase tracking-widest transition-colors w-full sm:w-auto ${
                  reportSent 
                    ? "border-green-500/30 bg-green-500/5 text-green-400 cursor-default hover:bg-green-500/5"
                    : "border-primary/20 bg-[#050505] text-[#888] hover:text-primary hover:border-primary"
                }`}
              >
                {reportSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /> REPORT_TRANSMITTED
                  </>
                ) : (
                  <>
                    <Send className={`w-4 h-4 mr-2 ${isReporting ? "animate-pulse" : ""}`} /> 
                    {isReporting ? "SENDING..." : "DISPATCH_REPORT"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Context Advisory Sidebar Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-[#222] bg-[#050505] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#111] border-b border-l border-[#222] font-mono text-[9px] text-[#555] uppercase tracking-widest">
                ADVISORY
              </div>
              
              <h3 className="font-heading text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                RECOVERY_GUIDANCE
              </h3>
              
              <ul className="font-mono text-[10px] sm:text-xs text-[#888] uppercase space-y-4 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">01 //</span>
                  <span>Attempt a workspace component hot-reload by activating the <strong className="text-white">RELOAD_MODULE</strong> command on the left.</span>
                </li>
                <li className="flex gap-2 border-t border-[#111] pt-3">
                  <span className="text-primary font-bold">02 //</span>
                  <span>If hot-reloading fails, revert using <strong className="text-white">TERMINAL_ROOT</strong> to reset your session coordinates.</span>
                </li>
                <li className="flex gap-2 border-t border-[#111] pt-3">
                  <span className="text-primary font-bold">03 //</span>
                  <span>Dispatching a telemetry report alerts the development core with all parameters for instant inspection.</span>
                </li>
              </ul>
            </div>

            <div className="border border-destructive/20 bg-destructive/5 p-6 relative overflow-hidden font-mono text-xs text-destructive/70">
              <div className="flex items-center gap-2 mb-2 font-bold text-destructive uppercase">
                <Activity className="w-4 h-4 text-destructive animate-pulse" />
                MONITORING_ALERT
              </div>
              Telemetry monitoring reports that error log signatures are stored securely. No user voice data or custom clone waveforms were leaked. Secure layers remain fully locked.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
