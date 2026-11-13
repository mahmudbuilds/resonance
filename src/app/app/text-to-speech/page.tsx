"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import {
  Clock,
  Download,
  Gauge,
  History,
  Loader2,
  Mic2,
  MoreVertical,
  Pause,
  Play,
  Settings2,
  Sparkles,
  Thermometer,
  Trash2,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function TextToSpeechPage() {
  const trigger = useHaptics();
  const [selectedVoice, setSelectedVoice, mounted] = useLocalStorage<
    string | null
  >("selectedVoice", null);
  const [model, setModel] = useLocalStorage<string>("model", "inworld-tts-2");
  const voices = useQuery(api.voice.getUserVoices);

  useEffect(() => {
    if (!mounted) return;
    if (!selectedVoice && voices?.[0]?.inworldVoiceId) {
      setSelectedVoice(voices[0].inworldVoiceId);
    }
  }, [mounted, voices, selectedVoice, setSelectedVoice]);

  const [text, setText] = useState("");
  const [speakingRate, setSpeakingRate] = useState([1.0]);
  const [temperature, setTemperature] = useState([0.7]);
  const [playingId, setPlayingId] = useState<Id<"generations"> | null>(null);
  const [playingProgress, setPlayingProgress] = useState(0);
  const [downloadingId, setDownloadingId] = useState<Id<"generations"> | null>(
    null,
  );
  const [isSsml, setIsSsml] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playingId) {
      setPlayingProgress(0);
      return;
    }

    let rafId = 0;
    const syncProgress = () => {
      const audio = document.getElementById(
        `audio-${playingId}`,
      ) as HTMLAudioElement | null;
      if (
        audio &&
        !audio.paused &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        setPlayingProgress(audio.currentTime / audio.duration);
        rafId = requestAnimationFrame(syncProgress);
      }
    };
    rafId = requestAnimationFrame(syncProgress);
    return () => cancelAnimationFrame(rafId);
  }, [playingId]);

  const currentUser = useQuery(api.users.getCurrentUser);
  const userGenerations = useQuery(api.inworld.listUserGenerations);
  const generateSpeech = useAction(api.inworldGenerateSpeech.generateSpeech);
  const deleteGeneration = useMutation(api.inworld.deleteUserGeneration);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    if (!selectedVoice) {
      toast.error("Please choose a voice profile first");
      return;
    }

    if (currentUser && text.length > currentUser.credits) {
      toast.error(
        `Insufficient credits: this script needs ${text.length} characters, but your balance is ${currentUser.credits}.`,
      );
      return;
    }

    trigger("nudge");
    setIsGenerating(true);

    const promise = generateSpeech({
      text,
      voice: selectedVoice,
      model,
      speakingRate: speakingRate[0],
      temperature: temperature[0],
    });

    toast.promise(promise, {
      loading: "Generating speech...",
      success: "Speech generated successfully!",
      error: "Failed to generate speech",
    });

    try {
      await promise;
      trigger("success");
    } catch (e) {
      trigger("error");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const isReady = mounted && !!voices;

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8 animate-editorial-enter">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Text to Speech
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Write plain narration or structured SSML, tune cadence and
              temperature, and export studio audio.
            </p>
          </div>
          {currentUser && (
            <div className="studio-panel rounded-lg px-4 py-2.5 flex items-center gap-3 w-fit shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                Available Credits
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {currentUser.credits.toLocaleString()}
              </span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Configuration Rail */}
          <aside className="lg:col-span-4 studio-panel rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Settings2 className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Voice Configuration
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Voice Profile <span className="accent-ink">*</span>
                </Label>
                <Select
                  value={isReady ? (selectedVoice ?? "") : ""}
                  onValueChange={(value) => setSelectedVoice(value)}
                  disabled={!isReady}
                >
                  <SelectTrigger className="w-full bg-background border-input h-10 rounded-lg text-sm px-3">
                    <SelectValue
                      placeholder={
                        isReady
                          ? "Select a voice profile..."
                          : "Loading system voices..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg p-1">
                    {voices?.map((voice) => {
                      const isNew =
                        Date.now() - voice._creationTime <
                        7 * 24 * 60 * 60 * 1000;
                      return (
                        <SelectItem
                          key={voice.inworldVoiceId}
                          value={voice.inworldVoiceId!}
                          className="rounded-md cursor-pointer px-3 py-2"
                        >
                          <div className="flex items-center justify-between w-full gap-3">
                            <span className="truncate font-medium">
                              {voice.displayName}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isNew && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary/15 accent-ink border-none font-semibold uppercase rounded">
                                  New
                                </Badge>
                              )}
                              {voice.langCode && (
                                <span className="text-[11px] text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded">
                                  {voice.langCode}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Neural Model
                  </Label>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Adaptive
                  </span>
                </div>
                <Select
                  value={model}
                  onValueChange={(value) => setModel(value)}
                >
                  <SelectTrigger className="w-full bg-background border-input h-10 rounded-lg text-sm px-3">
                    <SelectValue placeholder="Select model..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg p-1">
                    <SelectItem value="inworld-tts-2">inworld-tts-2</SelectItem>
                    <SelectItem value="inworld-tts-1.5-mini">
                      inworld-tts-1.5-mini
                    </SelectItem>
                    <SelectItem value="inworld-tts-1.5-max">
                      inworld-tts-1.5-max
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="text-xs font-semibold text-foreground">
                  Vocal Parameters
                </div>

                <div className="space-y-2.5 bg-secondary/50 border border-border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Gauge className="size-3.5 text-muted-foreground" />
                      Speaking Rate
                    </div>
                    <span className="text-xs font-mono font-semibold accent-ink tabular-nums">
                      {speakingRate[0].toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    value={speakingRate}
                    onValueChange={setSpeakingRate}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    className="cursor-pointer py-1.5"
                  />
                </div>

                <div className="space-y-2.5 bg-secondary/50 border border-border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Thermometer className="size-3.5 text-muted-foreground" />
                      Temperature
                    </div>
                    <span className="text-xs font-mono font-semibold accent-ink tabular-nums">
                      {temperature[0].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={0}
                    max={1}
                    step={0.05}
                    className="cursor-pointer py-1.5"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Script Editor & History */}
          <div className="lg:col-span-8 space-y-6">
            <section className="studio-panel rounded-xl overflow-hidden flex flex-col min-h-[420px]">
              <div className="border-b border-border px-4 sm:px-5 py-3 flex items-center justify-between bg-secondary/40">
                <div className="flex items-center gap-2">
                  <Type className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Script Editor
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="ssml"
                      className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    >
                      SSML Mode
                    </Label>
                    <Switch
                      id="ssml"
                      checked={isSsml}
                      onCheckedChange={setIsSsml}
                    />
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setText("")}
                    className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-md"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex relative items-stretch">
                <div
                  ref={lineNumbersRef}
                  aria-hidden={!isSsml}
                  className={`flex flex-col items-end pt-5 pb-5 font-mono text-xs text-muted-foreground select-none bg-secondary/30 text-right overflow-hidden pointer-events-none transition-[width,opacity,padding] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSsml
                      ? "w-12 pl-3 pr-2.5 border-r border-border opacity-100"
                      : "w-0 px-0 border-r-0 opacity-0"
                  }`}
                >
                  {isSsml &&
                    Array.from(
                      { length: Math.max(1, text.split("\n").length) },
                      (_, index) => index + 1,
                    ).map((lineNumber) => (
                      <div
                        key={`line-${lineNumber}`}
                        style={{ height: "28px", lineHeight: "28px" }}
                        className="shrink-0 w-full text-right tabular-nums"
                      >
                        {lineNumber}
                      </div>
                    ))}
                </div>

                <Textarea
                  placeholder={
                    isSsml
                      ? "<speak>\n  Write your SSML structured markup tags here...\n</speak>"
                      : "Type or paste your script here to synthesize speech..."
                  }
                  wrap={isSsml ? "off" : "soft"}
                  onScroll={(e) => {
                    if (isSsml && lineNumbersRef.current) {
                      lineNumbersRef.current.scrollTop =
                        e.currentTarget.scrollTop;
                    }
                  }}
                  style={isSsml ? { lineHeight: "28px" } : undefined}
                  className={`w-full h-full min-h-[300px] resize-none border-none shadow-none focus-visible:ring-0 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground overflow-y-auto ${
                    isSsml
                      ? "py-5 px-4 font-mono text-sm accent-ink overflow-x-auto"
                      : "p-5 font-sans text-base leading-relaxed overflow-x-hidden"
                  }`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleGenerateSpeech();
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const start = e.currentTarget.selectionStart;
                      const end = e.currentTarget.selectionEnd;
                      const newValue =
                        text.substring(0, start) + "    " + text.substring(end);
                      setText(newValue);
                      requestAnimationFrame(() => {
                        e.currentTarget.selectionStart = start + 4;
                        e.currentTarget.selectionEnd = start + 4;
                      });
                    }
                  }}
                  maxLength={5000}
                  spellCheck={!isSsml}
                />
              </div>

              <div className="border-t border-border px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/40">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto">
                  <span>
                    <span
                      className={
                        text.length > 4500
                          ? "text-destructive font-semibold font-mono tabular-nums"
                          : "text-foreground font-mono tabular-nums"
                      }
                    >
                      {text.length.toLocaleString()}
                    </span>
                    {" / 5,000 chars"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    Est.{" "}
                    <span className="font-mono text-foreground tabular-nums">
                      {Math.ceil(text.length / 18)}s
                    </span>
                  </span>

                  {isGenerating && (
                    <span className="flex items-center gap-1.5 text-foreground font-medium animate-panel-swap">
                      <span className="size-1.5 rounded-full bg-primary animate-tally-pulse" />
                      Rendering audio
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleGenerateSpeech}
                  disabled={isGenerating || !text.trim() || !selectedVoice}
                  className="rounded-full h-10 w-full sm:w-auto px-6 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-medium text-sm transition-[background-color,transform] duration-150 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 mr-2" />
                  )}
                  {isGenerating ? "Synthesizing..." : "Generate Speech"}
                </Button>
              </div>
            </section>

            {/* Recent Generations */}
            <section className="studio-panel rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-secondary/40 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <History className="size-4 text-muted-foreground" />
                  Generation History
                </h3>
                {userGenerations && userGenerations.length > 0 && (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {userGenerations.length}
                  </span>
                )}
              </div>

              {!userGenerations || userGenerations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                  <div className="size-11 bg-secondary rounded-xl border border-border flex items-center justify-center mb-3">
                    <Mic2 className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No audio generations yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                    Synthesize text above to start building your track history.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                  {[...userGenerations].reverse().map((generation) => {
                    const date = new Date(generation._creationTime);
                    const isToday =
                      new Date().toDateString() === date.toDateString();
                    const timeString = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const dateString = isToday
                      ? `Today, ${timeString}`
                      : `${date.toLocaleDateString()} at ${timeString}`;

                    const voice = voices?.find(
                      (v) => v.inworldVoiceId === generation.inworldVoiceId,
                    );
                    const voiceName =
                      voice?.displayName ||
                      generation.inworldVoiceId ||
                      "System Voice";
                    const isActive = playingId === generation._id;

                    return (
                      <div
                        key={generation._id}
                        className={`relative p-4 flex items-center justify-between transition-colors duration-150 gap-4 group ${
                          isActive
                            ? "bg-secondary/50"
                            : "hover:bg-secondary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={isActive ? "Pause audio" : "Play audio"}
                            className={`size-9 shrink-0 rounded-full transition-[background-color,color,border-color,transform] duration-150 active:scale-95 ${
                              isActive
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                : "bg-secondary text-foreground border-border hover:bg-accent"
                            }`}
                            onClick={() => {
                              const audio = document.getElementById(
                                `audio-${generation._id}`,
                              ) as HTMLAudioElement | null;
                              if (audio) {
                                if (audio.paused) {
                                  document
                                    .querySelectorAll("audio")
                                    .forEach((a) => {
                                      if (a.id !== `audio-${generation._id}`) {
                                        a.pause();
                                      }
                                    });
                                  void audio.play();
                                  trigger("success");
                                } else {
                                  audio.pause();
                                }
                              }
                            }}
                          >
                            {isActive ? (
                              <Pause className="size-3.5 fill-current" />
                            ) : (
                              <Play className="size-3.5 fill-current ml-0.5" />
                            )}
                          </Button>

                          <audio
                            id={`audio-${generation._id}`}
                            src={generation.audioUrl}
                            preload="none"
                            className="hidden"
                            onPlay={() => setPlayingId(generation._id)}
                            onPause={() =>
                              setPlayingId((current) =>
                                current === generation._id ? null : current,
                              )
                            }
                            onEnded={() =>
                              setPlayingId((current) =>
                                current === generation._id ? null : current,
                              )
                            }
                          >
                            <track kind="captions" />
                          </audio>

                          <div className="flex flex-col min-w-0 flex-1 gap-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {generation.prompt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge
                                variant="secondary"
                                className="text-[10px] font-medium px-2 py-0 rounded-full"
                              >
                                {voiceName}
                              </Badge>
                              {isActive && (
                                <span
                                  aria-hidden="true"
                                  className="inline-flex items-end gap-[2px] h-3"
                                >
                                  <span
                                    className="w-[2px] h-2.5 bg-primary rounded-full animate-eq-bar"
                                    style={{ animationDelay: "0ms" }}
                                  />
                                  <span
                                    className="w-[2px] h-3 bg-primary rounded-full animate-eq-bar"
                                    style={{ animationDelay: "140ms" }}
                                  />
                                  <span
                                    className="w-[2px] h-2 bg-primary rounded-full animate-eq-bar"
                                    style={{ animationDelay: "280ms" }}
                                  />
                                </span>
                              )}
                              <span className="text-[11px] font-mono tabular-nums">
                                {dateString}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isActive && (
                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-[2px] bg-border overflow-hidden pointer-events-none"
                          >
                            <div
                              className="h-full bg-primary origin-left transition-transform duration-75 ease-linear"
                              style={{
                                transform: `scaleX(${Math.max(0.02, playingProgress)})`,
                              }}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Download audio"
                            className="size-8 rounded-lg bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                            disabled={
                              downloadingId === generation._id ||
                              !generation.audioUrl
                            }
                            onClick={async () => {
                              if (!generation.audioUrl) return;
                              try {
                                setDownloadingId(generation._id);
                                const response = await fetch(
                                  generation.audioUrl,
                                );
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.style.display = "none";
                                a.href = url;
                                a.download = `voice-${generation._id}.mp3`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                trigger("success");
                              } catch (error) {
                                console.error("Download failed:", error);
                              } finally {
                                setDownloadingId(null);
                              }
                            }}
                          >
                            {downloadingId === generation._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Download className="size-3.5" />
                            )}
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="More options"
                                className="size-8 rounded-lg bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-36 rounded-lg p-1"
                            >
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer rounded-md text-xs font-medium px-3 py-2"
                                onClick={async () => {
                                  trigger("error");
                                  try {
                                    await deleteGeneration({
                                      generationId: generation._id,
                                    });
                                    toast.success("Generation deleted");
                                  } catch {
                                    toast.error("Failed to delete generation");
                                  }
                                }}
                              >
                                <Trash2 className="size-3.5 mr-2" />
                                Delete Audio
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
