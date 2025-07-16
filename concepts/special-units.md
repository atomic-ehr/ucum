# Special Units in UCUM

## What are Special Units?

Special units in UCUM (Unified Code for Units of Measure) are units that require non-linear conversions or special mathematical functions to convert to their base units. Unlike regular units that use simple multiplication factors, special units employ functions such as logarithms, trigonometric functions, or custom conversion formulas.

### Key Characteristics

1. **Non-linear conversions**: Special units cannot be converted using simple multiplication or division
2. **Function-based**: They use mathematical functions (log, ln, tan, sqrt, etc.) or custom conversion functions
3. **Domain-specific**: Often used in specialized fields like acoustics, chemistry, optics, or homeopathy
4. **Marked in UCUM**: Identified by the `isSpecial="yes"` attribute in the UCUM XML specification

## List of Special Functions

### 1. Temperature Conversion Functions

#### `Cel` - Celsius Conversion
- **Purpose**: Converts between Celsius and Kelvin scales
- **Formula**: °C = K - 273.15
- **Used by**: `Cel` (degree Celsius)
- **Example**: 0°C = 273.15 K

#### `degF` - Fahrenheit Conversion
- **Purpose**: Converts between Fahrenheit and Kelvin scales
- **Formula**: °F = (K × 9/5) - 459.67
- **Used by**: `[degF]` (degree Fahrenheit)
- **Function parameter**: 5 K/9

#### `degRe` - Réaumur Conversion
- **Purpose**: Converts between Réaumur and Kelvin scales
- **Formula**: °Ré = (K - 273.15) × 4/5
- **Used by**: `[degRe]` (degree Réaumur)
- **Function parameter**: 5 K/4

### 2. Logarithmic Functions

#### `ln` - Natural Logarithm
- **Purpose**: Natural logarithm (base e)
- **Used by**: `Np` (neper)
- **Application**: Amplitude ratios in engineering

#### `lg` - Common Logarithm
- **Purpose**: Common logarithm (base 10)
- **Used by**: 
  - `B` (bel) - dimensionless ratio
  - `B[W]` (bel watt) - power ratio
  - `B[kW]` (bel kilowatt) - kilowatt power ratio
- **Application**: Sound levels, power ratios

#### `lgTimes2` - Double Common Logarithm
- **Purpose**: 2 × log₁₀(x), used for field quantities
- **Used by**:
  - `B[SPL]` (bel sound pressure) - reference: 2×10⁻⁵ Pa
  - `B[V]` (bel volt) - voltage ratio
  - `B[mV]` (bel millivolt) - millivolt ratio
  - `B[uV]` (bel microvolt) - microvolt ratio
  - `B[10.nV]` (bel 10 nanovolt) - 10 nanovolt ratio
- **Application**: Field quantities (voltage, pressure) vs power quantities

#### `ld` - Binary Logarithm
- **Purpose**: Binary logarithm (base 2)
- **Used by**: `bit_s` (bit)
- **Application**: Information theory

#### `pH` - pH Function
- **Purpose**: Negative logarithm of hydrogen ion concentration
- **Formula**: pH = -log₁₀[H⁺]
- **Used by**: `[pH]` (pH)
- **Reference**: 1 mol/L

### 3. Trigonometric Functions

#### `tanTimes100` - Tangent × 100
- **Purpose**: 100 × tan(x)
- **Used by**: `[p'diop]` (prism diopter)
- **Input unit**: radians
- **Application**: Optics, prism deviation

#### `100tan` - 100 × Tangent
- **Purpose**: 100 × tan(x)
- **Used by**: `%[slope]` (percent of slope)
- **Input unit**: degrees
- **Application**: Grade/slope measurements

### 4. Homeopathic Potency Functions

These functions represent dilution series in homeopathy:

#### `hpX` - Decimal Potency
- **Purpose**: Homeopathic decimal dilution (1:10)
- **Used by**: `[hp'_X]` (homeopathic potency of decimal series)

#### `hpC` - Centesimal Potency
- **Purpose**: Homeopathic centesimal dilution (1:100)
- **Used by**: `[hp'_C]` (homeopathic potency of centesimal series)

#### `hpM` - Millesimal Potency
- **Purpose**: Homeopathic millesimal dilution (1:1000)
- **Used by**: `[hp'_M]` (homeopathic potency of millesimal series)

#### `hpQ` - Quintamillesimal Potency
- **Purpose**: Homeopathic quintamillesimal dilution (1:50000)
- **Used by**: `[hp'_Q]` (homeopathic potency of quintamillesimal series)

### 5. Mathematical Operations

#### `sqrt` - Square Root
- **Purpose**: Square root function
- **Used by**: `[m/s2/Hz^(1/2)]` (meter per square seconds per square root of hertz)
- **Application**: Spectral density measurements

## Summary Statistics

- **Total special units**: 21 (6.7% of all UCUM units)
- **Total unique functions**: 15
- **Most common function type**: Logarithmic (11 units)
- **Fields covered**: Temperature, acoustics, optics, chemistry, homeopathy, information theory

## Implementation Notes

When implementing UCUM unit conversions:

1. Special units require function evaluation, not just multiplication
2. Some functions (like temperature conversions) have offsets in addition to scaling
3. Logarithmic units often have specific reference values
4. The direction of conversion matters (e.g., Celsius to Kelvin vs Kelvin to Celsius)
5. Special units are marked as "retired" when they are deprecated but kept for backward compatibility