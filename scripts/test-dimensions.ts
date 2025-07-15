import { Dimension, Dimensions } from '../src/dimension';
import type { DimensionObject } from '../src/dimension';
import { units } from '../src/units';

console.log('Testing Dimension Implementation\n');

// Test 1: Verify base unit dimensions
console.log('1. Testing base unit dimensions:');
const baseUnitTests = [
  { code: 'm', expected: { L: 1 }, name: 'meter (length)' },
  { code: 'g', expected: { M: 1 }, name: 'gram (mass)' },
  { code: 's', expected: { T: 1 }, name: 'second (time)' },
  { code: 'rad', expected: { A: 1 }, name: 'radian (angle)' },
  { code: 'K', expected: { Θ: 1 }, name: 'kelvin (temperature)' },
  { code: 'C', expected: { Q: 1 }, name: 'coulomb (charge)' },
  { code: 'cd', expected: { F: 1 }, name: 'candela (luminosity)' }
];

let passed = 0;
let failed = 0;

for (const test of baseUnitTests) {
  const unit = units[test.code];
  if (unit?.dimension && Dimension.equals(unit.dimension, test.expected)) {
    console.log(`  ✓ ${test.name}`);
    passed++;
  } else {
    console.log(`  ✗ ${test.name} - expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(unit?.dimension)}`);
    failed++;
  }
}

// Test 2: Dimension operations
console.log('\n2. Testing dimension operations:');

// Test multiplication
const length: DimensionObject = { L: 1 };
const area = Dimension.multiply(length, length);
console.log(`  Length × Length = ${Dimension.toString(area)} (expected: L²)`);
if (Dimension.equals(area, { L: 2 })) {
  console.log('  ✓ Multiplication works');
  passed++;
} else {
  console.log('  ✗ Multiplication failed');
  failed++;
}

// Test division
const time: DimensionObject = { T: 1 };
const velocity = Dimension.divide(length, time);
console.log(`  Length ÷ Time = ${Dimension.toString(velocity)} (expected: L·T⁻¹)`);
if (Dimension.equals(velocity, { L: 1, T: -1 })) {
  console.log('  ✓ Division works');
  passed++;
} else {
  console.log('  ✗ Division failed');
  failed++;
}

// Test power
const volume = Dimension.power(length, 3);
console.log(`  Length³ = ${Dimension.toString(volume)} (expected: L³)`);
if (Dimension.equals(volume, { L: 3 })) {
  console.log('  ✓ Power works');
  passed++;
} else {
  console.log('  ✗ Power failed');
  failed++;
}

// Test 3: Common derived dimensions
console.log('\n3. Testing common derived dimensions:');

const derivedTests = [
  { 
    name: 'Force (Newton)', 
    dimension: { L: 1, M: 1, T: -2 },
    expected: 'L·M·T^-2'
  },
  { 
    name: 'Energy (Joule)', 
    dimension: { L: 2, M: 1, T: -2 },
    expected: 'L^2·M·T^-2'
  },
  { 
    name: 'Power (Watt)', 
    dimension: { L: 2, M: 1, T: -3 },
    expected: 'L^2·M·T^-3'
  },
  { 
    name: 'Pressure (Pascal)', 
    dimension: { L: -1, M: 1, T: -2 },
    expected: 'L^-1·M·T^-2'
  }
];

for (const test of derivedTests) {
  const result = Dimension.toString(test.dimension);
  if (result === test.expected) {
    console.log(`  ✓ ${test.name}: ${result}`);
    passed++;
  } else {
    console.log(`  ✗ ${test.name}: ${result} (expected: ${test.expected})`);
    failed++;
  }
}

// Test 4: Dimensionless check
console.log('\n4. Testing dimensionless detection:');
const dimensionless: DimensionObject = {};
if (Dimension.isDimensionless(dimensionless)) {
  console.log('  ✓ Empty dimension is dimensionless');
  passed++;
} else {
  console.log('  ✗ Dimensionless detection failed');
  failed++;
}

if (!Dimension.isDimensionless(length)) {
  console.log('  ✓ Length is not dimensionless');
  passed++;
} else {
  console.log('  ✗ Non-dimensionless detection failed');
  failed++;
}

// Test 5: Dimension.create method
console.log('\n5. Testing Dimension.create:');
const force1 = Dimension.create({ L: 1, M: 1, T: -2 });
const force2 = { L: 1, M: 1, T: -2 };
if (Dimension.equals(force1, force2)) {
  console.log('  ✓ create method normalizes dimensions correctly');
  passed++;
} else {
  console.log('  ✗ create method failed');
  failed++;
}

// Test that zero values are omitted
const testDim = Dimension.create({ L: 1, M: 0, T: -1 });
if (!('M' in testDim)) {
  console.log('  ✓ create method omits zero values');
  passed++;
} else {
  console.log('  ✗ create method kept zero value');
  failed++;
}

// Summary
console.log(`\n=============================`);
console.log(`Total tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`=============================`);

if (failed > 0) {
  process.exit(1);
}