# AST Conversion Pipeline

## Current AST Limitations for Conversion

The current AST is **syntax-focused**, not **conversion-focused**:

```typescript
// Current: "mg/dL" 
{
  type: 'binary',
  operator: '/',
  left: { type: 'unit', prefix: 'm', atom: 'g' },
  right: { type: 'unit', prefix: 'd', atom: 'L' }
}
```

For conversions, we need:
1. Link to actual unit definitions (not just strings)
2. Normalized form (numerator/denominator)
3. Dimension information

## Required Transformation Pipeline

```
Parse AST → Resolve Units → Normalize → Canonical Form
```

### 1. Parse AST (current)
Syntax tree from parser

### 2. Resolved AST
```typescript
interface ResolvedUnit {
  type: 'unit';
  prefix?: Prefix;      // Object with scale factor
  unit: UnitDefinition; // Object with dimension, scale
  exponent: number;
  annotation?: string;
}
```

### 3. Normalized Form
```typescript
interface NormalizedExpression {
  scale: number;              // Combined scale factor
  numerator: ResolvedUnit[];  // Positive exponents
  denominator: ResolvedUnit[]; // Negative exponents
}
```

### 4. Canonical Form (for comparison)
```typescript
interface CanonicalForm {
  scale: number;
  dimension: DimensionVector; // [L, M, T, I, Θ, N, J]
}
```

## Example Transformation

```typescript
// 1. Parse: "mg/dL"
parseAST = { type: 'binary', operator: '/', ... }

// 2. Resolve units
resolvedAST = {
  type: 'binary',
  operator: '/',
  left: {
    type: 'unit',
    prefix: { symbol: 'm', scale: 1e-3 },
    unit: { symbol: 'g', dimension: [0,1,0,0,0,0,0], scale: 1e-3 },
    exponent: 1
  },
  right: {
    type: 'unit',
    prefix: { symbol: 'd', scale: 1e-1 },
    unit: { symbol: 'L', dimension: [3,0,0,0,0,0,0], scale: 1e-3 },
    exponent: 1
  }
}

// 3. Normalize
normalized = {
  scale: 1e-3 * 1e-3 / (1e-1 * 1e-3) = 0.01,
  numerator: [{ unit: gram, exponent: 1 }],
  denominator: [{ unit: liter, exponent: 1 }]
}

// 4. Canonical
canonical = {
  scale: 0.01,
  dimension: [0,1,0,0,0,0,0] - [3,0,0,0,0,0,0] = [-3,1,0,0,0,0,0]
}
```

## Recommendation

Keep current AST for parsing, but add transformation stages:

```typescript
interface Parser {
  parse(expr: string): Expression; // Current AST
}

interface Resolver {
  resolve(ast: Expression, units: UnitTable): ResolvedExpression;
}

interface Normalizer {
  normalize(resolved: ResolvedExpression): NormalizedExpression;
}

interface Converter {
  convert(from: NormalizedExpression, to: NormalizedExpression): number;
}
```

This separation of concerns:
- Parser stays simple (string → AST)
- Resolver adds semantic information
- Normalizer prepares for calculation
- Converter does the actual conversion