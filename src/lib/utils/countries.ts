export interface Country {
  name: {
    common: string
  }
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
  cca2: string
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2")
    const countries: Country[] = await response.json()

    return countries
      .filter((country) => country.idd?.root && country.idd?.suffixes)
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
  } catch (error) {
    console.error("Failed to fetch countries:", error)
    // Fallback data
    return [
      {
        name: { common: "United States" },
        idd: { root: "+1", suffixes: [""] },
        flag: "🇺🇸",
        cca2: "US",
      },
      {
        name: { common: "United Kingdom" },
        idd: { root: "+44", suffixes: [""] },
        flag: "🇬🇧",
        cca2: "GB",
      },
      {
        name: { common: "India" },
        idd: { root: "+91", suffixes: [""] },
        flag: "🇮🇳",
        cca2: "IN",
      },
    ]
  }
}

export function getDialCode(country: Country): string {
  return country.idd.root + (country.idd.suffixes[0] || "")
}
