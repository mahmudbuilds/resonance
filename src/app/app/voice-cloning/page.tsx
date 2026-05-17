"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Loader2,
  Mic,
  Pause,
  Play,
  Sparkles,
  Square,
  Terminal,
  Trash2,
  UploadCloud,
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

const RECORDING_SENTENCES = [
  "CUSTOM (READ_ANYTHING)",
  "Are you ready to save big? Get set for the sale of the century! Deals and discounts like never before! You won’t want to miss this.",
  "Every challenge we face is an opportunity in disguise. Wouldn’t you agree? So cheer up! It’ll all be okay.",
  "How have you been? It’s been way too long since we last caught up. By the way, I heard about your recent promotion. Congratulations! I’m so excited for you!",
  "The quick brown fox jumps over the lazy dog, a classic sentence that contains every letter of the English alphabet.",
  "We are thrilled to announce our latest product update, which brings a host of new features designed to make your workflow faster and more efficient.",
];

function isAbortError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "AbortError" ||
    error.message.toLowerCase().includes("signal is aborted")
  );
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
      toast.success("ACTIVE VOICE LOADED INTO SPEECH MODULE");
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
      `DELETING NEURAL PROFILE "${name.toUpperCase()}"...`,
    );
    try {
      await deleteClonedVoice({ voiceId });
      toast.success(`NEURAL PROFILE "${name.toUpperCase()}" PURGED`, {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error(`FAILED TO PURGE NEURAL PROFILE`, { id: toastId });
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
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
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
          waveColor: "rgba(204, 255, 0, 0.4)",
          progressColor: "rgba(204, 255, 0, 1)",
          cursorColor: "rgba(204, 255, 0, 1)",
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

    const toastId = toast.loading("INITIALIZING NEURAL MAP...");

    //Getting values from the UI inputs
    const voiceName = voiceNameRef.current?.value;
    if (!voiceName) {
      toast.error("Voice Designation is required", { id: toastId });
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

      toast.success("CLONING PROTOCOL COMPLETE", { id: toastId });
    } catch (error: unknown) {
      if (isAbortError(error)) return;
      toast.error("CLONING PROTOCOL FAILED. ", { id: toastId });
      console.error("Cloning Protocol Failed: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white selection:bg-primary selection:text-black pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 border-b border-[#222] pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
              <Terminal className="w-3 h-3" />
              Module: Voice Extraction
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              CLONE <span className="text-primary">VOICE</span>
            </h1>
          </div>
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
            Initialize neural extraction protocol. Provide high-fidelity audio
            samples to map acoustic topography.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* Main Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
            <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                Configuration
              </div>

              <div className="space-y-6 sm:space-y-8 mt-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="voiceName"
                    className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]"
                  >
                    Voice Designation <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="voiceName"
                    ref={voiceNameRef}
                    placeholder="E.G. MARK_01"
                    className="bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="desc"
                    className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]"
                  >
                    Acoustic Profile <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="desc"
                    ref={descriptionRef}
                    placeholder="DEFINE_TONE_PARAMETERS..."
                    className="resize-none bg-[#111] border-[#333] h-24 sm:h-28 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] w-full text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="langCode"
                      className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]"
                    >
                      Locale Code
                    </Label>
                    <Select value={langCode} onValueChange={setLangCode}>
                      <SelectTrigger
                        id="langCode"
                        className="bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono text-white text-sm"
                      >
                        <SelectValue placeholder="LOCALE" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                        {LANG_CODES.map((code) => (
                          <SelectItem
                            key={code}
                            value={code}
                            className="focus:bg-primary focus:text-black rounded-none cursor-pointer"
                          >
                            {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="tags"
                      className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]"
                    >
                      Metadata Tags
                    </Label>
                    <Input
                      id="tags"
                      ref={tagsRef}
                      placeholder="TAG_1, TAG_2..."
                      className="bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono uppercase placeholder:text-[#444] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Input Module */}
            <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                Input Source
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
                  <TabsList className="bg-transparent p-0 rounded-none h-12 sm:h-14 w-full flex border border-[#333] mb-6 sm:mb-8 overflow-hidden">
                    <TabsTrigger
                      value="upload"
                      className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2 px-2"
                    >
                      <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />{" "}
                      <span className="truncate">Upload</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="record"
                      className="flex-1 rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-mono uppercase tracking-widest text-[10px] sm:text-xs h-full gap-2 px-2"
                    >
                      <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />{" "}
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
                          className="border border-dashed border-[#444] hover:border-primary bg-[#111] hover:bg-primary/5 p-12 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group/dropzone min-h-[250px] w-full"
                        >
                          <div className="w-16 h-16 bg-[#000] border border-[#333] flex items-center justify-center mb-6 group-hover/dropzone:border-primary transition-colors">
                            <UploadCloud className="w-6 h-6 text-[#666] group-hover/dropzone:text-primary transition-colors" />
                          </div>
                          <p className="font-mono text-sm text-white uppercase tracking-widest mb-2">
                            Initialize Data Transfer
                          </p>
                          <p className="text-xs font-mono text-[#666] uppercase tracking-wider max-w-xs">
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
                    <div className="space-y-3">
                      <Label className="font-mono text-xs uppercase tracking-widest text-[#888]">
                        Calibration Script
                      </Label>
                      <Select
                        value={selectedSentence}
                        onValueChange={setSelectedSentence}
                      >
                        <SelectTrigger className="bg-[#111] border-[#333] h-14 rounded-none font-mono text-white focus-visible:ring-primary focus-visible:border-primary">
                          <SelectValue placeholder="SELECT_SCRIPT" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                          {RECORDING_SENTENCES.map((sentence, i) => (
                            <SelectItem
                              key={sentence}
                              value={sentence}
                              className="focus:bg-primary focus:text-black rounded-none cursor-pointer text-xs py-3"
                            >
                              {i === 0
                                ? sentence
                                : `SEQ_${i}: ${sentence.substring(0, 40)}...`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedSentence !== "CUSTOM (READ_ANYTHING)" && (
                        <div className="p-6 bg-[#111] border border-[#333] font-mono text-sm text-primary uppercase leading-relaxed">
                          &gt; {selectedSentence}
                        </div>
                      )}
                    </div>

                    {!audioUrl && !isRecording && (
                      <div className="border border-[#333] bg-[#111] p-12 flex flex-col items-center justify-center text-center min-h-[250px]">
                        <Button
                          onClick={startRecording}
                          className="w-20 h-20 rounded-none bg-primary hover:bg-white text-black transition-colors mb-6 flex items-center justify-center border border-primary relative group"
                        >
                          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                          <Mic className="w-8 h-8" />
                        </Button>
                        <p className="font-mono text-sm text-white uppercase tracking-widest mb-2">
                          Engage Microphone
                        </p>
                        <p className="font-mono text-xs text-[#666] uppercase tracking-wider">
                          AWAITING VOCAL INPUT...
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Audio Waveform Visualization */}
                <div
                  className={`mt-8 border border-[#333] bg-[#111] p-6 relative ${audioUrl || isRecording ? "block" : "hidden"}`}
                >
                  {isRecording && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                      <div
                        className={`w-3 h-3 bg-red-500 rounded-none ${!isPaused ? "animate-pulse" : ""}`}
                      />
                      <span className="font-mono text-xs text-red-500 uppercase tracking-widest">
                        {formatTime(recordTime)} REC
                      </span>
                      {isPaused && (
                        <span className="font-mono text-xs text-[#888] uppercase tracking-widest">
                          [PAUSED]
                        </span>
                      )}
                    </div>
                  )}

                  {!isRecording && audioUrl && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-1 uppercase tracking-widest">
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
                  <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                    {isRecording ? (
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={pauseRecording}
                          variant="outline"
                          className="rounded-none border-[#444] bg-[#222] hover:bg-[#333] text-white font-mono uppercase tracking-widest text-xs h-10 px-4"
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
                          className="rounded-none border border-red-500 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-500 font-mono uppercase tracking-widest text-xs h-10 px-6 transition-colors"
                        >
                          <Square className="w-4 h-4 mr-2" /> HALT
                        </Button>
                      </div>
                    ) : audioUrl ? (
                      <div className="flex items-center justify-between w-full">
                        <Button
                          onClick={togglePlayback}
                          className="rounded-none bg-primary text-black hover:bg-white h-10 w-16 flex items-center justify-center transition-colors"
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
                          className="rounded-none hover:bg-red-500/10 text-[#888] hover:text-red-500 font-mono text-xs uppercase tracking-widest"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> JETTISON
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
              className="w-full h-20 rounded-none bg-primary hover:bg-white text-black font-mono text-lg uppercase tracking-widest transition-colors border border-primary disabled:opacity-30 disabled:hover:bg-primary"
            >
              <Sparkles className="w-6 h-6 mr-3" /> Execute Cloning Protocol
            </Button>
          </div>

          {/* Sidebar Guidelines */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="border border-[#222] bg-[#050505] p-8">
              <h3 className="font-heading text-lg font-bold uppercase text-primary mb-6 flex items-center gap-3 border-b border-[#222] pb-4">
                <AlertTriangle className="w-5 h-5" /> Protocol Directives
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#666] mb-4">
                    Acoustic Parameters
                  </h4>
                  <ul className="space-y-4 font-mono text-xs uppercase text-[#aaa]">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">
                        Full tonal spectrum required. Monotone input = monotone
                        output.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">
                        Zero ambient interference. Clean signals only.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#666] mb-4">
                    Extraction Limits
                  </h4>
                  <ul className="space-y-4 font-mono text-xs uppercase text-[#aaa]">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">
                        Optimal window: 5-15 seconds.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">
                        Min SR: 22kHz / 16-bit depth.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">
                        Peak limit: Avoid 0dB clipping.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Active Cloned Voices Database */}
            <div className="border border-[#222] bg-[#050505] p-6 sm:p-8">
              <h3 className="font-mono text-sm uppercase text-white mb-6 flex items-center justify-between border-b border-[#222] pb-4">
                <span className="flex items-center gap-3">
                  <Waves className="w-4 h-4 text-primary" /> CLONE REGISTRY
                </span>
                {clonedVoices && (
                  <span className="text-primary font-bold text-xs bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono">
                    [{clonedVoices.length}]
                  </span>
                )}
              </h3>

              {clonedVoices === undefined ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="font-mono text-xs text-[#666] uppercase tracking-widest animate-pulse">
                    Retrieving neural archive...
                  </span>
                </div>
              ) : clonedVoices.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#222] bg-[#020202]">
                  <Terminal className="w-8 h-8 text-[#333] mx-auto mb-4" />
                  <p className="font-mono text-xs text-[#666] uppercase tracking-widest mb-2">
                    REGISTRY_EMPTY
                  </p>
                  <p className="font-mono text-[10px] text-[#444] uppercase leading-relaxed max-w-xs mx-auto px-4">
                    No neural signatures mapped. Run a cloning protocol on the
                    left to initialize a voice profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {clonedVoices.map((voice) => (
                    <div
                      key={voice._id}
                      className="border border-[#222] bg-[#080808] hover:border-primary/40 transition-colors p-4 flex flex-col gap-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-heading text-sm font-bold text-white uppercase truncate">
                            {voice.displayName}
                          </h4>
                          <span className="font-mono text-[8px] text-[#444] uppercase tracking-widest block mt-0.5 truncate">
                            ID: {voice.inworldVoiceId}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 uppercase shrink-0">
                          {voice.langCode || "EN_US"}
                        </span>
                      </div>

                      {voice.description ? (
                        <p className="font-mono text-[10px] text-[#888] uppercase leading-relaxed line-clamp-2">
                          {voice.description}
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] text-[#333] uppercase italic">
                          NO_PARAMETERS_DEFINED
                        </p>
                      )}

                      {voice.tags && voice.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {voice.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[8px] text-[#666] border border-[#222] bg-[#0c0c0c] px-1.5 py-0.5 uppercase"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#111]">
                        <Button
                          asChild
                          variant="outline"
                          onClick={() => handleUseVoice(voice.inworldVoiceId!)}
                          className="flex-1 rounded-none border-primary/30 hover:border-primary bg-transparent text-primary hover:bg-primary hover:text-black font-mono text-[10px] uppercase tracking-widest h-8"
                        >
                          <Link href="/app/text-to-speech">Use Voice</Link>
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteVoice(voice._id, voice.displayName)
                          }
                          variant="ghost"
                          className="rounded-none hover:bg-red-500/10 text-[#888] hover:text-red-500 font-mono text-[10px] uppercase tracking-widest h-8 px-3 border border-transparent hover:border-red-500/20"
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
        <AlertDialogContent className="border border-[#222] bg-black rounded-none font-mono max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 border-b border-[#222] pb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" /> DECOMMISSION
              NEURAL PROFILE
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs uppercase text-[#aaa] leading-relaxed pt-2">
              YOU ARE ABOUT TO PURGE THE NEURAL PROFILE:
              <span className="block my-2 text-white font-bold bg-[#111] border border-[#222] p-2 truncate">
                &ldquo;{voiceToDelete?.name.toUpperCase()}&rdquo;
              </span>
              WARNING: THIS ACTION CANNOT BE UNDONE. THE DATA SIGNATURE WILL BE
              PERMANENTLY DELETED FROM THE REGISTRY.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex sm:justify-end gap-2 border-t border-[#111] pt-3">
            <AlertDialogCancel className="rounded-none border-[#333] bg-[#111] hover:bg-[#222] text-[#888] hover:text-white font-mono text-xs uppercase tracking-widest h-10">
              ABORT PROTOCOL
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-none bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-widest h-10 border border-red-600"
            >
              PURGE DATA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
