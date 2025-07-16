# ADR-006: Special Function Implementation

## Status
Proposed

## Date
2025-01-16 (Updated: 2025-07-16)

## Context

UCUM defines 21 special units (6.7% of all units) that require non-linear conversions using mathematical functions. These include common units like Celsius, Fahrenheit, pH, decibels, and various logarithmic scales. Currently, our conversion implementation throws an error when encountering special units, significantly limiting the library's usefulness.

Special functions in UCUM use notation like `Cel(1 K)` for Celsius or `lg(1 1)` for bel, where the function transforms the value during conversion. Each special unit includes parameters (value and unit) that are incorporated into the function implementation.

## Decision Drivers

- Need to support common unit conversions (°C to °F is essential)
- Maintain accuracy for scientific/medical applications
- Keep implementation maintainable and extensible
- Performance considerations for repeated conversions
- Clear error handling for edge cases (e.g., negative Kelvin)
- Support for all 15 unique special functions in UCUM
- Handle scale factor α for prefixed special units (e.g., mCel, dB)

## Considered Options

### Option 1: Function Registry with Direct Implementation

Create a registry mapping function names to implementations:

```typescript
type SpecialFunction = {
  forward: (value: number) => number;
  inverse: (value: number) => number;
  domain?: (value: number) => boolean;
};

const specialFunctions: Record<string, SpecialFunction> = {
  'Cel': {
    forward: (k: number) => k - 273.15,
    inverse: (c: number) => c + 273.15,
    domain: (k: number) => k >= 0  // No negative Kelvin
  },
  'degF': {
    // Parameters value=5, unit=K/9 are incorporated
    forward: (k: number) => k * 9/5 - 459.67,
    inverse: (f: number) => (f + 459.67) * 5/9
  },
  'lg': {
    forward: (x: number) => Math.log10(x),
    inverse: (x: number) => Math.pow(10, x),
    domain: (x: number) => x > 0  // Log domain
  },
  'pH': {
    forward: (x: number) => -Math.log10(x),
    inverse: (x: number) => Math.pow(10, -x),
    domain: (x: number) => x > 0
  },
  // ... other 11 functions
};

function convertSpecialUnit(
  value: number, 
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  let result = value;
  
  // Extract scale factors for prefixed special units
  const fromScale = fromCanonical.specialFunction ? 
    fromCanonical.magnitude / getBaseUnitMagnitude(fromCanonical) : 1;
  const toScale = toCanonical.specialFunction ? 
    toCanonical.magnitude / getBaseUnitMagnitude(toCanonical) : 1;
  
  // Apply inverse function with scale (UCUM formula: m = f⁻¹(α × r) × u)
  if (fromCanonical.specialFunction) {
    const fn = specialFunctions[fromCanonical.specialFunction.name];
    if (fn.domain && !fn.domain(fromScale * result)) {
      throw new Error(`Value ${fromScale * result} outside domain`);
    }
    result = fn.inverse(fromScale * result);
  }
  
  // Linear conversion between base units
  result = result * (fromCanonical.magnitude / toCanonical.magnitude);
  
  // Apply forward function with scale (UCUM formula: r = f(m/u) / α)
  if (toCanonical.specialFunction) {
    const fn = specialFunctions[toCanonical.specialFunction.name];
    result = fn.forward(result) / toScale;
  }
  
  return result;
}
```

**Pros:**
- Simple and direct
- Easy to understand and debug
- Fast execution
- Clear domain validation

**Cons:**
- All functions loaded even if unused
- No lazy loading possible
- Harder to extend without modifying core

### Option 2: Class-Based Function Hierarchy

Use OOP with a base class and specific implementations:

```typescript
abstract class SpecialFunction {
  abstract forward(value: number): number;
  abstract inverse(value: number): number;
  abstract validate(value: number): void;
  
  protected checkDomain(value: number, min?: number, max?: number): void {
    if (min !== undefined && value < min) {
      throw new Error(`Value ${value} below minimum ${min}`);
    }
    if (max !== undefined && value > max) {
      throw new Error(`Value ${value} above maximum ${max}`);
    }
  }
}

class CelsiusFunction extends SpecialFunction {
  forward(kelvin: number): number {
    this.validate(kelvin);
    return kelvin - 273.15;
  }
  
  inverse(celsius: number): number {
    const kelvin = celsius + 273.15;
    this.validate(kelvin);
    return kelvin;
  }
  
  validate(value: number): void {
    this.checkDomain(value, 0); // No negative Kelvin
  }
}

class LogarithmicFunction extends SpecialFunction {
  constructor(private base: number) {
    super();
  }
  
  forward(value: number): number {
    this.validate(value);
    return Math.log(value) / Math.log(this.base);
  }
  
  inverse(value: number): number {
    return Math.pow(this.base, value);
  }
  
  validate(value: number): void {
    this.checkDomain(value, Number.EPSILON); // Must be positive
  }
}

// Factory
class SpecialFunctionFactory {
  private static functions = new Map<string, () => SpecialFunction>([
    ['Cel', () => new CelsiusFunction()],
    ['degF', () => new FahrenheitFunction()],
    ['lg', () => new LogarithmicFunction(10)],
    ['ln', () => new LogarithmicFunction(Math.E)],
    ['ld', () => new LogarithmicFunction(2)],
    ['pH', () => new pHFunction()],
    // ... all 15 functions
  ]);
  
  static create(name: string): SpecialFunction {
    const factory = this.functions.get(name);
    if (!factory) {
      throw new Error(`Unknown special function: ${name}`);
    }
    return factory();
  }
}
```

**Pros:**
- Type-safe and extensible
- Encapsulated validation logic
- Can add methods (derivatives, descriptions, etc.)
- Good for complex functions with state

**Cons:**
- More boilerplate code
- Slight performance overhead from classes
- Overkill for simple functions

### Option 3: Functional Composition Approach

Build complex functions from simple primitives:

```typescript
type Transform = (value: number) => number;
type Validator = (value: number) => boolean;

interface FunctionDefinition {
  forward: Transform;
  inverse: Transform;
  validator?: Validator;
}

// Primitive transforms
const transforms = {
  offset: (n: number): Transform => (x) => x + n,
  scale: (n: number): Transform => (x) => x * n,
  log: (base: number): Transform => (x) => Math.log(x) / Math.log(base),
  exp: (base: number): Transform => (x) => Math.pow(base, x),
  tan: (): Transform => Math.tan,
  atan: (): Transform => Math.atan,
};

// Validators
const validators = {
  positive: (x: number) => x > 0,
  nonNegative: (x: number) => x >= 0,
  range: (min: number, max: number) => (x: number) => x >= min && x <= max,
};

// Compose functions
const compose = (...fns: Transform[]): Transform => 
  (x) => fns.reduce((v, f) => f(v), x);

// Define special functions using composition
const specialFunctions: Record<string, FunctionDefinition> = {
  'Cel': {
    forward: transforms.offset(-273.15),
    inverse: transforms.offset(273.15),
    validator: validators.nonNegative
  },
  'degF': {
    forward: compose(
      transforms.scale(9/5),
      transforms.offset(-459.67)
    ),
    inverse: compose(
      transforms.offset(459.67),
      transforms.scale(5/9)
    )
  },
  'lg': {
    forward: transforms.log(10),
    inverse: transforms.exp(10),
    validator: validators.positive
  },
  'pH': {
    forward: compose(
      transforms.log(10),
      transforms.scale(-1)
    ),
    inverse: compose(
      transforms.scale(-1),
      transforms.exp(10)
    ),
    validator: validators.positive
  },
  'tanTimes100': {
    forward: compose(
      transforms.tan(),
      transforms.scale(100)
    ),
    inverse: compose(
      transforms.scale(0.01),
      transforms.atan()
    )
  }
};
```

**Pros:**
- Highly composable and reusable
- Easy to add new functions
- Functional programming benefits
- Clear mathematical structure

**Cons:**
- May be harder to debug composed functions
- Less intuitive for complex functions
- Performance overhead from function composition

### Option 4: Configuration-Driven Approach

Define functions declaratively in configuration:

```typescript
interface FunctionConfig {
  type: 'offset' | 'scale' | 'log' | 'custom';
  parameters: number[];
  domain?: { min?: number; max?: number };
  customFn?: {
    forward: string;  // Function body as string
    inverse: string;
  };
}

const functionConfigs: Record<string, FunctionConfig[]> = {
  'Cel': [
    { type: 'offset', parameters: [-273.15], domain: { min: 0 } }
  ],
  'degF': [
    { type: 'scale', parameters: [9/5] },
    { type: 'offset', parameters: [-459.67] }
  ],
  'lg': [
    { type: 'log', parameters: [10], domain: { min: 0 } }
  ],
  'hpX': [
    { 
      type: 'custom', 
      parameters: [],
      customFn: {
        forward: 'return -Math.log10(value)',
        inverse: 'return Math.pow(10, -value)'
      }
    }
  ]
};

class FunctionInterpreter {
  static execute(configs: FunctionConfig[], value: number, inverse: boolean): number {
    const operations = inverse ? [...configs].reverse() : configs;
    let result = value;
    
    for (const config of operations) {
      result = inverse 
        ? this.applyInverse(config, result)
        : this.applyForward(config, result);
    }
    
    return result;
  }
  
  private static applyForward(config: FunctionConfig, value: number): number {
    switch (config.type) {
      case 'offset': return value + config.parameters[0];
      case 'scale': return value * config.parameters[0];
      case 'log': return Math.log(value) / Math.log(config.parameters[0]);
      case 'custom': return new Function('value', config.customFn!.forward)(value);
    }
  }
  
  private static applyInverse(config: FunctionConfig, value: number): number {
    switch (config.type) {
      case 'offset': return value - config.parameters[0];
      case 'scale': return value / config.parameters[0];
      case 'log': return Math.pow(config.parameters[0], value);
      case 'custom': return new Function('value', config.customFn!.inverse)(value);
    }
  }
}
```

**Pros:**
- Functions defined as data
- Easy to load from external config
- No code changes for new functions
- Could be generated from UCUM XML

**Cons:**
- Less type safety
- Harder to debug
- Security concerns with eval/Function
- Performance overhead

## Decision

**Recommend Option 1: Function Registry with Direct Implementation**

### Rationale

1. **Simplicity**: Straightforward implementation that's easy to understand and maintain
2. **Performance**: Direct function calls without overhead
3. **Type Safety**: Full TypeScript support with clear interfaces
4. **Debugging**: Easy to set breakpoints and trace execution
5. **Sufficient**: 15 functions don't justify complex architecture
6. **Proven Pattern**: Similar approach used in other unit libraries

### All 15 Special Functions

Based on UCUM specification, these are the 15 unique functions used by 21 special units:

1. **Cel** - Celsius temperature (K - 273.15)
2. **degF** - Fahrenheit temperature (K × 9/5 - 459.67)
3. **degRe** - Réaumur temperature ((K - 273.15) × 4/5)
4. **ln** - Natural logarithm (base e)
5. **lg** - Common logarithm (base 10)
6. **lgTimes2** - 2 × log₁₀(x) for field quantities
7. **ld** - Binary logarithm (base 2)
8. **pH** - Negative log₁₀(x) for acidity
9. **tanTimes100** - 100 × tan(x) where x is in radians
10. **100tan** - 100 × tan(x) where x is in degrees
11. **hpX** - Homeopathic decimal potency (-log₁₀(x))
12. **hpC** - Homeopathic centesimal potency (-ln(x)/ln(100))
13. **hpM** - Homeopathic millesimal potency (-ln(x)/ln(1000))
14. **hpQ** - Homeopathic quintamillesimal potency (-ln(x)/ln(50000))
15. **sqrt** - Square root for spectral density

### Implementation Plan

```typescript
// src/special-functions.ts
export interface SpecialFunctionDef {
  name: string;
  forward: (value: number) => number;
  inverse: (value: number) => number;
  inputDomain?: (value: number) => boolean;
  outputDomain?: (value: number) => boolean;
}

const specialFunctions = new Map<string, SpecialFunctionDef>();

// Register all 15 functions
specialFunctions.set('Cel', {
  name: 'Celsius',
  forward: (k) => k - 273.15,
  inverse: (c) => c + 273.15,
  inputDomain: (k) => k >= 0
});

specialFunctions.set('degF', {
  name: 'Fahrenheit',
  forward: (k) => k * 9/5 - 459.67,
  inverse: (f) => (f + 459.67) * 5/9,
  inputDomain: (k) => k >= 0
});

// ... register all other functions

// Export for use in conversion
export function getSpecialFunction(name: string): SpecialFunctionDef | undefined {
  return specialFunctions.get(name);
}

// Update conversion.ts
export function convert(value: number, fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  // Check dimensions
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new IncompatibleDimensionsError(fromUnit, toUnit);
  }
  
  let result = value;
  
  // Handle special function conversion
  if (fromCanonical.specialFunction || toCanonical.specialFunction) {
    result = convertWithSpecialFunctions(
      result, 
      fromCanonical, 
      toCanonical
    );
  } else {
    // Simple linear conversion
    result = result * fromCanonical.magnitude / toCanonical.magnitude;
  }
  
  return result;
}

// Handle special units with scale factors (UCUM §22)
function convertWithSpecialFunctions(
  value: number,
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  let result = value;
  
  // Extract scale factors for prefixed special units
  const fromScale = fromCanonical.specialFunction ? 
    fromCanonical.magnitude / getBaseUnitMagnitude(fromCanonical) : 1;
  const toScale = toCanonical.specialFunction ? 
    toCanonical.magnitude / getBaseUnitMagnitude(toCanonical) : 1;
  
  // Apply inverse function with scale (UCUM formula: m = f⁻¹(α × r) × u)
  if (fromCanonical.specialFunction) {
    const fn = getSpecialFunction(fromCanonical.specialFunction.name);
    if (!fn) throw new Error(`Unknown special function: ${fromCanonical.specialFunction.name}`);
    
    if (fn.inputDomain && !fn.inputDomain(fromScale * result)) {
      throw new Error(`Value ${fromScale * result} outside domain for ${fn.name}`);
    }
    result = fn.inverse(fromScale * result);
  }
  
  // Linear conversion between base units
  result = result * (fromCanonical.magnitude / toCanonical.magnitude);
  
  // Apply forward function with scale (UCUM formula: r = f(m/u) / α)
  if (toCanonical.specialFunction) {
    const fn = getSpecialFunction(toCanonical.specialFunction.name);
    if (!fn) throw new Error(`Unknown special function: ${toCanonical.specialFunction.name}`);
    
    result = fn.forward(result) / toScale;
  }
  
  return result;
}
```

## Consequences

### Positive
- Common conversions (°C ↔ °F) work immediately
- Complete implementation of UCUM standard
- Foundation for scientific/medical applications
- Clear path for adding new functions if needed
- Supports prefixed special units (mCel, dB, etc.) with scale factors

### Negative
- Must maintain function definitions
- Need comprehensive testing for edge cases
- Must handle domain errors gracefully

## Future Considerations

1. **Caching**: Cache SpecialFunctionDef lookups for performance
2. **Validation**: Add detailed validation messages for domain errors
3. **Documentation**: Generate docs from function registry
4. **Testing**: Property-based testing for inverse relationships

## References

- [UCUM Specification §24: Special Units](http://unitsofmeasure.org/ucum.html#section-Special-Units)
- [concepts/special-units.md](../concepts/special-units.md)
- [ADR-004: Unit Conversion Implementation](./004-unit-conversion-implementation.md)