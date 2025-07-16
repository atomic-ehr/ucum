import { describe, it, expect } from 'bun:test';
import { parseUnit } from '../src/parser/parser';
import type { Expression } from '../src/parser/ast';
import { expectParseSuccess, expectParseError } from './test-utils';

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
        const result = parseUnit(input);
        expectParseSuccess(result, expected);
      }
    });

    it('parses units with prefixes', () => {
      expectParseSuccess(parseUnit('mg'), {
        type: 'unit',
        prefix: 'm',
        atom: 'g'
      });

      expectParseSuccess(parseUnit('km'), {
        type: 'unit',
        prefix: 'k',
        atom: 'm'
      });

      expectParseSuccess(parseUnit('ns'), {
        type: 'unit',
        prefix: 'n',
        atom: 's'
      });

      expectParseSuccess(parseUnit('dL'), {
        type: 'unit',
        prefix: 'd',
        atom: 'L'
      });

      expectParseSuccess(parseUnit('dam'), {
        type: 'unit',
        prefix: 'da',
        atom: 'm'
      });
    });
  });

  describe('Exponents', () => {
    it('parses direct exponents', () => {
      expectParseSuccess(parseUnit('m2'), {
        type: 'unit',
        atom: 'm',
        exponent: 2
      });

      expectParseSuccess(parseUnit('s3'), {
        type: 'unit',
        atom: 's',
        exponent: 3
      });
    });

    it('parses caret exponents', () => {
      expectParseSuccess(parseUnit('m^2'), {
        type: 'unit',
        atom: 'm',
        exponent: 2,
        exponentFormat: '^'
      });

      expectParseSuccess(parseUnit('s^-1'), {
        type: 'unit',
        atom: 's',
        exponent: -1,
        exponentFormat: '^'
      });
    });

    it('parses signed exponents', () => {
      expectParseSuccess(parseUnit('m+2'), {
        type: 'unit',
        atom: 'm',
        exponent: 2,
        exponentFormat: '+'
      });

      expectParseSuccess(parseUnit('s-2'), {
        type: 'unit',
        atom: 's',
        exponent: -2,
        exponentFormat: '+'
      });
    });
  });

  describe('Binary operations', () => {
    it('parses multiplication', () => {
      expectParseSuccess(parseUnit('m.s'), {
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's' }
      });

      expectParseSuccess(parseUnit('kg.m'), {
        type: 'binary',
        operator: '.',
        left: { type: 'unit', prefix: 'k', atom: 'g' },
        right: { type: 'unit', atom: 'm' }
      });
    });

    it('parses division', () => {
      expectParseSuccess(parseUnit('m/s'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's' }
      });

      expectParseSuccess(parseUnit('mg/dL'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'g' },
        right: { type: 'unit', prefix: 'd', atom: 'L' }
      });
    });

    it('parses complex expressions with correct associativity', () => {
      expectParseSuccess(parseUnit('m.s-2'), {
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'm' },
        right: { type: 'unit', atom: 's', exponent: -2, exponentFormat: '+' }
      });

      expectParseSuccess(parseUnit('kg.m/s2'), {
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
      expectParseSuccess(parseUnit('/s'), {
        type: 'unary',
        operator: '/',
        operand: { type: 'unit', atom: 's' }
      });

      expectParseSuccess(parseUnit('/m2'), {
        type: 'unary',
        operator: '/',
        operand: { type: 'unit', atom: 'm', exponent: 2 }
      });
    });
  });

  describe('Parentheses', () => {
    it('parses grouped expressions', () => {
      expectParseSuccess(parseUnit('(m/s)'), {
        type: 'group',
        expression: {
          type: 'binary',
          operator: '/',
          left: { type: 'unit', atom: 'm' },
          right: { type: 'unit', atom: 's' }
        }
      });

      expectParseSuccess(parseUnit('m/(s.s)'), {
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
      expectParseSuccess(parseUnit('(m/s)/s'), {
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
      expectParseSuccess(parseUnit('mg{total}'), {
        type: 'unit',
        prefix: 'm',
        atom: 'g',
        annotation: 'total'
      });

      expectParseSuccess(parseUnit('mL{RBC}'), {
        type: 'unit',
        prefix: 'm',
        atom: 'L',
        annotation: 'RBC'
      });
    });

    it('parses standalone annotations', () => {
      expectParseSuccess(parseUnit('{RBC}'), {
        type: 'factor',
        value: 1,
        annotation: 'RBC'
      });

      expectParseSuccess(parseUnit('{cells}'), {
        type: 'factor',
        value: 1,
        annotation: 'cells'
      });
    });

    it('parses factor annotations', () => {
      expectParseSuccess(parseUnit('10{cells}'), {
        type: 'factor',
        value: 10,
        annotation: 'cells'
      });
    });

    it('parses annotations in complex expressions', () => {
      expectParseSuccess(parseUnit('mg{total}/dL'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'g', annotation: 'total' },
        right: { type: 'unit', prefix: 'd', atom: 'L' }
      });
    });
  });

  describe('Factors', () => {
    it('parses integer factors', () => {
      expectParseSuccess(parseUnit('10'), {
        type: 'factor',
        value: 10
      });

      expectParseSuccess(parseUnit('100'), {
        type: 'factor',
        value: 100
      });
    });

    it('parses factors with units', () => {
      expectParseSuccess(parseUnit('10.m'), {
        type: 'binary',
        operator: '.',
        left: { type: 'factor', value: 10 },
        right: { type: 'unit', atom: 'm' }
      });

      expectParseSuccess(parseUnit('10.mL'), {
        type: 'binary',
        operator: '.',
        left: { type: 'factor', value: 10 },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });
    });
  });

  describe('Special notation units', () => {
    it('parses 10* and 10^ units', () => {
      expectParseSuccess(parseUnit('10*'), {
        type: 'unit',
        atom: '10*'
      });

      expectParseSuccess(parseUnit('10^'), {
        type: 'unit',
        atom: '10^'
      });
    });

    it('parses special units in expressions', () => {
      expectParseSuccess(parseUnit('10*6/mL'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: '10*', exponent: 6 },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });

      expectParseSuccess(parseUnit('10^-9.m'), {
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: '10^', exponent: -9, exponentFormat: '+' },
        right: { type: 'unit', atom: 'm' }
      });
    });
  });

  describe('Complex real-world examples', () => {
    it('parses clinical units', () => {
      expectParseSuccess(parseUnit('mmol/L'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'm', atom: 'mol' },
        right: { type: 'unit', atom: 'L' }
      });

      expectParseSuccess(parseUnit('U/mL'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'U' },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });

      expectParseSuccess(parseUnit('ng/mL'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', prefix: 'n', atom: 'g' },
        right: { type: 'unit', prefix: 'm', atom: 'L' }
      });
    });

    it('parses physics units', () => {
      expectParseSuccess(parseUnit('N.m'), {
        type: 'binary',
        operator: '.',
        left: { type: 'unit', atom: 'N' },
        right: { type: 'unit', atom: 'm' }
      });

      expectParseSuccess(parseUnit('J/K'), {
        type: 'binary',
        operator: '/',
        left: { type: 'unit', atom: 'J' },
        right: { type: 'unit', atom: 'K' }
      });

      expectParseSuccess(parseUnit('W/(m2.K)'), {
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

describe('Error Handling', () => {
  it('reports syntax errors', () => {
    const result = parseUnit('kg..m');
    expectParseError(result);
    expect(result.errors[0]?.type).toBe('unexpected_token');
    expect(result.errors[0]?.position).toBe(3);
  });

  it('reports unexpected EOF', () => {
    const result = parseUnit('kg/');
    expectParseError(result);
    expect(result.errors[0]?.type).toBe('unexpected_eof');
  });

  it('reports missing closing parenthesis', () => {
    const result = parseUnit('(kg.m');
    expectParseError(result);
    expect(result.errors[0]?.message).toContain('closing parenthesis');
  });

  it('provides warnings for long annotations', () => {
    const longAnnotation = 'a'.repeat(60);
    const result = parseUnit(`kg{${longAnnotation}}`);
    console.log(result);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]?.type).toBe('ambiguous');
  });
});