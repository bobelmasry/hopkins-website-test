export type HopkinsConfiguration = {
  businessDomain: string;
  competitorDomains: string[];
  questions: string[];
};

const configurationStorageKey = "hopkins-configuration";

export function loadConfiguration(): HopkinsConfiguration | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedConfiguration = window.localStorage.getItem(configurationStorageKey);

  if (!storedConfiguration) {
    return null;
  }

  try {
    return JSON.parse(storedConfiguration) as HopkinsConfiguration;
  } catch {
    return null;
  }
}

export function saveConfiguration(configuration: HopkinsConfiguration) {
  window.localStorage.setItem(configurationStorageKey, JSON.stringify(configuration));
  console.log("Saved Hopkins configuration to localStorage:", configuration);
}