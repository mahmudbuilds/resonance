"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AuditionPreset {
  id: string;
  name: string;
  register: string;
  locale: string;
  sampleLine: string;
  baseFreq: number;
  formantFreq: number;
  bars: { id: string; height: number }[];
}

const toBars = (values: number[]) =>
  values.map((height, idx) => ({ id: `b-${idx}`, height }));

const PRESETS: AuditionPreset[] = [
  {
    id: "nadia",
    name: "Nadia",
    register: "Documentary",
    locale: "EN-US",
    sampleLine: "Light enters the room before the first word is spoken.",
    baseFreq: 196,
    formantFreq: 520,
    bars: toBars([
      0.3, 0.55, 0.82, 0.64, 0.9, 0.72, 0.45, 0.78, 0.95, 0.68, 0.5, 0.84, 0.6,
      0.42, 0.75, 0.88, 0.54, 0.36, 0.62, 0.48,
    ]),
  },
  {
    id: "tomas",
    name: "Tomas",
    register: "Warm Narration",
    locale: "ES-ES",
    sampleLine: "Pacing and breath give technical writing a human pulse.",
    baseFreq: 138,
    formantFreq: 410,
    bars: toBars([
      0.4, 0.7, 0.52, 0.88, 0.92, 0.58, 0.44, 0.82, 0.74, 0.94, 0.62, 0.48, 0.8,
      0.68, 0.52, 0.76, 0.64, 0.46, 0.58, 0.34,
    ]),
  },
  {
    id: "hana",
    name: "Hana",
    register: "Studio Guide",
    locale: "JA-JP",
    sampleLine: "Clean studio articulation tuned for concise tutorials.",
    baseFreq: 224,
    formantFreq: 610,
    bars: toBars([
      0.28, 0.62, 0.76, 0.92, 0.55, 0.68, 0.86, 0.48, 0.72, 0.88, 0.64, 0.4,
      0.78, 0.9, 0.58, 0.46, 0.7, 0.52, 0.66, 0.38,
    ]),
  },
];

export function HeroAudioAudition() {
  const [activeId, setActiveId] = useState<string>(PRESETS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);

  const activePreset = PRESETS.find((p) => p.id === activeId) ?? PRESETS[0];

  const stopPlayback = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    for (const node of activeNodesRef.current) {
      try {
        node.disconnect();
      } catch {
        // Ignore already disconnected nodes.
      }
    }
    activeNodesRef.current = [];
    setIsPlaying(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [stopPlayback]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextCtor();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const durationSec = 3.2;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(activePreset.baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(
        activePreset.baseFreq * 1.06,
        now + 1.1,
      );
      osc.frequency.exponentialRampToValueAtTime(
        activePreset.baseFreq * 0.96,
        now + durationSec,
      );

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(activePreset.baseFreq * 2, now);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(activePreset.formantFreq, now);
      filter.Q.setValueAtTime(2.4, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.14);
      gain.gain.setValueAtTime(0.08, now + durationSec - 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + durationSec);
      subOsc.stop(now + durationSec);

      activeNodesRef.current = [osc, subOsc, filter, gain];
      setIsPlaying(true);

      const startMs = performance.now();
      const totalMs = durationSec * 1000;

      const tick = (t: number) => {
        const pct = Math.min(1, (t - startMs) / totalMs);
        setProgress(pct);
        if (pct < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      timerRef.current = window.setTimeout(() => {
        stopPlayback();
      }, totalMs);
    } catch {
      // Fallback visual preview if browser blocks audio context
      setIsPlaying(true);
      const startMs = performance.now();
      const totalMs = 3200;
      const tick = (t: number) => {
        const pct = Math.min(1, (t - startMs) / totalMs);
        setProgress(pct);
        if (pct < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
      timerRef.current = window.setTimeout(() => {
        stopPlayback();
      }, totalMs);
    }
  };

  const handleSelectPreset = (id: string) => {
    if (isPlaying) {
      stopPlayback();
    }
    setActiveId(id);
  };

  return (
    <div className="studio-panel rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {PRESETS.map((preset) => {
            const selected = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer",
                  selected
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full transition-colors duration-200",
              isPlaying ? "bg-primary animate-tally-pulse" : "bg-border",
            )}
          />
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {activePreset.locale} / 48kHz
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={
            isPlaying
              ? `Pause ${activePreset.name} preview`
              : `Play ${activePreset.name} preview`
          }
          className="size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center shrink-0 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="size-4 fill-current animate-panel-swap" />
          ) : (
            <Play className="size-4 fill-current ml-0.5 animate-panel-swap" />
          )}
        </button>

        <div className="flex-1 flex items-center gap-1 h-9" aria-hidden="true">
          {activePreset.bars.map((bar, idx) => {
            const barProgress = idx / activePreset.bars.length;
            const active = isPlaying && barProgress <= progress;
            const isLeadBar =
              isPlaying &&
              Math.abs(barProgress - progress) < 1.5 / activePreset.bars.length;
            const waveScale = isPlaying
              ? 1 + Math.sin(progress * Math.PI * 10 + idx * 0.85) * 0.14
              : 1;

            return (
              <div
                key={bar.id}
                className={cn(
                  "flex-1 rounded-full transition-[height,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active
                    ? "bg-primary"
                    : isLeadBar
                      ? "bg-primary/60"
                      : "bg-border dark:bg-white/15",
                )}
                style={{
                  height: `${Math.round(bar.height * 100)}%`,
                  transform: `scaleY(${waveScale.toFixed(3)})`,
                  transitionDelay: isPlaying ? "0ms" : `${idx * 10}ms`,
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          <Volume2
            className={cn(
              "size-3.5 transition-colors duration-200",
              isPlaying && "accent-ink",
            )}
          />
          <span className="font-mono text-[11px] tabular-nums">
            {isPlaying ? `${(progress * 3.2).toFixed(1)}s` : "03.2s"}
          </span>
        </div>
      </div>

      <div
        key={activePreset.id}
        className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 animate-panel-swap"
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          &ldquo;{activePreset.sampleLine}&rdquo;
        </p>
        <span className="text-[11px] font-medium text-foreground shrink-0">
          {activePreset.register}
        </span>
      </div>
    </div>
  );
}
