# Unit Expression

A combination of [units](./unit.md) and operators that represents a measurement, like `m/s`, `mg/dL`, `mol/L`  

String representation is parsed into `UnitExpression` using [grammar](./ucum-grammar.md).

Unit expressions can contain:
- Units with optional prefixes and exponents
- Operators (`.` for multiplication, `/` for division)
- [[factor|Factors]] (positive integers like `10` in `10.m`)
- Parentheses for grouping
- Annotations in curly braces

Used in [quantities](./quantity.md).
