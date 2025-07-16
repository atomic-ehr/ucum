# Task 007: Update Parser to Return ParseResult

## Completion Notes

**Completed:** 2025-07-16

### What was done:

1. **Created ParseResult types** (`src/parser/types.ts`):
   - `ParseResult` with ast, errors, warnings, and input
   - `ParseError` with position and length tracking
   - `ParseWarning` for non-critical issues

2. **Enhanced Token with position info**:
   - Added `length` field to Token interface
   - Updated Lexer to track token length for all token types

3. **Transformed Parser to error-aware version**:
   - Parser now collects errors instead of throwing
   - Implements error recovery (synchronization, partial AST)
   - Reports warnings for long annotations
   - Always returns ParseResult

4. **Updated all dependent code**:
   - `canonical-form.ts` handles ParseResult
   - Updated exports in index files
   - Updated all parser tests to use new API
   - Added error handling tests

5. **Test coverage**:
   - All 105 tests passing
   - TypeScript compilation successful
   - Error position tracking verified
   - Warning detection working

### Key implementation details:
- Parser continues after errors when possible
- Errors include accurate position and length
- Warning system for ambiguous syntax
- Backward compatibility not maintained (as per ADR-005)

## Objective
Update the parser to return a ParseResult object containing AST, errors, and warnings instead of throwing exceptions. This is a prerequisite for implementing proper unit validation.

## Background
The current parser throws exceptions when it encounters errors, which makes it impossible to:
- Provide detailed position information
- Continue parsing to find multiple errors
- Distinguish between errors and warnings
- Build partial ASTs for error recovery


This task implements the parser changes described in [ADR-005: Error-Aware Parser](../../adr/005-error-aware-parser.md).

## Requirements

### 1. Define ParseResult Types
Create new types in `src/parser/types.ts`:

```typescript
export interface ParseResult {
  ast?: Expression;
  errors: ParseError[];
  warnings: ParseWarning[];
  input: string;  // Store for error context extraction
}

export interface ParseError {
  type: 'syntax' | 'unexpected_token' | 'unexpected_eof' | 'invalid_number';
  message: string;
  position: number;  // 0-based character offset
  length: number;     // Number of characters
  token?: Token;      // Associated token if available
}

export interface ParseWarning {
  type: 'deprecated_syntax' | 'ambiguous';
  message: string;
  position: number;
  length: number;
  suggestion?: string;
}
```

### 2. Enhance Token with Position Info
Update `src/parser/lexer.ts`:

```typescript
export interface Token {
  type: TokenType;
  value: string;
  position: number;
  length: number;  // Add this
}
```

### 3. Update Lexer
- Track character position for each token
- Calculate token length
- Store position info in tokens
- Enhance existing `tokenize()` method (no rename needed)

Implementation approach:
```typescript
class Lexer {
  private input: string;
  private position: number = 0;
  private tokens: Token[] = [];
  
  constructor(input: string) {
    this.input = input;
  }
  
  private addToken(type: TokenType, value: string): void {
    const startPos = this.position - value.length;
    this.tokens.push({ 
      type, 
      value, 
      position: startPos,
      length: value.length 
    });
  }
  
  // Update readNumber, readAtomOrPrefix, etc. to track positions
}

### 4. Update Parser
Transform `src/parser/parser.ts`:

**From** (current):
```typescript
export function parseUnit(input: string): Expression {
  const parser = new Parser(input);
  return parser.parse();
}

class Parser {
  parse(): Expression {
    const expr = this.parseExpression();
    if (!this.isAtEnd()) {
      throw new Error(`Unexpected token: ${this.peek().value}`);
    }
    return expr;
  }
}
```

**To** (new):
```typescript
export function parseUnit(input: string): ParseResult {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize(); // Now includes position info
  const parser = new Parser(tokens);
  return parser.parse();
}

class Parser {
  private errors: ParseError[] = [];
  private warnings: ParseWarning[] = [];
  private tokens: Token[];
  private current: number = 0;
  private input: string;
  
  constructor(tokens: Token[], input: string) {
    this.tokens = tokens;
    this.input = input;
  }
  
  parse(): ParseResult {
    const ast = this.tryParseExpression();
    
    // Check for trailing tokens
    if (!this.isAtEnd() && this.errors.length === 0) {
      this.reportError('unexpected_token', 
        `Unexpected token: ${this.peek().value}`, 
        this.peek()
      );
    }
    
    return {
      ast,
      errors: this.errors,
      warnings: this.warnings,
      input: this.input
    };
  }
  
  private reportError(type: ParseError['type'], message: string, token?: Token): void {
    this.errors.push({
      type,
      message,
      position: token?.position ?? this.current,
      length: token?.length ?? 1,
      token
    });
  }
  
  private reportWarning(type: ParseWarning['type'], message: string, token?: Token, suggestion?: string): void {
    this.warnings.push({
      type,
      message,
      position: token?.position ?? this.current,
      length: token?.length ?? 1,
      suggestion
    });
  }
  
  private tryParseExpression(): Expression | undefined {
    try {
      return this.parseExpression();
    } catch (e) {
      // Already reported via reportError
      return undefined;
    }
  }
}
```

### 5. Implement Error Recovery

#### Skip to Next Valid Token
```typescript
private synchronize(): void {
  this.advance(); // Skip the problematic token
  
  while (!this.isAtEnd()) {
    // Look for recovery points
    if (this.peek().type === 'SLASH' || 
        this.peek().type === 'DOT' ||
        this.peek().type === 'RPAREN') {
      return;
    }
    this.advance();
  }
}
```

#### Handle Missing Closing Tokens
```typescript
private parseGroup(): Expression | undefined {
  this.consume('LPAREN');
  const expr = this.parseExpression();
  
  if (!this.check('RPAREN')) {
    this.reportError('unexpected_eof', 'Missing closing parenthesis');
    // Continue as if it was there
  } else {
    this.consume('RPAREN');
  }
  
  return expr;
}
```

#### Replace Throwing with Error Reporting
```typescript
// Before (throws)
if (!this.check(type)) {
  throw new Error(`Expected ${type}`);
}

// After (reports)
if (!this.check(type)) {
  this.reportError('unexpected_token', `Expected ${type}, got ${this.peek().value}`);
  this.synchronize();
  return undefined;
}
```

### 6. Update All Code Using Parser
Update these files to handle ParseResult:
- `src/canonical-form.ts`
- `src/conversion.ts`
- All test files

Example update:
```typescript
// Before
const ast = parseUnit(unitExpression);

// After
const result = parseUnit(unitExpression);
if (result.errors.length > 0) {
  throw new Error(result.errors[0].message);
}
const ast = result.ast!;
```

## Test Cases

### Basic Error Reporting
```typescript
it('should report position for syntax errors', () => {
  const result = parseUnit('kg..m');
  expect(result.errors[0]).toMatchObject({
    type: 'syntax',
    message: 'Unexpected token "."',
    position: 3,
    length: 1
  });
  expect(result.input).toBe('kg..m');
});

it('should report multiple errors', () => {
  const result = parseUnit('kg..m//s');
  expect(result.errors).toHaveLength(2);
});
```

### Error Recovery
```typescript
it('should parse partial AST when possible', () => {
  const result = parseUnit('kg.m/');
  expect(result.ast).toBeDefined();
  expect(result.ast?.type).toBe('binary');
  expect(result.errors[0].type).toBe('unexpected_eof');
});
```

### Position Tracking
```typescript
it('should track positions correctly in errors', () => {
  const result = parseUnit('kg[invalid]');
  expect(result.errors[0]).toMatchObject({
    type: 'unexpected_token',
    position: 2,  // Position of '['
    length: 1
  });
});

it('should include input in result for context', () => {
  const input = 'kg.m/s2';
  const result = parseUnit(input);
  expect(result.input).toBe(input);
});
```

### Warning Reporting
```typescript
it('should report warnings for ambiguous expressions', () => {
  // Example: annotation that might be confusing
  const result = parseUnit('mg{weight}');
  if (result.warnings.length > 0) {
    expect(result.warnings[0]).toMatchObject({
      type: 'ambiguous',
      message: expect.any(String),
      position: expect.any(Number),
      length: expect.any(Number)
    });
  }
});
```

Note: Adding position to AST nodes would be valuable but is not part of this task's scope. Consider as future enhancement.

## Implementation Strategy

Since we're replacing the parser completely (per ADR-005):
1. Update parser to return ParseResult
2. Update all code that uses the parser in the same PR
3. No need for parallel implementations or gradual migration

## Success Criteria

- Parser returns ParseResult for all inputs
- Position information available for all tokens
- Multiple errors can be reported
- Partial ASTs built when possible
- All existing tests pass after migration
- Performance remains within acceptable bounds (< 1ms for typical expressions)

## Common Warning Scenarios

The parser should detect and warn about:

1. **Ambiguous Annotations**: 
   - Mixed case that might be typos: `{Force}` vs `{force}`
   - Very long annotations that might be errors

2. **Deprecated Syntax** (if any found in UCUM):
   - Old-style notations being phased out

Example implementation:
```typescript
// In parseAnnotation()
if (annotation.length > 50) {
  this.reportWarning('ambiguous', 
    'Very long annotation might be an error', 
    token,
    'Consider using shorter, clearer annotations'
  );
}
```

## References

- [ADR-005: Error-Aware Parser](../../adr/005-error-aware-parser.md)
- [Task 008: Implement Unit Validation](./008-implement-unit-validation.md)