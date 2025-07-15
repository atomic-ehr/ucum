import { describe, it, expect } from 'bun:test';
import { parseUnit } from '../src/parser/parser';
import type { Expression } from '../src/parser/ast';

describe('UCUM Parser', () => {
  describe('Basic units', () => {
    it('parses simple units', () => {
      const cases: [string, Expression][] = [
        ['m', { type: 'unit', atom: 'm' }],
        ['kg', { type: 'unit', prefix: 'k', atom: 'g' }],
        ['s', { type: 'unit', atom: 's' }],
        ['mol', { type: 'unit', atom: 'mol' }],
        ['K', { type: 'unit', atom: 'K' }],
        ['cd', { type: 'unit', atom: 'cd' }],
        ['rad', { type: 'unit', atom: 'rad' }]
      ];

      for (const [input, expected] of cases) {
        expect(parseUnit(input)).toEqual(expected);
      }
    });

    it('parses units with prefixes', () => {
      expect(parseUnit('mg')).toEqual({
        type: 'unit',
        prefix: 'm',
        atom: 'g'
      });

      expect(parseUnit('km')).toEqual({
        type: 'unit',
        prefix: 'k',
        atom: 'm'
      });

      expect(parseUnit('ns')).toEqual({
        type: 'unit',
        prefix: 'n',
        atom: 's'
      });

      expect(parseUnit('dL')).toEqual({
        type: 'unit',
        prefix: 'd',
        atom: 'L'
      });

      expect(parseUnit('dam')).toEqual({
        type: 'unit',
        prefix: 'da',
        atom: 'm'
      });
    });
  });

  describe('Exponents', () => {
    it('parses direct exponents', () => {
      expect(parseUnit('m2')).toEqual({
        type: 'unit',
        atom: 'm',
        exponent: 2
      });

      expect(parseUnit('s3')).toEqual({
        type: 'unit',
        atom: 's',
        exponent: 3
      });
    });

    it('parses caret exponents', () => {
      expect(parseUnit('m^2')).toEqual({
        type: 'unit',
        atom: 'm',
        exponent: 2,
        exponentFormat: '^'
      });

      expect(parseUnit('s^-1')).toEqual({
        type: 'unit',
        atom: 's',
        exponent: -1,
        exponentFormat: '^'
      });
    });

    it('parses signed exponents', () => {
      expect(parseUnit('m+2')).toEqual({
        type: 'unit',
        atom: 'm',
        exponent: 2,
        exponentFormat: '+'
      });

      expect(parseUnit('s-2')).toEqual({
        type: 'unit',
        atom: 's',
        exponent: -2,
        exponentFormat: '+'
      });
    });
  });

  describe('Binary operations', () => {
    it('parses multiplication', () => {
      expect(parseUnit('m.s')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's' }
      });

      expect(parseUnit('kg.m')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'unit', prefix: 'k', atom: 'g' },
        right: { type: 'unit', atom: 'm' }
      });
    });

    it('parses division', () => {
      expect(parseUnit('m/s')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's' }
      });

      expect(parseUnit('mg/dL')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'g' },
        right: { type: 'unit', prefix: 'd', atom: 'L' }
      });
    });

    it('parses complex expressions with correct associativity', () => {
      expect(parseUnit('m.s-2')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's', exponent: -2, exponentFormat: '+' }
      });

      expect(parseUnit('kg.m/s2')).toEqual({
        type: 'binary',
        operator: '/',
        left: {
          type: 'binary',
          operator: '.',
          left: { type: 'unit', prefix: 'k', atom: 'g' },
          right: { type: 'unit', atom: 'm' }
        },
        right: { type: 'unit', atom: 's', exponent: 2 }
      });
    });
  });

  describe('Leading division', () => {
    it('parses unary division', () => {
      expect(parseUnit('/s')).toEqual({
        type: 'unary',
        operator: '/',
        operand: { type: 'unit', atom: 's' }
      });

      expect(parseUnit('/m2')).toEqual({
        type: 'unary',
        operator: '/',
        operand: { type: 'unit', atom: 'm', exponent: 2 }
      });
    });
  });

  describe('Parentheses', () => {
    it('parses grouped expressions', () => {
      expect(parseUnit('(m/s)')).toEqual({
        type: 'group',
        expression: {
          type: 'binary',
          operator: '/',
          left: { type: 'unit', atom: 'm' },
          right: { type: 'unit', atom: 's' }
        }
      });

      expect(parseUnit('m/(s.s)')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'm' },
        right: {
          type: 'group',
          expression: {
            type: 'binary',
            operator: '.',
            left: { type: 'unit', atom: 's' },
            right: { type: 'unit', atom: 's' }
          }
        }
      });
    });

    it('parses complex nested expressions', () => {
      expect(parseUnit('(m/s)/s')).toEqual({
        type: 'binary',
        operator: '/',
        left: {
          type: 'group',
          expression: {
            type: 'binary',
            operator: '/',
            left: { type: 'unit', atom: 'm' },
            right: { type: 'unit', atom: 's' }
          }
        },
        right: { type: 'unit', atom: 's' }
      });
    });
  });

  describe('Annotations', () => {
    it('parses unit annotations', () => {
      expect(parseUnit('mg{total}')).toEqual({
        type: 'unit',
        prefix: 'm',
        atom: 'g',
        annotation: 'total'
      });

      expect(parseUnit('mL{RBC}')).toEqual({
        type: 'unit',
        prefix: 'm',
        atom: 'L',
        annotation: 'RBC'
      });
    });

    it('parses standalone annotations', () => {
      expect(parseUnit('{RBC}')).toEqual({
        type: 'factor',
        value: 1,
        annotation: 'RBC'
      });

      expect(parseUnit('{cells}')).toEqual({
        type: 'factor',
        value: 1,
        annotation: 'cells'
      });
    });

    it('parses factor annotations', () => {
      expect(parseUnit('10{cells}')).toEqual({
        type: 'factor',
        value: 10,
        annotation: 'cells'
      });
    });

    it('parses annotations in complex expressions', () => {
      expect(parseUnit('mg{total}/dL')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'g', annotation: 'total' },
        right: { type: 'unit', prefix: 'd', atom: 'L' }
      });
    });
  });

  describe('Factors', () => {
    it('parses integer factors', () => {
      expect(parseUnit('10')).toEqual({
        type: 'factor',
        value: 10
      });

      expect(parseUnit('100')).toEqual({
        type: 'factor',
        value: 100
      });
    });

    it('parses factors with units', () => {
      expect(parseUnit('10.m')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'factor', value: 10 },
        right: { type: 'unit', atom: 'm' }
      });

      expect(parseUnit('10.mL')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'factor', value: 10 },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });
    });
  });

  describe('Special notation units', () => {
    it('parses 10* and 10^ units', () => {
      expect(parseUnit('10*')).toEqual({
        type: 'unit',
        atom: '10*'
      });

      expect(parseUnit('10^')).toEqual({
        type: 'unit',
        atom: '10^'
      });
    });

    it('parses special units in expressions', () => {
      expect(parseUnit('10*6/mL')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: '10*', exponent: 6 },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });

      expect(parseUnit('10^-9.m')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: '10^', exponent: -9, exponentFormat: '+' },
        right: { type: 'unit', atom: 'm' }
      });
    });
  });

  describe('Complex real-world examples', () => {
    it('parses clinical units', () => {
      expect(parseUnit('mmol/L')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'mol' },
        right: { type: 'unit', atom: 'L' }
      });

      expect(parseUnit('U/mL')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'U' },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });

      expect(parseUnit('ng/mL')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'n', atom: 'g' },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });
    });

    it('parses physics units', () => {
      expect(parseUnit('N.m')).toEqual({
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'N' },
        right: { type: 'unit', atom: 'm' }
      });

      expect(parseUnit('J/K')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'J' },
        right: { type: 'unit', atom: 'K' }
      });

      expect(parseUnit('W/(m2.K)')).toEqual({
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'W' },
        right: {
          type: 'group',
          expression: {
            type: 'binary',
            operator: '.',
            left: { type: 'unit', atom: 'm', exponent: 2 },
            right: { type: 'unit', atom: 'K' }
          }
        }
      });
    });
  });
});