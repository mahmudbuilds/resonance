import React from "react";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row relative selection:bg-primary/30 selection:text-white font-sans text-white overflow-hidden">
      {/* Background is handled by RootLayout (aurora-bg) */}

      {/* Left side - Visual Showcase */}
      <div className="relative hidden w-0 flex-1 md:flex items-center justify-center p-12 z-10">
        <div className="glass-panel p-12 rounded-3xl max-w-2xl w-full border border-white/5 shadow-2xl flex flex-col justify-between h-[80%] relative overflow-hidden">
          {/* subtle gradient orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full filter blur-[80px] opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Resonance System
            </div>

            <h1 className="text-4xl lg:text-5xl font-heading font-semibold text-white mb-6 leading-tight tracking-tight">
              Create hyper-realistic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                vocal synthesis.
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Access the most advanced neural text-to-speech and voice cloning engine. Identify yourself to continue.
            </p>
          </div>

          <div className="flex gap-4 relative z-10">
            {/* Visual decoration at bottom */}
            <div className="h-2 w-12 rounded-full bg-primary" />
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-2 w-2 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Right side - Auth Component */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 items-center z-10 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md lg:w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
