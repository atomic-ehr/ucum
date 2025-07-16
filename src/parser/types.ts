import type { Expression } from './ast';
import type { Token } from './lexer';

export interface ParseResult {
  ast?: Expression;
  errors: ParseError[];
  warnings: ParseWarning[];
  input: string;
}

export interface ParseError {
  type: 'syntax' | 'unexpected_token' | 'unexpected_eof' | 'invalid_number';
  message: string;
  position: number;
  length: number;
  token?: Token;
}

export interface ParseWarning {
  type: 'deprecated_syntax' | 'ambiguous';
  message: string;
  position: number;
  length: number;
  suggestion?: string;
}