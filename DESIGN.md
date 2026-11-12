---
name: "Resonance"
description: "Editorial neural voice synthesis and voice cloning studio built on daylight alabaster, deep acoustic carbon, hairline rules, and restrained Signal Vermilion tally accents."
colors:
  signal-vermilion: "#c83e1d"
  signal-vermilion-dark: "#c43c19"
  vermilion-ink: "#b93616"
  vermilion-ink-dark: "#f06c4a"
  daylight-alabaster: "#f8f8f6"
  pure-paper: "#ffffff"
  stone-surface: "#f2f2ef"
  stone-secondary: "#f1f1ee"
  sidebar-stone: "#f3f3f0"
  hairline-stone: "#e3e3de"
  input-stone: "#d8d8d2"
  obsidian-ink: "#111215"
  slate-muted: "#5a5d66"
  acoustic-carbon: "#0c0d10"
  charcoal-panel: "#14161b"
  carbon-sidebar: "#101216"
  carbon-subtle: "#111317"
  slate-secondary: "#1b1e25"
  slate-accent: "#22262f"
  paper-ink-dark: "#f2f2f0"
  ash-muted-dark: "#9da1ac"
  hairline-dark: "rgba(255, 255, 255, 0.09)"
  input-dark: "rgba(255, 255, 255, 0.13)"
  studio-crimson: "#c92a2a"
  studio-crimson-dark: "#e03e3e"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "4.25rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
    fontFeature: '"cv02", "cv03", "cv04", "cv11"'
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
    fontFeature: '"cv02", "cv03", "cv04", "cv11"'
  label:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0em"
    fontFeature: '"tnum"'
rounded:
  sm: "0.375rem"
  md: "0.5625rem"
  lg: "0.75rem"
  xl: "0.9375rem"
  2xl: "1.125rem"
  pill: "9999px"
spacing:
  xs: "0.625rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "3rem"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-vermilion}"
    textColor: "{colors.pure-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.pure-paper}"
    textColor: "{colors.obsidian-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.obsidian-ink}"
    textColor: "{colors.daylight-alabaster}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "36px"
  card-studio:
    backgroundColor: "{colors.pure-paper}"
    textColor: "{colors.obsidian-ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-studio:
    backgroundColor: "{colors.daylight-alabaster}"
    textColor: "{colors.obsidian-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  nav-item-active:
    backgroundColor: "{colors.signal-vermilion}"
    textColor: "{colors.pure-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "40px"
  audition-chip:
    backgroundColor: "{colors.stone-secondary}"
    textColor: "{colors.slate-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: Resonance

## Overview

**Creative North Star: "The Acoustic Monograph"**

Resonance treats vocal synthesis and voice cloning like an architectural print monograph paired with precision studio hardware. Generous daylight alabaster (`#f8f8f6`) and deep acoustic carbon (`#0c0d10`) grounds give scripts, waveforms, and spoken audio room to breathe, while crisp `1px` hairline rules organize dense studio workflows without visual noise.

A single Signal Vermilion tally accent (`#c83e1d` in light mode, `#c43c19` on dark surfaces, with `#f06c4a` reserved for dark `.accent-ink` highlights) marks active transport controls, primary actions, and playback progress—just as a recording-room tally lamp signals live readiness. Motion is deliberately understated: fast GPU-friendly entrances (`320ms cubic-bezier(0.16, 1, 0.3, 1)`) and crisp border-color transitions replace heavy compositor effects so both the public landing page and studio workspace respond instantaneously.

Resonance explicitly rejects dark-neon purple glassmorphism, decorative `backdrop-filter: blur()` panels, continuous mouse-tracking 3D transforms, kickers or eyebrows above headings, numbered section prefixes, gradient text fills, and redundant drop shadows layered over hairline borders.

**Key Characteristics:**
- Editorial alabaster (`#f8f8f6`) and deep acoustic carbon (`#0c0d10`) surfaces separated strictly by `1px` hairline rules.
- Restrained Signal Vermilion (`#c83e1d` / `#c43c19`) tally accents reserved for primary CTAs, active sidebar routes, and live audio progress.
- `Schibsted Grotesk` typography with tightened display tracking (`-0.03em`) paired with `Geist Mono` tabular timecodes and locale metrics.
- Crisp geometric container hierarchy: `12px` (`0.75rem`) studio panels, `8px`–`9px` workspace inputs and navigation items, and `9999px` pill actions.
- Zero `backdrop-filter` glass surfaces and zero ambient shadows on resting cards; depth comes from surface stepping and border contrast.

## Colors

An achromatic studio palette calibrated for long-form script editing and crisp WCAG AA contrast in both daylight and low-light modes, punctuated by a single warm Signal Vermilion accent.

*(Note: Early direction contract drafts referenced `#f7f7f5` / `#0b0c0f` / `#d14320` / `#f0633f`; the implemented system in `src/app/globals.css` calibrated these to `#f8f8f6`, `#0c0d10`, `#c83e1d` / `#c43c19`, and `#f06c4a` to guarantee 5.28:1 contrast on dark primary buttons with white ink.)*

### Primary
- **Signal Vermilion** (`#c83e1d`): Primary CTA pills, active transport play buttons, waveform progress bars, active focus outlines, and text caret in light mode.
- **Signal Vermilion Dark** (`#c43c19`): Dark-mode primary fill calibrated for ≥5.28:1 contrast against pure white (`#ffffff`) button and active-nav text.
- **Vermilion Ink** (`#b93616`) / **Vermilion Ink Dark** (`#f06c4a`): Accessible inline text and icon accent (`accent-ink`) used for tinted play triggers and hover highlights where `#c43c19` on dark slate would be too low-contrast.

### Neutral
- **Daylight Alabaster** (`#f8f8f6`): Root canvas background in light mode (`--background`).
- **Pure Paper** (`#ffffff`): Elevated editorial cards, `.studio-panel` surfaces, popovers, and outline button grounds in light mode.
- **Stone Surface / Secondary / Sidebar** (`#f2f2ef`, `#f1f1ee`, `#f3f3f0`): Subtle section bands, secondary chips, muted badges, and the studio sidebar rail.
- **Hairline Stone & Input Stone** (`#e3e3de`, `#d8d8d2`): Crisp `1px` structural dividers, panel borders, and resting input strokes.
- **Obsidian Ink & Slate Muted** (`#111215`, `#5a5d66`): Primary copy, high-contrast header action pills, and secondary metadata captions in light mode.
- **Acoustic Carbon** (`#0c0d10`): Root canvas background in dark mode.
- **Charcoal Panel / Carbon Sidebar / Carbon Subtle** (`#14161b`, `#101216`, `#111317`): Dark-mode studio panels, persistent sidebar chrome, and recessed surfaces.
- **Slate Secondary & Accent** (`#1b1e25`, `#22262f`): Dark-mode chip fills, inactive hover surfaces, and interactive surface shifts.
- **Paper Ink Dark & Ash Muted Dark** (`#f2f2f0`, `#9da1ac`): Primary and secondary typography in dark mode.
- **Hairline Dark & Input Dark** (`rgba(255, 255, 255, 0.09)`, `rgba(255, 255, 255, 0.13)`): Translucent hairline borders and input strokes over carbon surfaces.

### Semantic (Destructive)
- **Studio Crimson** (`#c92a2a` light / `#e03e3e` dark): Account deletion, destructive confirmations, and `aria-invalid` form validation states.

### Named Rules
**The Tally Lamp Rule.** Signal Vermilion (`#c83e1d` / `#c43c19`) acts like a studio tally light: reserve it for primary actions, active route indicators, focus outlines, and live audio progress so it occupies ≤10% of any viewport.
**The Built-Contrast Rule.** Never place raw `#c43c19` as body text or small icons over `#14161b` carbon panels; use `.accent-ink` (`#f06c4a`) for dark-mode foreground accents and reserve `#c43c19` for solid white-ink fills.

## Typography

**Display Font:** `Schibsted Grotesk` (fallback: `system-ui, -apple-system, sans-serif`)
**Body Font:** `Schibsted Grotesk` (fallback: `system-ui, -apple-system, sans-serif`)
**Label/Mono Font:** `Geist Mono` (fallback: `ui-monospace, SFMono-Regular, monospace`)

**Character:** Swiss neo-grotesque clarity with OpenType alternates (`"cv02", "cv03", "cv04", "cv11"`) for legible studio UI copy, paired with precision monospaced telemetry for audio durations, sample rates, and locale codes.

### Hierarchy
- **Display** (`600`, `4.25rem` / `68px` max via `text-4xl sm:text-6xl lg:text-[4.25rem]`, `1.04` line-height, `-0.03em` tracking): Hero statement on the landing page (`Voices that sound human.`), capped at `max-w-xl`.
- **Headline** (`600`, `1.875rem` / `30px`, `1.2` line-height, `-0.025em` tracking): Section headings and studio workspace page titles.
- **Title** (`600`, `1rem` / `16px`, `1.4` line-height, `-0.01em` tracking): Workspace index rows, panel headers, and card titles.
- **Body** (`400`, `1rem` / `16px` editorial and `0.875rem` / `14px` studio UI, `1.625` line-height): Lead copy constrained to `46ch`–`54ch`, descriptions, and script editor text.
- **Label** (`500`, `0.75rem` / `12px` or `0.6875rem` / `11px`, `1.33` line-height): Form labels, navigation links, buttons, and sidebar group headers—written in sentence or title case without forced uppercase kickers.
- **Mono** (`500`, `0.75rem` / `12px` or `0.6875rem` / `11px`, `1.33` line-height, `tabular-nums`): Locale codes (`EN-US`), audio sample telemetry (`48kHz`), waveform timestamps (`0:00 / 0:12`), and workspace metadata tags.

### Named Rules
**The Plain-Heading Rule.** Headings stand on scale, weight (`600`), and whitespace alone; never precede a heading with an uppercase kicker, eyebrow pill, or numbered prefix (`01`, `02`).
**The Tabular Telemetry Rule.** Every live playback timer, duration readout, credit counter, and sample rate badge must pair `Geist Mono` with `.tabular-nums` (`font-variant-numeric: tabular-nums`) so numbers never jitter during playback.

## Layout

Resonance uses an open, grid-disciplined layout anchored by a `max-w-7xl` (`1280px`) editorial container on marketing routes and a persistent collapsible sidebar rail (`DashboardSidebar`) inside `/app/*`. Marketing sections span full-bleed `1px` top hairline dividers (`border-t border-border`) with generous vertical cadence (`64px` mobile / `96px` desktop `py-16 lg:py-24`) and horizontal gutters scaling from `20px` (`px-5`) to `32px` (`sm:px-8`) and `48px` (`lg:px-12`).

Asymmetric 12-column grids (`grid-cols-1 lg:grid-cols-12` with `40px`–`48px` gaps) establish clear focal hierarchy: `7 + 5` columns for the hero opening (statement left, studio photography and live audition module right), `4 + 8` columns for the ruled workspace index, and `6 + 6` columns for craft showcases and studio editor splits. The sticky public header sits at a fixed `64px` (`h-16`) single line.

### Named Rules
**The Ruled Index Rule.** Separate major page bands with full-width `1px` top hairline borders (`border-t border-border`) and alternating subtle stone washes (`bg-secondary/40`) rather than wrapping every section inside floating cards.

## Elevation & Depth

Resonance is **flat-by-default**. Studio panels, locale tiles, and workspace cards convey hierarchy through tonal stepping (alabaster `#f8f8f6` canvas beneath pure white `#ffffff` panels; acoustic carbon `#0c0d10` beneath charcoal `#14161b` panels) and `1px` structural hairline borders—not drop shadows or blur layers.

### Shadow Vocabulary
- **Popover Float (Light)** (`box-shadow: 0 12px 32px rgba(17, 18, 21, 0.08)`): Applied exclusively to floating Clerk authentication cards and user popovers (`.cl-card`, `.cl-userButtonPopoverCard`).
- **Popover Float (Dark)** (`box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45)`): Dark-mode counterpart for floating Clerk popovers.
- **Focus Ring** (`outline: 2px solid var(--primary); outline-offset: 2px` / `box-shadow: 0 0 0 1px var(--ring)`): Keyboard accessibility indicator using Signal Vermilion (`rgba(200, 62, 29, 0.35)` light, `rgba(240, 108, 74, 0.45)` dark).

### Named Rules
**The No-Glass Hairline Rule.** Surfaces at rest carry zero `box-shadow` and zero `backdrop-filter: blur()`; depth is strictly communicated by `1px` `var(--border)` strokes and subtle surface value steps.

## Shapes

Geometry pairs architectural crispness with tactile circular transport controls:

- **Studio Panels & Media Frames (`12px` / `0.75rem`, `--radius-lg`):** All `.studio-panel` and `.studio-card` containers, hero photography frames, and Clerk cards share a `12px` corner radius with `1px solid var(--border)` clipping (`overflow-hidden`).
- **Workspace Controls & Nav Items (`8px`–`9px`, `rounded-lg` / `--radius-md`):** Sidebar navigation items, form inputs (`h-10`), icon badges (`size-10`), and locale grid tiles use a tighter `8px`–`9px` corner radius so nested elements nest cleanly inside `12px` parent panels.
- **Actions & Transport Controls (`9999px` pill):** Primary, secondary, and header CTAs, audition voice chips, play/pause transport circles (`size-8` and `size-10`), waveform bars, and custom scrollbars are full pills (`9999px`).

## Components

Every component feels **tactile, restrained, and calibrated**—clean `1px` borders, crisp vermilion hover/focus states, and fast `180ms` transitions without scale bounce or ambient glow.

### Buttons
- **Shape:** Full pill (`9999px` radius) across marketing and studio action buttons. *(Note: the underlying shadcn primitive in `src/components/ui/button.tsx` retains `rounded-none` as an unedited generator default; all rendered buttons must pass `rounded-full`.)*
- **Primary:** Signal Vermilion (`#c83e1d` light / `#c43c19` dark) fill with `#ffffff` text, `48px` (`h-12`) height and `0 28px` (`px-7`) padding for hero/close CTAs, or `40px` (`h-10`) height and `0 24px` (`px-6`) padding inside studio forms.
- **Hover / Focus:** Background shifts to `90%` opacity on hover; `2px solid var(--primary)` outline with `2px` offset on `:focus-visible`; subtle `1px` downward press on `:active`.
- **Secondary / Outline / Ink:** Header CTA uses inverted ink (`#111215` background, `#f8f8f6` text, `36px` height, `0 20px` padding); secondary outline CTAs use pure paper (`#ffffff` light / `#14161b` dark) with `1px solid var(--border)` and shift to `--accent` on hover.

### Chips
- **Style:** Pill-shaped (`9999px`), `4px 12px` (`px-3 py-1`) padding, `12px` (`text-xs`) medium typography.
- **State:** Unselected preset chips sit on `--secondary` (`#f1f1ee` light / `#1b1e25` dark) with muted text; selected chips invert to high-contrast `--foreground` background with `--background` ink.

### Cards / Containers
- **Corner Style:** Soft architectural rectangle (`12px` / `0.75rem` radius).
- **Background:** Pure Paper (`#ffffff` light) or Charcoal Panel (`#14161b` dark) via `.studio-panel` and `.studio-card`.
- **Shadow Strategy:** Flat at rest (zero drop shadow); interactive `.studio-card` shifts only its border color on hover to `rgba(200, 62, 29, 0.35)` (light) or `rgba(240, 108, 74, 0.38)` (dark) over `180ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Border:** Continuous `1px solid var(--border)`.
- **Internal Padding:** `16px`–`20px` (`p-4 sm:p-5`) for compact player modules; `20px`–`24px` (`p-5 sm:p-6`) for studio workspace panels.

### Inputs / Fields
- **Style:** `40px` (`h-10`) height, `8px` (`rounded-lg`) corners, `1px solid var(--input)` stroke, `--background` fill, `14px` (`text-sm`) body text. *(Note: the base `Input` primitive in `src/components/ui/input.tsx` retains `rounded-none h-8 text-xs`; studio forms explicitly override to `h-10 rounded-lg text-sm`.)*
- **Focus:** Border shifts to `--ring` with a `1px` vermilion focus ring and Signal Vermilion text caret.
- **Error / Disabled:** Disabled fields use `bg-secondary/50` and `50%` opacity; invalid fields shift border and ring to `--destructive` (`#c92a2a` / `#e03e3e`).

### Navigation
- **Public Header:** Sticky `64px` (`h-16`) bar with `1px` bottom border, `32px` logo mark + `16px` semibold wordmark, 3 `14px` muted nav links (`Voices`, `Text to Speech`, `Voice Cloning`) that transition to `--foreground` on hover, theme toggle (`size-9 rounded-full`), and inverted-ink `Open Studio` pill.
- **Studio Sidebar (`DashboardSidebar`):** Collapsible icon rail on `--sidebar` (`#f3f3f0` light / `#101216` dark) with a `1px` right border, `64px` header, `11px` muted group labels (`Studio`, `Account`), `40px` (`h-10`) `8px`-rounded route items (Signal Vermilion fill when active, `--sidebar-accent` on hover), and Clerk `UserButton` footer.

### Waveform & Audition Modules (Signature Components)
- **Hero Audio Audition (`HeroAudioAudition`):** Compact `12px`-rounded `.studio-panel` housing voice preset pills (`Nadia`, `Tomas`, `Hana`), `Geist Mono` `48kHz` metadata, a `40px` circular Signal Vermilion Web Audio play/pause button, 20 proportional pill bars that sweep from `--border` to `--primary` during playback, and a bottom-ruled transcript quote.
- **Waveform Player (`WaveformPlayer`):** Inline `240px`–`320px` playback bar featuring a `32px` circular vermilion-tinted play button (`bg-primary/10 accent-ink border-primary/20`, inverting to solid `--primary` on hover), 32 keyboard-accessible (`role="slider"`) proportional bars, and a `54px`-minimum right-aligned `Geist Mono` `tabular-nums` timestamp.

## Do's and Don'ts

### Do:
- **Do** organize page sections and studio panels with `1px` hairline borders (`var(--border)`) and surface value steps (`#f8f8f6` → `#ffffff` in light mode; `#0c0d10` → `#14161b` in dark mode).
- **Do** enforce the Tally Lamp Rule by limiting Signal Vermilion (`#c83e1d` / `#c43c19`) to primary CTAs, active nav items, focus rings, and live audio progress.
- **Do** apply `rounded-full` (`9999px`) to action buttons, chips, and audio transport controls, `12px` (`0.75rem`) to studio panels, and `8px` (`rounded-lg`) to inputs and sidebar nav rows.
- **Do** pair `Geist Mono` with `.tabular-nums` on every timecode, sample rate, character count, and locale code.
- **Do** respect `prefers-reduced-motion: reduce` by disabling `.animate-editorial-enter` and `.studio-card` transitions.

### Don't:
- **Don't** use `backdrop-filter: blur()`, neon purple glows, gradient text fills, or continuous mouse-tracking 3D transforms anywhere in the marketing or studio UI.
- **Don't** add shadows to resting cards or studio panels; keep shadows restricted to floating Clerk popovers (`.cl-card`, `.cl-userButtonPopoverCard`).
- **Don't** place uppercase kickers, eyebrows, or section numbers above headings.
- **Don't** use `#c43c19` for small text or icons over dark `#14161b` panels; use `.accent-ink` (`#f06c4a`) for accessible dark-mode foreground accents.
- **Don't** ship unstyled `rounded-none` defaults from `button.tsx` or `input.tsx` without applying the canonical pill (`rounded-full`) or `rounded-lg` (`h-10`) studio classes.
