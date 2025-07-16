import { units } from '../src/units';

// Find all special units (those with functions)
const specialUnits = Object.entries(units).filter(([_, unit]) => unit.value.function);

console.log(`\nAnalysis of Special Units and Their Functions`);
console.log(`=============================================\n`);
console.log(`Total special units: ${specialUnits.length}`);
console.log(`Total units: ${Object.keys(units).length}`);
console.log(`Percentage of special units: ${(specialUnits.length / Object.keys(units).length * 100).toFixed(1)}%\n`);

// Analyze function patterns
const functionAnalysis: Record<string, {
  count: number;
  examples: Array<{code: string; name: string; value: string; funcValue: string; funcUnit: string}>;
  description?: string;
}> = {};

// Known function descriptions
const functionDescriptions: Record<string, string> = {
  'Cel': 'Celsius temperature conversion',
  'degF': 'Fahrenheit temperature conversion',
  'degRe': 'Réaumur temperature conversion',
  'tanTimes100': 'Tangent multiplied by 100',
  '100tan': '100 times tangent',
  'hpX': 'Homeopathic potency - decimal series',
  'hpC': 'Homeopathic potency - centesimal series',
  'hpM': 'Homeopathic potency - millesimal series',
  'hpQ': 'Homeopathic potency - quintamillesimal series',
  'pH': 'pH scale (negative log of H+ concentration)',
  'ln': 'Natural logarithm',
  'lg': 'Common logarithm (base 10)',
  'lgTimes2': '2 times common logarithm',
  'sqrt': 'Square root',
  'ld': 'Binary logarithm (base 2)'
};

specialUnits.forEach(([code, unit]) => {
  const func = unit.value.function!;
  
  if (!functionAnalysis[func.name]) {
    functionAnalysis[func.name] = {
      count: 0,
      examples: [],
      description: functionDescriptions[func.name]
    };
  }
  
  functionAnalysis[func.name]!.count++;
  functionAnalysis[func.name]!.examples.push({
    code,
    name: unit.name,
    value: unit.value.value || 'undefined',
    funcValue: func.value,
    funcUnit: func.Unit
  });
});

// Display detailed function analysis
console.log('Function Analysis:');
console.log('==================\n');

Object.entries(functionAnalysis)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([funcName, data]) => {
    console.log(`${funcName}()`);
    if (data.description) {
      console.log(`  Description: ${data.description}`);
    }
    console.log(`  Usage count: ${data.count}`);
    console.log(`  Examples:`);
    
    data.examples.forEach(ex => {
      console.log(`    - ${ex.code}: ${ex.name}`);
      console.log(`      Expression: ${ex.value} ${funcName}(${ex.funcValue} ${ex.funcUnit})`);
    });
    console.log();
  });

// Categorize functions
console.log('\nFunction Categories:');
console.log('===================\n');

const categories = {
  'Temperature conversions': ['Cel', 'degF', 'degRe'],
  'Logarithmic functions': ['ln', 'lg', 'lgTimes2', 'ld', 'pH'],
  'Trigonometric functions': ['tanTimes100', '100tan'],
  'Homeopathic potencies': ['hpX', 'hpC', 'hpM', 'hpQ'],
  'Mathematical operations': ['sqrt']
};

Object.entries(categories).forEach(([category, funcs]) => {
  const count = funcs.reduce((sum, f) => sum + (functionAnalysis[f]?.count || 0), 0);
  console.log(`${category}: ${funcs.join(', ')} (${count} units)`);
});

// Find patterns in function usage
console.log('\n\nPatterns in Function Usage:');
console.log('===========================\n');

// Temperature units
const tempUnits = specialUnits.filter(([_, unit]) => 
  ['Cel', 'degF', 'degRe'].includes(unit.value.function!.name)
);
console.log(`Temperature conversion units: ${tempUnits.length}`);

// Logarithmic units
const logUnits = specialUnits.filter(([_, unit]) => 
  unit.value.function!.name.includes('lg') || 
  unit.value.function!.name.includes('ln') || 
  unit.value.function!.name === 'ld' ||
  unit.value.function!.name === 'pH'
);
console.log(`Logarithmic units: ${logUnits.length}`);

// Units with special mathematical operations
const mathUnits = specialUnits.filter(([_, unit]) => 
  ['sqrt', 'tanTimes100', '100tan'].includes(unit.value.function!.name)
);
console.log(`Mathematical operation units: ${mathUnits.length}`);