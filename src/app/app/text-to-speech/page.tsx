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
    <div className="min-h-screen relative w-full overflow-hidden bg-zinc-950 text-zinc-50 font-sans pb-20">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 responsive-container max-w-7xl mx-auto px-4 pt-12">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900">
          <div className="space-y-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-zinc-900 border-zinc-800 text-zinc-400 font-medium text-xs rounded-full">
              <AudioLines className="w-3.5 h-3.5 text-primary" />
              Speech Synthesis
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Text to <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Speech</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Convert your written text into high-quality, natural-sounding audio script. Refine vocal vectors and tuning rules with advanced neural models.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6 w-full">
            <div className="border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md rounded-xl p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/60">
                <Settings2 className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">Voice Configuration</h2>
              </div>

              <div className="space-y-6">
                {/* Voice Identity Input Group */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-400">
                    Voice Profile <span className="text-primary">*</span>
                  </Label>
                  <Select
                    value={isReady ? (selectedVoice ?? "") : ""}
                    onValueChange={(value) => setSelectedVoice(value)}
                    disabled={!isReady}
                  >
                    <SelectTrigger className="w-full bg-zinc-950/60 border-zinc-800 h-11 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-zinc-200 text-sm px-3.5 transition-all">
                      <SelectValue
                        placeholder={
                          isReady ? "Select a voice profile..." : "Loading system voices..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-lg text-zinc-200 p-1">
                      {voices?.map((voice) => {
                        const isNew =
                          Date.now() - voice._creationTime <
                          7 * 24 * 60 * 60 * 1000;
                        return (
                          <SelectItem
                            key={voice.inworldVoiceId}
                            value={voice.inworldVoiceId!}
                            className="rounded-md cursor-pointer w-full focus:bg-zinc-800 focus:text-white px-3 py-2.5 transition-colors"
                          >
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="truncate font-medium">
                                {voice.displayName}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isNew && (
                                  <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-none font-semibold uppercase rounded">
                                    New
                                  </Badge>
                                )}
                                {voice.langCode && (
                                  <span className="text-xs text-zinc-500 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/40">
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
                    <Label className="text-xs font-medium text-zinc-400">
                      Neural Model
                    </Label>
                    <Badge variant="outline" className="text-[10px] text-primary bg-primary/5 border-primary/20 px-2 py-0">
                      v2.0 Adaptive
                    </Badge>
                  </div>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value)}
                  >
                    <SelectTrigger className="w-full bg-zinc-950/60 border-zinc-800 h-11 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-zinc-200 text-sm px-3.5 transition-all">
                      <SelectValue placeholder="Select model..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-lg text-zinc-200 p-1">
                      <SelectItem
                        value="inworld-tts-2"
                        className="rounded-md cursor-pointer focus:bg-zinc-800 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-2
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-mini"
                        className="rounded-md cursor-pointer focus:bg-zinc-800 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-1.5-mini
                      </SelectItem>
                      <SelectItem
                        value="inworld-tts-1.5-max"
                        className="rounded-md cursor-pointer focus:bg-zinc-800 focus:text-white px-3 py-2.5"
                      >
                        inworld-tts-1.5-max
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuning sliders */}
                <div className="space-y-5 pt-5 border-t border-zinc-800/60">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wide block">
                    Vocal Parameters
                  </Label>

                  <div className="space-y-3 bg-zinc-950/40 border border-zinc-800/60 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                        <Gauge className="w-3.5 h-3.5 text-zinc-400" />
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

                  <div className="space-y-3 bg-zinc-950/40 border border-zinc-800/60 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                        <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
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
          <div className="lg:col-span-8 flex flex-col space-y-6 w-full">
            <div className="flex flex-col border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md min-h-[420px] sm:min-h-[480px] w-full rounded-xl focus-within:border-zinc-700/80 shadow-xl shadow-black/20 transition-all overflow-hidden relative">
              <div className="border-b border-zinc-800/60 p-4 flex flex-row items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-200">Script Editor</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="ssml"
                      className="text-xs font-medium text-zinc-400 cursor-pointer select-none"
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
                  <div className="w-px h-4 bg-zinc-800" />
                  <Button
                    variant="ghost"
                    onClick={() => setText("")}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-200 h-8 px-2.5 rounded-md hover:bg-zinc-800/50"
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
                      className="flex flex-col items-end pt-5 pb-5 pl-3 pr-2 border-r border-zinc-900 w-12 sm:w-14 font-mono text-sm text-zinc-600 select-none bg-zinc-950/30 text-right overflow-hidden h-full pointer-events-none"
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
                        lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
                      }
                    }}
                    style={isSsml ? { lineHeight: "28px" } : undefined}
                    className={`w-full h-full min-h-[300px] resize-none border-none shadow-none focus-visible:ring-0 rounded-none focus:outline-none focus-visible:ring-offset-0 bg-transparent text-zinc-100 placeholder:text-zinc-500 overflow-y-auto ${
                      isSsml
                        ? "pt-5 pb-5 px-4 font-mono text-sm text-primary selection:bg-primary/20 overflow-x-auto"
                        : "p-5 font-sans text-base sm:text-lg selection:bg-zinc-800 overflow-x-hidden"
                    }`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={5000}
                    spellCheck={!isSsml}
                  />
                </div>
              </div>

              <div className="border-t border-zinc-800/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/40">
                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-medium text-zinc-400">
                    <span className={text.length > 4500 ? "text-rose-500 font-semibold" : "text-zinc-200 font-mono"}>
                      {text.length.toLocaleString()}
                    </span>
                    <span className="text-zinc-600"> / </span>5,000 chars
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Est. Duration: <span className="font-mono text-zinc-200">{Math.ceil(text.length / 18)}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating || !text.trim()}
                    className="shadow-md shadow-primary/10 rounded-lg h-11 w-full sm:w-auto px-6 bg-primary hover:bg-primary/90 text-zinc-950 font-medium text-sm transition-all border border-primary/20 disabled:opacity-40"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? "Synthesizing..." : "Generate Speech"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Generations List / Audio Log */}
            <div className="border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md rounded-xl shadow-xl shadow-black/20 overflow-hidden w-full">
              <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/40 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-400" /> Generation History
                </h3>
              </div>
              
              <div className="p-0">
                {!userGenerations || userGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="p-3 bg-zinc-950/60 rounded-full border border-zinc-800/60 mb-3">
                      <Mic2 className="w-5 h-5 text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium text-zinc-400">No audio generations yet</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">Synthesize text above to begin building your audio catalog.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800/50 max-h-[400px] overflow-y-auto">
                    {[...userGenerations].reverse().map((generation) => {
                      const date = new Date(generation._creationTime);
                      const isToday = new Date().toDateString() === date.toDateString();
                      const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const dateString = isToday ? `Today, ${timeString}` : `${date.toLocaleDateString()} at ${timeString}`;

                      const voice = voices?.find((v) => v.inworldVoiceId === generation.inworldVoiceId);
                      const voiceName = voice?.displayName || generation.inworldVoiceId || "System Voice";

                      return (
                        <div key={generation._id} className="p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors gap-4 group">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-10 w-10 shrink-0 rounded-full transition-all border shadow-sm ${
                                playingId === generation._id 
                                  ? "bg-primary text-zinc-950 border-primary hover:bg-primary/90 hover:text-zinc-950" 
                                  : "bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-primary/50 hover:text-primary"
                              }`}
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
                              {playingId === generation._id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </Button>
                            <audio
                              id={`audio-${generation._id}`}
                              src={generation.audioUrl}
                              className="hidden"
                              onPlay={() => setPlayingId(generation._id)}
                              onPause={() => setPlayingId((current) => current === generation._id ? null : current)}
                              onEnded={() => setPlayingId((current) => current === generation._id ? null : current)}
                            />
                            <div className="flex flex-col min-w-0 flex-1 gap-1">
                              <p className="text-sm font-medium text-zinc-200 truncate pr-2">
                                {generation.prompt}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Badge className="text-[10px] font-medium bg-zinc-950 text-zinc-300 hover:bg-zinc-950 border border-zinc-800 px-1.5 py-0 rounded">
                                  {voiceName}
                                </Badge>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-500 text-[11px]">{dateString}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-lg bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 shadow-sm"
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
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 shadow-sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36 rounded-lg border-zinc-800 bg-zinc-900 p-1 shadow-lg">
                                <DropdownMenuItem
                                  className="text-rose-400 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer rounded-md text-xs font-medium px-3 py-2"
                                  onClick={async () => {
                                    try {
                                      await deleteGeneration({ generationId: generation._id });
                                      toast.success("Generation removed from log");
                                    } catch (error) {
                                      toast.error("Failed to delete generation");
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Audio
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