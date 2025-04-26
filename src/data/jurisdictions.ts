
// List of supported jurisdictions with their display names and ISO codes
export type Jurisdiction = {
  code: string;
  name: string;
  flag: string;
};

export const jurisdictions: Jurisdiction[] = [
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "eu", name: "European Union", flag: "🇪🇺" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "jp", name: "Japan", flag: "🇯🇵" },
  { code: "sg", name: "Singapore", flag: "🇸🇬" },
];

// Default jurisdiction if none is selected
export const DEFAULT_JURISDICTION = "us";
