import React from "react";
import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-black relative selection:bg-primary selection:text-black font-sans text-white overflow-hidden">
      {/* Brutalist Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Left side - Visual Showcase */}
      <div className="relative hidden w-0 flex-1 md:block border-r border-[#222] z-10 bg-black/50 backdrop-blur-sm">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="inline-flex items-center gap-3 border border-[#222] bg-[#050505] px-4 py-2 w-max">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-primary">SYS.AUTH MODULE</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="fluid-heading-xl text-white mb-8 leading-[0.9]">
              ACCESS <br />
              <span className="text-primary">TERMINAL.</span>
            </h1>
            
            <p className="text-lg font-sans text-[#888] max-w-md leading-relaxed">
              Identify yourself to access the Resonance synthesis engine. Unauthorized access will be logged and terminated.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="h-16 w-16 border border-[#222] bg-[#050505] flex items-center justify-center text-[10px] font-mono text-[#555]">01</div>
            <div className="h-16 w-16 border border-[#222] bg-[#050505] flex items-center justify-center text-[10px] font-mono text-[#555]">SYS</div>
            <div className="h-16 w-16 border border-primary bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono animate-pulse">RDY</div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Component */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 items-center z-10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto w-full max-w-md lg:w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
