import type { Expression, BinaryOp, UnaryOp, Unit, Factor, Group } from './ast';
import type { ParseResult, ParseError, ParseWarning } from './types';
import { Lexer } from './lexer';
import type { Token, TokenType } from './lexer';
import { prefixes } from '../prefixes';
import { units } from '../units';

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParseError[] = [];
  private warnings: ParseWarning[] = [];
  private input: string;

  constructor(input: string) {
    this.input = input;
    const lexer = new Lexer(input);
    this.tokens = lexer.tokenize();
  }

  parse(): ParseResult {
    const ast = this.tryParseExpression();
    
    // Check for trailing tokens
    if (!this.isAtEnd() && this.errors.length === 0) {
      const token = this.peek();
      this.reportError('unexpected_token', 
        `Unexpected token: ${token.value}`, 
        token
      );
    }
    
    return {
      ast,
      errors: this.errors,
      warnings: this.warnings,
      input: this.input
    };
  }

  private tryParseExpression(): Expression | undefined {
    try {
      return this.parseMainTerm();
    } catch (e) {
      // Error already reported via reportError
      return undefined;
    }
  }

  private reportError(type: ParseError['type'], message: string, token?: Token): void {
    const errorToken = token || this.peek();
    this.errors.push({
      type,
      message,
      position: errorToken.position,
      length: errorToken.length,
      token: errorToken
    });
  }

  private reportWarning(type: ParseWarning['type'], message: string, token?: Token, suggestion?: string): void {
    const warnToken = token || this.peek();
    this.warnings.push({
      type,
      message,
      position: warnToken.position,
      length: warnToken.length,
      suggestion
    });
  }

  private parseMainTerm(): Expression {
    // Handle optional leading /
    if (this.check('SLASH')) {
      this.advance();
      const operand = this.parseTerm();
      if (!operand) {
        throw new Error('Parse failed');
      }
      return {
        type: 'unary',
        operator: '/',
        operand
      } as UnaryOp;
    }
    
    const term = this.parseTerm();
    if (!term) {
      throw new Error('Parse failed');
    }
    return term;
  }

  private parseTerm(): Expression | undefined {
    let left = this.parseComponent();
    if (!left) return undefined;
    
    // Handle binary operators with left-to-right associativity
    while (this.match('DOT', 'SLASH')) {
      const operator = this.previous().value as '.' | '/';
      const right = this.parseComponent();
      if (!right) {
        this.reportError('unexpected_eof', 'Expected expression after operator');
        return left; // Return partial AST
      }
      left = {
        type: 'binary',
        operator,
        left,
        right
      } as BinaryOp;
    }
    
    return left;
  }

  private parseComponent(): Expression | undefined {
    // Handle parentheses
    if (this.match('LPAREN')) {
      const expr = this.parseTerm();
      if (!expr) {
        this.reportError('syntax', 'Expected expression inside parentheses');
        this.synchronize();
        return undefined;
      }
      
      if (!this.check('RPAREN')) {
        this.reportError('unexpected_eof', 'Missing closing parenthesis');
        // Continue as if it was there
      } else {
        this.consume('RPAREN', "Expected ')' after expression");
      }
      
      return {
        type: 'group',
        expression: expr
      } as Group;
    }
    
    // Handle annotations without preceding unit (standalone annotation)
    if (this.match('LBRACE')) {
      const annotation = this.parseAnnotationContent();
      if (!this.check('RBRACE')) {
        this.reportError('unexpected_eof', 'Missing closing brace');
      } else {
        this.consume('RBRACE', "Expected '}' after annotation");
      }
      
      // Check for very long annotations
      if (annotation.length > 50) {
        this.reportWarning('ambiguous', 
          'Very long annotation might be an error', 
          this.previous(),
          'Consider using shorter, clearer annotations'
        );
      }
      
      return {
        type: 'factor',
        value: 1,
        annotation
      } as Factor;
    }
    
    // Handle special units starting with digits (10*, 10^)
    if (this.check('DIGIT') && this.peek().value === '10' && this.peekNext()) {
      const next = this.peekNext();
      if (next && (next.type === 'STAR' || next.type === 'CARET')) {
        return this.parseSpecialUnit();
      }
    }
    
    // Handle numbers (factors)
    if (this.check('DIGIT')) {
      return this.parseFactor();
    }
    
    // Otherwise, parse as annotatable unit
    return this.parseAnnotatable();
  }

  private parseAnnotatable(): Expression | undefined {
    const unit = this.parseSimpleUnit();
    if (!unit) return undefined;
    
    // Check for annotation
    if (this.match('LBRACE')) {
      const annotation = this.parseAnnotationContent();
      if (!this.check('RBRACE')) {
        this.reportError('unexpected_eof', 'Missing closing brace');
      } else {
        this.consume('RBRACE', "Expected '}' after annotation");
      }
      
      // Check for very long annotations
      if (annotation.length > 50) {
        this.reportWarning('ambiguous', 
          'Very long annotation might be an error', 
          this.previous(),
          'Consider using shorter, clearer annotations'
        );
      }
      
      unit.annotation = annotation;
    }
    
    return unit;
  }

  private parseSimpleUnit(): Unit | undefined {
    if (this.isAtEnd()) {
      this.reportError('unexpected_eof', 'Expected unit');
      return undefined;
    }
    
    const token = this.advance();
    
    if (token.type !== 'ATOM') {
      this.reportError('unexpected_token', `Expected unit atom, got ${token.type}`, token);
      return undefined;
    }
    
    const value = token.value;
    
    // Try to match prefixes (longest match first)
    let prefix: string | undefined;
    let atom: string = value;
    
    // First check if the whole value is a valid unit
    if (!units[value]) {
      // Check for 2-character prefix (da)
      if (value.length >= 2 && prefixes[value.substring(0, 2)]) {
        const potentialAtom = value.substring(2);
        if (units[potentialAtom]) {
          prefix = value.substring(0, 2);
          atom = potentialAtom;
        }
      }
      // Check for 1-character prefix
      else if (value.length >= 1 && prefixes[value.substring(0, 1)]) {
        const potentialAtom = value.substring(1);
        if (units[potentialAtom]) {
          prefix = value.substring(0, 1);
          atom = potentialAtom;
        }
      }
    }
    
    const unit: Unit = {
      type: 'unit',
      atom
    };
    
    if (prefix) {
      unit.prefix = prefix;
    }
    
    // Check for exponent
    const exponent = this.parseExponent();
    if (exponent !== null) {
      unit.exponent = exponent.value;
      if (exponent.format) {
        unit.exponentFormat = exponent.format;
      }
    }
    
    return unit;
  }

  private parseSpecialUnit(): Unit | undefined {
    // Handle 10* and 10^
    const ten = this.advance(); // consume '10'
    const op = this.advance(); // consume '*' or '^'
    
    let atom: string;
    if (op.type === 'STAR') {
      atom = '10*';
    } else if (op.type === 'CARET') {
      atom = '10^';
    } else {
      this.reportError('syntax', `Unexpected special unit format: 10${op.value}`, op);
      return undefined;
    }
    
    const unit: Unit = {
      type: 'unit',
      atom
    };
    
    // Check for exponent
    const exponent = this.parseExponent();
    if (exponent !== null) {
      unit.exponent = exponent.value;
      if (exponent.format) {
        unit.exponentFormat = exponent.format;
      }
    }
    
    return unit;
  }

  private parseExponent(): { value: number; format?: '^' | '+' | '' } | null {
    // Check for different exponent formats
    if (this.match('CARET')) {
      // ^exponent format
      const sign = this.match('MINUS') ? -1 : (this.match('PLUS'), 1);
      if (!this.check('DIGIT')) {
        this.reportError('syntax', 'Expected digits after ^');
        return null;
      }
      const digits = this.advance();
      return { value: sign * parseInt(digits.value), format: '^' };
    } else if (this.match('PLUS', 'MINUS')) {
      // +exponent or -exponent format
      const isNegative = this.previous().value === '-';
      if (!this.check('DIGIT')) {
        this.reportError('syntax', 'Expected digits after sign');
        return null;
      }
      const digits = this.advance();
      return { value: (isNegative ? -1 : 1) * parseInt(digits.value), format: '+' };
    } else if (this.check('DIGIT')) {
      // Direct digit (superscript notation)
      const digits = this.advance();
      return { value: parseInt(digits.value) };
    }
    
    return null;
  }

  private parseFactor(): Factor | undefined {
    if (!this.check('DIGIT')) {
      this.reportError('invalid_number', 'Expected number');
      return undefined;
    }
    
    const digits = this.advance();
    const factor: Factor = {
      type: 'factor',
      value: parseInt(digits.value)
    };
    
    // Check for annotation
    if (this.match('LBRACE')) {
      const annotation = this.parseAnnotationContent();
      if (!this.check('RBRACE')) {
        this.reportError('unexpected_eof', 'Missing closing brace');
      } else {
        this.consume('RBRACE', "Expected '}' after annotation");
      }
      
      // Check for very long annotations
      if (annotation.length > 50) {
        this.reportWarning('ambiguous', 
          'Very long annotation might be an error', 
          this.previous(),
          'Consider using shorter, clearer annotations'
        );
      }
      
      factor.annotation = annotation;
    }
    
    return factor;
  }

  private parseAnnotationContent(): string {
    let content = '';
    
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      content += this.advance().value;
    }
    
    return content;
  }

  private synchronize(): void {
    this.advance(); // Skip the problematic token
    
    while (!this.isAtEnd()) {
      // Look for recovery points
      if (this.peek().type === 'SLASH' || 
          this.peek().type === 'DOT' ||
          this.peek().type === 'RPAREN') {
        return;
      }
      this.advance();
    }
  }

  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', position: this.tokens[this.tokens.length - 1]?.position || 0, length: 0 };
  }

  private peekNext(): Token | null {
    if (this.current + 1 < this.tokens.length) {
      return this.tokens[this.current + 1] || null;
    }
    return null;
  }

  private previous(): Token {
    return this.tokens[this.current - 1] || { type: 'EOF', value: '', position: 0, length: 0 };
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    this.reportError('unexpected_token', message);
    throw new Error('Parse failed');
  }
}

export function parseUnit(input: string): ParseResult {
  const parser = new Parser(input);
  return parser.parse();
}