# Task 008: Implement Unit Validation

## Completion Notes

**Completed:** 2025-07-16

### What was done:

1. **Created validation module** (`src/validation.ts`):
   - `ValidationResult` with valid flag, errors, and warnings
   - `ValidationError` with types: syntax, unknown_unit, invalid_prefix, invalid_annotation
   - `ValidationWarning` with types: deprecated, non_standard, ambiguous
   - Core `validate()` function that uses the parser

2. **Implemented comprehensive validation**:
   - Syntax validation using the error-aware parser from task 007
   - Unit existence checking against UCUM database
   - Prefix validation for non-metric units
   - Deprecated unit warnings for [ppb] and [pptr]
   - Annotation validation
   - Context extraction for error messages
   - Unit suggestions for common typos

3. **Created extensive test suite** (`test/validation.test.ts`):
   - 27 tests covering all validation scenarios
   - Tests for syntax errors, unknown units, invalid prefixes
   - Tests for deprecated units and warnings
   - Tests for edge cases and error context
   - All tests passing

4. **Updated exports**:
   - Added validation exports to src/index.ts
   - Exported validate function and types

5. **Key implementation details**:
   - Leverages ParseResult from task 007
   - Maps parser errors/warnings to validation errors/warnings
   - Performs additional semantic validation on AST
   - Provides helpful suggestions for common mistakes
   - Edit distance algorithm for unit suggestions

### Test coverage:
- All 132 tests passing across the codebase
- TypeScript compilation successful
- Validation integrated smoothly with existing parser

## Objective
Implement a comprehensive unit validation function that provides detailed error information without throwing exceptions.

## Background
Currently, our parser throws errors when it encounters invalid units. We need a validation function that catches these errors and returns structured validation results, making it easier for users to understand what's wrong with their unit expressions.

**Important**: This task depends on first updating the parser to return ParseResult instead of throwing exceptions. See [ADR-005: Error-Aware Parser](../../adr/005-error-aware-parser.md) for the parser changes.

## Requirements

### Core Validation Function
Create `src/validation.ts` with the main validation function:

```typescript
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  type: 'syntax' | 'unknown_unit' | 'invalid_prefix' | 'invalid_annotation';
  message: string;
  position?: number;
  context?: string;
  suggestion?: string;
}

export interface ValidationWarning {
  type: 'deprecated' | 'non_standard' | 'ambiguous';
  message: string;
  suggestion?: string;
}

export function validate(unit: string): ValidationResult {
  // Implementation
}
```

### Validation Checks

1. **Syntax Validation**
   - Valid characters and operators
   - Balanced parentheses
   - Valid exponent notation
   - No invalid character sequences

2. **Unit Validation**
   - Unit exists in UCUM database
   - Valid prefixes for metric units
   - No prefixes on non-metric units
   - Valid annotation syntax

3. **Semantic Validation**
   - Warn about deprecated units
   - Suggest standard alternatives
   - Check for ambiguous expressions

### Error Types to Handle

```typescript
// Syntax errors
validate('kg/');  // Incomplete expression
validate('m(s');  // Unbalanced parentheses
validate('kg..m'); // Invalid operator sequence
validate('5kg');  // Number in wrong position

// Unknown units
validate('xyz');  // Unknown unit
validate('mF');   // Invalid prefix combination

// Invalid annotations
validate('kg{');  // Unclosed annotation
validate('m{}');  // Empty annotation
```

## Implementation Details

### Parser Integration
```typescript
import { parseUnit, ParseError, ParseWarning } from './parser';
import { Expression } from './parser/ast';

export function validate(unit: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Use error-aware parser from Task 007
  const parseResult = parseUnit(unit);
  
  // Convert parser errors to validation errors
  for (const parseError of parseResult.errors) {
    errors.push({
      type: mapParseErrorType(parseError.type),
      message: parseError.message,
      position: parseError.position,
      context: getContext(unit, parseError.position, parseError.length),
      suggestion: undefined // Parser doesn't provide suggestions for errors
    });
  }
  
  // Convert parser warnings to validation warnings
  for (const parseWarning of parseResult.warnings) {
    warnings.push({
      type: mapParseWarningType(parseWarning.type),
      message: parseWarning.message,
      suggestion: parseWarning.suggestion
    });
  }
  
  // If we have an AST, perform additional validation
  if (parseResult.ast) {
    validateAST(parseResult.ast, errors, warnings);
    checkSemantics(parseResult.ast, warnings);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

// Map parser error types to validation error types
function mapParseErrorType(type: ParseError['type']): ValidationError['type'] {
  switch (type) {
    case 'syntax':
    case 'unexpected_token':
    case 'unexpected_eof':
    case 'invalid_number':
      return 'syntax';
    default:
      return 'syntax';
  }
}

// Map parser warning types to validation warning types
function mapParseWarningType(type: ParseWarning['type']): ValidationWarning['type'] {
  switch (type) {
    case 'deprecated_syntax':
      return 'deprecated';
    case 'ambiguous':
      return 'ambiguous';
    default:
      return 'non_standard';
  }
}
```

### Helper Functions
```typescript
// Get context string showing error position
function getContext(input: string, position: number, length: number): string {
  const start = Math.max(0, position - 10);
  const end = Math.min(input.length, position + length + 10);
  return input.slice(start, end);
}

function validateAST(
  node: Expression,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Recursively validate each node
  switch (node.type) {
    case 'unit':
      validateUnit(node, errors, warnings);
      break;
    case 'binary':
      validateAST(node.left, errors, warnings);
      validateAST(node.right, errors, warnings);
      break;
    case 'unary':
      validateAST(node.operand, errors, warnings);
      break;
    case 'group':
      validateAST(node.expression, errors, warnings);
      break;
    case 'factor':
      // Factors are always valid if parsed
      break;
  }
}

function validateUnit(
  unit: Unit,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Check if unit exists
  if (!units[unit.atom]) {
    errors.push({
      type: 'unknown_unit',
      message: `Unknown unit: ${unit.atom}`,
      suggestion: findSimilarUnit(unit.atom)
    });
  }
  
  // Check prefix validity
  if (unit.prefix) {
    validatePrefix(unit, errors);
  }
  
  // Check for deprecated units
  checkDeprecated(unit, warnings);
}
```

## Test Cases

```typescript
describe('Unit Validation', () => {
  it('should validate correct units', () => {
    expect(validate('kg')).toEqual({ valid: true, errors: [] });
    expect(validate('m/s')).toEqual({ valid: true, errors: [] });
    expect(validate('kg.m/s2')).toEqual({ valid: true, errors: [] });
  });

  it('should catch syntax errors', () => {
    const result = validate('kg/');
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe('syntax');
    expect(result.errors[0].message).toContain('Unexpected end');
  });

  it('should catch unknown units', () => {
    const result = validate('xyz');
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe('unknown_unit');
  });

  it('should validate complex expressions', () => {
    expect(validate('(kg.m/s2){force}')).toEqual({ valid: true, errors: [] });
    expect(validate('10*6/ul')).toEqual({ valid: true, errors: [] });
  });

  it('should provide helpful error context', () => {
    const result = validate('kg..m');
    expect(result.errors[0].context).toBe('kg..m');
    expect(result.errors[0].position).toBe(3);
  });

  it('should warn about deprecated units', () => {
    const result = validate('ppb'); // parts per billion is deprecated
    expect(result.valid).toBe(true);
    expect(result.warnings?.[0].type).toBe('deprecated');
    expect(result.warnings?.[0].message).toContain('ambiguous');
    expect(result.warnings?.[0].suggestion).toBe('[ppb]');
  });
});
```

## Future Enhancements

1. **Suggestion Engine**
   - Implement fuzzy matching for typos
   - Suggest common alternatives
   - Provide did-you-mean functionality

2. **Detailed Position Tracking**
   - Exact character positions for all errors
   - Multi-line support for complex expressions
   - Visual error indicators

3. **Custom Validation Rules**
   - Allow users to add custom validation
   - Domain-specific constraints
   - Organization-specific unit restrictions

## Implementation Order

1. **First**: Implement parser update (Task 007 - Update Parser to Return ParseResult)
2. **Then**: Implement validation using the updated parser (this task)

## Success Criteria

- All valid UCUM units pass validation
- All invalid units are caught with helpful error messages
- No exceptions thrown during validation
- Clear distinction between errors and warnings
- Performance: < 1ms for typical unit expressions
- 100% test coverage for validation logic

## References

- [UCUM Specification - Syntax Rules](http://unitsofmeasure.org/ucum.html#section-Syntax-Rules)
- [concepts/validation.md](../../concepts/validation.md)
- [Task 002: Parser Implementation](../done/002-implement-ucum-parser.md)

## Implementation Notes

### Available Dependencies
- ✅ Parser (`parseUnit` function) - Can parse units and throw errors
- ✅ AST Types (`Expression`, `Unit`, `BinaryOp`, etc.) - For AST validation
- ✅ Units Database (`units` object) - To check if units exist
- ✅ Prefixes (`prefixes` object) - To validate prefix applicability
- ✅ Lexer - Already handles annotations and special characters

### Dependencies from Task 007
From the parser update task, we'll have:
- `ParseResult` type with `ast?`, `errors[]`, and `warnings[]`
- `ParseError` with types: `'syntax' | 'unexpected_token' | 'unexpected_eof' | 'invalid_number'`
- `ParseWarning` with types: `'deprecated_syntax' | 'ambiguous'`
- Position and length information on all errors/warnings
- Parser that continues after errors when possible

### Required Implementations for Validation
1. **Type Mappings**:
   - Map parser error types to validation error types
   - Map parser warning types to validation warning types
   
2. **Core Validation Function**:
   - Implement `validate()` that uses the updated parser
   - Convert parser results to validation results
   - Add context extraction for error display
   
3. **AST Validation** (beyond what parser provides):
   - Check if units exist in UCUM database
   - Validate prefix applicability (metric vs non-metric)
   - Check for deprecated units
   - Validate annotation content
   
4. **Helper Functions**:
   - `findSimilarUnit(atom)` - Implement fuzzy matching for unit suggestions
   - `validatePrefix(unit, errors)` - Check `isMetric` property on unit data
   - `checkDeprecated(unit, warnings)` - Check against deprecated units list
   - `isValidAnnotation(annotation)` - Validate annotation doesn't contain invalid characters

3. **Deprecated Units**: According to UCUM spec, these units are deprecated:
   - `ppb` (parts per billion) - ambiguous internationally
   - `ppt` (parts per trillion) - ambiguous internationally
   - Note: lowercase 'l' is NOT deprecated (both 'l' and 'L' are valid)

4. **Prefix Validation Logic**:
   ```typescript
   function validatePrefix(unit: Unit, errors: ValidationError[]): void {
     const unitData = units[unit.atom];
     if (unit.prefix && unitData && !unitData.isMetric) {
       errors.push({
         type: 'invalid_prefix',
         message: `Non-metric unit '${unit.atom}' cannot have prefix '${unit.prefix}'`
       });
     }
   }
   ```