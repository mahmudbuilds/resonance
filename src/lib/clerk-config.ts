import { dark } from "@clerk/themes";

const sharedElements = {
  rootBox: "w-full",
  card: "rounded-2xl border border-border shadow-sm p-0 w-full max-w-full bg-card",
  navbar: "rounded-l-2xl border-r border-border bg-card py-8 px-4",
  navbarButton: "rounded-xl transition-colors hover:bg-accent",
  navbarButtonActive: "bg-accent text-foreground",
  scrollBox: "rounded-none bg-card px-6 py-8",
  pageScrollBox: "rounded-r-2xl bg-card",
  page: "bg-card text-foreground w-full",
  profileSection: "border-b border-border pb-6 mb-6 w-full",
  profileSectionPrimaryButton:
    "rounded-full bg-secondary hover:bg-accent text-foreground text-xs font-medium px-3 py-1.5 transition-colors border border-border",
  profileSectionContent: "text-foreground w-full",
  profileSectionTitleText:
    "font-heading text-lg font-semibold border-b border-border pb-4 w-full text-foreground mb-4",
  profileSectionTitle: "w-full",
  profileSectionItem: "py-3",
  profileSectionItemLabel: "text-muted-foreground text-xs font-medium",
  profileSectionItemValue: "text-foreground text-sm font-medium",
  profileSectionItem__emailAddresses: "py-3",
  profileSectionItem__connectedAccounts: "py-3",
  userButtonPopoverCard:
    "rounded-2xl border border-border shadow-lg bg-popover",
  userButtonPopoverActionButton:
    "rounded-xl hover:bg-accent transition-colors mx-2 my-1",
  userButtonPopoverActionButtonText: "font-medium text-sm text-foreground",
  userButtonPopoverActionButtonIcon: "text-muted-foreground",
  userButtonPopoverFooter: "hidden",
  userPreviewMainIdentifier: "text-base font-semibold text-foreground",
  userPreviewSecondaryIdentifier: "text-xs text-muted-foreground",
  formButtonPrimary:
    "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm h-10 border-none",
  formButtonReset:
    "rounded-full hover:bg-accent text-foreground text-sm font-medium h-10",
  formFieldInput:
    "border border-input h-10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-foreground text-sm px-3.5 transition-colors bg-background",
  formFieldLabel: "text-xs font-medium text-muted-foreground mb-1.5",
  formFieldLabelRow: "mb-1.5",
  formFieldAction: "text-primary hover:text-primary/90 text-xs font-medium",
  formFieldInputGroup: "rounded-xl",
  formHeaderTitle:
    "font-heading text-2xl font-semibold tracking-tight text-foreground mb-1",
  formHeaderSubtitle: "text-sm text-muted-foreground",
  headerTitle:
    "font-heading text-3xl font-semibold tracking-tight text-foreground mb-1",
  headerSubtitle: "text-sm text-muted-foreground",
  socialButtonsBlockButton:
    "border border-border hover:bg-accent transition-colors text-foreground h-10 rounded-xl bg-secondary",
  socialButtonsBlockButtonText: "font-medium text-sm text-foreground",
  dividerLine: "bg-border",
  dividerText: "text-muted-foreground text-xs font-medium",
  footerActionText: "text-muted-foreground text-sm",
  footerActionLink:
    "text-primary hover:text-primary/90 transition-colors font-medium",
  identityPreviewTextPrimary: "text-sm font-medium text-foreground",
  identityPreviewEditButtonIcon:
    "text-primary hover:text-primary/90 transition-colors",
  identityPreview: "rounded-xl bg-secondary border border-border px-3 py-2.5",
  breadcrumbsItem: "text-sm font-medium text-foreground",
  breadcrumbsItemCurrent: "text-foreground font-semibold",
  breadcrumbsSeparator: "text-muted-foreground/50",
  avatarBox:
    "rounded-full border border-border hover:border-primary/40 transition-colors overflow-hidden w-9 h-9",
  avatarImage: "rounded-full object-cover",
  userButtonTrigger:
    "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  organizationSwitcherTrigger:
    "border border-border rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent transition-colors text-foreground bg-card",
  badge:
    "rounded-full bg-secondary text-foreground text-xs px-2 py-0.5 font-medium",
  badgePrimary:
    "rounded-full bg-primary/15 text-primary text-xs px-2 py-0.5 font-medium",
  button: "rounded-full",
  backRow: "text-foreground hover:bg-accent rounded-xl px-2 py-1",
  menuList: "bg-transparent",
  menuItem: "rounded-xl hover:bg-accent text-foreground px-3 py-2",
  menuButton: "rounded-xl hover:bg-accent text-foreground",
  modal: "rounded-2xl border border-border shadow-xl bg-card",
  modalContent: "bg-card",
  modalCloseButton:
    "text-muted-foreground hover:text-foreground hover:bg-accent rounded-full",
  otpCodeFieldInput: "bg-background border-input text-foreground rounded-xl",
  alert: "rounded-xl border border-border bg-secondary",
  alertText: "text-sm text-foreground",
  table: "w-full",
  tableHead: "text-muted-foreground text-xs font-medium",
  tableRow: "border-b border-border hover:bg-accent",
  tableCell: "text-foreground text-sm py-3",
  internal: "text-primary",
  selectButton:
    "rounded-xl bg-background border border-input text-foreground h-10 hover:bg-accent",
  selectSearchInput:
    "rounded-xl bg-background border border-input text-foreground",
  selectOption: "rounded-xl text-foreground hover:bg-accent",
  selectList: "bg-popover border border-border",
  tagInputContainer: "rounded-xl bg-background border border-input",
  tagPill: "rounded-full bg-primary/15 text-primary text-xs",
  phoneInputBox: "rounded-xl bg-background border border-input",
  fileDropZone:
    "rounded-xl border-dashed border-border bg-secondary hover:bg-accent",
  verificationLinkStatusBox: "rounded-xl bg-secondary border border-border",
};

const sharedLayout = {
  socialButtonsPlacement: "bottom" as const,
  shimmer: true,
};

export const clerkDarkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#3b71ff",
    colorWarning: "#e5484d",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#11161e",
    colorInputBackground: "#0a0d12",
    colorInputText: "#f0f3f7",
    colorText: "#f0f3f7",
    colorTextSecondary: "#8d98a7",
    colorNeutral: "#f0f3f7",
    colorForeground: "#f0f3f7",
    colorMutedForeground: "#8d98a7",
    colorMuted: "#18202b",
    colorShimmer: "rgba(255, 255, 255, 0.08)",
    colorRing: "rgba(75, 126, 255, 0.45)",
    colorModalBackdrop: "rgba(0, 0, 0, 0.65)",
    colorInput: "rgba(255, 255, 255, 0.13)",
    colorInputForeground: "#f0f3f7",
    colorDanger: "#e5484d",
    colorSuccess: "#22c55e",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
  },
  elements: sharedElements,
  layout: sharedLayout,
};

export const clerkLightAppearance = {
  variables: {
    colorPrimary: "#1d5bff",
    colorWarning: "#d12e34",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorInputBackground: "#f5f6f8",
    colorInputText: "#0d1117",
    colorText: "#0d1117",
    colorTextSecondary: "#525c68",
    colorNeutral: "#0d1117",
    colorForeground: "#0d1117",
    colorMutedForeground: "#525c68",
    colorMuted: "#eceff3",
    colorShimmer: "rgba(13, 17, 23, 0.06)",
    colorRing: "rgba(29, 91, 255, 0.32)",
    colorModalBackdrop: "rgba(13, 17, 23, 0.35)",
    colorInput: "#cdd5df",
    colorInputForeground: "#0d1117",
    colorDanger: "#d12e34",
    colorSuccess: "#16a34a",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
  },
  elements: sharedElements,
  layout: sharedLayout,
};

/** @deprecated Use clerkDarkAppearance or getClerkAppearance(theme) instead */
export const clerkAppearance = clerkDarkAppearance;

export function getClerkAppearance(theme: string | undefined) {
  return theme === "light" ? clerkLightAppearance : clerkDarkAppearance;
}
