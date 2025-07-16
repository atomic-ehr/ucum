import { expect } from 'bun:test';
import type { Expression } from '../src/parser/ast';
import type { ParseResult } from '../src/parser/types';

// Helper to convert old-style parser tests to new API
export function expectParseSuccess(result: ParseResult, expected: Expression): void {
  expect(result.errors).toHaveLength(0);
  expect(result.warnings).toHaveLength(0);
  expect(result.ast).toEqual(expected);
}

// Helper to check parse errors
export function expectParseError(result: ParseResult): void {
  expect(result.errors.length).toBeGreaterThan(0);
}