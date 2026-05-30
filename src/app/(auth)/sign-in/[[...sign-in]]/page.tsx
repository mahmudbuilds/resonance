import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        options: {
          logoImageUrl: "/logo.png",
        },
        baseTheme: dark,
        variables: {
          colorPrimary: "#ccff00",
          colorBackground: "#000000", 
          colorInputBackground: "#000000",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#888888",
          fontFamily: "var(--font-sans)",
          fontFamilyButtons: "var(--font-mono)",
          borderRadius: "0px",
        },
        elements: {
          // Extra margin-bottom to clear space for the larger graphic
          logoBox: "bg-black flex items-center justify-center mb-6",
          
          // Using an object here overrides Clerk's hardcoded inline image width/height directly
          logoImage: {
            width: "96px",       // Equivalent to w-24
            height: "96px",      // Equivalent to h-24
            objectFit: "contain",
          },
          
          rootBox: "w-full",
          card: "border border-[#222] shadow-[5px_5px_0px_rgba(204,255,0,0.2)] rounded-none !bg-black p-6 sm:p-8 w-full max-w-full",
          footer: "!bg-black",
          headerTitle: "font-heading uppercase tracking-widest text-2xl mb-2",
          headerSubtitle:
            "font-mono text-xs uppercase tracking-wider text-[#888]",
          socialButtonsBlockButton:
            "border border-[#222] rounded-none hover:bg-[#111] transition-colors text-white font-mono text-xs uppercase tracking-widest h-12",
          socialButtonsBlockButtonText:
            "font-mono text-xs uppercase tracking-widest font-normal",
          formButtonPrimary:
            "rounded-none font-mono uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_rgba(204,255,0,1)] transition-all h-12 text-black bg-[#ccff00] hover:bg-white",
          formFieldInput:
            "border border-[#222] rounded-none focus:border-[#ccff00] focus:ring-0 transition-colors bg-black h-12 text-white font-mono text-sm",
          formFieldLabel:
            "font-mono text-[10px] uppercase tracking-widest text-[#888] mb-2",
          footerActionLink:
            "text-[#ccff00] hover:text-white transition-colors font-mono uppercase tracking-widest text-xs",
          footerActionText: "font-mono text-xs text-[#555]",
          dividerLine: "bg-[#222]",
          dividerText: "text-[#555] font-mono text-xs",
          identityPreviewText: "font-mono text-sm",
          identityPreviewEditButtonIcon: "text-[#ccff00]",
          formResendCodeLink:
            "text-[#ccff00] hover:text-white font-mono text-xs uppercase",
        },
      }}
    />
  );
}