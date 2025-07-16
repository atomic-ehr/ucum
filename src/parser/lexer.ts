export type TokenType = 
  | 'ATOM'
  | 'PREFIX'
  | 'DIGIT'
  | 'DOT'
  | 'SLASH'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACE'
  | 'RBRACE'
  | 'CARET'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  length: number;
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;
      
      const char = this.input[this.position];
      
      if (char === '.') {
        this.addToken('DOT', char);
      } else if (char === '/') {
        this.addToken('SLASH', char);
      } else if (char === '(') {
        this.addToken('LPAREN', char);
      } else if (char === ')') {
        this.addToken('RPAREN', char);
      } else if (char === '{') {
        this.addToken('LBRACE', char);
      } else if (char === '}') {
        this.addToken('RBRACE', char);
      } else if (char === '^') {
        this.addToken('CARET', char);
      } else if (char === '+') {
        this.addToken('PLUS', char);
      } else if (char === '-') {
        this.addToken('MINUS', char);
      } else if (char === '*') {
        this.addToken('STAR', char);
      } else if (char && this.isDigit(char)) {
        this.readNumber();
      } else if (char && (this.isLetter(char) || char === '[' || char === '%' || char === "'")) {
        this.readAtomOrPrefix();
      } else {
        throw new Error(`Unexpected character '${char}' at position ${this.position}`);
      }
    }
    
    this.tokens.push({ type: 'EOF', value: '', position: this.position, length: 0 });
    return this.tokens;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (!char || !/\s/.test(char)) break;
      this.position++;
    }
  }

  private isDigit(char: string | undefined): boolean {
    if (!char) return false;
    return /[0-9]/.test(char);
  }

  private isLetter(char: string | undefined): boolean {
    if (!char) return false;
    return /[a-zA-Z]/.test(char);
  }

  private readNumber(): void {
    const start = this.position;
    while (this.position < this.input.length && this.input[this.position] && this.isDigit(this.input[this.position])) {
      this.position++;
    }
    const value = this.input.slice(start, this.position);
    this.tokens.push({ type: 'DIGIT', value, position: start, length: value.length });
  }

  private readAtomOrPrefix(): void {
    const start = this.position;
    let value = '';
    const char = this.input[this.position];
    if (!char) return;
    
    // Handle special cases like [, %, '
    if (char === '[') {
      // Read until matching ]
      value += this.input[this.position++];
      while (this.position < this.input.length && this.input[this.position] !== ']') {
        value += this.input[this.position++];
      }
      if (this.position < this.input.length && this.input[this.position] === ']') {
        value += this.input[this.position++];
      }
    } else if (char === '%' || char === "'") {
      value = char;
      this.position++;
    } else {
      // Read letters
      while (this.position < this.input.length && this.input[this.position] && (this.isLetter(this.input[this.position]) || this.input[this.position] === '_')) {
        value += this.input[this.position++];
      }
    }
    
    // For now, mark everything as ATOM - the parser will disambiguate
    this.tokens.push({ type: 'ATOM', value, position: start, length: value.length });
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({ type, value, position: this.position, length: value.length });
    this.position++;
  }
}