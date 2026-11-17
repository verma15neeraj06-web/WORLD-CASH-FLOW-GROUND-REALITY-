export type DenominationType = 'banknote' | 'coin';

export interface DenominationInfo {
  id: string;
  type: DenominationType;
  faceValue: number;
  unitLabel: string;
  circulationQuantityMillion: number; // approximate millions of pieces
  totalValueMillionLocal: number; // faceValue * circulationQuantityMillion
  materialOrSubstrate: string;
  seriesOrReleaseYear: string;
  securityFeatures: string[];
  dimensionsMm: string;
  isCommemorative?: boolean;
}

export type CurrencyZone =
  | 'All'
  | 'Eurozone'
  | 'USD Zone & Pegs'
  | 'Asia-Pacific'
  | 'Latin America & Caribbean'
  | 'Middle East & GCC'
  | 'Sub-Saharan Africa'
  | 'Europe & Central Asia'
  | 'Oceania';

export interface DirectCreditScheme {
  schemeName: string;
  annualAllocationPerCitizenUSD: number;
  distributionChannel: string;
  description: string;
  reachPercentage: number;
}

export interface CountryData {
  code: string; // ISO 3166-1 alpha-3 (e.g. USA)
  iso2: string; // ISO 2-letter (e.g. US)
  name: string;
  flagEmoji: string;
  region: 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';
  subregion: string;
  currencyZone: CurrencyZone;
  population: number; // Declared population
  populationLastCensusYear: number;
  currencyCode: string; // ISO 4217 (e.g. USD)
  currencyName: string;
  currencySymbol: string;
  centralBank: string;
  mintAuthority: string;
  exchangeRateToUSD: number; // 1 USD = X Local Units
  denominations: DenominationInfo[];
  totalMintedValueLocal: number; // sum of totalValueMillionLocal * 1,000,000
  totalMintedValueUSD: number; // totalMintedValueLocal / exchangeRateToUSD
  totalMintedPieces: number; // sum of circulationQuantityMillion * 1,000,000
  cashPerCapitaLocal: number; // totalMintedValueLocal / population
  cashPerCapitaUSD: number; // totalMintedValueUSD / population
  notesPiecesPercent: number; // % of physical pieces that are banknotes
  coinsPiecesPercent: number; // % of physical pieces that are coins
  annualMintingVelocityPercent: number; // e.g. +3.2%
  informalEconomyPercent: number; // % of economy in informal cash transactions
  cashDependencyPercent: number; // % of retail transactions settled in cash
  directCreditSchemes: DirectCreditScheme[]; // Sovereign direct credit & benefit schemes
  groundRealityLiquidityScore: number; // 0-100 real ground cash liquidity index
  lastAuditTimestamp: string;
}

export interface GlobalAggregates {
  totalNations: number;
  totalPopulation: number;
  totalMintedValueUSD: number;
  averageCashPerCapitaUSD: number;
  highestPerCapitaCountry: { name: string; valueUSD: number; code: string };
  lowestPerCapitaCountry: { name: string; valueUSD: number; code: string };
  totalPhysicalPieces: number;
}
