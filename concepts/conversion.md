# Conversion

Transforming [quantities](./quantity.md) between different [unit expressions](./unit-expression.md) while preserving their physical meaning.

## Conversion Flow

```
Parse → Resolve → Normalize → Check Commensurability → Convert
```

### 1. Parse Unit Expressions
Convert strings to [[ast-conversion-pipeline|AST]] using the [[parse|parser]]:
- `"mg/dL"` → AST representation
- `"g/L"` → AST representation

### 2. Resolve Units
Replace string atoms with actual unit definitions:
- Look up atoms in unit tables
- Apply prefix scales
- Link to [[dimension|dimensions]]

### 3. Normalize to Canonical Form
Transform to [[canonical-form|canonical representation]]:
- Combine all scale factors
- Reduce to base units
- Calculate dimension vector

### 4. Check Commensurability
Units are commensurable if they have the same dimension:
- Compare dimension vectors
- Units with different dimensions cannot be converted

### 5. Apply Conversion

#### For Proper Units (§18-20)
Linear conversion using magnitude ratio:
```
factor = magnitude_from / magnitude_to
result = value × factor
```

#### For Special Units (§21-23)
Non-ratio scale units (e.g., °C, pH, dB) require special handling with conversion functions.
See [special-units.md](./special-units.md) for a complete reference of all special units and their functions.

##### Special Function Definitions

**Temperature Functions:**
- `cel(1 K)`: Celsius
  - f_Cel(x) = x - 273.15 (Kelvin → Celsius)
  - f_Cel⁻¹(x) = x + 273.15 (Celsius → Kelvin)
- `degf(5 K/9)`: Fahrenheit
  - f_Fah(x) = 9/5 × x - 459.67 (Kelvin → Fahrenheit)
  - f_Fah⁻¹(x) = 5/9 × (x + 459.67) (Fahrenheit → Kelvin)
- `degre(5 K/4)`: Réaumur
  - f_Re(x) = 4/5 × x - 218.52 (Kelvin → Réaumur)
  - f_Re⁻¹(x) = 5/4 × (x + 218.52) (Réaumur → Kelvin)

**Logarithmic Functions:**
- `pH(1 mol/l)`: pH scale
  - f_pH(x) = -lg(x) = -log₁₀(x)
  - f_pH⁻¹(x) = 10⁻ˣ
- `ln(1 1)`: Neper (natural log)
  - f_Np(x) = ln(x)
  - f_Np⁻¹(x) = eˣ
- `ld(1 1)`: Bit (binary log)
  - f_bit(x) = log₂(x)
  - f_bit⁻¹(x) = 2ˣ

**Trigonometric Functions:**
- `100tan(1 rad)`: Prism diopter / Percent slope
  - f_PD(α) = tan(α) × 100
  - f_PD⁻¹(x) = arctan(x/100)

**Homeopathic Potency Functions:**
- `hpX(1 l)`: Decimal series
  - f_hpX(x) = -lg(x)
  - f_hpX⁻¹(x) = 10⁻ˣ
- `hpC(1 l)`: Centesimal series
  - f_hpC(x) = -ln(x)/ln(100)
  - f_hpC⁻¹(x) = 100⁻ˣ

##### Conversion Algorithm for Special Units

1. **Parse and identify** special unit with its function
2. **Apply inverse function** to convert to proper unit
3. **Perform linear conversion** if needed
4. **Apply forward function** to target special unit

Example: Convert 25°C to °F
```typescript
// 1. Apply f_Cel⁻¹ to get Kelvin
kelvin = 25 + 273.15 = 298.15 K

// 2. Apply f_Fah to get Fahrenheit  
fahrenheit = 9/5 × 298.15 - 459.67 = 77°F
```

Example: Convert pH 7 to mol/L
```typescript
// Apply f_pH⁻¹
concentration = 10⁻⁷ = 0.0000001 mol/L
```

#### For Arbitrary Units (§24-26)
Cannot be converted to any other unit type.

## Examples

### Simple Linear Conversion
`100 mg → g`
1. Parse: `100` with unit `mg`
2. Resolve: `m` = 10⁻³, `g` = base unit for mass
3. Canonical: magnitude = 10⁻³, dimension = [0,1,0,0,0,0,0]
4. Target canonical: magnitude = 1, same dimension
5. Convert: `100 × 10⁻³ / 1 = 0.1 g`

### Complex Expression
`5 mg/dL → g/L`
1. Parse both expressions
2. Resolve: `mg/dL` = 10⁻³ g / 10⁻¹ L = 10⁻² g/L
3. Both have dimension [-3,1,0,0,0,0,0]
4. Convert: `5 × 10⁻² = 0.05 g/L`
