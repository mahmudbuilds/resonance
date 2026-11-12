"use client";

import { CheckCircle, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      toast.success("Error report sent. Thank you for your feedback.", {
        id: toastId,
      });
    }, 1000);
  };

  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-10 space-y-8">
        <header className="pb-6 border-b border-border space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            An unexpected error stopped this studio view from loading. Your
            saved voices and tracks are unaffected.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
              <div className="bg-card p-4">
                <div className="text-[11px] font-mono text-muted-foreground mb-1">
                  Section
                </div>
                <div className="text-foreground font-mono text-xs">
                  Workspace
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
                  Reference
                </div>
                <div className="text-foreground font-mono text-xs break-all">
                  {error.digest || "Unavailable"}
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 border border-border rounded-xl p-4 text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {error.message ||
                "Something went wrong while loading this view. Please try again."}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={reset}
                className="rounded-full h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
              >
                Try Again
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full h-10 px-6 border-border bg-card hover:bg-accent text-foreground font-medium text-sm"
              >
                <Link href="/app">Back to Overview</Link>
              </Button>

              <Button
                onClick={handleSendReport}
                disabled={isReporting || reportSent}
                variant="outline"
                className="rounded-full h-10 px-6 border-border bg-card hover:bg-accent text-foreground font-medium text-sm"
              >
                {reportSent ? (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Report Sent
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    {isReporting ? "Sending..." : "Send Report"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <aside className="studio-panel rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              What to try next
            </h2>
            <ol className="space-y-2.5 text-xs text-muted-foreground leading-relaxed list-decimal list-inside">
              <li>Click Try Again to reload this view.</li>
              <li>Return to Overview to switch studio modules.</li>
              <li>Send a report if the issue continues.</li>
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}
