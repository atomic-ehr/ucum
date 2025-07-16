# Task 005: Optimize Canonical Form Performance

## Status: POSTPONED - Focus on Core Features First

## Objective
Improve performance of canonical form calculations through caching strategies.

## Why Postponed
This is a performance optimization that should wait until:
1. Core UCUM functionality is complete (conversions, arithmetic, validation)
2. We have real usage patterns to inform optimization decisions
3. We can measure actual performance bottlenecks
4. We know which units are used most frequently

"Premature optimization is the root of all evil" - Donald Knuth

## Background
Currently, canonical forms are calculated at runtime by recursively expanding unit definitions. For example:
- `cal_th` → `J` → `N.m` → `kg.m/s2.m` → base units

This recursive expansion happens every time, even for frequently used units.

## Approaches to Consider

### Option 1: Build-time Precalculation
Add precalculated canonical forms directly to `src/units.ts`.

**Pros:**
- Zero runtime overhead
- Immediate availability
- No memory management needed

**Cons:**
- Increases file size (~300 units × ~100 bytes = ~30KB)
- Requires build step
- Less flexible for dynamic units

### Option 2: Runtime Caching
Implement a cache that stores canonical forms as they're calculated.

**Pros:**
- No file size increase
- Works with dynamic unit expressions
- Only caches what's actually used
- Can set cache size limits

**Cons:**
- First calculation still slow
- Memory usage grows during runtime
- Need cache invalidation strategy

### Option 3: Hybrid Approach
Precalculate common units, cache others at runtime.

**Pros:**
- Best of both worlds
- Fast for common units
- Flexible for complex expressions

**Cons:**
- More complex implementation
- Need to decide what's "common"

## Recommendation
Start with **Option 2 (Runtime Caching)** as it's:
- Simpler to implement
- No build process changes needed
- Provides immediate benefits
- Can be extended later with precalculation if needed

## Requirements for Runtime Caching Approach

### 1. Create Cache Implementation
Create a caching layer in `src/canonical-form.ts`:

```typescript
// Simple LRU cache or Map-based cache
const canonicalFormCache = new Map<string, CanonicalForm>();
const MAX_CACHE_SIZE = 1000; // Configurable

function getCachedOrCalculate(unitExpression: string): CanonicalForm {
  if (canonicalFormCache.has(unitExpression)) {
    return canonicalFormCache.get(unitExpression)!;
  }
  
  const result = calculateCanonicalForm(unitExpression);
  
  // Simple cache management
  if (canonicalFormCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry (or implement LRU)
    const firstKey = canonicalFormCache.keys().next().value;
    canonicalFormCache.delete(firstKey);
  }
  
  canonicalFormCache.set(unitExpression, result);
  return result;
}
```

### 2. Cache Key Strategy
- Use normalized unit expressions as keys
- Consider: `"kg.m/s2"` and `"m.kg/s2"` should have same canonical form
- Options:
  - Cache by string as-is (simple, might have duplicates)
  - Cache by sorted AST representation (more complex, fewer duplicates)

### 3. Update Public API

```typescript
export function toCanonicalForm(unitExpression: string): CanonicalForm {
  return getCachedOrCalculate(unitExpression);
}

// Add cache control methods
export function clearCanonicalFormCache(): void {
  canonicalFormCache.clear();
}

export function getCacheStats(): { size: number; maxSize: number } {
  return { 
    size: canonicalFormCache.size, 
    maxSize: MAX_CACHE_SIZE 
  };
}
```

## Alternative: Requirements for Build-time Precalculation

### 1. Create a Script to Calculate Canonical Forms
Create `scripts/add-canonical-forms.ts` that:
- Imports the current units data
- Uses the `toCanonicalForm` function to calculate canonical form for each unit
- Adds a `canonicalForm` property to each unit
- Handles special cases appropriately

### 2. Update Unit Type Definition
Update the `Unit` interface in `src/units.ts` to include:
```typescript
interface Unit {
  // ... existing properties
  canonicalForm?: {
    magnitude: number;
    dimension: DimensionObject;
    baseUnits: Array<{
      unit: BaseUnit;
      exponent: number;
    }>;
    // Note: specialFunction is derived from isSpecial and value.function
  };
}
```

### 3. Handle Different Unit Types

#### Base Units
- Already in canonical form
- Example: `m` → `{magnitude: 1, dimension: {L: 1}, baseUnits: [{unit: 'm', exponent: 1}]}`

#### Derived Units
- Need full expansion
- Example: `N` → `{magnitude: 1000, dimension: {M: 1, L: 1, T: -2}, baseUnits: [...]}`

#### Special Units
- Include base representation but not the special function (already in value.function)
- Example: `Cel` → `{magnitude: 1, dimension: {Θ: 1}, baseUnits: [{unit: 'K', exponent: 1}]}`

#### Dimensionless Units
- Include magnitude only
- Example: `%` → `{magnitude: 0.01, dimension: {}, baseUnits: []}`

### 4. Script Implementation Details

```typescript
import { units } from '../src/units';
import { toCanonicalForm } from '../src/canonical-form';
import { writeFileSync } from 'fs';

// For each unit:
// 1. Skip if already has canonicalForm
// 2. Calculate canonical form
// 3. Add to unit data
// 4. Handle errors gracefully (some units might fail)

// Special considerations:
// - Preserve original formatting and order
// - Handle circular dependencies
// - Log any units that fail to calculate
```

### 5. Update Build Process
- Add script to build pipeline
- Run after units extraction but before TypeScript compilation
- Ensure it's idempotent (can run multiple times safely)

### 6. Update Canonical Form Implementation
Modify `src/canonical-form.ts` to:
- Check for precalculated canonical form first
- Fall back to calculation if not present
- This provides backward compatibility

```typescript
function toCanonicalFormFromUnit(unitData: UnitData): CanonicalForm {
  // If precalculated, return it
  if (unitData.canonicalForm) {
    const cf = unitData.canonicalForm;
    return {
      magnitude: cf.magnitude,
      dimension: cf.dimension,
      units: cf.baseUnits,
      specialFunction: unitData.isSpecial ? extractSpecialFunction(unitData) : undefined
    };
  }
  // Otherwise, calculate as before
  // ...
}
```

## Implementation Steps for Runtime Caching

1. [ ] Add cache data structure to canonical-form.ts
2. [ ] Implement cache lookup and storage logic
3. [ ] Add cache eviction strategy (LRU or simple FIFO)
4. [ ] Update toCanonicalForm to use cache
5. [ ] Add cache control functions (clear, stats)
6. [ ] Write tests for caching behavior:
   - [ ] Cache hits return same object
   - [ ] Cache misses calculate and store
   - [ ] Cache eviction works correctly
   - [ ] Cache can be cleared
7. [ ] Benchmark performance improvement
8. [ ] Consider adding cache warming for common units
9. [ ] Document caching behavior

## Alternative Implementation Steps for Build-time Precalculation

1. [ ] Create backup of current units.ts
2. [ ] Write the script `scripts/add-canonical-forms.ts`
3. [ ] Test script on a subset of units first
4. [ ] Handle edge cases:
   - [ ] Units with circular dependencies
   - [ ] Units that reference non-existent units
   - [ ] Special units with complex functions
   - [ ] Arbitrary units
5. [ ] Run script on full units.ts
6. [ ] Update Unit type definition
7. [ ] Update canonical-form.ts to use precalculated data
8. [ ] Run all tests to ensure nothing breaks
9. [ ] Measure performance improvement
10. [ ] Document the process in concepts/

## Test Strategy

### For Runtime Caching:
1. **Cache effectiveness**: Measure cache hit rate
2. **Performance**: Benchmark repeated calculations
3. **Memory usage**: Monitor cache size over time
4. **Correctness**: Cached values match fresh calculations

### For Build-time Precalculation:
1. **Correctness**: Verify precalculated forms match runtime calculation
2. **Completeness**: Ensure all units have canonical forms (where applicable)
3. **Performance**: Benchmark before/after to quantify improvement
4. **Regression**: All existing tests should still pass

## Success Criteria

### For Runtime Caching:
- 90%+ cache hit rate for common units
- 5-10x performance improvement for cached lookups
- Memory usage stays within limits
- Cache behavior is predictable and tested

### For Build-time Precalculation:
- All non-arbitrary units have precalculated canonical forms
- Performance improvement of at least 10x for canonical form lookup
- No regression in existing functionality
- Script can be run repeatedly without issues

## Performance Comparison

| Approach | First Lookup | Subsequent Lookups | Memory Usage | Complexity |
|----------|--------------|-------------------|--------------|------------|
| Current (no cache) | Slow | Slow | Low | Simple |
| Runtime Cache | Slow | Fast | Medium | Medium |
| Precalculated | Fast | Fast | High (file size) | Complex |
| Hybrid | Fast/Slow | Fast | Medium | High |

## References

- [concepts/canonical-form.md](../../concepts/canonical-form.md)
- [src/canonical-form.ts](../../src/canonical-form.ts)
- [src/units.ts](../../src/units.ts)
- Task 004: Implement Canonical Form Calculation