# Unit Validation Concepts

## Overview

Unit validation is the process of checking whether a unit expression conforms to UCUM syntax rules and contains only valid units. Unlike parsing (which throws errors), validation returns structured information about any issues found.

## Validation Levels

### 1. Syntax Validation
Checks if the unit expression follows UCUM grammar rules:
- Valid characters and operators
- Balanced parentheses and brackets
- Proper operator placement (no trailing operators)
- Valid exponent notation
- Correct annotation syntax

Examples of syntax errors:
```
kg/     # Trailing operator
m(s     # Unbalanced parentheses
kg..m   # Double operator
5kg     # Number in wrong position
m{      # Unclosed annotation
```

### 2. Lexical Validation
Checks if individual tokens are valid:
- Unit atoms exist in UCUM database
- Prefixes are valid and applicable
- Special units (10*, 10^) are properly formed
- Annotations follow naming rules

Examples of lexical errors:
```
xyz     # Unknown unit
mF      # Fahrenheit cannot have metric prefix
kL      # Liter should use lowercase l (warning)
```

### 3. Semantic Validation
Checks for meaning and best practices:
- Deprecated unit usage
- Ambiguous expressions
- Non-standard combinations
- Redundant expressions

Examples of semantic warnings:
```
l       # Deprecated, use L
cc      # Consider using cm3
mm[Hg]  # Consider using mmHg
```

## Validation Result Structure

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

interface ValidationError {
  type: 'syntax' | 'unknown_unit' | 'invalid_prefix' | 'invalid_annotation';
  message: string;
  position?: number;      // Character position in input
  context?: string;       // Surrounding text for context
  suggestion?: string;    // Suggested correction
}

interface ValidationWarning {
  type: 'deprecated' | 'non_standard' | 'ambiguous';
  message: string;
  suggestion?: string;
}
```

## Error Recovery

The validator should attempt to continue checking even after finding errors to provide comprehensive feedback:

```typescript
validate("xyz/abc{foo}")
// Returns multiple errors:
// - Unknown unit: xyz
// - Unknown unit: abc
// Rather than stopping at first error
```

## Position Tracking

For helpful error messages, track character positions:

```
Input: "kg..m/s"
       0123456

Error at position 3: Invalid operator sequence '..'
Context: "kg..m"
         ---^^
```

## Common Validation Patterns

### 1. Unit Existence Check
```typescript
if (!units[unitAtom]) {
  errors.push({
    type: 'unknown_unit',
    message: `Unknown unit: ${unitAtom}`,
    suggestion: findSimilarUnit(unitAtom)
  });
}
```

### 2. Prefix Validation
```typescript
if (unit.prefix && !unit.isMetric) {
  errors.push({
    type: 'invalid_prefix',
    message: `Non-metric unit ${unit.atom} cannot have prefix ${unit.prefix}`
  });
}
```

### 3. Annotation Validation
```typescript
if (annotation && !isValidAnnotation(annotation)) {
  errors.push({
    type: 'invalid_annotation',
    message: `Invalid annotation: ${annotation}`,
    context: `{${annotation}}`
  });
}
```

## Validation vs Parsing

| Aspect | Parsing | Validation |
|--------|---------|------------|
| Purpose | Build AST | Check correctness |
| Errors | Throws exceptions | Returns error list |
| Recovery | Stops on first error | Continues checking |
| Output | AST or exception | ValidationResult |
| Usage | Internal processing | User-facing API |

## Best Practices

1. **Be Specific**: Provide clear error messages that explain what's wrong
2. **Be Helpful**: Suggest corrections when possible
3. **Be Complete**: Report all errors, not just the first one
4. **Be Contextual**: Show where in the input the error occurred
5. **Be Forgiving**: Distinguish between errors and warnings

## Example Validation Flow

```typescript
// Input: "kg/s2{acceleration}"

1. Tokenize into parts
2. Check each token:
   - "kg" ✓ Valid unit
   - "/" ✓ Valid operator
   - "s" ✓ Valid unit
   - "2" ✓ Valid exponent
   - "{acceleration}" ✓ Valid annotation
3. Check structure:
   - Binary operation ✓
   - Exponent placement ✓
4. Check semantics:
   - No deprecated units ✓
   - Clear expression ✓

Result: { valid: true, errors: [] }
```

## Integration with Parser

The validator typically wraps the parser:

```typescript
function validate(unit: string): ValidationResult {
  try {
    const ast = parseUnit(unit);
    // Additional validation on AST
    return checkAST(ast);
  } catch (parseError) {
    // Convert parse errors to validation errors
    return convertParseError(parseError);
  }
}
```

## Performance Considerations

- Cache validation results for common units
- Fail fast for obvious syntax errors
- Lazy load suggestion data
- Use efficient string searching algorithms

## Future Enhancements

1. **Fuzzy Matching**: Suggest corrections for typos
2. **Context-Aware Validation**: Different rules for different domains
3. **Custom Rules**: Allow users to add organization-specific validations
4. **Internationalization**: Error messages in multiple languages
5. **Visual Feedback**: Generate visual error indicators for UIs