"use client";

import { useState } from "react";
import {
  AudioLines,
  Wand2,
  Settings2,
  Play,
  Volume2,
  Clock,
  Download,
  MoreVertical,
  Type,
  Mic2,
  History,
} from "lucide-react";
import { useQuery, useAction } from "convex/react";
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
import type { VoiceInfo } from "@inworld/tts";
import { useEffect } from "react";

export default function TextToSpeechPage() {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [model, setModel] = useState<string | null> (null);
  const voicesAction = useAction(api.inworld.listVoices);
  const [voices, setVoices] = useState<VoiceInfo[] | null>(null);
  useEffect(() => {
    const fetchVoices = async () => {
      const voices = await voicesAction();
      setVoices(voices);
    }
    fetchVoices();
  }, [])
  const [text, setText] = useState("");
  const [stability, setStability] = useState([50]);
  const [similarity, setSimilarity] = useState([75]);
  const [styleExag, setStyleExag] = useState([0]);

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
            className="w-fit bg-background/80 dark:bg-background/50 backdrop-blur-md border-primary/30 dark:border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)]"
          >
            <AudioLines className="w-3.5 h-3.5 mr-2 text-primary" />
            Studio Generation
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Text to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-emerald-500">
              Speech
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Transform text into lifelike speech with extreme precision. Select
            your voice, adjust the nuances, and synthesize instantly.
          </p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6 w-full max-w-full">
            <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl flex flex-col group transition-all duration-500 hover:border-primary/30 w-full max-w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center justify-between gap-2 overflow-hidden">
                  <span className="truncate">Voice Configuration</span>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic2 className="w-4 h-4 text-primary shrink-0" />
                  </div>
                </CardTitle>
                <CardDescription className="truncate">
                  Select and fine-tune your vocal model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center justify-between">
                    Synthetic Voice
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  </Label>
                  <Select defaultValue="Alex" onValueChange={(value) => setSelectedVoice(value)}>
                    <SelectTrigger className="w-full min-w-0 bg-background/50 border-border/50 h-12 rounded-xl focus:ring-primary/20 [&>span]:truncate [&>span]:min-w-0">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices ? (
                        voices.map((voice) => (
                          <SelectItem key={voice.voiceId} value={voice.voiceId} >
                            {voice.displayName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading">
                          Loading voices...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Model Version
                    </Label>
                    <Badge
                      variant="secondary"
                      className="bg-muted hover:bg-muted font-medium text-[10px]"
                    >
                      v2.0 Turbo
                    </Badge>
                  </div>
                  <Select defaultValue="inworld-tts-1.5-mini" onValueChange={(value) => {setModel(value)}}>
                    <SelectTrigger className="w-full min-w-0 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 [&>span]:truncate [&>span]:min-w-0">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inworld-tts-1.5-mini">
                        inworld-tts-1.5-mini
                      </SelectItem>
                      <SelectItem value="inworld-tts-1.5-max">
                        inworld-tts-1.5-max
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-5 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">
                      Voice Settings
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Stability
                      </Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {stability[0]}%
                      </span>
                    </div>
                    <Slider
                      value={stability}
                      onValueChange={setStability}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground/70 text-right">
                      More variable vs. More stable
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Clarity + Similarity
                      </Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {similarity[0]}%
                      </span>
                    </div>
                    <Slider
                      value={similarity}
                      onValueChange={setSimilarity}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                    <p className="text-[10px] text-muted-foreground/70 text-right">
                      Low (artifacts) vs. High (clone exact)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Style Exaggeration
                      </Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {styleExag[0]}%
                      </span>
                    </div>
                    <Slider
                      value={styleExag}
                      onValueChange={setStyleExag}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Input area */}
          <div className="lg:col-span-8 flex flex-col space-y-6 w-full max-w-full">
            <Card className="flex flex-col border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30 min-h-[450px] w-full max-w-full">
              <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between space-y-0 overflow-hidden gap-2">
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <Type className="w-5 h-5 text-muted-foreground shrink-0" />
                  <CardTitle className="text-lg truncate">
                    Script Editor
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="ssml"
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors hidden sm:block"
                    >
                      SSML support
                    </Label>
                    <Switch id="ssml" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg bg-background/50 border-border/50 px-2 sm:px-3"
                    onClick={() => setText("")}
                  >
                    <span className="hidden sm:inline">Clear</span>
                    <span className="sm:hidden">X</span>
                  </Button>
                </div>
              </CardHeader>

              <div className="flex-1 flex flex-col relative p-4 w-full max-w-full overflow-hidden">
                <Textarea
                  placeholder="Enter the text you want to bring to life. Try adding some feeling or specific punctuation..."
                  className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base md:text-lg leading-relaxed p-2 w-full max-w-full break-words overflow-y-scroll rows-10"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={5000}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-500 hidden sm:block">
                  <AudioLines className="w-48 h-48" />
                </div>
              </div>

              <CardFooter className="border-t border-border/50 pt-4 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-mono text-muted-foreground">
                    <span
                      className={
                        text.length > 4500
                          ? "text-destructive"
                          : text.length > 0
                            ? "text-foreground"
                            : ""
                      }
                    >
                      {text.length}
                    </span>{" "}
                    / 5000 chars
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />~
                    {Math.ceil(text.length / 18)}s duration
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="rounded-xl flex-1 sm:flex-none h-10 hover:bg-secondary/80 text-secondary-foreground shadow-sm px-3"
                  >
                    <History className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  <Button className="rounded-xl flex-[2] sm:flex-none h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all px-4">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Recent Generations / Playback */}
            <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl group transition-all duration-500 hover:border-primary/30 w-full max-w-full">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-full">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 truncate max-w-full">
                    <Volume2 className="w-4 h-4 text-primary" /> Recent
                    Generations
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {/* Mock Item */}
                  <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-2 min-w-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Button
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all outline-none border border-primary/20"
                      >
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </Button>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-medium truncate w-full pr-2 text-foreground">
                          Welcome to the future of voice generation. This is an
                          incredible snippet that sounds very realistic.
                        </p>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="bg-background/80 border border-border/50 px-2 py-0.5 rounded-full font-medium shrink-0">
                            Marcus
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="shrink-0">4 seconds</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="shrink-0">Today, 2:41 PM</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Mock Item 2 */}
                  <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-2 min-w-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Button
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all outline-none border border-primary/20"
                      >
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </Button>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-medium truncate w-full pr-2 text-foreground">
                          Generate stunningly lifelike audio instantly.
                        </p>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="bg-background/80 border border-border/50 px-2 py-0.5 rounded-full font-medium shrink-0">
                            Elara
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="shrink-0">2 seconds</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="shrink-0">Yesterday, 11:20 AM</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
