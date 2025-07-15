# Canonical Form

Canonical form is the standardized representation of any [unit expression](./unit-expression.md) where:
- All derived units are expanded to base units
- All prefixes are converted to numeric values
- All numeric factors are combined into a single magnitude

```
Canonical Form = Magnitude × Base Units with Exponents
```

## Base Units

UCUM defines 7 fundamental base units that form the foundation of all measurements:

| Base Unit | Symbol | Dimension | Measures |
|-----------|--------|-----------|----------|
| meter | m | L | length |
| second | s | T | time |
| gram | g | M | mass |
| radian | rad | A | plane angle |
| kelvin | K | C | temperature |
| coulomb | C | Q | electric charge |
| candela | cd | F | luminous intensity |

## Structure

A canonical form consists of:

1. **Magnitude**: A single numeric value combining all conversion factors
2. **Base unit terms**: Each base unit with its exponent
3. **Special function** (optional): For non-linear conversions like temperature

## Examples

### Simple Units

| Unit | Canonical Form | Process |
|------|----------------|---------|
| `km` | `1000 × m` | k (kilo) = 10³ |
| `mg` | `0.001 × g` | m (milli) = 10⁻³ |
| `μs` | `0.000001 × s` | μ (micro) = 10⁻⁶ |
| `cm²` | `0.0001 × m²` | (10⁻² m)² = 10⁻⁴ m² |

### Derived Units

| Unit | Canonical Form | Derivation |
|------|----------------|------------|
| `N` (newton) | `1 × kg·m·s⁻²` | Force = mass × acceleration |
| `Pa` (pascal) | `1 × kg·m⁻¹·s⁻²` | Pressure = force/area |
| `J` (joule) | `1 × kg·m²·s⁻²` | Energy = force × distance |
| `W` (watt) | `1 × kg·m²·s⁻³` | Power = energy/time |
| `V` (volt) | `1 × kg·m²·s⁻³·C⁻¹` | Voltage = power/current |

### Complex Expressions

| Expression | Canonical Form | Steps |
|------------|----------------|-------|
| `km/h` | `0.277778 × m·s⁻¹` | 1000 m / 3600 s |
| `mg/dL` | `10 × g·m⁻³` | 0.001 g / 0.0001 m³ |
| `cal/g.K` | `4184 × m²·s⁻²·K⁻¹` | 4.184 J / (g·K) |

## Conversion Algorithm

### Step 1: Parse Expression

See [unit-expression.md](./unit-expression.md) for the structure of the UnitExpression.

Break down the unit string into components:
- Factors (numeric values)
- Symbols (units with prefixes and exponents)
- Operators (multiplication, division)

### Step 2: Process Each Component

#### For Symbols:
1. **Separate prefix from unit**: `mg` → prefix `m` + unit `g`
2. **Convert prefix to number**: `m` → 0.001
3. **Look up unit definition**:
   - If base unit: Use directly
   - If derived: Recursively expand

#### For Operators:
- Multiplication: Keep exponents as-is
- Division: Negate exponents

### Step 3: Normalize
1. **Multiply all magnitudes**: Combine all numeric values
2. **Collect base units**: Group by base unit type
3. **Sum exponents**: For each base unit, add all exponents
4. **Remove zeros**: Drop units with exponent = 0
5. **Sort**: Order base units consistently (alphabetically)

## Use Cases

### 1. Unit Comparison
Determine if two units are equivalent:
```
N/m² vs Pa
Both → 1 × kg·m⁻¹·s⁻²
Therefore: N/m² = Pa ✓
```

### 2. Dimensional Analysis
Verify physical equations:
```
E = mc²
[kg·m²·s⁻²] = [kg] × [m·s⁻¹]²
[kg·m²·s⁻²] = [kg·m²·s⁻²] ✓
```

### 3. Unit Conversion
Calculate conversion factors:
```
From: ft = 0.3048 × m
To: mi = 1609.344 × m
Factor: 0.3048 / 1609.344 = 0.000189394
```

### 4. Simplification
Cancel common units:
```
kg·m/s² × s²/m → kg (simplified)
```

## Special Units

Some units require special handling beyond linear scaling:

### Temperature
- **Celsius**: `Cel = K - 273.15`
- **Fahrenheit**: `degF = K × 9/5 - 459.67`

These use conversion functions rather than simple multiplication.

### Logarithmic Units
- **pH**: `pH = -log₁₀[H⁺]`
- **Bel**: `B = log₁₀(P/P₀)`

These represent ratios or logarithms, not direct measurements.

## Implementation Example

```typescript
function toCanonical(unit: UnitExpression): CanonicalForm {
  const result: CanonicalForm = {
    magnitude: 1,
    units: []
  };

  // Process each term in the expression
  for (const term of unit.terms) {
    if (term.type === 'factor') {
      result.magnitude *= term.value;
    } else if (term.type === 'symbol') {
      // Handle prefix
      if (term.prefix) {
        result.magnitude *= getPrefixValue(term.prefix);
      }
      
      // Handle unit
      if (isBaseUnit(term.unit)) {
        addBaseUnit(result.units, term.unit, term.exponent);
      } else {
        // Recursively expand derived unit
        const definition = getUnitDefinition(term.unit);
        const expanded = toCanonical(definition);
        result.magnitude *= Math.pow(expanded.magnitude, term.exponent);
        
        for (const baseUnit of expanded.units) {
          addBaseUnit(result.units, baseUnit.base, 
                     baseUnit.exponent * term.exponent);
        }
      }
    }
  }
  
  // Normalize: combine like terms and sort
  result.units = normalizeUnits(result.units);
  
  return result;
}
```

## Key Properties

1. **Uniqueness**: Each unit has exactly one canonical form
2. **Completeness**: All UCUM units can be expressed in canonical form
3. **Composability**: Operations on canonical forms yield canonical forms
4. **Dimension Preservation**: Canonical form preserves physical dimensions

## Common Patterns

### Metric Scaling
```
kilo-  (k)  → 10³
mega-  (M)  → 10⁶
milli- (m)  → 10⁻³
micro- (μ)  → 10⁻⁶
```

### Dimension Vectors
Canonical forms can be represented as dimension vectors:
```
m²/s → [2, -1, 0, 0, 0, 0, 0]
      [L, T, M, A, C, Q, F]
```

### Common Conversions
```
1 L = 0.001 m³
1 cal = 4.184 J = 4.184 kg·m²·s⁻²
1 atm = 101325 Pa = 101325 kg·m⁻¹·s⁻²
```

## Best Practices

1. **Always normalize**: Ensure consistent representation
2. **Preserve precision**: Use appropriate numeric types
3. **Handle special units**: Check for non-linear conversions
4. **Validate dimensions**: Ensure physical consistency
5. **Cache results**: Canonical conversion can be expensive