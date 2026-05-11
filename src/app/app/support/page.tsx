"use client";

import {
  LifeBuoy,
  BookOpen,
  MessageSquare,
  Mail,
  Search,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const faqs = [
    { q: "How does the Voice Cloning process work?", a: "To clone a voice, navigate to the Voice Cloning tab, provide a 30-second to 5-minute clean, noise-free audio sample of the target voice, and hit submit. Our neural engine maps the unique vocal signatures to create a dedicated profile within seconds." },
    { q: "What audio formats are supported?", a: "We support MP3, WAV, FLAC, and OGG formats up to 25MB per file." },
    { q: "Are my cloned voices private?", a: "Yes. Any voice cloned on your account is strictly private to your workspace and is never shared or used to train global base models without explicit permission." },
    { q: "How do I use SSML for precise pronunciation?", a: "Enable SSML mode in the Script Editor. You can then use standard SSML tags like <break time='1s'/> or <phoneme> to guide the AI exactly how to say complex words." }
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-background">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/10 opacity-30 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-10 lg:py-16 mx-auto max-w-[1000px] space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col space-y-6 items-center text-center">
          <Badge variant="outline" className="w-fit bg-background/80 backdrop-blur-md border-primary/20 text-primary px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <LifeBuoy className="w-3.5 h-3.5 mr-2 text-primary" />
            Support Center
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            How can we help <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">you?</span>
          </h1>
          
          <div className="relative w-full max-w-2xl mt-4">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <Input 
               placeholder="Search for articles, guides, or troubleshooting..." 
               className="pl-12 bg-card/70 backdrop-blur-xl border-border/70 h-14 rounded-2xl shadow-xl focus-visible:ring-primary/20 text-base md:text-lg min-w-0" 
             />
             <Button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 rounded-xl bg-primary hover:bg-primary/90 hidden sm:flex">
               Search
             </Button>
          </div>
        </header>

        {/* Resources Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 w-full max-w-full">
           <Card className="group border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 w-full max-w-full cursor-pointer hover:-translate-y-1 min-w-0">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform shadow-sm">
                    <BookOpen className="w-8 h-8 text-primary" />
                 </div>
                 <h2 className="text-xl font-bold truncate max-w-full">Documentation</h2>
                 <p className="text-sm text-muted-foreground leading-relaxed break-words">Comprehensive guides on API integration, billing, and advanced synthesis configurations.</p>
                 <span className="text-sm font-semibold text-primary pt-2 flex items-center shrink-0">Read Docs <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></span>
              </CardContent>
           </Card>

           <Card className="group border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 w-full max-w-full cursor-pointer hover:-translate-y-1 min-w-0">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform shadow-sm">
                    <MessageSquare className="w-8 h-8 text-purple-500" />
                 </div>
                 <h2 className="text-xl font-bold truncate max-w-full">Community Discord</h2>
                 <p className="text-sm text-muted-foreground leading-relaxed break-words">Join thousands of creators sharing techniques, voice recipes, and troubleshooting tips.</p>
                 <span className="text-sm font-semibold text-purple-500 pt-2 flex items-center shrink-0">Join Server <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></span>
              </CardContent>
           </Card>
        </div>

        {/* FAQs */}
        <section className="space-y-6 pt-6 w-full max-w-full">
           <h2 className="text-2xl font-bold tracking-tight px-2">Frequently Asked Questions</h2>
           <Card className="border border-border/70 dark:border-border/50 bg-card/70 dark:bg-card/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden w-full max-w-full min-w-0">
              <div className="divide-y divide-border/50">
                 {faqs.map((faq, i) => (
                    <div key={i} className="p-6 group cursor-pointer hover:bg-muted/30 transition-colors w-full min-w-0">
                       <h3 className="font-semibold text-lg flex items-center justify-between gap-4 text-foreground group-hover:text-primary transition-colors min-w-0 w-full">
                         <span className="truncate flex-1 min-w-0">{faq.q}</span>
                         <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                       </h3>
                       {/* Hardcoded opened state for visual flair */}
                       {i === 0 && (
                          <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed break-words pr-4">
                            {faq.a}
                          </p>
                       )}
                    </div>
                 ))}
              </div>
           </Card>
        </section>

        {/* Contact Block */}
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden w-full max-w-full relative min-w-0">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-transparent" />
           <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left min-w-0 w-full">
              <div className="min-w-0 w-full md:w-auto flex-1">
                 <h3 className="text-2xl font-bold mb-2 truncate">Still need help?</h3>
                 <p className="text-muted-foreground break-words">Our support team is available around the clock to assist you.</p>
              </div>
              <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all shrink-0 w-full md:w-auto">
                 <Mail className="w-4 h-4 mr-2" /> Contact Support
              </Button>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
