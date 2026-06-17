"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("An unexpected error occurred:", error);
  }, [error]);

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="w-full px-6 lg:px-16 pt-8 pb-6 border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Resonance"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-base font-semibold text-foreground">Resonance</span>
          </Link>
          <span className="text-xs text-zinc-500">Something went wrong</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 lg:px-16 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            An unexpected error stopped things from working. Your work is safe,
            and you can try again using the options below.
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <Button
              onClick={reset}
              size="lg"
              className="rounded-md h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="rounded-md h-11 px-5 bg-transparent border-border hover:border-foreground hover:bg-accent text-foreground font-medium text-sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-10">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Error details
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-accent border border-border rounded-md overflow-hidden mb-6">
            <div className="bg-background p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Error ID
              </div>
              <div className="text-foreground font-mono text-sm break-all">
                {error.digest || "Not available"}
              </div>
            </div>
            <div className="bg-background p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Timestamp
              </div>
              <div className="text-foreground font-mono text-sm break-all">
                {timestamp}
              </div>
            </div>
            <div className="bg-background p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Page
              </div>
              <div className="text-foreground font-mono text-sm">Home page</div>
            </div>
          </div>

          <div className="bg-secondary border border-border rounded-md p-5 text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {error.message ||
              "An unknown error occurred. Please try again, and let us know if the problem continues."}
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-border mt-16 py-6 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-zinc-500">
            © 2026 Resonance Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
