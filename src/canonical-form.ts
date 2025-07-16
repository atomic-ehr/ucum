import type { DimensionObject } from './dimension';
import type { Expression, BinaryOp, UnaryOp, Unit as UnitNode, Factor, Group } from './parser/ast';
import type { Unit as UnitData } from './units';
import { units, baseUnits } from './units';
import { prefixes } from './prefixes';
import { parseUnit } from './parser';
import { Dimension } from './dimension';

// Types for canonical form representation
export interface CanonicalForm {
  magnitude: number;
  dimension: DimensionObject;
  units: BaseUnitTerm[];
  specialFunction?: SpecialFunction;
}

export interface BaseUnitTerm {
  unit: BaseUnit;
  exponent: number;
}

export type BaseUnit = 'm' | 'g' | 's' | 'rad' | 'K' | 'C' | 'cd';

export interface SpecialFunction {
  name: string;
  value: string;
  unit: string;
}

// Helper functions
function isBaseUnit(unit: string): unit is BaseUnit {
  return unit in baseUnits;
}

function getPrefixValue(prefix: string): number {
  return prefixes[prefix]?.value ?? 1;
}

function getUnitDefinition(unit: string): Expression | null {
  const unitData = units[unit];
  if (!unitData || unitData.isBaseUnit) return null;
  
  // Special units have function notation like "cel(1 K)"
  if (unitData.isSpecial && unitData.value.function) {
    // Parse the unit inside the function (e.g., "1 K" from "cel(1 K)")
    return parseUnit(unitData.value.function.Unit);
  }
  
  // Regular units just have the unit expression
  return parseUnit(unitData.value.Unit);
}

function normalizeUnits(units: BaseUnitTerm[]): BaseUnitTerm[] {
  const unitMap = new Map<BaseUnit, number>();
  for (const term of units) {
    unitMap.set(term.unit, (unitMap.get(term.unit) || 0) + term.exponent);
  }
  return Array.from(unitMap.entries())
    .filter(([_, exp]) => exp !== 0)
    .map(([unit, exponent]) => ({ unit, exponent }))
    .sort((a, b) => a.unit.localeCompare(b.unit));
}

function calculateDimension(units: BaseUnitTerm[]): DimensionObject {
  const dimension: DimensionObject = {};
  const dimensionMap: Record<BaseUnit, keyof DimensionObject> = {
    'm': 'L',
    'g': 'M', 
    's': 'T',
    'rad': 'A',
    'K': 'Θ',
    'C': 'Q',
    'cd': 'F'
  };
  
  for (const term of units) {
    const dimKey = dimensionMap[term.unit];
    if (dimKey && term.exponent !== 0) {
      dimension[dimKey] = term.exponent;
    }
  }
  
  return dimension;
}

function extractSpecialFunction(unitData: UnitData): SpecialFunction | undefined {
  if (unitData.value.function) {
    return {
      name: unitData.value.function.name,
      value: unitData.value.function.value,
      unit: unitData.value.function.Unit
    };
  }
  return undefined;
}

// Process different AST node types
function processExpression(expr: Expression): CanonicalForm {
  switch (expr.type) {
    case 'factor':
      return processFactor(expr);
    case 'unit':
      return processUnit(expr);
    case 'binary':
      return processBinaryOp(expr);
    case 'unary':
      return processUnaryOp(expr);
    case 'group':
      return processGroup(expr);
    default:
      throw new Error(`Unknown expression type: ${(expr as any).type}`);
  }
}

function processFactor(factor: Factor): CanonicalForm {
  return {
    magnitude: factor.value,
    dimension: {},
    units: []
  };
}

function processUnit(unit: UnitNode): CanonicalForm {
  let magnitude = 1;
  let baseUnits: BaseUnitTerm[] = [];
  let specialFunction: SpecialFunction | undefined;
  const unitExponent = unit.exponent || 1;
  
  // Handle prefix - apply exponent to prefix value
  if (unit.prefix) {
    const prefixValue = getPrefixValue(unit.prefix);
    magnitude *= Math.pow(prefixValue, unitExponent);
  }
  
  // Check if it's a base unit
  if (isBaseUnit(unit.atom)) {
    baseUnits.push({ unit: unit.atom, exponent: unitExponent });
  } else {
    // Look up the unit
    const unitData = units[unit.atom];
    if (!unitData) {
      throw new Error(`Unknown unit: ${unit.atom}`);
    }
    
    // Handle special units
    if (unitData.isSpecial) {
      specialFunction = extractSpecialFunction(unitData);
      // Special units still need to be expanded to their base representation
    }
    
    // Handle dimensionless units
    if (unitData.value.Unit === '1') {
      magnitude *= Math.pow(parseFloat(unitData.value.value), unitExponent);
    } else {
      // Expand derived unit
      const definition = getUnitDefinition(unit.atom);
      if (definition) {
        const expanded = processExpression(definition);
        // Also multiply by the unit's numeric value (e.g., hour = 60 minutes)
        // Special units have value "undefined", regular units have numeric values
        const unitValue = unitData.value.value === "undefined" ? 1 : parseFloat(unitData.value.value);
        magnitude *= Math.pow(expanded.magnitude * unitValue, unitExponent);
        
        // Apply the unit's exponent to all base units from the expansion
        baseUnits = expanded.units.map(term => ({
          ...term,
          exponent: term.exponent * unitExponent
        }));
        
        if (!specialFunction && expanded.specialFunction) {
          specialFunction = expanded.specialFunction;
        }
      }
    }
  }
  
  return {
    magnitude,
    dimension: calculateDimension(baseUnits),
    units: baseUnits,
    specialFunction
  };
}

function processBinaryOp(op: BinaryOp): CanonicalForm {
  const left = processExpression(op.left);
  const right = processExpression(op.right);
  
  if (op.operator === '.') {
    // Multiplication
    return {
      magnitude: left.magnitude * right.magnitude,
      dimension: Dimension.multiply(left.dimension, right.dimension),
      units: [...left.units, ...right.units],
      specialFunction: left.specialFunction || right.specialFunction
    };
  } else if (op.operator === '/') {
    // Division - negate right side exponents
    const negatedRightUnits = right.units.map(term => ({
      ...term,
      exponent: -term.exponent
    }));
    return {
      magnitude: left.magnitude / right.magnitude,
      dimension: Dimension.divide(left.dimension, right.dimension),
      units: [...left.units, ...negatedRightUnits],
      specialFunction: left.specialFunction || right.specialFunction
    };
  } else {
    throw new Error(`Unknown operator: ${op.operator}`);
  }
}

function processUnaryOp(op: UnaryOp): CanonicalForm {
  const operand = processExpression(op.operand);
  
  if (op.operator === '/') {
    // Leading division - negate all exponents
    const negatedUnits = operand.units.map(term => ({
      ...term,
      exponent: -term.exponent
    }));
    return {
      magnitude: 1 / operand.magnitude,
      dimension: Dimension.divide({}, operand.dimension),
      units: negatedUnits,
      specialFunction: operand.specialFunction
    };
  } else {
    throw new Error(`Unknown unary operator: ${op.operator}`);
  }
}

function processGroup(group: Group): CanonicalForm {
  return processExpression(group.expression);
}

// Main functions
export function toCanonicalFormFromAST(expr: Expression): CanonicalForm {
  const result = processExpression(expr);
  
  // Normalize the units (combine like terms and sort)
  result.units = normalizeUnits(result.units);
  
  // Recalculate dimension from normalized units
  result.dimension = calculateDimension(result.units);
  
  return result;
}

export function toCanonicalForm(unitExpression: string): CanonicalForm {
  const ast = parseUnit(unitExpression);
  return toCanonicalFormFromAST(ast);
}