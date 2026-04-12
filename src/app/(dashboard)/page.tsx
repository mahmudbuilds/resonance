"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  AudioLines,
  ChevronRight,
  Mic2,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Volume2,
  Wand2,
  Activity,
  Globe,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { user, isLoaded } = useUser();
  const userFirstName = user?.firstName;

  const features = [
    {
      title: "Text to Speech",
      description:
        "Craft studio-quality voiceovers with emotional depth and natural inflection. Bring your scripts to life.",
      icon: AudioLines,
      href: "/text-to-speech",
      color: "text-blue-500",
      glow: "bg-blue-500/20",
    },
    {
      title: "Voice Library",
      description:
        "Explore hundreds of handcrafted voices spanning dozens of languages, accents, and unique personalities.",
      icon: Volume2,
      href: "/voices",
      color: "text-purple-500",
      glow: "bg-purple-500/20",
    },
    {
      title: "Voice Cloning",
      description:
        "Create an uncanny AI replica of any voice from a brief sample. Establish powerful brand consistency.",
      icon: Mic2,
      href: "/voice-cloning",
      color: "text-emerald-500",
      glow: "bg-emerald-500/20",
    },
  ];

  const showcaseVoices = [
    { name: "Marcus", gender: "Male", accent: "American", mood: "Authoritative", plays: "2.4M", avatar: "M" },
    { name: "Elara", gender: "Female", accent: "British", mood: "Warm", plays: "1.8M", avatar: "E" },
    { name: "Kai", gender: "Neutral", accent: "Australian", mood: "Casual", plays: "1.2M", avatar: "K" },
    { name: "Nadia", gender: "Female", accent: "Russian", mood: "Professional", plays: "980K", avatar: "N" },
    { name: "Theo", gender: "Male", accent: "French", mood: "Romantic", plays: "875K", avatar: "T" },
    { name: "Zara", gender: "Female", accent: "Nigerian", mood: "Energetic", plays: "762K", avatar: "Z" },
  ];

  const templates = [
    { title: "YouTube Script", voice: "Marcus", duration: "~5 min", desc: "Engaging video narration" },
    { title: "Podcast Intro", voice: "Elara", duration: "~30 sec", desc: "Hook your listeners" },
    { title: "E-learning Module", voice: "Kai", duration: "~10 min", desc: "Educational content" },
    { title: "Commercial", voice: "Nadia", duration: "~60 sec", desc: "High-conversion ads" },
  ];

  const stats = [
    { label: "Active Usage", value: "84%", change: "+12% this week" },
    { label: "Generations", value: "1.2k", change: "+8% this week" },
    { label: "Library Access", value: "140+", change: "New voices added" },
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 space-y-20 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col space-y-6">
          <Badge variant="outline" className="w-fit bg-background/50 backdrop-blur-md border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Vocal Synthesis Engine v2.0
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            {!isLoaded ? (
              <Spinner className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            ) : (
              <span className="block leading-[1.1]">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  {userFirstName || "Creator"}
                </span>
                .
                <br />
                <span className="text-muted-foreground/60 font-medium">
                  What will we build today?
                </span>
              </span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Harness the power of neural text-to-speech. Generate stunningly lifelike audio, 
            clone voices with surgical precision, and amplify your creative workflow.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight relative inline-block">
                Core Capabilities
                <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
              </h2>
            </div>
            <Link
              href="/text-to-speech"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
            >
              Start Creating 
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group outline-none">
                <Card className="relative h-full overflow-hidden border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${feature.glow}`} />
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500 shadow-sm relative overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-current ${feature.color}`} />
                        <feature.icon className={`w-5 h-5 ${feature.color} relative z-10`} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Dashboard Panels */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trending Voices */}
          <section className="col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight relative inline-block">
                Trending Voices
              </h2>
              <Link
                href="/voices"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
              >
                View Library <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <Card className="border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50">
                {showcaseVoices.map((voice) => (
                  <div
                    key={voice.name}
                    className="group bg-card/90 flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all duration-300">
                        <span className="font-semibold text-primary">{voice.avatar}</span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-primary flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 text-primary-foreground shadow-lg shadow-primary/30">
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                          {voice.name}
                        </p>
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Activity className="w-3 h-3" /> {voice.plays}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {voice.gender} • {voice.accent}
                      </p>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-muted/80 hover:bg-muted font-medium">
                          {voice.mood}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Quick Stats & Upgrades */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight relative inline-block">
              Activity Overview
            </h2>
            <div className="grid gap-4">
              {stats.map((stat, i) => (
                <Card key={stat.label} className="border border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5 relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-end h-full">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${i === 0 ? "text-emerald-500" : "text-primary"}`}>
                        {i !== 2 && <TrendingUp className="w-3.5 h-3.5" />}
                        {stat.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden mt-2 border-dashed">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mb-4">Unlock ultra-realistic models and 100+ exclusive voices.</p>
                  <Button variant="default" className="w-full shadow-lg shadow-primary/20">
                    View Plans
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Global Languages Tooltip section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Global Reach</h2>
          </div>
          <Card className="border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm relative">
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card/80 to-transparent z-10 pointer-events-none" />
             <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card/80 to-transparent z-10 pointer-events-none" />
            <CardContent className="p-0">
              <div className="flex py-8">
                {/* Simulated CSS Marquee with Flex */}
                <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] gap-4 px-4 w-fit">
                  {[
                    "English (US, UK, AU)", "Spanish", "French", "German", "Italian", "Portuguese", 
                    "Japanese", "Korean", "Chinese", "Arabic", "Hindi", "Russian", "Dutch", 
                    "Polish", "Swedish", "Turkish", "Vietnamese", "Thai", "Indonesian", "Filipino"
                  ].map((lang) => (
                    <div
                      key={lang}
                      className="whitespace-nowrap px-6 py-3 rounded-2xl border border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 font-medium text-sm flex items-center cursor-default shadow-sm"
                    >
                      {lang}
                    </div>
                  ))}
                  {[
                    "English (US, UK, AU)", "Spanish", "French", "German", "Italian", "Portuguese", 
                    "Japanese", "Korean", "Chinese", "Arabic", "Hindi", "Russian", "Dutch", 
                    "Polish", "Swedish", "Turkish", "Vietnamese", "Thai", "Indonesian", "Filipino"
                  ].map((lang) => (
                    <div
                      key={`${lang}-dup`}
                      className="whitespace-nowrap px-6 py-3 rounded-2xl border border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 font-medium text-sm flex items-center cursor-default shadow-sm"
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Templates Section (Compact) */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-semibold tracking-tight">Ready-to-use Templates</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <Card
                key={template.title}
                className="group border border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col"
              >
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                      <Wand2 className="w-4 h-4 text-primary" />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs bg-background/50">{template.duration}</Badge>
                  </div>
                  <CardTitle className="text-base mb-2 group-hover:text-primary transition-colors">{template.title}</CardTitle>
                  <p className="text-xs text-muted-foreground flex-1 line-clamp-2 leading-relaxed">{template.desc}</p>
                  
                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                      <Volume2 className="w-3.5 h-3.5" />
                      {template.voice}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-transform text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
