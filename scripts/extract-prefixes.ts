import { parseStringPromise } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Prefix {
  CODE: string;
  name: string;
  printSymbol: string;
  value: number;
}

async function extractPrefixes() {
  // Read the XML file
  const xmlContent = readFileSync(join(__dirname, 'ucum-spec/ucum-essence.xml'), 'utf-8');
  
  // Parse XML
  const result = await parseStringPromise(xmlContent);
  
  // Extract prefixes
  const prefixMap: Record<string, Prefix> = {};
  
  const prefixes = result.root.prefix || [];
  
  for (const prefix of prefixes) {
    const code = prefix.$.Code;
    const CODE = prefix.$.CODE;
    const name = prefix.name[0];
    const printSymbol = prefix.printSymbol[0];
    const value = parseFloat(prefix.value[0].$.value);
    
    prefixMap[code] = {
      CODE,
      name,
      printSymbol,
      value
    };
  }
  
  // Generate TypeScript content
  const tsContent = `// Generated from ucum-essence.xml
// Do not edit manually

export interface Prefix {
  CODE: string;
  name: string;
  printSymbol: string;
  value: number;
}

export const prefixes: Record<string, Prefix> = {
${Object.entries(prefixMap)
  .map(([code, prefix]) => `  "${code}": {
    CODE: "${prefix.CODE}",
    name: "${prefix.name}",
    printSymbol: "${prefix.printSymbol}",
    value: ${prefix.value}
  }`)
  .join(',\n')}
};
`;
  
  // Write to file
  writeFileSync(join(__dirname, 'src/prefixes.ts'), tsContent);
  console.log('Successfully extracted prefixes to src/prefixes.ts');
}

// Run the extraction
extractPrefixes().catch(console.error);