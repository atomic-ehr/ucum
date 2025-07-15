import type { Expression, BinaryOp, UnaryOp, Unit, Factor, Group } from './ast';
import { Lexer } from './lexer';
import type { Token, TokenType } from './lexer';
import { prefixes } from '../prefixes';
import { units } from '../units';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(input: string) {
    const lexer = new Lexer(input);
    this.tokens = lexer.tokenize();
  }

  parse(): Expression {
    return this.parseMainTerm();
  }

  private parseMainTerm(): Expression {
    // Handle optional leading /
    if (this.check('SLASH')) {
      this.advance();
      return {
        type: 'unary',
        operator: '/',
        operand: this.parseTerm()
      } as UnaryOp;
    }
    
    return this.parseTerm();
  }

  private parseTerm(): Expression {
    let left = this.parseComponent();
    
    // Handle binary operators with left-to-right associativity
    while (this.match('DOT', 'SLASH')) {
      const operator = this.previous().value as '.' | '/';
      const right = this.parseComponent();
      left = {
        type: 'binary',
        operator,
        left,
        right
      } as BinaryOp;
    }
    
    return left;
  }

  private parseComponent(): Expression {
    // Handle parentheses
    if (this.match('LPAREN')) {
      const expr = this.parseTerm();
      this.consume('RPAREN', "Expected ')' after expression");
      return {
        type: 'group',
        expression: expr
      } as Group;
    }
    
    // Handle annotations without preceding unit (standalone annotation)
    if (this.match('LBRACE')) {
      const annotation = this.parseAnnotationContent();
      this.consume('RBRACE', "Expected '}' after annotation");
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

  private parseAnnotatable(): Expression {
    const unit = this.parseSimpleUnit();
    
    // Check for annotation
    if (this.match('LBRACE')) {
      const annotation = this.parseAnnotationContent();
      this.consume('RBRACE', "Expected '}' after annotation");
      unit.annotation = annotation;
    }
    
    return unit;
  }

  private parseSimpleUnit(): Unit {
    const token = this.advance();
    
    if (token.type !== 'ATOM') {
      throw new Error(`Expected unit atom, got ${token.type} at position ${token.position}`);
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

  private parseSpecialUnit(): Unit {
    // Handle 10* and 10^
    const ten = this.advance(); // consume '10'
    const op = this.advance(); // consume '*' or '^'
    
    let atom: string;
    if (op.type === 'STAR') {
      atom = '10*';
    } else if (op.type === 'CARET') {
      atom = '10^';
    } else {
      throw new Error(`Unexpected special unit format: 10${op.value}`);
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
      const digits = this.consume('DIGIT', 'Expected digits after ^');
      return { value: sign * parseInt(digits.value), format: '^' };
    } else if (this.match('PLUS', 'MINUS')) {
      // +exponent or -exponent format
      const isNegative = this.previous().value === '-';
      const digits = this.consume('DIGIT', 'Expected digits after sign');
      return { value: (isNegative ? -1 : 1) * parseInt(digits.value), format: '+' };
    } else if (this.check('DIGIT')) {
      // Direct digit (superscript notation)
      const digits = this.advance();
      return { value: parseInt(digits.value) };
    }
    
    return null;
  }

  private parseFactor(): Factor {
    const digits = this.consume('DIGIT', 'Expected number');
    const factor: Factor = {
      type: 'factor',
      value: parseInt(digits.value)
    };
    
    // Check for annotation
    if (this.match('LBRACE')) {
      factor.annotation = this.parseAnnotationContent();
      this.consume('RBRACE', "Expected '}' after annotation");
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
    return this.tokens[this.current] || { type: 'EOF', value: '', position: this.current };
  }

  private peekNext(): Token | null {
    if (this.current + 1 < this.tokens.length) {
      return this.tokens[this.current + 1] || null;
    }
    return null;
  }

  private previous(): Token {
    return this.tokens[this.current - 1] || { type: 'EOF', value: '', position: this.current - 1 };
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    throw new Error(`${message} at position ${this.peek().position}`);
  }
}

export function parseUnit(input: string): Expression {
  const parser = new Parser(input);
  return parser.parse();
}