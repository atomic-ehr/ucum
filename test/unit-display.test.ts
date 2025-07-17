import { describe, it, expect } from 'bun:test';
import { createUnitInfo, displayUnit } from '../src/unit-display';

describe('createUnitInfo', () => {
  describe('simple units', () => {
    it('should return info for base units', () => {
      const info = createUnitInfo('m');
      expect(info.type).toBe('base');
      expect(info.name).toBe('meter');
      expect(info.isBase).toBe(true);
      expect(info.dimension).toEqual({ L: 1 });
    });
    
    it('should return info for derived units', () => {
      const info = createUnitInfo('N');
      expect(info.type).toBe('derived');
      expect(info.name).toBe('newton');
      expect(info.definition).toBe('kg.m/s2');
      expect(info.dimension).toEqual({ M: 1, L: 1, T: -2 });
    });
    
    it('should return info for special units', () => {
      const info = createUnitInfo('Cel');
      expect(info.type).toBe('special');
      expect(info.name).toBe('degree Celsius');
      expect(info.isSpecial).toBe(true);
    });
    
    it('should return info for arbitrary units', () => {
      const info = createUnitInfo('[IU]');
      expect(info.type).toBe('arbitrary');
      expect(info.name).toBe('international unit');
      expect(info.isArbitrary).toBe(true);
    });
    
    it('should return info for dimensionless units', () => {
      const info = createUnitInfo('%');
      expect(info.type).toBe('dimensionless');
      expect(info.name).toBe('percent');
      expect(Object.keys(info.dimension).length).toBe(0);
    });
  });
  
  describe('prefixed units', () => {
    it('should handle common prefixed units', () => {
      expect(createUnitInfo('kg').name).toBe('kilogram');
      expect(createUnitInfo('mg').name).toBe('milligram');
      expect(createUnitInfo('mL').name).toBe('milliliter');
      expect(createUnitInfo('ug').name).toBe('microgram');
    });
    
    it('should generate names for prefixed units not in database', () => {
      const info = createUnitInfo('km');
      expect(info.name).toBe('kilometer');
      
      const info2 = createUnitInfo('ns');
      expect(info2.name).toBe('nanosecond');
    });
  });
  
  describe('complex expressions', () => {
    it('should generate names for multiplication', () => {
      const info = createUnitInfo('kg.m');
      expect(info.name).toBe('kilogram meter');
      
      const info2 = createUnitInfo('N.m');
      expect(info2.name).toBe('newton meter');
    });
    
    it('should generate names for division', () => {
      const info = createUnitInfo('m/s');
      expect(info.name).toBe('meter per second');
      
      const info2 = createUnitInfo('kg/m3');
      expect(info2.name).toBe('kilogram per cubic meter');
    });
    
    it('should handle complex expressions', () => {
      const info = createUnitInfo('kg.m/s2');
      expect(info.name).toBe('kilogram meter per square second');
      
      const info2 = createUnitInfo('mol/(L.s)');
      expect(info2.name).toBe('mole per liter second');
    });
    
    it('should handle exponents correctly', () => {
      expect(createUnitInfo('m2').name).toBe('square meter');
      expect(createUnitInfo('m3').name).toBe('cubic meter');
      expect(createUnitInfo('s-1').name).toBe('per second');
      expect(createUnitInfo('m-2').name).toBe('per meter to the power of 2');
    });
  });
  
  it('should throw for invalid units', () => {
    expect(() => createUnitInfo('invalid_unit')).toThrow('Unknown unit');
  });
});

describe('displayUnit', () => {
  describe('format: symbol (default)', () => {
    it('should return unit code by default', () => {
      expect(displayUnit('kg')).toBe('kg');
      expect(displayUnit('m/s')).toBe('m/s');
      expect(displayUnit('kg.m/s2')).toBe('kg.m/s2');
    });
    
    it('should strip annotations', () => {
      expect(displayUnit('kg{dry_mass}')).toBe('kg');
      expect(displayUnit('mL{total}/h')).toBe('mL/h');
    });
  });
  
  describe('format: name', () => {
    it('should return names for simple units', () => {
      expect(displayUnit('m', { format: 'name' })).toBe('meter');
      expect(displayUnit('kg', { format: 'name' })).toBe('kilogram');
      expect(displayUnit('N', { format: 'name' })).toBe('newton');
    });
    
    it('should handle prefixed units', () => {
      expect(displayUnit('mL', { format: 'name' })).toBe('milliliter');
      expect(displayUnit('ug', { format: 'name' })).toBe('microgram');
      expect(displayUnit('km', { format: 'name' })).toBe('kilometer');
    });
    
    it('should handle complex expressions', () => {
      expect(displayUnit('m/s', { format: 'name' })).toBe('meter per second');
      expect(displayUnit('kg/m2', { format: 'name' })).toBe('kilogram per square meter');
      expect(displayUnit('kg.m/s2', { format: 'name' })).toBe('kilogram meter per square second');
    });
    
    it('should handle squared and cubed units', () => {
      expect(displayUnit('m2', { format: 'name' })).toBe('square meter');
      expect(displayUnit('m3', { format: 'name' })).toBe('cubic meter');
      expect(displayUnit('cm2', { format: 'name' })).toBe('square centimeter');
    });
    
    it('should strip annotations before processing', () => {
      expect(displayUnit('kg{dry_mass}/s', { format: 'name' })).toBe('kilogram per second');
      expect(displayUnit('mL{total}/min', { format: 'name' })).toBe('milliliter per minute');
    });
  });
  
  describe('format: long', () => {
    it('should include definition for derived units', () => {
      expect(displayUnit('N', { format: 'long' })).toBe('newton (kg.m/s2)');
      expect(displayUnit('J', { format: 'long' })).toBe('joule (N.m)');
      expect(displayUnit('W', { format: 'long' })).toBe('watt (J/s)');
    });
    
    it('should not include definition for base units', () => {
      expect(displayUnit('m', { format: 'long' })).toBe('meter');
      expect(displayUnit('kg', { format: 'long' })).toBe('kilogram');
    });
    
    it('should handle complex expressions without definition', () => {
      expect(displayUnit('m/s', { format: 'long' })).toBe('meter per second');
      expect(displayUnit('kg.m2/s3', { format: 'long' })).toBe('kilogram square meter per cubic second');
    });
  });
  
  describe('edge cases', () => {
    it('should handle units not in database', () => {
      expect(displayUnit('unknown', { format: 'name' })).toBe('unknown');
    });
    
    it('should handle complex parentheses', () => {
      expect(displayUnit('mol/(L.s)', { format: 'name' })).toBe('mole per liter second');
      expect(displayUnit('kg/(m.s2)', { format: 'name' })).toBe('kilogram per meter square second');
    });
    
    it('should handle negative exponents', () => {
      expect(displayUnit('s-1', { format: 'name' })).toBe('per second');
      expect(displayUnit('m-2', { format: 'name' })).toBe('per meter to the power of 2');
      expect(displayUnit('Hz-1', { format: 'name' })).toBe('per hertz');
    });
  });
});

describe('spec compliance', () => {
  it('should match specification examples', () => {
    // From library spec
    expect(displayUnit('kg{dry_mass}/s', { format: 'name' })).toBe('kilogram per second');
    expect(displayUnit('m2', { format: 'name' })).toBe('square meter');
    
    // Additional examples
    expect(displayUnit('mol/(L.s)', { format: 'name' })).toBe('mole per liter second');
    expect(displayUnit('mg/dL', { format: 'name' })).toBe('milligram per deciliter');
  });
  
  it('should handle clinical units', () => {
    expect(displayUnit('[IU]/L', { format: 'name' })).toBe('international unit per liter');
    expect(displayUnit('mmol/L', { format: 'name' })).toBe('millimole per liter');
    expect(displayUnit('mg/dL', { format: 'name' })).toBe('milligram per deciliter');
  });
  
  it('should handle engineering units', () => {
    expect(displayUnit('kW.h', { format: 'name' })).toBe('kilowatt hour');
    expect(displayUnit('N.m', { format: 'name' })).toBe('newton meter');
    expect(displayUnit('Pa.s', { format: 'name' })).toBe('pascal second');
  });
});