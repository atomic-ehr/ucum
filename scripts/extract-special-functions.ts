import { units } from '../src/units';

// Find all special units (those with functions)
const specialUnits = Object.entries(units).filter(([_, unit]) => unit.value.function);

console.log(`\nTotal special units with functions: ${specialUnits.length}\n`);

// Group by function name
const functionGroups: Record<string, Array<{code: string, unit: typeof units[string]}>> = {};

specialUnits.forEach(([code, unit]) => {
  const funcName = unit.value.function!.name;
  if (!functionGroups[funcName]) {
    functionGroups[funcName] = [];
  }
  functionGroups[funcName].push({ code, unit });
});

// Display functions and their units
console.log('Functions used in special units:');
console.log('================================\n');

Object.entries(functionGroups).forEach(([funcName, units]) => {
  console.log(`Function: ${funcName}`);
  console.log(`Units using this function: ${units.length}`);
  console.log('---');
  
  units.forEach(({ code, unit }) => {
    console.log(`  ${code} (${unit.CODE}): ${unit.name}`);
    console.log(`    Value: ${unit.value.value} ${unit.value.Unit}`);
    console.log(`    Function value: ${unit.value.function!.value}`);
    console.log(`    Function unit: ${unit.value.function!.Unit}`);
    if (unit.printSymbol) {
      console.log(`    Print symbol: ${unit.printSymbol}`);
    }
    console.log();
  });
  console.log();
});

// Summary of unique functions
console.log('\nSummary of unique functions:');
console.log('===========================');
Object.keys(functionGroups).sort().forEach(func => {
  console.log(`- ${func} (${functionGroups[func]!.length} units)`);
});