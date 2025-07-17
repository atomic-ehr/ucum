import type { DimensionObject } from './dimension';
import type { CanonicalForm } from './canonical-form';
import { toCanonicalForm } from './canonical-form';
import { Dimension } from './dimension';
import { getSpecialFunction } from './special-functions';

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

// Get the base unit magnitude without the special function scale factor
function getBaseUnitMagnitude(canonical: CanonicalForm): number {
  if (!canonical.specialFunction) {
    return canonical.magnitude;
  }
  
  // For special units, the magnitude in the canonical form already includes
  // the base unit conversion. We just need to return it.
  // The scale factor (if any) comes from prefixes, not from the special function itself.
  return canonical.magnitude;
}

// Convert between units with special functions
function convertWithSpecialFunctions(
  value: number,
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  let result = value;
  
  // For now, we'll implement scale factor support later
  // Focus on getting the basic special function conversions working
  const fromScale = 1;
  const toScale = 1;
  
  // Step 1: Convert FROM special unit to proper unit
  if (fromCanonical.specialFunction) {
    const fn = getSpecialFunction(fromCanonical.specialFunction.name);
    if (!fn) {
      throw new ConversionError(
        `Unknown special function: ${fromCanonical.specialFunction.name}`
      );
    }
    
    // Check output domain for the special unit value
    if (fn.outputDomain && !fn.outputDomain(result)) {
      throw new ConversionError(
        `Value ${result} is outside the valid domain for ${fn.name}`
      );
    }
    
    // Apply inverse function to get value in proper units
    result = fn.inverse(result);
    
    // Check that the result is valid for the proper unit
    if (fn.inputDomain && !fn.inputDomain(result)) {
      throw new ConversionError(
        `Conversion result ${result} is outside the valid domain for the proper unit`
      );
    }
  }
  
  // Step 2: Linear conversion between proper units
  if (!fromCanonical.specialFunction && !toCanonical.specialFunction) {
    // Regular linear conversion
    result = result * (fromCanonical.magnitude / toCanonical.magnitude);
  } else if (fromCanonical.specialFunction && !toCanonical.specialFunction) {
    // Converting from special unit to regular unit
    // The result from the inverse function is in the reference unit
    // We need to convert from reference unit to target unit
    // But not for temperature functions where the magnitude is part of the definition
    if (!fromCanonical.specialFunction.name.includes('deg') && 
        fromCanonical.specialFunction.name !== 'Cel' &&
        fromCanonical.specialFunction.name !== 'degRe') {
      result = result * (fromCanonical.magnitude / toCanonical.magnitude);
    }
  } else if (!fromCanonical.specialFunction && toCanonical.specialFunction) {
    // Converting from regular unit to special unit
    // We need to convert to the reference unit first
    // But only if the dimensions match (not for temperature conversions)
    if (fromCanonical.magnitude !== toCanonical.magnitude) {
      // Don't apply magnitude conversion for temperature-like conversions
      // where the special function handles everything
      const fromDim = JSON.stringify(fromCanonical.dimension);
      const toDim = JSON.stringify(toCanonical.dimension);
      if (fromDim === toDim && !toCanonical.specialFunction.name.includes('deg') && 
          toCanonical.specialFunction.name !== 'Cel') {
        result = result * (fromCanonical.magnitude / toCanonical.magnitude);
      }
    }
  }
  // If both are special units, no linear conversion is needed
  
  // Step 3: Convert TO special unit from proper unit
  if (toCanonical.specialFunction) {
    const fn = getSpecialFunction(toCanonical.specialFunction.name);
    if (!fn) {
      throw new ConversionError(
        `Unknown special function: ${toCanonical.specialFunction.name}`
      );
    }
    
    // Check if the value is in the valid input domain for the forward function
    if (fn.inputDomain && !fn.inputDomain(result)) {
      throw new ConversionError(
        `Value ${result} is outside the valid domain for ${fn.name}`
      );
    }
    
    // Apply forward function to get value in special unit
    result = fn.forward(result);
    
    // Check output domain
    if (fn.outputDomain && !fn.outputDomain(result)) {
      throw new ConversionError(
        `Result ${result} is outside the valid output range for ${fn.name}`
      );
    }
  }
  
  return result;
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
  
  // Handle special function conversion
  if (hasSpecialUnits(fromCanonical, toCanonical)) {
    return convertWithSpecialFunctions(value, fromCanonical, toCanonical);
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
    
    // Special units are now convertible!
    
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