import { describe, it, expect } from 'bun:test';
import { convert } from '../src/conversion';
import { ConversionError } from '../src/conversion';

describe('Special Function Conversions', () => {
  describe('Temperature Conversions', () => {
    it('should convert Celsius to Kelvin', () => {
      expect(convert(0, 'Cel', 'K')).toBe(273.15);
      expect(convert(100, 'Cel', 'K')).toBe(373.15);
      expect(convert(-273.15, 'Cel', 'K')).toBe(0);
    });

    it('should convert Kelvin to Celsius', () => {
      expect(convert(273.15, 'K', 'Cel')).toBe(0);
      expect(convert(373.15, 'K', 'Cel')).toBe(100);
      expect(convert(0, 'K', 'Cel')).toBe(-273.15);
    });

    it('should convert Celsius to Fahrenheit', () => {
      expect(convert(0, 'Cel', '[degF]')).toBeCloseTo(32, 10);
      expect(convert(100, 'Cel', '[degF]')).toBeCloseTo(212, 10);
      expect(convert(-40, 'Cel', '[degF]')).toBeCloseTo(-40, 10); // Same at -40
    });

    it('should convert Fahrenheit to Celsius', () => {
      expect(convert(32, '[degF]', 'Cel')).toBeCloseTo(0, 10);
      expect(convert(212, '[degF]', 'Cel')).toBeCloseTo(100, 10);
      expect(convert(-40, '[degF]', 'Cel')).toBeCloseTo(-40, 10);
    });

    it('should convert Kelvin to Fahrenheit', () => {
      expect(convert(273.15, 'K', '[degF]')).toBeCloseTo(32, 5);
      expect(convert(373.15, 'K', '[degF]')).toBeCloseTo(212, 5);
    });

    it('should convert Fahrenheit to Kelvin', () => {
      expect(convert(32, '[degF]', 'K')).toBeCloseTo(273.15, 5);
      expect(convert(212, '[degF]', 'K')).toBeCloseTo(373.15, 5);
    });

    it('should convert Celsius to Réaumur', () => {
      expect(convert(0, 'Cel', '[degRe]')).toBe(0);
      expect(convert(100, 'Cel', '[degRe]')).toBe(80); // 100°C = 80°Ré
      expect(convert(25, 'Cel', '[degRe]')).toBe(20); // 25°C = 20°Ré
    });

    it('should handle domain validation for temperature', () => {
      // Negative Kelvin should throw
      expect(() => convert(-1, 'K', 'Cel')).toThrow(ConversionError);
      expect(() => convert(-300, 'Cel', 'K')).toThrow(ConversionError);
      expect(() => convert(-500, '[degF]', 'K')).toThrow(ConversionError);
    });
  });

  describe('Prefixed Special Units', () => {
    it.skip('should convert millidegree Celsius', () => {
      // TODO: Implement scale factor support for prefixed special units
      expect(convert(1000, 'mCel', 'Cel')).toBe(1); // 1000 mCel = 1 Cel
      expect(convert(1, 'Cel', 'mCel')).toBe(1000); // 1 Cel = 1000 mCel
      expect(convert(1000, 'mCel', 'K')).toBeCloseTo(274.15, 5); // 1000 mCel = 1°C = 274.15 K
      expect(convert(0, 'mCel', 'K')).toBe(273.15); // 0 mCel = 0°C = 273.15 K
    });

    it.skip('should convert decibel (dB = deci-bel)', () => {
      // TODO: Implement scale factor support for prefixed special units
      expect(convert(30, 'dB', 'B')).toBe(3); // 30 dB = 3 B
      expect(convert(3, 'B', 'dB')).toBe(30); // 3 B = 30 dB
    });
  });

  describe('Logarithmic Units', () => {
    describe('pH conversions', () => {
      it('should convert pH to mol/L', () => {
        expect(convert(7, '[pH]', 'mol/L')).toBeCloseTo(1e-7, 15);
        expect(convert(0, '[pH]', 'mol/L')).toBe(1); // pH 0 = 1 mol/L
        expect(convert(14, '[pH]', 'mol/L')).toBeCloseTo(1e-14, 15);
      });

      it('should convert mol/L to pH', () => {
        expect(convert(1e-7, 'mol/L', '[pH]')).toBeCloseTo(7, 5);
        expect(convert(1e-4, 'mol/L', '[pH]')).toBeCloseTo(4, 5);
        expect(convert(1, 'mol/L', '[pH]')).toBeCloseTo(0, 10);
      });

      it('should validate pH domain', () => {
        // Negative concentration should throw
        expect(() => convert(-1, 'mol/L', '[pH]')).toThrow(ConversionError);
        expect(() => convert(0, 'mol/L', '[pH]')).toThrow(ConversionError);
      });
    });

    describe('Neper conversions', () => {
      it('should convert Neper to dimensionless', () => {
        expect(convert(0, 'Np', '1')).toBe(1); // 0 Np = 1
        expect(convert(1, 'Np', '1')).toBeCloseTo(Math.E, 5);
        expect(convert(2, 'Np', '1')).toBeCloseTo(Math.E * Math.E, 5);
      });

      it('should convert dimensionless to Neper', () => {
        expect(convert(1, '1', 'Np')).toBe(0);
        expect(convert(Math.E, '1', 'Np')).toBeCloseTo(1, 5);
        expect(convert(10, '1', 'Np')).toBeCloseTo(Math.log(10), 5);
      });
    });

    describe('Bel conversions', () => {
      it('should convert Bel to dimensionless', () => {
        expect(convert(0, 'B', '1')).toBe(1); // 0 B = 1
        expect(convert(1, 'B', '1')).toBe(10); // 1 B = 10
        expect(convert(2, 'B', '1')).toBe(100); // 2 B = 100
        expect(convert(3, 'B', '1')).toBe(1000); // 3 B = 1000
      });

      it('should convert dimensionless to Bel', () => {
        expect(convert(1, '1', 'B')).toBe(0);
        expect(convert(10, '1', 'B')).toBe(1);
        expect(convert(100, '1', 'B')).toBe(2);
        expect(convert(1000, '1', 'B')).toBe(3);
      });

      it.skip('should convert between Bel and decibel', () => {
        // TODO: Implement scale factor support for prefixed special units
        expect(convert(1, 'B', 'dB')).toBe(10); // 1 B = 10 dB
        expect(convert(10, 'dB', 'B')).toBe(1); // 10 dB = 1 B
      });
    });

    describe('Bel with reference units', () => {
      it('should convert B[SPL] (sound pressure level)', () => {
        // B[SPL] uses lgTimes2 function with reference 10^-5 Pa
        // The value=2 is part of the function: lgTimes2(x) = 2*log10(x)
        // So 0 B[SPL] = 10^-5 Pa (not 2*10^-5 Pa)
        expect(convert(0, 'B[SPL]', 'Pa')).toBeCloseTo(1e-5, 10);
        // For lgTimes2: forward is 2*log10(x), inverse is 10^(x/2)
        // 1 B[SPL] = 10^(1/2) * 10^-5 Pa ≈ 3.162e-5 Pa
        expect(convert(1, 'B[SPL]', 'Pa')).toBeCloseTo(Math.sqrt(10) * 1e-5, 10);
      });

      it('should convert B[V] (voltage level)', () => {
        // B[V] uses lgTimes2 with reference 1 V
        expect(convert(0, 'B[V]', 'V')).toBe(1); // 0 B[V] = 1 V
        expect(convert(1, 'B[V]', 'V')).toBeCloseTo(Math.sqrt(10), 5); // 1 B[V] ≈ 3.162 V
      });

      it('should convert B[W] (power level)', () => {
        // B[W] uses lg with reference 1 W
        expect(convert(0, 'B[W]', 'W')).toBe(1); // 0 B[W] = 1 W
        expect(convert(1, 'B[W]', 'W')).toBe(10); // 1 B[W] = 10 W
      });
    });

    describe('bit conversions', () => {
      it('should convert bit to dimensionless', () => {
        expect(convert(0, 'bit_s', '1')).toBe(1); // 0 bit = 1
        expect(convert(1, 'bit_s', '1')).toBe(2); // 1 bit = 2
        expect(convert(8, 'bit_s', '1')).toBe(256); // 8 bits = 256
      });

      it('should convert dimensionless to bit', () => {
        expect(convert(1, '1', 'bit_s')).toBe(0);
        expect(convert(2, '1', 'bit_s')).toBe(1);
        expect(convert(256, '1', 'bit_s')).toBe(8);
      });
    });
  });

  describe('Trigonometric Units', () => {
    it('should convert prism diopter', () => {
      // [p'diop] uses tanTimes100 with radians
      // 0 rad → 0 PD
      expect(convert(0, 'rad', '[p\'diop]')).toBe(0);
      // π/4 rad (45°) → tan(π/4) * 100 = 100 PD
      expect(convert(Math.PI/4, 'rad', '[p\'diop]')).toBeCloseTo(100, 5);
    });

    it('should convert percent slope', () => {
      // %[slope] uses 100tan with degrees
      // 0° → 0%
      expect(convert(0, 'deg', '%[slope]')).toBe(0);
      // 45° → tan(45°) * 100 = 100%
      expect(convert(45, 'deg', '%[slope]')).toBeCloseTo(100, 5);
      // 30° → tan(30°) * 100 ≈ 57.735%
      expect(convert(30, 'deg', '%[slope]')).toBeCloseTo(100 * Math.tan(30 * Math.PI / 180), 5);
    });
  });

  describe('Homeopathic Units (retired)', () => {
    it('should convert homeopathic decimal potency', () => {
      // [hp'_X] uses hpX: -log10(x)
      expect(convert(1, '1', '[hp\'_X]')).toBeCloseTo(0, 10); // 1 → 0X
      expect(convert(0.1, '1', '[hp\'_X]')).toBe(1); // 10^-1 → 1X
      expect(convert(0.01, '1', '[hp\'_X]')).toBe(2); // 10^-2 → 2X
    });

    it('should convert homeopathic centesimal potency', () => {
      // [hp'_C] uses hpC: -ln(x)/ln(100)
      expect(convert(1, '1', '[hp\'_C]')).toBeCloseTo(0, 10); // 1 → 0C
      expect(convert(0.01, '1', '[hp\'_C]')).toBeCloseTo(1, 5); // 100^-1 → 1C
    });
  });

  describe('Mathematical Functions', () => {
    it('should convert square root units', () => {
      // [m/s2/Hz^(1/2)] uses sqrt
      expect(convert(4, 'm2/s4/Hz', '[m/s2/Hz^(1/2)]')).toBe(2);
      expect(convert(9, 'm2/s4/Hz', '[m/s2/Hz^(1/2)]')).toBe(3);
      expect(convert(2, '[m/s2/Hz^(1/2)]', 'm2/s4/Hz')).toBe(4);
    });
  });

  describe('Round-trip conversions', () => {
    it('should maintain precision for temperature round trips', () => {
      const celsiusValue = 25;
      const toFahrenheit = convert(celsiusValue, 'Cel', '[degF]');
      const backToCelsius = convert(toFahrenheit, '[degF]', 'Cel');
      expect(backToCelsius).toBeCloseTo(celsiusValue, 10);
    });

    it('should maintain precision for logarithmic round trips', () => {
      const phValue = 7.4;
      const toConcentration = convert(phValue, '[pH]', 'mol/L');
      const backToPH = convert(toConcentration, 'mol/L', '[pH]');
      expect(backToPH).toBeCloseTo(phValue, 10);
    });

    it('should maintain precision for prefixed special units', () => {
      const mCelValue = 1500; // 1.5°C
      const toCelsius = convert(mCelValue, 'mCel', 'Cel');
      const backToMCel = convert(toCelsius, 'Cel', 'mCel');
      expect(backToMCel).toBeCloseTo(mCelValue, 10);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle conversions between different special function types', () => {
      // Convert between Np and B (both logarithmic but different bases)
      const nepValue = 1;
      const toBel = convert(nepValue, 'Np', 'B');
      // 1 Np = ln(e) = 1, in Bel: log10(e) ≈ 0.4343
      expect(toBel).toBeCloseTo(Math.log10(Math.E), 5);
    });

    it('should throw for unknown special functions', () => {
      // This would require a malformed canonical form, but we test the error path
      // by trying to convert a non-existent special unit
      expect(() => convert(1, 'unknown_special', 'K')).toThrow();
    });

    it('should validate domains consistently', () => {
      // Test that domain validation works for all logarithmic functions
      expect(() => convert(-1, '1', 'B')).toThrow(ConversionError);
      expect(() => convert(-1, '1', 'Np')).toThrow(ConversionError);
      expect(() => convert(0, '1', 'bit_s')).toThrow(ConversionError);
    });
  });
});