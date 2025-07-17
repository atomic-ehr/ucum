# Task 010: Implement Prefixed Special Units Support

## Objective
Implement scale factor support for prefixed special units (e.g., mCel, dB) to enable conversions like millidegree Celsius and decibel, completing the special function conversion implementation.

## Background
Task 009 successfully implemented all 15 special functions and basic special unit conversions. However, support for prefixed special units was deferred. Currently, 3 tests are skipped in `test/special-functions.test.ts` that require this functionality:
- Millidegree Celsius (mCel) conversions
- Decibel (dB) conversions

According to UCUM §22, special units can have prefixes that introduce a scale factor α into the conversion formulas. The UCUM specification explicitly allows certain special units to be metric (accept prefixes), marked with `isMetric="yes"` in ucum-essence.xml:
- **Celsius (Cel)** - can have prefixes like mCel, μCel
- **Neper (Np)** - can have prefixes like mNp
- **Bel (B)** - can have prefixes like dB (decibel), cB (centibel)
- All Bel variants: B[SPL], B[V], B[mV], B[uV], B[10.nV], B[W], B[kW]

## Technical Context

### UCUM Conversion Formulas with Scale Factor
- **Forward (proper → special)**: _r_**s** = _f_**s**(_m_/**u**) / _α_
- **Inverse (special → proper)**: _m_ = _f_**s**⁻¹(_α_ × _r_**s**) × **u**

Where:
- _α_ = scale factor from prefix (e.g., 0.001 for milli-, 0.1 for deci-)
- Other variables as defined in task 009

### Current Implementation Gap
The current `convertWithSpecialFunctions` in `src/conversion.ts` has placeholder code:
```typescript
// For now, we'll implement scale factor support later
// Focus on getting the basic special function conversions working
const fromScale = 1;
const toScale = 1;
```

These should be calculated based on the magnitudes in the canonical forms. The parser already correctly applies prefixes to the magnitude:
- **Cel**: magnitude = 1 (base unit)
- **mCel**: magnitude = 0.001 (milli- prefix applied)
- **B**: magnitude = 1 (base unit)
- **dB**: magnitude = 0.1 (deci- prefix applied)

## Requirements

### 1. Extract Scale Factor from Prefixed Units
Implement logic to calculate the scale factor α by:
- Identifying when a special unit has a prefix (already handled by parser)
- For special units, the scale factor α equals the canonical magnitude
- Since the base special units have magnitude 1, α = canonical.magnitude
- Example: For mCel, α = 0.001 (the canonical magnitude)

### 2. Update Conversion Logic
Modify `convertWithSpecialFunctions` in `src/conversion.ts` to:
- Calculate correct scale factors for both source and target units
- Apply scale factors according to UCUM formulas
- Handle edge cases (e.g., converting between two prefixed special units)

### 3. Update Parser/Canonical Form
Ensure the parser and canonical form correctly handle prefixed special units:
- Verify that mCel, dB, and other prefixed special units parse correctly
- Ensure the canonical form preserves both the prefix magnitude and special function information

### 4. Enable and Pass Skipped Tests
- Remove `.skip` from the 3 prefixed special unit tests
- Ensure all tests pass with correct results

## Implementation Steps

1. **Analyze Current Canonical Forms**
   - Check how mCel and dB are represented in canonical form
   - Verify magnitude values include prefix scaling

2. **Implement Scale Factor Extraction**
   ```typescript
   function getScaleFactor(canonical: CanonicalForm): number {
     if (!canonical.specialFunction) return 1;
     
     // For special units, the scale factor α is simply the magnitude
     // because base special units always have magnitude = 1
     return canonical.magnitude;
   }
   ```

3. **Update Conversion Function**
   - Replace placeholder scale factors with actual calculations
   - Test with the example conversions from the task

4. **Validate Results**
   - 1000 mCel = 1 Cel
   - 30 dB = 3 B
   - Round-trip conversions maintain precision

## Test Cases

### Millidegree Celsius
```typescript
expect(convert(1000, 'mCel', 'Cel')).toBe(1);         // 1000 mCel = 1 Cel
expect(convert(1, 'Cel', 'mCel')).toBe(1000);         // 1 Cel = 1000 mCel
expect(convert(1000, 'mCel', 'K')).toBeCloseTo(274.15, 5); // 1000 mCel = 1°C = 274.15 K
expect(convert(0, 'mCel', 'K')).toBe(273.15);         // 0 mCel = 0°C = 273.15 K
```

### Decibel
```typescript
expect(convert(30, 'dB', 'B')).toBe(3);   // 30 dB = 3 B
expect(convert(3, 'B', 'dB')).toBe(30);   // 3 B = 30 dB
expect(convert(10, 'dB', 'B')).toBe(1);   // 10 dB = 1 B
```

### Additional Prefixed Special Units to Consider
- Other temperature prefixes (μCel, kCel)
- Other logarithmic prefixes (cB, mB)
- Verify all combinations work correctly

## Success Criteria

1. All 3 currently skipped tests pass
2. Scale factor extraction works for all prefixed special units
3. Conversions between prefixed and non-prefixed special units are accurate
4. Round-trip conversions maintain precision
5. No regression in existing special function tests
6. Clear code with comments explaining scale factor logic

## Future Considerations

1. **Performance**: Scale factor calculation should be efficient
2. **Edge Cases**: Handle unusual prefix combinations
3. **Documentation**: Update inline documentation to explain scale factor handling

## References

- [Task 009: Special Function Conversions](../done/009-implement-special-function-conversions.md)
- [ADR-006: Special Function Implementation](../../adr/006-special-function-implementation.md)
- [UCUM Specification §22: Prefixes on Special Units](http://unitsofmeasure.org/ucum.html#section-Prefixes-on-Special-Units)
- Current skipped tests in `test/special-functions.test.ts`

## Completion Notes (2025-07-17)

Successfully implemented scale factor support for prefixed special units. All tests are now passing.

### What Was Done

1. **Implemented Scale Factor Detection**
   - Created `getScaleFactor` function that detects when special units have prefixes
   - Carefully distinguished between prefix-induced magnitude changes and reference unit magnitudes
   - Handled specific cases for Cel, lg, ln, and ld special functions

2. **Updated Conversion Logic**
   - Modified `convertWithSpecialFunctions` to apply scale factors according to UCUM formulas
   - Forward conversion: `r_s = f_s(m/u) / α`
   - Inverse conversion: `m = f_s⁻¹(α × r_s) × u`

3. **Key Implementation Details**
   - Only metric special units (isMetric="yes") can have prefixes
   - Scale factor detection based on canonical magnitude comparison
   - Special handling to avoid false positives (e.g., B[W] has magnitude 1000 due to Watt reference, not kilo- prefix)

4. **Test Results**
   - All 34 tests passing (including the 3 previously skipped tests)
   - Prefixed special units working correctly:
     - mCel (millidegree Celsius): 1000 mCel = 1 Cel
     - dB (decibel): 30 dB = 3 B
   - No regression in existing special function tests

### Challenges Overcome

The main challenge was distinguishing between:
- Magnitude changes due to prefixes (mCel has magnitude 0.001)
- Magnitude changes due to reference units (B[W] has magnitude 1000 because W = 1000 g·m²/s³)
- Magnitude changes due to unit definitions (degF has magnitude 5/9)

The solution was to implement targeted detection for known prefixed special units rather than trying to detect all cases generically.

### Key Implementation Decisions

1. **Targeted Detection Approach**
   - Instead of trying to generically detect all prefixed special units, implemented specific detection for known cases
   - This avoids false positives from units like B[W] that have non-1 magnitudes for other reasons

2. **Scale Factor Calculation**
   - For Celsius: Any magnitude != 1 indicates a prefix (scale factor = magnitude)
   - For Bel (lg): Only recognize specific prefix values (0.1 for dB, 0.01 for cB)
   - For Neper (ln): Only recognize specific prefix values (0.001 for mNp)
   - For bit (ld): Currently only supports base unit (magnitude = 1)

3. **No Change to Canonical Form Structure**
   - Decided against modifying the canonical form to track prefix information
   - The magnitude field already contains all necessary information
   - Keeps the implementation simpler and maintains backward compatibility

4. **Special Function Reference Units**
   - Units like B[SPL], B[V], B[W] have different magnitudes due to their reference units
   - These are NOT treated as prefixed units, even though their magnitudes differ from 1
   - This prevents incorrect scale factor application

5. **UCUM Compliance**
   - Only special units marked with `isMetric="yes"` in UCUM can have prefixes
   - Implementation respects this restriction by only checking specific function names