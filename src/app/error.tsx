"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
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
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Resonance"
            width={32}
            height={32}
            className="size-8 object-contain dark:invert-0 invert"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Resonance
          </span>
        </Link>
        <span className="text-xs font-mono text-muted-foreground">
          Status: Error
        </span>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-16 space-y-12">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            An unexpected error interrupted this page. Your saved voices and
            audio files are intact.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              onClick={reset}
              className="rounded-full h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
            >
              <RefreshCw className="size-4 mr-2" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full h-10 px-6 border-border bg-card hover:bg-accent text-foreground font-medium text-sm"
            >
              <Link href="/">
                <Home className="size-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <AlertTriangle className="size-4" />
            <span>Error Details</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
            <div className="bg-card p-4">
              <div className="text-[11px] font-mono text-muted-foreground mb-1">
                Error ID
              </div>
              <div className="text-foreground font-mono text-xs break-all">
                {error.digest || "Unavailable"}
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[11px] font-mono text-muted-foreground mb-1">
                Timestamp
              </div>
              <div className="text-foreground font-mono text-xs break-all">
                {timestamp}
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[11px] font-mono text-muted-foreground mb-1">
                Surface
              </div>
              <div className="text-foreground font-mono text-xs">Public</div>
            </div>
          </div>

          <div className="bg-secondary/50 border border-border rounded-xl p-4 text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {error.message ||
              "An unknown error occurred. Please try again, and reach out to support if it persists."}
          </div>
        </div>
      </main>
    </div>
  );
}
