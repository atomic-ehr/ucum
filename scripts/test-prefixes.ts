import { prefixes } from '../src/prefixes';

let hasErrors = false;

console.log('Testing that CODE equals key.toUpperCase()...\n');

for (const [key, prefix] of Object.entries(prefixes)) {
  const expectedCode = key.toUpperCase();
  if (expectedCode !== prefix.CODE) {
    console.error(`❌ Mismatch found:`);
    console.error(`   Key: "${key}"`);
    console.error(`   CODE: "${prefix.CODE}"`);
    console.error(`   Expected: "${expectedCode}"\n`);
    hasErrors = true;
  }
}

if (!hasErrors) {
  console.log('✅ All prefixes have CODE equal to key.toUpperCase()');
  console.log(`   Total prefixes checked: ${Object.keys(prefixes).length}`);
} else {
  console.log(`❌ Test failed: ${Object.entries(prefixes).filter(([k, p]) => k.toUpperCase() !== p.CODE).length} mismatches found`);
  process.exit(1);
}