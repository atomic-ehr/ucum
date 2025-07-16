import type { ParseError, ParseWarning } from './parser/types';
import type { Expression, Unit, BinaryOp, UnaryOp, Factor, Group } from './parser/ast';
import { parseUnit } from './parser';
import { units } from './units';
import { prefixes } from './prefixes';

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
      suggestion: undefined
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
      // Just check for annotation validity
      if (node.annotation && !isValidAnnotation(node.annotation)) {
        errors.push({
          type: 'invalid_annotation',
          message: `Invalid characters in annotation: ${node.annotation}`
        });
      }
      break;
  }
}

function validateUnit(
  unit: Unit,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Check if unit exists
  const unitData = units[unit.atom];
  if (!unitData) {
    errors.push({
      type: 'unknown_unit',
      message: `Unknown unit: ${unit.atom}`,
      suggestion: findSimilarUnit(unit.atom)
    });
    return; // Skip further validation if unit doesn't exist
  }
  
  // Check prefix validity
  if (unit.prefix) {
    validatePrefix(unit, unitData, errors);
  }
  
  // Check annotation validity
  if (unit.annotation && !isValidAnnotation(unit.annotation)) {
    errors.push({
      type: 'invalid_annotation',
      message: `Invalid characters in annotation: ${unit.annotation}`
    });
  }
  
  // Check for deprecated units
  checkDeprecated(unit, warnings);
}

function validatePrefix(unit: Unit, unitData: any, errors: ValidationError[]): void {
  if (!unitData.isMetric && unit.prefix) {
    errors.push({
      type: 'invalid_prefix',
      message: `Non-metric unit '${unit.atom}' cannot have prefix '${unit.prefix}'`
    });
  }
}

function checkDeprecated(unit: Unit, warnings: ValidationWarning[]): void {
  // According to UCUM spec, ppb and ppt are internationally ambiguous
  // The bracketed forms [ppb] and [pptr] exist but should warn about ambiguity
  const ambiguousUnits: Record<string, string> = {
    '[ppb]': 'parts per billion - ambiguous internationally (10^9 in US, 10^12 in some countries)',
    '[pptr]': 'parts per trillion - ambiguous internationally'
  };
  
  const message = ambiguousUnits[unit.atom];
  if (message) {
    warnings.push({
      type: 'deprecated',
      message,
      suggestion: 'Consider using explicit notation like 10*-9 or nmol/mol'
    });
  }
}

function isValidAnnotation(annotation: string): boolean {
  // Annotations can contain any printable characters except curly braces
  // Based on UCUM spec
  return !/[{}]/.test(annotation);
}

function findSimilarUnit(atom: string): string | undefined {
  // Simple fuzzy matching for common typos
  const allUnits = Object.keys(units);
  const lowercaseAtom = atom.toLowerCase();
  
  // Exact case-insensitive match
  const exactMatch = allUnits.find(u => u.toLowerCase() === lowercaseAtom);
  if (exactMatch && exactMatch !== atom) {
    return exactMatch;
  }
  
  // Common typo patterns
  const suggestions: Record<string, string> = {
    'ml': 'mL',
    'ML': 'mL',
    'Ml': 'mL',
    'l': 'L',
    'metre': 'm',
    'meter': 'm',
    'gram': 'g',
    'grams': 'g',
    'second': 's',
    'seconds': 's',
    'minute': 'min',
    'minutes': 'min',
    'hour': 'h',
    'hours': 'h',
    'day': 'd',
    'days': 'd',
    'celsius': 'Cel',
    'fahrenheit': '[degF]',
    'kelvin': 'K'
  };
  
  if (lowercaseAtom in suggestions) {
    return suggestions[lowercaseAtom];
  }
  
  // Check for single character difference (edit distance = 1)
  for (const unit of allUnits) {
    if (editDistance(atom, unit) === 1) {
      return unit;
    }
  }
  
  return undefined;
}

// Simple edit distance for single character differences
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2;
  
  let differences = 0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  let j = 0;
  for (let i = 0; i < longer.length; i++) {
    if (j < shorter.length && longer[i] === shorter[j]) {
      j++;
    } else {
      differences++;
      if (differences > 1) return differences;
      // For substitution, advance both pointers
      if (longer.length === shorter.length) j++;
    }
  }
  
  return differences;
}