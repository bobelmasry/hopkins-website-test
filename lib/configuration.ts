export type Brand = { domain: string; name: string; aliases: string[] };
export type HopkinsConfiguration = {
  businessDomain: string;
  competitorDomains: string[];
  questions: string[];
  brands?: Brand[];
};
const configurationStorageKey = "hopkins-configuration";

export function loadConfiguration(): HopkinsConfiguration | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(configurationStorageKey);
  if (!stored) return null;
  try {
    const value = JSON.parse(stored);
    if (typeof value.businessDomain !== "string" || !Array.isArray(value.competitorDomains) || !value.competitorDomains.every((d: unknown) => typeof d === "string") || !Array.isArray(value.questions) || !value.questions.every((q: unknown) => typeof q === "string")) return null;
    if (value.brands && (!Array.isArray(value.brands) || !value.brands.every((b: Brand) => b && typeof b.domain === "string" && typeof b.name === "string" && Array.isArray(b.aliases) && b.aliases.every((a) => typeof a === "string")))) delete value.brands;
    return value;
  } catch { return null; }
}

export function saveConfiguration(configuration: HopkinsConfiguration) {
  window.localStorage.setItem(configurationStorageKey, JSON.stringify(configuration));
}

export function configuredBrands(configuration: HopkinsConfiguration): Brand[] {
  return [configuration.businessDomain, ...configuration.competitorDomains].filter(Boolean).map((domain) => configuration.brands?.find((brand) => brand.domain === domain) ?? { domain, name: "", aliases: [] });
}
