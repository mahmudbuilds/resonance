"use client";

import {
  ArrowRight,
  LifeBuoy,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SupportPage() {
  const faqs = [
    {
      q: "How does voice cloning work?",
      a: "Provide 30-300 seconds of clean audio. Our neural engine maps the acoustic features to synthesize a unique vocal profile in under 15 seconds.",
    },
    {
      q: "What audio formats are supported?",
      a: "We currently support MP3, WAV, FLAC, and OGG formats. The maximum file size allowed is 10MB.",
    },
    {
      q: "Is my data private and secure?",
      a: "Yes. All voice models and audio files are encrypted and stored in isolated workspaces. We never use your data for cross-model training without explicit authorization.",
    },
    {
      q: "How do I use SSML for precise control?",
      a: "Enable SSML mode in the Script Editor. You can use standard <speak>, <break>, <phoneme>, and <prosody> tags for granular synthesis control.",
    },
  ];

  return (
    <div className="min-h-screen relative w-full overflow-hidden text-foreground font-sans pb-20">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 animate-fade-up">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2 text-xs font-medium text-primary">
              <LifeBuoy className="w-3.5 h-3.5" />
              Help & Support
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight text-foreground">
              System Support
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Find answers to common questions or reach out directly to our engineering team for assistance.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 w-full max-w-full">
          {/* FAQ Section */}
          <div className="lg:col-span-7 space-y-6 stagger-1">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl shadow-foreground/10 border border-border h-full">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-border">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground tracking-wide">Knowledge Base</h2>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem 
                    key={i} 
                    value={`item-${i}`} 
                    className="glass-card border border-border bg-secondary px-6 py-2 rounded-2xl data-[state=open]:border-primary/50 transition-colors"
                  >
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:no-underline text-left py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-5 space-y-6 stagger-2">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl shadow-foreground/10 border border-border relative h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <Mail className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground tracking-wide">Direct Contact</h2>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-heading font-semibold text-foreground tracking-tight">Need immediate assistance?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you require technical intervention or have questions about enterprise plans, our support team is ready to help.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-border bg-secondary flex items-center gap-4 mb-8 group transition-colors hover:border-border hover:bg-accent">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Secure Email Support</div>
                    <div className="text-sm font-semibold text-foreground">support@resonance.ai</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button asChild className="w-full shadow-lg shadow-primary/20 rounded-full h-11 px-8 bg-primary hover:bg-primary/90 hover:scale-105 text-foreground font-medium text-sm transition-all border-none">
                    <a href="mailto:support@resonance.ai">
                      Contact Support <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

