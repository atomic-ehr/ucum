import { describe, it, expect } from 'bun:test';
import { Dimension, Dimensions, type DimensionObject } from '../src/dimension';

describe('Dimension', () => {
  describe('multiply', () => {
    it('should multiply two simple dimensions', () => {
      const length = { L: 1 };
      const time = { T: -1 };
      const result = Dimension.multiply(length, time);
      expect(result).toEqual({ L: 1, T: -1 }); // velocity
    });

    it('should add exponents when multiplying same dimensions', () => {
      const area = { L: 2 };
      const length = { L: 1 };
      const result = Dimension.multiply(area, length);
      expect(result).toEqual({ L: 3 }); // volume
    });

    it('should handle negative exponents', () => {
      const frequency = { T: -1 };
      const time = { T: 1 };
      const result = Dimension.multiply(frequency, time);
      expect(result).toEqual({}); // dimensionless
    });

    it('should multiply complex dimensions (force × length = energy)', () => {
      const force = { L: 1, M: 1, T: -2 };
      const length = { L: 1 };
      const result = Dimension.multiply(force, length);
      expect(result).toEqual({ L: 2, M: 1, T: -2 }); // energy
    });

    it('should handle empty dimensions', () => {
      const dim = { L: 1, T: -1 };
      const empty = {};
      const result = Dimension.multiply(dim, empty);
      expect(result).toEqual({ L: 1, T: -1 });
    });

    it('should handle all dimension types', () => {
      const dim1 = { L: 1, M: 2, T: -1, A: 1, Θ: 1, Q: -1, F: 1 };
      const dim2 = { L: -1, M: 1, T: 2, A: -1, Θ: 1, Q: 1, F: -2 };
      const result = Dimension.multiply(dim1, dim2);
      expect(result).toEqual({ M: 3, T: 1, Θ: 2, F: -1 });
    });

    it('should use predefined dimensions', () => {
      const result = Dimension.multiply(Dimensions.FORCE, Dimensions.LENGTH);
      expect(result).toEqual(Dimensions.ENERGY);
    });
  });

  describe('divide', () => {
    it('should divide two simple dimensions', () => {
      const length = { L: 1 };
      const time = { T: 1 };
      const result = Dimension.divide(length, time);
      expect(result).toEqual({ L: 1, T: -1 }); // velocity
    });

    it('should subtract exponents when dividing', () => {
      const volume = { L: 3 };
      const area = { L: 2 };
      const result = Dimension.divide(volume, area);
      expect(result).toEqual({ L: 1 }); // length
    });

    it('should handle negative exponents', () => {
      const time = { T: 1 };
      const frequency = { T: -1 };
      const result = Dimension.divide(time, frequency);
      expect(result).toEqual({ T: 2 }); // time squared
    });

    it('should divide complex dimensions (energy ÷ time = power)', () => {
      const energy = { L: 2, M: 1, T: -2 };
      const time = { T: 1 };
      const result = Dimension.divide(energy, time);
      expect(result).toEqual({ L: 2, M: 1, T: -3 }); // power
    });

    it('should handle division by itself to get dimensionless', () => {
      const velocity = { L: 1, T: -1 };
      const result = Dimension.divide(velocity, velocity);
      expect(result).toEqual({}); // dimensionless
    });

    it('should handle empty dimensions', () => {
      const dim = { L: 2, M: 1 };
      const empty = {};
      const result = Dimension.divide(dim, empty);
      expect(result).toEqual({ L: 2, M: 1 });
    });

    it('should handle all dimension types', () => {
      const dim1 = { L: 2, M: 3, T: -1, A: 2, Θ: 1, Q: -1, F: 1 };
      const dim2 = { L: 1, M: 1, T: -2, A: 1, Θ: -1, Q: 1, F: 2 };
      const result = Dimension.divide(dim1, dim2);
      expect(result).toEqual({ L: 1, M: 2, T: 1, A: 1, Θ: 2, Q: -2, F: -1 });
    });

    it('should calculate pressure from force and area', () => {
      const force = Dimensions.FORCE;
      const area = Dimensions.AREA;
      const result = Dimension.divide(force, area);
      expect(result).toEqual(Dimensions.PRESSURE);
    });
  });

  describe('multiply and divide interaction', () => {
    it('should be inverse operations', () => {
      const dim1 = { L: 2, M: 1, T: -3 };
      const dim2 = { L: 1, T: -1, Q: 1 };
      
      // (dim1 × dim2) ÷ dim2 = dim1
      const multiplied = Dimension.multiply(dim1, dim2);
      const divided = Dimension.divide(multiplied, dim2);
      expect(divided).toEqual(dim1);
      
      // (dim1 ÷ dim2) × dim2 = dim1
      const divided2 = Dimension.divide(dim1, dim2);
      const multiplied2 = Dimension.multiply(divided2, dim2);
      expect(multiplied2).toEqual(dim1);
    });

    it('should handle complex unit conversions', () => {
      // kg·m/s² × m = kg·m²/s² (Force × Length = Energy)
      const newton = { M: 1, L: 1, T: -2 }; // Actually would be M: 1000 for kg
      const meter = { L: 1 };
      const joule = Dimension.multiply(newton, meter);
      expect(joule).toEqual({ M: 1, L: 2, T: -2 });
      
      // kg·m²/s² ÷ s = kg·m²/s³ (Energy ÷ Time = Power)
      const second = { T: 1 };
      const watt = Dimension.divide(joule, second);
      expect(watt).toEqual({ M: 1, L: 2, T: -3 });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined values correctly', () => {
      const dim1: DimensionObject = { L: undefined, M: 1 };
      const dim2: DimensionObject = { L: 1, M: undefined };
      
      const multiplied = Dimension.multiply(dim1, dim2);
      expect(multiplied).toEqual({ L: 1, M: 1 });
      
      const divided = Dimension.divide(dim1, dim2);
      expect(divided).toEqual({ L: -1, M: 1 });
    });

    it('should normalize zero values', () => {
      const dim1 = { L: 1, M: 0, T: -1 };
      const dim2 = { L: -1, M: 2, T: 1 };
      
      const result = Dimension.multiply(dim1, dim2);
      expect(result).toEqual({ M: 2 }); // L: 0 and T: 0 are removed
    });
  });
});