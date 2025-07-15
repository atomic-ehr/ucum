# Conversion

Transforming [quantities](./quantity.md) between different "units" ( [unit expressions](./unit-expression.md) )
while preserving their physical meaning.

## Conversion Algorithm

1. Convert unit string to [UnitExpression](./unit-expression.md)
2. Convert to [Canonical Form](./canonical-form.md)
3. Check dimensions match
4. Calculate conversion factor
5. Apply conversion

```
factor = magnitude_from / magnitude_to
```

Conversions:
- **Linear units**: `result = value × factor`
- **Special units**: Apply conversion functions
