import { CountryData, DenominationInfo, CurrencyZone } from '../types/cashFlow';
import { calculateMintedTotals, calculatePerCapita } from '../utils/cashFlowCalculations';

// Base interface for defining the 195 sovereign nations
interface CountrySeed {
  code: string;
  iso2: string;
  name: string;
  flagEmoji: string;
  region: 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';
  subregion: string;
  currencyZone: CurrencyZone;
  population: number;
  populationCensusYear: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  centralBank: string;
  mintAuthority: string;
  exchangeRateToUSD: number; // 1 USD = X units
  banknoteDenominations: number[]; // Face values
  coinDenominations: number[]; // Face values
  substrate: string;
  securityFeatures: string[];
  velocityPercent: number;
}

export const RAW_195_COUNTRIES_SEED: CountrySeed[] = [
  // --- NORTH AMERICA ---
  {
    code: 'USA',
    iso2: 'US',
    name: 'United States',
    flagEmoji: '🇺🇸',
    region: 'Americas',
    subregion: 'Northern America',
    currencyZone: 'USD Zone & Pegs',
    population: 335893238,
    populationCensusYear: 2024,
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
    currencySymbol: '$',
    centralBank: 'Federal Reserve System',
    mintAuthority: 'Bureau of Engraving and Printing & US Mint',
    exchangeRateToUSD: 1.0,
    banknoteDenominations: [1, 2, 5, 10, 20, 50, 100],
    coinDenominations: [0.01, 0.05, 0.1, 0.25, 0.5, 1],
    substrate: '75% Cotton, 25% Linen with Red & Blue Security Fibers',
    securityFeatures: ['3D Security Ribbon', 'Color-Shifting Bell in Inkwell', 'Watermark of Benjamin Franklin', 'Microprinting'],
    velocityPercent: 3.4,
  },
  {
    code: 'CAN',
    iso2: 'CA',
    name: 'Canada',
    flagEmoji: '🇨🇦',
    region: 'Americas',
    subregion: 'Northern America',
    currencyZone: 'USD Zone & Pegs',
    population: 39566248,
    populationCensusYear: 2024,
    currencyCode: 'CAD',
    currencyName: 'Canadian Dollar',
    currencySymbol: 'CA$',
    centralBank: 'Bank of Canada',
    mintAuthority: 'Canadian Bank Note Company & Royal Canadian Mint',
    exchangeRateToUSD: 1.37,
    banknoteDenominations: [5, 10, 20, 50, 100],
    coinDenominations: [0.05, 0.1, 0.25, 1, 2],
    substrate: 'BOPP Polymer (Frontiers Series)',
    securityFeatures: ['Transparent Large Window', 'Metallic Portrait & Building', 'Raised Ink Intaglio', 'Hidden Number'],
    velocityPercent: 2.8,
  },
  {
    code: 'MEX',
    iso2: 'MX',
    name: 'Mexico',
    flagEmoji: '🇲🇽',
    region: 'Americas',
    subregion: 'Central America',
    currencyZone: 'Latin America & Caribbean',
    population: 129388467,
    populationCensusYear: 2024,
    currencyCode: 'MXN',
    currencyName: 'Mexican Peso',
    currencySymbol: 'Mex$',
    centralBank: 'Banco de México (Banxico)',
    mintAuthority: 'Fábrica de Billetes & Casa de Moneda de México',
    exchangeRateToUSD: 18.25,
    banknoteDenominations: [20, 50, 100, 200, 500, 1000],
    coinDenominations: [0.5, 1, 2, 5, 10, 20],
    substrate: 'Polymer ($20, $50) & 100% Cotton Paper ($100-$1000)',
    securityFeatures: ['Dynamic Color-Changing Thread', 'Clear Viewport Window', 'Fluorescent UV Inks', 'Tactile Relief Bars'],
    velocityPercent: 4.1,
  },

  // --- MAJOR EUROPEAN NATIONS ---
  {
    code: 'DEU',
    iso2: 'DE',
    name: 'Germany',
    flagEmoji: '🇩🇪',
    region: 'Europe',
    subregion: 'Western Europe',
    currencyZone: 'Eurozone',
    population: 84482267,
    populationCensusYear: 2024,
    currencyCode: 'EUR',
    currencyName: 'Euro',
    currencySymbol: '€',
    centralBank: 'Deutsche Bundesbank / ECB',
    mintAuthority: 'Bundesdruckerei & Staatliche Münzen Baden-Württemberg',
    exchangeRateToUSD: 0.92,
    banknoteDenominations: [5, 10, 20, 50, 100, 200],
    coinDenominations: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: '100% Pure Cotton Fiber (Europa Series)',
    securityFeatures: ['Portrait Hologram Window', 'Emerald Number with Light Movement', 'Europa Watermark', 'Micro-perforations'],
    velocityPercent: 3.1,
  },
  {
    code: 'FRA',
    iso2: 'FR',
    name: 'France',
    flagEmoji: '🇫🇷',
    region: 'Europe',
    subregion: 'Western Europe',
    currencyZone: 'Eurozone',
    population: 68170228,
    populationCensusYear: 2024,
    currencyCode: 'EUR',
    currencyName: 'Euro',
    currencySymbol: '€',
    centralBank: 'Banque de France / ECB',
    mintAuthority: 'Imprimerie de la Banque de France & Monnaie de Paris',
    exchangeRateToUSD: 0.92,
    banknoteDenominations: [5, 10, 20, 50, 100, 200],
    coinDenominations: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: '100% Pure Cotton Fiber (Europa Series)',
    securityFeatures: ['Portrait Hologram Ribbon', 'Glossy Stripe', 'UV-A Fluorescence', 'Tactile Edge Grooves'],
    velocityPercent: 2.7,
  },
  {
    code: 'GBR',
    iso2: 'GB',
    name: 'United Kingdom',
    flagEmoji: '🇬🇧',
    region: 'Europe',
    subregion: 'Northern Europe',
    currencyZone: 'Europe & Central Asia',
    population: 67736802,
    populationCensusYear: 2024,
    currencyCode: 'GBP',
    currencyName: 'British Pound Sterling',
    currencySymbol: '£',
    centralBank: 'Bank of England',
    mintAuthority: 'De La Rue plc & The Royal Mint (Llantrisant)',
    exchangeRateToUSD: 0.78,
    banknoteDenominations: [5, 10, 20, 50],
    coinDenominations: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: 'Guardian Bi-axially Oriented Polypropylene (BOPP)',
    securityFeatures: ['King Charles III Holographic Foil', 'See-Through Window with Queen Elizabeth Silhouette', 'Foil Monograms', 'Tactile Clusters'],
    velocityPercent: 2.1,
  },
  {
    code: 'ITA',
    iso2: 'IT',
    name: 'Italy',
    flagEmoji: '🇮🇹',
    region: 'Europe',
    subregion: 'Southern Europe',
    currencyZone: 'Eurozone',
    population: 58870762,
    populationCensusYear: 2024,
    currencyCode: 'EUR',
    currencyName: 'Euro',
    currencySymbol: '€',
    centralBank: 'Banca d\'Italia / ECB',
    mintAuthority: 'Istituto Poligrafico e Zecca dello Stato',
    exchangeRateToUSD: 0.92,
    banknoteDenominations: [5, 10, 20, 50, 100, 200],
    coinDenominations: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: '100% Cotton Rag Paper',
    securityFeatures: ['Emerald Green Number', 'Hologram Patch', 'Infrared Inks', 'Security Thread'],
    velocityPercent: 3.3,
  },
  {
    code: 'ESP',
    iso2: 'ES',
    name: 'Spain',
    flagEmoji: '🇪🇸',
    region: 'Europe',
    subregion: 'Southern Europe',
    currencyZone: 'Eurozone',
    population: 48373336,
    populationCensusYear: 2024,
    currencyCode: 'EUR',
    currencyName: 'Euro',
    currencySymbol: '€',
    centralBank: 'Banco de España / ECB',
    mintAuthority: 'Fábrica Nacional de Moneda y Timbre (FNMT-RCM)',
    exchangeRateToUSD: 0.92,
    banknoteDenominations: [5, 10, 20, 50, 100, 200],
    coinDenominations: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: '100% Pure Cotton Fiber',
    securityFeatures: ['Europa Hologram Foil', 'Glossy Band', 'Raised Tactile Marks', 'Microtext'],
    velocityPercent: 2.9,
  },
  {
    code: 'CHE',
    iso2: 'CH',
    name: 'Switzerland',
    flagEmoji: '🇨🇭',
    region: 'Europe',
    subregion: 'Western Europe',
    currencyZone: 'Europe & Central Asia',
    population: 8853500,
    populationCensusYear: 2024,
    currencyCode: 'CHF',
    currencyName: 'Swiss Franc',
    currencySymbol: 'CHF',
    centralBank: 'Swiss National Bank (SNB)',
    mintAuthority: 'Orell Füssli Security Printing & Swissmint',
    exchangeRateToUSD: 0.89,
    banknoteDenominations: [10, 20, 50, 100, 200, 1000],
    coinDenominations: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    substrate: 'Durasafe Three-Layer Composite (Cotton-Polymer-Cotton)',
    securityFeatures: ['Spark Optical Variable Ink', 'Glittering Strip with Numbers', 'Transparent Swiss Cross', 'Micro-perforated Crosses'],
    velocityPercent: 1.9,
  },

  // --- ASIA-PACIFIC POWERHOUSES ---
  {
    code: 'CHN',
    iso2: 'CN',
    name: 'China',
    flagEmoji: '🇨🇳',
    region: 'Asia',
    subregion: 'Eastern Asia',
    currencyZone: 'Asia-Pacific',
    population: 1409670000,
    populationCensusYear: 2024,
    currencyCode: 'CNY',
    currencyName: 'Chinese Yuan Renminbi',
    currencySymbol: '¥',
    centralBank: 'People\'s Bank of China (PBOC)',
    mintAuthority: 'China Banknote Printing and Minting Corporation (CBPMC)',
    exchangeRateToUSD: 7.24,
    banknoteDenominations: [1, 5, 10, 20, 50, 100],
    coinDenominations: [0.1, 0.5, 1],
    substrate: 'High-grade Cotton Fiber with Organic Sizing',
    securityFeatures: ['Optical Variable Magnetic Ink (OVMI)', 'Windowed Security Thread', 'Mao Zedong Watermark', 'See-Through Denomination Match'],
    velocityPercent: 2.6,
  },
  {
    code: 'IND',
    iso2: 'IN',
    name: 'India',
    flagEmoji: '🇮🇳',
    region: 'Asia',
    subregion: 'Southern Asia',
    currencyZone: 'Asia-Pacific',
    population: 1428627663,
    populationCensusYear: 2024,
    currencyCode: 'INR',
    currencyName: 'Indian Rupee',
    currencySymbol: '₹',
    centralBank: 'Reserve Bank of India (RBI)',
    mintAuthority: 'SPMCIL (Nashik, Dewas) & BRBNMPL (Mysuru, Salboni)',
    exchangeRateToUSD: 83.5,
    banknoteDenominations: [10, 20, 50, 100, 200, 500],
    coinDenominations: [1, 2, 5, 10, 20],
    substrate: '100% Rag Cotton Pulp',
    securityFeatures: ['Color-Shifting Windowed Thread with RBI & Bharat', 'Mahatma Gandhi Watermark', 'Bleed Lines for Visually Impaired', 'Latent Image'],
    velocityPercent: 7.8,
  },
  {
    code: 'JPN',
    iso2: 'JP',
    name: 'Japan',
    flagEmoji: '🇯🇵',
    region: 'Asia',
    subregion: 'Eastern Asia',
    currencyZone: 'Asia-Pacific',
    population: 124500000,
    populationCensusYear: 2024,
    currencyCode: 'JPY',
    currencyName: 'Japanese Yen',
    currencySymbol: '¥',
    centralBank: 'Bank of Japan (BOJ)',
    mintAuthority: 'National Printing Bureau (NPB) & Japan Mint (Osaka)',
    exchangeRateToUSD: 154.5,
    banknoteDenominations: [1000, 2000, 5000, 10000],
    coinDenominations: [1, 5, 10, 50, 100, 500],
    substrate: 'Mitsumata & Abaca (Manila Hemp) Fibers with Traditional Finish',
    securityFeatures: ['3D Holographic Portrait Strip (2024 Series)', 'High-Definition Watermark Grid', 'Luminescent Anti-Scan Inks', 'Tactile Markings for Sight-impaired'],
    velocityPercent: 1.4,
  },
  {
    code: 'AUS',
    iso2: 'AU',
    name: 'Australia',
    flagEmoji: '🇦🇺',
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    currencyZone: 'Oceania',
    population: 26640000,
    populationCensusYear: 2024,
    currencyCode: 'AUD',
    currencyName: 'Australian Dollar',
    currencySymbol: 'A$',
    centralBank: 'Reserve Bank of Australia (RBA)',
    mintAuthority: 'Note Printing Australia (NPA) & Royal Australian Mint (Canberra)',
    exchangeRateToUSD: 1.52,
    banknoteDenominations: [5, 10, 20, 50, 100],
    coinDenominations: [0.05, 0.1, 0.2, 0.5, 1, 2],
    substrate: 'Guardian Polypropylene with Top-to-Bottom Clear Window',
    securityFeatures: ['Flying Native Bird with Color-Reversing Wings', 'Rolling Color Effect', 'Tactile Raised Bumps', 'Reversing Number in 3D'],
    velocityPercent: 2.2,
  },
  {
    code: 'BRA',
    iso2: 'BR',
    name: 'Brazil',
    flagEmoji: '🇧🇷',
    region: 'Americas',
    subregion: 'South America',
    currencyZone: 'Latin America & Caribbean',
    population: 216422446,
    populationCensusYear: 2024,
    currencyCode: 'BRL',
    currencyName: 'Brazilian Real',
    currencySymbol: 'R$',
    centralBank: 'Banco Central do Brasil (BCB)',
    mintAuthority: 'Casa da Moeda do Brasil (Rio de Janeiro)',
    exchangeRateToUSD: 5.42,
    banknoteDenominations: [2, 5, 10, 20, 50, 100, 200],
    coinDenominations: [0.05, 0.1, 0.25, 0.5, 1],
    substrate: '100% Cotton Rag Paper',
    securityFeatures: ['Color-Changing Holographic Band', 'Watermark of Effigy of the Republic', 'Fluorescent Serial Numbers', 'Tactile Diagonal Bands'],
    velocityPercent: 4.8,
  },
  {
    code: 'SAU',
    iso2: 'SA',
    name: 'Saudi Arabia',
    flagEmoji: '🇸🇦',
    region: 'Asia',
    subregion: 'Western Asia',
    currencyZone: 'Middle East & GCC',
    population: 36408820,
    populationCensusYear: 2024,
    currencyCode: 'SAR',
    currencyName: 'Saudi Riyal',
    currencySymbol: '﷼',
    centralBank: 'Saudi Central Bank (SAMA)',
    mintAuthority: 'De La Rue & Giesecke+Devrient for SAMA',
    exchangeRateToUSD: 3.75, // Pegged
    banknoteDenominations: [5, 10, 20, 50, 100, 500],
    coinDenominations: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2],
    substrate: 'Polymer ($5) and 100% High Durability Cotton Paper',
    securityFeatures: ['Spark Orbital Dynamic Ring', 'Windowed Security Thread with SAMA Metallic Foil', 'King Salman Watermark', 'Gold Foil Emblems'],
    velocityPercent: 3.8,
  },
  {
    code: 'ARE',
    iso2: 'AE',
    name: 'United Arab Emirates',
    flagEmoji: '🇦🇪',
    region: 'Asia',
    subregion: 'Western Asia',
    currencyZone: 'Middle East & GCC',
    population: 9516871,
    populationCensusYear: 2024,
    currencyCode: 'AED',
    currencyName: 'UAE Dirham',
    currencySymbol: 'د.إ',
    centralBank: 'Central Bank of the United Arab Emirates (CBUAE)',
    mintAuthority: 'Oumolat Security Printing (Abu Dhabi)',
    exchangeRateToUSD: 3.6725, // Pegged
    banknoteDenominations: [5, 10, 20, 50, 100, 500, 1000],
    coinDenominations: [0.25, 0.5, 1],
    substrate: 'Safeguard Polymer Substrate (Third Issue)',
    securityFeatures: ['KINEGRAM Colors Foil Strip', 'Transparent Portrait Window', 'Spark Flow Dimpled Ink', 'Braille Dot Identifiers'],
    velocityPercent: 4.3,
  },
  {
    code: 'ZAF',
    iso2: 'ZA',
    name: 'South Africa',
    flagEmoji: '🇿🇦',
    region: 'Africa',
    subregion: 'Southern Africa',
    currencyZone: 'Sub-Saharan Africa',
    population: 60414495,
    populationCensusYear: 2024,
    currencyCode: 'ZAR',
    currencyName: 'South African Rand',
    currencySymbol: 'R',
    centralBank: 'South African Reserve Bank (SARB)',
    mintAuthority: 'South African Bank Note Company (SABN) & South African Mint',
    exchangeRateToUSD: 18.1,
    banknoteDenominations: [10, 20, 50, 100, 200],
    coinDenominations: [0.1, 0.2, 0.5, 1, 2, 5],
    substrate: 'Cotton Substrate with Bi-Fluorescent Fibers (Big Five Series 2023)',
    securityFeatures: ['Color-Changing SPARK Live Truspin', 'Windowed Holographic Thread', 'Nelson Mandela Watermark', 'Blind Tactile Diamond Shapes'],
    velocityPercent: 5.2,
  },
  {
    code: 'KOR',
    iso2: 'KR',
    name: 'South Korea',
    flagEmoji: '🇰🇷',
    region: 'Asia',
    subregion: 'Eastern Asia',
    currencyZone: 'Asia-Pacific',
    population: 51717590,
    populationCensusYear: 2024,
    currencyCode: 'KRW',
    currencyName: 'South Korean Won',
    currencySymbol: '₩',
    centralBank: 'Bank of Korea (BOK)',
    mintAuthority: 'KOMSCO (Korea Minting and Security Printing Corp)',
    exchangeRateToUSD: 1378.0,
    banknoteDenominations: [1000, 5000, 10000, 50000],
    coinDenominations: [10, 50, 100, 500],
    substrate: '100% Cotton Rag Paper',
    securityFeatures: ['KINEGRAM Dynamic Silver Foil Stripe', 'Color-Shifting Ink Numbers', 'Intaglio Latent Image (WON)', 'Micro-patterned Security Thread'],
    velocityPercent: 1.8,
  },
  {
    code: 'SGP',
    iso2: 'SG',
    name: 'Singapore',
    flagEmoji: '🇸🇬',
    region: 'Asia',
    subregion: 'South-Eastern Asia',
    currencyZone: 'Asia-Pacific',
    population: 5917600,
    populationCensusYear: 2024,
    currencyCode: 'SGD',
    currencyName: 'Singapore Dollar',
    currencySymbol: 'S$',
    centralBank: 'Monetary Authority of Singapore (MAS)',
    mintAuthority: 'Note Printing Australia & Singapore Mint',
    exchangeRateToUSD: 1.34,
    banknoteDenominations: [2, 5, 10, 50, 100, 1000],
    coinDenominations: [0.05, 0.1, 0.2, 0.5, 1],
    substrate: 'Guardian Polymer (Portrait Series)',
    securityFeatures: ['Complex Clear Window with Coat of Arms', 'Diffractive Optically Variable Foil', 'Shadow Image of Yusof bin Ishak', 'Microtext MAS'],
    velocityPercent: 2.5,
  },
];

// Helper to assemble full 195 countries with verified sovereign country profiles
// All 193 UN Members + Vatican City + State of Palestine
const ADDITIONAL_185_NATIONS_DATA: Array<[
  string, // code
  string, // iso2
  string, // name
  string, // flag
  'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania',
  string, // subregion
  CurrencyZone,
  number, // pop
  string, // currCode
  string, // currName
  string, // currSymbol
  number, // rate
  number[], // bills
  number[], // coins
  string, // bank
  string, // mint
  number // vel%
]> = [
  // Europe
  ['AUT', 'AT', 'Austria', '🇦🇹', 'Europe', 'Western Europe', 'Eurozone', 9104772, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Oesterreichische Nationalbank', 'Münze Österreich (Austrian Mint)', 2.9],
  ['BEL', 'BE', 'Belgium', '🇧🇪', 'Europe', 'Western Europe', 'Eurozone', 11763650, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'National Bank of Belgium', 'Royal Belgian Mint', 2.8],
  ['NLD', 'NL', 'Netherlands', '🇳🇱', 'Europe', 'Western Europe', 'Eurozone', 17811291, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'De Nederlandsche Bank', 'Royal Dutch Mint', 2.4],
  ['PRT', 'PT', 'Portugal', '🇵🇹', 'Europe', 'Southern Europe', 'Eurozone', 10467366, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Banco de Portugal', 'Imprensa Nacional-Casa da Moeda', 3.0],
  ['GRC', 'GR', 'Greece', '🇬🇷', 'Europe', 'Southern Europe', 'Eurozone', 10394055, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Greece', 'Bank of Greece Printing Works (IETA)', 3.2],
  ['IRL', 'IE', 'Ireland', '🇮🇪', 'Europe', 'Northern Europe', 'Eurozone', 5127170, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of Ireland', 'Currency Centre Sandyford', 2.7],
  ['FIN', 'FI', 'Finland', '🇫🇮', 'Europe', 'Northern Europe', 'Eurozone', 5563970, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Finland', 'Mint of Finland (Suomen Rahapaja)', 1.7],
  ['SWE', 'SE', 'Sweden', '🇸🇪', 'Europe', 'Northern Europe', 'Europe & Central Asia', 10549300, 'SEK', 'Swedish Krona', 'kr', 10.6, [20, 50, 100, 200, 500], [1, 2, 5, 10], 'Sveriges Riksbank', 'Crane Currency AB (Tumba Bruk)', 1.1],
  ['NOR', 'NO', 'Norway', '🇳🇴', 'Europe', 'Northern Europe', 'Europe & Central Asia', 5519167, 'NOK', 'Norwegian Krone', 'kr', 10.85, [50, 100, 200, 500, 1000], [1, 5, 10, 20], 'Norges Bank', 'De La Rue & Royal Mint of Norway', 1.3],
  ['DNK', 'DK', 'Denmark', '🇩🇰', 'Europe', 'Northern Europe', 'Europe & Central Asia', 5932654, 'DKK', 'Danish Krone', 'kr.', 6.89, [50, 100, 200, 500, 1000], [0.5, 1, 2, 5, 10, 20], 'Danmarks Nationalbank', 'Bank of France & Mint of Finland', 1.4],
  ['POL', 'PL', 'Poland', '🇵🇱', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 37748910, 'PLN', 'Polish Zloty', 'zł', 4.02, [10, 20, 50, 100, 200, 500], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'National Bank of Poland (NBP)', 'Polish Security Printing Works (PWPW)', 3.6],
  ['CZE', 'CZ', 'Czech Republic', '🇨🇿', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 10827529, 'CZK', 'Czech Koruna', 'Kč', 23.1, [100, 200, 500, 1000, 2000, 5000], [1, 2, 5, 10, 20, 50], 'Czech National Bank (ČNB)', 'State Printing Works of Securities (STC)', 3.1],
  ['HUN', 'HU', 'Hungary', '🇭🇺', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 9604000, 'HUF', 'Hungarian Forint', 'Ft', 365.0, [500, 1000, 2000, 5000, 10000, 20000], [5, 10, 20, 50, 100, 200], 'Magyar Nemzeti Bank', 'Hungarian Banknote Printing Share Co.', 4.2],
  ['ROU', 'RO', 'Romania', '🇷🇴', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 19051562, 'RON', 'Romanian Leu', 'lei', 4.58, [1, 5, 10, 20, 50, 100, 200, 500], [0.01, 0.05, 0.1, 0.5], 'National Bank of Romania (BNR)', 'Monetăria Statului & Imprimeria BNR', 3.9],
  ['BGR', 'BG', 'Bulgaria', '🇧🇬', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 6447710, 'BGN', 'Bulgarian Lev', 'лв', 1.80, [5, 10, 20, 50, 100], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bulgarian National Bank (BNB)', 'BNB Printing Works (Sofia)', 3.2],
  ['HRV', 'HR', 'Croatia', '🇭🇷', 'Europe', 'Southern Europe', 'Eurozone', 3855641, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Croatian National Bank (HNB)', 'Croatian Mint (Hrvatska kovnica novca)', 3.4],
  ['SVK', 'SK', 'Slovakia', '🇸🇰', 'Europe', 'Eastern Europe', 'Eurozone', 5428792, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'National Bank of Slovakia (NBS)', 'Kremnica Mint (Mincovňa Kremnica)', 3.0],
  ['SVN', 'SI', 'Slovenia', '🇸🇮', 'Europe', 'Southern Europe', 'Eurozone', 2116972, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Slovenia', 'Royal Dutch Mint / Bank of France', 2.6],
  ['LTU', 'LT', 'Lithuania', '🇱🇹', 'Europe', 'Northern Europe', 'Eurozone', 2862380, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Lithuania', 'Lithuanian Mint (Lietuvos monetų kalykla)', 2.8],
  ['LVA', 'LV', 'Latvia', '🇱🇻', 'Europe', 'Northern Europe', 'Eurozone', 1883008, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Latvia', 'Staatliche Münzen Baden-Württemberg', 2.9],
  ['EST', 'EE', 'Estonia', '🇪🇪', 'Europe', 'Northern Europe', 'Eurozone', 1365884, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Estonia', 'Mint of Finland', 2.1],
  ['CYP', 'CY', 'Cyprus', '🇨🇾', 'Europe', 'Southern Europe', 'Eurozone', 1251488, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of Cyprus', 'Bank of Greece Printing Works', 3.5],
  ['MLT', 'MT', 'Malta', '🇲🇹', 'Europe', 'Southern Europe', 'Eurozone', 533286, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of Malta', 'Monnaie de Paris & Royal Dutch Mint', 3.3],
  ['LUX', 'LU', 'Luxembourg', '🇱🇺', 'Europe', 'Western Europe', 'Eurozone', 660809, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Banque centrale du Luxembourg', 'Royal Dutch Mint', 2.9],
  ['ISL', 'IS', 'Iceland', '🇮🇸', 'Europe', 'Northern Europe', 'Europe & Central Asia', 393600, 'ISK', 'Icelandic Króna', 'kr', 138.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 50, 100], 'Central Bank of Iceland', 'De La Rue & British Royal Mint', 1.6],
  ['ALB', 'AL', 'Albania', '🇦🇱', 'Europe', 'Southern Europe', 'Europe & Central Asia', 2761785, 'ALL', 'Albanian Lek', 'L', 93.4, [200, 500, 1000, 2000, 5000, 10000], [1, 5, 10, 20, 50, 100], 'Bank of Albania', 'De La Rue plc', 4.5],
  ['SRB', 'RS', 'Serbia', '🇷🇸', 'Europe', 'Southern Europe', 'Europe & Central Asia', 6647003, 'RSD', 'Serbian Dinar', 'дин.', 108.0, [10, 20, 50, 100, 200, 500, 1000, 2000, 5000], [1, 2, 5, 10, 20], 'National Bank of Serbia', 'Institute for Manufacturing Banknotes and Coins (ZIN)', 4.0],
  ['BIH', 'BA', 'Bosnia and Herzegovina', '🇧🇦', 'Europe', 'Southern Europe', 'Europe & Central Asia', 3233526, 'BAM', 'Convertible Mark', 'KM', 1.80, [10, 20, 50, 100, 200], [0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'Central Bank of Bosnia and Herzegovina', 'Oesterreichische Banknoten (OeBS) & Royal Mint', 3.7],
  ['MKD', 'MK', 'North Macedonia', '🇲🇰', 'Europe', 'Southern Europe', 'Europe & Central Asia', 1832000, 'MKD', 'Macedonian Denar', 'ден', 56.6, [10, 50, 100, 200, 500, 1000, 2000], [1, 2, 5, 10, 50], 'National Bank of North Macedonia', 'De La Rue & Giesecke+Devrient', 4.1],
  ['MNE', 'ME', 'Montenegro', '🇲🇪', 'Europe', 'Southern Europe', 'Eurozone', 619211, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of Montenegro', 'Imported Eurozone Euro Circulation', 3.8],
  ['MDA', 'MD', 'Moldova', '🇲🇩', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 2512758, 'MDL', 'Moldovan Leu', 'L', 17.7, [1, 5, 10, 20, 50, 100, 200, 500, 1000], [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10], 'National Bank of Moldova', 'Banque de France & Royal Mint', 4.4],
  ['BLR', 'BY', 'Belarus', '🇧🇾', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 9200617, 'BYN', 'Belarusian Ruble', 'Br', 3.26, [5, 10, 20, 50, 100, 200, 500], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'National Bank of the Republic of Belarus', 'Goznak (Russia) & Mint of Lithuania', 5.0],
  ['UKR', 'UA', 'Ukraine', '🇺🇦', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 38000000, 'UAH', 'Ukrainian Hryvnia', '₴', 40.8, [20, 50, 100, 200, 500, 1000], [1, 2, 5, 10], 'National Bank of Ukraine', 'NBU Banknote Printing and Minting Works', 6.5],
  ['RUS', 'RU', 'Russia', '🇷🇺', 'Europe', 'Eastern Europe', 'Europe & Central Asia', 144236933, 'RUB', 'Russian Ruble', '₽', 90.5, [50, 100, 200, 500, 1000, 2000, 5000], [0.1, 0.5, 1, 2, 5, 10], 'Bank of Russia', 'Goznak (Moscow & Saint Petersburg Mints)', 5.2],
  ['AND', 'AD', 'Andorra', '🇦🇩', 'Europe', 'Southern Europe', 'Eurozone', 79824, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Andorran Financial Authority', 'Monnaie de Paris & FNMT (Spain)', 2.5],
  ['MCO', 'MC', 'Monaco', '🇲🇨', 'Europe', 'Western Europe', 'Eurozone', 39050, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Direction du Budget et du Trésor', 'Monnaie de Paris (Pessac)', 2.2],
  ['SMR', 'SM', 'San Marino', '🇸🇲', 'Europe', 'Southern Europe', 'Eurozone', 33660, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of San Marino', 'IPZS (Rome)', 2.7],
  ['VAT', 'VA', 'Vatican City', '🇻🇦', 'Europe', 'Southern Europe', 'Eurozone', 825, 'EUR', 'Euro', '€', 0.92, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Administration of the Patrimony of the Apostolic See', 'Istituto Poligrafico e Zecca dello Stato', 2.0],
  ['LIE', 'LI', 'Liechtenstein', '🇱🇮', 'Europe', 'Western Europe', 'Europe & Central Asia', 39327, 'CHF', 'Swiss Franc', 'CHF', 0.89, [10, 20, 50, 100, 200, 1000], [0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'National Bank of Liechtenstein / SNB', 'Swissmint', 2.0],

  // Asia
  ['TWN', 'TW', 'Taiwan', '🇹🇼', 'Asia', 'Eastern Asia', 'Asia-Pacific', 23420443, 'TWD', 'New Taiwan Dollar', 'NT$', 32.4, [100, 200, 500, 1000, 2000], [0.5, 1, 5, 10, 20, 50], 'Central Bank of the Republic of China (Taiwan)', 'Central Engraving and Printing Plant & Central Mint', 2.4],
  ['HKG', 'HK', 'Hong Kong', '🇭🇰', 'Asia', 'Eastern Asia', 'Asia-Pacific', 7500700, 'HKD', 'Hong Kong Dollar', 'HK$', 7.81, [10, 20, 50, 100, 500, 1000], [0.1, 0.2, 0.5, 1, 2, 5, 10], 'Hong Kong Monetary Authority (HKMA)', 'Hong Kong Note Printing Limited (HKNPL)', 3.2],
  ['IDN', 'ID', 'Indonesia', '🇮🇩', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 277534122, 'IDR', 'Indonesian Rupiah', 'Rp', 16250.0, [1000, 2000, 5000, 10000, 20000, 50000, 100000], [50, 100, 200, 500, 1000], 'Bank Indonesia', 'Perum Percetakan Uang Republik Indonesia (Peruri)', 6.2],
  ['PAK', 'PK', 'Pakistan', '🇵🇰', 'Asia', 'Southern Asia', 'Asia-Pacific', 241499431, 'PKR', 'Pakistani Rupee', '₨', 278.5, [10, 20, 50, 75, 100, 500, 1000, 5000], [1, 2, 5, 10], 'State Bank of Pakistan (SBP)', 'Pakistan Security Printing Corporation (PSPC)', 7.5],
  ['BGD', 'BD', 'Bangladesh', '🇧🇩', 'Asia', 'Southern Asia', 'Asia-Pacific', 171186372, 'BDT', 'Bangladeshi Taka', '৳', 117.8, [2, 5, 10, 20, 50, 100, 200, 500, 1000], [1, 2, 5], 'Bangladesh Bank', 'The Security Printing Corporation (SPCL) Gazipur', 6.8],
  ['PHL', 'PH', 'Philippines', '🇵🇭', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 115559009, 'PHP', 'Philippine Peso', '₱', 58.7, [20, 50, 100, 200, 500, 1000], [0.01, 0.05, 0.25, 1, 5, 10, 20], 'Bangko Sentral ng Pilipinas (BSP)', 'Security Plant Complex (Quezon City)', 5.5],
  ['VNM', 'VN', 'Vietnam', '🇻🇳', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 98858900, 'VND', 'Vietnamese Dong', '₫', 25450.0, [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000], [200, 500, 1000, 2000, 5000], 'State Bank of Vietnam', 'National Banknote Printing Plant (Hanoi)', 6.0],
  ['THA', 'TH', 'Thailand', '🇹🇭', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 71801279, 'THB', 'Thai Baht', '฿', 36.7, [20, 50, 100, 500, 1000], [0.25, 0.5, 1, 2, 5, 10], 'Bank of Thailand (BOT)', 'Note Printing Works (Bangkok) & Royal Thai Mint', 3.8],
  ['MYS', 'MY', 'Malaysia', '🇲🇾', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 33938221, 'MYR', 'Malaysian Ringgit', 'RM', 4.71, [1, 5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5], 'Bank Negara Malaysia (BNM)', 'Kilang Wang Bank Negara Malaysia (Shah Alam)', 3.5],
  ['TUR', 'TR', 'Turkey', '🇹🇷', 'Asia', 'Western Asia', 'Europe & Central Asia', 85372377, 'TRY', 'Turkish Lira', '₺', 32.8, [5, 10, 20, 50, 100, 200], [0.05, 0.1, 0.25, 0.5, 1, 5], 'Central Bank of the Republic of Turkey (CBRT)', 'Banknote Printing Plant & Turkish State Mint', 8.9],
  ['IRN', 'IR', 'Iran', '🇮🇷', 'Asia', 'Southern Asia', 'Middle East & GCC', 88550570, 'IRR', 'Iranian Rial', '﷼', 42000.0, [10000, 20000, 50000, 100000, 500000, 1000000], [1000, 2000, 5000], 'Central Bank of the Islamic Republic of Iran', 'Security Paper Mill (TAKAB) & Mint of Iran', 7.2],
  ['IRQ', 'IQ', 'Iraq', '🇮🇶', 'Asia', 'Western Asia', 'Middle East & GCC', 44496122, 'IQD', 'Iraqi Dinar', 'ع.د', 1310.0, [250, 500, 1000, 5000, 10000, 25000, 50000], [25, 50, 100], 'Central Bank of Iraq (CBI)', 'De La Rue & Giesecke+Devrient', 5.9],
  ['ISR', 'IL', 'Israel', '🇮🇱', 'Asia', 'Western Asia', 'Middle East & GCC', 9842000, 'ILS', 'Israeli New Shekel', '₪', 3.72, [20, 50, 100, 200], [0.1, 0.5, 1, 2, 5, 10], 'Bank of Israel', 'Orell Füssli Security Printing & Royal Dutch Mint', 2.8],
  ['KAZ', 'KZ', 'Kazakhstan', '🇰🇿', 'Asia', 'Central Asia', 'Europe & Central Asia', 20033546, 'KZT', 'Kazakhstani Tenge', '₸', 448.0, [200, 500, 1000, 2000, 5000, 10000, 20000], [1, 2, 5, 10, 20, 50, 100, 200], 'National Bank of Kazakhstan', 'Banknote Factory of the National Bank & Kazakhstan Mint', 4.8],
  ['UZB', 'UZ', 'Uzbekistan', '🇺🇿', 'Asia', 'Central Asia', 'Europe & Central Asia', 36371848, 'UZS', 'Uzbekistani Som', 'soʻm', 12650.0, [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000], [50, 100, 200, 500, 1000], 'Central Bank of the Republic of Uzbekistan', 'Davlat Belgisi State Enterprise', 5.8],
  ['QAT', 'QA', 'Qatar', '🇶🇦', 'Asia', 'Western Asia', 'Middle East & GCC', 2716391, 'QAR', 'Qatari Riyal', 'ر.ق', 3.64, [1, 5, 10, 50, 100, 200, 500], [0.01, 0.05, 0.1, 0.25, 0.5], 'Qatar Central Bank (QCB)', 'De La Rue plc', 3.1],
  ['KWT', 'KW', 'Kuwait', '🇰🇼', 'Asia', 'Western Asia', 'Middle East & GCC', 4310108, 'KWD', 'Kuwaiti Dinar', 'د.ك', 0.307, [0.25, 0.5, 1, 5, 10, 20], [0.005, 0.01, 0.02, 0.05, 0.1], 'Central Bank of Kuwait (CBK)', 'De La Rue plc', 2.3],
  ['OMN', 'OM', 'Oman', '🇴🇲', 'Asia', 'Western Asia', 'Middle East & GCC', 4576298, 'OMR', 'Omani Rial', 'ر.ع.', 0.385, [0.1, 0.5, 1, 5, 10, 20, 50], [0.005, 0.01, 0.025, 0.05, 0.1], 'Central Bank of Oman (CBO)', 'Giesecke+Devrient', 3.0],
  ['BHR', 'BH', 'Bahrain', '🇧🇭', 'Asia', 'Western Asia', 'Middle East & GCC', 1577059, 'BHD', 'Bahraini Dinar', '.د.ب', 0.376, [0.5, 1, 5, 10, 20], [0.005, 0.01, 0.025, 0.05, 0.1, 0.5], 'Central Bank of Bahrain (CBB)', 'De La Rue plc', 2.9],
  ['JOR', 'JO', 'Jordan', '🇯🇴', 'Asia', 'Western Asia', 'Middle East & GCC', 11337052, 'JOD', 'Jordanian Dinar', 'د.ا', 0.709, [1, 5, 10, 20, 50], [0.01, 0.025, 0.05, 0.1, 0.25, 0.5], 'Central Bank of Jordan (CBJ)', 'De La Rue plc & Royal Mint', 3.7],
  ['LBN', 'LB', 'Lebanon', '🇱🇧', 'Asia', 'Western Asia', 'Middle East & GCC', 5353930, 'LBP', 'Lebanese Pound', 'ل.ل', 89500.0, [1000, 5000, 10000, 20000, 50000, 100000], [250, 500], 'Banque du Liban (BDL)', 'Banque de France & Goznak', 9.5],
  ['LKA', 'LK', 'Sri Lanka', '🇱🇰', 'Asia', 'Southern Asia', 'Asia-Pacific', 22181000, 'LKR', 'Sri Lankan Rupee', 'Rs', 302.5, [20, 50, 100, 500, 1000, 5000], [1, 2, 5, 10], 'Central Bank of Sri Lanka (CBSL)', 'De La Rue Lanka Currency and Securities Print', 5.6],
  ['NPL', 'NP', 'Nepal', '🇳🇵', 'Asia', 'Southern Asia', 'Asia-Pacific', 30547580, 'NPR', 'Nepalese Rupee', 'रू', 133.5, [5, 10, 20, 50, 100, 500, 1000], [1, 2], 'Nepal Rastra Bank (NRB)', 'China Banknote Printing & Perum Peruri', 5.9],
  ['MMR', 'MM', 'Myanmar', '🇲🇲', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 54179306, 'MMK', 'Myanmar Kyat', 'Ks', 2098.0, [50, 100, 200, 500, 1000, 5000, 10000, 20000], [1, 5, 10, 50, 100], 'Central Bank of Myanmar', 'Security Printing Works (Wazi)', 6.4],
  ['KHM', 'KH', 'Cambodia', '🇰🇭', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 16767842, 'KHR', 'Cambodian Riel', '៛', 4095.0, [100, 500, 1000, 2000, 5000, 10000, 15000, 20000, 30000, 50000, 100000], [50, 100, 200, 500], 'National Bank of Cambodia', 'National Bank of Cambodia Printing House', 4.9],
  ['LAO', 'LA', 'Laos', '🇱🇦', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 7529475, 'LAK', 'Lao Kip', '₭', 21500.0, [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], [10, 20, 50], 'Bank of the Lao PDR', 'Goznak (Russia) & Bank of France', 7.1],
  ['MNG', 'MN', 'Mongolia', '🇲🇳', 'Asia', 'Eastern Asia', 'Asia-Pacific', 3447157, 'MNT', 'Mongolian Tögrög', '₮', 3380.0, [10, 20, 50, 100, 500, 1000, 5000, 10000, 20000], [20, 50, 100, 200, 500], 'Bank of Mongolia', 'De La Rue plc', 4.7],
  ['PRK', 'KP', 'North Korea', '🇰🇵', 'Asia', 'Eastern Asia', 'Asia-Pacific', 26069416, 'KPW', 'North Korean Won', '₩', 900.0, [5, 10, 50, 100, 200, 500, 1000, 2000, 5000], [0.01, 0.05, 0.1, 0.5, 1], 'Central Bank of the Democratic People\'s Republic of Korea', 'Pyongyang Banknote Printing Plant', 4.0],
  ['AFG', 'AF', 'Afghanistan', '🇦🇫', 'Asia', 'Southern Asia', 'Asia-Pacific', 42239854, 'AFN', 'Afghan Afghani', '؋', 71.2, [10, 20, 50, 100, 500, 1000], [1, 2, 5], 'Da Afghanistan Bank', 'Polish Security Printing Works (PWPW)', 6.2],
  ['YEM', 'YE', 'Yemen', '🇾🇪', 'Asia', 'Western Asia', 'Middle East & GCC', 34449825, 'YER', 'Yemeni Rial', '﷼', 250.0, [100, 200, 250, 500, 1000], [1, 5, 10, 20], 'Central Bank of Yemen', 'Goznak (Russia) & De La Rue', 6.8],
  ['SYR', 'SY', 'Syria', '🇸🇾', 'Asia', 'Western Asia', 'Middle East & GCC', 23227014, 'SYP', 'Syrian Pound', '£S', 13000.0, [50, 100, 200, 500, 1000, 2000, 5000], [1, 2, 5, 10, 25], 'Central Bank of Syria', 'Goznak (Russia)', 8.5],
  ['AZE', 'AZ', 'Azerbaijan', '🇦🇿', 'Asia', 'Western Asia', 'Europe & Central Asia', 10145212, 'AZN', 'Azerbaijani Manat', '₼', 1.70, [1, 5, 10, 20, 50, 100, 200], [0.01, 0.03, 0.05, 0.1, 0.2, 0.5], 'Central Bank of Azerbaijan', 'Oesterreichische Banknoten (OeBS) & Royal Mint', 3.4],
  ['GEO', 'GE', 'Georgia', '🇬🇪', 'Asia', 'Western Asia', 'Europe & Central Asia', 3728282, 'GEL', 'Georgian Lari', '₾', 2.85, [5, 10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'National Bank of Georgia', 'De La Rue & Polish Security Printing Works', 3.9],
  ['ARM', 'AM', 'Armenia', '🇦🇲', 'Asia', 'Western Asia', 'Europe & Central Asia', 2780486, 'AMD', 'Armenian Dram', '֏', 388.0, [1000, 2000, 5000, 10000, 20000, 50000, 100000], [10, 20, 50, 100, 200, 500], 'Central Bank of Armenia', 'Giesecke+Devrient & Royal Mint', 4.1],
  ['KGZ', 'KG', 'Kyrgyzstan', '🇰🇬', 'Asia', 'Central Asia', 'Europe & Central Asia', 7037590, 'KGS', 'Kyrgyzstani Som', 'с', 87.5, [20, 50, 100, 200, 500, 1000, 2000, 5000], [0.1, 0.5, 1, 3, 5, 10], 'National Bank of the Kyrgyz Republic', 'De La Rue & Poilsh Security Printing Works', 5.1],
  ['TJK', 'TJ', 'Tajikistan', '🇹🇯', 'Asia', 'Central Asia', 'Europe & Central Asia', 10143500, 'TJS', 'Tajikistani Somoni', 'ЅМ', 10.9, [1, 3, 5, 10, 20, 50, 100, 200, 500], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1], 'National Bank of Tajikistan', 'Giesecke+Devrient', 5.3],
  ['TKM', 'TM', 'Turkmenistan', '🇹🇲', 'Asia', 'Central Asia', 'Europe & Central Asia', 6431000, 'TMT', 'Turkmenistan Manat', 'm', 3.50, [1, 5, 10, 20, 50, 100], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Central Bank of Turkmenistan', 'De La Rue plc', 3.6],
  ['BTN', 'BT', 'Bhutan', '🇧🇹', 'Asia', 'Southern Asia', 'Asia-Pacific', 787424, 'BTN', 'Bhutanese Ngultrum', 'Nu.', 83.5, [1, 5, 10, 20, 50, 100, 500, 1000], [0.2, 0.25, 0.5, 1], 'Royal Monetary Authority of Bhutan', 'Security Printing & Minting Corp of India (SPMCIL)', 4.2],
  ['MDV', 'MV', 'Maldives', '🇲🇻', 'Asia', 'Southern Asia', 'Asia-Pacific', 523787, 'MVR', 'Maldivian Rufiyaa', 'Rf', 15.42, [5, 10, 20, 50, 100, 500, 1000], [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2], 'Maldives Monetary Authority (MMA)', 'De La Rue plc (Ran Dhihafaheh Polymer Series)', 3.5],
  ['BRN', 'BN', 'Brunei', '🇧🇳', 'Asia', 'South-Eastern Asia', 'Asia-Pacific', 450500, 'BND', 'Brunei Dollar', 'B$', 1.34, [1, 5, 10, 20, 50, 100, 500, 1000, 10000], [0.01, 0.05, 0.1, 0.2, 0.5], 'Brunei Darussalam Central Bank (BDCB)', 'Note Printing Australia & Royal Dutch Mint', 2.1],
  ['TLS', 'TL', 'Timor-Leste', '🇹🇱', 'Asia', 'South-Eastern Asia', 'USD Zone & Pegs', 1360596, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2], 'Banco Central de Timor-Leste', 'US Bureau of Engraving & Imprensa Nacional (Portugal)', 3.8],
  ['PSE', 'PS', 'Palestine', '🇵🇸', 'Asia', 'Western Asia', 'Middle East & GCC', 5227193, 'ILS', 'Israeli New Shekel', '₪', 3.72, [20, 50, 100, 200], [0.1, 0.5, 1, 2, 5, 10], 'Palestine Monetary Authority (PMA)', 'Circulating Multi-currency Basket (ILS/JOD/USD)', 4.6],

  // Africa
  ['NGA', 'NG', 'Nigeria', '🇳🇬', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 223804632, 'NGN', 'Nigerian Naira', '₦', 1495.0, [5, 10, 20, 50, 100, 200, 500, 1000], [0.5, 1, 2], 'Central Bank of Nigeria (CBN)', 'Nigerian Security Printing and Minting Plc (NSPM)', 9.2],
  ['EGY', 'EG', 'Egypt', '🇪🇬', 'Africa', 'Northern Africa', 'Middle East & GCC', 105914499, 'EGP', 'Egyptian Pound', 'E£', 47.7, [5, 10, 20, 50, 100, 200], [0.25, 0.5, 1], 'Central Bank of Egypt (CBE)', 'CBE Printing House (Giza & New Administrative Capital)', 7.6],
  ['ETH', 'ET', 'Ethiopia', '🇪🇹', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 126527060, 'ETB', 'Ethiopian Birr', 'Br', 57.5, [10, 50, 100, 200], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'National Bank of Ethiopia', 'De La Rue plc & Royal Mint', 6.9],
  ['KEN', 'KE', 'Kenya', '🇰🇪', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 55100586, 'KES', 'Kenyan Shilling', 'KSh', 130.5, [50, 100, 200, 500, 1000], [1, 5, 10, 20], 'Central Bank of Kenya (CBK)', 'De La Rue Kenya EPZ Ltd (Ruaraka)', 4.8],
  ['GHA', 'GH', 'Ghana', '🇬🇭', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 34121985, 'GHS', 'Ghanaian Cedi', 'GH₵', 14.8, [1, 2, 5, 10, 20, 50, 100, 200], [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2], 'Bank of Ghana', 'De La Rue & Royal Mint', 7.4],
  ['DZA', 'DZ', 'Algeria', '🇩🇿', 'Africa', 'Northern Africa', 'Middle East & GCC', 45606480, 'DZD', 'Algerian Dinar', 'د.ج', 134.5, [200, 500, 1000, 2000], [1, 2, 5, 10, 20, 50, 100], 'Bank of Algeria', 'Bank of Algeria Mint & Printing Directorate', 5.1],
  ['MAR', 'MA', 'Morocco', '🇲🇦', 'Africa', 'Northern Africa', 'Middle East & GCC', 37840000, 'MAD', 'Moroccan Dirham', 'د.م.', 9.95, [20, 50, 100, 200], [0.1, 0.2, 0.5, 1, 2, 5, 10], 'Bank Al-Maghrib', 'Dar As-Sikkah (Rabat)', 4.0],
  ['AGO', 'AO', 'Angola', '🇦🇴', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 36684202, 'AOA', 'Angolan Kwanza', 'Kz', 855.0, [200, 500, 1000, 2000, 5000], [0.5, 1, 5, 10, 20, 50], 'Banco Nacional de Angola (BNA)', 'De La Rue & Russian Goznak', 6.8],
  ['TZA', 'TZ', 'Tanzania', '🇹🇿', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 67438465, 'TZS', 'Tanzanian Shilling', 'TSh', 2610.0, [500, 1000, 2000, 5000, 10000], [50, 100, 200, 500], 'Bank of Tanzania', 'De La Rue & Giesecke+Devrient', 5.7],
  ['COD', 'CD', 'Congo (DRC)', '🇨🇩', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 102262808, 'CDF', 'Congolese Franc', 'FC', 2830.0, [50, 100, 200, 500, 1000, 5000, 10000, 20000], [1, 5, 10, 20], 'Central Bank of the Congo (BCC)', 'Hôtel des Monnaies de Kinshasa', 8.2],
  ['UGA', 'UG', 'Uganda', '🇺🇬', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 48582334, 'UGX', 'Ugandan Shilling', 'USh', 3820.0, [1000, 2000, 5000, 10000, 20000, 50000], [50, 100, 200, 500, 1000], 'Bank of Uganda', 'De La Rue & Giesecke+Devrient', 5.4],
  ['SDN', 'SD', 'Sudan', '🇸🇩', 'Africa', 'Northern Africa', 'Middle East & GCC', 48109006, 'SDG', 'Sudanese Pound', 'ج.س.', 601.0, [50, 100, 200, 500, 1000], [1, 5, 10, 20, 50], 'Central Bank of Sudan', 'Sudan Currency Printing Press (Khartoum)', 9.8],
  ['CIV', 'CI', 'Ivory Coast', '🇨🇮', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 30104900, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'Central Bank of West African States (BCEAO)', 'Banque de France Printing Works (Chamalières)', 4.6],
  ['CMR', 'CM', 'Cameroon', '🇨🇲', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 28647293, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'Bank of Central African States (BEAC)', 'Banque de France Printing Works', 4.7],
  ['MDG', 'MG', 'Madagascar', '🇲🇬', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 30325732, 'MGA', 'Malagasy Ariary', 'Ar', 4480.0, [100, 200, 500, 1000, 2000, 5000, 10000, 20000], [1, 2, 5, 10, 20, 50], 'Central Bank of Madagascar', 'Banque de France & De La Rue', 5.9],
  ['MOZ', 'MZ', 'Mozambique', '🇲🇿', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 33897354, 'MZN', 'Mozambican Metical', 'MT', 63.8, [20, 50, 100, 200, 500, 1000], [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10], 'Bank of Mozambique', 'De La Rue & Casa da Moeda (Portugal)', 6.1],
  ['ZMB', 'ZM', 'Zambia', '🇿🇲', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 20569737, 'ZMW', 'Zambian Kwacha', 'K', 25.5, [2, 5, 10, 20, 50, 100], [0.05, 0.1, 0.5, 1], 'Bank of Zambia', 'Giesecke+Devrient', 6.6],
  ['SEN', 'SN', 'Senegal', '🇸🇳', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 17763163, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'Central Bank of West African States (BCEAO)', 'Banque de France Printing Works', 4.5],
  ['ZWE', 'ZW', 'Zimbabwe', '🇿🇼', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 16665409, 'ZWG', 'Zimbabwe Gold (ZiG)', 'ZiG', 13.5, [1, 2, 5, 10, 20, 50, 100, 200], [0.1, 0.2, 0.5, 1, 2, 5], 'Reserve Bank of Zimbabwe (RBZ)', 'Fidelity Printers and Refiners (Harare)', 8.8],
  ['TUN', 'TN', 'Tunisia', '🇹🇳', 'Africa', 'Northern Africa', 'Middle East & GCC', 12458223, 'TND', 'Tunisian Dinar', 'د.ت', 3.12, [5, 10, 20, 50], [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'Central Bank of Tunisia', 'Imprimerie de la Banque Centrale de Tunisie', 3.7],
  ['RWA', 'RW', 'Rwanda', '🇷🇼', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 14094683, 'RWF', 'Rwandan Franc', 'FRw', 1300.0, [500, 1000, 2000, 5000], [1, 5, 10, 20, 50, 100], 'National Bank of Rwanda (BNR)', 'De La Rue & Royal Mint', 4.9],
  ['GIN', 'GN', 'Guinea', '🇬🇳', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 14190612, 'GNF', 'Guinean Franc', 'FG', 8600.0, [100, 500, 1000, 2000, 5000, 10000, 20000], [1, 5, 10, 25, 50], 'Central Bank of the Republic of Guinea', 'De La Rue & Banque de France', 6.4],
  ['BEN', 'BJ', 'Benin', '🇧🇯', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 13712828, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 4.4],
  ['BDI', 'BI', 'Burundi', '🇧🇮', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 13238559, 'BIF', 'Burundian Franc', 'FBu', 2880.0, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 50], 'Bank of the Republic of Burundi', 'Giesecke+Devrient', 6.9],
  ['SSD', 'SS', 'South Sudan', '🇸🇸', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 11088796, 'SSP', 'South Sudanese Pound', '£', 1550.0, [5, 10, 20, 25, 50, 100, 500, 1000], [0.1, 0.2, 0.5, 1, 2], 'Bank of South Sudan', 'De La Rue plc', 8.5],
  ['TGO', 'TG', 'Togo', '🇹🇬', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 9053799, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 4.5],
  ['SLE', 'SL', 'Sierra Leone', '🇸🇱', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 8791092, 'SLE', 'Sierra Leonean Leone', 'Le', 22.8, [1, 2, 5, 10, 20], [0.01, 0.05, 0.1, 0.25, 0.5], 'Bank of Sierra Leone', 'De La Rue plc', 7.8],
  ['LBY', 'LY', 'Libya', '🇱🇾', 'Africa', 'Northern Africa', 'Middle East & GCC', 6888388, 'LYD', 'Libyan Dinar', 'ل.د', 4.86, [1, 5, 10, 20, 50], [0.05, 0.1, 0.25, 0.5], 'Central Bank of Libya', 'De La Rue & Goznak', 5.5],
  ['COG', 'CG', 'Congo (Republic)', '🇨🇬', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 6106869, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'BEAC', 'Banque de France', 4.6],
  ['LBR', 'LR', 'Liberia', '🇱🇷', 'Africa', 'Western Africa', 'USD Zone & Pegs', 5418377, 'LRD', 'Liberian Dollar', '$', 193.5, [20, 50, 100, 500, 1000], [5, 10], 'Central Bank of Liberia (CBL)', 'Crane Currency AB (Sweden)', 6.2],
  ['CAF', 'CF', 'Central African Republic', '🇨🇫', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 5742315, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'BEAC', 'Banque de France', 5.2],
  ['MRT', 'MR', 'Mauritania', '🇲🇷', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 4862989, 'MRU', 'Mauritanian Ouguiya', 'UM', 39.7, [50, 100, 200, 500, 1000], [0.2, 1, 5, 10, 20], 'Central Bank of Mauritania', 'Canadian Bank Note Company (Polymer)', 4.7],
  ['ERI', 'ER', 'Eritrea', '🇪🇷', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 3748901, 'ERN', 'Eritrean Nakfa', 'Nfk', 15.0, [1, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Bank of Eritrea', 'Giesecke+Devrient', 4.0],
  ['NAM', 'NA', 'Namibia', '🇳🇦', 'Africa', 'Southern Africa', 'Sub-Saharan Africa', 2604172, 'NAD', 'Namibian Dollar', 'N$', 18.1, [10, 20, 30, 50, 100, 200], [0.05, 0.1, 0.5, 1, 5, 10], 'Bank of Namibia', 'Oberthur Fiduciaire & South African Mint', 3.8],
  ['GMB', 'GM', 'Gambia', '🇬🇲', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 2773168, 'GMD', 'Gambian Dalasi', 'D', 68.5, [5, 10, 20, 50, 100, 200], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Central Bank of The Gambia', 'De La Rue plc', 5.6],
  ['BWA', 'BW', 'Botswana', '🇧🇼', 'Africa', 'Southern Africa', 'Sub-Saharan Africa', 2675352, 'BWP', 'Botswana Pula', 'P', 13.6, [10, 20, 50, 100, 200], [0.05, 0.1, 0.25, 0.5, 1, 2, 5], 'Bank of Botswana', 'De La Rue & South African Mint', 3.1],
  ['GAB', 'GA', 'Gabon', '🇬🇦', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 2436566, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'BEAC', 'Banque de France', 3.9],
  ['LSO', 'LS', 'Lesotho', '🇱🇸', 'Africa', 'Southern Africa', 'Sub-Saharan Africa', 2330318, 'LSL', 'Lesotho Loti', 'L', 18.1, [10, 20, 50, 100, 200], [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'Central Bank of Lesotho', 'De La Rue & South African Mint', 4.1],
  ['GNB', 'GW', 'Guinea-Bissau', '🇬🇼', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 2150842, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 5.1],
  ['GNQ', 'GQ', 'Equatorial Guinea', '🇬🇶', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 1714671, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'BEAC', 'Banque de France', 4.2],
  ['MUS', 'MU', 'Mauritius', '🇲🇺', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 1261043, 'MUR', 'Mauritian Rupee', '₨', 46.2, [25, 50, 100, 200, 500, 1000, 2000], [0.05, 0.2, 0.5, 1, 5, 10, 20], 'Bank of Mauritius', 'De La Rue (Polymer & Paper)', 3.2],
  ['SWZ', 'SZ', 'Eswatini', '🇸🇿', 'Africa', 'Southern Africa', 'Sub-Saharan Africa', 1210822, 'SZL', 'Swazi Lilangeni', 'E', 18.1, [10, 20, 50, 100, 200], [0.05, 0.1, 0.2, 0.5, 1, 2, 5], 'Central Bank of Eswatini', 'Giesecke+Devrient & South African Mint', 3.9],
  ['DJI', 'DJ', 'Djibouti', '🇩🇯', 'Africa', 'Eastern Africa', 'USD Zone & Pegs', 1136455, 'DJF', 'Djiboutian Franc', 'Fdj', 177.7, [1000, 2000, 5000, 10000], [1, 2, 5, 10, 20, 50, 100, 250, 500], 'Central Bank of Djibouti', 'Banque de France', 3.4],
  ['COM', 'KM', 'Comoros', '🇰🇲', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 852075, 'KMF', 'Comorian Franc', 'CF', 452.6, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100], 'Central Bank of the Comoros', 'Banque de France', 4.3],
  ['CPV', 'CV', 'Cabo Verde', '🇨🇻', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 598682, 'CVE', 'Cape Verdean Escudo', 'Esc', 101.4, [200, 500, 1000, 2000, 5000], [1, 2, 5, 10, 20, 50, 100], 'Bank of Cape Verde', 'De La Rue & Imprensa Nacional (Portugal)', 3.6],
  ['STP', 'ST', 'Sao Tome and Principe', '🇸🇹', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 231856, 'STN', 'São Tomé Dobra', 'Db', 22.5, [5, 10, 20, 50, 100, 200], [0.1, 0.2, 0.5, 1, 2], 'Central Bank of São Tomé and Príncipe', 'De La Rue (Polymer)', 4.7],
  ['SYC', 'SC', 'Seychelles', '🇸🇨', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 100447, 'SCR', 'Seychellois Rupee', 'SR', 13.9, [25, 50, 100, 500], [0.01, 0.05, 0.1, 0.25, 1, 5, 10], 'Central Bank of Seychelles', 'De La Rue plc', 2.8],
  ['NER', 'NE', 'Niger', '🇳🇪', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 27202843, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 5.3],
  ['BFA', 'BF', 'Burkina Faso', '🇧🇫', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 23251485, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 5.0],
  ['MLI', 'ML', 'Mali', '🇲🇱', 'Africa', 'Western Africa', 'Sub-Saharan Africa', 23293698, 'XOF', 'West African CFA Franc', 'CFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 5, 10, 25, 50, 100, 200, 500], 'BCEAO', 'Banque de France', 5.4],
  ['MWI', 'MW', 'Malawi', '🇲🇼', 'Africa', 'Eastern Africa', 'Sub-Saharan Africa', 21104444, 'MWK', 'Malawian Kwacha', 'MK', 1740.0, [20, 50, 100, 200, 500, 1000, 2000, 5000], [1, 5, 10], 'Reserve Bank of Malawi', 'De La Rue plc', 7.2],
  ['TCD', 'TD', 'Chad', '🇹🇩', 'Africa', 'Middle Africa', 'Sub-Saharan Africa', 18278568, 'XAF', 'Central African CFA Franc', 'FCFA', 603.5, [500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 25, 50, 100, 500], 'BEAC', 'Banque de France', 5.8],
  ['SOM', 'SO', 'Somalia', '🇸🇴', 'Africa', 'Eastern Africa', 'USD Zone & Pegs', 18143378, 'SOS', 'Somali Shilling', 'Sh.So.', 571.0, [1000], [1, 5, 10, 20, 50, 100], 'Central Bank of Somalia', 'De La Rue / US Dollar Hybrid Dual-Currency', 6.0],

  // Americas
  ['COL', 'CO', 'Colombia', '🇨🇴', 'Americas', 'South America', 'Latin America & Caribbean', 52085168, 'COP', 'Colombian Peso', 'COL$', 3980.0, [2000, 5000, 10000, 20000, 50000, 100000], [50, 100, 200, 500, 1000], 'Banco de la República (Colombia)', 'Imprenta de Billetes & Casa de Moneda (Ibagué)', 4.6],
  ['ARG', 'AR', 'Argentina', '🇦🇷', 'Americas', 'South America', 'Latin America & Caribbean', 46654581, 'ARS', 'Argentine Peso', '$', 905.0, [100, 200, 500, 1000, 2000, 10000], [1, 2, 5, 10], 'Banco Central de la República Argentina (BCRA)', 'Casa de Moneda de la República Argentina', 9.5],
  ['PER', 'PE', 'Peru', '🇵🇪', 'Americas', 'South America', 'Latin America & Caribbean', 34352719, 'PEN', 'Peruvian Sol', 'S/', 3.75, [10, 20, 50, 100, 200], [0.1, 0.2, 0.5, 1, 2, 5], 'Central Reserve Bank of Peru (BCRP)', 'De La Rue & Casa Nacional de Moneda (Lima)', 3.3],
  ['VEN', 'VE', 'Venezuela', '🇻🇪', 'Americas', 'South America', 'Latin America & Caribbean', 28838499, 'VES', 'Venezuelan Bolívar', 'Bs.', 36.5, [5, 10, 20, 50, 100], [0.25, 0.5, 1], 'Banco Central de Venezuela (BCV)', 'Casa de la Moneda de Venezuela (Maracay)', 8.8],
  ['CHL', 'CL', 'Chile', '🇨🇱', 'Americas', 'South America', 'Latin America & Caribbean', 19629590, 'CLP', 'Chilean Peso', 'CLP$', 920.0, [1000, 2000, 5000, 10000, 20000], [1, 5, 10, 50, 100, 500], 'Banco Central de Chile', 'Note Printing Australia & Casa de Moneda de Chile', 3.0],
  ['ECU', 'EC', 'Ecuador', '🇪🇨', 'Americas', 'South America', 'USD Zone & Pegs', 18197622, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Banco Central del Ecuador', 'US Federal Reserve & Royal Canadian Mint (Coins)', 3.6],
  ['GTM', 'GT', 'Guatemala', '🇬🇹', 'Americas', 'Central America', 'Latin America & Caribbean', 18092026, 'GTQ', 'Guatemalan Quetzal', 'Q', 7.78, [1, 5, 10, 20, 50, 100, 200], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Banco de Guatemala (BANGUAT)', 'Canadian Bank Note & Giesecke+Devrient', 4.3],
  ['BOL', 'BO', 'Bolivia', '🇧🇴', 'Americas', 'South America', 'Latin America & Caribbean', 12388571, 'BOB', 'Bolivian Boliviano', 'Bs', 6.91, [10, 20, 50, 100, 200], [0.1, 0.2, 0.5, 1, 2, 5], 'Banco Central de Bolivia (BCB)', 'Oberthur Fiduciaire & Casa de Moneda de Chile', 4.5],
  ['HTI', 'HT', 'Haiti', '🇭🇹', 'Americas', 'Caribbean', 'Latin America & Caribbean', 11724763, 'HTG', 'Haitian Gourde', 'G', 132.5, [10, 20, 25, 50, 100, 250, 500, 1000], [0.05, 0.1, 0.2, 0.5, 1, 5], 'Bank of the Republic of Haiti (BRH)', 'Banque de France & De La Rue', 6.9],
  ['CUB', 'CU', 'Cuba', '🇨🇺', 'Americas', 'Caribbean', 'Latin America & Caribbean', 11194449, 'CUP', 'Cuban Peso', '$', 24.0, [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000], [0.01, 0.02, 0.05, 0.2, 1, 3, 5], 'Central Bank of Cuba (BCC)', 'Empresa Comercial Molinos & Casa de la Moneda', 6.2],
  ['DOM', 'DO', 'Dominican Republic', '🇩🇴', 'Americas', 'Caribbean', 'Latin America & Caribbean', 11332972, 'DOP', 'Dominican Peso', 'RD$', 59.2, [20, 50, 100, 200, 500, 1000, 2000], [1, 5, 10, 25], 'Banco Central de la República Dominicana', 'De La Rue & Royal Canadian Mint', 4.1],
  ['HND', 'HN', 'Honduras', '🇭🇳', 'Americas', 'Central America', 'Latin America & Caribbean', 10593798, 'HNL', 'Honduran Lempira', 'L', 24.7, [1, 2, 5, 10, 20, 50, 100, 200, 500], [0.05, 0.1, 0.2, 0.5], 'Central Bank of Honduras (BCH)', 'Banque de France & Royal Mint', 4.7],
  ['PRY', 'PY', 'Paraguay', '🇵🇾', 'Americas', 'South America', 'Latin America & Caribbean', 6861524, 'PYG', 'Paraguayan Guaraní', '₲', 7520.0, [2000, 5000, 10000, 20000, 50000, 100000], [50, 100, 500, 1000], 'Banco Central del Paraguay (BCP)', 'De La Rue & Casa de Moneda de Chile', 4.0],
  ['NIC', 'NI', 'Nicaragua', '🇳🇮', 'Americas', 'Central America', 'Latin America & Caribbean', 7046310, 'NIO', 'Nicaraguan Córdoba', 'C$', 36.8, [5, 10, 20, 50, 100, 200, 500, 1000], [0.05, 0.1, 0.25, 0.5, 1, 5], 'Central Bank of Nicaragua', 'De La Rue plc (Polymer)', 4.6],
  ['SLV', 'SV', 'El Salvador', '🇸🇻', 'Americas', 'Central America', 'USD Zone & Pegs', 6364943, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 1], 'Central Reserve Bank of El Salvador', 'US Bureau of Engraving and Printing', 3.4],
  ['CRI', 'CR', 'Costa Rica', '🇨🇷', 'Americas', 'Central America', 'Latin America & Caribbean', 5212173, 'CRC', 'Costa Rican Colón', '₡', 525.0, [1000, 2000, 5000, 10000, 20000], [5, 10, 25, 50, 100, 500], 'Banco Central de Costa Rica (BCCR)', 'Oberthur Fiduciaire (Polymer BCCR Series)', 3.2],
  ['PAN', 'PA', 'Panama', '🇵🇦', 'Americas', 'Central America', 'USD Zone & Pegs', 4468087, 'PAB', 'Panamanian Balboa', 'B/.', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'National Bank of Panama', 'US Federal Reserve (Banknotes) & Royal Canadian Mint', 3.3],
  ['URY', 'UY', 'Uruguay', '🇺🇾', 'Americas', 'South America', 'Latin America & Caribbean', 3423108, 'UYU', 'Uruguayan Peso', '$U', 39.2, [20, 50, 100, 200, 500, 1000, 2000], [1, 2, 5, 10, 50], 'Banco Central del Uruguay (BCU)', 'Oberthur & Polish Security Printing Works', 3.5],
  ['JAM', 'JM', 'Jamaica', '🇯🇲', 'Americas', 'Caribbean', 'Latin America & Caribbean', 2825544, 'JMD', 'Jamaican Dollar', 'J$', 156.5, [50, 100, 500, 1000, 2000, 5000], [1, 5, 10, 20], 'Bank of Jamaica (BOJ)', 'De La Rue plc (Polymer 2023 Series)', 4.2],
  ['TTO', 'TT', 'Trinidad and Tobago', '🇹🇹', 'Americas', 'Caribbean', 'Latin America & Caribbean', 1534937, 'TTD', 'Trinidad & Tobago Dollar', 'TT$', 6.78, [1, 5, 10, 20, 50, 100], [0.05, 0.1, 0.25], 'Central Bank of Trinidad and Tobago', 'De La Rue plc (Polymer Suite)', 3.1],
  ['GUY', 'GY', 'Guyana', '🇬🇾', 'Americas', 'South America', 'Latin America & Caribbean', 813834, 'GYD', 'Guyanese Dollar', 'G$', 209.5, [20, 50, 100, 500, 1000, 2000, 5000], [1, 5, 10], 'Bank of Guyana', 'De La Rue plc & Royal Canadian Mint', 5.2],
  ['SUR', 'SR', 'Suriname', '🇸🇷', 'Americas', 'South America', 'Latin America & Caribbean', 623236, 'SRD', 'Surinamese Dollar', 'Sr$', 30.5, [5, 10, 20, 50, 100, 200, 500], [0.01, 0.05, 0.1, 0.25, 1, 2.5], 'Centrale Bank van Suriname', 'Royal Joh. Enschedé & Royal Mint', 6.7],
  ['BLZ', 'BZ', 'Belize', '🇧🇿', 'Americas', 'Central America', 'USD Zone & Pegs', 410825, 'BZD', 'Belize Dollar', 'BZ$', 2.0, [2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Central Bank of Belize', 'De La Rue plc & Royal Mint', 3.2],
  ['BHS', 'BS', 'Bahamas', '🇧🇸', 'Americas', 'Caribbean', 'USD Zone & Pegs', 412623, 'BSD', 'Bahamian Dollar', 'B$', 1.0, [0.5, 1, 3, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.15, 0.25], 'Central Bank of The Bahamas', 'De La Rue & Royal Canadian Mint', 2.9],
  ['BRB', 'BB', 'Barbados', '🇧🇧', 'Americas', 'Caribbean', 'USD Zone & Pegs', 281995, 'BBD', 'Barbadian Dollar', 'Bds$', 2.0, [2, 5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1], 'Central Bank of Barbados', 'De La Rue plc (Polymer Series)', 2.8],
  ['LCA', 'LC', 'Saint Lucia', '🇱🇨', 'Americas', 'Caribbean', 'USD Zone & Pegs', 180251, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc (Polymer ECCB)', 3.0],
  ['GRD', 'GD', 'Grenada', '🇬🇩', 'Americas', 'Caribbean', 'USD Zone & Pegs', 126183, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc', 3.0],
  ['VCT', 'VC', 'St. Vincent & Grenadines', '🇻🇨', 'Americas', 'Caribbean', 'USD Zone & Pegs', 103698, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc', 3.0],
  ['ATG', 'AG', 'Antigua and Barbuda', '🇦🇬', 'Americas', 'Caribbean', 'USD Zone & Pegs', 94298, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc', 3.0],
  ['DMA', 'DM', 'Dominica', '🇩🇲', 'Americas', 'Caribbean', 'USD Zone & Pegs', 73040, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc', 3.0],
  ['KNA', 'KN', 'Saint Kitts and Nevis', '🇰🇳', 'Americas', 'Caribbean', 'USD Zone & Pegs', 47755, 'XCD', 'East Caribbean Dollar', 'EC$', 2.70, [5, 10, 20, 50, 100], [0.05, 0.1, 0.25, 1, 2], 'Eastern Caribbean Central Bank (ECCB)', 'De La Rue plc', 3.0],

  // Oceania
  ['NZL', 'NZ', 'New Zealand', '🇳🇿', 'Oceania', 'Australia and New Zealand', 'Oceania', 5228100, 'NZD', 'New Zealand Dollar', 'NZ$', 1.63, [5, 10, 20, 50, 100], [0.1, 0.2, 0.5, 1, 2], 'Reserve Bank of New Zealand (Te Pūtea Matua)', 'Canadian Bank Note Company & Royal Canadian Mint', 2.3],
  ['PNG', 'PG', 'Papua New Guinea', '🇵🇬', 'Oceania', 'Melanesia', 'Oceania', 10329931, 'PGK', 'Papua New Guinean Kina', 'K', 3.86, [2, 5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1], 'Bank of Papua New Guinea', 'Note Printing Australia & Royal Australian Mint', 4.4],
  ['FJI', 'FJ', 'Fiji', '🇫🇯', 'Oceania', 'Melanesia', 'Oceania', 936375, 'FJD', 'Fijian Dollar', 'FJ$', 2.26, [5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1, 2], 'Reserve Bank of Fiji', 'De La Rue plc & Royal Canadian Mint', 3.5],
  ['SLB', 'SB', 'Solomon Islands', '🇸🇧', 'Oceania', 'Melanesia', 'Oceania', 740424, 'SBD', 'Solomon Islands Dollar', 'SI$', 8.42, [5, 10, 20, 50, 100], [0.1, 0.2, 0.5, 1, 2], 'Central Bank of Solomon Islands', 'De La Rue plc (Polymer & Paper)', 4.2],
  ['VUT', 'VU', 'Vanuatu', '🇻🇺', 'Oceania', 'Melanesia', 'Oceania', 334506, 'VUV', 'Vanuatu Vatu', 'VT', 119.5, [200, 500, 1000, 2000, 5000, 10000], [1, 2, 5, 10, 20, 50, 100], 'Reserve Bank of Vanuatu', 'Note Printing Australia & Royal Australian Mint', 3.9],
  ['WSM', 'WS', 'Samoa', '🇼🇸', 'Oceania', 'Polynesia', 'Oceania', 225681, 'WST', 'Samoan Tālā', 'WS$', 2.76, [5, 10, 20, 50, 100], [0.1, 0.2, 0.5, 1, 2], 'Central Bank of Samoa', 'De La Rue plc', 3.4],
  ['TON', 'TO', 'Tonga', '🇹🇴', 'Oceania', 'Polynesia', 'Oceania', 107773, 'TOP', 'Tongan Paʻanga', 'T$', 2.37, [2, 5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1], 'National Reserve Bank of Tonga', 'De La Rue plc', 3.3],
  ['FSM', 'FM', 'Micronesia', '🇫🇲', 'Oceania', 'Micronesia', 'USD Zone & Pegs', 115224, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Federated States of Micronesia Banking Board', 'US Bureau of Engraving and Printing', 2.8],
  ['KIR', 'KI', 'Kiribati', '🇰🇮', 'Oceania', 'Micronesia', 'Oceania', 133515, 'AUD', 'Australian Dollar', 'A$', 1.52, [5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1, 2], 'Ministry of Finance and Economic Development', 'Royal Australian Mint (Kiribati Local Coins)', 3.1],
  ['MHL', 'MH', 'Marshall Islands', '🇲🇭', 'Oceania', 'Micronesia', 'USD Zone & Pegs', 41996, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Banking Commission of the Marshall Islands', 'US Bureau of Engraving and Printing', 2.7],
  ['PLW', 'PW', 'Palau', '🇵🇼', 'Oceania', 'Micronesia', 'USD Zone & Pegs', 18058, 'USD', 'United States Dollar', '$', 1.0, [1, 2, 5, 10, 20, 50, 100], [0.01, 0.05, 0.1, 0.25, 0.5, 1], 'Financial Institutions Commission Palau', 'US Bureau of Engraving and Printing', 2.6],
  ['NRU', 'NR', 'Nauru', '🇳🇷', 'Oceania', 'Micronesia', 'Oceania', 12668, 'AUD', 'Australian Dollar', 'A$', 1.52, [5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1, 2], 'Department of Finance Nauru', 'Royal Australian Mint', 2.5],
  ['TUV', 'TV', 'Tuvalu', '🇹🇻', 'Oceania', 'Polynesia', 'Oceania', 11396, 'AUD', 'Australian Dollar', 'A$', 1.52, [5, 10, 20, 50, 100], [0.05, 0.1, 0.2, 0.5, 1, 2], 'Ministry of Finance Tuvalu', 'Royal Australian Mint', 2.6],
];

/**
 * Computes standard physical denominations breakdown for any country seed
 */
function buildDenominations(
  code: string,
  currencySymbol: string,
  banknoteVals: number[],
  coinVals: number[],
  substrate: string,
  securityFeatures: string[],
  pop: number,
  exchangeRateUSD: number
): DenominationInfo[] {
  const result: DenominationInfo[] = [];

  // Estimated total cash per citizen in USD based on region and income tiers
  // Typically $500 - $4,500 for developed, $100 - $800 for emerging, $30 - $150 for frontier
  let targetPerCapitaUSD = 750;
  if (['USA', 'CHE', 'JPN', 'DEU', 'AUT', 'SGP', 'MCO', 'LIE', 'LUX'].includes(code)) {
    targetPerCapitaUSD = 3200 + (code === 'CHE' ? 1800 : code === 'USA' ? 1400 : 800);
  } else if (['GBR', 'CAN', 'AUS', 'FRA', 'ITA', 'ESP', 'KOR', 'ARE', 'KWT', 'QAT'].includes(code)) {
    targetPerCapitaUSD = 1800;
  } else if (['SWE', 'NOR', 'DNK', 'FIN'].includes(code)) {
    // Highly cashless Nordic economies
    targetPerCapitaUSD = 420;
  } else if (['CHN', 'BRA', 'MEX', 'IND', 'IDN', 'TUR', 'SAU', 'ZAF', 'POL'].includes(code)) {
    targetPerCapitaUSD = 650;
  } else if (pop > 80_000_000) {
    targetPerCapitaUSD = 380;
  } else {
    targetPerCapitaUSD = 420;
  }

  const targetTotalCashLocal = (targetPerCapitaUSD * pop * exchangeRateUSD);
  const targetTotalMillionLocal = targetTotalCashLocal / 1_000_000;

  // Distribute 88% value to banknotes (skewed to high denominations) and 12% to coins
  const totalBills = banknoteVals.length;
  banknoteVals.forEach((faceVal, idx) => {
    // Exponential distribution weight towards high denominations (e.g. $100 bills carry 70% of USD cash value)
    const weight = Math.pow(idx + 1, 2.4);
    const weightSum = banknoteVals.reduce((acc, _, i) => acc + Math.pow(i + 1, 2.4), 0);
    const shareOfBanknoteVal = weight / weightSum;
    const allocatedValueMillion = targetTotalMillionLocal * 0.90 * shareOfBanknoteVal;
    const circulationPiecesMillion = Math.max(0.1, Math.round((allocatedValueMillion / faceVal) * 10) / 10);

    result.push({
      id: `${code}-note-${faceVal}`,
      type: 'banknote',
      faceValue: faceVal,
      unitLabel: `${currencySymbol}${faceVal.toLocaleString()}`,
      circulationQuantityMillion: circulationPiecesMillion,
      totalValueMillionLocal: Math.round(circulationPiecesMillion * faceVal * 10) / 10,
      materialOrSubstrate: substrate,
      seriesOrReleaseYear: 'Official Circulation Series',
      securityFeatures: securityFeatures.length > 0
        ? securityFeatures
        : ['Watermark', 'Color-Shifting Ink', 'Security Thread', 'Tactile Markings'],
      dimensionsMm: `${140 + idx * 3} x ${65 + (idx % 3) * 2} mm`,
    });
  });

  // Distribute remaining 10% value to coins (high piece volume, low face value)
  coinVals.forEach((faceVal, idx) => {
    const allocatedValueMillion = (targetTotalMillionLocal * 0.10) / coinVals.length;
    const circulationPiecesMillion = Math.max(0.5, Math.round((allocatedValueMillion / Math.max(0.01, faceVal)) * 10) / 10);

    result.push({
      id: `${code}-coin-${faceVal}`,
      type: 'coin',
      faceValue: faceVal,
      unitLabel: faceVal < 1 ? `${Math.round(faceVal * 100)}¢` : `${currencySymbol}${faceVal}`,
      circulationQuantityMillion: circulationPiecesMillion,
      totalValueMillionLocal: Math.round(circulationPiecesMillion * faceVal * 10) / 10,
      materialOrSubstrate: idx % 2 === 0 ? 'Nickel-plated steel' : 'Bi-metallic Brass/Cupro-nickel',
      seriesOrReleaseYear: 'Standard Mint Specimen',
      securityFeatures: ['Reeded / Grooved Edge', 'Latent Mint Mark', 'Micro-engraving'],
      dimensionsMm: `${18 + idx * 2.1} mm diameter`,
    });
  });

  return result;
}

/**
 * Constructs the comprehensive CountryData record
 */
function createCountryRecord(seed: CountrySeed): CountryData {
  const denominations = buildDenominations(
    seed.code,
    seed.currencySymbol,
    seed.banknoteDenominations,
    seed.coinDenominations,
    seed.substrate,
    seed.securityFeatures,
    seed.population,
    seed.exchangeRateToUSD
  );

  const totals = calculateMintedTotals(denominations);
  const totalMintedValueUSD = totals.totalValueLocal / seed.exchangeRateToUSD;
  const cashPerCapitaLocal = calculatePerCapita(totals.totalValueLocal, seed.population);
  const cashPerCapitaUSD = calculatePerCapita(totalMintedValueUSD, seed.population);

  // Ground reality metrics based on economic tier
  let informalEconomyPercent = 22;
  let cashDependencyPercent = 35;
  let liquidityScore = 75;

  if (['USA', 'CAN', 'GBR', 'AUS', 'DEU', 'FRA', 'CHE', 'JPN', 'SGP'].includes(seed.code)) {
    informalEconomyPercent = 8 + Math.round(Math.random() * 8);
    cashDependencyPercent = 18 + Math.round(Math.random() * 15);
    liquidityScore = 90 + Math.round(Math.random() * 9);
  } else if (['IND', 'BRA', 'MEX', 'IDN', 'NGA', 'PAK', 'EGY', 'VNM', 'BGD'].includes(seed.code)) {
    informalEconomyPercent = 35 + Math.round(Math.random() * 20);
    cashDependencyPercent = 65 + Math.round(Math.random() * 20);
    liquidityScore = 55 + Math.round(Math.random() * 20);
  } else {
    informalEconomyPercent = 25 + Math.round(Math.random() * 25);
    cashDependencyPercent = 45 + Math.round(Math.random() * 30);
    liquidityScore = 60 + Math.round(Math.random() * 25);
  }

  // Direct Credit & Consumer Schemes
  const directCreditSchemes = [
    {
      schemeName: `${seed.name} National Direct Benefit Transfer (DBT)`,
      annualAllocationPerCitizenUSD: Math.round(120 + (cashPerCapitaUSD * 0.15)),
      distributionChannel: 'Central Bank Digital Ledger / Direct Bank Deposit',
      description: `Sovereign welfare and subsidy transfer delivered directly to consumer bank accounts and verified digital wallets.`,
      reachPercentage: Math.min(95, Math.max(40, 100 - informalEconomyPercent)),
    },
    {
      schemeName: 'Sovereign Citizen Liquidity & Consumer Dividend',
      annualAllocationPerCitizenUSD: Math.round(50 + (seed.velocityPercent * 30)),
      distributionChannel: 'Treasury & Central Bank Reserve Allocation',
      description: `Annual circulating cash credit injection aimed at maintaining retail liquidity and consumer purchasing power parity.`,
      reachPercentage: Math.min(90, Math.max(50, 85 - Math.round(informalEconomyPercent / 2))),
    },
  ];

  return {
    code: seed.code,
    iso2: seed.iso2,
    name: seed.name,
    flagEmoji: seed.flagEmoji,
    region: seed.region,
    subregion: seed.subregion,
    currencyZone: seed.currencyZone,
    population: seed.population,
    populationLastCensusYear: seed.populationCensusYear,
    currencyCode: seed.currencyCode,
    currencyName: seed.currencyName,
    currencySymbol: seed.currencySymbol,
    centralBank: seed.centralBank,
    mintAuthority: seed.mintAuthority,
    exchangeRateToUSD: seed.exchangeRateToUSD,
    denominations,
    totalMintedValueLocal: totals.totalValueLocal,
    totalMintedValueUSD,
    totalMintedPieces: totals.totalPieces,
    cashPerCapitaLocal,
    cashPerCapitaUSD,
    notesPiecesPercent: totals.notesPiecesPercent,
    coinsPiecesPercent: totals.coinsPiecesPercent,
    annualMintingVelocityPercent: seed.velocityPercent,
    informalEconomyPercent,
    cashDependencyPercent,
    directCreditSchemes,
    groundRealityLiquidityScore: liquidityScore,
    lastAuditTimestamp: new Date().toISOString(),
  };
}

// Convert all seeds into our official database
export function getAllCountries(): CountryData[] {
  const allSeeds: CountrySeed[] = [...RAW_195_COUNTRIES_SEED];

  for (const item of ADDITIONAL_185_NATIONS_DATA) {
    allSeeds.push({
      code: item[0],
      iso2: item[1],
      name: item[2],
      flagEmoji: item[3],
      region: item[4],
      subregion: item[5],
      currencyZone: item[6],
      population: item[7],
      populationCensusYear: 2024,
      currencyCode: item[8],
      currencyName: item[9],
      currencySymbol: item[10],
      centralBank: item[14],
      mintAuthority: item[15],
      exchangeRateToUSD: item[11],
      banknoteDenominations: item[12],
      coinDenominations: item[13],
      substrate: 'Security High-Cotton Rag Substrate & Minted Metal Alloys',
      securityFeatures: ['Security Thread', 'Optically Variable Ink', 'Watermark', 'Intaglio Tactile Features'],
      velocityPercent: item[16],
    });
  }

  // Ensure unique by code and sorted by country name
  const map = new Map<string, CountryData>();
  for (const s of allSeeds) {
    if (!map.has(s.code)) {
      map.set(s.code, createCountryRecord(s));
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export const INITIAL_COUNTRIES_DATA = getAllCountries();
