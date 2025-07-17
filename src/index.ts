// UCUM Library - Unified API

// Import all required dependencies
import { parseUnit } from './parser';
import { units } from './units';
import { toCanonicalForm } from './canonical-form';
import { convert, isConvertible } from './conversion';
import { validate } from './validation';
import {
  quantity,
  add,
  subtract,
  multiply,
  divide,
  pow,
  isSpecialUnit,
  isArbitraryUnit
} from './quantity';

// Import types
import type { DimensionObject } from './dimension';
import type { CanonicalForm } from './canonical-form';
import type { ValidationResult } from './validation';
import type { Quantity } from './quantity';
import type { ParseResult } from './parser/types';

// Define interfaces for the unified API
export interface UnitInfo {
  // Basic information
  type: 'base' | 'derived' | 'special' | 'arbitrary' | 'dimensionless';
  code: string;        // Original unit code
  name: string;        // Human-readable name
  printSymbol?: string; // Display symbol
  
  // Classification
  isMetric: boolean;
  isSpecial: boolean;
  isArbitrary: boolean;
  isBase: boolean;
  
  // Properties
  class?: string;      // 'si', 'cgs', 'clinical', etc.
  property?: string;   // 'length', 'mass', 'time', etc.
  
  // Technical details
  dimension: DimensionObject;
  canonical: CanonicalForm;
  
  // For derived units
  definition?: string; // e.g., "N = kg.m/s2"
}

export interface DisplayOptions {
  locale?: string;
  format?: 'symbol' | 'name' | 'long';
}

export interface UCUM {
  // Validation
  validate(unit: string): ValidationResult;
  
  // Conversion
  convert(value: number, from: string, to: string): number;
  isConvertible(from: string, to: string): boolean;
  
  // Quantities
  quantity(value: number, unit: string): Quantity;
  
  // Arithmetic operations
  add(q1: Quantity, q2: Quantity): Quantity;
  subtract(q1: Quantity, q2: Quantity): Quantity;
  multiply(q1: Quantity, q2: Quantity | number): Quantity;
  divide(q1: Quantity, q2: Quantity | number): Quantity;
  pow(q: Quantity, exponent: number): Quantity;
  
  // Unit information
  info(unit: string): UnitInfo;
  display(unit: string, options?: DisplayOptions): string;
  
  // Helper functions
  isSpecialUnit(unit: string): boolean;
  isArbitraryUnit(unit: string): boolean;
}

// Local implementation of info function
function info(unit: string): UnitInfo {
  // Parse the unit to check validity
  const parseResult = parseUnit(unit);
  if (parseResult.errors.length > 0) {
    throw new Error(`Invalid unit: ${unit}`);
  }
  
  // Get canonical form
  const canonical = toCanonicalForm(unit);
  
  // Try to find unit data (works for simple units)
  const unitData = units[unit];
  
  // Determine type
  let type: UnitInfo['type'] = 'derived';
  if (unitData?.isBaseUnit) {
    type = 'base';
  } else if (canonical.specialFunction) {
    type = 'special';
  } else if (unitData?.property === 'arbitrary' || isArbitraryUnit(unit)) {
    type = 'arbitrary';
  } else if (Object.keys(canonical.dimension).length === 0) {
    type = 'dimensionless';
  }
  
  // Build info object
  return {
    type,
    code: unit,
    name: unitData?.name || unit,
    printSymbol: unitData?.printSymbol,
    isMetric: unitData?.isMetric ?? true,
    isSpecial: !!canonical.specialFunction,
    isArbitrary: unitData?.property === 'arbitrary' || isArbitraryUnit(unit),
    isBase: unitData?.isBaseUnit ?? false,
    class: unitData?.class,
    property: unitData?.property,
    dimension: canonical.dimension,
    canonical,
    definition: unitData?.value?.Unit !== '1' ? unitData?.value?.Unit : undefined
  };
}

// Local implementation of display function
function display(unit: string, options?: DisplayOptions): string {
  // Strip annotations
  const cleanUnit = unit.replace(/\{[^}]*\}/g, '');
  
  // For now, implement basic display logic
  // TODO: Add full locale support and unit name expansion
  
  if (options?.format === 'name' || options?.format === 'long') {
    // Try to expand common units
    const unitNames: Record<string, string> = {
      'm': 'meter',
      'kg': 'kilogram',
      's': 'second',
      'min': 'minute',
      'h': 'hour',
      'd': 'day',
      'L': 'liter',
      'mL': 'milliliter',
      'g': 'gram',
      'mg': 'milligram',
      'N': 'newton',
      'Pa': 'pascal',
      'J': 'joule',
      'W': 'watt',
      'Cel': 'degree Celsius',
      'K': 'kelvin',
      '[degF]': 'degree Fahrenheit'
    };
    
    // Handle simple units
    if (unitNames[cleanUnit]) {
      return unitNames[cleanUnit];
    }
    
    // Handle compound units with basic parsing
    if (cleanUnit.includes('/')) {
      const parts = cleanUnit.split('/');
      const numerator = parts[0];
      const denominator = parts.slice(1).join('/');
      
      const numName = numerator && unitNames[numerator] ? unitNames[numerator] : numerator;
      const denomName = denominator && unitNames[denominator] ? unitNames[denominator] : denominator;
      
      return `${numName} per ${denomName}`;
    }
    
    // Handle squared/cubed units
    const match = cleanUnit.match(/^(\w+)(\d+)$/);
    if (match) {
      const base = match[1];
      const exponent = match[2];
      const baseName = base && unitNames[base] ? unitNames[base] : base;
      
      if (exponent === '2') return `square ${baseName}`;
      if (exponent === '3') return `cubic ${baseName}`;
      return `${baseName} to the power of ${exponent}`;
    }
  }
  
  return cleanUnit;
}

// Main unified API
export const ucum: UCUM = {
  // Validation
  validate,
  
  // Conversion
  convert,
  isConvertible,
  
  // Quantities
  quantity,
  add,
  subtract,
  multiply,
  divide,
  pow,
  
  // Unit information
  info,
  display,
  
  // Helper functions
  isSpecialUnit,
  isArbitraryUnit,
};

// Default export
export default ucum;

// Export only necessary types
export type {
  Quantity,
  ValidationResult,
  CanonicalForm,
  DimensionObject,
  ParseResult
};

// Export advanced functions for power users
export { parseUnit, toCanonicalForm };