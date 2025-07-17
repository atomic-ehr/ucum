# ADR-007: Quantity Type and Arithmetic Operations

## Status

Proposed

## Context

The UCUM library needs to support arithmetic operations on quantities (values with units). Currently, we have unit parsing, validation, and conversion capabilities, but users must manually handle:

1. Tracking values alongside their units
2. Converting units before arithmetic operations
3. Calculating result units for multiplication/division
4. Checking dimensional compatibility for addition/subtraction

This leads to error-prone code like:
```typescript
// Current approach - manual and error-prone
const mass1 = 5; // kg
const mass2 = convert(3000, 'g', 'kg'); // Convert first
const totalMass = mass1 + mass2; // Hope units match!

// Desired approach - automatic and safe
const mass1 = quantity(5, 'kg');
const mass2 = quantity(3000, 'g');
const totalMass = add(mass1, mass2); // Handles conversion automatically
```

## Decision

Implement a `Quantity` type that encapsulates a numeric value with its unit, along with arithmetic operations that handle unit conversions and dimensional analysis automatically.

### Quantity Interface

```typescript
interface Quantity {
  value: number;
  unit: string;
  _canonicalForm?: CanonicalForm; // Cached for performance
}

// Helper functions for unit classification
function isSpecialUnit(unit: string): boolean;
function isArbitraryUnit(unit: string): boolean;
function areUnitsCompatible(unit1: string, unit2: string): boolean;
```

### Operations

```typescript
// Creation
function quantity(value: number, unit: string): Quantity;

// Arithmetic
function add(q1: Quantity, q2: Quantity): Quantity;
function subtract(q1: Quantity, q2: Quantity): Quantity;
function multiply(q1: Quantity, q2: Quantity | number): Quantity;
function divide(q1: Quantity, q2: Quantity | number): Quantity;
function pow(q: Quantity, exponent: number): Quantity;

// Comparison
function equals(q1: Quantity, q2: Quantity, tolerance?: number): boolean;
function lessThan(q1: Quantity, q2: Quantity): boolean;
function greaterThan(q1: Quantity, q2: Quantity): boolean;

// Utility
function toUnit(q: Quantity, targetUnit: string): Quantity;
function getValue(q: Quantity, inUnit?: string): number;
```

### Implementation Strategy

1. **Addition/Subtraction**:
   - Check dimensional compatibility using canonical forms
   - Convert second operand to first operand's unit
   - Perform arithmetic on values
   - Return result in first operand's unit

2. **Multiplication/Division**:
   - Multiply/divide the values
   - Combine unit expressions symbolically
   - Simplify if possible (e.g., `m/s * s = m`)

3. **Power**:
   - Raise value to exponent
   - Apply exponent to each unit component

4. **Special Unit Handling** (per UCUM §21-22):
   - Special units (Celsius, pH, decibel, etc.) measure on non-ratio scales
   - **Prohibited operations**:
     - Cannot multiply, divide, or exponentiate special units
     - Cannot mix special units with regular units in arithmetic
   - **Allowed operations**:
     - Conversion between commensurable special units (e.g., Cel to [degF])
     - Conversion to/from their corresponding proper units
   - Examples:
     ```typescript
     // Not allowed:
     multiply(quantity(20, 'Cel'), quantity(2, '1'))     // Error
     divide(quantity(100, '[pH]'), quantity(2, '[pH]'))  // Error
     pow(quantity(10, 'dB'), 2)                          // Error
     
     // Allowed:
     toUnit(quantity(20, 'Cel'), '[degF]')  // OK: 68 [degF]
     toUnit(quantity(20, 'Cel'), 'K')       // OK: 293.15 K
     ```

5. **Arbitrary Unit Handling** (per UCUM §24-26):
   - Arbitrary units ([IU], [arb'U], etc.) are procedure-defined units
   - **Isolation rules**:
     - Cannot convert between different arbitrary units
     - Cannot convert arbitrary units to any other unit type
     - Any operation involving arbitrary units results in an arbitrary unit
   - **Allowed operations**:
     - Operations between quantities of the same arbitrary unit
     - Scalar multiplication/division
   - Examples:
     ```typescript
     // Not allowed:
     add(quantity(10, '[IU]'), quantity(5, '[arb\'U]'))  // Error: different arbitrary units
     toUnit(quantity(10, '[IU]'), 'mg')                  // Error: no conversion possible
     
     // Allowed:
     add(quantity(10, '[IU]'), quantity(5, '[IU]'))      // OK: 15 [IU]
     multiply(quantity(10, '[IU]'), 2)                   // OK: 20 [IU]
     ```

### Result Unit Selection

For addition/subtraction, the result uses the first operand's unit:
```typescript
add(quantity(5, 'kg'), quantity(3000, 'g')) // Result: 8 kg
add(quantity(3000, 'g'), quantity(5, 'kg')) // Result: 8000 g
```

For multiplication/division, create compound units:
```typescript
multiply(quantity(10, 'm'), quantity(5, 's'))  // Result: 50 m.s
divide(quantity(100, 'm'), quantity(5, 's'))   // Result: 20 m/s
```

## Consequences

### Positive

- **Type Safety**: Impossible to accidentally add incompatible units
- **Automatic Conversion**: No manual conversion needed before operations
- **Clean API**: Intuitive operations that match mathematical notation
- **Error Prevention**: Dimensional analysis catches errors at runtime
- **Preservation of Intent**: Results maintain meaningful units
- **Immutability**: Operations return new Quantity instances

### Negative

- **Performance Overhead**: Each operation involves unit parsing and canonical form calculation
- **Memory Usage**: Quantity objects use more memory than raw numbers
- **Special Unit Limitations**: Cannot perform arithmetic on special units (only conversions allowed)
- **Arbitrary Unit Isolation**: Cannot convert or compare between different arbitrary units
- **Learning Curve**: Users must adapt to using Quantity objects instead of raw numbers
- **Complexity**: Must understand UCUM's distinction between proper, special, and arbitrary units

## Alternatives Considered

### 1. Object-Oriented Approach with Methods

```typescript
class Quantity {
  add(other: Quantity): Quantity { ... }
  multiply(other: Quantity): Quantity { ... }
}
```

**Rejected because**:
- Requires instantiation with `new`
- Harder to implement immutability cleanly
- Less functional programming friendly
- Methods vs functions inconsistency

### 2. Operator Overloading (Not Available in TypeScript)

If TypeScript supported operator overloading:
```typescript
const total = quantity1 + quantity2; // Would be ideal
```

**Rejected because**:
- TypeScript doesn't support operator overloading
- Would require different language or transpilation

### 3. Fluent API with Chaining

```typescript
quantity(5, 'kg')
  .add(quantity(3000, 'g'))
  .multiply(2)
  .toUnit('lb');
```

**Rejected because**:
- All operations must return Quantity for chaining
- Less flexible for complex expressions
- Harder to compose with other functions

### 4. Mutable Operations

```typescript
const q = quantity(5, 'kg');
addInPlace(q, quantity(3000, 'g')); // Modifies q
```

**Rejected because**:
- Mutations make code harder to reason about
- Prevents use in pure functional code
- Can lead to unexpected side effects

### 5. Unit-Aware Number Type

Extend JavaScript Number prototype:
```typescript
const mass = (5).withUnit('kg');
```

**Rejected because**:
- Modifying built-in prototypes is bad practice
- Would not work with TypeScript type system
- Could conflict with other libraries

## Implementation Notes

### Performance Optimizations

1. **Canonical Form Caching**: Store canonical form in Quantity object after first calculation
2. **Common Unit Patterns**: Fast paths for common operations (e.g., same unit addition)
3. **Lazy Evaluation**: Only parse/convert units when necessary

### Error Handling

1. **Invalid Units**: Throw during quantity creation
2. **Incompatible Dimensions**: Throw during addition/subtraction
3. **Special Units**: 
   - Throw `SpecialUnitArithmeticError` for multiplication, division, or exponentiation
   - Allow conversions between commensurable special units
4. **Arbitrary Units**:
   - Throw `ArbitraryUnitConversionError` when converting between different arbitrary units
   - Throw `ArbitraryUnitConversionError` when converting arbitrary to non-arbitrary units
5. **Domain Errors**: Preserve domain checking from conversion layer (e.g., negative Kelvin)

### Testing Strategy

1. **Unit Tests**: Each operation with various unit combinations
2. **Property Tests**: Mathematical properties (associativity, commutativity)
3. **Edge Cases**: Zero, negative values, very large/small numbers
4. **Special Units**: 
   - Ensure proper rejection of arithmetic operations
   - Verify conversions between commensurable special units work
   - Test conversion to/from corresponding proper units
5. **Arbitrary Units**:
   - Test isolation between different arbitrary units
   - Verify operations within same arbitrary unit work
   - Ensure no conversion to other unit types
6. **Performance Tests**: Measure overhead vs raw number operations

## Future Enhancements

1. **Vector Quantities**: Support for multi-dimensional quantities
2. **Uncertainty Propagation**: Track measurement uncertainty
3. **Unit Inference**: Automatically determine result units from context
4. **Serialization**: JSON representation and parsing
5. **Formatting**: Locale-aware display with configurable precision

## References

- [Library Specification](../library-spec/index.md)
- [UCUM Standard](http://unitsofmeasure.org/ucum.html)
- [JavaScript Number Type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- Similar libraries:
  - [js-quantities](https://github.com/gentooboontoo/js-quantities)
  - [unitmath](https://github.com/ericman314/UnitMath)
  - [mathjs units](https://mathjs.org/docs/datatypes/units.html)