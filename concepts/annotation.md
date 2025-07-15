# Annotation

Descriptive text in curly braces `{}` that provides context without affecting calculations.

## Syntax
`{text}` - can contain any characters

## Examples

**With units:**
- `mg{hemoglobin}` - milligrams of hemoglobin
- `mol{creatinine}` - moles of creatinine
- `U{enzyme}/L` - enzyme units per liter

**Standalone:**
- `{RBC}/hpf` - red blood cells per high power field
- `{tablets}` - count of tablets
- `{beats}/min` - beats per minute

## Rules

1. **No mathematical effect**: `mg{total}` = `mg` for calculations
2. **Preserved by parsers**: Must be kept through processing
3. **Multiple allowed**: `mg{total}{plasma}/dL`
4. **Position matters**: `mg{hgb}/dL` ≠ `mg/dL{hgb}`

## Purpose

- **Specify substance**: What's being measured
- **Add context**: Clinical or domain information  
- **Count non-units**: Things without standard units

## Common Uses

**Clinical**: `{WBC}`, `{RBC}`, `{platelets}`  
**Genetic**: `{CAG_repeats}`, `{copies}`  
**Pharmacy**: `{tablets}`, `{capsules}`, `{doses}`

**Key**: Annotations capture real-world context that pure units cannot express.