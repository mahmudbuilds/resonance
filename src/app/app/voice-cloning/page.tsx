"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Lightbulb,
  Loader2,
  Mic,
  Pause,
  Play,
  Sparkles,
  Square,
  Trash2,
  UploadCloud,
  User,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import { useHaptics } from "@/components/haptics/HapticsProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

const LANG_CODES = [
  "EN_US",
  "ZH_CN",
  "KO_KR",
  "JA_JP",
  "RU_RU",
  "AUTO",
  "IT_IT",
  "ES_ES",
  "PT_BR",
  "DE_DE",
  "FR_FR",
  "AR_SA",
  "PL_PL",
  "NL_NL",
  "HI_IN",
  "HE_IL",
];

const LANG_LABELS: Record<string, string> = {
  EN_US: "English (US)",
  ZH_CN: "Chinese (Simplified)",
  KO_KR: "Korean",
  JA_JP: "Japanese",
  RU_RU: "Russian",
  AUTO: "Auto-detect",
  IT_IT: "Italian",
  ES_ES: "Spanish",
  PT_BR: "Portuguese (Brazil)",
  DE_DE: "German",
  FR_FR: "French",
  AR_SA: "Arabic",
  PL_PL: "Polish",
  NL_NL: "Dutch",
  HI_IN: "Hindi",
  HE_IL: "Hebrew",
};

const RECORDING_SENTENCES = [
  "Custom (read your own text)",
  "Are you ready to save big? Get set for the sale of the century! Deals and discounts like never before! You won't want to miss this.",
  "Every challenge we face is an opportunity in disguise. Wouldn't you agree? So cheer up! It'll all be okay.",
  "How have you been? It's been way too long since we last caught up. By the way, I heard about your recent promotion. Congratulations! I'm so excited for you!",
  "The quick brown fox jumps over the lazy dog, a classic sentence that contains every letter of the English alphabet.",
  "We are thrilled to announce our latest product update, which brings a host of new features designed to make your workflow faster and more efficient.",
];

function isAbortError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === "string") {
    const lower = error.toLowerCase();
    return lower.includes("abort") || lower.includes("aborted");
  }

  if (typeof error === "object") {
    const err = error as { name?: unknown; message?: unknown };
    const name = typeof err.name === "string" ? err.name : "";
    const message = typeof err.message === "string" ? err.message : "";

    return (
      name === "AbortError" ||
      name.toLowerCase().includes("abort") ||
      message.toLowerCase().includes("abort") ||
      message.toLowerCase().includes("aborted") ||
      message.toLowerCase().includes("signal is aborted")
    );
  }

  return false;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VoiceCloningPage() {
  const trigger = useHaptics();
  const cloneVoice = useAction(api.cloneVoice.cloneVoice);
  const clonedVoices = useQuery(api.voice.listClonedVoices);
  const deleteClonedVoice = useMutation(api.voice.deleteClonedVoice);

  const [voiceToDelete, setVoiceToDelete] = useState<{
    id: Id<"voices">;
    name: string;
  } | null>(null);

  const handleUseVoice = (inworldVoiceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVoice", JSON.stringify(inworldVoiceId));
      toast.success("Voice ready to use in speech studio");
      trigger("success");
    }
  };

  const handleDeleteVoice = (voiceId: Id<"voices">, name: string) => {
    setVoiceToDelete({ id: voiceId, name });
  };

  const handleConfirmDelete = async () => {
    if (!voiceToDelete) return;
    const { id: voiceId, name } = voiceToDelete;
    setVoiceToDelete(null);

    const toastId = toast.loading(`Deleting "${name}"...`);
    try {
      await deleteClonedVoice({ voiceId });
      toast.success(`"${name}" deleted`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Could not delete voice", { id: toastId });
    }
  };

  const [activeTab, setActiveTab] = useState("upload");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedSentence, setSelectedSentence] = useState(
    RECORDING_SENTENCES[0],
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [langCode, setLangCode] = useState<string>("EN_US");

  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<ReturnType<typeof RecordPlugin.create> | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const voiceNameRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isAbortError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
      true,
    );
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
        true,
      );
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let ws: WaveSurfer | null = null;
    let isDestroyed = false;

    const initWaveSurfer = async () => {
      try {
        ws = WaveSurfer.create({
          container,
          waveColor: "rgba(209, 67, 32, 0.32)",
          progressColor: "rgba(209, 67, 32, 1)",
          cursorColor: "rgba(209, 67, 32, 1)",
          barWidth: 3,
          barGap: 3,
          height: 76,
          normalize: true,
        });

        if (isDestroyed) {
          ws.destroy();
          return;
        }
        const record = ws.registerPlugin(
          RecordPlugin.create({
            scrollingWaveform: true,
            renderRecordedAudio: true,
          }),
        );

        wavesurferRef.current = ws;
        recordPluginRef.current = record;

        ws.on("play", () => setIsPlaying(true));
        ws.on("pause", () => setIsPlaying(false));
        ws.on("finish", () => setIsPlaying(false));
        ws.on("timeupdate", (time) => setCurrentTime(time));
        ws.on("ready", (dur) => setDuration(dur));

        record.on("record-start", () => {
          setIsRecording(true);
          setIsPaused(false);
        });

        record.on("record-end", (blob: Blob) => {
          setAudioBlob(blob);
          setIsRecording(false);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        });

        record.on("record-progress", (time: number) => {
          setRecordTime(time / 1000);
        });
      } catch (err) {
        if (isAbortError(err)) return;
        console.error("WaveSurfer init error:", err);
      }
    };

    initWaveSurfer();

    return () => {
      isDestroyed = true;
      if (ws) {
        try {
          ws.destroy();
        } catch {}
      }
      wavesurferRef.current = null;
      recordPluginRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioUrl && wavesurferRef.current && !isRecording) {
      wavesurferRef.current.load(audioUrl).catch((err) => {
        if (isAbortError(err)) return;
        console.error("WaveSurfer load error:", err);
      });
    }
  }, [audioUrl, isRecording]);

  const togglePlayback = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      if (!isPlaying) trigger("success");
    }
  };

  const startRecording = async () => {
    if (recordPluginRef.current) {
      try {
        setAudioUrl(null);
        trigger("nudge");
        await recordPluginRef.current.startRecording();
      } catch (error: unknown) {
        console.error("Microphone access denied:", error);
      }
    }
  };

  const pauseRecording = () => {
    if (recordPluginRef.current) {
      if (isPaused) {
        recordPluginRef.current.resumeRecording();
        setIsPaused(false);
      } else {
        recordPluginRef.current.pauseRecording();
        setIsPaused(true);
      }
      trigger("nudge");
    }
  };

  const stopRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopRecording();
      trigger("success");
    }
  };

  const clearAudio = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.empty();
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setRecordTime(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCreateVoice = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);

    const toastId = toast.loading("Cloning your voice...");

    const voiceName = voiceNameRef.current?.value;
    if (!voiceName) {
      toast.error("Please enter a name for your voice", { id: toastId });
      setIsProcessing(false);
      return;
    }
    const tagStrings = tagsRef.current?.value;
    const description = descriptionRef.current?.value;

    const tags = tagStrings
      ? tagStrings.split(",").map((tag) => tag.trim())
      : [];

    try {
      trigger("nudge");
      const audioArrayBuffer = await audioBlob.arrayBuffer();

      await cloneVoice({
        description,
        audioSample: audioArrayBuffer,
        lang_code: langCode,
        tags,
        name: voiceName,
      });

      toast.success("Voice created successfully", { id: toastId });
      trigger("success");
    } catch (error: unknown) {
      if (isAbortError(error)) return;
      trigger("error");
      toast.error("Could not create voice", { id: toastId });
      console.error("Voice cloning error: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8 animate-editorial-enter">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Voice Cloning
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Record or upload a clean 5 to 15 second speech sample to build a
              custom voice profile.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Cloning Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {/* Voice Metadata */}
            <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <User className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Voice Details
                </h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="voiceName"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Voice Name <span className="accent-ink">*</span>
                  </Label>
                  <Input
                    id="voiceName"
                    ref={voiceNameRef}
                    placeholder="e.g. Documentary Narrator"
                    className="bg-background border-input h-10 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="desc"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="desc"
                    ref={descriptionRef}
                    placeholder="Describe this voice (e.g. warm, measured, conversational)"
                    className="resize-none bg-background border-input h-24 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="langCode"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Language
                    </Label>
                    <Select value={langCode} onValueChange={setLangCode}>
                      <SelectTrigger
                        id="langCode"
                        className="w-full bg-background border-input h-10 rounded-lg text-sm"
                      >
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {LANG_CODES.map((code) => (
                          <SelectItem
                            key={code}
                            value={code}
                            className="rounded-md cursor-pointer"
                          >
                            {LANG_LABELS[code] ?? code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tags"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      ref={tagsRef}
                      placeholder="narration, calm, clear"
                      className="bg-background border-input h-10 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Audio Sample Input */}
            <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Mic className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Audio Sample
                </h2>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  clearAudio();
                }}
                className="w-full"
              >
                <TabsList className="bg-secondary border border-border p-1 rounded-lg h-10 w-full flex mb-5">
                  <TabsTrigger
                    value="upload"
                    className="flex-1 rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs font-medium text-xs h-full gap-2"
                  >
                    <UploadCloud className="size-3.5 shrink-0" />
                    <span>Upload file</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="record"
                    className="flex-1 rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs font-medium text-xs h-full gap-2"
                  >
                    <Mic className="size-3.5 shrink-0" />
                    <span>Record sample</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0 outline-none">
                  {!audioUrl && (
                    <>
                      <button
                        type="button"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border border-dashed rounded-xl p-8 transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] w-full group ${
                          isDragging
                            ? "border-primary bg-primary/5 scale-[0.995]"
                            : "border-border hover:border-primary/60 bg-secondary/40 hover:bg-secondary/80"
                        }`}
                      >
                        <div
                          className={`size-12 bg-card border rounded-full flex items-center justify-center mb-3 transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isDragging
                              ? "border-primary scale-105"
                              : "border-border group-hover:border-primary/40"
                          }`}
                        >
                          <UploadCloud
                            className={`size-5 transition-colors duration-200 ${
                              isDragging
                                ? "accent-ink"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                        </div>
                        <p className="font-medium text-sm text-foreground mb-1">
                          {isDragging
                            ? "Drop audio file to load"
                            : "Upload an audio file"}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                          MP3 or WAV up to 10MB. Drag and drop or click to
                          browse.
                        </p>
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                    </>
                  )}
                </TabsContent>

                <TabsContent
                  value="record"
                  className="mt-0 outline-none space-y-5"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Sample calibration text
                    </Label>
                    <Select
                      value={selectedSentence}
                      onValueChange={setSelectedSentence}
                    >
                      <SelectTrigger className="w-full bg-background border-input h-10 rounded-lg text-sm">
                        <SelectValue placeholder="Choose a sample" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {RECORDING_SENTENCES.map((sentence, i) => (
                          <SelectItem
                            key={sentence}
                            value={sentence}
                            className="rounded-md cursor-pointer text-sm py-2"
                          >
                            {i === 0
                              ? sentence
                              : sentence.length > 36
                                ? `${sentence.substring(0, 36)}...`
                                : sentence}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedSentence !== "Custom (read your own text)" && (
                      <div
                        key={selectedSentence}
                        className="p-4 bg-secondary/50 rounded-lg border border-border text-sm text-foreground leading-relaxed mt-3 animate-panel-swap"
                      >
                        {selectedSentence}
                      </div>
                    )}
                  </div>

                  {!audioUrl && !isRecording && (
                    <div className="border border-border bg-secondary/40 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[200px] w-full animate-panel-swap">
                      <Button
                        type="button"
                        onClick={startRecording}
                        aria-label="Start recording"
                        className="size-16 rounded-full bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground transition-[background-color,transform] duration-150 mb-4 flex items-center justify-center"
                      >
                        <Mic className="size-6" />
                      </Button>
                      <p className="font-medium text-sm text-foreground mb-1">
                        Start recording
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click the microphone to begin
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Waveform Container */}
              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  audioUrl || isRecording
                    ? "grid-rows-[1fr] opacity-100 mt-4"
                    : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border border-border bg-secondary/30 rounded-xl p-5 relative">
                    {isRecording && (
                      <div className="flex items-center justify-between mb-3 animate-panel-swap">
                        <span className="text-xs text-destructive font-medium flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`size-2 rounded-full ${
                              isPaused
                                ? "bg-muted-foreground"
                                : "bg-destructive animate-tally-pulse"
                            }`}
                          />
                          {isPaused ? "Recording paused" : "Recording live"}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {formatTime(recordTime)}
                        </span>
                      </div>
                    )}

                    {!isRecording && audioUrl && (
                      <div className="flex justify-end mb-2 animate-panel-swap">
                        <span className="font-mono text-xs accent-ink bg-primary/10 px-2.5 py-0.5 rounded-full tabular-nums">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    )}

                    <div ref={containerRef} className="w-full mb-4 h-[76px]" />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                      {isRecording ? (
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <Button
                            type="button"
                            onClick={pauseRecording}
                            variant="outline"
                            className="rounded-lg border-border bg-card hover:bg-accent text-foreground font-medium text-xs h-9 px-4"
                          >
                            {isPaused ? (
                              <Play className="size-3.5 mr-1.5" />
                            ) : (
                              <Pause className="size-3.5 mr-1.5" />
                            )}
                            {isPaused ? "Resume" : "Pause"}
                          </Button>
                          <Button
                            type="button"
                            onClick={stopRecording}
                            variant="destructive"
                            className="rounded-lg font-medium text-xs h-9 px-4"
                          >
                            <Square className="size-3.5 mr-1.5" />
                            Stop
                          </Button>
                        </div>
                      ) : audioUrl ? (
                        <div className="flex items-center justify-between w-full">
                          <Button
                            type="button"
                            onClick={togglePlayback}
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 h-9 px-5"
                          >
                            {isPlaying ? (
                              <Pause className="size-3.5" />
                            ) : (
                              <Play className="size-3.5 ml-0.5" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={clearAudio}
                            variant="ghost"
                            className="rounded-lg text-muted-foreground hover:text-destructive font-medium text-xs h-9 px-3"
                          >
                            <Trash2 className="size-3.5 mr-1.5" />
                            Remove
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Button
              disabled={!audioUrl || isRecording || isProcessing}
              onClick={handleCreateVoice}
              className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground font-medium text-sm transition-[background-color,transform] duration-150 whitespace-nowrap"
            >
              {isProcessing ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              {isProcessing ? "Creating your voice..." : "Create Voice"}
            </Button>
          </div>

          {/* Right Guidelines & Cloned Voices */}
          <aside className="lg:col-span-4 space-y-6">
            <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
                <Lightbulb className="size-4 text-muted-foreground" />
                Recording Guidelines
              </h2>

              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Delivery</h3>
                  <p>
                    Speak naturally with expression. Flat, monotone audio
                    produces flat results. Record in a quiet room free of echo.
                  </p>
                </div>
                <div className="space-y-2 pt-3 border-t border-border">
                  <h3 className="font-semibold text-foreground">
                    Audio Quality
                  </h3>
                  <p>
                    Aim for 5 to 15 seconds of clear speech at 22kHz or higher,
                    avoiding microphone clipping or loud peaks.
                  </p>
                </div>
              </div>
            </section>

            <section className="studio-panel rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Waves className="size-4 text-muted-foreground" />
                  Your Voices
                </h2>
                {clonedVoices && (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {clonedVoices.length}
                  </span>
                )}
              </div>

              {clonedVoices === undefined ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ) : clonedVoices.length === 0 ? (
                <div className="text-center py-8 bg-secondary/40 border border-border rounded-lg px-4">
                  <Mic className="size-5 text-muted-foreground mx-auto mb-2.5" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    No voices yet
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add an audio sample on the left to clone your first voice.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {clonedVoices.map((voice) => (
                    <div
                      key={voice._id}
                      className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {voice.displayName}
                          </h3>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate mt-0.5">
                            {voice.inworldVoiceId}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] accent-ink bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          {LANG_LABELS[voice.langCode ?? "EN_US"] ??
                            voice.langCode ??
                            "English (US)"}
                        </span>
                      </div>

                      {voice.description ? (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {voice.description}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No description
                        </p>
                      )}

                      {voice.tags && voice.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {voice.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <Button
                          asChild
                          variant="ghost"
                          onClick={() => handleUseVoice(voice.inworldVoiceId!)}
                          className="flex-1 rounded-full bg-primary/10 accent-ink hover:bg-primary hover:text-primary-foreground font-medium text-xs h-8 transition-colors"
                        >
                          <Link href="/app/text-to-speech">Use Voice</Link>
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            handleDeleteVoice(voice._id, voice.displayName)
                          }
                          variant="ghost"
                          aria-label={`Delete ${voice.displayName}`}
                          className="rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-8 px-2.5 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      <AlertDialog
        open={voiceToDelete !== null}
        onOpenChange={(open) => !open && setVoiceToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-border rounded-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Delete voice
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                &ldquo;{voiceToDelete?.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-full h-9 px-4 text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                trigger("error");
                void handleConfirmDelete();
              }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 px-4 text-xs"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
