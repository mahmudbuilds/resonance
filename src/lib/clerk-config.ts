import { dark } from "@clerk/themes";

const sharedElements = {
  rootBox: "w-full",
  card: "rounded-[2rem] border border-border shadow-2xl shadow-foreground/10 p-0 w-full max-w-full bg-background",
  navbar: "rounded-l-[2rem] border-r border-border bg-background py-8 px-4",
  navbarButton: "rounded-xl transition-colors hover:bg-accent",
  navbarButtonActive: "bg-accent text-foreground",
  scrollBox: "rounded-none bg-background px-6 py-8",
  pageScrollBox: "rounded-r-[2rem] bg-background",
  page: "bg-background text-foreground w-full",
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
    "rounded-3xl border border-border shadow-2xl shadow-foreground/10 bg-background",
  userButtonPopoverActionButton: "rounded-xl hover:bg-accent transition-colors mx-2 my-1",
  userButtonPopoverActionButtonText: "font-medium text-sm text-foreground",
  userButtonPopoverActionButtonIcon: "text-muted-foreground",
  userButtonPopoverFooter: "hidden",
  userPreviewMainIdentifier: "text-base font-semibold text-foreground",
  userPreviewSecondaryIdentifier: "text-xs text-muted-foreground",
  formButtonPrimary:
    "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-medium text-sm h-11 border-none shadow-lg shadow-primary/20",
  formButtonReset: "rounded-full hover:bg-accent text-foreground text-sm font-medium h-11",
  formFieldInput:
    "glass-card border-border h-11 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-foreground text-sm px-3.5 transition-all bg-secondary",
  formFieldLabel: "text-xs font-medium text-muted-foreground mb-1.5",
  formFieldLabelRow: "mb-1.5",
  formFieldAction: "text-primary hover:text-primary/90 text-xs font-medium",
  formFieldInputGroup: "rounded-xl",
  formHeaderTitle: "font-heading text-2xl font-semibold tracking-tight text-foreground mb-1",
  formHeaderSubtitle: "text-sm text-muted-foreground",
  headerTitle: "font-heading text-3xl font-semibold tracking-tight text-foreground mb-1",
  headerSubtitle: "text-sm text-muted-foreground",
  socialButtonsBlockButton:
    "glass-card border-border hover:border-primary/30 hover:bg-accent transition-all text-foreground h-11 rounded-xl bg-secondary",
  socialButtonsBlockButtonText: "font-medium text-sm text-foreground",
  dividerLine: "bg-border",
  dividerText: "text-muted-foreground text-xs font-medium",
  footerActionText: "text-muted-foreground text-sm",
  footerActionLink: "text-primary hover:text-primary/90 transition-colors font-medium",
  identityPreviewTextPrimary: "text-sm font-medium text-foreground",
  identityPreviewEditButtonIcon: "text-primary hover:text-primary/90 transition-colors",
  identityPreview: "rounded-xl bg-secondary border border-border px-3 py-2.5",
  breadcrumbsItem: "text-sm font-medium text-foreground",
  breadcrumbsItemCurrent: "text-foreground font-semibold",
  breadcrumbsSeparator: "text-muted-foreground/50",
  avatarBox:
    "rounded-full border border-border hover:border-primary/30 transition-colors overflow-hidden w-9 h-9",
  avatarImage: "rounded-full object-cover",
  userButtonTrigger:
    "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  organizationSwitcherTrigger:
    "glass-card border-border rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent transition-colors text-foreground",
  badge: "rounded-full bg-secondary text-foreground text-xs px-2 py-0.5 font-medium",
  badgePrimary: "rounded-full bg-primary/20 text-primary text-xs px-2 py-0.5 font-medium",
  button: "rounded-full",
  backRow: "text-foreground hover:bg-accent rounded-xl px-2 py-1",
  menuList: "bg-transparent",
  menuItem: "rounded-xl hover:bg-accent text-foreground px-3 py-2",
  menuButton: "rounded-xl hover:bg-accent text-foreground",
  modal: "rounded-3xl border border-border shadow-2xl shadow-foreground/10 bg-background",
  modalContent: "bg-background",
  modalCloseButton: "text-muted-foreground hover:text-foreground hover:bg-accent rounded-full",
  otpCodeFieldInput: "bg-secondary border-border text-foreground rounded-xl",
  alert: "rounded-xl border border-border bg-secondary",
  alertText: "text-sm text-foreground",
  table: "w-full",
  tableHead: "text-muted-foreground text-xs font-medium",
  tableRow: "border-b border-border hover:bg-accent",
  tableCell: "text-foreground text-sm py-3",
  internal: "text-primary",
  selectButton:
    "rounded-xl bg-secondary border border-border text-foreground h-11 hover:bg-accent",
  selectSearchInput: "rounded-xl bg-secondary border border-border text-foreground",
  selectOption: "rounded-lg text-foreground hover:bg-accent",
  selectList: "bg-background border border-border",
  tagInputContainer: "rounded-xl bg-secondary border border-border",
  tagPill: "rounded-full bg-primary/20 text-primary text-xs",
  phoneInputBox: "rounded-xl bg-secondary border border-border",
  fileDropZone: "rounded-xl border-dashed border-border bg-secondary hover:bg-accent",
  verificationLinkStatusBox: "rounded-xl bg-secondary border border-border",
};

const sharedLayout = {
  socialButtonsPlacement: "bottom" as const,
  shimmer: true,
};

export const clerkDarkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#6366f1",
    colorWarning: "#ef4444",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#0a0a0b",
    colorInputBackground: "rgba(255, 255, 255, 0.08)",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#a1a1aa",
    colorNeutral: "#ffffff",
    colorForeground: "#ffffff",
    colorMutedForeground: "#a1a1aa",
    colorMuted: "rgba(255, 255, 255, 0.06)",
    colorShimmer: "rgba(255, 255, 255, 0.08)",
    colorRing: "rgba(99, 102, 241, 0.5)",
    colorModalBackdrop: "rgba(0, 0, 0, 0.7)",
    colorInput: "rgba(255, 255, 255, 0.08)",
    colorInputForeground: "#ffffff",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    borderRadius: "1rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
  },
  elements: sharedElements,
  layout: sharedLayout,
};

export const clerkLightAppearance = {
  variables: {
    colorPrimary: "#6366f1",
    colorWarning: "#ef4444",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#f7f8fc",
    colorInputBackground: "rgba(15, 18, 25, 0.04)",
    colorInputText: "#0f1219",
    colorText: "#0f1219",
    colorTextSecondary: "#64748b",
    colorNeutral: "#0f1219",
    colorForeground: "#0f1219",
    colorMutedForeground: "#64748b",
    colorMuted: "rgba(15, 18, 25, 0.04)",
    colorShimmer: "rgba(15, 18, 25, 0.06)",
    colorRing: "rgba(99, 102, 241, 0.4)",
    colorModalBackdrop: "rgba(15, 18, 25, 0.4)",
    colorInput: "rgba(15, 18, 25, 0.08)",
    colorInputForeground: "#0f1219",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    borderRadius: "1rem",
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
