// UCUM Library - Unified API

// Import all required dependencies
import { parseUnit } from './parser';
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
import { createUnitInfo, displayUnit } from './unit-display';

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
  info: createUnitInfo,
  display: displayUnit,
  
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