# ADR-003: AST Representation

## Status

Proposed

## Context

The UCUM parser needs an Abstract Syntax Tree (AST) representation for parsed unit expressions. The AST must balance between:
- Faithfulness to the grammar structure
- Ease of traversal and transformation
- Support for error reporting with source locations
- Efficiency for semantic analysis and calculations

## Decision

Use a simplified expression tree that flattens the grammar hierarchy while preserving operator precedence and structure.

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
  exponentFormat?: '^' | '+' | '';  // How exponent was written
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

### Design Rationale: Annotations

Annotations are not separate nodes but attributes on Unit and Factor nodes because:
- Annotations attach to the preceding unit: `mg{total}` is one semantic unit
- Standalone annotations like `{RBC}` are represented as Factor with value=1
- This simplifies the AST while preserving all information

### Design Rationale: Factors

Factors remain separate nodes rather than attributes because:
- They are semantically different from units (dimensionless numbers)
- They can appear independently in expressions: `10.m` or `10*6/mL`
- Keeping them separate makes AST traversal clearer

### Design Rationale: Groups

Group nodes preserve parentheses from the source:
- Essential for correct operator precedence
- `m/(s.s)` differs from `m/s.s` in evaluation order
- Preserves user intent and enables accurate error messages

## Consequences

### Positive

- Simpler than direct grammar mapping but preserves parse structure
- Natural representation for operator precedence
- Easy to traverse recursively
- Can be transformed to semantic representation for calculations
- Supports source location tracking (can add location field to each node)

### Negative

- Requires transformation step for semantic operations
- Not a direct 1:1 mapping with grammar rules
- May need visitor pattern for complex traversals
- Not optimized for conversions (requires additional resolution and normalization steps)

## Conversion Considerations

This AST is **syntax-focused**, not **conversion-focused**. For unit conversions, we need a transformation pipeline:

1. **Parse AST** (this ADR) - Syntax tree with string atoms and prefixes
2. **Resolved AST** - Replace strings with unit/prefix objects containing scale factors and dimensions
3. **Normalized Form** - Flatten to numerator/denominator arrays with combined scale
4. **Canonical Form** - Reduce to dimension vector for compatibility checking

This separation keeps the parser simple while enabling conversions through well-defined transformation stages.

## Alternatives Considered

### 1. Direct Grammar Mapping
Map each grammar rule to a node type (MainTermNode, TermNode, ComponentNode, etc.)

**Rejected because:** Too complex to traverse, mirrors grammar structure too closely without adding value.

### 2. Semantic AST
Immediate normalization to numerator/denominator representation:
```typescript
interface UnitExpression {
  numerator: UnitComponent[];
  denominator: UnitComponent[];
}
```

**Rejected because:** Loses syntactic information needed for error reporting and doesn't match parsing flow.

### 3. Hybrid Approach
Keep both syntax tree and semantic representation.

**Rejected because:** Adds complexity without clear benefit for initial implementation. Can be added later if needed.

## Examples

Expression `mg/dL` parses to:
```typescript
{
  type: 'binary',
  operator: '/',
  left: { type: 'unit', prefix: 'm', atom: 'g' },
  right: { type: 'unit', prefix: 'd', atom: 'L' }
}
```

Expression `m.s-2` parses to:
```typescript
{
  type: 'binary',
  operator: '.',
  left: { type: 'unit', atom: 'm' },
  right: { type: 'unit', atom: 's', exponent: -2 }
}
```

Expression `mg{total}/dL` parses to:
```typescript
{
  type: 'binary',
  operator: '/',
  left: { type: 'unit', prefix: 'm', atom: 'g', annotation: 'total' },
  right: { type: 'unit', prefix: 'd', atom: 'L' }
}
```

Expression `{RBC}` parses to:
```typescript
{
  type: 'factor',
  value: 1,
  annotation: 'RBC'
}
```

Expression `10.m` parses to:
```typescript
{
  type: 'binary',
  operator: '.',
  left: { type: 'factor', value: 10 },
  right: { type: 'unit', atom: 'm' }
}
```

Expression `m/(s.s)` parses to:
```typescript
{
  type: 'binary',
  operator: '/',
  left: { type: 'unit', atom: 'm' },
  right: {
    type: 'group',
    expression: {
      type: 'binary',
      operator: '.',
      left: { type: 'unit', atom: 's' },
      right: { type: 'unit', atom: 's' }
    }
  }
}
```