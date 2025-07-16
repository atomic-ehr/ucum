# ADR-004: Unit Conversion Implementation

## Status
Proposed

## Context
We need to implement unit conversion functionality that can convert values between different UCUM units. This is a core feature of any unit library and must handle:
- Simple conversions (kg → g)
- Complex conversions (km/h → m/s)
- Special units with non-linear conversions (°C → °F)
- Validation that units are commensurable

## Decision Drivers
- Performance for common conversions
- Accuracy and precision
- Support for all UCUM unit types
- Clean API design
- Error handling and validation

## Considered Options

### Option 1: Direct Canonical Form Comparison

```typescript
function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Check commensurability
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}: incompatible dimensions`);
  }
  
  // Simple ratio for regular units
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}
```

**Pros:**
- Simple implementation
- Reuses existing canonical form calculation
- Automatically handles complex unit expressions

**Cons:**
- Doesn't handle special units
- Recalculates canonical forms each time (unless cached)

### Option 2: Specialized Converters Registry

```typescript
interface Converter {
  canConvert(from: string, to: string): boolean;
  convert(value: number, from: string, to: string): number;
}

class LinearConverter implements Converter { /* ... */ }
class TemperatureConverter implements Converter { /* ... */ }
class LogarithmicConverter implements Converter { /* ... */ }

const converters: Converter[] = [
  new TemperatureConverter(),
  new LogarithmicConverter(),
  new LinearConverter() // fallback
];

function convert(value: number, from: string, to: string): number {
  const converter = converters.find(c => c.canConvert(from, to));
  if (!converter) {
    throw new Error(`No converter found for ${from} to ${to}`);
  }
  return converter.convert(value, from, to);
}
```

**Pros:**
- Extensible for new conversion types
- Clean separation of concerns
- Can optimize specific conversions

**Cons:**
- More complex architecture
- Need to maintain converter registry
- Potential performance overhead checking each converter

### Option 3: Hybrid Approach with Special Case Detection

```typescript
function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Check commensurability
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}: incompatible dimensions`);
  }
  
  // Handle special units
  if (fromCanonical.specialFunction || toCanonical.specialFunction) {
    return convertSpecialUnits(value, fromUnit, toUnit, fromCanonical, toCanonical);
  }
  
  // Simple linear conversion
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}

function convertSpecialUnits(
  value: number, 
  fromUnit: string, 
  toUnit: string,
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  // Handle temperature conversions
  if (isTemperature(fromCanonical) && isTemperature(toCanonical)) {
    return convertTemperature(value, fromUnit, toUnit);
  }
  
  // Handle logarithmic conversions
  if (isLogarithmic(fromCanonical) || isLogarithmic(toCanonical)) {
    return convertLogarithmic(value, fromUnit, toUnit, fromCanonical, toCanonical);
  }
  
  // Generic special unit conversion
  return convertViaBaseUnit(value, fromUnit, toUnit, fromCanonical, toCanonical);
}
```

**Pros:**
- Handles both regular and special units
- Optimized paths for common cases
- Reuses canonical form infrastructure
- Clear flow and error handling

**Cons:**
- Special function handling adds complexity
- Need to implement each special function type

### Option 4: Conversion Path Builder

```typescript
interface ConversionStep {
  factor?: number;
  offset?: number;
  function?: (x: number) => number;
  inverse?: (x: number) => number;
}

class ConversionPath {
  private steps: ConversionStep[] = [];
  
  addLinearStep(factor: number, offset = 0) { /* ... */ }
  addFunctionStep(fn: Function, inverse: Function) { /* ... */ }
  
  apply(value: number): number {
    return this.steps.reduce((v, step) => {
      if (step.function) return step.function(v);
      return v * (step.factor ?? 1) + (step.offset ?? 0);
    }, value);
  }
}

function buildConversionPath(from: string, to: string): ConversionPath {
  // Build optimal path from source to target
  // May go through base units or direct if known
}
```

**Pros:**
- Very flexible
- Can optimize conversion paths
- Supports complex multi-step conversions

**Cons:**
- Most complex implementation
- May be overengineered for UCUM needs
- Path building logic could be tricky

## Decision

**Recommend Option 3: Hybrid Approach with Special Case Detection**

This provides the best balance of:
- Simplicity for common cases
- Flexibility for special units
- Reuse of existing infrastructure
- Clear code structure

## Implementation Plan

### Phase 1: Basic Linear Conversion
```typescript
// src/conversion.ts
export function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Validate commensurability
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new ConversionError(
      `Cannot convert from ${fromUnit} to ${toUnit}: incompatible dimensions`
    );
  }
  
  // Phase 1: Only linear conversions
  if (fromCanonical.specialFunction || toCanonical.specialFunction) {
    throw new ConversionError(
      `Special unit conversion not yet implemented`
    );
  }
  
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}
```

### Phase 2: Temperature Conversion
```typescript
function convertTemperature(value: number, from: string, to: string): number {
  // Normalize to Kelvin first
  const kelvin = toKelvin(value, from);
  // Then convert to target
  return fromKelvin(kelvin, to);
}
```

### Phase 3: Other Special Functions
- Logarithmic scales (pH, dB, etc.)
- Trigonometric conversions
- Arbitrary functions

## Consequences

### Positive
- Clean, understandable implementation
- Incremental development possible
- Reuses existing canonical form work
- Handles all UCUM conversion types

### Negative
- Special functions require individual implementation
- Some complexity in special unit detection
- May need optimization later for performance

## Notes

### Special Unit Conversion Algorithm
For special units, the general pattern is:
1. Apply inverse function to convert to base unit
2. Perform linear conversion if needed
3. Apply forward function to target special unit

Example: 25°C to °F
```
25°C → 298.15 K (inverse Celsius function)
298.15 K → 77°F (forward Fahrenheit function)
```

### Error Handling
- Throw `ConversionError` for incompatible dimensions
- Throw `UnitNotFoundError` for unknown units
- Throw `NotImplementedError` for unsupported special functions

### Testing Strategy
1. Test all base unit conversions
2. Test prefixed unit conversions
3. Test complex expression conversions
4. Test each special function type
5. Test error cases

## References
- UCUM specification sections 18-26
- concepts/conversion.md
- concepts/special-units.md
- concepts/canonical-form.md