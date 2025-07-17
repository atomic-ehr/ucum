import { describe, it, expect } from 'bun:test';
import { ucum } from '../src/index';
import type { UnitInfo } from '../src/index';

describe('UCUM Unified API', () => {
  describe('ucum object structure', () => {
    it('should export ucum object with all methods', () => {
      expect(ucum).toBeDefined();
      expect(typeof ucum.validate).toBe('function');
      expect(typeof ucum.convert).toBe('function');
      expect(typeof ucum.isConvertible).toBe('function');
      expect(typeof ucum.quantity).toBe('function');
      expect(typeof ucum.add).toBe('function');
      expect(typeof ucum.subtract).toBe('function');
      expect(typeof ucum.multiply).toBe('function');
      expect(typeof ucum.divide).toBe('function');
      expect(typeof ucum.pow).toBe('function');
      expect(typeof ucum.info).toBe('function');
      expect(typeof ucum.display).toBe('function');
      expect(typeof ucum.isSpecialUnit).toBe('function');
      expect(typeof ucum.isArbitraryUnit).toBe('function');
    });
  });

  describe('info() function', () => {
    it('should return info for base unit', () => {
      const info = ucum.info('m');
      expect(info.type).toBe('base');
      expect(info.code).toBe('m');
      expect(info.name).toBe('meter');
      expect(info.printSymbol).toBe('m');
      expect(info.isBase).toBe(true);
      expect(info.isMetric).toBe(true);
      expect(info.property).toBe('length');
      expect(info.dimension).toEqual({ L: 1 });
    });

    it('should return info for derived unit', () => {
      const info = ucum.info('N');
      expect(info.type).toBe('derived');
      expect(info.code).toBe('N');
      expect(info.name).toBe('newton');
      expect(info.isBase).toBe(false);
      expect(info.dimension).toEqual({ M: 1, L: 1, T: -2 });
    });

    it('should return info for special unit', () => {
      const info = ucum.info('Cel');
      expect(info.type).toBe('special');
      expect(info.code).toBe('Cel');
      expect(info.name).toBe('degree Celsius');
      expect(info.isSpecial).toBe(true);
    });

    it('should return info for arbitrary unit', () => {
      const info = ucum.info('[IU]');
      expect(info.type).toBe('arbitrary');
      expect(info.code).toBe('[IU]');
      expect(info.isArbitrary).toBe(true);
    });

    it('should return info for dimensionless unit', () => {
      const info = ucum.info('%');
      expect(info.type).toBe('dimensionless');
      expect(info.code).toBe('%');
      expect(Object.keys(info.dimension).length).toBe(0);
    });

    it('should handle complex unit expressions', () => {
      const info = ucum.info('kg/m2');
      expect(info.type).toBe('derived');
      expect(info.code).toBe('kg/m2');
      expect(info.dimension).toEqual({ M: 1, L: -2 });
    });

    it('should throw error for invalid unit', () => {
      expect(() => ucum.info('invalid_unit')).toThrow();
    });
  });

  describe('display() function', () => {
    it('should strip annotations', () => {
      expect(ucum.display('kg{dry_mass}')).toBe('kg');
      expect(ucum.display('mL{total_volume}/min')).toBe('mL/min');
    });

    it('should return unit names when format is name', () => {
      expect(ucum.display('kg', { format: 'name' })).toBe('kilogram');
      expect(ucum.display('m', { format: 'name' })).toBe('meter');
      expect(ucum.display('Cel', { format: 'name' })).toBe('degree Celsius');
    });

    it('should handle compound units', () => {
      expect(ucum.display('kg/s', { format: 'name' })).toBe('kilogram per second');
      expect(ucum.display('N/m', { format: 'name' })).toBe('newton per meter');
    });

    it('should handle squared and cubed units', () => {
      expect(ucum.display('m2', { format: 'name' })).toBe('square meter');
      expect(ucum.display('m3', { format: 'name' })).toBe('cubic meter');
    });

    it('should return original unit for unknown units', () => {
      expect(ucum.display('xyz')).toBe('xyz');
      expect(ucum.display('xyz', { format: 'name' })).toBe('xyz');
    });
  });

  describe('validation', () => {
    it('should validate units through ucum object', () => {
      const result = ucum.validate('kg/s');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('conversion', () => {
    it('should convert units through ucum object', () => {
      expect(ucum.convert(1, 'kg', 'g')).toBe(1000);
      expect(ucum.isConvertible('kg', 'g')).toBe(true);
      expect(ucum.isConvertible('kg', 'm')).toBe(false);
    });
  });

  describe('quantities', () => {
    it('should create and manipulate quantities through ucum object', () => {
      const q1 = ucum.quantity(10, 'kg');
      const q2 = ucum.quantity(5, 'kg');
      
      expect(q1.value).toBe(10);
      expect(q1.unit).toBe('kg');
      
      const sum = ucum.add(q1, q2);
      expect(sum.value).toBe(15);
      expect(sum.unit).toBe('kg');
      
      const diff = ucum.subtract(q1, q2);
      expect(diff.value).toBe(5);
      
      const prod = ucum.multiply(q1, 2);
      expect(prod.value).toBe(20);
      
      const quot = ucum.divide(q1, 2);
      expect(quot.value).toBe(5);
      
      const squared = ucum.pow(q1, 2);
      expect(squared.value).toBe(100);
      expect(squared.unit).toBe('kg2');
    });
  });

  describe('helper functions', () => {
    it('should check special units', () => {
      expect(ucum.isSpecialUnit('Cel')).toBe(true);
      expect(ucum.isSpecialUnit('kg')).toBe(false);
    });

    it('should check arbitrary units', () => {
      expect(ucum.isArbitraryUnit('[IU]')).toBe(true);
      expect(ucum.isArbitraryUnit('kg')).toBe(false);
    });
  });
});