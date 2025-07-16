// Main exports for the UCUM library

// Parser
export { parseUnit } from './parser';
export type { Expression, Unit, Factor, BinaryOp, UnaryOp, Group } from './parser/ast';

// Units database
export { units, baseUnits } from './units';
export type { Unit as UnitData } from './units';

// Prefixes
export { prefixes } from './prefixes';
export type { Prefix } from './prefixes';

// Dimensions
export { Dimension, Dimensions } from './dimension';
export type { DimensionObject } from './dimension';

// Canonical form
export { toCanonicalForm, toCanonicalFormFromAST } from './canonical-form';
export type { CanonicalForm, BaseUnitTerm, BaseUnit, SpecialFunction } from './canonical-form';

// Unit conversion
export { 
  convert, 
  isConvertible, 
  getConversionFactor,
  ConversionError,
  IncompatibleDimensionsError
} from './conversion';