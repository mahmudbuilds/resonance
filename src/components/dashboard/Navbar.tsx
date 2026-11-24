"use client";

import { ListIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StudioSidebarContent } from "@/components/dashboard/DashboardSidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between bg-background/95 backdrop-blur-sm px-4 border-b border-border">
      <div className="flex items-center gap-2.5">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <ListIcon weight="bold" className="size-4" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="studio-theme w-[272px] p-0 border-r border-border bg-background"
          >
            <SheetTitle className="sr-only">Studio Navigation</SheetTitle>
            <StudioSidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href="/app" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Resonance"
            width={24}
            height={24}
            className="size-6 object-contain invert dark:invert-0"
          />
          <span className="text-base font-bold tracking-[-0.03em] text-foreground">
            Resonance
          </span>
        </Link>
      </div>

      <ModeToggle className="rounded-full size-9 border-0 bg-secondary hover:bg-accent" />
    </header>
  );
}
