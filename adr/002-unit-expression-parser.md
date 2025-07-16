# ADR-002: Unit Expression Parser

## Status

Accepted

## Context

UCUM unit expressions require parsing according to the formal grammar defined in ANTLR4 format. The parser must handle:
- Optional leading division operator (`/term`)
- Binary operators: multiplication (`.`) and division (`/`)
- Parenthesized expressions
- Exponents (positive/negative integers)
- Prefixes (only for metric units)
- Annotations in curly braces
- Integer factors

Key grammar rules:
- Left-to-right evaluation with equal precedence for `.` and `/`
- Division can be unary (leading `/`) or binary
- Components can be annotatable units, annotations, factors, or parenthesized terms
- Simple units are either atomic symbols or prefix+metric atom combinations
- Factor: a positive integer number that can appear in place of a unit (e.g., `10` in `10.m`)

## Decision

Implement a recursive descent parser following the UCUM grammar structure:

1. **Lexer**: Tokenize input into atomic symbols, prefixes, operators, digits, annotations
2. **Parser**: Build AST using simplified expression tree (see ADR-003)
3. **Grammar functions**: Map grammar rules to parser functions:
   - `parseMainTerm()` - handles optional leading `/`
   - `parseTerm()` - handles binary operators with left-to-right associativity
   - `parseComponent()` - handles units, factors, annotations, and parentheses
   - `parseSimpleUnit()` - handles prefix/atom disambiguation
   - `parseExponent()` - handles integer exponents with optional sign

## Consequences

### Positive

- Exact compliance with UCUM specification
- Clear mapping from grammar rules to parser functions
- Modular design with separate AST representation (ADR-003)
- Natural mapping to recursive descent implementation

### Negative

- More complex than needed for simple unit conversions
- Must handle prefix/atom disambiguation correctly
- Requires lookups to unit tables during parsing

## Alternatives Considered

1. **ANTLR4 code generation** - Would match grammar exactly but adds build complexity
2. **Regex-based parsing** - Cannot handle nested parentheses or complex precedence
3. **Simple split parsing** - Fails on expressions like `mg/dL` or `m.s-2`

## Related ADRs

- ADR-003: AST Representation - Defines the structure of the Abstract Syntax Tree