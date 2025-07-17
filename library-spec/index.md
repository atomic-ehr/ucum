# Library Specification

Library provides fast UCUM implementation in typescript.

Features:
* validate units
* convert between units
* add, subtract, multiply, divide, pow operations on quantities
* display quantities in different locales
* get information about units

```typescript
interface Quantity { 
    value: number;
    unit: string;
    _canonicalForm?: CanonicalForm; // internal, cached
}

interface UnitInfo {
    type: 'base' | 'derived' | 'special' | 'arbitrary' | 'dimensionless';
    code: string;
    name: string;
    printSymbol?: string;
    isMetric: boolean;
    isSpecial: boolean;
    isArbitrary: boolean;
    isBase: boolean;
    class?: string;
    property?: string;
    dimension: DimensionObject;
    canonical: CanonicalForm;
    definition?: string;
}

interface DisplayOptions {
    locale?: string;
    format?: 'symbol' | 'name' | 'long';
}

interface UCUM {
    // Validation
    validate(unit: string): ValidationResult;
    
    // Conversion
    convert(value: number, from: string, to: string): number;
    isConvertible(from: string, to: string): boolean;
    
    // Quantities
    quantity(value: number, unit: string): Quantity;
    
    // Arithmetic operations
    add(q1: Quantity, q2: Quantity): Quantity;
    subtract(q1: Quantity, q2: Quantity): Quantity;
    multiply(q1: Quantity, q2: Quantity | number): Quantity;
    divide(q1: Quantity, q2: Quantity | number): Quantity;
    pow(q: Quantity, exponent: number): Quantity;
    
    // Unit information
    info(unit: string): UnitInfo;
    display(unit: string, options?: DisplayOptions): string;
    
    // Helper functions
    isSpecialUnit(unit: string): boolean;
    isArbitraryUnit(unit: string): boolean;
}
```

```typescript
import { ucum } from '@atomic-ehr/ucum';

// Validation
const validation = ucum.validate('kg/s');
// { valid: true, errors: [], warnings: [] }

// Conversion
const result = ucum.convert(10, 'kg/s', 'mg/s');
// 10000000

// Check if units are convertible
const canConvert = ucum.isConvertible('kg', 'lb_av');
// true

// Create and manipulate quantities
const q1 = ucum.quantity(10, 'kg/s');
const q2 = ucum.quantity(20000, 'g/s');

const sum = ucum.add(q1, q2);      // 30 kg/s
const diff = ucum.subtract(q1, q2); // -10 kg/s
const prod = ucum.multiply(q1, q2); // 200 kg.g/s2
const quot = ucum.divide(q1, q2);   // 0.5
const pow2 = ucum.pow(q1, 2);       // 100 kg2/s2

// Get unit information
const info = ucum.info('N');
// {
//     type: 'derived',
//     code: 'N',
//     name: 'newton',
//     printSymbol: 'N',
//     isMetric: true,
//     isSpecial: false,
//     isArbitrary: false,
//     isBase: false,
//     class: 'si',
//     property: 'force',
//     dimension: { M: 1, L: 1, T: -2 },
//     canonical: { magnitude: 1000, dimension: { M: 1, L: 1, T: -2 }, units: [...] },
//     definition: 'kg.m/s2'
// }

// Display units in human-readable form
ucum.display('kg{dry_mass}/s', { locale: 'en-US' });
// 'kilogram per second'

ucum.display('m2', { locale: 'en-US' });
// 'square meter'

// Helper functions
ucum.isSpecialUnit('Cel');    // true
ucum.isArbitraryUnit('[IU]'); // true
```

## Advanced Usage

```typescript
// Direct access to parsing and canonical forms if needed
import { parseUnit, toCanonicalForm } from '@atomic-ehr/ucum';

const parseResult = parseUnit('kg.m/s2');
const canonical = toCanonicalForm('N');

// Compare canonical forms to check unit equivalence
const n1 = toCanonicalForm('N');
const n2 = toCanonicalForm('kg.m/s2');
// Both have same dimension and magnitude
```