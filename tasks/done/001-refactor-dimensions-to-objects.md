# Task: Refactor Dimensions to Object Representation

## Priority
High

## Related ADR
[ADR-001: Dimension Representation](../../adr/001-dimension-representation.md)

## Description
Implement the decision from ADR-001 to refactor dimension representation from vectors to objects for better readability and developer experience.

## Current State
```typescript
// Current vector representation
type DimensionVector = readonly [number, number, number, number, number, number, number];
const force = [1, 1, -2, 0, 0, 0, 0]; // Hard to read
```

## Target State
```typescript
// New object representation
type DimensionObject = {
  L?: number;  // Length
  M?: number;  // Mass
  T?: number;  // Time
  A?: number;  // Angle
  Θ?: number;  // Temperature
  Q?: number;  // Charge
  F?: number;  // Luminosity
};
const force = { L: 1, M: 1, T: -2 }; // Clear and readable
```

## Acceptance Criteria
- [ ] Update `src/dimension.ts` to use object representation
  - [ ] Change type definition to use objects
  - [ ] Update `create()` function
  - [ ] Update `fromObject()` function (simplify since it's already objects)
  - [ ] Update `multiply()` to work with objects
  - [ ] Update `divide()` to work with objects
  - [ ] Update `power()` to work with objects
  - [ ] Update `equals()` to compare objects
  - [ ] Update `isDimensionless()` for objects
  - [ ] Update `toString()` to work with objects
  - [ ] Update all predefined dimensions
- [ ] Update `scripts/extract-all-units.ts`
  - [ ] Generate dimension objects instead of arrays
  - [ ] Update type imports
- [ ] Regenerate `src/units.ts` with new dimension format
- [ ] Update `test/dimension.test.ts`
  - [ ] Update all test cases to use object syntax
  - [ ] Ensure all tests still pass
- [ ] Update `scripts/test-dimensions.ts` to use objects
- [ ] Run `bun tsc --noEmit` - no errors
- [ ] Run `bun test` - all tests pass

## Implementation Steps
2. Update dimension.ts type definitions and operations
3. Update and run extraction script
4. Update all tests
5. Verify everything works
6. Update documentation if needed

## Notes
- This is a breaking change - but we ok with that
- Change external API if needed
- Performance impact expected to be minimal
- Improved developer experience is the main goal