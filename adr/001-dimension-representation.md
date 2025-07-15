# ADR-001: Dimension Representation

## Status

Accepted

## Context

The UCUM specification represents dimensions as vectors of exponents for the 7 base dimensions: Length (L), Mass (M), Time (T), Angle (A), Temperature (Θ), Charge (Q), and Luminosity (F).

We need to decide how to represent these dimensions in TypeScript. We are considering two main approaches:

### Option A: Vector Representation
```typescript
type DimensionVector = readonly [number, number, number, number, number, number, number];
// [L, M, T, A, Θ, Q, F]

const force = [1, 1, -2, 0, 0, 0, 0]; // L·M·T⁻²
const velocity = [1, 0, -1, 0, 0, 0, 0]; // L·T⁻¹
```

### Option B: Object Representation
```typescript
type DimensionObject = {
  L?: number;  // Length
  M?: number;  // Mass
  T?: number;  // Time
  A?: number;  // Angle
  Θ?: number;  // Temperature
  Q?: number;  // Charge
  F?: number;  // Luminosity
};

const force = { L: 1, M: 1, T: -2 }; // L·M·T⁻²
const velocity = { L: 1, T: -1 }; // L·T⁻¹
```

## Decision

We should use object representation (Option B) for dimensions.

## Consequences

### Positive

1. **Improved Readability**: `{ L: 1, T: -1 }` is immediately understandable as "length per time"
2. **Sparse Representation**: Most units only use 2-3 dimensions, avoiding storage of zeros
3. **Self-Documenting**: No need to remember index positions or count array elements
4. **Easier Debugging**: Console output shows meaningful property names
5. **More Maintainable**: Adding or modifying dimensions doesn't affect position-dependent code
6. **Better for Serialization**: JSON representation is more compact and human-readable
7. **Type Safety**: TypeScript can enforce valid dimension keys

### Negative

1. **Performance**: Slight overhead for object property access vs array indexing
2. **Memory**: Objects have more overhead per instance (property names, object header)
3. **Migration Effort**: Need to refactor existing code and regenerate units
4. **Ordering**: Need explicit ordering for toString() operations

## Alternatives Considered

### 1. Vector Representation (Option A)
```typescript
type DimensionVector = readonly [number, number, number, number, number, number, number];
const force: DimensionVector = [1, 1, -2, 0, 0, 0, 0]; // L¹M¹T⁻²

// Operations
function multiply(a: DimensionVector, b: DimensionVector): DimensionVector {
  return a.map((val, i) => val + b[i]) as DimensionVector;
}
```
- **Pros**: 
  - Direct mathematical representation
  - Fast array operations
  - Fixed memory layout
  - Simple iteration
- **Cons**: 
  - Poor readability (what does index 4 mean?)
  - Always stores 7 values even if most are zero
  - Error-prone index management
  - No IntelliSense support for dimensions
- **Not chosen because**: Developer experience and maintainability outweigh minor performance benefits

### 2. Object Representation (Option B) - CHOSEN
```typescript
type DimensionObject = Partial<Record<'L'|'M'|'T'|'A'|'Θ'|'Q'|'F', number>>;
const force = { L: 1, M: 1, T: -2 }; // L¹M¹T⁻²

// Operations
function multiply(a: DimensionObject, b: DimensionObject): DimensionObject {
  const result: DimensionObject = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const sum = (a[key] ?? 0) + (b[key] ?? 0);
    if (sum !== 0) result[key] = sum;
  }
  return result;
}
```
- **Pros**: 
  - Excellent readability (`{ L: 1, T: -1 }` clearly means "length per time")
  - Sparse representation (only non-zero dimensions stored)
  - Self-documenting with IntelliSense support
  - Easy debugging with meaningful property names
  - Natural JSON serialization
- **Cons**: 
  - Slight performance overhead vs arrays
  - More memory per instance
  - Need explicit ordering for consistent string representation
- **Chosen because**: Clear wins in developer experience, maintainability, and code clarity

### 3. Map Structure
```typescript
type DimensionMap = Map<'L'|'M'|'T'|'A'|'Θ'|'Q'|'F', number>;
const force = new Map([['L', 1], ['M', 1], ['T', -2]]);

// Operations
function multiply(a: DimensionMap, b: DimensionMap): DimensionMap {
  const result = new Map();
  const allKeys = new Set([...a.keys(), ...b.keys()]);
  for (const key of allKeys) {
    const sum = (a.get(key) ?? 0) + (b.get(key) ?? 0);
    if (sum !== 0) result.set(key, sum);
  }
  return result;
}
```
- **Pros**: 
  - Truly sparse representation
  - Clear key-value semantics
  - No wasted space for zero dimensions
- **Cons**: 
  - More verbose API (`map.get('L')` vs `obj.L`)
  - Harder to serialize/deserialize
  - More complex equality checking
  - Higher memory overhead than objects
- **Not chosen because**: Objects provide similar benefits with better ergonomics

### 4. Class-based Approach
```typescript
class Dimension {
  constructor(
    public L = 0, public M = 0, public T = 0,
    public A = 0, public Θ = 0, public Q = 0, public F = 0
  ) {}
  
  multiply(other: Dimension): Dimension {
    return new Dimension(
      this.L + other.L, this.M + other.M, this.T + other.T,
      this.A + other.A, this.Θ + other.Θ, this.Q + other.Q, this.F + other.F
    );
  }
}
```
- **Pros**: 
  - Encapsulation of operations
  - Method chaining possible
  - Strong typing with instanceof checks
  - Could add validation in constructor
- **Cons**: 
  - More complex than needed
  - Larger memory footprint (prototype chain)
  - Always allocates space for all 7 dimensions
  - Mutable by default (would need Object.freeze)
- **Not chosen because**: Plain objects are simpler and sufficient for our needs

### 5. Bit-packed Representation
```typescript
// Pack 7 x 4-bit signed integers into a single 32-bit number
type PackedDimension = number;

function pack(L: number, M: number, T: number, ...rest: number[]): PackedDimension {
  // Each dimension gets 4 bits, supporting -8 to +7
  return ((L & 0xF) << 24) | ((M & 0xF) << 20) | ((T & 0xF) << 16) /* ... */;
}
```
- **Pros**: 
  - Extremely memory efficient
  - Fast bitwise operations
  - Single primitive value
- **Cons**: 
  - Limited range (-8 to +7)
  - Complex bit manipulation code
  - Poor readability and debuggability
  - Hard to extend
- **Not chosen because**: Premature optimization; readability is more important

### 6. String-based Representation
```typescript
type DimensionString = string; // "L1M1T-2" or "L¹M¹T⁻²"

function parse(dim: DimensionString): DimensionObject {
  // Parse "L1M1T-2" into { L: 1, M: 1, T: -2 }
}
```
- **Pros**: 
  - Human readable
  - Compact for sparse dimensions
  - Easy to display
- **Cons**: 
  - Expensive parsing/formatting
  - No type safety
  - String manipulation for math operations
  - Ambiguous format possibilities
- **Not chosen because**: Performance overhead and lack of type safety

### 7. Hybrid Approach (Vector + Object)
```typescript
interface Dimension {
  vector: DimensionVector;  // For fast operations
  object: DimensionObject;  // For readable access
}
```
- **Pros**: 
  - Best of both worlds
  - Can optimize hot paths
- **Cons**: 
  - Synchronization complexity
  - Double memory usage
  - Confusing API (which to use when?)
- **Not chosen because**: Unnecessary complexity; choose one representation

## Implementation Plan

1. Update `src/dimension.ts` to use object representation
2. Update all dimension operations (multiply, divide, equals, etc.)
3. Regenerate `src/units.ts` with object-based dimensions
4. Update tests to use new representation
5. Run performance benchmarks to verify acceptable performance