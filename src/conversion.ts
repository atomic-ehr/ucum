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

// Get the base special unit's magnitude (without any prefix)
function getBaseSpecialUnitMagnitude(specialFunctionName: string): number {
  // Base special units and their magnitudes in canonical form
  // These are the magnitudes that appear in the canonical form for the base unit (no prefix)
  const baseSpecialMagnitudes: Record<string, number> = {
    'Cel': 1,                // Celsius: canonical magnitude = 1
    'degF': 0.5555555555555556, // Fahrenheit: 5/9 ≈ 0.5556
    'degRe': 1.25,           // Réaumur: 5/4 = 1.25
    'pH': 1e-9,              // pH: mol/L reference, canonical magnitude = 1e-9
    'ln': 1,                 // Natural log (Neper)
    'lg': 1,                 // Common log (Bel)
    'lgTimes2': 1,           // 2*log10 (B[SPL], B[V], etc.) - varies by reference unit
    'ld': 1,                 // Binary log (bit)
    'hpX': 1,                // Homeopathic decimal
    'hpC': 1,                // Homeopathic centesimal
    'hpM': 1,                // Homeopathic millesimal
    'hpQ': 1,                // Homeopathic quintamillesimal
    'tanTimes100': 1,        // Prism diopter  
    '100tan': 0.017453292519943295, // Percent slope: deg canonical magnitude
    'sqrt': 1                // Square root
  };
  
  return baseSpecialMagnitudes[specialFunctionName] || 1;
}

// Calculate scale factor for special units that can have prefixes
function getScaleFactor(canonical: CanonicalForm): number {
  if (!canonical.specialFunction) return 1;
  
  // Only certain special units can have prefixes (isMetric="yes" in UCUM)
  const metricSpecialUnits = ['Cel', 'ln', 'lg', 'lgTimes2', 'ld'];
  
  if (!metricSpecialUnits.includes(canonical.specialFunction.name)) {
    return 1; // Non-metric special units can't have prefixes
  }
  
  // For metric special units, we need to be careful about detecting prefixes
  // The challenge is that some special units like B[W] have non-1 magnitudes
  // due to their reference units, not due to prefixes
  
  // For temperature (Cel), the base magnitude is always 1
  if (canonical.specialFunction.name === 'Cel' && Math.abs(canonical.magnitude - 1) > 1e-10) {
    return canonical.magnitude; // This is a prefix like mCel
  }
  
  // For logarithmic units (lg, ln, ld), only B, Np, and bit_s have magnitude 1 as base
  // B[W], B[SPL], etc. have different magnitudes due to their reference units
  if (canonical.specialFunction.name === 'lg') {
    // Only plain B has magnitude 1, prefixed versions like dB have 0.1
    if (canonical.magnitude === 1) return 1; // Plain B
    if (Math.abs(canonical.magnitude - 0.1) < 1e-10) return 0.1; // dB
    if (Math.abs(canonical.magnitude - 0.01) < 1e-10) return 0.01; // cB
    // B[W], B[SPL] etc. have other magnitudes - don't treat as prefixed
    return 1;
  }
  
  if (canonical.specialFunction.name === 'ln') {
    // Neper and its prefixed versions
    if (canonical.magnitude === 1) return 1; // Plain Np
    if (Math.abs(canonical.magnitude - 0.001) < 1e-10) return 0.001; // mNp
    return 1;
  }
  
  if (canonical.specialFunction.name === 'ld') {
    // bit_s and its prefixed versions
    if (canonical.magnitude === 1) return 1; // Plain bit_s
    return 1;
  }
  
  // For lgTimes2 (B[SPL], B[V], etc.), the magnitude varies with reference unit
  // So we can't use this approach - just return 1 for now
  
  return 1;
}

// Convert between units with special functions
function convertWithSpecialFunctions(
  value: number,
  fromCanonical: CanonicalForm,
  toCanonical: CanonicalForm
): number {
  let result = value;
  
  // Extract scale factors for prefixed special units
  const fromScale = getScaleFactor(fromCanonical);
  const toScale = getScaleFactor(toCanonical);
  
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
    
    // Apply inverse function with scale: m = f_s⁻¹(α × r_s) × u
    // where r_s is our input value and α is fromScale
    result = fn.inverse(fromScale * result);
    
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
    // Also skip if this is a prefixed special unit (scale factor != 1)
    if (!fromCanonical.specialFunction.name.includes('deg') && 
        fromCanonical.specialFunction.name !== 'Cel' &&
        fromCanonical.specialFunction.name !== 'degRe' &&
        fromScale === 1) {
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
    
    // Apply forward function with scale: r_s = f_s(m/u) / α
    // where result is m/u and we divide by α (toScale) to get r_s
    result = fn.forward(result) / toScale;
    
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