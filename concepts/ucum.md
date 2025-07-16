# UCUM: Unified Code for Units of Measure

## What is UCUM?

**UCUM** is the international standard for representing units in digital systems. It ensures that when computers exchange measurements, there's zero ambiguity about what "mg" or "mL" means.

### The Problem
- **Ambiguity**: "mg" could mean milligram or megagram (10⁹ difference!)
- **Variations**: "mcg" vs "μg" for microgram
- **Safety**: Unit confusion causes medication errors

### The Solution
UCUM provides **one unambiguous code** for every unit:
- `mg` = milligram (never megagram)
- `ug` = microgram (standardized)
- `mL` = milliliter (always)

### Key Features
- **Machine-readable**: Software can parse and validate
- **Case-sensitive**: `m` (meter) ≠ `M` (mega)
- **Compositional**: Build complex units like `kg.m/s2`
- **Universal**: Covers all scientific, medical, and engineering units

## Building Blocks

UCUM is built from five fundamental components:

### 1. Base Units (The Foundation)
The 7 SI base units from which all others derive:
- `m` - meter (length)
- `g` - gram (mass) 
- `s` - second (time)
- `A` - ampere (electric current)
- `K` - kelvin (temperature)
- `mol` - mole (amount of substance)
- `cd` - candela (luminous intensity)

### 2. Prefixes (The Multipliers)
Metric prefixes that scale units:
- `k` - kilo (×1000): `kg`, `km`
- `m` - milli (×0.001): `mg`, `mL`
- `u` - micro (×0.000001): `ug`, `um`
- `M` - mega (×1,000,000): `MHz`

### 3. Operators (The Combiners)
Mathematical operations to build complex units:
- `.` - multiplication: `N.m` (Newton-meter)
- `/` - division: `m/s` (meters per second)
- `2` - exponentiation: `m2` (square meter)
- `-1` - negative exponent: `s-1` (per second)

### 4. Derived Units (The Shortcuts)
Named units defined from base units:
- `N` = `kg.m/s2` (Newton - force)
- `J` = `N.m` (Joule - energy)
- `W` = `J/s` (Watt - power)
- `Hz` = `s-1` (Hertz - frequency)

### 5. Special Notations
- **Square brackets** `[...]` - Arbitrary units: `[in_i]` (inch), `[degF]` (Fahrenheit)
- **Curly braces** `{...}` - Annotations: `mg{hemoglobin}`, `{tablets}`
- **Numbers** - Coefficients: `10.m` (10 meters)

## Examples

```
Simple:        m, kg, s
Prefixed:      km (k + m), mg (m + g)
Complex:       kg.m/s2 (mass × length ÷ time²)
With powers:   m3/s (volume flow rate)
Special:       Cel (Celsius), pH, B[SPL] (see [special-units.md](./special-units.md))
Annotated:     mg{total}/dL (concentration with context)
```

**Bottom line**: UCUM is how computers talk about units without confusion.

## References

- [UCUM Grammar](./ucum-grammar.md) - How UCUM expressions are parsed
- [Special Units](./special-units.md) - Units with non-linear conversions
- [UCUM Specification](https://ucum.org/ucum) - The official UCUM specification