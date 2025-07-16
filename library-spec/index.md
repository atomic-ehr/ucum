# Library Specification

Library provides fast UCUM implementation in typescript.

Featres:
* validate units
* convert between units
* add, subtract, multiply, divide, pow operations on quantities
* display quantities in different locales
* get information about units

```typescript
interface Quantity { 
    value: number;
    unit: string;
    unitTerms: UnitTerms; // internal
    canonical: Canonical; // internal
}

interface ucum {
    unit(unit: string): UnitTerms;
    validate(unit: string): ValidationResult;
    convert(value: number, from: string, to: string): number;
    quantity(value: number, unit: string): Quantity;
    add(q1: Quantity, q2: Quantity): Quantity;
    subtract(q1: Quantity, q2: Quantity): Quantity;
    multiply(q1: Quantity, q2: Quantity | number): Quantity;
    divide(q1: Quantity, q2: Quantity | number): Quantity;
    pow(q1: Quantity, exponent: number): Quantity;
    info(unit: string): UnitInfo;
    display(unit: string, options: {locale: string}): string;
}
```

```typescript
import { ucum } from '@atomic-ehr/ucum';

let res:ucum.UnitTerms = ucum.unit('kg/s');
// or Error

let errors:ucum.ValidationResult = ucum.validate('kg/s');

let res:number = ucum.convert(10,'kg/s', 'mg/s');

ucum.quantity(10,'kg/s');
{
    value: 10,
    unit: 'kg/s',
    _unitTerms: {} as ucum.UnitTerms,
    _canonical: {
        dimention: { g: 1, s: -1 },
        magnitude: 10
    } as ucum.Canonical // internal
}

let q1 = ucum.quantity(10,'kg/s');
let q2 = ucum.quantity(20,'mg/s');

ucum.add(q1, q2);
ucum.subtract(q1,q2)
ucum.multiply(q1,q2)
ucum.multiply(q1, 10)
ucum.divide(q1,q2)
ucum.divide(q1, 10)
ucum.pow(q1,2)

ucum.info('kg/s');
{
    type: 'basic_unit',
    name: "kilogram per second",
    isMetric: true,
    symbol: "kg/s",
    dimension: {g: 1, s: -1},
    unitTerms:  {} as ucum.UnitTerms,
    canonical: {dimention: {g: 1, s: -1}, magnitude: 10} as ucum.Canonical // internal
}

ucum.display('kg{dry_mass}/s', {locale: 'en-US'});
'kilogram per second'

// do we need a builder for units or quantity?

```