import { dark } from "@clerk/themes";

const sharedElements = {
  rootBox: "w-full",
  card: "rounded-xl border border-border shadow-sm p-0 w-full max-w-full bg-card",
  navbar: "rounded-l-xl border-r border-border bg-card py-8 px-4",
  navbarButton: "rounded-lg transition-colors hover:bg-accent",
  navbarButtonActive: "bg-accent text-foreground",
  scrollBox: "rounded-none bg-card px-6 py-8",
  pageScrollBox: "rounded-r-xl bg-card",
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
  userButtonPopoverCard: "rounded-xl border border-border shadow-lg bg-popover",
  userButtonPopoverActionButton:
    "rounded-lg hover:bg-accent transition-colors mx-2 my-1",
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
    "border border-input h-10 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-foreground text-sm px-3.5 transition-colors bg-background",
  formFieldLabel: "text-xs font-medium text-muted-foreground mb-1.5",
  formFieldLabelRow: "mb-1.5",
  formFieldAction: "text-primary hover:text-primary/90 text-xs font-medium",
  formFieldInputGroup: "rounded-lg",
  formHeaderTitle:
    "font-heading text-2xl font-semibold tracking-tight text-foreground mb-1",
  formHeaderSubtitle: "text-sm text-muted-foreground",
  headerTitle:
    "font-heading text-3xl font-semibold tracking-tight text-foreground mb-1",
  headerSubtitle: "text-sm text-muted-foreground",
  socialButtonsBlockButton:
    "border border-border hover:bg-accent transition-colors text-foreground h-10 rounded-lg bg-secondary",
  socialButtonsBlockButtonText: "font-medium text-sm text-foreground",
  dividerLine: "bg-border",
  dividerText: "text-muted-foreground text-xs font-medium",
  footerActionText: "text-muted-foreground text-sm",
  footerActionLink:
    "text-primary hover:text-primary/90 transition-colors font-medium",
  identityPreviewTextPrimary: "text-sm font-medium text-foreground",
  identityPreviewEditButtonIcon:
    "text-primary hover:text-primary/90 transition-colors",
  identityPreview: "rounded-lg bg-secondary border border-border px-3 py-2.5",
  breadcrumbsItem: "text-sm font-medium text-foreground",
  breadcrumbsItemCurrent: "text-foreground font-semibold",
  breadcrumbsSeparator: "text-muted-foreground/50",
  avatarBox:
    "rounded-full border border-border hover:border-primary/40 transition-colors overflow-hidden w-9 h-9",
  avatarImage: "rounded-full object-cover",
  userButtonTrigger:
    "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  organizationSwitcherTrigger:
    "border border-border rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors text-foreground bg-card",
  badge:
    "rounded-full bg-secondary text-foreground text-xs px-2 py-0.5 font-medium",
  badgePrimary:
    "rounded-full bg-primary/15 text-primary text-xs px-2 py-0.5 font-medium",
  button: "rounded-full",
  backRow: "text-foreground hover:bg-accent rounded-lg px-2 py-1",
  menuList: "bg-transparent",
  menuItem: "rounded-lg hover:bg-accent text-foreground px-3 py-2",
  menuButton: "rounded-lg hover:bg-accent text-foreground",
  modal: "rounded-xl border border-border shadow-xl bg-card",
  modalContent: "bg-card",
  modalCloseButton:
    "text-muted-foreground hover:text-foreground hover:bg-accent rounded-full",
  otpCodeFieldInput: "bg-background border-input text-foreground rounded-lg",
  alert: "rounded-lg border border-border bg-secondary",
  alertText: "text-sm text-foreground",
  table: "w-full",
  tableHead: "text-muted-foreground text-xs font-medium",
  tableRow: "border-b border-border hover:bg-accent",
  tableCell: "text-foreground text-sm py-3",
  internal: "text-primary",
  selectButton:
    "rounded-lg bg-background border border-input text-foreground h-10 hover:bg-accent",
  selectSearchInput:
    "rounded-lg bg-background border border-input text-foreground",
  selectOption: "rounded-lg text-foreground hover:bg-accent",
  selectList: "bg-popover border border-border",
  tagInputContainer: "rounded-lg bg-background border border-input",
  tagPill: "rounded-full bg-primary/15 text-primary text-xs",
  phoneInputBox: "rounded-lg bg-background border border-input",
  fileDropZone:
    "rounded-lg border-dashed border-border bg-secondary hover:bg-accent",
  verificationLinkStatusBox: "rounded-lg bg-secondary border border-border",
};

const sharedLayout = {
  socialButtonsPlacement: "bottom" as const,
  shimmer: true,
};

export const clerkDarkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#c43c19",
    colorWarning: "#e03e3e",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#14161b",
    colorInputBackground: "#0c0d10",
    colorInputText: "#f2f2f0",
    colorText: "#f2f2f0",
    colorTextSecondary: "#9da1ac",
    colorNeutral: "#f2f2f0",
    colorForeground: "#f2f2f0",
    colorMutedForeground: "#9da1ac",
    colorMuted: "#1b1e25",
    colorShimmer: "rgba(255, 255, 255, 0.08)",
    colorRing: "rgba(217, 76, 40, 0.45)",
    colorModalBackdrop: "rgba(0, 0, 0, 0.65)",
    colorInput: "rgba(255, 255, 255, 0.13)",
    colorInputForeground: "#f2f2f0",
    colorDanger: "#e03e3e",
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
    colorPrimary: "#c83e1d",
    colorWarning: "#c92a2a",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8f8f6",
    colorInputText: "#111215",
    colorText: "#111215",
    colorTextSecondary: "#5a5d66",
    colorNeutral: "#111215",
    colorForeground: "#111215",
    colorMutedForeground: "#5a5d66",
    colorMuted: "#f1f1ee",
    colorShimmer: "rgba(17, 18, 21, 0.06)",
    colorRing: "rgba(200, 62, 29, 0.35)",
    colorModalBackdrop: "rgba(17, 18, 21, 0.35)",
    colorInput: "#d8d8d2",
    colorInputForeground: "#111215",
    colorDanger: "#c92a2a",
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
