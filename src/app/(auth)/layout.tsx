import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground">
      <div className="fixed top-5 right-5 z-20">
        <ModeToggle className="rounded-full size-9 border-border bg-card hover:bg-accent" />
      </div>

      {/* Left Editorial Studio Column */}
      <aside className="hidden lg:flex lg:col-span-6 flex-col justify-between border-r border-border bg-secondary/40 p-10 xl:p-14">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <Image
            src="/logo.png"
            alt="Resonance"
            width={32}
            height={32}
            className="size-8 object-contain dark:invert-0 invert"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Resonance
          </span>
        </Link>

        <div className="space-y-6 max-w-lg my-auto py-8">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src="/images/studio-hero.webp"
              alt="Architectural vocal recording room with condenser microphone"
              width={1200}
              height={896}
              priority
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div className="space-y-2.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">
              Your vocal studio, ready when your script is.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[44ch]">
              Sign in to access your custom voice profiles, SSML script editor,
              and recorded audio history.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 Resonance Inc.</p>
      </aside>

      {/* Right Auth Column */}
      <main className="lg:col-span-6 flex flex-col justify-center items-center px-5 py-14 sm:px-8">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="flex lg:hidden items-center justify-center gap-2.5 mb-2"
          >
            <Image
              src="/logo.png"
              alt="Resonance"
              width={32}
              height={32}
              className="size-8 object-contain dark:invert-0 invert"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              Resonance
            </span>
          </Link>
          <div className="flex justify-center">{children}</div>
        </div>
      </main>
    </div>
  );
}
