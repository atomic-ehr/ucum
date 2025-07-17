import { describe, it, expect } from 'bun:test';
import {
  quantity,
  multiply,
  divide,
  toUnit,
  isArbitraryUnit,
  ArbitraryUnitConversionError
} from '../src/quantity';

describe('Arbitrary unit handling in complex expressions', () => {
  it('should detect arbitrary units in complex expressions', () => {
    // These should be detected as arbitrary
    expect(isArbitraryUnit('[IU]/mL')).toBe(true);
    expect(isArbitraryUnit('mg/[IU]')).toBe(true);
    expect(isArbitraryUnit('[arb\'U].s')).toBe(true);
  });

  it('should handle multiplication with arbitrary units', () => {
    const q1 = quantity(10, '[IU]');
    const q2 = quantity(5, 'mL');
    const result = multiply(q1, q2);
    
    expect(result.value).toBe(50);
    expect(result.unit).toBe('[IU].mL');
    
    // Result should be arbitrary
    expect(isArbitraryUnit(result.unit)).toBe(true);
  });

  it('should handle division with arbitrary units', () => {
    const q1 = quantity(100, '[IU]');
    const q2 = quantity(5, 'mL');
    const result = divide(q1, q2);
    
    expect(result.value).toBe(20);
    expect(result.unit).toBe('[IU]/mL');
    
    // Result should be arbitrary
    expect(isArbitraryUnit(result.unit)).toBe(true);
  });

  it('should prevent conversion of arbitrary unit expressions', () => {
    const q = quantity(10, '[IU]/mL');
    expect(() => toUnit(q, 'mg/L')).toThrow(ArbitraryUnitConversionError);
  });
});