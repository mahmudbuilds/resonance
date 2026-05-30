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
  Terminal
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
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
import { getFullLanguageName } from "@/lib/countryCodes";
import { api } from "../../../../convex/_generated/api";
import { Doc, type Id } from "../../../../convex/_generated/dataModel";

export default function TextToSpeechPage() {
  const [selectedVoice, setSelectedVoice, mounted] = useLocalStorage<
    string | null
  >("selectedVoice", null);
  const [model, setModel, modelMounted] = useLocalStorage<string>(
    "model",
    "inworld-tts-1.5-mini",
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };
  const isReady = mounted && !!voices;
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black text-white selection:bg-primary selection:text-black pb-20">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 responsive-container">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 border-b border-[#222] pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] border border-[#333] mb-6 sm:mb-8 font-mono text-[10px] sm:text-xs uppercase text-primary">
              <Terminal className="w-3 h-3" />
              Module: Speech Synthesis
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              TEXT_TO_<span className="text-primary">SPEECH</span>
            </h1>
          </div>
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#888] max-w-md uppercase leading-relaxed tracking-wider text-left md:text-right">
            Initialize parametric voice synthesis. Define text vectors and semantic weightings.
          </p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 w-full max-w-full">
            <div className="border border-[#222] bg-[#050505] p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary">
                Configuration
              </div>

              <div className="space-y-6 sm:space-y-8 mt-4">
                <div className="space-y-3">
                  <Label className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                    Voice Identity <span className="text-primary">*</span>
                  </Label>
                  <Select
                    value={isReady ? (selectedVoice ?? "") : ""}
                    onValueChange={(value) => setSelectedVoice(value)}
                    disabled={!isReady}
                  >
                    <SelectTrigger className="w-full bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono text-white uppercase text-sm">
                      <SelectValue
                        placeholder={
                          isReady ? "SELECT_VOICE" : "LOADING_VOICES..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white">
                      {voices?.map((voice) => {
                        const isNew =
                          Date.now() - voice._creationTime <
                          7 * 24 * 60 * 60 * 1000;
                        return (
                          <SelectItem
                            key={voice.inworldVoiceId}
                            value={voice.inworldVoiceId!}
                            className="rounded-none cursor-pointer w-full focus:bg-primary focus:text-black py-3 uppercase"
                          >
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="truncate">
                                {voice.displayName}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {isNew && (
                                  <span className="text-[10px] tracking-widest font-bold text-primary">
                                    [NEW]
                                  </span>
                                )}
                                {voice.langCode && (
                                  <span className="text-[10px] tracking-widest text-[#888]">
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                      Neural Model
                    </Label>
                    <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5">
                      V2.0
                    </span>
                  </div>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value)}
                  >
                    <SelectTrigger className="w-full bg-[#111] border-[#333] h-12 sm:h-14 rounded-none focus-visible:ring-primary focus-visible:border-primary font-mono text-white uppercase text-sm">
                      <SelectValue placeholder="SELECT_MODEL" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-[#333] rounded-none font-mono text-white uppercase">
                      <SelectItem
                        value="inworld-tts-2"
                        className="rounded-none cursor-pointer focus:bg-primary focus:text-black py-3"
                      >
                        inworld-tts-2
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-mini"
                        className="rounded-none cursor-pointer focus:bg-primary focus:text-black py-3"
                      >
                        inworld-tts-1.5-mini
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-max"
                        className="rounded-none cursor-pointer focus:bg-primary focus:text-black py-3"
                      >
                        inworld-tts-1.5-max
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-[#333]">
                  <Label className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888]">
                    Tuning Parameters
                  </Label>

                  <div className="space-y-4 bg-[#111] border border-[#333] p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-[10px] sm:text-xs text-white uppercase tracking-widest">
                        Rate
                      </Label>
                      <span className="font-mono text-xs text-primary">
                        {speakingRate[0].toFixed(1)}X
                      </span>
                    </div>
                    <Slider
                      value={speakingRate}
                      onValueChange={setSpeakingRate}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4 bg-[#111] border border-[#333] p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-[10px] sm:text-xs text-white uppercase tracking-widest">
                        Temperature
                      </Label>
                      <span className="font-mono text-xs text-primary">
                        {temperature[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      min={0}
                      max={1}
                      step={0.05}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Input area & Generations */}
          <div className="lg:col-span-8 flex flex-col space-y-6 sm:space-y-8 w-full max-w-full">
            <div className="flex flex-col border border-[#222] bg-[#050505] min-h-[400px] sm:min-h-[500px] w-full max-w-full focus-within:border-primary transition-colors relative">
              <div className="absolute top-0 right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-black font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border-b border-l border-primary z-10">
                Script Editor
              </div>

              <div className="border-b border-[#222] p-4 sm:p-6 flex flex-row items-center justify-between bg-[#0a0a0a]">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Label
                      htmlFor="ssml"
                      className="font-mono text-[10px] sm:text-xs text-white uppercase tracking-widest cursor-pointer"
                    >
                      SSML
                    </Label>
                    <Switch
                      id="ssml"
                      checked={isSsml}
                      onCheckedChange={setIsSsml}
                      className="data-[state=checked]:bg-primary scale-75 sm:scale-100"
                    />
                  </div>
                  <div className="w-px h-6 bg-[#333] hidden xs:block" />
                  <Button
                    variant="ghost"
                    onClick={() => setText("")}
                    className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#888] hover:text-white rounded-none h-8 px-0"
                  >
                    Clear Buffer
                  </Button>
                </div>
              </div>

              <div className={`flex-1 relative flex flex-col w-full max-w-full transition-colors duration-500`}>
                <div className="flex-1 flex w-full h-full relative items-stretch">
                  {isSsml && (
                    <div
                      ref={lineNumbersRef}
                      className="flex flex-col items-end pt-6 sm:pt-8 pb-6 sm:pb-8 pl-3 pr-2 border-r border-[#222] w-12 sm:w-16 font-mono text-base sm:text-lg lg:text-xl text-[#444] select-none bg-[#0a0a0a] text-right overflow-hidden h-full pointer-events-none"
                    >
                      {Array.from({
                        length: Math.max(1, text.split("\n").length),
                      }).map((_, i) => (
                        <div
                          key={i}
                          style={{ height: "32px", lineHeight: "32px" }}
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
                        ? "<speak>\n  INITIALIZE SSML SEQUENCE...\n</speak>"
                        : "INPUT NEURAL SCRIPT HERE..."
                    }
                    wrap={isSsml ? "off" : "soft"}
                    onScroll={(e) => {
                      if (isSsml && lineNumbersRef.current) {
                        lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
                      }
                    }}
                    style={isSsml ? { lineHeight: "32px" } : undefined}
                    className={`w-full h-full min-h-[300px] sm:min-h-[350px] resize-none border-none shadow-none focus-visible:ring-0 rounded-none focus:outline-none focus-visible:ring-offset-0 ${
                      isSsml
                        ? "pt-6 sm:pt-8 pb-6 sm:pb-8 pl-4 sm:pl-6 pr-6 sm:pr-8 bg-[#050505] font-mono text-base sm:text-lg lg:text-xl text-primary placeholder:text-primary/30 selection:bg-primary/20 overflow-x-auto"
                        : "p-6 sm:p-8 bg-[#050505] font-sans text-xl sm:text-2xl lg:text-3xl text-white placeholder:text-[#444] selection:bg-[#222] overflow-x-hidden"
                    }`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={5000}
                    spellCheck={!isSsml}
                  />
                </div>
              </div>

              <div className="border-t border-[#222] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-[#0a0a0a]">
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="font-mono text-[10px] sm:text-xs text-[#888] uppercase tracking-widest">
                    <span className={text.length > 4500 ? "text-red-500" : "text-white"}>
                      {text.length}
                    </span> / 5000
                  </span>
                  <div className="hidden xs:flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#888] uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    EST: {Math.ceil(text.length / 18)}s
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Button
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating || !text.trim()}
                    className="rounded-none h-12 sm:h-14 w-full sm:w-auto px-8 sm:px-10 bg-primary hover:bg-white text-black font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors border border-primary disabled:opacity-30 disabled:hover:bg-primary"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-3" />
                    )}
                    {isGenerating ? "PROCESSING..." : "SYNTHESIZE"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Generations List/Grid */}
            <div className="border border-[#222] bg-[#050505] w-full max-w-full">
              <div className="p-6 border-b border-[#222] bg-[#0a0a0a]">
                <h3 className="font-mono text-sm uppercase tracking-widest text-white flex items-center gap-3">
                  <History className="w-4 h-4 text-primary" /> Audio Log
                </h3>
              </div>
              
              <div className="p-0">
                {!userGenerations || userGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <Terminal className="w-8 h-8 text-[#444] mb-4" />
                    <p className="font-mono text-xs text-[#666] uppercase tracking-widest">REGISTRY_EMPTY</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#222] max-h-[400px] overflow-y-auto">
                    {[...userGenerations].reverse().map((generation) => {
                      const date = new Date(generation._creationTime);
                      const isToday = new Date().toDateString() === date.toDateString();
                      const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const dateString = isToday ? `TODAY ${timeString}` : `${date.toLocaleDateString()} ${timeString}`;

                      const voice = voices?.find((v) => v.inworldVoiceId === generation.inworldVoiceId);
                      const voiceName = voice?.displayName || generation.inworldVoiceId || "UNKNOWN";

                      return (
                        <div key={generation._id} className="p-6 flex items-center justify-between hover:bg-[#111] transition-colors gap-4 group/item">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <Button
                              className={`h-12 w-12 shrink-0 rounded-none border transition-colors ${playingId === generation._id ? "bg-primary text-black border-primary" : "bg-[#111] text-white border-[#333] group-hover/item:border-primary group-hover/item:text-primary"}`}
                              onClick={() => {
                                const audio = document.getElementById(`audio-${generation._id}`) as HTMLAudioElement;
                                if (audio) {
                                  if (audio.paused) {
                                    document.querySelectorAll("audio").forEach((a) => {
                                      if (a.id !== `audio-${generation._id}`) a.pause();
                                    });
                                    audio.play();
                                  } else {
                                    audio.pause();
                                  }
                                }
                              }}
                            >
                              {playingId === generation._id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </Button>
                            <audio
                              id={`audio-${generation._id}`}
                              src={generation.audioUrl}
                              className="hidden"
                              onPlay={() => setPlayingId(generation._id)}
                              onPause={() => setPlayingId((current) => current === generation._id ? null : current)}
                              onEnded={() => setPlayingId((current) => current === generation._id ? null : current)}
                            />
                            <div className="flex flex-col min-w-0 flex-1 gap-2">
                              <p className="font-sans text-sm text-white truncate w-full">
                                {generation.prompt}
                              </p>
                              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#888]">
                                <span className="text-primary border border-primary/20 bg-primary/10 px-2 py-0.5">
                                  {voiceName}
                                </span>
                                <span>{dateString}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              className="h-10 w-10 rounded-none bg-[#111] border border-[#333] hover:border-primary hover:text-primary text-[#888]"
                              disabled={downloadingId === generation._id || !generation.audioUrl}
                              onClick={async () => {
                                if (!generation.audioUrl) return;
                                try {
                                  setDownloadingId(generation._id);
                                  const response = await fetch(generation.audioUrl);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.style.display = "none";
                                  a.href = url;
                                  a.download = `voice-${generation._id}.mp3`;
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                } catch (error) {
                                  console.error("Download failed:", error);
                                } finally {
                                  setDownloadingId(null);
                                }
                              }}
                            >
                              {downloadingId === generation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-none bg-[#111] border border-[#333] hover:border-primary hover:text-primary text-[#888]">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 rounded-none border-[#333] bg-[#050505] p-2">
                                <DropdownMenuItem
                                  className="text-red-500 hover:bg-red-500/10 cursor-pointer rounded-none font-mono text-xs uppercase tracking-widest p-3"
                                  onClick={async () => {
                                    try {
                                      await deleteGeneration({ generationId: generation._id });
                                      toast.success("Generation deleted");
                                    } catch (error) {
                                      toast.error("Failed to delete generation");
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-3" /> Delete
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
