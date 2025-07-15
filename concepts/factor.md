# Factor

A **factor** is a positive integer number that can appear in place of a unit in UCUM expressions.

## Definition

According to UCUM grammar (§8), a factor is:
- A string of decimal digits ('0'-'9')
- Interpreted as a positive integer number
- Can be used as a component in unit expressions

## Examples

- `10` - the integer ten
- `10.m` - ten meters (10 multiplied by meter)
- `10*6/mL` - ten to the power of 6 per milliliter
- `2.5` - means 2 × 5 = 10 (not 2.5, as period is multiplication operator)

## Important Notes

- Only pure digit strings are factors
- If digits are followed by non-digit characters valid for units, the whole string becomes a unit atom (e.g., `10*` is a unit atom, not a factor)
- The period (`.`) is always a multiplication operator, never a decimal point

## Grammar Position

In UCUM grammar, a factor can appear as a component:
```
component := annotatable annotation | annotatable | annotation | factor | '(' term ')'
```

## Related Concepts

- [[component]] - A factor is one type of component
- [[term]] - Factors can be combined with units in terms
- [[exponent]] - Different from factors; exponents modify units while factors are standalone numbers