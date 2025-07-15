import { describe, it, expect } from 'bun:test';
import { Dimension, DimensionType, Dimensions } from '../src/dimension';
import type { DimensionObject } from '../src/dimension';

describe('Dimension', () => {
  describe('create', () => {
    it('should create empty dimension by default', () => {
      const dim = Dimension.create();
      expect(dim).toEqual({});
    });

    it('should create dimension with specified values', () => {
      const dim = Dimension.create({ L: 1, M: 2, T: -1 });
      expect(dim).toEqual({ L: 1, M: 2, T: -1 });
    });

    it('should omit zero values', () => {
      const dim = Dimension.create({ L: 1, M: 0, T: -1 });
      expect(dim).toEqual({ L: 1, T: -1 });
    });

    it('should create dimension with all values specified', () => {
      const dim = Dimension.create({ L: 1, M: 2, T: 3, A: 4, Θ: 5, Q: 6, F: 7 });
      expect(dim).toEqual({ L: 1, M: 2, T: 3, A: 4, Θ: 5, Q: 6, F: 7 });
    });
  });

  describe('multiply', () => {
    it('should add exponents when multiplying', () => {
      const a: DimensionObject = { L: 1, T: -1 }; // L·T⁻¹
      const b: DimensionObject = { L: 1, T: -1 }; // L·T⁻¹
      const result = Dimension.multiply(a, b);
      expect(result).toEqual({ L: 2, T: -2 }); // L²·T⁻²
    });

    it('should handle multiplication with empty dimensions', () => {
      const a: DimensionObject = { L: 1, M: 2, T: 3 };
      const empty: DimensionObject = {};
      const result = Dimension.multiply(a, empty);
      expect(result).toEqual({ L: 1, M: 2, T: 3 });
    });

    it('should handle multiplication with different dimensions', () => {
      const a: DimensionObject = { L: 1, M: 2 };
      const b: DimensionObject = { T: -1, Q: 1 };
      const result = Dimension.multiply(a, b);
      expect(result).toEqual({ L: 1, M: 2, T: -1, Q: 1 });
    });
  });

  describe('divide', () => {
    it('should subtract exponents when dividing', () => {
      const a: DimensionObject = { L: 2, M: 1, T: -2 }; // L²·M·T⁻²
      const b: DimensionObject = { L: 1, T: -1 }; // L·T⁻¹
      const result = Dimension.divide(a, b);
      expect(result).toEqual({ L: 1, M: 1, T: -1 }); // L·M·T⁻¹
    });

    it('should handle division by same dimension (dimensionless result)', () => {
      const a: DimensionObject = { L: 1, M: 2, T: 3 };
      const result = Dimension.divide(a, a);
      expect(result).toEqual({});
    });

    it('should handle division resulting in negative exponents', () => {
      const a: DimensionObject = { L: 1 };
      const b: DimensionObject = { L: 2, M: 1 };
      const result = Dimension.divide(a, b);
      expect(result).toEqual({ L: -1, M: -1 });
    });
  });

  describe('power', () => {
    it('should multiply all exponents by power', () => {
      const dim: DimensionObject = { L: 1, T: -1 }; // L·T⁻¹
      const result = Dimension.power(dim, 2);
      expect(result).toEqual({ L: 2, T: -2 }); // L²·T⁻²
    });

    it('should handle power of 0', () => {
      const dim: DimensionObject = { L: 1, M: 2, T: 3 };
      const result = Dimension.power(dim, 0);
      expect(result).toEqual({});
    });

    it('should handle negative powers', () => {
      const dim: DimensionObject = { L: 1, T: -1 };
      const result = Dimension.power(dim, -1);
      expect(result).toEqual({ L: -1, T: 1 });
    });

    it('should handle fractional powers', () => {
      const dim: DimensionObject = { L: 2, M: 4 };
      const result = Dimension.power(dim, 0.5);
      expect(result).toEqual({ L: 1, M: 2 });
    });
  });

  describe('equals', () => {
    it('should return true for equal dimensions', () => {
      const a: DimensionObject = { L: 1, M: 2, T: 3 };
      const b: DimensionObject = { L: 1, M: 2, T: 3 };
      expect(Dimension.equals(a, b)).toBe(true);
    });

    it('should return false for different dimensions', () => {
      const a: DimensionObject = { L: 1, M: 2, T: 3 };
      const b: DimensionObject = { L: 1, M: 2, T: 4 };
      expect(Dimension.equals(a, b)).toBe(false);
    });

    it('should handle missing properties as zero', () => {
      const a: DimensionObject = { L: 1, M: 0 };
      const b: DimensionObject = { L: 1 };
      expect(Dimension.equals(a, b)).toBe(true);
    });

    it('should return true for both empty objects', () => {
      expect(Dimension.equals({}, {})).toBe(true);
    });
  });

  describe('isDimensionless', () => {
    it('should return true for empty object', () => {
      const dim: DimensionObject = {};
      expect(Dimension.isDimensionless(dim)).toBe(true);
    });

    it('should return false for non-zero dimension', () => {
      const dim: DimensionObject = { L: 1 };
      expect(Dimension.isDimensionless(dim)).toBe(false);
    });

    it('should return true when all values are zero', () => {
      const dim: DimensionObject = { L: 0, M: 0, T: 0 };
      expect(Dimension.isDimensionless(dim)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return "1" for dimensionless', () => {
      const dim: DimensionObject = {};
      expect(Dimension.toString(dim)).toBe('1');
    });

    it('should format single dimension without exponent', () => {
      const dim: DimensionObject = { L: 1 };
      expect(Dimension.toString(dim)).toBe('L');
    });

    it('should format single dimension with exponent', () => {
      const dim: DimensionObject = { L: 2 };
      expect(Dimension.toString(dim)).toBe('L^2');
    });

    it('should format multiple dimensions', () => {
      const dim: DimensionObject = { L: 1, M: 1, T: -2 };
      expect(Dimension.toString(dim)).toBe('L·M·T^-2');
    });

    it('should format all dimensions in correct order', () => {
      const dim: DimensionObject = { L: 1, M: 2, T: -3, A: 4, Θ: -5, Q: 6, F: -7 };
      expect(Dimension.toString(dim)).toBe('L·M^2·T^-3·A^4·Θ^-5·Q^6·F^-7');
    });

    it('should skip zero exponents', () => {
      const dim: DimensionObject = { L: 1, M: 0, T: -1 };
      expect(Dimension.toString(dim)).toBe('L·T^-1');
    });
  });

  describe('DimensionType enum', () => {
    it('should have correct indices', () => {
      expect(DimensionType.L).toBe(0);
      expect(DimensionType.Length).toBe(0);
      expect(DimensionType.M).toBe(1);
      expect(DimensionType.Mass).toBe(1);
      expect(DimensionType.T).toBe(2);
      expect(DimensionType.Time).toBe(2);
      expect(DimensionType.A).toBe(3);
      expect(DimensionType.Angle).toBe(3);
      expect(DimensionType.Theta).toBe(4);
      expect(DimensionType.Temperature).toBe(4);
      expect(DimensionType.Q).toBe(5);
      expect(DimensionType.Charge).toBe(5);
      expect(DimensionType.F).toBe(6);
      expect(DimensionType.Luminosity).toBe(6);
    });
  });

  describe('Predefined dimensions', () => {
    it('should have correct base dimensions', () => {
      expect(Dimensions.DIMENSIONLESS).toEqual({});
      expect(Dimensions.LENGTH).toEqual({ L: 1 });
      expect(Dimensions.MASS).toEqual({ M: 1 });
      expect(Dimensions.TIME).toEqual({ T: 1 });
      expect(Dimensions.ANGLE).toEqual({ A: 1 });
      expect(Dimensions.TEMPERATURE).toEqual({ Θ: 1 });
      expect(Dimensions.CHARGE).toEqual({ Q: 1 });
      expect(Dimensions.LUMINOSITY).toEqual({ F: 1 });
    });

    it('should have correct derived dimensions', () => {
      expect(Dimensions.AREA).toEqual({ L: 2 });
      expect(Dimensions.VOLUME).toEqual({ L: 3 });
      expect(Dimensions.VELOCITY).toEqual({ L: 1, T: -1 });
      expect(Dimensions.ACCELERATION).toEqual({ L: 1, T: -2 });
      expect(Dimensions.FORCE).toEqual({ L: 1, M: 1, T: -2 });
      expect(Dimensions.ENERGY).toEqual({ L: 2, M: 1, T: -2 });
      expect(Dimensions.POWER).toEqual({ L: 2, M: 1, T: -3 });
      expect(Dimensions.PRESSURE).toEqual({ L: -1, M: 1, T: -2 });
      expect(Dimensions.FREQUENCY).toEqual({ T: -1 });
      expect(Dimensions.ELECTRIC_POTENTIAL).toEqual({ L: 2, M: 1, T: -3, Q: -1 });
      expect(Dimensions.ELECTRIC_RESISTANCE).toEqual({ L: 2, M: 1, T: -3, Q: -2 });
      expect(Dimensions.ELECTRIC_CONDUCTANCE).toEqual({ L: -2, M: -1, T: 3, Q: 2 });
      expect(Dimensions.ELECTRIC_CAPACITANCE).toEqual({ L: -2, M: -1, T: 4, Q: 2 });
    });
  });

  describe('Complex dimension operations', () => {
    it('should calculate force from mass and acceleration', () => {
      const mass = Dimensions.MASS;
      const acceleration = Dimensions.ACCELERATION;
      const force = Dimension.multiply(mass, acceleration);
      expect(force).toEqual(Dimensions.FORCE);
    });

    it('should calculate energy from force and length', () => {
      const force = Dimensions.FORCE;
      const length = Dimensions.LENGTH;
      const energy = Dimension.multiply(force, length);
      expect(energy).toEqual(Dimensions.ENERGY);
    });

    it('should calculate power from energy and frequency', () => {
      const energy = Dimensions.ENERGY;
      const frequency = Dimensions.FREQUENCY;
      const power = Dimension.multiply(energy, frequency);
      expect(power).toEqual(Dimensions.POWER);
    });

    it('should verify pressure formula', () => {
      const force = Dimensions.FORCE;
      const area = Dimensions.AREA;
      const pressure = Dimension.divide(force, area);
      expect(pressure).toEqual(Dimensions.PRESSURE);
    });
  });
});