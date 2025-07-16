import { parseStringPromise, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { DimensionObject } from '../src/dimension';

interface Unit {
  CODE: string;
  isMetric: boolean;
  isSpecial?: boolean;
  isBaseUnit?: boolean;
  class: string;
  name: string;
  printSymbol?: string;
  property: string;
  dim?: string; // dimension for base units
  dimension?: DimensionObject; // dimension object
  value: {
    Unit: string;
    UNIT: string;
    value: string;
    function?: {
      name: string;
      value: string;
      Unit: string;
    };
  };
}

// Helper function to convert printSymbol to string, preserving XML structure
function printSymbolToString(printSymbol: any): string {
  if (typeof printSymbol === 'string') {
    return printSymbol.trim();
  }
  
  // Handle object format with XML tags by reconstructing the inner XML
  if (typeof printSymbol === 'object') {
    // Use xml2js Builder to reconstruct the XML
    const builder = new Builder({
      headless: true,
      renderOpts: { pretty: false }
    });
    
    // Reconstruct the inner content as XML
    function reconstructXML(obj: any): string {
      if (typeof obj === 'string') {
        return obj;
      }
      
      let result = '';
      
      // Add text content if exists
      if (obj._) {
        result += obj._;
      }
      
      // Process all XML elements
      for (const [tag, content] of Object.entries(obj)) {
        if (tag === '_' || tag === '$') continue;
        
        if (Array.isArray(content)) {
          for (const item of content) {
            result += `<${tag}>${reconstructXML(item)}</${tag}>`;
          }
        }
      }
      
      return result;
    }
    
    return reconstructXML(printSymbol).trim();
  }
  
  return '';
}

async function extractAllUnits() {
  // Read the XML file
  const xmlContent = readFileSync(join(__dirname, '../ucum-spec/ucum-essence.xml'), 'utf-8');
  
  // Parse XML
  const result = await parseStringPromise(xmlContent);
  
  // Extract all units
  const unitMap: Record<string, Unit> = {};
  
  // First, extract base units
  const baseUnits = result.root['base-unit'] || [];
  const baseUnitCodes = new Set<string>();
  
  // Map dimension symbols to property names
  const dimMap: Record<string, keyof DimensionObject> = {
    'L': 'L',  // Length
    'M': 'M',  // Mass
    'T': 'T',  // Time
    'A': 'A',  // Angle
    'C': 'Θ',  // Temperature (C in UCUM, Θ in our system)
    'Q': 'Q',  // Charge
    'F': 'F'   // Luminosity
  };

  for (const unit of baseUnits) {
    const code = unit.$.Code;
    baseUnitCodes.add(code);
    
    // Create dimension object for base unit
    const dimension: DimensionObject = {};
    const dimKey = dimMap[unit.$.dim];
    if (dimKey !== undefined) {
      dimension[dimKey] = 1;
    }
    
    unitMap[code] = {
      CODE: unit.$.CODE,
      isMetric: true,
      isBaseUnit: true,
      class: 'si',
      dim: unit.$.dim,
      dimension,
      name: unit.name[0],
      ...(unit.printSymbol && { printSymbol: printSymbolToString(unit.printSymbol[0]) }),
      property: unit.property[0],
      value: {
        Unit: '1',
        UNIT: '1',
        value: '1'
      }
    };
  }
  
  // Then, extract regular units
  const units = result.root.unit || [];
  
  for (const unit of units) {
    const code = unit.$.Code;
    const CODE = unit.$.CODE;
    const isMetric = unit.$.isMetric === 'yes';
    const isSpecial = unit.$.isSpecial === 'yes' ? true : undefined;
    const unitClass = unit.$.class;
    const name = unit.name ? unit.name[0] : '';
    const printSymbol = unit.printSymbol ? printSymbolToString(unit.printSymbol[0]) : undefined;
    const property = unit.property ? unit.property[0] : '';
    
    const value: Unit['value'] = {
      Unit: unit.value[0].$.Unit,
      UNIT: unit.value[0].$.UNIT,
      value: unit.value[0].$.value || unit.value[0]._
    };
    
    // Handle special functions like Celsius
    if (unit.value[0].function) {
      value.function = {
        name: unit.value[0].function[0].$.name,
        value: unit.value[0].function[0].$.value,
        Unit: unit.value[0].function[0].$.Unit
      };
    }
    
    unitMap[code] = {
      CODE,
      isMetric,
      ...(isSpecial && { isSpecial }),
      class: unitClass,
      name,
      ...(printSymbol !== undefined && { printSymbol }),
      property,
      value
    };
  }
  
  // Generate TypeScript content
  const tsContent = `// Generated from ucum-essence.xml
// Do not edit manually

import type { DimensionObject } from './dimension';

export interface Unit {
  CODE: string;
  isMetric: boolean;
  isSpecial?: boolean;
  isBaseUnit?: boolean;
  class: string;
  name: string;
  printSymbol?: string;
  property: string;
  dim?: string;
  dimension?: DimensionObject;
  value: {
    Unit: string;
    UNIT: string;
    value: string;
    function?: {
      name: string;
      value: string;
      Unit: string;
    };
  };
}

export const units: Record<string, Unit> = {
${Object.entries(unitMap)
  .map(([code, unit]) => {
    let dimensionStr = '';
    if (unit.dimension && Object.keys(unit.dimension).length > 0) {
      const dimParts = Object.entries(unit.dimension)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      dimensionStr = `
    dimension: { ${dimParts} },`;
    }
    
    return `  "${code}": {
    CODE: "${unit.CODE}",
    isMetric: ${unit.isMetric},${unit.isSpecial ? `
    isSpecial: ${unit.isSpecial},` : ''}${unit.isBaseUnit ? `
    isBaseUnit: ${unit.isBaseUnit},` : ''}
    class: "${unit.class}",${unit.dim ? `
    dim: "${unit.dim}",` : ''}${dimensionStr}
    name: ${JSON.stringify(unit.name)},${unit.printSymbol !== undefined ? `
    printSymbol: ${JSON.stringify(unit.printSymbol)},` : ''}
    property: ${JSON.stringify(unit.property)},
    value: {
      Unit: "${unit.value.Unit}",
      UNIT: "${unit.value.UNIT}",
      value: "${unit.value.value}"${unit.value.function ? `,
      function: {
        name: "${unit.value.function.name}",
        value: "${unit.value.function.value}",
        Unit: "${unit.value.function.Unit}"
      }` : ''}
    }
  }`;
  })
  .join(',\n')}
};

// Export base units separately for convenience
export const baseUnits = Object.fromEntries(
  Object.entries(units).filter(([_, unit]) => unit.isBaseUnit)
);
`;
  
  // Write to file
  writeFileSync(join(__dirname, '../src/units.ts'), tsContent);
  console.log('Successfully extracted all units to src/units.ts');
  console.log(`Total units extracted: ${Object.keys(unitMap).length}`);
  console.log(`Base units: ${baseUnitCodes.size}`);
}

// Run the extraction
extractAllUnits().catch(console.error);