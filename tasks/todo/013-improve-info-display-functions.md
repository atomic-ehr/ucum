# Task 013: Improve info() and display() Functions

## Objective
Enhance the `info()` and `display()` functions in the unified UCUM API to provide more comprehensive unit information and better human-readable displays.

## Background
The current implementation of `info()` and `display()` functions provides basic functionality but has limitations:
- `info()` only returns full metadata for units directly in the database
- `display()` has limited unit name coverage and doesn't handle complex expressions well
- Neither function fully matches the examples shown in the library specification

## Current Limitations

### info() Function
1. **Complex expressions**: Returns the expression itself as the name (e.g., "kg.m/s2" → name: "kg.m/s2")
2. **No name generation**: Doesn't generate human-readable names for derived units
3. **Limited metadata**: Only base units have complete metadata (class, property)

### display() Function
1. **Limited unit database**: Only ~17 common units have name mappings
2. **Basic parsing**: Doesn't handle complex expressions properly
   - "kg.m/s2" becomes "kg.m per s2" instead of "kilogram meter per second squared"
   - "mol/(L.s)" becomes "mol per (L.s)" instead of "mole per liter second"
3. **No prefix expansion**: Prefixes aren't expanded in complex units
4. **No locale support**: The locale parameter is ignored
5. **Missing format options**: Only 'name' format is partially implemented

## Requirements

### 1. Enhanced info() Function

```typescript
// Should generate proper names for complex units
ucum.info('kg.m/s2');
// Should return:
{
  type: 'derived',
  code: 'kg.m/s2',
  name: 'kilogram meter per second squared',  // Generated name
  // ... other properties
}

// Should handle prefixed units
ucum.info('mL');
// Should return:
{
  type: 'derived',
  code: 'mL',
  name: 'milliliter',
  printSymbol: 'mL',
  // ... other properties
}
```

### 2. Enhanced display() Function

```typescript
// Complex expressions
ucum.display('kg.m/s2', { format: 'name' });
// → "kilogram meter per second squared"

ucum.display('mol/(L.s)', { format: 'name' });
// → "mole per liter second"

// Format options
ucum.display('N', { format: 'symbol' });
// → "N"

ucum.display('N', { format: 'long' });
// → "newton (kg⋅m/s²)"

// Locale support (future enhancement)
ucum.display('m', { locale: 'fr-FR', format: 'name' });
// → "mètre"
```

## Implementation Steps

### Phase 1: Expand Unit Name Database

1. **Create comprehensive unit name mappings**
   - [ ] Add all base units with their full names
   - [ ] Add common derived units (SI and non-SI)
   - [ ] Add clinical units commonly used in healthcare
   - [ ] Create prefix name mappings (milli-, kilo-, micro-, etc.)

2. **Structure for extensibility**
   ```typescript
   interface UnitNameData {
     name: string;
     plural?: string;
     symbol?: string;
     alternativeNames?: string[];
   }
   
   const unitNames: Record<string, UnitNameData> = {
     'm': { name: 'meter', plural: 'meters', symbol: 'm' },
     'kg': { name: 'kilogram', plural: 'kilograms', symbol: 'kg' },
     // ... etc
   };
   ```

### Phase 2: Implement Expression Parser for display()

1. **Parse complex unit expressions**
   - [ ] Handle multiplication (kg.m → "kilogram meter")
   - [ ] Handle division (m/s → "meter per second")
   - [ ] Handle exponents (m2 → "square meter", s-1 → "per second")
   - [ ] Handle parentheses (mol/(L.s) → "mole per liter second")

2. **Implement proper grammar rules**
   - [ ] Singular vs plural forms
   - [ ] Proper use of "per" for division
   - [ ] Handle "square", "cubic" for exponents 2 and 3
   - [ ] Handle negative exponents ("per second" vs "second to the -1")

### Phase 3: Enhance info() Function

1. **Generate names for complex units**
   - [ ] Use the same parser as display() to generate names
   - [ ] Infer properties when possible (e.g., m/s → velocity)
   - [ ] Generate meaningful definitions for complex units

2. **Improve metadata inference**
   - [ ] Detect common derived unit patterns
   - [ ] Assign appropriate class (SI, clinical, etc.)
   - [ ] Infer property from dimensions when possible

### Phase 4: Add Format Options

1. **Implement format variations**
   - [ ] 'symbol': Return the unit symbol/code as-is
   - [ ] 'name': Return the full name (current behavior)
   - [ ] 'long': Return name with definition/formula
   - [ ] 'short': Return abbreviated form

2. **Handle edge cases**
   - [ ] Units without known names
   - [ ] Very complex expressions
   - [ ] Special characters and annotations

### Phase 5: Prepare for Internationalization

1. **Structure for locale support**
   - [ ] Design locale data structure
   - [ ] Create English (en-US) as baseline
   - [ ] Document how to add new locales
   - [ ] Consider using Intl API for number formatting

## Test Cases

```typescript
describe('Enhanced info()', () => {
  it('should generate names for complex units', () => {
    expect(ucum.info('kg.m/s2').name).toBe('kilogram meter per second squared');
    expect(ucum.info('mol/(L.s)').name).toBe('mole per liter second');
  });
  
  it('should handle prefixed units', () => {
    expect(ucum.info('mL').name).toBe('milliliter');
    expect(ucum.info('MHz').name).toBe('megahertz');
  });
});

describe('Enhanced display()', () => {
  it('should handle complex expressions', () => {
    expect(ucum.display('kg.m2/s3', { format: 'name' }))
      .toBe('kilogram square meter per second cubed');
  });
  
  it('should support different formats', () => {
    expect(ucum.display('N', { format: 'symbol' })).toBe('N');
    expect(ucum.display('N', { format: 'long' }))
      .toBe('newton (kg⋅m/s²)');
  });
});
```

## Success Criteria

1. All specification examples work correctly
2. Common clinical and scientific units display properly
3. Complex expressions are parsed and displayed grammatically correct
4. Performance remains acceptable (< 5ms for display operations)
5. Backward compatibility maintained
6. Clear documentation for limitations

## Dependencies

- Existing parser infrastructure
- Units database
- No external dependencies for core functionality

## Future Enhancements

1. **Full internationalization**
   - Multiple locale support
   - RTL language support
   - Cultural variations in unit usage

2. **Context-aware display**
   - Clinical context (prefer mL over milliliter)
   - Scientific notation preferences
   - Regional preferences (US vs metric)

3. **Smart abbreviations**
   - Intelligent shortening for space-constrained displays
   - Consistent abbreviation rules

## References

- [UCUM Display Names](http://unitsofmeasure.org/ucum.html#section-Semantics)
- [ISO 80000 unit names](https://www.iso.org/standard/30669.html)
- [NIST Guide to SI Units](https://www.nist.gov/pml/special-publication-811)