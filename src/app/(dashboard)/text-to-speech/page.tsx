"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  AudioLines,
  Wand2,
  Settings2,
  Play,
  Pause,
  Loader2,
  Volume2,
  Clock,
  Download,
  MoreVertical,
  Type,
  Mic2,
  History,
  Thermometer,
  Gauge,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getFullLanguageName } from "@/lib/countryCodes";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "../../../../convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

export default function TextToSpeechPage() {
  const [selectedVoice, setSelectedVoice, mounted] = useLocalStorage<
  string | null
  >("selectedVoice", null);
  const [model, setModel, modelMounted] = useLocalStorage<string>(
    "model",
    "inworld-tts-1.5-mini",
  );
  const voices = useQuery(api.voice.getUserVoices)
  useEffect(() => {
    if (!mounted) return;
    const fetchVoices = async () => {
      if (!selectedVoice && voices?.[0]?.inworldVoiceId) {
        setSelectedVoice(voices?.[0]?.inworldVoiceId);
      }
    };
    fetchVoices();
  }, [mounted]);
  const [text, setText] = useState("");
  const [speakingRate, setSpeakingRate] = useState([1.0]);
  const [temperature, setTemperature] = useState([0.7]);
  const [playingId, setPlayingId] = useState<Id<"generations"> | null>(null);
  const [downloadingId, setDownloadingId] = useState<Id<"generations"> | null>(null);
  const [isSsml, setIsSsml] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
      loading: 'Generating speech...',
      success: 'Speech generated successfully!',
      error: 'Failed to generate speech'
    });

    try {
      await promise;
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }
  const isReady = mounted && !!voices
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 mx-auto max-w-[1400px]">
        {/* Header Section */}
        <header className="flex flex-col space-y-4 mb-10">
          <Badge
            variant="outline"
            className="w-fit bg-background/80 dark:bg-background/50 backdrop-blur-md border-primary/30 dark:border-primary/20 text-primary px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)] text-xs sm:text-sm"
          >
            <AudioLines className="w-3.5 h-3.5 mr-2 text-primary shrink-0" />
            <span className="truncate">Studio Generation</span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Text to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-emerald-500">
              Speech
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Transform text into lifelike speech with extreme precision. Select
            your voice, adjust the nuances, and synthesize instantly.
          </p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6 w-full max-w-full">
            <Card className="border border-border/30 bg-transparent backdrop-blur-2xl shadow-none overflow-hidden rounded-3xl flex flex-col group transition-all duration-500 w-full max-w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="pb-6 relative z-10">
                <CardTitle className="text-xl flex items-center justify-between gap-2 overflow-hidden font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                      <Mic2 className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <span className="truncate text-foreground">Configuration</span>
                  </div>
                </CardTitle>
                <CardDescription className="truncate text-sm mt-2 ml-1">
                  Fine-tune your synthetic voice parameters
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                    <AudioLines className="w-4 h-4 text-primary/70" />
                    Voice Identity
                  </Label>
                  <Select
                    value={isReady ? (selectedVoice ?? "") : ""}
                    onValueChange={(value) => setSelectedVoice(value)}
                    disabled={!isReady}
                  >
                    <SelectTrigger className="w-full min-w-0 bg-card/50 border-border/40 h-12 rounded-xl focus:ring-primary/20 hover:bg-card/80 transition-colors [&>span]:w-full [&>span]:min-w-0 shadow-sm">
                      <SelectValue placeholder={isReady ? "Select a voice" : "Loading voices..."} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-card/95 max-h-[300px] w-full min-w-[var(--radix-select-trigger-width)]">
                      {voices?.map((voice) => {
                        const isNew = Date.now() - voice._creationTime < 7 * 24 * 60 * 60 * 1000;
                        return (
                          <SelectItem key={voice.inworldVoiceId} value={voice.inworldVoiceId!} className="rounded-lg my-0.5 cursor-pointer w-full pr-8">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="font-medium truncate">{voice.displayName}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isNew && (
                                  <span className="text-[9px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm">New</span>
                                )}
                                {voice.langCode && (
                                  <span className="text-[9px] uppercase font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm border border-border/50">
                                    {getFullLanguageName(voice.langCode)}
                                  </span>
                                )}
                                {voice.tags?.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-[9px] capitalize font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                      <Sparkles className="w-4 h-4 text-purple-500/70" />
                      Model Version
                    </Label>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 font-medium text-[10px] rounded-full px-2">
                      v2.0 Turbo
                    </Badge>
                  </div>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value)}
                  >
                    <SelectTrigger className="w-full min-w-0 bg-card/50 border-border/40 h-12 rounded-xl focus:ring-purple-500/20 hover:bg-card/80 transition-colors [&>span]:truncate [&>span]:min-w-0 shadow-sm">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-card/95">
                    <SelectItem value="inworld-tts-2" className="rounded-lg cursor-pointer">
                    inworld-tts-2
                    </SelectItem>
                      <SelectItem value="inworld-tts-1.5-mini" className="rounded-lg cursor-pointer">inworld-tts-1.5-mini</SelectItem>
                      <SelectItem value="inworld-tts-1.5-max" className="rounded-lg cursor-pointer">inworld-tts-1.5-max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6 pt-6 border-t border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      <Settings2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <Label className="text-sm font-semibold text-foreground/80">
                      Generation Parameters
                    </Label>
                  </div>

                  <div className="space-y-4 bg-card/30 p-4 rounded-2xl border border-border/20 shadow-sm transition-all hover:bg-card/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-blue-500/70" /> Speaking Rate
                      </Label>
                      <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                        {speakingRate[0].toFixed(1)}x
                      </span>
                    </div>
                    <Slider
                      value={speakingRate}
                      onValueChange={setSpeakingRate}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      className="cursor-pointer py-1"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground/60 px-1">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-card/30 p-4 rounded-2xl border border-border/20 shadow-sm transition-all hover:bg-card/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500/70" /> Temperature
                      </Label>
                      <span className="text-xs font-mono font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                        {temperature[0].toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      min={0}
                      max={1}
                      step={0.05}
                      className="cursor-pointer py-1"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground/60 px-1">
                      <span>Focused</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Input area & Generations */}
          <div className="lg:col-span-8 flex flex-col space-y-6 w-full max-w-full">
            <Card className="flex flex-col border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 min-h-[450px] w-full max-w-full">
              <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between space-y-0 overflow-hidden gap-2 bg-muted/5">
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <Type className="w-5 h-5 text-muted-foreground shrink-0" />
                  <CardTitle className="text-lg truncate">
                    Script Editor
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="ssml" className="text-sm text-muted-foreground font-medium cursor-pointer hidden sm:block">SSML</Label>
                    <Switch id="ssml" checked={isSsml} onCheckedChange={setIsSsml} />
                  </div>
                  <div className="w-px h-6 bg-border/50 hidden sm:block" />
                  <Button variant="ghost" size="sm" onClick={() => setText("")} className="text-muted-foreground hover:text-foreground h-10 px-4 rounded-xl font-medium">Clear</Button>
                </div>
              </CardHeader>

              <div className={`flex-1 relative flex flex-col w-full max-w-full transition-colors duration-500 ${isSsml ? 'bg-[#0a0a0f]' : 'bg-transparent'}`}>
                {/* Editor Container */}
                <div className="flex-1 flex w-full h-full relative">
                  {/* Optional line numbers for SSML */}
                  {isSsml && (
                    <div className="hidden md:flex flex-col items-end py-8 px-4 bg-black/40 border-r border-white/5 w-12 text-xs font-mono text-white/20 select-none">
                      {Array.from({ length: Math.max(1, text.split('\n').length) }).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                  )}
                  <Textarea
                    placeholder={isSsml ? "<speak>\n  Enter SSML here...\n</speak>" : "Type or paste your script here..."}
                    className={`w-full h-full min-h-[350px] resize-none border-none shadow-none focus-visible:ring-0 leading-relaxed font-medium placeholder:text-muted-foreground/30 p-6 md:p-8 ${
                      isSsml 
                        ? "bg-transparent font-mono text-sm md:text-base text-emerald-400 placeholder:text-emerald-900/50 selection:bg-emerald-500/30" 
                        : "bg-transparent text-foreground text-base md:text-lg"
                    }`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={5000}
                    spellCheck={!isSsml}
                  />
                  {isSsml && (
                    <div className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-wider text-emerald-500/30 select-none pointer-events-none">
                      SSML Mode Active
                    </div>
                  )}
                </div>
              </div>

              <CardFooter className="border-t border-border/50 pt-4 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-mono text-muted-foreground">
                    <span className={text.length > 4500 ? "text-destructive" : text.length > 0 ? "text-foreground" : ""}>
                      {text.length}
                    </span>{" "}
                    / 5000 chars
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />~{Math.ceil(text.length / 18)}s duration
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  
                  <Button onClick={handleGenerateSpeech} disabled={isGenerating || !text.trim()} className="rounded-xl flex-[2] sm:flex-none h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all px-4 disabled:opacity-50 disabled:shadow-none">
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Recent Generations List/Grid */}
            <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30 w-full max-w-full">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-full">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 truncate max-w-full">
                    <Volume2 className="w-4 h-4 text-primary" /> Recent Generations
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {!userGenerations || userGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-border/50 shadow-inner">
                      <History className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">No history yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                      Your generated audio clips will appear here. Try creating something using the script editor above.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {[...userGenerations].reverse().map((generation) => {
                      const date = new Date(generation._creationTime);
                      const isToday = new Date().toDateString() === date.toDateString();
                      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const dateString = isToday ? `Today, ${timeString}` : `${date.toLocaleDateString()}, ${timeString}`;
                      
                      const voice = voices?.find((v) => v.inworldVoiceId === generation.voiceId);
                      const voiceName = voice?.displayName || generation.voiceId || "Unknown Voice";

                      return (
                        <div key={generation._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-3 min-w-0 group/item">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <Button
                              size="icon"
                              className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all outline-none border border-primary/20"
                              onClick={() => {
                                const audio = document.getElementById(`audio-${generation._id}`) as HTMLAudioElement;
                                if (audio) {
                                  if (audio.paused) {
                                    document.querySelectorAll('audio').forEach(a => {
                                      if (a.id !== `audio-${generation._id}`) a.pause();
                                    });
                                    audio.play();
                                  } else {
                                    audio.pause();
                                  }
                                }
                              }}
                            >
                              {playingId === generation._id ? (
                                <Pause className="w-4 h-4" fill="currentColor" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                              )}
                            </Button>
                            <audio 
                              id={`audio-${generation._id}`} 
                              src={generation.audioUrl} 
                              className="hidden" 
                              onPlay={() => setPlayingId(generation._id)}
                              onPause={() => setPlayingId(current => current === generation._id ? null : current)}
                              onEnded={() => setPlayingId(current => current === generation._id ? null : current)}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <p className="text-sm font-medium truncate w-full pr-2 text-foreground">
                                {generation.prompt}
                              </p>
                              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="bg-background/80 border border-border/50 px-2 py-0.5 rounded-full font-medium shrink-0">
                                  {voiceName}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="shrink-0">{dateString}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                              disabled={downloadingId === generation._id || !generation.audioUrl}
                              onClick={async () => {
                                if (!generation.audioUrl) return;
                                try {
                                  setDownloadingId(generation._id);
                                  const response = await fetch(generation.audioUrl);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.style.display = 'none';
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
                              {downloadingId === generation._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32 rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-card/95">
                                <DropdownMenuItem 
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2 rounded-lg my-0.5 font-medium"
                                  onClick={async () => {
                                    try {
                                      await deleteGeneration({ generationId: generation._id });
                                      toast.success("Generation deleted");
                                    } catch (error) {
                                      toast.error("Failed to delete generation");
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
