"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import {
  AudioLines,
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
  Volume2,
  Wand2,
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
  const [model, setModel, modelMounted] = useLocalStorage<string>(
    "model",
    "inworld-tts-2",
  );
  const voices = useQuery(api.voice.getUserVoices);

  useEffect(() => {
    if (!mounted) return;
    const fetchVoices = async () => {
      if (!selectedVoice && voices?.[0]?.inworldVoiceId) {
        setSelectedVoice(voices?.[0]?.inworldVoiceId);
      }
    };
    fetchVoices();
  }, [mounted, voices, selectedVoice, setSelectedVoice]);

  const [text, setText] = useState("");
  const [speakingRate, setSpeakingRate] = useState([1.0]);
  const [temperature, setTemperature] = useState([0.7]);
  const [playingId, setPlayingId] = useState<Id<"generations"> | null>(null);
  const [downloadingId, setDownloadingId] = useState<Id<"generations"> | null>(
    null,
  );
  const [isSsml, setIsSsml] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const userGenerations = useQuery(api.inworld.listUserGenerations);
  const generateSpeech = useAction(api.inworldGenerateSpeech.generateSpeech);
  const deleteGeneration = useMutation(api.inworld.deleteUserGeneration);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    trigger("nudge");
    setIsGenerating(true);

    const promise = generateSpeech({
      text,
      voice: selectedVoice!,
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
    <div className="min-h-screen relative w-full overflow-hidden text-foreground font-sans pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 animate-fade-up">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2 text-xs font-medium text-primary">
              <AudioLines className="w-3.5 h-3.5" />
              Speech Synthesis
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight text-white">
              Text to Speech
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Convert your written text into high-quality, natural-sounding audio
            script. Refine vocal vectors and tuning rules with advanced neural
            models.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6 w-full stagger-1">
            <div className="glass-panel rounded-3xl p-6 shadow-xl shadow-black/20 border border-white/5">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Voice Configuration
                </h2>
              </div>

              <div className="space-y-6">
                {/* Voice Identity Input Group */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Voice Profile <span className="text-primary">*</span>
                  </Label>
                  <Select
                    value={isReady ? (selectedVoice ?? "") : ""}
                    onValueChange={(value) => setSelectedVoice(value)}
                    disabled={!isReady}
                  >
                    <SelectTrigger className="w-full glass-card border-white/10 h-11 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-white text-sm px-3.5 transition-all">
                      <SelectValue
                        placeholder={
                          isReady
                            ? "Select a voice profile..."
                            : "Loading system voices..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-white p-1">
                      {voices?.map((voice) => {
                        const isNew =
                          Date.now() - voice._creationTime <
                          7 * 24 * 60 * 60 * 1000;
                        return (
                          <SelectItem
                            key={voice.inworldVoiceId}
                            value={voice.inworldVoiceId!}
                            className="rounded-lg cursor-pointer w-full focus:bg-white/5 focus:text-white px-3 py-2.5 transition-colors"
                          >
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="truncate font-medium">
                                {voice.displayName}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isNew && (
                                  <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-none font-semibold uppercase rounded">
                                    New
                                  </Badge>
                                )}
                                {voice.langCode && (
                                  <span className="text-xs text-muted-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
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

                {/* Neural Model Input Group */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Neural Model
                    </Label>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-primary bg-primary/10 border-primary/20 px-2 py-0 rounded-full"
                    >
                      v2.0 Adaptive
                    </Badge>
                  </div>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value)}
                  >
                    <SelectTrigger className="w-full glass-card border-white/10 h-11 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-white text-sm px-3.5 transition-all">
                      <SelectValue placeholder="Select model..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-white p-1">
                      <SelectItem
                        value="inworld-tts-2"
                        className="rounded-lg cursor-pointer focus:bg-white/5 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-2
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-mini"
                        className="rounded-lg cursor-pointer focus:bg-white/5 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-1.5-mini
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-max"
                        className="rounded-lg cursor-pointer focus:bg-white/5 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-1.5-max
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuning sliders */}
                <div className="space-y-5 pt-5 border-t border-white/5">
                  <Label className="text-xs font-semibold text-muted-foreground tracking-wide block">
                    Vocal Parameters
                  </Label>

                  <div className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                        <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                        Speaking Rate
                      </div>
                      <span className="text-xs font-mono font-semibold text-primary">
                        {speakingRate[0].toFixed(1)}x
                      </span>
                    </div>
                    <Slider
                      value={speakingRate}
                      onValueChange={setSpeakingRate}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      className="cursor-pointer py-2"
                    />
                  </div>

                  <div className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                        <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
                        Temperature
                      </div>
                      <span className="text-xs font-mono font-semibold text-primary">
                        {temperature[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      min={0}
                      max={1}
                      step={0.05}
                      className="cursor-pointer py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Input area & Generations */}
          <div className="lg:col-span-8 flex flex-col space-y-6 w-full stagger-2">
            <div className="flex flex-col border border-white/5 glass-panel min-h-[420px] sm:min-h-[480px] w-full rounded-[2rem] focus-within:border-white/10 shadow-xl shadow-black/20 transition-all overflow-hidden relative">
              <div className="border-b border-white/5 p-4 flex flex-row items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-white">
                    Script Editor
                  </span>
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
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <Button
                    variant="ghost"
                    onClick={() => setText("")}
                    className="text-xs font-medium text-muted-foreground hover:text-white h-8 px-2.5 rounded-lg hover:bg-white/5"
                  >
                    Clear text
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative flex flex-col w-full transition-colors duration-300">
                <div className="flex-1 flex w-full h-full relative items-stretch">
                  {isSsml && (
                    <div
                      ref={lineNumbersRef}
                      className="flex flex-col items-end pt-5 pb-5 pl-3 pr-2 border-r border-white/5 w-12 sm:w-14 font-mono text-sm text-muted-foreground select-none bg-white/[0.01] text-right overflow-hidden h-full pointer-events-none"
                    >
                      {Array.from({
                        length: Math.max(1, text.split("\n").length),
                      }).map((_, i) => (
                        <div
                          key={i}
                          style={{ height: "28px", lineHeight: "28px" }}
                          className="flex-shrink-0 w-full text-right"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                  <Textarea
                    placeholder={
                      isSsml
                        ? "<speak>\n  Write your SSML structured markup tags here...\n</speak>"
                        : "Type or paste your text content here to synthesize speech..."
                    }
                    wrap={isSsml ? "off" : "soft"}
                    onScroll={(e) => {
                      if (isSsml && lineNumbersRef.current) {
                        lineNumbersRef.current.scrollTop =
                          e.currentTarget.scrollTop;
                      }
                    }}
                    style={isSsml ? { lineHeight: "28px" } : undefined}
                    className={`w-full h-full min-h-[300px] resize-none border-none shadow-none focus-visible:ring-0 rounded-none focus:outline-none focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-muted-foreground overflow-y-auto ${
                      isSsml
                        ? "pt-5 pb-5 px-4 font-mono text-sm text-primary selection:bg-primary/20 overflow-x-auto"
                        : "p-5 font-sans text-base sm:text-lg selection:bg-white/10 overflow-x-hidden"
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
                          text.substring(0, start) +
                          "    " +
                          text.substring(end);
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
              </div>

              <div className="border-t border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02]">
                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-medium text-muted-foreground">
                    <span
                      className={
                        text.length > 4500
                          ? "text-rose-400 font-semibold"
                          : "text-white font-mono"
                      }
                    >
                      {text.length.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground"> / </span>5,000
                    chars
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Est. Duration:{" "}
                    <span className="font-mono text-white">
                      {Math.ceil(text.length / 18)}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating || !text.trim()}
                    className="shadow-lg shadow-primary/20 rounded-full h-11 w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 hover:scale-105 text-white font-medium text-sm transition-all border-none disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? "Synthesizing..." : "Generate Speech"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Generations List / Audio Log */}
            <div className="border border-white/5 glass-panel rounded-3xl shadow-xl shadow-black/20 overflow-hidden w-full stagger-3">
              <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Generation
                  History
                </h3>
              </div>

              <div className="p-0">
                {!userGenerations || userGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                      <Mic2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      No audio generations yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Synthesize text above to begin building your audio
                      catalog.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
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

                      return (
                        <div
                          key={generation._id}
                          className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-4 group"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-10 w-10 shrink-0 rounded-xl transition-all border-none shadow-sm ${
                                playingId === generation._id
                                  ? "bg-primary text-white hover:bg-primary/90"
                                  : "bg-white/5 text-white hover:bg-white/10"
                              }`}
                              onClick={() => {
                                const audio = document.getElementById(
                                  `audio-${generation._id}`,
                                ) as HTMLAudioElement;
                                if (audio) {
                                  if (audio.paused) {
                                    document
                                      .querySelectorAll("audio")
                                      .forEach((a) => {
                                        if (a.id !== `audio-${generation._id}`)
                                          a.pause();
                                      });
                                    audio.play();
                                    trigger("success");
                                  } else {
                                    audio.pause();
                                  }
                                }
                              }}
                            >
                              {playingId === generation._id ? (
                                <Pause className="w-4 h-4 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              )}
                            </Button>
                            <audio
                              id={`audio-${generation._id}`}
                              src={generation.audioUrl}
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
                            />
                            <div className="flex flex-col min-w-0 flex-1 gap-1">
                              <p className="text-sm font-medium text-white truncate pr-2">
                                {generation.prompt}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge className="text-[10px] font-medium bg-white/5 text-muted-foreground hover:bg-white/10 border-none px-2 py-0 rounded-full">
                                  {voiceName}
                                </Badge>
                                <span className="text-muted-foreground/30">
                                  •
                                </span>
                                <span className="text-muted-foreground text-[11px]">
                                  {dateString}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-lg bg-white/5 border-none hover:bg-white/10 text-muted-foreground hover:text-white shadow-sm"
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
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 rounded-lg bg-white/5 border-none hover:bg-white/10 text-muted-foreground hover:text-white shadow-sm"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-36 rounded-xl p-1 shadow-lg shadow-black/20"
                              >
                                <DropdownMenuItem
                                  className="text-rose-400 hover:text-rose-300 focus:bg-rose-400/10 focus:text-rose-400 cursor-pointer rounded-lg text-xs font-medium px-3 py-2"
                                  onClick={async () => {
                                    trigger("error");
                                    try {
                                      await deleteGeneration({
                                        generationId: generation._id,
                                      });
                                      toast.success(
                                        "Generation removed from log",
                                      );
                                    } catch (error) {
                                      toast.error(
                                        "Failed to delete generation",
                                      );
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                  Audio
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
