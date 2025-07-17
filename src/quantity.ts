import type { DimensionObject } from './dimension';
import type { CanonicalForm } from './canonical-form';
import { toCanonicalForm } from './canonical-form';
import { convert, ConversionError, IncompatibleDimensionsError } from './conversion';
import { Dimension } from './dimension';
import { units } from './units';
import { parseUnit } from './parser';

// Quantity type representing a value with a unit
export interface Quantity {
  value: number;
  unit: string;
  _canonicalForm?: CanonicalForm; // Cached for performance
}

// Error types for quantity operations
export class SpecialUnitArithmeticError extends Error {
  constructor(unit: string, operation: string) {
    super(`Cannot perform ${operation} on special unit: ${unit}`);
    this.name = 'SpecialUnitArithmeticError';
  }
}

export class ArbitraryUnitConversionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot convert between arbitrary units: ${from} and ${to}`);
    this.name = 'ArbitraryUnitConversionError';
  }
}

// Helper functions for unit classification
export function isSpecialUnit(unit: string): boolean {
  try {
    const canonical = toCanonicalForm(unit);
    return canonical.specialFunction !== undefined;
  } catch {
    return false;
  }
}

function checkArbitraryInExpression(expr: any): boolean {
  if (!expr) return false;
  
  switch (expr.type) {
    case 'unit':
      // Check the atom directly
      const unitData = units[expr.atom];
      return unitData?.property === 'arbitrary';
      
    case 'binary':
      return checkArbitraryInExpression(expr.left) || checkArbitraryInExpression(expr.right);
      
    case 'unary':
      return checkArbitraryInExpression(expr.operand);
      
    case 'group':
      return checkArbitraryInExpression(expr.content);
      
    default:
      return false;
  }
}

export function isArbitraryUnit(unit: string): boolean {
  try {
    // First check if the unit itself is in the database
    const unitData = units[unit];
    if (unitData?.property === 'arbitrary') {
      return true;
    }
    
    // For complex expressions, parse and check the AST
    const parseResult = parseUnit(unit);
    if (parseResult.ast) {
      return checkArbitraryInExpression(parseResult.ast);
    }
    return false;
  } catch {
    return false;
  }
}

export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  try {
    const canonical1 = toCanonicalForm(unit1);
    const canonical2 = toCanonicalForm(unit2);
    return Dimension.equals(canonical1.dimension, canonical2.dimension);
  } catch {
    return false;
  }
}

// Factory function to create a Quantity
export function quantity(value: number, unit: string): Quantity {
  // Validate the unit by trying to parse it and get canonical form
  try {
    // This will validate against the units database
    toCanonicalForm(unit);
  } catch (error) {
    throw new ConversionError(`Invalid unit: ${unit}`);
  }
  
  return {
    value,
    unit
  };
}

// Get canonical form with caching
function getCanonicalForm(q: Quantity): CanonicalForm {
  if (!q._canonicalForm) {
    q._canonicalForm = toCanonicalForm(q.unit);
  }
  return q._canonicalForm;
}

// Addition
export function add(q1: Quantity, q2: Quantity): Quantity {
  // Check for special units
  if (isSpecialUnit(q1.unit) || isSpecialUnit(q2.unit)) {
    throw new SpecialUnitArithmeticError(
      isSpecialUnit(q1.unit) ? q1.unit : q2.unit,
      'addition'
    );
  }
  
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  if (isArb1 || isArb2) {
    // Both must be the same arbitrary unit
    if (q1.unit !== q2.unit) {
      throw new ArbitraryUnitConversionError(q1.unit, q2.unit);
    }
    // Same arbitrary unit - can add
    return quantity(q1.value + q2.value, q1.unit);
  }
  
  // Check dimensional compatibility
  if (!areUnitsCompatible(q1.unit, q2.unit)) {
    const dim1 = getCanonicalForm(q1).dimension;
    const dim2 = getCanonicalForm(q2).dimension;
    throw new IncompatibleDimensionsError(q1.unit, q2.unit, dim1, dim2);
  }
  
  // Convert q2 to q1's unit and add
  const q2InQ1Units = convert(q2.value, q2.unit, q1.unit);
  return quantity(q1.value + q2InQ1Units, q1.unit);
}

// Subtraction
export function subtract(q1: Quantity, q2: Quantity): Quantity {
  // Check for special units
  if (isSpecialUnit(q1.unit) || isSpecialUnit(q2.unit)) {
    throw new SpecialUnitArithmeticError(
      isSpecialUnit(q1.unit) ? q1.unit : q2.unit,
      'subtraction'
    );
  }
  
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  if (isArb1 || isArb2) {
    // Both must be the same arbitrary unit
    if (q1.unit !== q2.unit) {
      throw new ArbitraryUnitConversionError(q1.unit, q2.unit);
    }
    // Same arbitrary unit - can subtract
    return quantity(q1.value - q2.value, q1.unit);
  }
  
  // Check dimensional compatibility
  if (!areUnitsCompatible(q1.unit, q2.unit)) {
    const dim1 = getCanonicalForm(q1).dimension;
    const dim2 = getCanonicalForm(q2).dimension;
    throw new IncompatibleDimensionsError(q1.unit, q2.unit, dim1, dim2);
  }
  
  // Convert q2 to q1's unit and subtract
  const q2InQ1Units = convert(q2.value, q2.unit, q1.unit);
  return quantity(q1.value - q2InQ1Units, q1.unit);
}

// Multiplication
export function multiply(q1: Quantity, q2: Quantity | number): Quantity {
  // Handle scalar multiplication
  if (typeof q2 === 'number') {
    return quantity(q1.value * q2, q1.unit);
  }
  
  // Check for special units
  if (isSpecialUnit(q1.unit) || isSpecialUnit(q2.unit)) {
    throw new SpecialUnitArithmeticError(
      isSpecialUnit(q1.unit) ? q1.unit : q2.unit,
      'multiplication'
    );
  }
  
  // Check for arbitrary units - result is arbitrary if any operand is
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  // Multiply values
  const resultValue = q1.value * q2.value;
  
  // Combine units
  let resultUnit: string;
  if (q1.unit === '1' && q2.unit === '1') {
    resultUnit = '1';
  } else if (q1.unit === '1') {
    resultUnit = q2.unit;
  } else if (q2.unit === '1') {
    resultUnit = q1.unit;
  } else {
    // Create compound unit
    resultUnit = `${q1.unit}.${q2.unit}`;
  }
  
  return quantity(resultValue, resultUnit);
}

// Division
export function divide(q1: Quantity, q2: Quantity | number): Quantity {
  // Handle scalar division
  if (typeof q2 === 'number') {
    if (q2 === 0) {
      throw new Error('Division by zero');
    }
    return quantity(q1.value / q2, q1.unit);
  }
  
  // Check for division by zero
  if (q2.value === 0) {
    throw new Error('Division by zero');
  }
  
  // Check for special units
  if (isSpecialUnit(q1.unit) || isSpecialUnit(q2.unit)) {
    throw new SpecialUnitArithmeticError(
      isSpecialUnit(q1.unit) ? q1.unit : q2.unit,
      'division'
    );
  }
  
  // Check for arbitrary units - result is arbitrary if any operand is
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  // Divide values
  const resultValue = q1.value / q2.value;
  
  // Combine units
  let resultUnit: string;
  if (q1.unit === q2.unit) {
    // Units cancel out
    resultUnit = '1';
  } else if (q2.unit === '1') {
    resultUnit = q1.unit;
  } else if (q1.unit === '1') {
    // Inverse of q2 unit
    resultUnit = `/${q2.unit}`;
  } else {
    // Create compound unit
    resultUnit = `${q1.unit}/${q2.unit}`;
  }
  
  return quantity(resultValue, resultUnit);
}

// Power
export function pow(q: Quantity, exponent: number): Quantity {
  // Check for special units
  if (isSpecialUnit(q.unit)) {
    throw new SpecialUnitArithmeticError(q.unit, 'exponentiation');
  }
  
  // Check for arbitrary units
  if (isArbitraryUnit(q.unit)) {
    throw new SpecialUnitArithmeticError(q.unit, 'exponentiation');
  }
  
  // Handle special cases
  if (exponent === 0) {
    return quantity(1, '1');
  }
  if (exponent === 1) {
    return quantity(q.value, q.unit);
  }
  
  // Calculate result value
  const resultValue = Math.pow(q.value, exponent);
  
  // Calculate result unit
  let resultUnit: string;
  if (q.unit === '1') {
    resultUnit = '1';
  } else {
    resultUnit = `${q.unit}${exponent}`;
  }
  
  return quantity(resultValue, resultUnit);
}

// Comparison operations
export function equals(q1: Quantity, q2: Quantity, tolerance: number = 1e-10): boolean {
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  if (isArb1 || isArb2) {
    // Can only compare same arbitrary units
    if (q1.unit !== q2.unit) {
      return false;
    }
    return Math.abs(q1.value - q2.value) < tolerance;
  }
  
  // Check dimensional compatibility
  if (!areUnitsCompatible(q1.unit, q2.unit)) {
    return false;
  }
  
  // Convert and compare
  try {
    const q2InQ1Units = convert(q2.value, q2.unit, q1.unit);
    return Math.abs(q1.value - q2InQ1Units) < tolerance;
  } catch {
    return false;
  }
}

export function lessThan(q1: Quantity, q2: Quantity): boolean {
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q1.unit);
  const isArb2 = isArbitraryUnit(q2.unit);
  
  if (isArb1 || isArb2) {
    // Can only compare same arbitrary units
    if (q1.unit !== q2.unit) {
      throw new ArbitraryUnitConversionError(q1.unit, q2.unit);
    }
    return q1.value < q2.value;
  }
  
  // Check dimensional compatibility
  if (!areUnitsCompatible(q1.unit, q2.unit)) {
    const dim1 = getCanonicalForm(q1).dimension;
    const dim2 = getCanonicalForm(q2).dimension;
    throw new IncompatibleDimensionsError(q1.unit, q2.unit, dim1, dim2);
  }
  
  // Convert and compare
  const q2InQ1Units = convert(q2.value, q2.unit, q1.unit);
  return q1.value < q2InQ1Units;
}

export function greaterThan(q1: Quantity, q2: Quantity): boolean {
  return lessThan(q2, q1);
}

export function lessThanOrEqual(q1: Quantity, q2: Quantity): boolean {
  return !greaterThan(q1, q2);
}

export function greaterThanOrEqual(q1: Quantity, q2: Quantity): boolean {
  return !lessThan(q1, q2);
}

// Utility functions
export function toUnit(q: Quantity, targetUnit: string): Quantity {
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q.unit);
  const isArb2 = isArbitraryUnit(targetUnit);
  
  if (isArb1 && isArb2) {
    // Both are arbitrary - must be the same unit
    if (q.unit !== targetUnit) {
      throw new ArbitraryUnitConversionError(q.unit, targetUnit);
    }
    // Same unit, no conversion needed
    return quantity(q.value, q.unit);
  } else if (isArb1 || isArb2) {
    // One is arbitrary, one is not - cannot convert
    throw new ArbitraryUnitConversionError(q.unit, targetUnit);
  }
  
  // Use existing conversion logic
  const convertedValue = convert(q.value, q.unit, targetUnit);
  return quantity(convertedValue, targetUnit);
}

export function getValue(q: Quantity, inUnit?: string): number {
  if (!inUnit || inUnit === q.unit) {
    return q.value;
  }
  
  // Check for arbitrary units
  const isArb1 = isArbitraryUnit(q.unit);
  const isArb2 = isArbitraryUnit(inUnit);
  
  if (isArb1 || isArb2) {
    if (q.unit !== inUnit) {
      throw new ArbitraryUnitConversionError(q.unit, inUnit);
    }
    return q.value;
  }
  
  return convert(q.value, q.unit, inUnit);
}

export function areCompatible(q1: Quantity, q2: Quantity): boolean {
  return areUnitsCompatible(q1.unit, q2.unit);
}

export function getDimension(q: Quantity): DimensionObject {
  return getCanonicalForm(q).dimension;
}