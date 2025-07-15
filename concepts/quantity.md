# Quantity

A measurement combining a numerical value with a [unit expression](./unit-expression.md).

## Structure
`quantity = value + unit expression`

## Examples

**Basic**: `5 m`, `70 kg`, `37 Cel`  
**Decimal**: `1.75 m`, `0.5 mg`, `98.6 [degF]`  
**Scientific**: `6.022e23 /mol`, `3e8 m/s`  
**Clinical**: `95 mg/dL`, `120 mm[Hg]`, `500 mg{tab}`

## Key Points
- Value without unit is meaningless (`5` - five what?)
- Unit without value is abstract (`m` - how many meters?)
- Together they form complete information (`5 m` - five meters)

## In UCUM
- [Grammar](./ucum-grammar.md) defines unit expressions only
- Values are handled by implementations
- Standard format: `{value} {unit-expression}`

See also: [Unit](./unit.md) | [Unit Expression](./unit-expression.md)