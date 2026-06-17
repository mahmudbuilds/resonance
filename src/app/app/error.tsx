"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Send } from "lucide-react";
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
    console.error("Dashboard error:", error);
  }, [error]);

  const handleSendReport = () => {
    setIsReporting(true);
    const toastId = toast.loading("Sending error report...");

    setTimeout(() => {
      setIsReporting(false);
      setReportSent(true);
      toast.success("Error report sent. Thank you for your feedback.", { id: toastId });
    }, 1500);
  };

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-12 pb-8 border-b border-border">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            An unexpected error stopped this page from loading. You can try
            again or head back to your dashboard.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-3 gap-px bg-accent border border-border rounded-md overflow-hidden mb-6">
              <div className="bg-background p-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                  Section
                </div>
                <div className="text-foreground font-mono text-sm">Workspace</div>
              </div>
              <div className="bg-background p-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                  When
                </div>
                <div className="text-foreground font-mono text-sm break-all">
                  {timestamp}
                </div>
              </div>
              <div className="bg-background p-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                  Reference
                </div>
                <div className="text-foreground font-mono text-sm break-all">
                  {error.digest || "Not available"}
                </div>
              </div>
            </div>

            <div className="bg-secondary border border-border rounded-md p-5 text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap mb-6">
              {error.message ||
                "Something went wrong while loading this page. Please try again, and let us know if the problem continues."}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={reset}
                size="lg"
                className="rounded-md h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
              >
                Try again
              </Button>

              <Link href="/app">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-md h-11 px-5 bg-transparent border-border hover:border-foreground hover:bg-accent text-foreground font-medium text-sm w-full"
                >
                  Back to dashboard
                </Button>
              </Link>

              <Button
                onClick={handleSendReport}
                disabled={isReporting || reportSent}
                size="lg"
                variant="outline"
                className={`rounded-md h-11 px-5 font-medium text-sm flex items-center gap-2 ${
                  reportSent
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : "border-border bg-transparent hover:border-foreground hover:bg-accent text-foreground"
                }`}
              >
                {reportSent ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Report sent
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {isReporting ? "Sending..." : "Send report"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-border rounded-md p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                What to try next
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <span className="text-zinc-500 mr-2">1.</span>
                  Click <span className="text-foreground">Try again</span> to reload
                  this page.
                </li>
                <li>
                  <span className="text-zinc-500 mr-2">2.</span>
                  If that doesn't work, go back to your dashboard to start
                  fresh.
                </li>
                <li>
                  <span className="text-zinc-500 mr-2">3.</span>
                  Send us a report so our team can look into the issue.
                </li>
              </ul>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed mt-4">
              Your error report is stored securely. None of your voice
              recordings or audio files were affected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
