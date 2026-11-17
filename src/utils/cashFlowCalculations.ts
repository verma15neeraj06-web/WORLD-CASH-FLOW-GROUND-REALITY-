import { DenominationInfo, CountryData, GlobalAggregates } from '../types/cashFlow';

/**
 * Calculates per capita cash ratio: Total Minted Value / Total Population
 */
export function calculatePerCapita(totalValue: number, population: number): number {
  if (!population || population <= 0) return 0;
  return totalValue / population;
}

/**
 * Calculates total pieces and total value from a list of physical currency denominations.
 */
export function calculateMintedTotals(denominations: DenominationInfo[]) {
  let totalValueMillionLocal = 0;
  let totalPiecesMillion = 0;
  let banknotePiecesMillion = 0;
  let coinPiecesMillion = 0;

  for (const d of denominations) {
    const value = d.faceValue * d.circulationQuantityMillion;
    totalValueMillionLocal += value;
    totalPiecesMillion += d.circulationQuantityMillion;

    if (d.type === 'banknote') {
      banknotePiecesMillion += d.circulationQuantityMillion;
    } else {
      coinPiecesMillion += d.circulationQuantityMillion;
    }
  }

  const notesPiecesPercent = totalPiecesMillion > 0
    ? (banknotePiecesMillion / totalPiecesMillion) * 100
    : 0;
  const coinsPiecesPercent = totalPiecesMillion > 0
    ? (coinPiecesMillion / totalPiecesMillion) * 100
    : 0;

  return {
    totalValueMillionLocal,
    totalValueLocal: totalValueMillionLocal * 1_000_000,
    totalPieces: totalPiecesMillion * 1_000_000,
    totalPiecesMillion,
    notesPiecesPercent: Math.round(notesPiecesPercent * 10) / 10,
    coinsPiecesPercent: Math.round(coinsPiecesPercent * 10) / 10,
  };
}

/**
 * Currency conversion across 195 countries based on USD base exchange rates.
 * If 1 USD = fromRate and 1 USD = toRate,
 * amount in FromCurrency -> USD = amount / fromRate
 * USD -> ToCurrency = (amount / fromRate) * toRate
 */
export function convertCurrency(
  amount: number,
  fromRateToUSD: number,
  toRateToUSD: number
): number {
  if (isNaN(amount) || amount <= 0) return 0;
  if (!fromRateToUSD || fromRateToUSD <= 0) return 0;
  if (!toRateToUSD || toRateToUSD <= 0) return 0;

  const inUSD = amount / fromRateToUSD;
  return inUSD * toRateToUSD;
}

/**
 * Greedily breaks down a given currency amount into physical notes & coins
 * based on available active denominations for that country.
 */
export interface DenominationBreakdownItem {
  denomination: DenominationInfo;
  count: number;
  subtotal: number;
}

export function breakdownAmountIntoDenominations(
  targetAmount: number,
  denominations: DenominationInfo[]
): {
  items: DenominationBreakdownItem[];
  remainder: number;
  totalPiecesCount: number;
} {
  if (targetAmount <= 0 || !denominations || denominations.length === 0) {
    return { items: [], remainder: targetAmount, totalPiecesCount: 0 };
  }

  // Sort denominations from highest face value to lowest
  const sorted = [...denominations].sort((a, b) => b.faceValue - a.faceValue);
  let remaining = Math.round(targetAmount * 100) / 100;
  const items: DenominationBreakdownItem[] = [];
  let totalPiecesCount = 0;

  for (const d of sorted) {
    if (d.faceValue <= 0) continue;
    // How many units of this denomination fit?
    const count = Math.floor((remaining + 0.0001) / d.faceValue);
    if (count > 0) {
      const subtotal = Math.round(count * d.faceValue * 100) / 100;
      items.push({
        denomination: d,
        count,
        subtotal,
      });
      totalPiecesCount += count;
      remaining = Math.round((remaining - subtotal) * 100) / 100;
    }
  }

  return {
    items,
    remainder: Math.max(0, remaining),
    totalPiecesCount,
  };
}

/**
 * Computes global statistics from country dataset
 */
export function calculateGlobalAggregates(countries: CountryData[]): GlobalAggregates {
  if (!countries || countries.length === 0) {
    return {
      totalNations: 0,
      totalPopulation: 0,
      totalMintedValueUSD: 0,
      averageCashPerCapitaUSD: 0,
      highestPerCapitaCountry: { name: 'N/A', valueUSD: 0, code: '' },
      lowestPerCapitaCountry: { name: 'N/A', valueUSD: 0, code: '' },
      totalPhysicalPieces: 0,
    };
  }

  let totalPop = 0;
  let totalValUSD = 0;
  let totalPieces = 0;

  let highest = { name: countries[0].name, valueUSD: countries[0].cashPerCapitaUSD, code: countries[0].code };
  let lowest = { name: countries[0].name, valueUSD: countries[0].cashPerCapitaUSD, code: countries[0].code };

  for (const c of countries) {
    totalPop += c.population;
    totalValUSD += c.totalMintedValueUSD;
    totalPieces += c.totalMintedPieces;

    if (c.cashPerCapitaUSD > highest.valueUSD) {
      highest = { name: c.name, valueUSD: c.cashPerCapitaUSD, code: c.code };
    }
    if (c.cashPerCapitaUSD > 0 && (lowest.valueUSD === 0 || c.cashPerCapitaUSD < lowest.valueUSD)) {
      lowest = { name: c.name, valueUSD: c.cashPerCapitaUSD, code: c.code };
    }
  }

  const averageCashPerCapitaUSD = totalPop > 0 ? totalValUSD / totalPop : 0;

  return {
    totalNations: countries.length,
    totalPopulation: totalPop,
    totalMintedValueUSD: totalValUSD,
    averageCashPerCapitaUSD,
    highestPerCapitaCountry: highest,
    lowestPerCapitaCountry: lowest,
    totalPhysicalPieces: totalPieces,
  };
}

/**
 * Clean number formatting with standard suffixes (B, M, K)
 */
export function formatCompactNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
  if (abs >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

/**
 * Standard monetary formatting
 */
export function formatCurrency(
  val: number,
  symbol: string = '$',
  decimals: number = 2
): string {
  if (isNaN(val) || val === null || val === undefined) return `${symbol}0.00`;
  return `${symbol}${val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Color badge category based on USD per capita cash tier
 */
export function getPerCapitaCategory(perCapitaUSD: number): {
  label: string;
  badgeClass: string;
  heatColor: string;
} {
  if (perCapitaUSD >= 4000) {
    return {
      label: 'Ultra-High Cash Depth',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      heatColor: '#059669', // Emerald-600
    };
  }
  if (perCapitaUSD >= 2000) {
    return {
      label: 'High Cash Saturation',
      badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      heatColor: '#0d9488', // Teal-600
    };
  }
  if (perCapitaUSD >= 800) {
    return {
      label: 'Moderate Cash Liquidity',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      heatColor: '#2563eb', // Blue-600
    };
  }
  if (perCapitaUSD >= 250) {
    return {
      label: 'Emerging Cash Velocity',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      heatColor: '#d97706', // Amber-600
    };
  }
  return {
    label: 'Low Physical Cash / Digital Shift',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    heatColor: '#7c3aed', // Purple-600
  };
}
