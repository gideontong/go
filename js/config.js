/**
 * Gideon's Travel Guide - Configuration & Metadata
 * Defines travel regions, country mappings, URLs, visual styling, and metadata lookup.
 */

const REGIONS_CONFIG = {
  "North America": {
    id: "north-america",
    name: "North America",
    tagline: "Wilderness, Coastlines & Iconic Metropolises",
    description: "From rugged Canadian Rockies to vibrant American cities, national parks, and coastal drives.",
    countries: ["US", "CA"],
    link: "https://na.gideontong.com/",
    color: "#3b82f6", // Blue
    darkColor: "#60a5fa",
    icon: "🌲",
  },
  "Central America": {
    id: "central-america",
    name: "Central America",
    tagline: "Ancient Maya Pyramids & Tropical Coasts",
    description: "Rich volcanic landscapes, colonial heritage, vibrant markets, and Caribbean breezes.",
    countries: ["MX", "GT"],
    link: "https://centralamerica.gideontong.com/",
    color: "#0ea5e9", // Light Blue / Sky
    darkColor: "#38bdf8",
    icon: "🌋",
  },
  "South America": {
    id: "south-america",
    name: "South America",
    tagline: "Andes Peaks, Galápagos Wonders & Cultural Rhythms",
    description: "Spectacular biodiversity, high-altitude Andean trails, and rich culinary traditions.",
    countries: ["CL", "EC", "CO"],
    link: "https://southamerica.gideontong.com/",
    color: "#10b981", // Emerald Green
    darkColor: "#34d399",
    icon: "🏔️",
  },
  "Europe": {
    id: "europe",
    name: "Europe",
    tagline: "Historic Capitals, Alpine Lakes & Mediterranean Sun",
    description: "Centuries of architecture, world-class art, charming cobblestone towns, and diverse cultures.",
    countries: [
      "AL", "AD", "AT", "BE", "BA", "BG", "HR", "CY", "CZ", "DK",
      "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LU",
      "MK", "MT", "MD", "MC", "ME", "NL", "NO", "PL", "PT", "RO",
      "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "BY", "GB",
      "VA", "XK", "TR",
    ],
    link: "https://europe.gideontong.com/",
    color: "#f59e0b", // Amber
    darkColor: "#fbbf24",
    icon: "🏰",
  },
  "East Asia": {
    id: "east-asia",
    name: "East Asia",
    tagline: "Ancient Shrines, Neon Skylines & Culinary Wonders",
    description: "Harmonious blend of time-honored traditions, futuristic technology, and sensational street food.",
    countries: ["JP", "ID", "SG", "TH", "VN", "CN", "KR", "TW", "MY"],
    link: "https://asia.gideontong.com/",
    color: "#ef4444", // Red / Coral
    darkColor: "#f87171",
    icon: "🏮",
  },
  "South Asia": {
    id: "south-asia",
    name: "South Asia",
    tagline: "Palaces, Spice Routes & Spiritual Heritage",
    description: "Royal fortresses, diverse regional cuisines, vibrant festivals, and deep historical traditions.",
    countries: ["IN"],
    link: "https://southasia.gideontong.com/",
    color: "#d946ef", // Fuchsia
    darkColor: "#e879f9",
    icon: "🪷",
  },
  "Middle East": {
    id: "middle-east",
    name: "Middle East",
    tagline: "Desert Wonders, Ancient Crossroads & Historic Oases",
    description: "Archaeological treasures, dramatic desert dunes, coastal horizons, and warm hospitality.",
    countries: ["SY", "IL", "JO", "KW"],
    link: "https://middleeast.gideontong.com/",
    color: "#8b5cf6", // Violet
    darkColor: "#a78bfa",
    icon: "✨",
  },
  "Oceania": {
    id: "oceania",
    name: "Oceania",
    tagline: "Great Barrier Reefs, Outback Horizons & Fjordlands",
    description: "Sun-drenched coastlines, endemic wildlife, lush fern forests, and adventurous terrain.",
    countries: ["AU", "NZ"],
    link: "https://oceania.gideontong.com/",
    color: "#ec4899", // Pink
    darkColor: "#f472b6",
    icon: "🦘",
  },
  "Africa": {
    id: "africa",
    name: "Africa",
    tagline: "Unique Biodiversity, Baobabs & Island Sanctuaries",
    description: "Extraordinary endemic wildlife, pristine coastlines, and untamed natural beauty.",
    countries: ["MG"],
    link: "https://africa.gideontong.com/",
    color: "#eab308", // Golden Yellow
    darkColor: "#facc15",
    icon: "🌴",
  },
};

/**
 * ISO 3166-1 alpha-2 country code lookup mapping
 * Returns full name and flag emoji for each destination
 */
const COUNTRY_LOOKUP = {
  // North America
  US: { name: "United States", flag: "🇺🇸" },
  CA: { name: "Canada", flag: "🇨🇦" },
  
  // Central America
  MX: { name: "Mexico", flag: "🇲🇽" },
  GT: { name: "Guatemala", flag: "🇬🇹" },
  
  // South America
  CL: { name: "Chile", flag: "🇨🇱" },
  EC: { name: "Ecuador", flag: "🇪🇨" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  
  // Europe
  AL: { name: "Albania", flag: "🇦🇱" },
  AD: { name: "Andorra", flag: "🇦🇩" },
  AT: { name: "Austria", flag: "🇦🇹" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  BA: { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  BG: { name: "Bulgaria", flag: "🇧🇬" },
  HR: { name: "Croatia", flag: "🇭🇷" },
  CY: { name: "Cyprus", flag: "🇨🇾" },
  CZ: { name: "Czech Republic", flag: "🇨🇿" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  FI: { name: "Finland", flag: "🇫🇮" },
  FR: { name: "France", flag: "🇫🇷" },
  DE: { name: "Germany", flag: "🇩🇪" },
  GR: { name: "Greece", flag: "🇬🇷" },
  HU: { name: "Hungary", flag: "🇭🇺" },
  IS: { name: "Iceland", flag: "🇮🇸" },
  IE: { name: "Ireland", flag: "🇮🇪" },
  IT: { name: "Italy", flag: "🇮🇹" },
  LV: { name: "Latvia", flag: "🇱🇻" },
  LU: { name: "Luxembourg", flag: "🇱🇺" },
  MK: { name: "North Macedonia", flag: "🇲🇰" },
  MT: { name: "Malta", flag: "🇲🇹" },
  MD: { name: "Moldova", flag: "🇲🇩" },
  MC: { name: "Monaco", flag: "🇲🇨" },
  ME: { name: "Montenegro", flag: "🇲🇪" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  NO: { name: "Norway", flag: "🇳🇴" },
  PL: { name: "Poland", flag: "🇵🇱" },
  PT: { name: "Portugal", flag: "🇵🇹" },
  RO: { name: "Romania", flag: "🇷🇴" },
  SM: { name: "San Marino", flag: "🇸🇲" },
  RS: { name: "Serbia", flag: "🇷🇸" },
  SK: { name: "Slovakia", flag: "🇸🇰" },
  SI: { name: "Slovenia", flag: "🇸🇮" },
  ES: { name: "Spain", flag: "🇪🇸" },
  SE: { name: "Sweden", flag: "🇸🇪" },
  CH: { name: "Switzerland", flag: "🇨🇭" },
  UA: { name: "Ukraine", flag: "🇺🇦" },
  BY: { name: "Belarus", flag: "🇧🇾" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  VA: { name: "Vatican City", flag: "🇻🇦" },
  XK: { name: "Kosovo", flag: "🇽🇰" },
  TR: { name: "Turkey", flag: "🇹🇷" },
  
  // East Asia
  JP: { name: "Japan", flag: "🇯🇵" },
  ID: { name: "Indonesia", flag: "🇮🇩" },
  SG: { name: "Singapore", flag: "🇸🇬" },
  TH: { name: "Thailand", flag: "🇹🇭" },
  VN: { name: "Vietnam", flag: "🇻🇳" },
  CN: { name: "China", flag: "🇨🇳" },
  KR: { name: "South Korea", flag: "🇰🇷" },
  TW: { name: "Taiwan", flag: "🇹🇼" },
  MY: { name: "Malaysia", flag: "🇲🇾" },
  
  // South Asia
  IN: { name: "India", flag: "🇮🇳" },
  
  // Middle East
  SY: { name: "Syria", flag: "🇸🇾" },
  IL: { name: "Israel", flag: "🇮🇱" },
  JO: { name: "Jordan", flag: "🇯🇴" },
  KW: { name: "Kuwait", flag: "🇰🇼" },
  
  // Oceania
  AU: { name: "Australia", flag: "🇦🇺" },
  NZ: { name: "New Zealand", flag: "🇳🇿" },
  
  // Africa
  MG: { name: "Madagascar", flag: "🇲🇬" },
};

/**
 * Process the configuration into indexed structures for fast lookups & jsVectorMap
 */
function getProcessedData() {
  const countryToRegionMap = {};
  const regionColors = {};
  const allCountriesList = [];

  let totalCountriesCount = 0;
  const regionEntries = Object.entries(REGIONS_CONFIG);

  regionEntries.forEach(([regionName, data]) => {
    regionColors[regionName] = data.color;
    data.countries.forEach((code) => {
      countryToRegionMap[code] = regionName;
      totalCountriesCount++;
      const lookup = COUNTRY_LOOKUP[code] || { name: code, flag: "🌐" };
      allCountriesList.push({
        code,
        name: lookup.name,
        flag: lookup.flag,
        regionName,
        regionData: data,
      });
    });
  });

  return {
    countryToRegionMap,
    regionColors,
    totalRegions: regionEntries.length,
    totalCountries: totalCountriesCount,
    allCountriesList,
  };
}

/**
 * Returns country info object { name, flag, regionName, region } by ISO code
 */
function getCountryDetails(code) {
  if (!code) return null;
  const upperCode = code.toUpperCase();
  const lookup = COUNTRY_LOOKUP[upperCode] || { name: upperCode, flag: "🌐" };
  const processed = getProcessedData();
  const regionName = processed.countryToRegionMap[upperCode];
  const region = regionName ? REGIONS_CONFIG[regionName] : null;

  return {
    code: upperCode,
    name: lookup.name,
    flag: lookup.flag,
    regionName: regionName || "Uncharted",
    region: region || null,
    hasGuide: Boolean(region),
  };
}
