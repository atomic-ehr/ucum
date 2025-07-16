import { describe, it, expect } from 'bun:test';
import { toCanonicalForm, toCanonicalFormFromAST } from '../src/canonical-form';
import { parseUnit } from '../src/parser';

describe('Canonical Form', () => {
  describe('Base Units', () => {
    it('should handle meter', () => {
      const result = toCanonicalForm('m');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { L: 1 },
        units: [{ unit: 'm', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle gram', () => {
      const result = toCanonicalForm('g');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { M: 1 },
        units: [{ unit: 'g', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle second', () => {
      const result = toCanonicalForm('s');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { T: 1 },
        units: [{ unit: 's', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle radian', () => {
      const result = toCanonicalForm('rad');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { A: 1 },
        units: [{ unit: 'rad', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle kelvin', () => {
      const result = toCanonicalForm('K');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { Θ: 1 },
        units: [{ unit: 'K', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle coulomb', () => {
      const result = toCanonicalForm('C');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { Q: 1 },
        units: [{ unit: 'C', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle candela', () => {
      const result = toCanonicalForm('cd');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { F: 1 },
        units: [{ unit: 'cd', exponent: 1 }],
        specialFunction: undefined
      });
    });
  });

  describe('Prefixed Units', () => {
    it('should handle kilometer', () => {
      const result = toCanonicalForm('km');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { L: 1 },
        units: [{ unit: 'm', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle milligram', () => {
      const result = toCanonicalForm('mg');
      expect(result).toEqual({
        magnitude: 0.001,
        dimension: { M: 1 },
        units: [{ unit: 'g', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle microsecond', () => {
      const result = toCanonicalForm('us');
      expect(result).toEqual({
        magnitude: 0.000001,
        dimension: { T: 1 },
        units: [{ unit: 's', exponent: 1 }],
        specialFunction: undefined
      });
    });

    it('should handle square centimeter', () => {
      const result = toCanonicalForm('cm2');
      expect(result).toEqual({
        magnitude: 0.0001,
        dimension: { L: 2 },
        units: [{ unit: 'm', exponent: 2 }],
        specialFunction: undefined
      });
    });
  });

  describe('Derived Units', () => {
    it('should handle hertz', () => {
      const result = toCanonicalForm('Hz');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { T: -1 },
        units: [{ unit: 's', exponent: -1 }],
        specialFunction: undefined
      });
    });

    it('should handle newton', () => {
      const result = toCanonicalForm('N');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 1, T: -2 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 1 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });

    it('should handle pascal', () => {
      const result = toCanonicalForm('Pa');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: -1, T: -2 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: -1 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });

    it('should handle joule', () => {
      const result = toCanonicalForm('J');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 2, T: -2 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 2 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });

    it('should handle volt', () => {
      const result = toCanonicalForm('V');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 2, T: -2, Q: -1 },
        units: [
          { unit: 'C', exponent: -1 },
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 2 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });
  });

  describe('Special Units', () => {
    it('should handle degree Celsius', () => {
      const result = toCanonicalForm('Cel');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { Θ: 1 },
        units: [{ unit: 'K', exponent: 1 }],
        specialFunction: {
          name: 'Cel',
          value: '1',
          unit: 'K'
        }
      });
    });

    it('should handle pH', () => {
      const result = toCanonicalForm('[pH]');
      expect(result.specialFunction).toEqual({
        name: 'pH',
        value: '1',
        unit: 'mol/l'
      });
      // pH is based on mol/L, where mol is dimensionless in UCUM
      expect(result.dimension).toEqual({ L: -3 });
    });

    it('should handle neper', () => {
      const result = toCanonicalForm('Np');
      expect(result).toEqual({
        magnitude: 1,
        dimension: {},
        units: [],
        specialFunction: {
          name: 'ln',
          value: '1',
          unit: '1'
        }
      });
    });
  });

  describe('Complex Expressions', () => {
    it('should handle km/h', () => {
      const result = toCanonicalForm('km/h');
      expect(result.magnitude).toBeCloseTo(0.277778, 5);
      expect(result.dimension).toEqual({ L: 1, T: -1 });
      expect(result.units).toEqual([
        { unit: 'm', exponent: 1 },
        { unit: 's', exponent: -1 }
      ]);
    });

    it('should handle mg/dL', () => {
      const result = toCanonicalForm('mg/dL');
      expect(result.magnitude).toBeCloseTo(10, 10);
      expect(result.dimension).toEqual({ M: 1, L: -3 });
      expect(result.units).toEqual([
        { unit: 'g', exponent: 1 },
        { unit: 'm', exponent: -3 }
      ]);
    });

    it('should handle kg.m/s2', () => {
      const result = toCanonicalForm('kg.m/s2');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 1, T: -2 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 1 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });

    it('should handle m2.kg/s3', () => {
      const result = toCanonicalForm('m2.kg/s3');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 2, T: -3 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 2 },
          { unit: 's', exponent: -3 }
        ],
        specialFunction: undefined
      });
    });
  });

  describe('Dimensionless Units', () => {
    it('should handle percent', () => {
      const result = toCanonicalForm('%');
      expect(result).toEqual({
        magnitude: 0.01,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });

    it('should handle permille', () => {
      const result = toCanonicalForm('[ppth]');
      expect(result).toEqual({
        magnitude: 0.001,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });

    it('should handle parts per million', () => {
      const result = toCanonicalForm('[ppm]');
      expect(result).toEqual({
        magnitude: 0.000001,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle the unit one', () => {
      const result = toCanonicalForm('1');
      expect(result).toEqual({
        magnitude: 1,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });

    it('should handle 10*', () => {
      const result = toCanonicalForm('10*');
      expect(result).toEqual({
        magnitude: 10,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });

    it('should handle 10^', () => {
      const result = toCanonicalForm('10^');
      expect(result).toEqual({
        magnitude: 10,
        dimension: {},
        units: [],
        specialFunction: undefined
      });
    });

    it('should handle [pi]', () => {
      const result = toCanonicalForm('[pi]');
      expect(result.magnitude).toBeCloseTo(3.14159265, 6);
      expect(result.dimension).toEqual({});
      expect(result.units).toEqual([]);
    });
  });

  describe('Non-metric Units', () => {
    it('should handle international foot', () => {
      const result = toCanonicalForm('[ft_i]');
      expect(result.magnitude).toBeCloseTo(0.3048, 4);
      expect(result.dimension).toEqual({ L: 1 });
      expect(result.units).toEqual([{ unit: 'm', exponent: 1 }]);
    });

    it('should handle pound', () => {
      const result = toCanonicalForm('[lb_av]');
      expect(result.magnitude).toBeCloseTo(453.59237, 4);
      expect(result.dimension).toEqual({ M: 1 });
      expect(result.units).toEqual([{ unit: 'g', exponent: 1 }]);
    });
  });

  describe('AST Processing', () => {
    it('should process AST directly', () => {
      const ast = parseUnit('km/h');
      const result = toCanonicalFormFromAST(ast);
      expect(result.magnitude).toBeCloseTo(0.277778, 5);
      expect(result.dimension).toEqual({ L: 1, T: -1 });
    });

    it('should handle grouped expressions', () => {
      const result = toCanonicalForm('(kg.m)/s2');
      expect(result).toEqual({
        magnitude: 1000,
        dimension: { M: 1, L: 1, T: -2 },
        units: [
          { unit: 'g', exponent: 1 },
          { unit: 'm', exponent: 1 },
          { unit: 's', exponent: -2 }
        ],
        specialFunction: undefined
      });
    });

    it('should handle leading division', () => {
      const result = toCanonicalForm('/s');
      expect(result).toEqual({
        magnitude: 1,
        dimension: { T: -1 },
        units: [{ unit: 's', exponent: -1 }],
        specialFunction: undefined
      });
    });

    it('should handle numeric factors', () => {
      const result = toCanonicalForm('2.m');
      expect(result).toEqual({
        magnitude: 2,
        dimension: { L: 1 },
        units: [{ unit: 'm', exponent: 1 }],
        specialFunction: undefined
      });
    });
  });
});