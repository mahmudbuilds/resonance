"use client";

import {
  ArrowRightIcon,
  ChatCircleTextIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
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
    <div className="min-h-full px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-6 animate-editorial-enter">
        <header className="space-y-1">
          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-foreground">
            Help &amp; Support
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
            Browse answers to common studio questions or email our engineering
            support team.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* FAQ Knowledge Base */}
          <section className="bento-card lg:col-span-7 p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground">
                <ChatCircleTextIcon weight="bold" className="size-4" />
              </span>
              <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2.5">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${i}`}
                  className="bento-row border-0 px-4"
                >
                  <AccordionTrigger className="text-[13.5px] font-semibold text-foreground hover:no-underline text-left py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Direct Contact */}
          <aside className="bento-card lg:col-span-5 p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <EnvelopeSimpleIcon weight="fill" className="size-4" />
              </span>
              <h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
                Direct Contact
              </h2>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground tracking-[-0.02em]">
                Need direct assistance?
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                If you encounter a technical issue or need help with custom
                voice limits, write to our team directly.
              </p>
            </div>

            <div className="bento-row p-4 flex items-center gap-3.5">
              <div className="size-10 rounded-full bg-card shadow-2xs flex items-center justify-center text-foreground shrink-0">
                <EnvelopeSimpleIcon weight="fill" className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Email Support
                </div>
                <div className="text-sm font-bold text-foreground truncate">
                  support@resonance.ai
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full rounded-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
            >
              <a href="mailto:support@resonance.ai">
                Email Support
                <ArrowRightIcon weight="bold" className="size-3.5 ml-2" />
              </a>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
