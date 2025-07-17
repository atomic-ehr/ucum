# Task 011: Implement Quantity Type and Arithmetic Operations

## Status: COMPLETED (2025-07-17)

## Objective
Implement a Quantity type that encapsulates numeric values with their units, along with arithmetic operations that automatically handle unit conversions and dimensional analysis, as specified in [ADR-007](../../adr/007-quantity-type-and-operations.md).

## Background
Currently, users must manually track values alongside units and handle conversions before operations. This task implements a type-safe Quantity abstraction that makes unit-aware calculations automatic and error-free.

## Requirements

### 1. Create Quantity Type (`src/quantity.ts`)

```typescript
export interface Quantity {
  value: number;
  unit: string;
  _canonicalForm?: CanonicalForm; // Cached for performance
}

// Factory function
export function quantity(value: number, unit: string): Quantity;

// Helper functions for unit classification
export function isSpecialUnit(unit: string): boolean;
export function isArbitraryUnit(unit: string): boolean;
export function areUnitsCompatible(unit1: string, unit2: string): boolean;
```

### 2. Implement Arithmetic Operations

#### Addition/Subtraction
- Check dimensional compatibility using canonical forms
- Automatically convert to common unit (first operand's unit)
- Throw `IncompatibleDimensionsError` for incompatible units
- Handle special units per UCUM §21-22 (throw error for arithmetic, allow conversions)
- Handle arbitrary units per UCUM §24-26 (enforce isolation rules)

```typescript
export function add(q1: Quantity, q2: Quantity): Quantity;
export function subtract(q1: Quantity, q2: Quantity): Quantity;
```

#### Multiplication/Division
- Support both Quantity×Quantity and Quantity×number
- Create compound unit expressions (e.g., `kg.m/s2`)
- Simplify units where possible
- Reject multiplication/division with special units
- Handle arbitrary units (result is arbitrary if any operand is arbitrary)

```typescript
export function multiply(q1: Quantity, q2: Quantity | number): Quantity;
export function divide(q1: Quantity, q2: Quantity | number): Quantity;
```

#### Exponentiation
- Apply exponent to both value and units
- Handle fractional exponents correctly
- Reject exponentiation of special units
- Reject exponentiation of arbitrary units

```typescript
export function pow(q: Quantity, exponent: number): Quantity;
```

### 3. Implement Comparison Operations

```typescript
export function equals(q1: Quantity, q2: Quantity, tolerance?: number): boolean;
export function lessThan(q1: Quantity, q2: Quantity): boolean;
export function greaterThan(q1: Quantity, q2: Quantity): boolean;
export function lessThanOrEqual(q1: Quantity, q2: Quantity): boolean;
export function greaterThanOrEqual(q1: Quantity, q2: Quantity): boolean;
```

### 4. Implement Utility Functions

```typescript
// Convert quantity to different unit
export function toUnit(q: Quantity, targetUnit: string): Quantity;

// Get numeric value in specified unit (or original unit if not specified)
export function getValue(q: Quantity, inUnit?: string): number;

// Check if two quantities are dimensionally compatible
export function areCompatible(q1: Quantity, q2: Quantity): boolean;

// Get the dimension of a quantity
export function getDimension(q: Quantity): DimensionObject;
```

### 5. Handle Edge Cases

- **Zero values**: Proper handling in all operations
- **Negative values**: Ensure correct behavior
- **Special units**: 
  - Prevent multiplication, division, exponentiation
  - Allow conversion between commensurable special units
  - Allow conversion to/from corresponding proper units
- **Arbitrary units**:
  - Enforce isolation (no conversion between different arbitrary units)
  - Allow operations only within same arbitrary unit
  - Result of any operation with arbitrary unit is arbitrary
- **Invalid units**: Throw during quantity creation
- **NaN/Infinity**: Propagate appropriately

### 6. Performance Optimizations

- Cache canonical forms in Quantity objects
- Fast path for same-unit operations
- Reuse existing conversion functions
- Minimize unit parsing overhead

## Implementation Steps

1. **Create Basic Quantity Type**
   - [ ] Define interface in `src/quantity.ts`
   - [ ] Implement `quantity()` factory function
   - [ ] Add validation and error handling
   - [ ] Cache canonical form on first use

2. **Implement Addition/Subtraction**
   - [ ] Implement `add()` with dimension checking
   - [ ] Implement `subtract()` reusing add logic
   - [ ] Add special unit detection and rejection for arithmetic
   - [ ] Add arbitrary unit detection and isolation enforcement
   - [ ] Handle unit conversion to first operand's unit

3. **Implement Multiplication/Division**
   - [ ] Implement `multiply()` for Quantity×Quantity
   - [ ] Add overload for Quantity×number
   - [ ] Implement `divide()` with similar overloads
   - [ ] Create unit expression combination logic
   - [ ] Add unit simplification where possible
   - [ ] Handle arbitrary units (preserve arbitrary nature)

4. **Implement Power Operation**
   - [ ] Implement `pow()` with integer exponents
   - [ ] Add support for fractional exponents
   - [ ] Handle unit exponentiation correctly
   - [ ] Validate special unit restrictions (no exponentiation)
   - [ ] Validate arbitrary unit restrictions

5. **Implement Comparison Operations**
   - [ ] Implement `equals()` with optional tolerance
   - [ ] Implement ordering comparisons
   - [ ] Ensure dimension compatibility checking
   - [ ] Add proper unit conversion before comparison

6. **Implement Utility Functions**
   - [ ] Implement `toUnit()` using existing convert
   - [ ] Implement `getValue()` with optional unit
   - [ ] Implement `areCompatible()` dimension check
   - [ ] Implement `getDimension()` helper

7. **Implement Unit Classification Helpers**
   - [ ] Implement `isSpecialUnit()` checking canonical form
   - [ ] Implement `isArbitraryUnit()` checking unit data
   - [ ] Implement `areUnitsCompatible()` for operations
   - [ ] Add unit data field for `isArbitrary` flag

8. **Create Comprehensive Tests**
   - [ ] Unit tests for each operation
   - [ ] Edge case tests (zero, negative, NaN)
   - [ ] Special unit rejection tests
   - [ ] Arbitrary unit isolation tests
   - [ ] Performance benchmarks
   - [ ] Property-based tests for laws (associativity, etc.)

9. **Update Exports and Documentation**
   - [ ] Add exports to `src/index.ts`
   - [ ] Add inline JSDoc documentation
   - [ ] Create usage examples
   - [ ] Update README if needed

## Test Cases

### Basic Operations
```typescript
// Addition with conversion
const m1 = quantity(5, 'kg');
const m2 = quantity(3000, 'g');
expect(add(m1, m2).value).toBe(8);
expect(add(m1, m2).unit).toBe('kg');

// Multiplication creates compound units
const force = multiply(quantity(10, 'kg'), quantity(5, 'm/s2'));
expect(force.value).toBe(50);
expect(force.unit).toBe('kg.m/s2');

// Power operation
const area = pow(quantity(5, 'm'), 2);
expect(area.value).toBe(25);
expect(area.unit).toBe('m2');
```

### Error Cases
```typescript
// Incompatible dimensions
expect(() => add(quantity(5, 'kg'), quantity(3, 'm'))).toThrow();

// Special units - arithmetic not allowed
expect(() => multiply(quantity(20, 'Cel'), quantity(2, '1'))).toThrow();
expect(() => pow(quantity(10, 'dB'), 2)).toThrow();

// Special units - conversion allowed
const tempF = toUnit(quantity(20, 'Cel'), '[degF]');
expect(tempF.value).toBeCloseTo(68);

// Arbitrary units - isolation
expect(() => add(quantity(10, '[IU]'), quantity(5, '[arb\'U]'))).toThrow();
expect(() => toUnit(quantity(10, '[IU]'), 'mg')).toThrow();

// Arbitrary units - same unit operations allowed
const iu = add(quantity(10, '[IU]'), quantity(5, '[IU]'));
expect(iu.value).toBe(15);
expect(iu.unit).toBe('[IU]');

// Invalid units
expect(() => quantity(5, 'invalid_unit')).toThrow();
```

### Comparisons
```typescript
const q1 = quantity(1, 'kg');
const q2 = quantity(1000, 'g');
expect(equals(q1, q2)).toBe(true);
expect(lessThan(quantity(500, 'g'), q1)).toBe(true);
```

## Success Criteria

1. All arithmetic operations work correctly with automatic unit handling
2. Dimension checking prevents invalid operations
3. Special units are handled per UCUM spec (no arithmetic, conversions allowed)
4. Arbitrary units maintain isolation (no cross-unit operations)
4. Performance overhead is minimal (< 2x vs raw numbers for same-unit ops)
5. API is intuitive and matches specification
6. Comprehensive test coverage (> 95%)
8. No regression in existing functionality

## Dependencies

- Existing modules: `conversion.ts`, `canonical-form.ts`, `parser/`, `dimension.ts`
- No external dependencies needed
- **Note**: Need to update `Unit` interface in `units.ts` to add `isArbitrary?: boolean` field

## Future Enhancements

After this task is complete, consider:
1. Vector quantities (multi-dimensional values)
2. Uncertainty propagation
3. Serialization/deserialization
4. Advanced unit simplification
5. Integration with main `ucum` API object

## References

- [ADR-007: Quantity Type and Operations](../../adr/007-quantity-type-and-operations.md)
- [Library Specification](../../library-spec/index.md)
- [UCUM Standard - Arithmetic Operations](http://unitsofmeasure.org/ucum.html)
- Existing implementations for reference:
  - [js-quantities](https://github.com/gentooboontoo/js-quantities)
  - [mathjs units](https://mathjs.org/docs/datatypes/units.html)

## Completion Notes

Successfully implemented the Quantity type with all required operations:

### What Was Done

1. **Created `src/quantity.ts`** with:
   - Quantity interface with value, unit, and cached canonical form
   - Factory function with unit validation
   - All arithmetic operations (add, subtract, multiply, divide, pow)
   - Comparison operations (equals, lessThan, greaterThan, etc.)
   - Utility functions (toUnit, getValue, areCompatible, getDimension)

2. **Implemented Special Unit Handling**:
   - Detection via canonical form's specialFunction property
   - Rejection of arithmetic operations on special units
   - Allowed conversions between commensurable special units

3. **Implemented Arbitrary Unit Handling**:
   - AST-based detection for complex expressions with arbitrary units
   - Enforced isolation rules (no cross-unit conversions)
   - Allowed operations within same arbitrary unit type

4. **Created Comprehensive Tests**:
   - 61 tests in `test/quantity.test.ts` covering all operations
   - 4 additional tests in `test/quantity-arbitrary.test.ts` for complex expressions
   - Edge cases: NaN, Infinity, zero, negative values
   - Real-world scenarios: force calculations, density

5. **Key Implementation Decisions**:
   - Used functional API (not OOP) for immutability
   - Cached canonical forms for performance
   - Result units follow first operand for add/subtract
   - Compound units created for multiply/divide
   - Proper error types for different failure modes

### Challenges Overcome

1. **Arbitrary Unit Detection**: Initial implementation missed complex expressions. Fixed by properly parsing AST structure from the parser.

2. **Unit Validation**: Initially used parser which doesn't validate against units database. Changed to use toCanonicalForm for proper validation.

3. **AST Structure**: Parser returns different structure than expected. Had to adapt to actual AST node types (e.g., 'unit' not 'Unit').

### Results

- All 231 tests passing (including 65 new quantity tests)
- Full TypeScript compilation with no errors
- Complete alignment with UCUM specification
- Ready for integration into main API