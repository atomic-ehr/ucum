# Special Notation Units: 10* and 10^

## Overview

`10*` and `10^` are special unit atoms in UCUM that represent "the number ten for arbitrary powers". They are **not** factors but actual unit atoms.

## Key Points from UCUM Spec

1. **They are unit atoms**, not factors (§27.3, Table 3)
   - Symbol: `10*` or `10^`
   - Name: "the number ten for arbitrary powers"
   - Value: 10
   - Definition: `1` (dimensionless)

2. **Why they exist** (§27.3)
   - Digits alone would be parsed as factors
   - The trailing `*` or `^` makes them valid unit symbols
   - Used in expressions like `10*-9` (instead of 10⁻⁹)

3. **Historical context**
   - `10*` originated from HL7 where `^` was reserved
   - `10^` was added later as more intuitive
   - Both are equivalent

## Usage Examples

From UCUM tables:
- `%` is defined as `10*-2`
- `[ppm]` is defined as `10*-6`
- `[ppb]` is defined as `10*-9`
- `mol` is defined as `6.02214076 × 10*23`

## Parsing Implications

When parsing:
- `10` → Factor with value 10
- `10*` → Unit atom "ten star"
- `10*6` → Unit atom `10*` with exponent 6
- `10.m` → Factor 10 multiplied by meter

## AST Representation

This creates ambiguity in our current AST:

```typescript
// Current ambiguity:
"10*6" could be:
1. Unit { atom: "10*", exponent: 6 }
2. Unit { atom: "10", exponent: 6 } with special flag?

// Same issue with:
"10^6" vs regular unit with exponent
```

## Recommendation

The parser needs to recognize `10*` and `10^` as special unit atoms during lexing:
- If we see `10*` or `10^` followed by optional exponent → it's a unit
- If we see just `10` → it's a factor

No change needed to AST structure - these are just unit atoms with special names.