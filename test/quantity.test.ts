import { describe, it, expect } from 'bun:test';
import {
  quantity,
  add,
  subtract,
  multiply,
  divide,
  pow,
  equals,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  toUnit,
  getValue,
  areCompatible,
  getDimension,
  isSpecialUnit,
  isArbitraryUnit,
  areUnitsCompatible,
  SpecialUnitArithmeticError,
  ArbitraryUnitConversionError
} from '../src/quantity';
import { ConversionError, IncompatibleDimensionsError } from '../src/conversion';

describe('Quantity creation', () => {
  it('should create a quantity with valid unit', () => {
    const q = quantity(5, 'kg');
    expect(q.value).toBe(5);
    expect(q.unit).toBe('kg');
  });

  it('should throw for invalid units', () => {
    expect(() => quantity(5, 'invalid_unit')).toThrow(ConversionError);
    expect(() => quantity(5, 'xyz')).toThrow();
  });

  it('should handle zero and negative values', () => {
    expect(quantity(0, 'm').value).toBe(0);
    expect(quantity(-5, 'm').value).toBe(-5);
  });

  it('should handle dimensionless units', () => {
    const q = quantity(0.5, '1');
    expect(q.value).toBe(0.5);
    expect(q.unit).toBe('1');
  });
});

describe('Unit classification', () => {
  it('should identify special units', () => {
    expect(isSpecialUnit('Cel')).toBe(true);
    expect(isSpecialUnit('[degF]')).toBe(true);
    expect(isSpecialUnit('[pH]')).toBe(true);
    expect(isSpecialUnit('dB')).toBe(true);
    expect(isSpecialUnit('Np')).toBe(true);
    
    expect(isSpecialUnit('kg')).toBe(false);
    expect(isSpecialUnit('m')).toBe(false);
    expect(isSpecialUnit('J')).toBe(false);
  });

  it('should identify arbitrary units', () => {
    expect(isArbitraryUnit('[IU]')).toBe(true);
    expect(isArbitraryUnit('[arb\'U]')).toBe(true);
    expect(isArbitraryUnit('[USP\'U]')).toBe(true);
    
    expect(isArbitraryUnit('kg')).toBe(false);
    expect(isArbitraryUnit('Cel')).toBe(false);
  });

  it('should check unit compatibility', () => {
    expect(areUnitsCompatible('kg', 'g')).toBe(true);
    expect(areUnitsCompatible('m', 'km')).toBe(true);
    expect(areUnitsCompatible('J', 'cal_th')).toBe(true);
    
    expect(areUnitsCompatible('kg', 'm')).toBe(false);
    expect(areUnitsCompatible('J', 'W')).toBe(false);
  });
});

describe('Addition', () => {
  it('should add quantities with same unit', () => {
    const q1 = quantity(5, 'kg');
    const q2 = quantity(3, 'kg');
    const result = add(q1, q2);
    expect(result.value).toBe(8);
    expect(result.unit).toBe('kg');
  });

  it('should add quantities with different but compatible units', () => {
    const q1 = quantity(5, 'kg');
    const q2 = quantity(3000, 'g');
    const result = add(q1, q2);
    expect(result.value).toBe(8);
    expect(result.unit).toBe('kg');
  });

  it('should preserve first operand unit', () => {
    const q1 = quantity(3000, 'g');
    const q2 = quantity(5, 'kg');
    const result = add(q1, q2);
    expect(result.value).toBe(8000);
    expect(result.unit).toBe('g');
  });

  it('should throw for incompatible dimensions', () => {
    const q1 = quantity(5, 'kg');
    const q2 = quantity(3, 'm');
    expect(() => add(q1, q2)).toThrow(IncompatibleDimensionsError);
  });

  it('should throw for special units', () => {
    const q1 = quantity(20, 'Cel');
    const q2 = quantity(5, 'Cel');
    expect(() => add(q1, q2)).toThrow(SpecialUnitArithmeticError);
  });

  it('should handle arbitrary units of same type', () => {
    const q1 = quantity(10, '[IU]');
    const q2 = quantity(5, '[IU]');
    const result = add(q1, q2);
    expect(result.value).toBe(15);
    expect(result.unit).toBe('[IU]');
  });

  it('should throw for different arbitrary units', () => {
    const q1 = quantity(10, '[IU]');
    const q2 = quantity(5, '[arb\'U]');
    expect(() => add(q1, q2)).toThrow(ArbitraryUnitConversionError);
  });
});

describe('Subtraction', () => {
  it('should subtract quantities with same unit', () => {
    const q1 = quantity(8, 'kg');
    const q2 = quantity(3, 'kg');
    const result = subtract(q1, q2);
    expect(result.value).toBe(5);
    expect(result.unit).toBe('kg');
  });

  it('should subtract quantities with different but compatible units', () => {
    const q1 = quantity(5, 'kg');
    const q2 = quantity(2000, 'g');
    const result = subtract(q1, q2);
    expect(result.value).toBe(3);
    expect(result.unit).toBe('kg');
  });

  it('should handle negative results', () => {
    const q1 = quantity(3, 'kg');
    const q2 = quantity(5, 'kg');
    const result = subtract(q1, q2);
    expect(result.value).toBe(-2);
    expect(result.unit).toBe('kg');
  });

  it('should throw for special units', () => {
    const q1 = quantity(25, 'Cel');
    const q2 = quantity(20, 'Cel');
    expect(() => subtract(q1, q2)).toThrow(SpecialUnitArithmeticError);
  });
});

describe('Multiplication', () => {
  it('should multiply two quantities', () => {
    const q1 = quantity(10, 'kg');
    const q2 = quantity(5, 'm/s2');
    const result = multiply(q1, q2);
    expect(result.value).toBe(50);
    expect(result.unit).toBe('kg.m/s2');
  });

  it('should multiply quantity by scalar', () => {
    const q = quantity(5, 'kg');
    const result = multiply(q, 3);
    expect(result.value).toBe(15);
    expect(result.unit).toBe('kg');
  });

  it('should handle dimensionless units', () => {
    const q1 = quantity(5, 'm');
    const q2 = quantity(2, '1');
    const result = multiply(q1, q2);
    expect(result.value).toBe(10);
    expect(result.unit).toBe('m');
  });

  it('should throw for special units', () => {
    const q1 = quantity(20, 'Cel');
    const q2 = quantity(2, '1');
    expect(() => multiply(q1, q2)).toThrow(SpecialUnitArithmeticError);
  });

  it('should handle arbitrary units', () => {
    const q1 = quantity(10, '[IU]');
    const result = multiply(q1, 2);
    expect(result.value).toBe(20);
    expect(result.unit).toBe('[IU]');
  });
});

describe('Division', () => {
  it('should divide two quantities', () => {
    const q1 = quantity(100, 'm');
    const q2 = quantity(5, 's');
    const result = divide(q1, q2);
    expect(result.value).toBe(20);
    expect(result.unit).toBe('m/s');
  });

  it('should divide quantity by scalar', () => {
    const q = quantity(15, 'kg');
    const result = divide(q, 3);
    expect(result.value).toBe(5);
    expect(result.unit).toBe('kg');
  });

  it('should cancel out same units', () => {
    const q1 = quantity(10, 'm');
    const q2 = quantity(2, 'm');
    const result = divide(q1, q2);
    expect(result.value).toBe(5);
    expect(result.unit).toBe('1');
  });

  it('should throw for division by zero', () => {
    const q1 = quantity(10, 'm');
    const q2 = quantity(0, 's');
    expect(() => divide(q1, q2)).toThrow('Division by zero');
    expect(() => divide(q1, 0)).toThrow('Division by zero');
  });

  it('should throw for special units', () => {
    const q1 = quantity(100, '[pH]');
    const q2 = quantity(2, '[pH]');
    expect(() => divide(q1, q2)).toThrow(SpecialUnitArithmeticError);
  });
});

describe('Power', () => {
  it('should raise quantity to positive integer power', () => {
    const q = quantity(5, 'm');
    const result = pow(q, 2);
    expect(result.value).toBe(25);
    expect(result.unit).toBe('m2');
  });

  it('should handle power of 0', () => {
    const q = quantity(5, 'm');
    const result = pow(q, 0);
    expect(result.value).toBe(1);
    expect(result.unit).toBe('1');
  });

  it('should handle power of 1', () => {
    const q = quantity(5, 'm');
    const result = pow(q, 1);
    expect(result.value).toBe(5);
    expect(result.unit).toBe('m');
  });

  it('should handle negative powers', () => {
    const q = quantity(4, 'm');
    const result = pow(q, -1);
    expect(result.value).toBe(0.25);
    expect(result.unit).toBe('m-1');
  });

  it('should handle fractional powers', () => {
    const q = quantity(4, 'm2');
    const result = pow(q, 0.5);
    expect(result.value).toBe(2);
    expect(result.unit).toBe('m20.5');
  });

  it('should throw for special units', () => {
    const q = quantity(10, 'dB');
    expect(() => pow(q, 2)).toThrow(SpecialUnitArithmeticError);
  });

  it('should throw for arbitrary units', () => {
    const q = quantity(10, '[IU]');
    expect(() => pow(q, 2)).toThrow(SpecialUnitArithmeticError);
  });
});

describe('Comparison operations', () => {
  describe('equals', () => {
    it('should compare same units', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(5, 'kg');
      expect(equals(q1, q2)).toBe(true);
    });

    it('should compare different but compatible units', () => {
      const q1 = quantity(1, 'kg');
      const q2 = quantity(1000, 'g');
      expect(equals(q1, q2)).toBe(true);
    });

    it('should handle tolerance', () => {
      const q1 = quantity(1, 'kg');
      const q2 = quantity(1000.001, 'g'); // 1.000001 kg
      expect(equals(q1, q2, 1e-5)).toBe(true);
      expect(equals(q1, q2, 1e-7)).toBe(false);
    });

    it('should return false for incompatible units', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(5, 'm');
      expect(equals(q1, q2)).toBe(false);
    });

    it('should handle arbitrary units', () => {
      const q1 = quantity(10, '[IU]');
      const q2 = quantity(10, '[IU]');
      expect(equals(q1, q2)).toBe(true);
      
      const q3 = quantity(10, '[arb\'U]');
      expect(equals(q1, q3)).toBe(false);
    });
  });

  describe('ordering comparisons', () => {
    it('should compare less than', () => {
      const q1 = quantity(3, 'kg');
      const q2 = quantity(5, 'kg');
      expect(lessThan(q1, q2)).toBe(true);
      expect(lessThan(q2, q1)).toBe(false);
    });

    it('should compare with unit conversion', () => {
      const q1 = quantity(500, 'g');
      const q2 = quantity(1, 'kg');
      expect(lessThan(q1, q2)).toBe(true);
    });

    it('should compare greater than', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(3, 'kg');
      expect(greaterThan(q1, q2)).toBe(true);
      expect(greaterThan(q2, q1)).toBe(false);
    });

    it('should handle less than or equal', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(5, 'kg');
      const q3 = quantity(6, 'kg');
      expect(lessThanOrEqual(q1, q2)).toBe(true);
      expect(lessThanOrEqual(q1, q3)).toBe(true);
      expect(lessThanOrEqual(q3, q1)).toBe(false);
    });

    it('should handle greater than or equal', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(5, 'kg');
      const q3 = quantity(4, 'kg');
      expect(greaterThanOrEqual(q1, q2)).toBe(true);
      expect(greaterThanOrEqual(q1, q3)).toBe(true);
      expect(greaterThanOrEqual(q3, q1)).toBe(false);
    });

    it('should throw for incompatible units', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(5, 'm');
      expect(() => lessThan(q1, q2)).toThrow(IncompatibleDimensionsError);
    });
  });
});

describe('Utility functions', () => {
  describe('toUnit', () => {
    it('should convert to different unit', () => {
      const q = quantity(5, 'kg');
      const result = toUnit(q, 'g');
      expect(result.value).toBe(5000);
      expect(result.unit).toBe('g');
    });

    it('should handle same unit', () => {
      const q = quantity(5, 'kg');
      const result = toUnit(q, 'kg');
      expect(result.value).toBe(5);
      expect(result.unit).toBe('kg');
    });

    it('should allow special unit conversions', () => {
      const q = quantity(20, 'Cel');
      const result = toUnit(q, '[degF]');
      expect(result.value).toBeCloseTo(68, 5);
      expect(result.unit).toBe('[degF]');
    });

    it('should throw for arbitrary unit conversions', () => {
      const q = quantity(10, '[IU]');
      expect(() => toUnit(q, 'mg')).toThrow(ArbitraryUnitConversionError);
    });
  });

  describe('getValue', () => {
    it('should get value in original unit', () => {
      const q = quantity(5, 'kg');
      expect(getValue(q)).toBe(5);
    });

    it('should get value in different unit', () => {
      const q = quantity(5, 'kg');
      expect(getValue(q, 'g')).toBe(5000);
    });

    it('should handle same unit', () => {
      const q = quantity(5, 'kg');
      expect(getValue(q, 'kg')).toBe(5);
    });
  });

  describe('areCompatible', () => {
    it('should check compatibility', () => {
      const q1 = quantity(5, 'kg');
      const q2 = quantity(3000, 'g');
      const q3 = quantity(10, 'm');
      
      expect(areCompatible(q1, q2)).toBe(true);
      expect(areCompatible(q1, q3)).toBe(false);
    });
  });

  describe('getDimension', () => {
    it('should get dimension of quantity', () => {
      const q1 = quantity(5, 'kg');
      const dim1 = getDimension(q1);
      expect(dim1).toEqual({ M: 1 });
      
      const q2 = quantity(10, 'm/s2');
      const dim2 = getDimension(q2);
      expect(dim2).toEqual({ L: 1, T: -2 });
    });
  });
});

describe('Edge cases', () => {
  it('should handle NaN values', () => {
    const q1 = quantity(NaN, 'kg');
    const q2 = quantity(5, 'kg');
    const result = add(q1, q2);
    expect(result.value).toBeNaN();
  });

  it('should handle Infinity', () => {
    const q1 = quantity(Infinity, 'm');
    const q2 = quantity(5, 'm');
    const result = add(q1, q2);
    expect(result.value).toBe(Infinity);
  });

  it('should handle very large numbers', () => {
    const q1 = quantity(1e20, 'kg');
    const q2 = quantity(1e20, 'kg');
    const result = add(q1, q2);
    expect(result.value).toBe(2e20);
  });

  it('should handle very small numbers', () => {
    const q1 = quantity(1e-20, 'kg');
    const q2 = quantity(1e-20, 'kg');
    const result = add(q1, q2);
    expect(result.value).toBe(2e-20);
  });
});

describe('Complex operations', () => {
  it('should chain operations correctly', () => {
    // F = m * a
    const mass = quantity(10, 'kg');
    const acceleration = quantity(5, 'm/s2');
    const force = multiply(mass, acceleration);
    
    expect(force.value).toBe(50);
    expect(force.unit).toBe('kg.m/s2');
    
    // Convert to Newtons
    const forceInNewtons = toUnit(force, 'N');
    expect(forceInNewtons.value).toBe(50);
    expect(forceInNewtons.unit).toBe('N');
  });

  it('should calculate density', () => {
    // density = mass / volume
    const mass = quantity(1000, 'g');
    const volume = quantity(1, 'L');
    const density = divide(mass, volume);
    
    expect(density.value).toBe(1000);
    expect(density.unit).toBe('g/L');
    
    // Convert to kg/m3
    const densityInSI = toUnit(density, 'kg/m3');
    expect(densityInSI.value).toBeCloseTo(1000, 5);
  });
});