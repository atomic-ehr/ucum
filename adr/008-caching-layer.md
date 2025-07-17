# ADR-008: Caching Layer Implementation

## Status

Proposed

## Context

The UCUM library performs several computationally expensive operations repeatedly:

1. **Parsing** - Every unit operation starts with parsing the unit string expression into an AST
2. **Canonical Form Calculation** - Recursive expansion of unit definitions to their base forms
3. **Unit/Prefix Lookups** - Frequent dictionary lookups in 312 units and 24 prefixes
4. **Dimension Calculations** - Computing dimensional vectors for unit compatibility
5. **Special Function Processing** - Complex mathematical operations for temperature and logarithmic units

Performance profiling shows that applications using this library often:
- Parse the same unit expressions multiple times
- Calculate canonical forms for the same units repeatedly
- Perform repeated conversions between the same unit pairs
- Generate display information for the same units

These repeated calculations represent a significant performance bottleneck, especially in:
- Real-time conversion interfaces
- Batch processing of measurements
- Validation of large datasets
- Interactive unit calculators

## Decision

Implement a multi-level caching system with the following components:

### 1. Canonical Form Cache (Highest Priority)
```typescript
// Key: unit expression string → CanonicalForm object
canonicalFormCache: Map<string, CanonicalForm>
```
- Cache results of `toCanonicalForm()` function
- Highest impact as it's used by conversion, validation, and display
- Avoids recursive unit expansion and dimension calculations

### 2. Parse Result Cache
```typescript
// Key: unit expression string → ParseResult (AST)
parseCache: Map<string, ParseResult>
```
- Cache results of `parseUnit()` function
- Eliminates redundant lexing and parsing operations
- Foundation for all other operations

### 3. Unit Info Cache
```typescript
// Key: unit expression string → UnitInfo
unitInfoCache: Map<string, UnitInfo>
```
- Cache results of `createUnitInfo()` function
- Combines parsing, canonical form, and name generation
- Optimizes display operations

### Implementation Strategy:

1. **Cache Manager Class**
   - Centralized cache management
   - Configurable cache sizes (LRU eviction)
   - Optional enable/disable per cache type
   - Performance metrics collection

2. **Integration Points**
   - Add caching to `src/parser/index.ts` for parse results
   - Add caching to `src/canonical-form.ts` for canonical forms
   - Add caching to `src/unit-display.ts` for unit info
   - Cache implementation in `src/cache/index.ts`

3. **Cache Configuration**
   ```typescript
   interface CacheConfig {
     enabled: boolean;
     maxSize: number;
     parseCache?: boolean;
     canonicalCache?: boolean;
     unitInfoCache?: boolean;
   }
   ```

## Consequences

### Positive

- **10-100x Performance Improvement** for repeated operations
- **Reduced Memory Allocation** through object reuse
- **Lower CPU Usage** in production applications
- **Better User Experience** in interactive applications
- **Scalability** for high-throughput scenarios
- **Backward Compatible** - caching is transparent to API users
- **Configurable** - users can tune cache behavior for their use case

### Negative

- **Memory Overhead** - cached objects consume memory
- **Code Complexity** - adds cache management layer
- **Cache Key Management** - must handle whitespace and equivalent expressions
- **Testing Complexity** - need to test with and without caching
- **Initial Overhead** - first operations still have full cost
- **Potential Memory Leaks** if cache grows unbounded (mitigated by LRU)

## Alternatives Considered

### 1. No Caching (Status Quo)
- **Pros**: Simplest implementation, no memory overhead
- **Cons**: Poor performance for repeated operations
- **Rejected**: Performance requirements demand optimization

### 2. External Caching (User Responsibility)
- **Pros**: Library remains simple, flexible caching strategies
- **Cons**: Every user reimplements caching, inconsistent performance
- **Rejected**: Common use case should be optimized by default

### 3. Compile-Time Optimization
- **Pros**: Zero runtime overhead
- **Cons**: Only works for static unit expressions
- **Rejected**: Most use cases involve dynamic unit strings

### 4. Database/Persistent Cache
- **Pros**: Shared cache across processes
- **Cons**: I/O overhead, complexity, deployment issues
- **Rejected**: In-memory cache sufficient for use cases

### 5. Memoization Decorators Only
- **Pros**: Simple implementation with decorators
- **Cons**: Less control over cache behavior, harder to configure
- **Rejected**: Need fine-grained control over cache lifecycle

## Implementation Priority

1. **Phase 1**: Canonical Form Cache (biggest impact)
2. **Phase 2**: Parse Result Cache (foundation optimization)
3. **Phase 3**: Unit Info Cache (display optimization)
4. **Phase 4**: Advanced features (warming, statistics, persistence)