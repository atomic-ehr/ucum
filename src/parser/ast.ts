export type Expression = 
  | BinaryOp
  | UnaryOp
  | Unit
  | Factor
  | Group;

export interface BinaryOp {
  type: 'binary';
  operator: '.' | '/';
  left: Expression;
  right: Expression;
}

export interface UnaryOp {
  type: 'unary';
  operator: '/';
  operand: Expression;
}

export interface Unit {
  type: 'unit';
  prefix?: string;
  atom: string;
  exponent?: number;
  exponentFormat?: '^' | '+' | '';
  annotation?: string;
}

export interface Factor {
  type: 'factor';
  value: number;
  annotation?: string;
}

export interface Group {
  type: 'group';
  expression: Expression;
}