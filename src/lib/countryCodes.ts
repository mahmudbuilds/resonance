export function getFullLanguageName(code: string | undefined): string {
  if (!code) return "Unknown";
  try {
    // Convert generic codes to their full language name using the Intl API
    // e.g., 'en-US' -> 'American English', 'fr' -> 'French'
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    return displayNames.of(code) || code;
  } catch (e) {
    return code;
  }
}
