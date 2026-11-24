"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  GearSixIcon,
  HeadphonesIcon,
  HouseSimpleIcon,
  type Icon,
  MicrophoneStageIcon,
  MoonIcon,
  SquaresFourIcon,
  SunIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";

export interface NavItem {
  title: string;
  url: string;
  icon: Icon;
}

export const STUDIO_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/app", icon: HouseSimpleIcon },
  { title: "Text to Speech", url: "/app/text-to-speech", icon: WaveformIcon },
  { title: "Voice Library", url: "/app/voices", icon: SquaresFourIcon },
  {
    title: "Voice Cloning",
    url: "/app/voice-cloning",
    icon: MicrophoneStageIcon,
  },
  { title: "Settings", url: "/app/settings", icon: GearSixIcon },
  { title: "Support", url: "/app/support", icon: HeadphonesIcon },
];

function formatCompactCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

export function StudioSidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const generationCount = useQuery(api.voice.getNumberOfGenerations);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName =
    user?.firstName ||
    user?.fullName ||
    currentUser?.name?.split(" ")[0] ||
    "Creator";
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress || currentUser?.email || "";

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex h-full flex-col justify-between bg-background px-5 py-7 select-none">
      {/* Top: Brand + Nav */}
      <div className="space-y-9">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-2.5 group"
        >
          <Image
            src="/logo.png"
            alt="Resonance"
            width={30}
            height={30}
            className="size-[30px] shrink-0 object-contain invert dark:invert-0 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-[19px] font-bold tracking-[-0.03em] text-foreground">
            Resonance
          </span>
        </Link>

        <nav aria-label="Studio Navigation" className="space-y-1.5">
          {STUDIO_NAV_ITEMS.map((item) => {
            const isActive =
              item.url === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.url);

            return (
              <Link
                key={item.url}
                href={item.url}
                onClick={onNavigate}
                className={`group flex items-center gap-3.5 rounded-full py-1.5 pl-1.5 pr-4 text-[13.5px] font-medium transition-[background-color,color,transform,box-shadow] duration-200 active:scale-[0.985] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(13,13,15,0.45)] dark:shadow-[0_8px_20px_-8px_rgba(255,255,255,0.2)]"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : "bg-secondary text-foreground/75 group-hover:bg-background group-hover:text-foreground"
                  }`}
                >
                  <item.icon
                    weight={isActive ? "fill" : "regular"}
                    className="size-[17px]"
                  />
                </span>
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Centered User Profile + Compact Theme Switch */}
      <div className="pt-6 flex flex-col items-center text-center space-y-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-2.5">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "size-12 rounded-full ring-2 ring-secondary shadow-xs",
                },
              }}
              fallback={
                <Skeleton className="size-12 rounded-full bg-secondary" />
              }
            />
            {typeof generationCount === "number" && (
              <span
                title={`${generationCount} audio generations`}
                className="pointer-events-none absolute -top-1 -right-2 inline-flex min-w-6 h-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold tabular-nums text-primary-foreground shadow-xs"
              >
                {formatCompactCount(generationCount)}
              </span>
            )}
          </div>

          {!isLoaded ? (
            <div className="space-y-1.5 flex flex-col items-center">
              <Skeleton className="h-3.5 w-20 rounded-full" />
              <Skeleton className="h-3 w-32 rounded-full" />
            </div>
          ) : (
            <>
              <div className="text-sm font-semibold text-foreground leading-tight max-w-[185px] truncate">
                {displayName}
              </div>
              {displayEmail && (
                <div className="text-[11px] text-muted-foreground mt-0.5 max-w-[195px] truncate">
                  {displayEmail}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sleek monochrome pill theme switcher */}
        <fieldset
          aria-label="Theme"
          className="inline-flex items-center rounded-full bg-secondary p-1 gap-0.5 border-0"
        >
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all cursor-pointer ${
              mounted && !isDark
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SunIcon
              weight={!isDark ? "fill" : "regular"}
              className="size-3.5"
            />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all cursor-pointer ${
              isDark
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoonIcon
              weight={isDark ? "fill" : "regular"}
              className="size-3.5"
            />
            Dark
          </button>
        </fieldset>
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 sticky top-0 h-[100dvh] bg-background">
      <div className="w-full h-full">
        <StudioSidebarContent />
      </div>
    </aside>
  );
}
