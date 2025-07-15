# UCUM Knowledgebase

Concise documentation of UCUM (Unified Code for Units of Measure) concepts.

We need UCUM library to work with quantities and units.

- to validate units
- to convert quantities between different units
- to do arythmetic operations on quantities
- to lookup units by name or symbol

Quantity is a value with a "unit" ([unit expression](./unit-expression.md) in terms of this library) .
Unit expression (Algebraic Unit Terms in spec) is a combination of [units](./unit.md) and 
operators (see [grammar](./ucum-grammar.md))

From "unit expression" we can calculate [canonical form](./canonical-form.md)
which can be used for [conversion](./conversion.md).

Key component of [unit expression](./unit-expression.md) is [unit](./unit.md).
There are different types of units:
- base units - ?
- derived units - ?
- annotated units - ?
- special units - ?

Base units have [dimension](./dimension.md)
Dimension is a set of base units with exponents - this is one of the key components of [canonical form](./canonical-form.md).


- **[unit.md](./unit.md)** - Atomic measurement standards
- **[ucum.md](./ucum.md)** - What is UCUM and why it matters
- **[quantity.md](./quantity.md)** - Complete measurements (value + unit)
- **[unit-expression.md](./unit-expression.md)** - Combining units with operators
  - **[ucum-grammar.md](./ucum-grammar.md)** - Formal ANTLR grammar and parsing
  - **[unit.md](./unit.md)** - Atomic measurement standards
  - **[dimension.md](./dimension.md)** - Base unit decomposition for compatibility
  - **[annotation.md](./annotation.md)** - Context metadata in curly braces
- **[conversion.md](./conversion.md)** - Transforming between compatible units