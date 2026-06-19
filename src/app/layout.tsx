import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import UserSync from "@/components/UserSync";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Resonance | Vocal Synthesis",
  description: "Advanced AI Voice Generator and Voice Cloning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        plusJakarta.variable,
        outfit.variable,
        jetbrainsMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <ConvexClientProvider>
              {/* Aurora Glass Background Wrapper */}
              <div className="aurora-bg">
                <div className="aurora-orb-1"></div>
                <div className="aurora-orb-2"></div>
                <div className="aurora-orb-3"></div>
              </div>
              <UserSync />
              {children}
              <Toaster />
            </ConvexClientProvider>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
