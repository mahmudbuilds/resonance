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
  "Are you ready to save big? Get set for the sale of the century! Deals and discounts like never before! You won’t want to miss this.",
  "Every challenge we face is an opportunity in disguise. Wouldn’t you agree? So cheer up! It’ll all be okay.",
  "How have you been? It’s been way too long since we last caught up. By the way, I heard about your recent promotion. Congratulations! I’m so excited for you!",
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
    }
  };

  const handleDeleteVoice = (voiceId: Id<"voices">, name: string) => {
    setVoiceToDelete({ id: voiceId, name });
  };

  const handleConfirmDelete = async () => {
    if (!voiceToDelete) return;
    const { id: voiceId, name } = voiceToDelete;
    setVoiceToDelete(null);

    const toastId = toast.loading(
      `Deleting "${name}"...`,
    );
    try {
      await deleteClonedVoice({ voiceId });
      toast.success(`"${name}" deleted`, {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Could not delete voice`, { id: toastId });
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

    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);
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
          waveColor: "rgba(167, 139, 250, 0.4)", // Primary color low opacity
          progressColor: "rgba(167, 139, 250, 1)", // Primary color
          cursorColor: "rgba(167, 139, 250, 1)",
          barWidth: 3,
          barGap: 3,
          height: 80,
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

        // --- Listeners ---
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
        } catch (e) {}
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
    }
  };

  const startRecording = async () => {
    if (recordPluginRef.current) {
      try {
        setAudioUrl(null);
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
      } else {
        recordPluginRef.current.pauseRecording();
      }
    }
  };

  const stopRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopRecording();
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleExecuteProtocol = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);

    const toastId = toast.loading("Cloning your voice...");

    //Getting values from the UI inputs
    const voiceName = voiceNameRef.current?.value;
    if (!voiceName) {
      toast.error("Please enter a name for your voice", { id: toastId });
      setIsProcessing(false);
      return;
    }
    const tagStrings = tagsRef.current?.value;
    const description = descriptionRef.current?.value;

    const tags = tagStrings
      ? tagStrings?.split(",").map((tag) => tag.trim())
      : [];

    try {
      const audioArrayBuffer = await audioBlob.arrayBuffer();

      await cloneVoice({
        description,
        audioSample: audioArrayBuffer,
        lang_code: langCode,
        tags,
        name: voiceName,
      });

      toast.success("Voice created successfully", { id: toastId });
    } catch (error: unknown) {
      if (isAbortError(error)) return;
      toast.error("Could not create voice", { id: toastId });
      console.error("Voice cloning error: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden text-foreground pb-20">

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 animate-fade-up">
        {/* Header Section */}
        <header className="mb-10 sm:mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 mb-4 rounded-full text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Voice Cloning
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Clone a Voice
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Record or upload a clear audio sample, and we&apos;ll create a
            custom voice you can use to generate speech.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* Main Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-8 stagger-1">
            <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8 relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-white tracking-wide">Configuration</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="voiceName"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Voice Designation <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="voiceName"
                    ref={voiceNameRef}
                    placeholder="e.g. Mark_01"
                    className="glass-card border-white/5 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-white placeholder:text-muted-foreground/50 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="desc"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Acoustic Profile <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="desc"
                    ref={descriptionRef}
                    placeholder="Define tone parameters..."
                    className="resize-none glass-card border-white/5 h-24 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-white placeholder:text-muted-foreground/50 w-full text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="langCode"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Locale Code
                    </Label>
                    <Select value={langCode} onValueChange={setLangCode}>
                      <SelectTrigger
                        id="langCode"
                        className="glass-card border-white/5 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-white text-sm"
                      >
                        <SelectValue placeholder="Locale" />
                      </SelectTrigger>
                      <SelectContent className="glass-panel border-white/10 rounded-xl text-white">
                        {LANG_CODES.map((code) => (
                          <SelectItem
                            key={code}
                            value={code}
                            className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer"
                          >
                            {code}
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
                      Metadata Tags
                    </Label>
                    <Input
                      id="tags"
                      ref={tagsRef}
                      placeholder="Tag 1, Tag 2..."
                      className="glass-card border-white/5 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-white placeholder:text-muted-foreground/50 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Input Module */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8 relative stagger-2">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <Mic className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-white tracking-wide">Input Source</h2>
              </div>

              <div className="mt-4">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => {
                    setActiveTab(val);
                    clearAudio();
                  }}
                  className="w-full"
                >
                  <TabsList className="glass-card p-1 rounded-xl h-12 w-full flex border-white/5 mb-6">
                    <TabsTrigger
                      value="upload"
                      className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium text-xs h-full gap-2 px-2 transition-all"
                    >
                      <UploadCloud className="w-4 h-4 shrink-0" />{" "}
                      <span className="truncate">Upload</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="record"
                      className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium text-xs h-full gap-2 px-2 transition-all"
                    >
                      <Mic className="w-4 h-4 shrink-0" />{" "}
                      <span className="truncate">Record</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-0 outline-none">
                    {!audioUrl ? (
                      <>
                        <button
                          type="button"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-dashed border-white/10 hover:border-primary/50 bg-white/5 hover:bg-white/10 rounded-2xl p-12 transition-all flex flex-col items-center justify-center text-center cursor-pointer group/dropzone min-h-[250px] w-full"
                        >
                          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 group-hover/dropzone:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-muted-foreground group-hover/dropzone:text-primary transition-colors" />
                          </div>
                          <p className="font-medium text-sm text-white mb-2">
                            Initialize Data Transfer
                          </p>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            MP3/WAV. 10MB MAX. DROP PACKETS HERE.
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
                    ) : null}
                  </TabsContent>

                  <TabsContent
                    value="record"
                    className="mt-0 outline-none space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Calibration Script
                      </Label>
                      <Select
                        value={selectedSentence}
                        onValueChange={setSelectedSentence}
                      >
                        <SelectTrigger className="glass-card border-white/5 h-12 rounded-xl text-white focus-visible:ring-primary focus-visible:border-primary text-sm">
                          <SelectValue placeholder="Select Script" />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-white/10 rounded-xl text-white">
                          {RECORDING_SENTENCES.map((sentence, i) => (
                            <SelectItem
                              key={sentence}
                              value={sentence}
                              className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer text-sm py-2"
                            >
                              {i === 0
                                ? sentence
                                : `Seq ${i}: ${sentence.substring(0, 40)}...`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedSentence !== "CUSTOM (READ_ANYTHING)" && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-sm text-primary leading-relaxed mt-4">
                          {selectedSentence}
                        </div>
                      )}
                    </div>

                    {!audioUrl && !isRecording && (
                      <div className="border border-white/10 bg-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[250px]">
                        <Button
                          onClick={startRecording}
                          className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 mb-6 flex items-center justify-center shadow-lg shadow-primary/20"
                        >
                          <Mic className="w-8 h-8" />
                        </Button>
                        <p className="font-medium text-sm text-white mb-2">
                          Engage Microphone
                        </p>
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                          Awaiting vocal input...
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Audio Waveform Visualization */}
                <div
                  className={`mt-6 border border-white/5 glass-card rounded-2xl p-6 relative ${audioUrl || isRecording ? "block" : "hidden"}`}
                >
                  {isRecording && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 bg-red-400 rounded-full ${!isPaused ? "animate-pulse" : ""}`}
                      />
                      <span className="font-mono text-xs text-red-400 font-medium">
                        {formatTime(recordTime)} REC
                      </span>
                      {isPaused && (
                        <span className="font-mono text-xs text-muted-foreground font-medium">
                          [PAUSED]
                        </span>
                      )}
                    </div>
                  )}

                  {!isRecording && audioUrl && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  )}

                  {/* WaveSurfer Container */}
                  <div
                    ref={containerRef}
                    className="w-full mt-10 mb-6 h-[80px]"
                  />

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {isRecording ? (
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={pauseRecording}
                          variant="outline"
                          className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs h-10 px-5"
                        >
                          {isPaused ? (
                            <Play className="w-4 h-4 mr-2" />
                          ) : (
                            <Pause className="w-4 h-4 mr-2" />
                          )}
                          {isPaused ? "RESUME" : "PAUSE"}
                        </Button>
                        <Button
                          onClick={stopRecording}
                          className="rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 font-medium text-xs h-10 px-6 transition-colors border-none"
                        >
                          <Square className="w-4 h-4 mr-2" /> HALT
                        </Button>
                      </div>
                    ) : audioUrl ? (
                      <div className="flex items-center justify-between w-full">
                        <Button
                          onClick={togglePlayback}
                          className="rounded-full bg-primary text-white hover:bg-primary/90 h-10 w-16 flex items-center justify-center transition-colors shadow-md shadow-primary/20"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          onClick={clearAudio}
                          variant="ghost"
                          className="rounded-xl hover:bg-red-400/10 text-muted-foreground hover:text-red-400 font-medium text-xs transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> DISCARD
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Execute Action */}
            <Button
              disabled={!audioUrl || isRecording || isProcessing}
              onClick={handleExecuteProtocol}
              className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-[1.02] text-white font-medium text-base transition-all border-none shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 stagger-3"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              {isProcessing ? "Processing..." : "Execute Cloning Protocol"}
            </Button>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-4 flex flex-col gap-8 stagger-2">
            <div className="glass-panel border border-white/5 rounded-3xl p-8">
              <h3 className="font-heading text-base font-semibold text-primary mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                <AlertTriangle className="w-4 h-4" /> Protocol Directives
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-semibold text-white mb-4">
                    Acoustic Parameters
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 opacity-80" />
                      <span>
                        Full tonal spectrum required. Monotone input yields monotone output.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 opacity-80" />
                      <span>
                        Zero ambient interference. Clean signals only.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white mb-4">
                    Extraction Limits
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 opacity-80" />
                      <span>
                        Optimal window: 5-15 seconds.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 opacity-80" />
                      <span>
                        Min SR: 22kHz / 16-bit depth.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 opacity-80" />
                      <span>
                        Peak limit: Avoid 0dB clipping.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Active Cloned Voices Database */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8">
              <h3 className="font-heading text-sm font-semibold text-white mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <span className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-primary" /> CLONE REGISTRY
                </span>
                {clonedVoices && (
                  <span className="text-primary font-mono text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">
                    {clonedVoices.length}
                  </span>
                )}
              </h3>

              {clonedVoices === undefined ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Retrieving archive...
                  </span>
                </div>
              ) : clonedVoices.length === 0 ? (
                <div className="text-center py-10 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Terminal className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">
                    Registry Empty
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto px-4">
                    No neural signatures mapped. Run a cloning protocol to initialize a voice profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {clonedVoices.map((voice) => (
                    <div
                      key={voice._id}
                      className="glass-card border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors p-4 rounded-2xl flex flex-col gap-3 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-heading text-sm font-semibold text-white truncate">
                            {voice.displayName}
                          </h4>
                          <span className="font-mono text-[10px] text-muted-foreground block mt-1 truncate">
                            ID: {voice.inworldVoiceId}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          {voice.langCode || "EN_US"}
                        </span>
                      </div>

                      {voice.description ? (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                          {voice.description}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 italic mt-1">
                          No parameters defined
                        </p>
                      )}

                      {voice.tags && voice.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {voice.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-white/5">
                        <Button
                          asChild
                          variant="ghost"
                          onClick={() => handleUseVoice(voice.inworldVoiceId!)}
                          className="flex-1 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium text-xs h-8 transition-colors"
                        >
                          <Link href="/app/text-to-speech">Use Voice</Link>
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteVoice(voice._id, voice.displayName)
                          }
                          variant="ghost"
                          className="rounded-xl hover:bg-red-400/10 text-muted-foreground hover:text-red-400 h-8 px-3 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={voiceToDelete !== null}
        onOpenChange={(open) => !open && setVoiceToDelete(null)}
      >
        <AlertDialogContent className="glass-panel border-white/10 rounded-2xl max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-base font-semibold text-red-400 flex items-center gap-2 border-b border-white/5 pb-4">
              <AlertTriangle className="w-4 h-4" /> Decommission Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed pt-4">
              You are about to purge the neural profile:
              <span className="block my-3 text-white font-medium bg-white/5 border border-white/10 p-3 rounded-xl truncate">
                "{voiceToDelete?.name}"
              </span>
              Warning: This action cannot be undone. The data signature will be
              permanently deleted from the registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex sm:justify-end gap-3 border-t border-white/5 pt-4">
            <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs h-10 px-5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-xs h-10 px-5 border-none shadow-lg shadow-red-500/20"
            >
              Purge Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
