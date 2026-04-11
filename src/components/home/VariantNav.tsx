"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

const variants = [
  { href: "/", label: "/ (current)" },
  { href: "/2", label: "/2" },
  { href: "/3", label: "/3" },
  { href: "/4", label: "/4" },
  { href: "/5", label: "/5" },
  { href: "/6", label: "/6" },
  { href: "/7", label: "/7" },
  { href: "/8", label: "/8" },
  { href: "/9", label: "/9" },
  { href: "/10", label: "/10" },
  { href: "/11", label: "/11" },
];

export function VariantNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("w-full border-b", className)}>
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {variants.map((v) => {
            const active = pathname === v.href;
            return (
              <Link
                key={v.href}
                href={v.href}
                className={cn(
                  "rounded-none border px-2 py-1 text-xs transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {v.label}
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle className="" />
        </div>
      </div>
    </div>
  );
}
