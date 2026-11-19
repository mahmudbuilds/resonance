"use client";

import { UserButton } from "@clerk/nextjs";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  const pathname = usePathname();

  const formattedPath =
    pathname === "/app"
      ? "Overview"
      : pathname
          ?.split("/")
          .filter(Boolean)
          .pop()
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "Overview";

  const showQuickSynthesize = pathname !== "/app/text-to-speech";

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 border-b border-border h-16 flex items-center">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full h-full gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl size-9 transition-colors duration-150" />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-muted-foreground font-medium">Studio</span>
            <span className="text-muted-foreground/50">/</span>
            <span
              key={formattedPath}
              className="text-foreground font-semibold truncate animate-panel-swap"
            >
              {formattedPath}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {showQuickSynthesize && (
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex rounded-full h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs whitespace-nowrap"
            >
              <Link href="/app/text-to-speech">
                <PlusIcon weight="bold" className="size-3.5 mr-1.5" />
                New Speech
              </Link>
            </Button>
          )}
          <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "rounded-full border border-border size-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
