/**
 * Special function definitions for UCUM special units
 * Based on UCUM specification §21-§23
 */

export interface SpecialFunctionDef {
  name: string;
  forward: (value: number) => number;
  inverse: (value: number) => number;
  inputDomain?: (value: number) => boolean;
  outputDomain?: (value: number) => boolean;
}

// Registry of all 15 special functions used by 21 special units
const specialFunctions = new Map<string, SpecialFunctionDef>();

// Temperature Functions
specialFunctions.set('Cel', {
  name: 'Celsius',
  forward: (k: number) => k - 273.15,
  inverse: (c: number) => c + 273.15,
  inputDomain: (k: number) => k >= 0,
  outputDomain: (c: number) => c >= -273.15
});

specialFunctions.set('degF', {
  name: 'Fahrenheit',
  // Parameters value=5, unit=K/9 are incorporated
  forward: (k: number) => k * 9/5 - 459.67,
  inverse: (f: number) => (f + 459.67) * 5/9,
  inputDomain: (k: number) => k >= 0,
  outputDomain: (f: number) => f >= -459.67
});

specialFunctions.set('degRe', {
  name: 'Réaumur',
  // Parameters value=5, unit=K/4 are incorporated
  forward: (k: number) => (k - 273.15) * 4/5,
  inverse: (re: number) => re * 5/4 + 273.15,
  inputDomain: (k: number) => k >= 0,
  outputDomain: (re: number) => re >= -218.52
});

// Logarithmic Functions
specialFunctions.set('ln', {
  name: 'Natural logarithm',
  forward: (x: number) => Math.log(x),
  inverse: (x: number) => Math.exp(x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('lg', {
  name: 'Common logarithm',
  forward: (x: number) => Math.log10(x),
  inverse: (x: number) => Math.pow(10, x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('lgTimes2', {
  name: '2 × common logarithm',
  forward: (x: number) => 2 * Math.log10(x),
  inverse: (x: number) => Math.pow(10, x/2),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('ld', {
  name: 'Binary logarithm',
  forward: (x: number) => Math.log2(x),
  inverse: (x: number) => Math.pow(2, x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('pH', {
  name: 'pH scale',
  forward: (x: number) => -Math.log10(x),
  inverse: (x: number) => Math.pow(10, -x),
  inputDomain: (x: number) => x > 0
});

// Trigonometric Functions
specialFunctions.set('tanTimes100', {
  name: '100 × tangent (radians)',
  forward: (rad: number) => 100 * Math.tan(rad),
  inverse: (x: number) => Math.atan(x / 100)
});

specialFunctions.set('100tan', {
  name: '100 × tangent (degrees)',
  forward: (deg: number) => 100 * Math.tan(deg * Math.PI / 180),
  inverse: (x: number) => Math.atan(x / 100) * 180 / Math.PI
});

// Homeopathic Functions (retired but still supported)
specialFunctions.set('hpX', {
  name: 'Homeopathic decimal potency',
  forward: (x: number) => -Math.log10(x),
  inverse: (x: number) => Math.pow(10, -x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('hpC', {
  name: 'Homeopathic centesimal potency',
  forward: (x: number) => -Math.log(x) / Math.log(100),
  inverse: (x: number) => Math.pow(100, -x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('hpM', {
  name: 'Homeopathic millesimal potency',
  forward: (x: number) => -Math.log(x) / Math.log(1000),
  inverse: (x: number) => Math.pow(1000, -x),
  inputDomain: (x: number) => x > 0
});

specialFunctions.set('hpQ', {
  name: 'Homeopathic quintamillesimal potency',
  forward: (x: number) => -Math.log(x) / Math.log(50000),
  inverse: (x: number) => Math.pow(50000, -x),
  inputDomain: (x: number) => x > 0
});

// Mathematical Functions
specialFunctions.set('sqrt', {
  name: 'Square root',
  forward: (x: number) => Math.sqrt(x),
  inverse: (x: number) => x * x,
  inputDomain: (x: number) => x >= 0,
  outputDomain: (x: number) => x >= 0
});

/**
 * Get a special function definition by name
 */
export function getSpecialFunction(name: string): SpecialFunctionDef | undefined {
  return specialFunctions.get(name);
}

/**
 * Check if a function name corresponds to a special function
 */
export function isSpecialFunction(name: string): boolean {
  return specialFunctions.has(name);
}

/**
 * Get all special function names
 */
export function getAllSpecialFunctionNames(): string[] {
  return Array.from(specialFunctions.keys());
}