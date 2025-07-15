# UCUM Grammar

The ANTLR LL(*) grammar for UCUM expressions.

```antlr
grammar UCUM;

// Parser Rules
mainTerm
    : '/' term
    | term
    ;

term
    : term '.' component
    | term '/' component
    | component
    ;

component
    : annotatable annotation
    | annotatable
    | annotation
    | factor
    | '(' term ')'
    ;

annotatable
    : simpleUnit exponent
    | simpleUnit
    ;

simpleUnit
    : ATOM_SYMBOL
    | PREFIX_SYMBOL ATOM_SYMBOL_METRIC
    ;

exponent
    : sign digits
    | digits
    ;

factor
    : digits  // See [[factor]] concept
    ;

digits
    : digit+
    ;

digit
    : '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
    ;

sign
    : '+' | '-'
    ;

annotation
    : '{' ANNOTATION_STRING '}'
    ;

// Lexer Rules
ATOM_SYMBOL
    : [A-Za-z]+  // Define based on your specific requirements
    ;

PREFIX_SYMBOL
    : [A-Za-z]+  // Define based on your specific requirements
    ;

ATOM_SYMBOL_METRIC
    : [A-Za-z]+  // Define based on your specific requirements
    ;

ANNOTATION_STRING
    : ~[{}]+  // Any character except { and }
    ;

// Whitespace handling
WS
    : [ \t\r\n]+ -> skip
    ;
```

## Notes

1. **Case Sensitivity**: The lexer must preserve case (`m` ≠ `M`)
2. **Whitespace**: Generally not allowed within expressions
3. **Annotations**: Preserved but don't affect calculations
4. **Zero Exponents**: Grammar allows but may need semantic validation
