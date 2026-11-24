"use client";

import {
  CloudArrowUpIcon,
  LightbulbIcon,
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  SparkleIcon,
  SpinnerGapIcon,
  StopIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { useAction, useMutation, useQuery } from "convex/react";
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
        const isDark = document.documentElement.classList.contains("dark");
        ws = WaveSurfer.create({
          container,
          waveColor: isDark
            ? "rgba(255, 255, 255, 0.24)"
            : "rgba(13, 13, 15, 0.22)",
          progressColor: isDark ? "#ffffff" : "#0d0d0f",
          cursorColor: isDark ? "#ffffff" : "#0d0d0f",
          barWidth: 3,
          barGap: 3,
          barRadius: 99,
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
    <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-6 animate-editorial-enter">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-foreground">
            Voice Cloning
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
            Record or upload a clean 5 to 15 second speech sample to build a
            custom voice profile.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left 7 Cols: Voice Details + Audio Capture */}
          <div className="xl:col-span-7 space-y-5">
            {/* Voice Details Card */}
            <section className="bento-card p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                  <UserIcon weight="bold" className="size-4" />
                </span>
                <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                  Voice Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="voiceName"
                    className="text-xs font-semibold text-foreground"
                  >
                    Voice Name *
                  </Label>
                  <Input
                    id="voiceName"
                    ref={voiceNameRef}
                    placeholder="e.g. Documentary Narrator"
                    className="bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="desc"
                    className="text-xs font-semibold text-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="desc"
                    ref={descriptionRef}
                    placeholder="Describe this voice (e.g. warm, measured, conversational)"
                    className="resize-none bg-secondary/75 border-0 h-24 rounded-2xl p-4 text-sm shadow-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="langCode"
                      className="text-xs font-semibold text-foreground"
                    >
                      Language
                    </Label>
                    <Select value={langCode} onValueChange={setLangCode}>
                      <SelectTrigger
                        id="langCode"
                        className="w-full bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none"
                      >
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {LANG_CODES.map((code) => (
                          <SelectItem
                            key={code}
                            value={code}
                            className="rounded-xl cursor-pointer"
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
                      className="text-xs font-semibold text-foreground"
                    >
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      ref={tagsRef}
                      placeholder="narration, calm, clear"
                      className="bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Audio Sample Capture Card */}
            <section className="bento-card p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MicrophoneIcon weight="fill" className="size-4" />
                </span>
                <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
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
                <TabsList className="bg-secondary/85 p-1 rounded-full h-11 w-full flex mb-5 border-0">
                  <TabsTrigger
                    value="upload"
                    className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs h-full gap-2 transition-all"
                  >
                    <CloudArrowUpIcon className="size-3.5 shrink-0" />
                    <span>Upload file</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="record"
                    className="flex-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-xs h-full gap-2 transition-all"
                  >
                    <MicrophoneIcon className="size-3.5 shrink-0" />
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
                        className={`border-2 border-dashed rounded-[22px] p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] w-full group ${
                          isDragging
                            ? "border-primary bg-secondary scale-[0.995]"
                            : "border-border hover:border-foreground/30 bg-secondary/45 hover:bg-secondary/75"
                        }`}
                      >
                        <div className="size-12 bg-card shadow-xs rounded-full flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
                          <CloudArrowUpIcon className="size-5 text-foreground" />
                        </div>
                        <p className="font-semibold text-sm text-foreground mb-1">
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
                  className="mt-0 outline-none space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Sample calibration text
                    </Label>
                    <Select
                      value={selectedSentence}
                      onValueChange={setSelectedSentence}
                    >
                      <SelectTrigger className="w-full bg-secondary/75 border-0 h-11 rounded-2xl px-4 text-sm shadow-none">
                        <SelectValue placeholder="Choose a sample" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {RECORDING_SENTENCES.map((sentence, i) => (
                          <SelectItem
                            key={sentence}
                            value={sentence}
                            className="rounded-xl cursor-pointer text-sm py-2"
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
                        className="bento-row p-4 text-sm text-foreground leading-relaxed mt-2 animate-panel-swap"
                      >
                        {selectedSentence}
                      </div>
                    )}
                  </div>

                  {!audioUrl && !isRecording && (
                    <div className="bento-row rounded-[22px] p-8 flex flex-col items-center justify-center text-center min-h-[200px] w-full animate-panel-swap">
                      <Button
                        type="button"
                        onClick={startRecording}
                        aria-label="Start recording"
                        className="size-16 rounded-full bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground transition-all mb-4 flex items-center justify-center shadow-md cursor-pointer"
                      >
                        <MicrophoneIcon weight="fill" className="size-6" />
                      </Button>
                      <p className="font-semibold text-sm text-foreground mb-1">
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
                  <div className="bento-row rounded-[22px] p-5 relative">
                    {isRecording && (
                      <div className="flex items-center justify-between mb-3 animate-panel-swap">
                        <span className="text-xs text-destructive font-semibold flex items-center gap-2">
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
                        <span className="font-mono text-xs font-semibold text-foreground bg-card px-3 py-1 rounded-full tabular-nums shadow-2xs">
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
                            className="rounded-full border-border bg-card hover:bg-accent text-foreground font-semibold text-xs h-9 px-4"
                          >
                            {isPaused ? (
                              <PlayIcon
                                weight="fill"
                                className="size-3.5 mr-1.5"
                              />
                            ) : (
                              <PauseIcon
                                weight="fill"
                                className="size-3.5 mr-1.5"
                              />
                            )}
                            {isPaused ? "Resume" : "Pause"}
                          </Button>
                          <Button
                            type="button"
                            onClick={stopRecording}
                            variant="destructive"
                            className="rounded-full font-semibold text-xs h-9 px-4"
                          >
                            <StopIcon
                              weight="fill"
                              className="size-3.5 mr-1.5"
                            />
                            Stop
                          </Button>
                        </div>
                      ) : audioUrl ? (
                        <div className="flex items-center justify-between w-full">
                          <Button
                            type="button"
                            onClick={togglePlayback}
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 h-9 px-5 cursor-pointer"
                          >
                            {isPlaying ? (
                              <PauseIcon weight="fill" className="size-3.5" />
                            ) : (
                              <PlayIcon
                                weight="fill"
                                className="size-3.5 ml-0.5"
                              />
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={clearAudio}
                            variant="ghost"
                            className="rounded-full text-muted-foreground hover:text-destructive font-semibold text-xs h-9 px-3.5"
                          >
                            <TrashIcon className="size-3.5 mr-1.5" />
                            Remove
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                disabled={!audioUrl || isRecording || isProcessing}
                onClick={handleCreateVoice}
                className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground font-semibold text-sm transition-all whitespace-nowrap cursor-pointer"
              >
                {isProcessing ? (
                  <SpinnerGapIcon className="size-4 mr-2 animate-spin" />
                ) : (
                  <SparkleIcon weight="fill" className="size-4 mr-2" />
                )}
                {isProcessing ? "Creating your voice..." : "Create Voice"}
              </Button>
            </section>
          </div>

          {/* Right 5 Cols: Cloned Voices + Recording Guidelines */}
          <aside className="xl:col-span-5 space-y-5">
            <section className="bento-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                    <WaveformIcon weight="fill" className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                    Your Cloned Voices
                  </h2>
                </div>
                {clonedVoices && (
                  <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs font-semibold text-foreground tabular-nums">
                    {clonedVoices.length}
                  </span>
                )}
              </div>

              {clonedVoices === undefined ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              ) : clonedVoices.length === 0 ? (
                <div className="bento-row text-center py-10 px-4">
                  <div className="size-10 rounded-full bg-card shadow-2xs flex items-center justify-center mx-auto mb-3">
                    <MicrophoneIcon className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    No cloned voices yet
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                    Add an audio sample on the left to clone your first custom
                    voice.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {clonedVoices.map((voice) => (
                    <div key={voice._id} className="bento-row p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[14px] font-bold text-foreground truncate">
                            {voice.displayName}
                          </h3>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate mt-0.5">
                            {voice.inworldVoiceId}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-foreground bg-card px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
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
                              className="text-[11px] font-medium text-muted-foreground bg-card px-2.5 py-0.5 rounded-full shadow-2xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          asChild
                          variant="ghost"
                          onClick={() => handleUseVoice(voice.inworldVoiceId!)}
                          className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-semibold text-xs h-9 transition-all"
                        >
                          <Link href="/app/text-to-speech">Use Voice</Link>
                        </Button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteVoice(voice._id, voice.displayName)
                          }
                          aria-label={`Delete ${voice.displayName}`}
                          className="flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-destructive hover:shadow-xs transition-all cursor-pointer"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bento-card p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                  <LightbulbIcon weight="bold" className="size-4" />
                </span>
                <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                  Recording Guidelines
                </h2>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <div className="bento-row p-4 space-y-1">
                  <h3 className="font-semibold text-foreground">Delivery</h3>
                  <p>
                    Speak naturally with expression. Flat, monotone audio
                    produces flat results. Record in a quiet room free of echo.
                  </p>
                </div>
                <div className="bento-row p-4 space-y-1">
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
          </aside>
        </div>
      </div>

      <AlertDialog
        open={voiceToDelete !== null}
        onOpenChange={(open) => !open && setVoiceToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-border rounded-[26px] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <WarningIcon className="size-4" />
              Delete voice
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{voiceToDelete?.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-full h-9 px-4 text-xs font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                trigger("error");
                void handleConfirmDelete();
              }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 px-4 text-xs font-semibold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
