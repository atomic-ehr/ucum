# Parsing

Parse a unit expression and return an abstract representation of the unit structure - [UnitExpression](./unit-expression.md)

```typescript
parseUnit(expression: string): UnitExpression;
```

The parser handles:
- Unit atoms and prefixes
- Operators (`.` and `/`)
- [[factor|Factors]] (positive integers)
- Parenthesized expressions
- Exponents
- Annotations

See [grammar](./ucum-grammar.md) for formal syntax definition.
