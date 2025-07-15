# Task: Implement UCUM Parser

## Overview
Implement a recursive descent parser for UCUM unit expressions based on [ADR-002 (Parser Implementation)](../../adr/002-unit-expression-parser.md) and [ADR-003 (AST Representation)](../../adr/003-ast-representation.md).

## Requirements

### Parser Structure (from [ADR-002](../../adr/002-unit-expression-parser.md))
1. **Lexer**: Tokenize input into atomic symbols, prefixes, operators, digits, annotations
2. **Parser**: Build AST using simplified expression tree
3. **Grammar functions**:
   - `parseMainTerm()` - handles optional leading `/`
   - `parseTerm()` - handles binary operators with left-to-right associativity
   - `parseComponent()` - handles units, factors, annotations, and parentheses
   - `parseSimpleUnit()` - handles prefix/atom disambiguation
   - `parseExponent()` - handles integer exponents with optional sign

### AST Structure (from [ADR-003](../../adr/003-ast-representation.md))
```typescript
type Expression = 
  | BinaryOp
  | UnaryOp
  | Unit
  | Factor
  | Group;

interface BinaryOp {
  type: 'binary';
  operator: '.' | '/';
  left: Expression;
  right: Expression;
}

interface UnaryOp {
  type: 'unary';
  operator: '/';
  operand: Expression;
}

interface Unit {
  type: 'unit';
  prefix?: string;
  atom: string;
  exponent?: number;
  exponentFormat?: '^' | '+' | '';
  annotation?: string;
}

interface Factor {
  type: 'factor';
  value: number;
  annotation?: string;
}

interface Group {
  type: 'group';
  expression: Expression;
}
```

## Implementation Steps

### 1. Create Lexer
- [ ] Define token types
- [ ] Implement tokenizer function
- [ ] Handle special units like `10*` and `10^`
- [ ] Support annotations in curly braces
- [ ] Skip whitespace

### 2. Create Parser Functions
- [ ] `parseMainTerm()` - entry point
- [ ] `parseTerm()` - handle `.` and `/` operators
- [ ] `parseComponent()` - dispatch to appropriate parser
- [ ] `parseAnnotatable()` - parse unit with optional exponent
- [ ] `parseSimpleUnit()` - parse prefix + atom or just atom
- [ ] `parseExponent()` - parse optional sign + digits
- [ ] `parseFactor()` - parse integer numbers
- [ ] `parseAnnotation()` - parse `{...}`
- [ ] `parseGroup()` - parse `(...)`

### 3. Handle Edge Cases
- [ ] Special notation units (`10*`, `10^`)
- [ ] Exponent formats (`m2`, `m^2`, `m+2`)
- [ ] Leading division (`/s`)
- [ ] Empty annotations (`{RBC}` as factor with value 1)
- [ ] Nested parentheses

### 4. Create Tests
- [ ] Basic units: `m`, `kg`, `s`
- [ ] Prefixed units: `mg`, `km`, `ns`
- [ ] Exponents: `m2`, `s-1`, `m^3`
- [ ] Binary operations: `m/s`, `kg.m`, `m.s-2`
- [ ] Complex expressions: `mg/dL`, `m/(s.s)`, `kg.m/s2`
- [ ] Annotations: `mg{total}`, `{RBC}`
- [ ] Special units: `10*6`, `10^-9`
- [ ] Edge cases: `/s`, `(m/s)/s`

### 5. Error Handling
- [ ] Invalid tokens
- [ ] Unexpected end of input
- [ ] Mismatched parentheses
- [ ] Invalid exponent format
- [ ] Unknown unit atoms (defer to later validation)

## Example Usage
```typescript
import { parseUnit } from './parser';

const ast = parseUnit('mg/dL');
// Returns:
// {
//   type: 'binary',
//   operator: '/',
//   left: { type: 'unit', prefix: 'm', atom: 'g' },
//   right: { type: 'unit', prefix: 'd', atom: 'L' }
// }
```

## Success Criteria
- [ ] All UCUM grammar rules are supported
- [ ] AST can be used to reproduce original string (with canonical formatting)
- [ ] Parser handles all test cases correctly
- [ ] Clear error messages for invalid input
- [ ] Type-safe implementation in TypeScript

## Files to Create
- `src/parser/lexer.ts` - Tokenizer
- `src/parser/parser.ts` - Recursive descent parser
- `src/parser/ast.ts` - AST type definitions
- `test/parser.test.ts` - Parser tests

## Completion Summary

Successfully implemented the UCUM parser with the following components:

### 1. AST Types (`src/parser/ast.ts`)
- Defined all AST node types as specified in ADR-003
- Supports BinaryOp, UnaryOp, Unit, Factor, and Group expressions

### 2. Lexer (`src/parser/lexer.ts`)
- Tokenizes UCUM expressions into appropriate tokens
- Handles special characters, digits, atoms, and annotations
- Supports special notation units (10*, 10^)

### 3. Parser (`src/parser/parser.ts`)
- Implements recursive descent parsing following ADR-002
- Correctly handles operator precedence and associativity
- Supports all UCUM features including:
  - Prefixes (with proper disambiguation)
  - Exponents (direct, caret, and signed formats)
  - Binary operations (multiplication and division)
  - Unary division (leading /)
  - Parenthesized expressions
  - Annotations (both attached and standalone)
  - Integer factors
  - Special notation units (10*, 10^)

### 4. Tests (`test/parser.test.ts`)
- Comprehensive test suite covering all parser features
- 21 test cases with 49 assertions
- Tests basic units, prefixes, exponents, operations, annotations, and edge cases
- All tests passing

### 5. Exports (`src/parser/index.ts`)
- Clean module interface for parser functionality
- Exports both implementation and types

The parser successfully handles complex real-world UCUM expressions and provides a solid foundation for unit conversion functionality.