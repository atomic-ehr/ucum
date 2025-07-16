# Task 006: Implement Unit Conversion

## Status: COMPLETED

## Objective
Implement unit conversion functionality using the Hybrid Approach as defined in ADR-004.

## Background
Unit conversion is a core feature that allows converting values between commensurable units. We'll implement this using the Hybrid Approach (Option 3) from ADR-004, which provides a good balance between simplicity and capability.

## Requirements

### Core Conversion Function
Create `src/conversion.ts` with the main conversion function:

```typescript
export function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Check commensurability
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new ConversionError(
      `Cannot convert from ${fromUnit} to ${toUnit}: incompatible dimensions`
    );
  }
  
  // Handle special units (Phase 1: throw error)
  if (fromCanonical.specialFunction || toCanonical.specialFunction) {
    throw new ConversionError(
      `Special unit conversion not yet implemented`
    );
  }
  
  // Linear conversion
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}
```

### Error Types
Define custom error types for better error handling:

```typescript
export class ConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversionError';
  }
}

export class IncompatibleDimensionsError extends ConversionError {
  constructor(fromUnit: string, toUnit: string, fromDim: DimensionObject, toDim: DimensionObject) {
    super(`Cannot convert from ${fromUnit} to ${toUnit}: incompatible dimensions`);
    this.name = 'IncompatibleDimensionsError';
  }
}
```

### Helper Functions
Add helper functions for special unit detection:

```typescript
function isSpecialUnit(canonical: CanonicalForm): boolean {
  return canonical.specialFunction !== undefined;
}

function hasSpecialUnits(from: CanonicalForm, to: CanonicalForm): boolean {
  return isSpecialUnit(from) || isSpecialUnit(to);
}
```

## Implementation Phases

### Phase 1: Linear Conversions Only (This Task)
- Implement basic conversion for regular units
- Throw clear error for special units
- Comprehensive tests for linear conversions

### Phase 2: Temperature Conversions (Future Task)
- Add temperature conversion support
- Handle Celsius, Fahrenheit, Réaumur, etc.

### Phase 3: Other Special Functions (Future Task)
- Logarithmic scales (pH, dB, Np)
- Trigonometric functions
- Other UCUM special functions

## Test Cases

### Basic Conversions
```typescript
describe('Linear unit conversion', () => {
  it('should convert between metric prefixes', () => {
    expect(convert(1, 'kg', 'g')).toBe(1000);
    expect(convert(1000, 'mg', 'g')).toBe(1);
    expect(convert(1, 'km', 'm')).toBe(1000);
  });

  it('should convert complex expressions', () => {
    expect(convert(1, 'kg/s', 'g/s')).toBe(1000);
    expect(convert(36, 'km/h', 'm/s')).toBeCloseTo(10);
    expect(convert(1, 'J', 'erg')).toBe(1e7);
  });

  it('should handle dimensionless conversions', () => {
    expect(convert(50, '%', '[ppth]')).toBe(500);
    expect(convert(1, '[ppth]', '[ppm]')).toBe(1000);
  });
});
```

### Error Cases
```typescript
describe('Conversion errors', () => {
  it('should throw for incompatible dimensions', () => {
    expect(() => convert(1, 'kg', 'm')).toThrow(IncompatibleDimensionsError);
    expect(() => convert(1, 'L', 's')).toThrow(/incompatible dimensions/);
  });

  it('should throw for special units in phase 1', () => {
    expect(() => convert(25, 'Cel', '[degF]')).toThrow(/Special unit conversion/);
    expect(() => convert(7, '[pH]', 'mol/l')).toThrow(/Special unit conversion/);
  });

  it('should throw for unknown units', () => {
    expect(() => convert(1, 'invalid', 'kg')).toThrow();
    expect(() => convert(1, 'kg', 'invalid')).toThrow();
  });
});
```

### Edge Cases
```typescript
describe('Edge cases', () => {
  it('should handle zero values', () => {
    expect(convert(0, 'kg', 'g')).toBe(0);
  });

  it('should handle negative values', () => {
    expect(convert(-5, 'm', 'cm')).toBe(-500);
  });

  it('should handle very large and small values', () => {
    expect(convert(1e20, 'kg', 'g')).toBe(1e23);
    expect(convert(1e-20, 'g', 'kg')).toBe(1e-23);
  });

  it('should handle same unit conversion', () => {
    expect(convert(42, 'kg', 'kg')).toBe(42);
  });
});
```

## Examples of Supported Conversions (Phase 1)

### Mass
- `kg` ↔ `g`, `mg`, `ug`, `ng`
- `[lb_av]` ↔ `kg`, `[oz_av]`

### Length
- `m` ↔ `km`, `cm`, `mm`, `um`, `nm`
- `[ft_i]` ↔ `m`, `[in_i]`, `[yd_i]`

### Time
- `s` ↔ `ms`, `us`, `ns`
- `min` ↔ `s`, `h`, `d`

### Volume
- `L` ↔ `mL`, `uL`, `dL`
- `m3` ↔ `L`, `cm3`

### Energy
- `J` ↔ `kJ`, `cal`, `kcal`, `eV`
- `[Btu_IT]` ↔ `J`

### Complex Units
- `kg/m3` ↔ `g/L` (density)
- `m/s` ↔ `km/h` (velocity)
- `Pa` ↔ `bar`, `atm` (pressure)

## Implementation Steps

1. [ ] Create `src/conversion.ts` file
2. [ ] Define error types (`ConversionError`, `IncompatibleDimensionsError`)
3. [ ] Implement main `convert` function
4. [ ] Add helper functions for special unit detection
5. [ ] Create `test/conversion.test.ts`
6. [ ] Implement tests for:
   - [ ] Basic linear conversions
   - [ ] Complex unit expressions
   - [ ] Error cases
   - [ ] Edge cases
7. [ ] Update main exports in `src/index.ts`
8. [ ] Run TypeScript checks
9. [ ] Ensure all tests pass
10. [ ] Document API in concepts/conversion.md

## Success Criteria

- All linear unit conversions work correctly
- Clear error messages for unsupported conversions
- Comprehensive test coverage (>95%)
- TypeScript types are properly defined
- Performance is acceptable (<1ms for common conversions)
- API is clean and intuitive

## References

- [ADR-004: Unit Conversion Implementation](../../adr/004-unit-conversion-implementation.md)
- [ADR-004: Detailed Analysis](../../adr/004-unit-conversion-implementation-detailed.md)
- [concepts/conversion.md](../../concepts/conversion.md)
- [concepts/canonical-form.md](../../concepts/canonical-form.md)
- [concepts/dimension.md](../../concepts/dimension.md)

## What Was Done

Successfully implemented Phase 1 of unit conversion with the following:

1. **Created src/conversion.ts** with:
   - Main `convert()` function for linear unit conversions
   - Custom error types: `ConversionError` and `IncompatibleDimensionsError`
   - Helper functions: `isConvertible()` and `getConversionFactor()`
   - Proper dimension checking and commensurability validation

2. **Fixed parser issue**:
   - Updated lexer to handle underscores in unit names (e.g., `cal_th`, `kg_av`)
   - This was necessary for UCUM units that contain underscores

3. **Created comprehensive test suite** in test/conversion.test.ts:
   - 25 test cases covering various conversion scenarios
   - Tests for metric prefixes, complex expressions, dimensionless units
   - Error handling tests for incompatible dimensions and special units
   - Edge cases including zero, negative, and very large/small values
   - Real-world scenarios for medical, engineering, and physics units

4. **Updated exports** in src/index.ts to expose conversion functionality

All tests pass (101 total tests across all modules) and TypeScript checks succeed.

## Next Steps

Future phases can implement:
- Phase 2: Temperature conversions (Celsius, Fahrenheit, etc.)
- Phase 3: Other special functions (logarithmic scales, trigonometric functions)