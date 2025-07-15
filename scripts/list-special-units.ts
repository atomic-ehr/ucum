import { units } from '../src/units';

console.log('Special Units in UCUM:\n');

const specialUnits = Object.entries(units)
  .filter(([_, unit]) => unit.isSpecial)
  .map(([code, unit]) => ({
    code,
    name: unit.name,
    printSymbol: unit.printSymbol,
    property: unit.property,
    value: unit.value,
    class: unit.class
  }));

console.log(`Total special units: ${specialUnits.length}\n`);

specialUnits.forEach((unit, index) => {
  console.log(`${index + 1}. ${unit.code} (${unit.printSymbol})`);
  console.log(`   Name: ${unit.name}`);
  console.log(`   Property: ${unit.property}`);
  console.log(`   Class: ${unit.class}`);
  console.log(`   Value: ${unit.value.value} ${unit.value.Unit}`);
  if (unit.value.function) {
    console.log(`   Function: ${unit.value.function.name}(${unit.value.function.value} ${unit.value.function.Unit})`);
  }
  console.log();
});