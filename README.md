# @atomic-ehr/ucum

A fast, type-safe TypeScript implementation of the Unified Code for Units of Measure (UCUM).

## Overview

This library provides a comprehensive implementation of the UCUM standard, enabling:
- **Unit validation** - Check if unit expressions are valid according to UCUM
- **Unit conversion** - Convert values between compatible units
- **Quantity arithmetic** - Add, subtract, multiply, divide quantities with units
- **Unit information** - Get detailed information about any unit
- **Special unit support** - Handle temperature, logarithmic, and other special units

## Installation

```bash
npm install @atomic-ehr/ucum
# or
bun add @atomic-ehr/ucum
```

## Quick Start

```typescript
import { ucum } from '@atomic-ehr/ucum';

// Validate units
const result = ucum.validate('kg/m2');
// { valid: true, errors: [], warnings: [] }

// Convert between units
const grams = ucum.convert(5, 'kg', 'g');
// 5000

// Work with quantities
const force = ucum.quantity(10, 'N');
const distance = ucum.quantity(5, 'm');
const work = ucum.multiply(force, distance);
// { value: 50, unit: 'N.m' }

// Get unit information
const info = ucum.info('J');
// { type: 'derived', name: 'joule', dimension: { M: 1, L: 2, T: -2 }, ... }
```

## API Reference

### Validation

```typescript
ucum.validate(unit: string): ValidationResult
```
Validates a unit expression according to UCUM rules.

### Conversion

```typescript
ucum.convert(value: number, from: string, to: string): number
ucum.isConvertible(from: string, to: string): boolean
```
Convert values between compatible units. Supports metric prefixes, unit expressions, and special units.

### Quantities

```typescript
ucum.quantity(value: number, unit: string): Quantity

// Arithmetic operations
ucum.add(q1: Quantity, q2: Quantity): Quantity
ucum.subtract(q1: Quantity, q2: Quantity): Quantity
ucum.multiply(q1: Quantity, q2: Quantity | number): Quantity
ucum.divide(q1: Quantity, q2: Quantity | number): Quantity
ucum.pow(q: Quantity, exponent: number): Quantity
```
Create and manipulate physical quantities with automatic unit handling.

### Unit Information

```typescript
ucum.info(unit: string): UnitInfo
ucum.display(unit: string, options?: DisplayOptions): string
```
Get detailed information about units and format them for display.

### Helper Functions

```typescript
ucum.isSpecialUnit(unit: string): boolean
ucum.isArbitraryUnit(unit: string): boolean
```

## Features

### Comprehensive Unit Support
- **Base units**: m, g, s, A, K, mol, cd, rad, sr
- **Derived units**: N, J, W, Pa, Hz, C, V, Ω, etc.
- **Metric prefixes**: From yocto (10⁻²⁴) to yotta (10²⁴)
- **Non-metric units**: Foot, pound, mile, gallon, etc.
- **Clinical units**: IU, pH, colony forming units, etc.
- **Arbitrary units**: Units without defined conversion factors

### Special Unit Conversions
- **Temperature**: Celsius ↔ Kelvin ↔ Fahrenheit
- **Logarithmic**: pH, Bel, Neper
- **Angular**: Degrees, radians, gradians
- **Percentages**: %, permille, ppm, ppb

### Advanced Features
- Complex unit expressions: `kg.m/s2`, `mol/(L.s)`
- Annotations: `mL{total}/h`
- Special notation: `10*`, `10^`
- Full dimensional analysis
- Precise decimal arithmetic

## Examples

### Medical Dosing
```typescript
const dose = ucum.quantity(5, 'mg/kg');
const weight = ucum.quantity(70, 'kg');
const totalDose = ucum.multiply(dose, weight);
// { value: 350, unit: 'mg' }
```

### Engineering Calculations
```typescript
const pressure = ucum.quantity(101325, 'Pa');
const psi = ucum.convert(pressure.value, pressure.unit, '[psi]');
// 14.695...
```

### Laboratory Results
```typescript
const glucose = ucum.quantity(5.5, 'mmol/L');
const mgdL = ucum.convert(glucose.value, glucose.unit, 'mg/dL');
// 99.09...
```

## Advanced Usage

For power users who need direct access to parsing and canonical forms:

```typescript
import { parseUnit, toCanonicalForm } from '@atomic-ehr/ucum';

const ast = parseUnit('kg.m/s2');
const canonical = toCanonicalForm('N');
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Type check
bun tsc --noEmit
```

## Standards Compliance

This implementation follows the [UCUM specification](https://unitsofmeasure.org/ucum.html) version 2.1, ensuring compatibility with healthcare and scientific applications worldwide.

## License

MIT

## Further Reading

- [UCUM Official Documentation](https://unitsofmeasure.org/ucum.html)
- [Integration with LOINC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251580/)
- [UCUM in Healthcare](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251552/)