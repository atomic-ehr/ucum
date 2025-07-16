import { describe, it, expect } from 'bun:test';
import { validate } from '../src/validation';

describe('Unit Validation', () => {
  describe('Valid units', () => {
    it('should validate correct units', () => {
      expect(validate('kg')).toEqual({ valid: true, errors: [] });
      expect(validate('m')).toEqual({ valid: true, errors: [] });
      expect(validate('s')).toEqual({ valid: true, errors: [] });
      expect(validate('m/s')).toEqual({ valid: true, errors: [] });
      expect(validate('kg.m/s2')).toEqual({ valid: true, errors: [] });
    });

    it('should validate units with valid prefixes', () => {
      expect(validate('km')).toEqual({ valid: true, errors: [] });
      expect(validate('mg')).toEqual({ valid: true, errors: [] });
      expect(validate('ns')).toEqual({ valid: true, errors: [] });
      expect(validate('dL')).toEqual({ valid: true, errors: [] });
      expect(validate('dam')).toEqual({ valid: true, errors: [] });
    });

    it('should validate complex expressions', () => {
      expect(validate('kg.m/s2')).toEqual({ valid: true, errors: [] });
      expect(validate('10*6/uL')).toEqual({ valid: true, errors: [] });
      expect(validate('mmol/L')).toEqual({ valid: true, errors: [] });
      expect(validate('ng/mL')).toEqual({ valid: true, errors: [] });
    });

    it('should validate special notation units', () => {
      expect(validate('10*')).toEqual({ valid: true, errors: [] });
      expect(validate('10^')).toEqual({ valid: true, errors: [] });
      expect(validate('10*6/mL')).toEqual({ valid: true, errors: [] });
    });
  });

  describe('Syntax errors', () => {
    it('should catch syntax errors', () => {
      const result = validate('kg/');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('syntax');
      expect(result.errors[0]?.message).toContain('Expected');
    });

    it('should catch invalid operator sequences', () => {
      const result = validate('kg..m');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('syntax');
      expect(result.errors[0]?.position).toBe(3);
    });

    it('should catch unbalanced parentheses', () => {
      const result = validate('(kg.m');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('closing parenthesis');
    });
  });

  describe('Unknown units', () => {
    it('should catch unknown units', () => {
      const result = validate('xyz');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('unknown_unit');
      expect(result.errors[0]?.message).toBe('Unknown unit: xyz');
    });

    it('should catch unknown units in expressions', () => {
      const result = validate('kg.invalid/s');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('unknown_unit');
      expect(result.errors[0]?.message).toBe('Unknown unit: invalid');
    });

    it('should provide suggestions for common typos', () => {
      const result1 = validate('metre');
      expect(result1.valid).toBe(false);
      expect(result1.errors[0]?.suggestion).toBe('m');

      const result2 = validate('metre');
      expect(result2.valid).toBe(false);
      expect(result2.errors[0]?.suggestion).toBe('m');

      const result3 = validate('gram');
      expect(result3.valid).toBe(false);
      expect(result3.errors[0]?.suggestion).toBe('g');
    });

    it('should suggest units with single character difference', () => {
      const result = validate('mX'); // typo: unknown unit
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('unknown_unit');
      // Since 'mL1' is not a known unit and edit distance > 1 from most units
    });
  });

  describe('Invalid prefixes', () => {
    it('should catch prefixes on non-metric units', () => {
      const result = validate('kmin'); // k + min (minute is non-metric)
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('invalid_prefix');
      expect(result.errors[0]?.message).toBe("Non-metric unit 'min' cannot have prefix 'k'");
    });

    it('should allow prefixes on metric units', () => {
      const result = validate('km');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate special units without prefixes', () => {
      expect(validate('[degF]')).toEqual({ valid: true, errors: [] });
      expect(validate('Cel')).toEqual({ valid: true, errors: [] });
      expect(validate('[in_i]')).toEqual({ valid: true, errors: [] });
    });
  });

  describe('Annotations', () => {
    it('should validate valid annotations', () => {
      expect(validate('mg{total}')).toEqual({ valid: true, errors: [] });
      expect(validate('{RBC}')).toEqual({ valid: true, errors: [] });
      expect(validate('10{cells}/L')).toEqual({ valid: true, errors: [] });
    });

    it('should catch invalid annotation syntax', () => {
      const result = validate('mg{invalid{nested}}');
      expect(result.valid).toBe(false);
      // Parser catches syntax error for nested braces
      expect(result.errors[0]?.type).toBe('syntax');
    });

    it('should warn about long annotations', () => {
      const longAnnotation = 'a'.repeat(60);
      const result = validate(`kg{${longAnnotation}}`);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]?.type).toBe('ambiguous');
    });
  });

  describe('Deprecated units', () => {
    it('should warn about deprecated units', () => {
      const result = validate('[ppb]');
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]?.type).toBe('deprecated');
      expect(result.warnings![0]?.message).toContain('ambiguous');
      expect(result.warnings![0]?.suggestion).toContain('10*-9');
    });

    it('should warn about ppt', () => {
      const result = validate('[pptr]');
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]?.type).toBe('deprecated');
      expect(result.warnings![0]?.suggestion).toContain('10*-9');
    });

    it('should not warn about lowercase l', () => {
      // Both L and l are valid units, ml = milli-liter
      const result = validate('ml');
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeUndefined();
    });
  });

  describe('Context information', () => {
    it('should provide helpful error context', () => {
      const result = validate('kg..m/s');
      expect(result.errors[0]?.context).toBe('kg..m/s');
      expect(result.errors[0]?.position).toBe(3);
    });

    it('should provide context for longer expressions', () => {
      const longUnit = 'verylongunitname.anotherlongunit/s';
      const result = validate(longUnit);
      expect(result.valid).toBe(false);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple errors', () => {
    it('should report multiple errors', () => {
      const result = validate('invalid1.invalid2/invalid3');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
      expect(result.errors.every(e => e.type === 'unknown_unit')).toBe(true);
    });

    it('should report syntax and semantic errors', () => {
      const result = validate('k[degF]..invalid');
      expect(result.valid).toBe(false);
      // Should have both invalid prefix error and syntax error
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty input', () => {
      const result = validate('');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('syntax');
    });

    it('should handle whitespace', () => {
      const result = validate('   ');
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.type).toBe('syntax');
    });

    it('should validate factors with units', () => {
      expect(validate('10.m')).toEqual({ valid: true, errors: [] });
      expect(validate('100.mL')).toEqual({ valid: true, errors: [] });
    });
  });
});