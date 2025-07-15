# Unit

A **unit** is an atomic measurement standard with a unique UCUM code.

## Grammar
`atomicUnit → baseUnit | derivedUnit | nonMetricUnit`

## Types

**Base Units** (7 SI fundamentals)
- `m` meter, `g` gram, `s` second, `A` ampere
- `K` kelvin, `mol` mole, `cd` candela

**Derived Units** (built from base units)
- `N` newton = `kg.m/s2`
- `J` joule = `N.m`
- `Hz` hertz = `s-1`

**Arbitrary Units** `[...]` (non-metric, no prefixes)
- `[ft_i]` foot, `[lb_av]` pound, `[in_i]` inch
- Square brackets = "defined by convention"
- Cannot take prefixes: no `k[ft_i]`

**Special Units** (non-linear conversions)
- `Cel` = °C (offset from K by 273.15)
- `[degF]` = °F (scale + offset)
- `pH` = -log₁₀[H+]

## Prefixes

Metric multipliers that create new units:
- `k` kilo (×10³): `km`, `kg`, `kW`
- `m` milli (×10⁻³): `mm`, `mg`, `mL`
- `u` micro (×10⁻⁶): `um`, `ug`, `us`

**Case matters**: `m` = milli, `M` = mega

## Properties (from UCUM)

Each unit has:
- **Code**: `m`, `[ft_i]` (case-sensitive)
- **Name**: "meter", "foot"
- **Property**: "length", "mass", "force"
- **[Dimension](./dimension.md)**: Base unit powers `[L,M,T,I,Θ,N,J]`
- **Magnitude**: Conversion factor to base units
- **isMetric**: Can accept prefixes?
    According to UCUM §11, the `isMetric` property determines whether a unit can accept SI prefixes (k, m, μ, etc.).
    Only metric units can have prefixes - You cannot write `k[ft_i]` (kilo-foot)
    Special units are typically non-metric** - Units with non-linear conversions
- **isSpecial**: Needs special conversion?


## Usage

- With prefixes: `km`, `mg`, `ns`
- In [expressions](./unit-expression.md): `mg/dL`, `m/s`
- In [quantities](./quantity.md): `5.2 m`, `37 Cel`

