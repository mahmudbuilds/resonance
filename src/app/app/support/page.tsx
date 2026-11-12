"use client";

import { ArrowRight, Mail, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "How does voice cloning work?",
    a: "Provide 5 to 15 seconds of clean speech, or up to 300 seconds via upload. Resonance maps your acoustic characteristics to build a custom voice profile.",
  },
  {
    q: "What audio formats are supported?",
    a: "You can upload MP3, WAV, FLAC, or OGG files up to 10MB, or record directly in your browser microphone.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. Voice profiles and generated audio files are stored in isolated user workspaces and are never shared across accounts.",
  },
  {
    q: "How do I use SSML for precise control?",
    a: "Turn on SSML Mode inside the Text to Speech Script Editor to use standard <speak>, <break>, <phoneme>, and <prosody> tags.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-10 space-y-8 animate-editorial-enter">
        <header className="pb-6 border-b border-border space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Help &amp; Support
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Browse answers to common studio questions or email our engineering
            support team.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* FAQ Knowledge Base */}
          <section className="lg:col-span-7 studio-panel rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <MessageSquare className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2.5">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${i}`}
                  className="border border-border bg-secondary/30 px-4 rounded-lg data-[state=open]:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:no-underline text-left py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Direct Contact */}
          <aside className="lg:col-span-5 studio-panel rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Mail className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Direct Contact
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                Need direct assistance?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you encounter a technical issue or need help with custom
                voice limits, write to our team directly.
              </p>
            </div>

            <div className="rounded-lg p-4 border border-border bg-secondary/40 flex items-center gap-3.5">
              <div className="size-10 rounded-lg bg-card border border-border flex items-center justify-center accent-ink shrink-0">
                <Mail className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  Email Support
                </div>
                <div className="text-sm font-semibold text-foreground truncate">
                  support@resonance.ai
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full rounded-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
            >
              <a href="mailto:support@resonance.ai">
                Email Support
                <ArrowRight className="size-4 ml-2" />
              </a>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
