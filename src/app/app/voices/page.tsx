"use client";

import {
  LayoutGrid,
  Search,
  Filter,
  Play,
  Star,
  Activity,
  Globe2,
  MoreVertical,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VoicesPage() {
  const library = [
    { name: "Marcus", gender: "Male", accent: "American", mood: "Authoritative", type: "Pro", plays: "2.4M", desc: "A deep, resonant voice perfect for trailers and authoritative narrations.", color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
    { name: "Elara", gender: "Female", accent: "British", mood: "Warm", type: "Standard", plays: "1.8M", desc: "A naturally warm and conversational British voice ideal for podcasts.", color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
    { name: "Kai", gender: "Neutral", accent: "Australian", mood: "Casual", type: "Standard", plays: "1.2M", desc: "Energetic and friendly, perfect for YouTube and social media content.", color: "from-emerald-500/20 to-green-500/20", borderColor: "border-emerald-500/30" },
    { name: "Nadia", gender: "Female", accent: "Russian", mood: "Professional", type: "Pro", plays: "980K", desc: "Strict and professional tempo for corporate training and news reads.", color: "from-rose-500/20 to-red-500/20", borderColor: "border-rose-500/30" },
    { name: "Theo", gender: "Male", accent: "French", mood: "Romantic", type: "Standard", plays: "875K", desc: "Smooth and velvety voice suitable for audiobooks and dramatic setups.", color: "from-amber-500/20 to-orange-500/20", borderColor: "border-amber-500/30" },
    { name: "Zara", gender: "Female", accent: "Nigerian", mood: "Energetic", type: "Pro", plays: "762K", desc: "High-energy, enthusiastic delivery for commercials and fast-paced ads.", color: "from-yellow-500/20 to-lime-500/20", borderColor: "border-yellow-500/30" },
    { name: "Jin", gender: "Male", accent: "Korean", mood: "Calm", type: "Standard", plays: "640K", desc: "Soft-spoken and relaxing, great for meditation videos or guides.", color: "from-indigo-500/20 to-blue-500/20", borderColor: "border-indigo-500/30" },
    { name: "Sofia", gender: "Female", accent: "Spanish", mood: "Upbeat", type: "Standard", plays: "590K", desc: "Clear conversational Spanish tone suitable for language learning.", color: "from-fuchsia-500/20 to-purple-500/20", borderColor: "border-fuchsia-500/30" }
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 opacity-40 blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 opacity-40 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 mx-auto max-w-[1400px] space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit bg-background/80 dark:bg-background/50 backdrop-blur-md border-primary/30 dark:border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <LayoutGrid className="w-3.5 h-3.5 mr-2 text-primary" />
              Voice Library
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">Voices</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Discover hundreds of premium, lifelike voices for any project.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
             <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all h-11 px-6">
               <Plus className="w-4 h-4 mr-2" /> Custom Clone
             </Button>
          </div>
        </header>

        {/* Filters */}
        <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-sm rounded-2xl p-2 w-full max-w-full">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search voices by name or style..." className="pl-9 bg-background/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 w-full min-w-0" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0 min-w-0">
               <Select defaultValue="all">
                 <SelectTrigger className="w-[140px] shrink-0 bg-background/80 border-border/50 h-12 rounded-xl focus:ring-primary/20 [&>span]:truncate [&>span]:min-w-0">
                   <div className="flex items-center gap-2 overflow-hidden min-w-0"><Globe2 className="w-4 h-4 text-primary shrink-0" /> <SelectValue placeholder="Language" /></div>
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Languages</SelectItem>
                   <SelectItem value="en">English</SelectItem>
                   <SelectItem value="es">Spanish</SelectItem>
                 </SelectContent>
               </Select>

               <Select defaultValue="all">
                 <SelectTrigger className="w-[140px] shrink-0 bg-background/80 border-border/50 h-12 rounded-xl focus:ring-primary/20 [&>span]:truncate [&>span]:min-w-0">
                   <div className="flex items-center gap-2 overflow-hidden min-w-0"><Filter className="w-4 h-4 text-primary shrink-0" /> <SelectValue placeholder="Category" /></div>
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Categories</SelectItem>
                   <SelectItem value="pro">Pro Voices</SelectItem>
                   <SelectItem value="standard">Standard</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>
        </Card>

        {/* Voices Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-full">
          {library.map((voice) => (
            <Card key={voice.name} className="group relative border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 flex flex-col w-full max-w-full min-w-0">
               {/* Internal Header Background */}
               <div className={`h-24 w-full bg-gradient-to-br ${voice.color} relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:10px_10px]" />
                 <div className="absolute top-4 right-4 flex gap-1.5">
                    {voice.type === "Pro" && (
                       <Badge variant="secondary" className="bg-background/90 text-primary border-primary/20 text-[10px] uppercase font-bold backdrop-blur-sm">Pro</Badge>
                    )}
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-background/50 hover:bg-background/80 hover:text-primary transition-colors text-muted-foreground backdrop-blur-sm">
                       <Star className="w-3.5 h-3.5" />
                    </Button>
                 </div>
               </div>

               {/* Avatar overlap */}
               <div className="px-6 relative flex-1 flex flex-col min-w-0 w-full">
                 <div className={`w-16 h-16 rounded-2xl bg-card border-2 ${voice.borderColor} -mt-8 mb-3 flex items-center justify-center shadow-md relative group-hover:scale-110 transition-transform duration-500 z-10 overflow-hidden`}>
                   <div className={`absolute inset-0 bg-gradient-to-br ${voice.color} opacity-20`} />
                   <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">{voice.name[0]}</span>
                 </div>
                 
                 <div className="flex items-center justify-between gap-2 overflow-hidden mb-1 min-w-0 w-full">
                    <h3 className="text-xl font-bold truncate">{voice.name}</h3>
                    <Button size="icon" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all outline-none border border-primary/20 hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] shrink-0">
                       <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    </Button>
                 </div>
                 
                 <p className="text-sm font-medium text-primary mb-3 truncate w-full">{voice.accent} • {voice.gender}</p>
                 <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed flex-1 w-full min-w-0">
                    {voice.desc}
                 </p>
               </div>

               <div className="px-6 py-4 mt-4 border-t border-border/50 bg-muted/10 flex items-center justify-between text-xs font-semibold w-full min-w-0">
                 <Badge variant="outline" className="bg-background/50 border-border/50 text-muted-foreground">
                    {voice.mood}
                 </Badge>
                 <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Activity className="w-3.5 h-3.5 text-primary" /> {voice.plays} views
                 </span>
               </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
