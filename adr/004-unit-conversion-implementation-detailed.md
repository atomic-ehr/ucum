# ADR-004: Unit Conversion Implementation (Detailed Analysis)

## Detailed Implementation Options

### Option 1: Direct Canonical Form Comparison (Simplest)

#### How it works:
```typescript
function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Check dimensions match
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new Error(`Incompatible dimensions`);
  }
  
  // Simple multiplication by ratio of magnitudes
  return value * (fromCanonical.magnitude / toCanonical.magnitude);
}
```

#### Example conversions:
```typescript
// Simple unit conversion
convert(5, 'km', 'm')
// fromCanonical: {magnitude: 1000, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}
// toCanonical: {magnitude: 1, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}
// Result: 5 * (1000 / 1) = 5000

// Complex expression
convert(100, 'km/h', 'm/s')
// fromCanonical: {magnitude: 0.277778, dimension: {L: 1, T: -1}, ...}
// toCanonical: {magnitude: 1, dimension: {L: 1, T: -1}, ...}
// Result: 100 * (0.277778 / 1) = 27.7778
```

#### Limitations:
- **Cannot handle °C to °F** (needs offset: °F = °C × 9/5 + 32)
- **Cannot handle pH** (logarithmic scale)
- **Cannot handle dB** (logarithmic ratios)

### Option 2: Specialized Converters Registry (Most Flexible)

#### Architecture:
```typescript
interface Converter {
  canConvert(from: string, to: string): boolean;
  convert(value: number, from: string, to: string): number;
}

// Each converter handles specific unit types
class TemperatureConverter implements Converter {
  private tempUnits = ['Cel', '[degF]', '[degRe]'];
  
  canConvert(from: string, to: string): boolean {
    return this.tempUnits.includes(from) && this.tempUnits.includes(to);
  }
  
  convert(value: number, from: string, to: string): number {
    // First convert to Kelvin
    let kelvin = this.toKelvin(value, from);
    // Then convert to target
    return this.fromKelvin(kelvin, to);
  }
  
  private toKelvin(value: number, unit: string): number {
    switch(unit) {
      case 'Cel': return value + 273.15;
      case '[degF]': return (value + 459.67) * 5/9;
      case '[degRe]': return value * 5/4 + 273.15;
      default: return value;
    }
  }
  
  private fromKelvin(kelvin: number, unit: string): number {
    switch(unit) {
      case 'Cel': return kelvin - 273.15;
      case '[degF]': return kelvin * 9/5 - 459.67;
      case '[degRe]': return (kelvin - 273.15) * 4/5;
      default: return kelvin;
    }
  }
}

class LogarithmicConverter implements Converter {
  canConvert(from: string, to: string): boolean {
    const logUnits = ['[pH]', 'B', 'Np', 'B[SPL]', 'B[V]'];
    return logUnits.includes(from) || logUnits.includes(to);
  }
  
  convert(value: number, from: string, to: string): number {
    // Convert through linear scale
    const linear = this.toLinear(value, from);
    return this.fromLinear(linear, to);
  }
}

class LinearConverter implements Converter {
  canConvert(from: string, to: string): boolean {
    // Fallback - tries any conversion
    return true;
  }
  
  convert(value: number, from: string, to: string): number {
    // Use canonical form approach
    // ... 
  }
}

// Main conversion function
const converters = [
  new TemperatureConverter(),
  new LogarithmicConverter(),
  new LinearConverter()
];

function convert(value: number, from: string, to: string): number {
  for (const converter of converters) {
    if (converter.canConvert(from, to)) {
      return converter.convert(value, from, to);
    }
  }
  throw new Error('No converter found');
}
```

#### Benefits:
- Each converter can be tested independently
- Easy to add new conversion types
- Can optimize specific conversions (e.g., direct °C to °F without going through K)

### Option 3: Hybrid Approach (Recommended - Balance of simplicity and capability)

#### Core implementation:
```typescript
function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Step 1: Validate commensurability
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}: incompatible dimensions`);
  }
  
  // Step 2: Route to appropriate converter
  if (fromCanonical.specialFunction || toCanonical.specialFunction) {
    return convertSpecialUnits(value, fromUnit, toUnit, fromCanonical, toCanonical);
  }
  
  // Step 3: Simple linear conversion for regular units
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}
```

#### Special unit handling:
```typescript
function convertSpecialUnits(
  value: number, 
  fromUnit: string, 
  toUnit: string,
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  // Both are special units
  if (fromCanonical.specialFunction && toCanonical.specialFunction) {
    // Check if same function type (e.g., both temperature)
    if (isSameFunctionType(fromCanonical.specialFunction, toCanonical.specialFunction)) {
      return directSpecialConvert(value, fromUnit, toUnit);
    }
    // Different special functions - go through base unit
    const baseValue = applyInverseFunction(value, fromCanonical.specialFunction);
    return applyFunction(baseValue, toCanonical.specialFunction);
  }
  
  // From special to regular
  if (fromCanonical.specialFunction) {
    const baseValue = applyInverseFunction(value, fromCanonical.specialFunction);
    const factor = fromCanonical.magnitude / toCanonical.magnitude;
    return baseValue * factor;
  }
  
  // From regular to special
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  const baseValue = value * factor;
  return applyFunction(baseValue, toCanonical.specialFunction!);
}
```

#### Function implementations:
```typescript
function applyInverseFunction(value: number, fn: SpecialFunction): number {
  switch (fn.name) {
    // Temperature functions
    case 'Cel': return value + 273.15; // °C to K
    case 'degF': return (value + 459.67) * 5/9; // °F to K
    case 'degRe': return value * 5/4 + 273.15; // °Ré to K
    
    // Logarithmic functions
    case 'pH': return Math.pow(10, -value); // pH to mol/L
    case 'ln': return Math.exp(value); // Np to ratio
    case 'lg': return Math.pow(10, value); // B to ratio
    case 'ld': return Math.pow(2, value); // bit to ratio
    
    // Trigonometric
    case '100tan': return Math.atan(value / 100); // % slope to radians
    
    default: 
      throw new Error(`Unknown special function: ${fn.name}`);
  }
}

function applyFunction(value: number, fn: SpecialFunction): number {
  switch (fn.name) {
    // Temperature functions
    case 'Cel': return value - 273.15; // K to °C
    case 'degF': return value * 9/5 - 459.67; // K to °F
    case 'degRe': return (value - 273.15) * 4/5; // K to °Ré
    
    // Logarithmic functions
    case 'pH': return -Math.log10(value); // mol/L to pH
    case 'ln': return Math.log(value); // ratio to Np
    case 'lg': return Math.log10(value); // ratio to B
    case 'ld': return Math.log2(value); // ratio to bit
    
    // Trigonometric
    case '100tan': return Math.tan(value) * 100; // radians to % slope
    
    default:
      throw new Error(`Unknown special function: ${fn.name}`);
  }
}
```

### Option 4: Conversion Path Builder (Most Complex)

#### Concept:
Build a graph of conversion paths and find optimal route.

```typescript
class ConversionGraph {
  private nodes: Map<string, ConversionNode> = new Map();
  private edges: ConversionEdge[] = [];
  
  addDirectConversion(from: string, to: string, convert: (v: number) => number) {
    this.edges.push({from, to, convert, cost: 1});
  }
  
  findPath(from: string, to: string): ConversionPath {
    // Use Dijkstra or similar to find shortest path
    // Return series of conversion steps
  }
}

// Pre-registered conversions
graph.addDirectConversion('Cel', '[degF]', v => v * 9/5 + 32);
graph.addDirectConversion('[degF]', 'Cel', v => (v - 32) * 5/9);
graph.addDirectConversion('m', 'ft', v => v * 3.28084);
// ... many more

// Conversion might go through multiple steps
convert(20, 'Cel', '[degRe]')
// Path: Cel -> K -> [degRe]
// Step 1: 20°C -> 293.15 K
// Step 2: 293.15 K -> 16°Ré
```

## Comparison Matrix

| Feature | Option 1 | Option 2 | Option 3 | Option 4 |
|---------|----------|----------|----------|----------|
| Implementation Complexity | Low | High | Medium | Very High |
| Special Unit Support | ❌ | ✅ | ✅ | ✅ |
| Performance | Fast | Medium | Fast | Variable |
| Extensibility | Low | High | Medium | High |
| Code Clarity | High | Medium | High | Low |
| Testing Complexity | Low | Medium | Medium | High |
| Memory Usage | Low | Medium | Low | High |

## Why Option 3 is Recommended

1. **Pragmatic Balance**: Not too simple (Option 1) but not overly complex (Option 4)
2. **Clear Code Flow**: Easy to understand what's happening
3. **Incremental Implementation**: Can start with linear, add special functions later
4. **Performance**: Fast path for common cases (linear conversions)
5. **Maintainable**: Special functions are clearly separated but not over-architected

## Implementation Phases for Option 3

### Phase 1: Linear Conversions Only
```typescript
// Initial implementation - throws for special units
if (fromCanonical.specialFunction || toCanonical.specialFunction) {
  throw new Error('Special unit conversion not implemented');
}
```

### Phase 2: Temperature Support
```typescript
// Add temperature handling
if (isTemperature(fromCanonical) || isTemperature(toCanonical)) {
  return convertTemperature(value, fromUnit, toUnit);
}
```

### Phase 3: Full Special Function Support
```typescript
// Complete implementation with all special functions
return convertSpecialUnits(value, fromUnit, toUnit, fromCanonical, toCanonical);
```

This phased approach allows delivering value quickly while building toward full UCUM compliance.