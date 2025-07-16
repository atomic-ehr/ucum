import type { DimensionObject } from './dimension';
import type { CanonicalForm } from './canonical-form';
import { toCanonicalForm } from './canonical-form';
import { Dimension } from './dimension';

// Error types for better error handling
export class ConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversionError';
  }
}

export class IncompatibleDimensionsError extends ConversionError {
  constructor(
    fromUnit: string, 
    toUnit: string, 
    fromDim: DimensionObject, 
    toDim: DimensionObject
  ) {
    const fromDimStr = Dimension.toString(fromDim);
    const toDimStr = Dimension.toString(toDim);
    super(
      `Cannot convert from ${fromUnit} to ${toUnit}: incompatible dimensions (${fromDimStr} vs ${toDimStr})`
    );
    this.name = 'IncompatibleDimensionsError';
  }
}

// Helper functions for special unit detection
function isSpecialUnit(canonical: CanonicalForm): boolean {
  return canonical.specialFunction !== undefined;
}

function hasSpecialUnits(from: CanonicalForm, to: CanonicalForm): boolean {
  return isSpecialUnit(from) || isSpecialUnit(to);
}

// Main conversion function
export function convert(value: number, fromUnit: string, toUnit: string): number {
  // Parse units to canonical form
  let fromCanonical: CanonicalForm;
  let toCanonical: CanonicalForm;
  
  try {
    fromCanonical = toCanonicalForm(fromUnit);
  } catch (error) {
    throw new ConversionError(`Invalid source unit: ${fromUnit}`);
  }
  
  try {
    toCanonical = toCanonicalForm(toUnit);
  } catch (error) {
    throw new ConversionError(`Invalid target unit: ${toUnit}`);
  }
  
  // Check commensurability (same dimensions)
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new IncompatibleDimensionsError(
      fromUnit,
      toUnit,
      fromCanonical.dimension,
      toCanonical.dimension
    );
  }
  
  // Phase 1: Throw error for special units
  if (hasSpecialUnits(fromCanonical, toCanonical)) {
    throw new ConversionError(
      `Special unit conversion not yet implemented`
    );
  }
  
  // Linear conversion: multiply by ratio of magnitudes
  const factor = fromCanonical.magnitude / toCanonical.magnitude;
  return value * factor;
}

// Convenience functions
export function isConvertible(fromUnit: string, toUnit: string): boolean {
  try {
    const fromCanonical = toCanonicalForm(fromUnit);
    const toCanonical = toCanonicalForm(toUnit);
    
    // Check dimensions match
    if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
      return false;
    }
    
    // In Phase 1, special units are not convertible
    if (hasSpecialUnits(fromCanonical, toCanonical)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function getConversionFactor(fromUnit: string, toUnit: string): number {
  const fromCanonical = toCanonicalForm(fromUnit);
  const toCanonical = toCanonicalForm(toUnit);
  
  if (!Dimension.equals(fromCanonical.dimension, toCanonical.dimension)) {
    throw new IncompatibleDimensionsError(
      fromUnit,
      toUnit,
      fromCanonical.dimension,
      toCanonical.dimension
    );
  }
  
  if (hasSpecialUnits(fromCanonical, toCanonical)) {
    throw new ConversionError(
      `Cannot get linear conversion factor for special units`
    );
  }
  
  return fromCanonical.magnitude / toCanonical.magnitude;
}