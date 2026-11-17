import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePerCapita,
  calculateMintedTotals,
  convertCurrency,
  breakdownAmountIntoDenominations,
  calculateGlobalAggregates,
  formatCompactNumber,
} from './cashFlowCalculations';
import { DenominationInfo, CountryData } from '../types/cashFlow';

test('calculatePerCapita returns correct ratio and handles division by zero', () => {
  assert.equal(calculatePerCapita(1_000_000, 100_000), 10);
  assert.equal(calculatePerCapita(500, 0), 0);
  assert.equal(calculatePerCapita(500, -10), 0);
});

test('calculateMintedTotals accurately sums denominations and pieces', () => {
  const denominations: DenominationInfo[] = [
    {
      id: 'd1',
      type: 'banknote',
      faceValue: 100,
      unitLabel: '$100',
      circulationQuantityMillion: 10, // 10M * 100 = 1,000M
      totalValueMillionLocal: 1000,
      materialOrSubstrate: 'Cotton',
      seriesOrReleaseYear: '2020',
      securityFeatures: ['Watermark'],
      dimensionsMm: '156x66',
    },
    {
      id: 'd2',
      type: 'coin',
      faceValue: 1,
      unitLabel: '$1',
      circulationQuantityMillion: 40, // 40M * 1 = 40M
      totalValueMillionLocal: 40,
      materialOrSubstrate: 'Brass',
      seriesOrReleaseYear: '2018',
      securityFeatures: ['Reeded Edge'],
      dimensionsMm: '26mm',
    },
  ];

  const result = calculateMintedTotals(denominations);
  assert.equal(result.totalValueMillionLocal, 1040);
  assert.equal(result.totalValueLocal, 1040 * 1_000_000);
  assert.equal(result.totalPiecesMillion, 50);
  assert.equal(result.totalPieces, 50 * 1_000_000);
  assert.equal(result.notesPiecesPercent, 20); // 10 / 50 = 20%
  assert.equal(result.coinsPiecesPercent, 80); // 40 / 50 = 80%
});

test('convertCurrency performs accurate cross-currency conversion via USD rates', () => {
  // If 1 USD = 0.92 EUR and 1 USD = 150 JPY:
  // Convert 100 EUR to JPY: 100 / 0.92 * 150 = ~16304.347
  const eurToJpy = convertCurrency(100, 0.92, 150);
  assert.ok(Math.abs(eurToJpy - 16304.35) < 0.1);

  // Negative or zero amount
  assert.equal(convertCurrency(0, 1, 1), 0);
  assert.equal(convertCurrency(100, 0, 1), 0);
});

test('breakdownAmountIntoDenominations greedily decomposes amount into physical notes', () => {
  const denominations: DenominationInfo[] = [
    {
      id: 'b100',
      type: 'banknote',
      faceValue: 100,
      unitLabel: '$100',
      circulationQuantityMillion: 100,
      totalValueMillionLocal: 10000,
      materialOrSubstrate: 'Cotton',
      seriesOrReleaseYear: '2020',
      securityFeatures: [],
      dimensionsMm: '',
    },
    {
      id: 'b20',
      type: 'banknote',
      faceValue: 20,
      unitLabel: '$20',
      circulationQuantityMillion: 100,
      totalValueMillionLocal: 2000,
      materialOrSubstrate: 'Cotton',
      seriesOrReleaseYear: '2020',
      securityFeatures: [],
      dimensionsMm: '',
    },
    {
      id: 'c5',
      type: 'coin',
      faceValue: 5,
      unitLabel: '$5',
      circulationQuantityMillion: 100,
      totalValueMillionLocal: 500,
      materialOrSubstrate: 'Metal',
      seriesOrReleaseYear: '2020',
      securityFeatures: [],
      dimensionsMm: '',
    },
  ];

  const breakdown = breakdownAmountIntoDenominations(245, denominations);
  assert.equal(breakdown.totalPiecesCount, 5); // 2x100 + 2x20 + 1x5 = 5 pieces
  assert.equal(breakdown.remainder, 0);
  assert.equal(breakdown.items.length, 3);
  assert.equal(breakdown.items[0].count, 2); // 2 x $100
  assert.equal(breakdown.items[1].count, 2); // 2 x $20
  assert.equal(breakdown.items[2].count, 1); // 1 x $5
});

test('formatCompactNumber formats large numbers properly', () => {
  assert.equal(formatCompactNumber(1_500_000_000_000), '1.50 Trillion');
  assert.equal(formatCompactNumber(330_000_000), '330.00M');
  assert.equal(formatCompactNumber(1_400_000_000), '1.40B');
});
