# Task 004: Implement Canonical Form Calculation

## Status: COMPLETED

## Objective
Implement the calculation of canonical form for unit expressions according to the UCUM specification.

## What Was Done

1. **Created `src/canonical-form.ts`** with:
   - TypeScript interfaces for `CanonicalForm`, `BaseUnitTerm`, `BaseUnit`, and `SpecialFunction`
   - Helper functions for unit processing
   - AST node processors for all expression types
   - Main functions `toCanonicalForm` and `toCanonicalFormFromAST`

2. **Implemented key features**:
   - Prefix handling with proper exponent application
   - Base unit recognition and processing
   - Derived unit expansion via recursive parsing
   - Special unit function extraction
   - Numeric value handling (e.g., hour = 60 minutes)
   - Dimension calculation from base units

3. **Created comprehensive tests** in `test/canonical-form.test.ts`:
   - All 7 base units
   - Prefixed units with exponents
   - Derived units (Hz, N, Pa, J, V)
   - Special units (Cel, pH, Np)
   - Complex expressions (km/h, mg/dL)
   - Dimensionless units (%, ‰, ppm)
   - Edge cases and non-metric units

4. **Fixed issues discovered during testing**:
   - Corrected AST node type names (lowercase)
   - Fixed exponent handling for prefixed units
   - Added special handling for units with "undefined" values
   - Corrected volt dimension (T: -2, not T: -3 when using coulomb as base)
   - Updated pH test expectations (mol is dimensionless in UCUM)

5. **All 36 canonical form tests passing**, plus all existing tests (76 total)

## Background
A canonical form is the standardized representation of any unit expression where:
- All derived units are expanded to base units
- All prefixes are converted to numeric values
- All numeric factors are combined into a single magnitude
- Dimensions are calculated as an object with non-zero exponents

## Requirements

### 1. Define Types
```typescript
import type { DimensionObject } from './dimension';
import type { Expression } from './parser/ast';
import type { Unit as UnitData } from './units';

interface CanonicalForm {
  magnitude: number;
  dimension: DimensionObject;
  units: BaseUnitTerm[];
  specialFunction?: SpecialFunction;
}

interface BaseUnitTerm {
  unit: BaseUnit;
  exponent: number;
}

type BaseUnit = 'm' | 'g' | 's' | 'rad' | 'K' | 'C' | 'cd';

interface SpecialFunction {
  name: string;
  value: string;
  unit: string;
}
```

### 2. Implement Core Algorithm

Create `src/canonical-form.ts` with:

#### Main Function
```typescript
// From string
function toCanonicalForm(unitExpression: string): CanonicalForm

// From parsed AST
function toCanonicalFormFromAST(expr: Expression): CanonicalForm
```

#### Algorithm Steps:
1. **Initialize result** with magnitude = 1, empty dimension object, empty units array
2. **Process each AST node** recursively:
   - `Factor`: multiply magnitude by the numeric value
   - `Unit`: 
     - Apply prefix value to magnitude
     - Look up unit in units data
     - If base unit: add to units array with exponent
     - If derived unit: recursively expand definition
     - If special unit: extract special function
   - `BinaryOp`:
     - For multiplication (`.`): combine results
     - For division (`/`): negate exponents of right operand
   - `UnaryOp`: negate all exponents
   - `Group`: process inner expression
3. **Normalize**:
   - Combine like base units
   - Calculate dimension object using Dimension utilities
   - Sort units consistently
   - Handle special units

### 3. Handle Different Unit Types

#### Base Units
- Direct mapping: `m` → `{unit: 'm', exponent: 1}`
- With exponent: `m2` → `{unit: 'm', exponent: 2}`

#### Prefixed Units
- Extract prefix value: `km` → magnitude × 1000, unit: `m`
- Handle with exponent: `cm2` → magnitude × 0.0001, unit: `m`, exponent: 2

#### Derived Units
- Expand definition: `N` → `kg.m/s2`
- Recursively process: `J` → `N.m` → `kg.m2/s2`

#### Special Units
- Extract special function from unit definition
- Keep base unit representation with special function marker

### 4. Implement Helper Functions

```typescript
import { units, baseUnits } from './units';
import { prefixes } from './prefixes';
import { parse } from './parser';
import { Dimension } from './dimension';

// Check if unit is a base unit
function isBaseUnit(unit: string): boolean {
  return unit in baseUnits;
}

// Get prefix value from prefixes data
function getPrefixValue(prefix: string): number {
  return prefixes[prefix]?.value ?? 1;
}

// Get unit definition for derived units
function getUnitDefinition(unit: string): Expression | null {
  const unitData = units[unit];
  if (!unitData || unitData.isBaseUnit) return null;
  // Parse the unit's value.Unit string
  return parse(unitData.value.Unit);
}

// Normalize base unit terms (combine like terms)
function normalizeUnits(units: BaseUnitTerm[]): BaseUnitTerm[] {
  const unitMap = new Map<BaseUnit, number>();
  for (const term of units) {
    unitMap.set(term.unit, (unitMap.get(term.unit) || 0) + term.exponent);
  }
  return Array.from(unitMap.entries())
    .filter(([_, exp]) => exp !== 0)
    .map(([unit, exponent]) => ({ unit, exponent }))
    .sort((a, b) => a.unit.localeCompare(b.unit));
}

// Calculate dimension object from base units
function calculateDimension(units: BaseUnitTerm[]): DimensionObject {
  const dimension: DimensionObject = {};
  const dimensionMap: Record<BaseUnit, keyof DimensionObject> = {
    'm': 'L',
    'g': 'M', 
    's': 'T',
    'rad': 'A',
    'K': 'Θ',
    'C': 'Q',
    'cd': 'F'
  };
  
  for (const term of units) {
    const dimKey = dimensionMap[term.unit];
    if (dimKey && term.exponent !== 0) {
      dimension[dimKey] = term.exponent;
    }
  }
  
  return dimension;
}

// Handle special unit functions
function extractSpecialFunction(unitData: UnitData): SpecialFunction | undefined {
  if (unitData.value.function) {
    return {
      name: unitData.value.function.name,
      value: unitData.value.function.value,
      unit: unitData.value.function.Unit
    };
  }
  return undefined;
}
```

### 5. Examples to Test

```typescript
// Simple units
toCanonicalForm('m')     
// → {magnitude: 1, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}

toCanonicalForm('km')    
// → {magnitude: 1000, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}

toCanonicalForm('cm2')   
// → {magnitude: 0.0001, dimension: {L: 2}, units: [{unit: 'm', exponent: 2}]}

// Derived units (note: kg is expanded to 1000 g)
toCanonicalForm('N')     
// → {magnitude: 1000, dimension: {M: 1, L: 1, T: -2}, units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: 1}, {unit: 's', exponent: -2}]}

toCanonicalForm('J')     
// → {magnitude: 1000, dimension: {M: 1, L: 2, T: -2}, units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: 2}, {unit: 's', exponent: -2}]}

// Complex expressions
toCanonicalForm('km/h')  
// → {magnitude: 0.277778, dimension: {L: 1, T: -1}, units: [{unit: 'm', exponent: 1}, {unit: 's', exponent: -1}]}

toCanonicalForm('mg/dL') 
// → {magnitude: 10, dimension: {M: 1, L: -3}, units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: -3}]}

// Special units
toCanonicalForm('Cel')   
// → {magnitude: 1, dimension: {Θ: 1}, units: [{unit: 'K', exponent: 1}], specialFunction: {name: 'Cel', value: '1', unit: 'K'}}

// Dimensionless
toCanonicalForm('%')
// → {magnitude: 0.01, dimension: {}, units: []}
```

## Implementation Steps

1. [ ] Create `src/canonical-form.ts` file
2. [ ] Define TypeScript interfaces and types
3. [ ] Implement helper functions:
   - [ ] `isBaseUnit` - check against baseUnits from units.ts
   - [ ] `getPrefixValue` - use prefixes data
   - [ ] `getUnitDefinition` - parse unit's value.Unit string
   - [ ] `normalizeUnits` - combine like terms
   - [ ] `calculateDimension` - map base units to dimensions
   - [ ] `extractSpecialFunction` - extract from unit data
4. [ ] Implement AST processing:
   - [ ] Handle `Factor` nodes
   - [ ] Handle `Unit` nodes with prefix and exponent
   - [ ] Handle `BinaryOp` nodes (multiplication and division)
   - [ ] Handle `UnaryOp` nodes (leading division)
   - [ ] Handle `Group` nodes
5. [ ] Implement main functions:
   - [ ] `toCanonicalFormFromAST` - process parsed AST
   - [ ] `toCanonicalForm` - parse string then process
6. [ ] Handle edge cases:
   - [ ] Units with annotations
   - [ ] Special numbers like `10*` and `10^`
   - [ ] Arbitrary units (non-convertible)
   - [ ] Dimensionless units
7. [ ] Create comprehensive tests in `test/canonical-form.test.ts`
8. [ ] Document limitations and special cases

## Test Cases

Create `test/canonical-form.test.ts` with:

### Base Unit Tests
Test all 7 base units:
- `m` → `{magnitude: 1, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}`
- `g` → `{magnitude: 1, dimension: {M: 1}, units: [{unit: 'g', exponent: 1}]}`
- `s` → `{magnitude: 1, dimension: {T: 1}, units: [{unit: 's', exponent: 1}]}`
- `rad` → `{magnitude: 1, dimension: {A: 1}, units: [{unit: 'rad', exponent: 1}]}`
- `K` → `{magnitude: 1, dimension: {Θ: 1}, units: [{unit: 'K', exponent: 1}]}`
- `C` → `{magnitude: 1, dimension: {Q: 1}, units: [{unit: 'C', exponent: 1}]}`
- `cd` → `{magnitude: 1, dimension: {F: 1}, units: [{unit: 'cd', exponent: 1}]}`

### Prefix Tests
- `km` → `{magnitude: 1000, dimension: {L: 1}, units: [{unit: 'm', exponent: 1}]}`
- `mg` → `{magnitude: 0.001, dimension: {M: 1}, units: [{unit: 'g', exponent: 1}]}`
- `us` (microsecond) → `{magnitude: 0.000001, dimension: {T: 1}, units: [{unit: 's', exponent: 1}]}`

### Derived Unit Tests
Based on actual UCUM definitions:

1. **Hz (hertz)** - Definition: `s-1`
   ```typescript
   toCanonicalForm('Hz')
   // → {magnitude: 1, dimension: {T: -1}, units: [{unit: 's', exponent: -1}]}
   ```

2. **N (newton)** - Definition: `kg.m/s2`
   ```typescript
   toCanonicalForm('N')
   // → {magnitude: 1000, dimension: {M: 1, L: 1, T: -2}, 
   //    units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: 1}, {unit: 's', exponent: -2}]}
   ```

3. **Pa (pascal)** - Definition: `N/m2`
   ```typescript
   toCanonicalForm('Pa')
   // → {magnitude: 1000, dimension: {M: 1, L: -1, T: -2},
   //    units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: -1}, {unit: 's', exponent: -2}]}
   ```

4. **J (joule)** - Definition: `N.m`
   ```typescript
   toCanonicalForm('J')
   // → {magnitude: 1000, dimension: {M: 1, L: 2, T: -2},
   //    units: [{unit: 'g', exponent: 1}, {unit: 'm', exponent: 2}, {unit: 's', exponent: -2}]}
   ```

5. **V (volt)** - Definition: `J/C`
   ```typescript
   toCanonicalForm('V')
   // → {magnitude: 1000, dimension: {M: 1, L: 2, T: -3, Q: -1},
   //    units: [{unit: 'C', exponent: -1}, {unit: 'g', exponent: 1}, {unit: 'm', exponent: 2}, {unit: 's', exponent: -3}]}
   ```

### Special Unit Tests

1. **Cel (degree Celsius)** - Definition: `cel(1 K)`
   ```typescript
   toCanonicalForm('Cel')
   // → {magnitude: 1, dimension: {Θ: 1}, units: [{unit: 'K', exponent: 1}],
   //    specialFunction: {name: 'Cel', value: '1', unit: 'K'}}
   ```

2. **[pH]** - Definition: `pH(1 mol/l)`
   ```typescript
   toCanonicalForm('[pH]')
   // → {magnitude: ..., dimension: {...}, units: [...],
   //    specialFunction: {name: 'pH', value: '1', unit: 'mol/l'}}
   ```

3. **Np (neper)** - Definition: `ln(1 1)`
   ```typescript
   toCanonicalForm('Np')
   // → {magnitude: 1, dimension: {}, units: [],
   //    specialFunction: {name: 'ln', value: '1', unit: '1'}}
   ```

### Complex Expression Tests
- `km/h` → test division and prefixes
- `mg/dL` → test multiple prefixes and derived units
- `kg.m/s2` → test direct expansion (should equal N)
- `m2.kg/s3` → test exponents and ordering

### Edge Cases
- `%` → dimensionless with magnitude 0.01
- `10*` → special number ten
- `[pi]` → arbitrary constant
- `1` → the unit one
- `[ft_i]` → non-metric unit

## Dependencies
- Completed parser (task 002) ✓
- Units data extracted from UCUM XML ✓
- Prefix definitions ✓
- Dimension utilities ✓
- AST types from parser ✓

## Success Criteria
- All UCUM units can be converted to canonical form
- Dimension calculations are correct
- Special units are properly identified
- Tests pass for all example cases
- Performance is acceptable for complex expressions

## References

### Core Concepts
- [concepts/canonical-form.md](../../concepts/canonical-form.md) - Detailed explanation of canonical forms
- [concepts/dimension.md](../../concepts/dimension.md) - Dimension system and operations
- [concepts/unit.md](../../concepts/unit.md) - Unit types and properties
- [concepts/special-units.md](../../concepts/special-units.md) - Special units and their functions

### Implementation References
- [concepts/unit-expression.md](../../concepts/unit-expression.md) - Unit expression structure
- [concepts/parse.md](../../concepts/parse.md) - Parser implementation details
- [concepts/conversion.md](../../concepts/conversion.md) - How canonical forms enable conversion

### UCUM Specification
- Sections 18-20: Proper units and linear conversions
- Sections 21-23: Special units and non-linear conversions
- Section 24-26: Arbitrary units