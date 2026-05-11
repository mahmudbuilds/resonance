"use client";

import { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Mic,
  UploadCloud,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Sparkles,
  Waves,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

const LANG_CODES = [
  "EN_US", "ZH_CN", "KO_KR", "JA_JP", "RU_RU", "AUTO", 
  "IT_IT", "ES_ES", "PT_BR", "DE_DE", "FR_FR", "AR_SA", 
  "PL_PL", "NL_NL", "HI_IN", "HE_IL"
];

const RECORDING_SENTENCES = [
  "Custom (Read anything)",
  "Are you ready to save big? Get set for the sale of the century! Deals and discounts like never before! You won’t want to miss this.",
  "Every challenge we face is an opportunity in disguise. Wouldn’t you agree? So cheer up! It’ll all be okay.",
  "How have you been? It’s been way too long since we last caught up. By the way, I heard about your recent promotion. Congratulations! I’m so excited for you!",
  "The quick brown fox jumps over the lazy dog, a classic sentence that contains every letter of the English alphabet.",
  "We are thrilled to announce our latest product update, which brings a host of new features designed to make your workflow faster and more efficient."
];

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VoiceCloningPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedSentence, setSelectedSentence] = useState(RECORDING_SENTENCES[0]);
  
  // WaveSurfer refs
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(16, 185, 129, 0.4)',
      progressColor: 'rgba(16, 185, 129, 1)',
      cursorColor: 'rgba(16, 185, 129, 1)',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 80,
      normalize: true,
      cursorWidth: 2,
    });

    const record = ws.registerPlugin(RecordPlugin.create({
      scrollingWaveform: true,
      renderRecordedAudio: true,
    }));

    wavesurferRef.current = ws;
    recordPluginRef.current = record;

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));
    ws.on('timeupdate', (currentTime) => setCurrentTime(currentTime));
    ws.on('ready', (duration) => setDuration(duration));

    record.on('record-start', () => {
      setIsRecording(true);
      setIsPaused(false);
    });
    record.on('record-pause', () => setIsPaused(true));
    record.on('record-resume', () => setIsPaused(false));
    record.on('record-end', (blob: Blob) => {
      setIsRecording(false);
      setIsPaused(false);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    });
    record.on('record-progress', (time: number) => {
      setRecordTime(time / 1000);
    });

    return () => {
      ws.destroy();
    };
  }, []);

  useEffect(() => {
    if (audioUrl && wavesurferRef.current && !isRecording) {
      wavesurferRef.current.load(audioUrl);
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
      } catch (err) {
        console.error("Microphone access denied:", err);
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
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setRecordTime(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute top-[30%] left-[20%] h-[400px] w-[400px] rounded-full bg-emerald-500/10 opacity-30 blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 mx-auto max-w-[1200px] space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col space-y-4 mb-4 text-center items-center">
          <Badge variant="outline" className="w-fit bg-emerald-500/5 backdrop-blur-md border-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Volume2 className="w-3.5 h-3.5 mr-2" />
            Neural Voice Cloning
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Clone any <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Voice</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Create a perfect digital replica of a voice using just 30 seconds of high-quality audio. Ideal for podcast hosting, character consistency, or brand identity.
          </p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 w-full max-w-full pt-8">
          
          {/* Form & Upload/Record */}
          <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl flex flex-col group transition-all duration-500 w-full max-w-full min-w-0">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-xl">Clone Setup</CardTitle>
              <CardDescription>Provide details and audio for your voice clone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-2">
                <Label htmlFor="voiceName" className="font-semibold">Voice Name <span className="text-red-500">*</span></Label>
                <Input id="voiceName" placeholder="e.g. My Podcast Voice" className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-emerald-500/20" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desc" className="font-semibold">Description <span className="text-red-500">*</span></Label>
                <Textarea id="desc" placeholder="Notes about this clone's specific tone..." className="resize-none bg-background/50 border-border/50 h-24 rounded-xl focus-visible:ring-emerald-500/20 w-full max-w-full break-words" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="langCode" className="font-semibold">Language Code</Label>
                <Select defaultValue="EN_US">
                  <SelectTrigger id="langCode" className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-emerald-500/20">
                    <SelectValue placeholder="Select Language Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANG_CODES.map(code => (
                      <SelectItem key={code} value={code}>{code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="font-semibold">Tags</Label>
                <Input id="tags" placeholder="e.g. narration, friendly, energetic (comma separated)" className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-emerald-500/20" />
              </div>

              <div className="space-y-3 pt-2">
                <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); clearAudio(); }} className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="font-semibold flex items-center">
                      Training Audio <span className="text-red-500 ml-1">*</span>
                      <span className="text-xs text-muted-foreground rounded-full px-2 py-0.5 border border-border/50 bg-background/50 shrink-0 ml-2">10-15s max</span>
                    </Label>
                    <TabsList className="bg-muted/50 p-1 rounded-xl h-10 border border-border/50">
                      <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
                        <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Upload
                      </TabsTrigger>
                      <TabsTrigger value="record" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
                        <Mic className="w-3.5 h-3.5 mr-1.5" /> Record
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="upload" className="mt-0 outline-none">
                    {!audioUrl ? (
                      <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border/70 hover:border-emerald-500/50 bg-muted/10 hover:bg-emerald-500/5 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group/dropzone overflow-hidden min-h-[160px]"
                      >
                         <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center shadow-sm mb-4 border border-border/50 group-hover/dropzone:scale-110 transition-transform shrink-0">
                            <UploadCloud className="w-6 h-6 text-muted-foreground group-hover/dropzone:text-emerald-500 transition-colors" />
                         </div>
                         <p className="font-medium text-foreground mb-1 truncate max-w-full">Click to upload or drag & drop</p>
                         <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed break-words">MP3, WAV, ~10MB max.</p>
                         <input type="file" className="hidden" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} />
                      </div>
                    ) : null}
                  </TabsContent>

                  <TabsContent value="record" className="mt-0 outline-none space-y-4">
                    <div className="space-y-2 mb-4">
                      <Label className="font-semibold">Text to Read (English only)</Label>
                      <Select value={selectedSentence} onValueChange={setSelectedSentence}>
                        <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl">
                          <SelectValue placeholder="Select a sentence to read" />
                        </SelectTrigger>
                        <SelectContent>
                          {RECORDING_SENTENCES.map((sentence, i) => (
                            <SelectItem key={i} value={sentence}>
                              {i === 0 ? sentence : `Sentence ${i}: ${sentence.substring(0, 40)}...`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedSentence !== "Custom (Read anything)" && (
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-sm italic text-foreground mt-2">
                          "{selectedSentence}"
                        </div>
                      )}
                    </div>

                    {!audioUrl && !isRecording && (
                      <div className="border border-border/70 bg-muted/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px]">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 relative">
                           <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-70" style={{ animationDuration: '3s' }} />
                           <Button onClick={startRecording} size="icon" className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:scale-105 transition-transform z-10">
                             <Mic className="w-5 h-5" />
                           </Button>
                        </div>
                        <p className="font-medium text-foreground mb-1">Record from Microphone</p>
                        <p className="text-sm text-muted-foreground max-w-[250px]">Click the microphone to start recording your voice.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Audio Waveform Visualization */}
                <div className={`relative border border-border/50 bg-background/50 rounded-2xl p-4 overflow-hidden ${(audioUrl || isRecording) ? 'block' : 'hidden'}`}>
                  
                  {isRecording && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur border border-red-500/20 px-3 py-1 rounded-full shadow-sm">
                       <div className={`w-2 h-2 rounded-full bg-red-500 ${!isPaused ? 'animate-pulse' : ''}`} />
                       <span className="text-xs font-medium text-red-500">{formatTime(recordTime)}</span>
                       {isPaused && <span className="text-xs font-medium text-muted-foreground ml-1">(Paused)</span>}
                    </div>
                  )}

                  {!isRecording && audioUrl && (
                     <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-md border border-border/50">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                     </div>
                  )}

                  {/* WaveSurfer Container */}
                  <div ref={containerRef} className="w-full mt-8 mb-4 h-[80px]" />

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    {isRecording ? (
                      <div className="flex items-center gap-2 w-full justify-center">
                        <Button onClick={pauseRecording} variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 border-border/50 hover:bg-muted">
                           {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <Button onClick={stopRecording} variant="default" size="sm" className="rounded-full h-10 px-6 bg-red-500 hover:bg-red-600 text-white shadow-md">
                           <Square className="w-4 h-4 mr-2" /> Stop Recording
                        </Button>
                      </div>
                    ) : audioUrl ? (
                      <div className="flex items-center justify-between w-full">
                        <Button onClick={togglePlayback} variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 border-border/50 bg-background hover:bg-muted shadow-sm transition-transform hover:scale-105">
                          {isPlaying ? <Pause className="w-4 h-4 text-emerald-500" /> : <Play className="w-4 h-4 text-emerald-500 ml-1" />}
                        </Button>
                        <Button onClick={clearAudio} variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full h-8 px-3 text-xs">
                           <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Discard
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>

              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 bg-muted/10 p-6 mt-auto">
               <Button disabled={!audioUrl || isRecording} className="w-full text-base h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all overflow-hidden disabled:opacity-50 disabled:shadow-none">
                 <Sparkles className="w-5 h-5 mr-2 shrink-0" /> <span className="truncate">Start Cloning Process</span>
               </Button>
            </CardFooter>
          </Card>

           {/* Guidelines / Status side */}
          <div className="space-y-6 w-full max-w-full min-w-0">
            <Card className="border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-lg rounded-2xl p-4 sm:p-6 relative overflow-hidden w-full max-w-full min-w-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none" />
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-emerald-500">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> Best Practices
              </h3>
              <div className="space-y-6 w-full min-w-0">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">General Best Practices</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground/90">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Capture full expression:</strong> Cover the emotions you want. If flat, the clone will sound monotone.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Speak clearly:</strong> Pronounce carefully, avoid sighs/coughs, and don't pause unnaturally mid-recording.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Minimize noise:</strong> Record in a quiet environment, keep reasonable distance from mic to reduce echo and plosives.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Instant Voice Cloning</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground/90">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Keep clip short:</strong> 5-15s total length for enough context while keeping consistency.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>High-quality audio:</strong> At least 22 kHz sample rate and 16-bit depth.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Vary emotion:</strong> Combine short clips; use short pauses/crossfades to avoid abrupt cuts.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Normalize volume:</strong> Avoid clipping due to very high dB.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed"><strong>Avoid mid-word cuts:</strong> Don't use samples that break mid-word.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
            
            <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden w-full max-w-full opacity-50 pointer-events-none">
               <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
                 <CardTitle className="text-base font-semibold flex items-center gap-2">
                   <Waves className="w-4 h-4 text-foreground/50 shrink-0" /> Active Clones
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                  <Mic className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground truncate max-w-full">You haven't cloned any voices yet.</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Upload or record audio to begin.</p>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
