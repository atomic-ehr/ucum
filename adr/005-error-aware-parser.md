# ADR-005: Error-Aware Parser

## Status
Accepted

## Date
2024-01-16

## Context
We need to implement unit validation that provides detailed error information including positions and context. Currently, our parser throws exceptions on errors without position information, making it difficult to provide helpful error messages.

## Decision Drivers
- Need for detailed error reporting with positions
- Ability to continue parsing after errors (error recovery)
- Support for warnings in addition to errors
- Better user experience with contextual error messages
- No backward compatibility requirements (early stage project)

## Considered Options

### Option 1: Extract Position from Error Messages
Try to parse position information from thrown error messages.

**Pros:**
- No changes to existing parser
- Quick to implement

**Cons:**
- Fragile - depends on error message format
- Limited information available
- No error recovery possible
- Hard to maintain

### Option 2: Enhance Parser with Error Collection
Modify parser to collect errors instead of throwing, while still building AST when possible.

```typescript
interface ParseResult {
  ast?: Expression;
  errors: ParseError[];
  warnings: ParseWarning[];
}

interface ParseError {
  type: 'syntax' | 'unexpected_token' | 'unexpected_eof';
  message: string;
  position: number;
  length: number;
  token?: Token;
}
```

**Pros:**
- Comprehensive error information
- Error recovery possible
- Can report multiple errors
- Clean separation of concerns

**Cons:**
- Requires parser refactoring
- More complex implementation

### Option 3: Replace Parser with Error-Aware Version
Completely replace the current parser with one that returns ParseResult.

```typescript
// Single API that always returns ParseResult
function parseUnit(input: string): ParseResult {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}
```

**Pros:**
- Single, consistent API
- No code duplication
- Cleaner architecture
- Easier to maintain

**Cons:**
- Breaking change (but acceptable since no backward compatibility needed)
- All consumers need to handle ParseResult

## Decision

**Recommend Option 3: Replace Parser with Error-Aware Version**

Since backward compatibility is not required:
1. Simpler implementation with single API
2. Cleaner architecture without dual modes
3. All parsing goes through same code path
4. Better for long-term maintenance

## Implementation Plan

### Phase 1: Enhance Token Type
```typescript
export interface Token {
  type: TokenType;
  value: string;
  position: number;
  length: number;  // Add length for better error context
}
```

### Phase 2: Create ParseResult Type
```typescript
export interface ParseResult {
  ast?: Expression;
  errors: ParseError[];
  warnings: ParseWarning[];
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

// Store original input for error context
export interface ParseResult {
  ast?: Expression;
  errors: ParseError[];
  warnings: ParseWarning[];
  input: string;  // Store for error context extraction
}
```

### Phase 3: Update Parser Implementation
```typescript
export function parseUnit(input: string): ParseResult {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize(); // Now includes position info
  const parser = new Parser(tokens, input);
  return parser.parse();
}

// Parser class updates
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
}
```

## Consequences

### Positive
- Proper error reporting with positions
- Error recovery capabilities
- Support for warnings
- Single, clean API
- Foundation for better tooling (IDE support, etc.)
- Simpler to maintain

### Negative
- Breaking change to parser API
- All code using parser needs updates
- Initial refactoring effort

## Error Recovery Strategies

### 1. Skip to Next Valid Token
When encountering an unexpected token, skip it and try to continue parsing:
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

### 2. Insert Missing Tokens
For unclosed brackets/parentheses:
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

### 3. Partial AST Construction
Build as much AST as possible even with errors:
```typescript
private tryParseExpression(): Expression | undefined {
  try {
    return this.parseExpression();
  } catch (e) {
    // If we have a partial AST, return it
    if (this.partialAst) {
      return this.partialAst;
    }
    return undefined;
  }
}
```

## Example Usage

```typescript
const result = parseUnit('kg..m/s');
// {
//   ast: undefined,
//   errors: [{
//     type: 'syntax',
//     message: 'Unexpected token "." after "."',
//     position: 3,
//     length: 1
//   }],
//   warnings: []
// }

const result2 = parseUnit('kg/s2{force}');
// {
//   ast: { ... },  // Full AST
//   errors: [],
//   warnings: [{
//     type: 'ambiguous',
//     message: 'Annotation {force} might be confused with {Force}',
//     position: 5,
//     length: 7,
//     suggestion: 'Use consistent capitalization'
//   }]
// }

// Usage in other parts of the codebase
const result = parseUnit('kg');
if (result.errors.length > 0) {
  // Handle errors
} else {
  const ast = result.ast!;
  // Use AST
}
```

## Trade-offs

### Position Tracking Approach
We chose `position + length` over alternatives:
- **Line + Column**: UCUM expressions are single-line, making this unnecessary
- **Start + End**: Slightly redundant since end = start + length
- **Full ranges**: Too complex for our simple use case

### Error Recovery Depth
We implement basic recovery (skip tokens, insert missing brackets) rather than sophisticated strategies because:
- UCUM expressions are typically short
- Users expect immediate feedback
- Complex recovery could mask real errors

### Warning Types
Limited to two warning types initially:
- `deprecated_syntax`: For deprecated but valid constructs
- `ambiguous`: For potentially confusing expressions

More can be added as patterns emerge from usage.

## Future Considerations

1. **Performance Optimization**
   - Cache tokenization results for repeated parsing
   - Lazy error message generation

2. **Enhanced Recovery**
   - Smarter synchronization points
   - Context-aware token insertion

3. **Richer Position Information**
   - Add AST node positions (not just errors)
   - Support multi-line expressions if needed

## References
- [Error Recovery in Parsing](https://www.antlr.org/papers/allstar-techreport.pdf)
- [TypeScript Compiler Error Reporting](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview)
- [concepts/validation.md](../concepts/validation.md)