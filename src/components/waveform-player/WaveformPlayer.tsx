"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { register } from "./registry";

interface WaveformPlayerProps {
  url: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function WaveformPlayer({ url, className }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ws: WaveSurfer | null = null;
    let isDestroyed = false;

    try {
      ws = WaveSurfer.create({
        container,
        waveColor: "rgba(255, 255, 255, 0.25)",
        progressColor: "rgba(99, 102, 241, 1)",
        cursorColor: "transparent",
        cursorWidth: 0,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 28,
        normalize: true,
        interact: true,
      });
    } catch (err) {
      console.error("WaveSurfer init error:", err);
      return;
    }

    if (isDestroyed) {
      ws.destroy();
      return;
    }

    wsRef.current = ws;

    const subs: Array<() => void> = [];

    subs.push(
      ws.on("ready", (dur: number) => {
        if (isDestroyed) return;
        setIsReady(true);
        setDuration(dur);
      }),
    );
    subs.push(
      ws.on("play", () => {
        if (isDestroyed) return;
        setIsPlaying(true);
      }),
    );
    subs.push(
      ws.on("pause", () => {
        if (isDestroyed) return;
        setIsPlaying(false);
      }),
    );
    subs.push(
      ws.on("finish", () => {
        if (isDestroyed) return;
        setIsPlaying(false);
      }),
    );
    subs.push(
      ws.on("timeupdate", (time: number) => {
        if (isDestroyed) return;
        setCurrentTime(time);
      }),
    );

    ws.load(url).catch((err) => {
      if (isDestroyed) return;
      console.error("WaveSurfer load error:", err);
    });

    return () => {
      isDestroyed = true;
      for (const off of subs) {
        try {
          off();
        } catch {
          // Ignore listener teardown errors.
        }
      }
      if (unregisterRef.current) {
        unregisterRef.current();
        unregisterRef.current = null;
      }
      if (ws) {
        try {
          ws.destroy();
        } catch {
          // Ignore destroy errors during teardown.
        }
      }
      wsRef.current = null;
    };
  }, [url]);

  const handlePlayPause = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || !isReady) return;
    ws.playPause();
  }, [isReady]);

  useEffect(() => {
    if (!isPlaying) return;
    const pauser = () => {
      const ws = wsRef.current;
      if (!ws) return;
      try {
        ws.pause();
      } catch {
        // Ignore: instance may have been destroyed.
      }
    };
    unregisterRef.current = register(pauser);
    return () => {
      if (unregisterRef.current) {
        unregisterRef.current();
        unregisterRef.current = null;
      }
    };
  }, [isPlaying]);

  const timeLabel = isReady
    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
    : "—:— / —:—";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-[260px] max-w-[320px]",
        className,
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePlayPause}
        disabled={!isReady}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="size-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 border border-primary/20"
      >
        {!isReady ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="size-3.5" fill="currentColor" />
        ) : (
          <Play className="size-3.5 ml-0.5" fill="currentColor" />
        )}
      </Button>

      <div
        ref={containerRef}
        className="flex-1 h-7 min-w-0 cursor-pointer"
      />

      <span className="font-mono text-[10px] tabular-nums text-muted-foreground min-w-[64px] text-right shrink-0">
        {timeLabel}
      </span>
    </div>
  );
}
