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

export default function Home() {
  const { user } = useUser();
  const userFirstName = user?.firstName;

  const features = [
    {
      title: "Text to Speech",
      description:
        "Transform written words into studio-quality voiceovers with emotional depth and natural inflection",
      icon: AudioLines,
      href: "/text-to-speech",
      gradient: "from-primary via-primary/80 to-primary/60",
      stats: "50M+ characters generated",
    },
    {
      title: "Voice Library",
      description:
        "Explore hundreds of handcrafted voices spanning dozens of languages, accents, and personalities",
      icon: Volume2,
      href: "/voices",
      gradient: "from-primary/90 via-primary/70 to-primary/50",
      stats: "400+ premium voices",
    },
    {
      title: "Voice Cloning",
      description:
        "Create an AI replica of any voice from a brief sample. Perfect for brand consistency",
      icon: Mic2,
      href: "/voice-cloning",
      gradient: "from-primary/80 via-primary/60 to-primary/40",
      stats: "Clone in 30 seconds",
    },
  ];

  const showcaseVoices = [
    {
      name: "Marcus",
      gender: "Male",
      accent: "American",
      mood: "Authoritative",
      plays: "2.4M",
    },
    {
      name: "Elara",
      gender: "Female",
      accent: "British",
      mood: "Warm",
      plays: "1.8M",
    },
    {
      name: "Kai",
      gender: "Neutral",
      accent: "Australian",
      mood: "Casual",
      plays: "1.2M",
    },
    {
      name: "Nadia",
      gender: "Female",
      accent: "Russian",
      mood: "Professional",
      plays: "980K",
    },
    {
      name: "Theo",
      gender: "Male",
      accent: "French",
      mood: "Romantic",
      plays: "875K",
    },
    {
      name: "Zara",
      gender: "Female",
      accent: "Nigerian",
      mood: "Energetic",
      plays: "762K",
    },
  ];

  const templates = [
    {
      title: "YouTube Script",
      voice: "Marcus",
      duration: "~5 min",
      desc: "Engaging video narration",
    },
    {
      title: "Podcast Intro",
      voice: "Elara",
      duration: "~30 sec",
      desc: "Hook your listeners",
    },
    {
      title: "E-learning Module",
      voice: "Kai",
      duration: "~10 min",
      desc: "Educational content",
    },
    {
      title: "Commercial",
      voice: "Nadia",
      duration: "~60 sec",
      desc: "High-conversion ads",
    },
  ];

  const stats = [
    { label: "Active Users", value: "50K+", change: "+12% this month" },
    { label: "Voices Generated", value: "12M+", change: "+8% this month" },
    { label: "Languages", value: "140+", change: "New: Yoruba, Igbo" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/10,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,var(--primary)/5,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_80%,var(--primary)/5,transparent)]" />
      </div>

      <div className="px-6 lg:px-12 py-12 space-y-20">
        <header className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -top-12 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-8 -right-4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

            <div className="relative">
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-primary/70 mb-4">
                {userFirstName ? "Welcome back" : "Loading..."}
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                {userFirstName ? (
                  <>
                    Hello, {userFirstName}.<br />
                    <span className="text-muted-foreground font-normal">
                      What shall we create today?
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    <Spinner />
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                Transform your content with lifelike AI voices. Generate, clone,
                and deploy professional voiceovers in minutes.
              </p>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Create</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Choose how you want to get started
              </p>
            </div>
            <Link
              href="/text-to-speech"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              View all templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="group relative overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 border-0 bg-gradient-to-b from-background to-background/80">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-background to-background/80 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      >
                        <feature.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground/80 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardTitle className="mb-2 group-hover:text-primary-foreground transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="group-hover:text-primary-foreground/70 transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                    <p className="text-xs font-medium text-muted-foreground/60 mt-4 group-hover:text-primary-foreground/60 transition-colors duration-300">
                      {feature.stats}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Trending Voices
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Most popular voices this week
              </p>
            </div>
            <Link
              href="/voices"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Explore all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Card className="overflow-hidden border-0 shadow-xl shadow-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {showcaseVoices.map((voice) => (
                <div
                  key={voice.name}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Play
                          className="w-3 h-3 text-primary-foreground ml-0.5"
                          fill="currentColor"
                        />
                      </div>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {voice.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {voice.gender} · {voice.accent}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {voice.mood}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{voice.plays}</p>
                    <p className="text-xs text-muted-foreground">plays</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="relative overflow-hidden border-0 shadow-lg shadow-black/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <CardContent className="relative z-10 p-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Quick Start Templates
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Jump-start your next project
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <Card
                key={template.title}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 border-0 bg-gradient-to-b from-card to-card/50"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Wand2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {template.duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base mb-1">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {template.desc}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Volume2 className="w-3 h-3" />
                    <span>{template.voice}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Supported Languages
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Create content in any language
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-black/5 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-3">
                {[
                  "English",
                  "Spanish",
                  "French",
                  "German",
                  "Italian",
                  "Portuguese",
                  "Japanese",
                  "Korean",
                  "Chinese",
                  "Arabic",
                  "Hindi",
                  "Russian",
                  "Dutch",
                  "Polish",
                  "Swedish",
                  "Turkish",
                  "Vietnamese",
                  "Thai",
                  "Indonesian",
                  "Filipino",
                  "Yoruba",
                  "Igbo",
                  "Portuguese (Brazil)",
                  "Spanish (Mexico)",
                  "French (Canada)",
                  "Cantonese",
                  "Mandarin",
                  "Arabic (Gulf)",
                  "Hindi (Devanagari)",
                  "Bengali",
                  "Urdu",
                ].map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-default"
                  >
                    {lang}
                  </span>
                ))}
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
                  +110 more
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <Card className="relative overflow-hidden border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute inset-[1px] bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9Ii4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            <CardContent className="relative z-10 p-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary-foreground/80" />
                  <span className="text-sm font-medium text-primary-foreground/80">
                    Pro Tip
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-3">
                  Create your custom voice clone
                </h3>
                <p className="text-primary-foreground/70 mb-6 leading-relaxed">
                  Upload 30 seconds of audio and our AI will create a digital
                  replica that maintains the character and emotion of the
                  original voice. Perfect for consistent brand presence across
                  all your content.
                </p>
                <div className="flex items-center gap-4">
                  <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 shadow-xl">
                    <Mic2 className="w-4 h-4" />
                    Try Voice Cloning
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Recent Activity
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your latest voice generations
              </p>
            </div>
            <Link
              href="/history"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Card className="border-0 shadow-xl shadow-black/5">
            <CardContent className="p-0 divide-y divide-border/50">
              {[
                {
                  title: "Product Demo Script",
                  voice: "Marcus",
                  duration: "3:24",
                  date: "2 hours ago",
                  status: "Ready",
                },
                {
                  title: "Tutorial Part 3",
                  voice: "Elara",
                  duration: "8:12",
                  date: "Yesterday",
                  status: "Ready",
                },
                {
                  title: "Podcast Outro",
                  voice: "Kai",
                  duration: "0:45",
                  date: "3 days ago",
                  status: "Ready",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <AudioLines className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {item.voice}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Play className="w-3 h-3" fill="currentColor" />
                        Play
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
