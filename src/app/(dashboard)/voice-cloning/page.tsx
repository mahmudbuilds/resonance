"use client";

import {
  Volume2,
  Mic,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Play,
  Settings2,
  Sparkles,
  Waves
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

export default function VoiceCloningPage() {
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
          
          {/* Form & Upload */}
          <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-2xl flex flex-col group transition-all duration-500 w-full max-w-full min-w-0">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-xl">Clone Setup</CardTitle>
              <CardDescription>Provide details and upload source audio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-2">
                <Label htmlFor="voiceName" className="font-semibold">Voice Name</Label>
                <Input id="voiceName" placeholder="e.g. My Podcast Voice" className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-emerald-500/20" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desc" className="font-semibold">Description <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
                <Textarea id="desc" placeholder="Notes about this clone's specific tone..." className="resize-none bg-background/50 border-border/50 h-24 rounded-xl focus-visible:ring-emerald-500/20 w-full max-w-full break-words" />
              </div>

              <div className="space-y-3 pt-2">
                <Label className="font-semibold flex items-center justify-between">
                   Training Audio
                   <span className="text-xs text-muted-foreground rounded-full px-2 py-0.5 border border-border/50 bg-background/50 shrink-0 ml-2">MP3, WAV, ~10MB</span>
                </Label>
                
                <div className="border-2 border-dashed border-border/70 hover:border-emerald-500/50 bg-muted/10 hover:bg-emerald-500/5 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group/dropzone overflow-hidden">
                   <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm mb-4 border border-border/50 group-hover/dropzone:scale-110 transition-transform shrink-0">
                      <UploadCloud className="w-8 h-8 text-muted-foreground group-hover/dropzone:text-emerald-500 transition-colors" />
                   </div>
                   <p className="font-medium text-foreground mb-1 truncate max-w-full">Click to upload or drag & drop</p>
                   <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed break-words">Upload at least 30 seconds of clean audio. The less background noise, the better.</p>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-border/50 bg-muted/10 p-6">
               <Button className="w-full text-base h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all overflow-hidden">
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
              <ul className="space-y-4 text-sm text-muted-foreground/90 w-full min-w-0">
                <li className="flex items-start gap-3 w-full min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="flex-1 min-w-0 break-words leading-relaxed"><strong>Audio Quality:</strong> Use raw, uncompressed files (WAV) if possible. Avoid audio with heavy echo, reverb, or background music.</span>
                </li>
                <li className="flex items-start gap-3 w-full min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="flex-1 min-w-0 break-words leading-relaxed"><strong>Length:</strong> 1 to 3 minutes of speaking is the sweet spot. Returns diminish after 5 minutes of input.</span>
                </li>
                <li className="flex items-start gap-3 w-full min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="flex-1 min-w-0 break-words leading-relaxed"><strong>Tone:</strong> Speak exactly how you want the clone to sound. Do not mix energetic talking with whispering in the same sample.</span>
                </li>
              </ul>
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
                  <p className="text-xs text-muted-foreground/70 mt-1">Upload audio to begin.</p>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
