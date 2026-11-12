"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { register } from "./registry";

interface WaveformPlayerProps {
  url: string;
  className?: string;
}

const BAR_COUNT = 32;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function buildBars(seed: string): { id: string; height: number }[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const bars: { id: string; height: number }[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    hash ^= i * 2654435761;
    hash = Math.imul(hash, 1597334677);
    const normalized = ((hash >>> 0) % 72) / 100 + 0.24;
    bars.push({ id: `bar-${i}`, height: normalized });
  }
  return bars;
}

export function WaveformPlayer({ url, className }: WaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const bars = useMemo(() => buildBars(url), [url]);

  const stopRegistration = useCallback(() => {
    if (unregisterRef.current) {
      unregisterRef.current();
      unregisterRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRegistration();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopRegistration]);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(url);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });
    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audioRef.current = audio;
    return audio;
  }, [url]);

  useEffect(() => {
    if (!isPlaying) {
      stopRegistration();
      return;
    }
    unregisterRef.current = register(() => {
      audioRef.current?.pause();
    });
    return stopRegistration;
  }, [isPlaying, stopRegistration]);

  const handleTogglePlay = useCallback(() => {
    const audio = ensureAudio();
    if (audio.paused) {
      void audio.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
    } else {
      audio.pause();
    }
  }, [ensureAudio]);

  const seekToRatio = useCallback(
    (ratio: number) => {
      const clamped = Math.max(0, Math.min(1, ratio));
      const audio = ensureAudio();
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = clamped * audio.duration;
        setCurrentTime(audio.currentTime);
      } else {
        void audio.play().catch(() => {});
      }
    },
    [ensureAudio],
  );

  const handleSliderClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width <= 0) return;
      seekToRatio((event.clientX - rect.left) / rect.width);
    },
    [seekToRatio],
  );

  const handleSliderKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const total =
        audio && Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentRatio = total > 0 ? currentTime / total : 0;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        seekToRatio(currentRatio + 0.05);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        seekToRatio(currentRatio - 0.05);
      } else if (event.key === "Home") {
        event.preventDefault();
        seekToRatio(0);
      } else if (event.key === "End") {
        event.preventDefault();
        seekToRatio(1);
      }
    },
    [currentTime, seekToRatio],
  );

  const progress = duration > 0 ? currentTime / duration : 0;
  const timeLabel =
    duration > 0
      ? `${formatTime(currentTime)} / ${formatTime(duration)}`
      : isPlaying
        ? `${formatTime(currentTime)}`
        : "0:00";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-[240px] max-w-[320px]",
        className,
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        className="size-8 rounded-full bg-primary/10 accent-ink hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 border border-primary/20"
      >
        {isPlaying ? (
          <Pause className="size-3.5 fill-current" />
        ) : (
          <Play className="size-3.5 ml-0.5 fill-current" />
        )}
      </Button>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Audio playback position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        onClick={handleSliderClick}
        onKeyDown={handleSliderKeyDown}
        className="flex-1 flex items-center gap-[2px] h-7 min-w-0 cursor-pointer group rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
      >
        {bars.map((bar, i) => {
          const filled = i / BAR_COUNT < progress;
          return (
            <span
              key={bar.id}
              aria-hidden="true"
              className={cn(
                "flex-1 rounded-full transition-colors",
                filled
                  ? "bg-primary"
                  : "bg-foreground/20 group-hover:bg-foreground/35",
              )}
              style={{ height: `${Math.round(bar.height * 100)}%` }}
            />
          );
        })}
      </div>

      <span className="font-mono text-[11px] tabular-nums text-muted-foreground min-w-[54px] text-right shrink-0">
        {timeLabel}
      </span>
    </div>
  );
}
