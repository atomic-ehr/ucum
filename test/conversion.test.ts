import { describe, it, expect } from 'bun:test';
import { 
  convert, 
  ConversionError, 
  IncompatibleDimensionsError,
  isConvertible,
  getConversionFactor
} from '../src/conversion';

describe('Linear unit conversion', () => {
  it('should convert between metric prefixes', () => {
    expect(convert(1, 'kg', 'g')).toBe(1000);
    expect(convert(1000, 'mg', 'g')).toBe(1);
    expect(convert(1, 'km', 'm')).toBe(1000);
    expect(convert(5, 'cm', 'mm')).toBe(50);
    expect(convert(2.5, 'L', 'mL')).toBeCloseTo(2500);
    expect(convert(1, 'MJ', 'J')).toBe(1000000);
  });

  it('should convert complex expressions', () => {
    expect(convert(1, 'kg/s', 'g/s')).toBe(1000);
    expect(convert(36, 'km/h', 'm/s')).toBeCloseTo(10);
    expect(convert(1, 'J', 'erg')).toBe(1e7);
    expect(convert(1, 'N', 'dyn')).toBe(1e5);
    expect(convert(1, 'Pa', 'bar')).toBe(1e-5);
  });

  it('should handle dimensionless conversions', () => {
    expect(convert(50, '%', '[ppth]')).toBe(500);
    expect(convert(1, '[ppth]', '[ppm]')).toBeCloseTo(1000);
    expect(convert(100, '%', '10*-2')).toBe(100);
    expect(convert(0.5, '1', '%')).toBe(50);
  });

  it('should convert between different unit systems', () => {
    // Length
    expect(convert(1, '[ft_i]', 'm')).toBeCloseTo(0.3048);
    expect(convert(1, 'm', '[ft_i]')).toBeCloseTo(3.28084);
    expect(convert(1, '[mi_i]', 'km')).toBeCloseTo(1.60934);
    
    // Mass
    expect(convert(1, '[lb_av]', 'kg')).toBeCloseTo(0.453592);
    expect(convert(1, 'kg', '[lb_av]')).toBeCloseTo(2.20462);
    
    // Volume
    expect(convert(1, '[gal_us]', 'L')).toBeCloseTo(3.78541);
    expect(convert(1, 'L', '[gal_us]')).toBeCloseTo(0.264172);
  });

  it('should handle complex unit expressions with multiple operations', () => {
    // Density
    expect(convert(1, 'g/cm3', 'kg/m3')).toBeCloseTo(1000);
    expect(convert(1, 'kg/m3', 'g/L')).toBeCloseTo(1);
    
    // Pressure
    expect(convert(1, 'atm', 'Pa')).toBeCloseTo(101325);
    expect(convert(1, 'mbar', 'Pa')).toBe(100);
    
    // Energy density
    expect(convert(1, 'J/L', 'J/m3')).toBeCloseTo(1000);
  });

  it('should handle reciprocal units', () => {
    expect(convert(1, '1/s', 'Hz')).toBe(1);
    expect(convert(60, '1/min', '1/s')).toBe(1);
    expect(convert(1, '1/cm', '1/m')).toBe(100);
  });
});

describe('Conversion errors', () => {
  it('should throw for incompatible dimensions', () => {
    expect(() => convert(1, 'kg', 'm')).toThrow(IncompatibleDimensionsError);
    expect(() => convert(1, 'L', 's')).toThrow(/incompatible dimensions/);
    expect(() => convert(1, 'J', 'W')).toThrow(IncompatibleDimensionsError);
    expect(() => convert(1, 'Hz', 'kg')).toThrow(/incompatible dimensions/);
  });

  it('should throw for special units in phase 1', () => {
    expect(() => convert(25, 'Cel', '[degF]')).toThrow(/Special unit conversion/);
    expect(() => convert(7, '[pH]', 'mol/L')).toThrow(/Special unit conversion/);
    expect(() => convert(10, 'Np', '1')).toThrow(/Special unit conversion/);
    expect(() => convert(20, 'dB', '1')).toThrow(/Special unit conversion/);
    expect(() => convert(37, 'Cel', 'K')).toThrow(/Special unit conversion/);
  });

  it('should throw for unknown units', () => {
    expect(() => convert(1, 'invalid', 'kg')).toThrow(ConversionError);
    expect(() => convert(1, 'kg', 'invalid')).toThrow(ConversionError);
    expect(() => convert(1, 'xyz', 'abc')).toThrow(/Invalid source unit/);
  });

  it('should provide helpful error messages', () => {
    try {
      convert(1, 'kg', 'm');
    } catch (error: any) {
      expect(error.message).toContain('kg');
      expect(error.message).toContain('m');
      expect(error.message).toContain('incompatible dimensions');
      expect(error.message).toContain('M vs L');
    }
  });
});

describe('Edge cases', () => {
  it('should handle zero values', () => {
    expect(convert(0, 'kg', 'g')).toBe(0);
    expect(convert(0, 'm/s', 'km/h')).toBe(0);
    expect(convert(0, 'J', 'cal_th')).toBe(0);
  });

  it('should handle negative values', () => {
    expect(convert(-5, 'm', 'cm')).toBe(-500);
    expect(convert(-10, 'kg', 'g')).toBe(-10000);
    expect(convert(-273.15, 'K', 'K')).toBe(-273.15);
  });

  it('should handle very large and small values', () => {
    expect(convert(1e20, 'kg', 'g')).toBe(1e23);
    expect(convert(1e-20, 'g', 'kg')).toBe(1e-23);
    expect(convert(1e10, 'm', 'nm')).toBeCloseTo(1e19, -5);
    expect(convert(1e-15, 's', 'fs')).toBe(1);
  });

  it('should handle same unit conversion', () => {
    expect(convert(42, 'kg', 'kg')).toBe(42);
    expect(convert(3.14, 'm/s', 'm/s')).toBe(3.14);
    expect(convert(100, '%', '%')).toBe(100);
  });

  it('should handle unit expressions with parentheses', () => {
    expect(convert(1, 'kg.m/s2', 'N')).toBe(1);
    expect(convert(1, 'J/K', 'J/K')).toBe(1);
  });
});

describe('isConvertible helper', () => {
  it('should return true for compatible units', () => {
    expect(isConvertible('kg', 'g')).toBe(true);
    expect(isConvertible('m', 'km')).toBe(true);
    expect(isConvertible('J', 'cal_th')).toBe(true);
    expect(isConvertible('m/s', 'km/h')).toBe(true);
  });

  it('should return false for incompatible units', () => {
    expect(isConvertible('kg', 'm')).toBe(false);
    expect(isConvertible('J', 'W')).toBe(false);
    expect(isConvertible('Hz', 'kg')).toBe(false);
  });

  it('should return false for special units in phase 1', () => {
    expect(isConvertible('Cel', 'K')).toBe(false);
    expect(isConvertible('[pH]', 'mol/L')).toBe(false);
    expect(isConvertible('dB', '1')).toBe(false);
  });

  it('should return false for invalid units', () => {
    expect(isConvertible('invalid', 'kg')).toBe(false);
    expect(isConvertible('kg', 'invalid')).toBe(false);
  });
});

describe('getConversionFactor helper', () => {
  it('should return correct conversion factors', () => {
    expect(getConversionFactor('kg', 'g')).toBe(1000);
    expect(getConversionFactor('km', 'm')).toBe(1000);
    expect(getConversionFactor('h', 's')).toBe(3600);
    expect(getConversionFactor('L', 'mL')).toBeCloseTo(1000);
  });

  it('should throw for incompatible units', () => {
    expect(() => getConversionFactor('kg', 'm')).toThrow(IncompatibleDimensionsError);
  });

  it('should throw for special units', () => {
    expect(() => getConversionFactor('Cel', 'K')).toThrow(/special units/);
  });
});

describe('Real-world conversion scenarios', () => {
  it('should convert medical units', () => {
    // Blood glucose
    expect(convert(100, 'mg/dL', 'g/L')).toBeCloseTo(1);
    expect(convert(5.5, 'mmol/L', 'mmol/L')).toBe(5.5);
    
    // Drug dosing
    expect(convert(500, 'mg', 'g')).toBe(0.5);
    expect(convert(50, 'ug/kg', 'mg/kg')).toBeCloseTo(0.05);
  });

  it('should convert engineering units', () => {
    // Power
    expect(convert(1, 'kW', 'W')).toBe(1000);
    expect(convert(1, '[HP]', 'W')).toBeCloseTo(745.7);
    
    // Torque
    expect(convert(1, 'N.m', 'J')).toBe(1);
    
    // Flow rate
    expect(convert(1, 'L/min', 'm3/s')).toBeCloseTo(1.66667e-5, 10);
  });

  it('should convert physics units', () => {
    // Frequency
    expect(convert(1, 'GHz', 'Hz')).toBe(1e9);
    expect(convert(1, 'MHz', 'kHz')).toBe(1000);
    
    // Wavelength (via frequency)
    expect(convert(1, '1/m', '1/cm')).toBe(0.01);
    
    // Electric units
    expect(convert(1, 'mA', 'A')).toBe(0.001);
    expect(convert(1, 'kV', 'V')).toBe(1000);
  });
});