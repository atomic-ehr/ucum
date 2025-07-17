import type { UnitInfo, DisplayOptions } from './index';
import type { Expression, Unit, BinaryOp, UnaryOp, Group, Factor } from './parser/ast';
import type { ParseResult } from './parser/types';
import { parseUnit } from './parser';
import { units } from './units';
import { prefixes } from './prefixes';
import { toCanonicalForm } from './canonical-form';
import { isArbitraryUnit } from './quantity';

// Enhanced unit name data structure
interface UnitNameData {
  name: string;
  plural?: string;
  symbol?: string;
  alternativeNames?: string[];
}

// Comprehensive unit names database
const unitNames: Record<string, UnitNameData> = {
  // Base units
  'm': { name: 'meter', plural: 'meters' },
  'g': { name: 'gram', plural: 'grams' },
  's': { name: 'second', plural: 'seconds' },
  'A': { name: 'ampere', plural: 'amperes' },
  'K': { name: 'kelvin', plural: 'kelvins' },
  'mol': { name: 'mole', plural: 'moles' },
  'cd': { name: 'candela', plural: 'candelas' },
  'rad': { name: 'radian', plural: 'radians' },
  'sr': { name: 'steradian', plural: 'steradians' },
  
  // Time units
  'min': { name: 'minute', plural: 'minutes' },
  'h': { name: 'hour', plural: 'hours' },
  'd': { name: 'day', plural: 'days' },
  'wk': { name: 'week', plural: 'weeks' },
  'mo': { name: 'month', plural: 'months' },
  'a': { name: 'year', plural: 'years' },
  
  // Volume units
  'L': { name: 'liter', plural: 'liters' },
  'mL': { name: 'milliliter', plural: 'milliliters' },
  'dL': { name: 'deciliter', plural: 'deciliters' },
  'µL': { name: 'microliter', plural: 'microliters' },
  'uL': { name: 'microliter', plural: 'microliters' },
  
  // Mass units
  'kg': { name: 'kilogram', plural: 'kilograms' },
  'mg': { name: 'milligram', plural: 'milligrams' },
  'µg': { name: 'microgram', plural: 'micrograms' },
  'ug': { name: 'microgram', plural: 'micrograms' },
  'ng': { name: 'nanogram', plural: 'nanograms' },
  
  // Derived SI units
  'N': { name: 'newton', plural: 'newtons', symbol: 'N' },
  'Pa': { name: 'pascal', plural: 'pascals', symbol: 'Pa' },
  'J': { name: 'joule', plural: 'joules', symbol: 'J' },
  'W': { name: 'watt', plural: 'watts', symbol: 'W' },
  'C': { name: 'coulomb', plural: 'coulombs', symbol: 'C' },
  'V': { name: 'volt', plural: 'volts', symbol: 'V' },
  'F': { name: 'farad', plural: 'farads', symbol: 'F' },
  'Ω': { name: 'ohm', plural: 'ohms', symbol: 'Ω' },
  'Ohm': { name: 'ohm', plural: 'ohms', symbol: 'Ω' },
  'S': { name: 'siemens', plural: 'siemens', symbol: 'S' },
  'Wb': { name: 'weber', plural: 'webers', symbol: 'Wb' },
  'T': { name: 'tesla', plural: 'teslas', symbol: 'T' },
  'H': { name: 'henry', plural: 'henries', symbol: 'H' },
  'Hz': { name: 'hertz', plural: 'hertz', symbol: 'Hz' },
  'lm': { name: 'lumen', plural: 'lumens', symbol: 'lm' },
  'lx': { name: 'lux', plural: 'lux', symbol: 'lx' },
  'Bq': { name: 'becquerel', plural: 'becquerels', symbol: 'Bq' },
  'Gy': { name: 'gray', plural: 'grays', symbol: 'Gy' },
  'Sv': { name: 'sievert', plural: 'sieverts', symbol: 'Sv' },
  'kat': { name: 'katal', plural: 'katals', symbol: 'kat' },
  
  // Temperature units
  'Cel': { name: 'degree Celsius', plural: 'degrees Celsius', symbol: '°C' },
  '[degF]': { name: 'degree Fahrenheit', plural: 'degrees Fahrenheit', symbol: '°F' },
  '[degR]': { name: 'degree Rankine', plural: 'degrees Rankine', symbol: '°R' },
  '[degRe]': { name: 'degree Réaumur', plural: 'degrees Réaumur', symbol: '°Ré' },
  
  // Clinical units
  '[IU]': { name: 'international unit', plural: 'international units' },
  '[pH]': { name: 'pH', plural: 'pH' },
  '%': { name: 'percent', plural: 'percent' },
  '[ppth]': { name: 'parts per thousand', plural: 'parts per thousand' },
  '[ppm]': { name: 'parts per million', plural: 'parts per million' },
  '[ppb]': { name: 'parts per billion', plural: 'parts per billion' },
  '[pptr]': { name: 'parts per trillion', plural: 'parts per trillion' },
  
  // Common non-SI units
  'cal': { name: 'calorie', plural: 'calories' },
  'kcal': { name: 'kilocalorie', plural: 'kilocalories' },
  'eV': { name: 'electronvolt', plural: 'electronvolts' },
  'u': { name: 'unified atomic mass unit', plural: 'unified atomic mass units' },
  
  // Length units
  '[in_i]': { name: 'inch', plural: 'inches' },
  '[ft_i]': { name: 'foot', plural: 'feet' },
  '[yd_i]': { name: 'yard', plural: 'yards' },
  '[mi_i]': { name: 'mile', plural: 'miles' },
  '[nmi_i]': { name: 'nautical mile', plural: 'nautical miles' },
  
  // Pressure units
  'bar': { name: 'bar', plural: 'bars' },
  'atm': { name: 'atmosphere', plural: 'atmospheres' },
  'mHg': { name: 'millimeter of mercury', plural: 'millimeters of mercury' },
  '[psi]': { name: 'pound per square inch', plural: 'pounds per square inch' },
  
  // Angle units
  'deg': { name: 'degree', plural: 'degrees' },
  "'": { name: 'arcminute', plural: 'arcminutes' },
  '"': { name: 'arcsecond', plural: 'arcseconds' },
  
  // Special units
  '1': { name: 'one', plural: 'one' },
  '{cells}': { name: 'cells', plural: 'cells' },
  '{RBC}': { name: 'red blood cells', plural: 'red blood cells' },
  '{WBC}': { name: 'white blood cells', plural: 'white blood cells' },
};

// Prefix names mapping
const prefixNames: Record<string, string> = {
  'Y': 'yotta',
  'Z': 'zetta',
  'E': 'exa',
  'P': 'peta',
  'T': 'tera',
  'G': 'giga',
  'M': 'mega',
  'k': 'kilo',
  'h': 'hecto',
  'da': 'deka',
  'd': 'deci',
  'c': 'centi',
  'm': 'milli',
  'µ': 'micro',
  'u': 'micro',
  'n': 'nano',
  'p': 'pico',
  'f': 'femto',
  'a': 'atto',
  'z': 'zepto',
  'y': 'yocto',
};

/**
 * Create enhanced unit information
 */
export function createUnitInfo(unit: string): UnitInfo {
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
  
  // Generate name
  let name: string;
  if (unitData?.name) {
    // Use database name if available
    name = unitData.name;
  } else if (unitNames[unit]) {
    // Use our enhanced names database
    name = unitNames[unit].name;
  } else if (parseResult.ast) {
    // Generate name from AST
    name = generateNameFromAST(parseResult.ast);
  } else {
    // Fallback to unit code
    name = unit;
  }
  
  // Build info object
  return {
    type,
    code: unit,
    name,
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

/**
 * Display unit in human-readable format
 */
export function displayUnit(unit: string, options?: DisplayOptions): string {
  // Strip annotations
  const cleanUnit = unit.replace(/\{[^}]*\}/g, '');
  
  // Handle different formats
  if (options?.format === 'symbol' || !options?.format) {
    return cleanUnit;
  }
  
  if (options.format === 'name' || options.format === 'long') {
    // Try simple lookup first
    if (unitNames[cleanUnit]) {
      const name = unitNames[cleanUnit].name;
      
      if (options.format === 'long' && units[cleanUnit]) {
        const unitData = units[cleanUnit];
        const definition = unitData?.value?.Unit;
        if (definition && definition !== '1' && definition !== cleanUnit) {
          return `${name} (${definition})`;
        }
      }
      
      return name;
    }
    
    // Parse and generate name
    const parseResult = parseUnit(cleanUnit);
    if (parseResult.ast && parseResult.errors.length === 0) {
      const name = generateNameFromAST(parseResult.ast);
      
      if (options.format === 'long') {
        // Try to add definition for known units
        const unitData = units[cleanUnit];
        if (unitData?.value?.Unit && unitData.value.Unit !== '1' && unitData.value.Unit !== cleanUnit) {
          return `${name} (${unitData.value.Unit})`;
        }
      }
      
      return name;
    }
  }
  
  // Fallback to cleaned unit
  return cleanUnit;
}

/**
 * Generate human-readable name from AST
 */
function generateNameFromAST(ast: Expression): string {
  switch (ast.type) {
    case 'unit':
      return generateUnitName(ast);
      
    case 'binary':
      return generateBinaryName(ast);
      
    case 'unary':
      return generateUnaryName(ast);
      
    case 'group':
      return generateNameFromAST(ast.expression);
      
    case 'factor':
      if (ast.annotation) {
        // Handle annotated factors
        return ast.annotation;
      }
      return ast.value.toString();
      
    default:
      return '';
  }
}

/**
 * Generate name for a single unit
 */
function generateUnitName(unit: Unit): string {
  let baseName: string;
  
  // Get base unit name
  const unitNameData = unitNames[unit.atom];
  if (unitNameData) {
    baseName = unitNameData.name;
  } else {
    const unitData = units[unit.atom];
    if (unitData?.name) {
      baseName = unitData.name;
    } else {
      baseName = unit.atom;
    }
  }
  
  // Handle prefix
  if (unit.prefix) {
    const prefixName = prefixNames[unit.prefix];
    if (prefixName) {
      // Special cases for common prefixed units
      if (unit.prefix === 'k' && unit.atom === 'g') {
        baseName = 'kilogram'; // Special case: kg is the base unit
      } else if (unit.atom === 'L') {
        // For liter, combine prefix directly
        baseName = prefixName + 'liter';
      } else if (unit.atom === 'g' && unit.prefix !== 'k') {
        // For non-kilo gram prefixes
        baseName = prefixName + 'gram';
      } else {
        // General case
        baseName = prefixName + baseName;
      }
    }
  }
  
  // Handle exponent
  if (unit.exponent) {
    const exp = typeof unit.exponent === 'string' ? parseInt(unit.exponent) : unit.exponent;
    if (exp === 2) {
      baseName = `square ${baseName}`;
    } else if (exp === 3) {
      baseName = `cubic ${baseName}`;
    } else if (exp === -1) {
      baseName = `per ${baseName}`;
    } else if (exp < 0) {
      baseName = `per ${baseName} to the power of ${Math.abs(exp)}`;
    } else {
      baseName = `${baseName} to the power of ${exp}`;
    }
  }
  
  return baseName;
}

/**
 * Generate name for binary operations
 */
function generateBinaryName(binary: BinaryOp): string {
  const leftName = generateNameFromAST(binary.left);
  const rightName = generateNameFromAST(binary.right);
  
  if (binary.operator === '.') {
    // Multiplication
    return `${leftName} ${rightName}`;
  } else {
    // Division
    return `${leftName} per ${rightName}`;
  }
}

/**
 * Generate name for unary operations (leading division)
 */
function generateUnaryName(unary: UnaryOp): string {
  const operandName = generateNameFromAST(unary.operand);
  return `per ${operandName}`;
}

/**
 * Get unit name considering prefixes
 */
function getUnitNameWithPrefix(prefix: string | undefined, unitAtom: string): string {
  // Check if we have a direct entry for the prefixed unit
  const prefixedUnit = prefix ? prefix + unitAtom : unitAtom;
  if (unitNames[prefixedUnit]) {
    return unitNames[prefixedUnit].name;
  }
  
  // Build name from prefix and base unit
  if (prefix && prefixNames[prefix]) {
    const baseUnitName = unitNames[unitAtom]?.name || units[unitAtom]?.name || unitAtom;
    
    // Special handling for certain combinations
    if (unitAtom === 'g' && prefix === 'k') {
      return 'kilogram';
    } else if (unitAtom === 'L') {
      return prefixNames[prefix] + 'liter';
    } else if (unitAtom === 'g') {
      return prefixNames[prefix] + 'gram';
    }
    
    return prefixNames[prefix] + baseUnitName;
  }
  
  // No prefix or unknown prefix
  return unitNames[unitAtom]?.name || units[unitAtom]?.name || unitAtom;
}