/**
 * Lightweight, zero-dependency, safe recursive-descent math expression parser
 * for Schwork's <InteractiveGraph /> component.
 *
 * Supports:
 *   - Operators: +, -, *, /, ^ (right-associative), unary +, unary -
 *   - Implicit multiplication: 2x, 3(x + 1), a*x^2, (x+1)(x-1), 2sin(x)
 *   - Constants: pi, e
 *   - Functions: sin, cos, tan, asin, acos, atan, sqrt, abs, ln, log, exp, floor, ceil, round
 *   - Variables: x plus any slider parameter names (a, b, c, m, k, etc.)
 *
 * Never uses eval() or Function() — safe and fast (~3 KB) for mobile devices.
 */

type Token =
  | {type: 'number'; value: number}
  | {type: 'ident'; value: string}
  | {type: 'op'; value: '+' | '-' | '*' | '/' | '^'}
  | {type: 'lparen'}
  | {type: 'rparen'}
  | {type: 'comma'};

const FUNCTIONS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

function tokenize(input: string): Token[] {
  const raw: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i++];
      }
      const value = Number(numStr);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid number: ${numStr}`);
      }
      raw.push({type: 'number', value});
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        ident += input[i++];
      }
      raw.push({type: 'ident', value: ident});
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      raw.push({type: 'op', value: ch});
      i++;
      continue;
    }

    if (ch === '(') {
      raw.push({type: 'lparen'});
      i++;
      continue;
    }

    if (ch === ')') {
      raw.push({type: 'rparen'});
      i++;
      continue;
    }

    if (ch === ',') {
      raw.push({type: 'comma'});
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}"`);
  }

  // Insert implicit multiplication tokens where mathematically implied:
  // e.g. 2x -> 2*x, 2(x+1) -> 2*(x+1), (x+1)(x-1) -> (x+1)*(x-1), 2sin(x) -> 2*sin(x)
  const tokens: Token[] = [];
  for (let idx = 0; idx < raw.length; idx++) {
    const cur = raw[idx];
    const prev = tokens[tokens.length - 1];
    if (prev) {
      const prevCanMultiply =
        prev.type === 'number' ||
        prev.type === 'rparen' ||
        (prev.type === 'ident' && !(prev.value.toLowerCase() in FUNCTIONS));
      const curCanMultiply =
        cur.type === 'ident' || cur.type === 'lparen' || cur.type === 'number';

      if (prevCanMultiply && curCanMultiply) {
        tokens.push({type: 'op', value: '*'});
      }
    }
    tokens.push(cur);
  }

  return tokens;
}

type Node =
  | {kind: 'num'; value: number}
  | {kind: 'var'; name: string}
  | {kind: 'unary'; op: '+' | '-'; arg: Node}
  | {kind: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: Node; right: Node}
  | {kind: 'call'; fn: (v: number) => number; arg: Node};

function parseTokens(tokens: Token[]): Node {
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpression(): Node {
    let left = parseTerm();
    while (true) {
      const tok = peek();
      if (tok && tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
        consume();
        const right = parseTerm();
        left = {kind: 'binary', op: tok.value, left, right};
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm(): Node {
    let left = parseUnary();
    while (true) {
      const tok = peek();
      if (tok && tok.type === 'op' && (tok.value === '*' || tok.value === '/')) {
        consume();
        const right = parseUnary();
        left = {kind: 'binary', op: tok.value, left, right};
      } else {
        break;
      }
    }
    return left;
  }

  function parseUnary(): Node {
    const tok = peek();
    if (tok && tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
      consume();
      return {kind: 'unary', op: tok.value, arg: parseUnary()};
    }
    return parsePower();
  }

  function parsePower(): Node {
    const base = parsePrimary();
    const tok = peek();
    if (tok && tok.type === 'op' && tok.value === '^') {
      consume();
      const exponent = parseUnary(); // Right-associative: 2^3^2 and -x^2 handled properly
      return {kind: 'binary', op: '^', left: base, right: exponent};
    }
    return base;
  }

  function parsePrimary(): Node {
    const tok = peek();
    if (!tok) {
      throw new Error('Unexpected end of expression');
    }

    if (tok.type === 'number') {
      consume();
      return {kind: 'num', value: tok.value};
    }

    if (tok.type === 'ident') {
      consume();
      const lower = tok.value.toLowerCase();
      if (lower in FUNCTIONS) {
        const next = peek();
        if (!next || next.type !== 'lparen') {
          throw new Error(`Expected "(" after function ${tok.value}`);
        }
        consume();
        const arg = parseExpression();
        const close = peek();
        if (!close || close.type !== 'rparen') {
          throw new Error(`Expected ")" after ${tok.value}(...)`);
        }
        consume();
        return {kind: 'call', fn: FUNCTIONS[lower], arg};
      }
      if (lower in CONSTANTS) {
        return {kind: 'num', value: CONSTANTS[lower]};
      }
      return {kind: 'var', name: tok.value};
    }

    if (tok.type === 'lparen') {
      consume();
      const expr = parseExpression();
      const close = peek();
      if (!close || close.type !== 'rparen') {
        throw new Error('Unclosed parenthesis');
      }
      consume();
      return expr;
    }

    throw new Error('Invalid expression syntax');
  }

  const ast = parseExpression();
  if (pos < tokens.length) {
    throw new Error('Unexpected trailing tokens');
  }
  return ast;
}

function evalNode(node: Node, scope: Record<string, number>): number {
  switch (node.kind) {
    case 'num':
      return node.value;
    case 'var': {
      const val = scope[node.name];
      return typeof val === 'number' ? val : Number.NaN;
    }
    case 'unary': {
      const v = evalNode(node.arg, scope);
      return node.op === '-' ? -v : v;
    }
    case 'call':
      return node.fn(evalNode(node.arg, scope));
    case 'binary': {
      const l = evalNode(node.left, scope);
      const r = evalNode(node.right, scope);
      switch (node.op) {
        case '+':
          return l + r;
        case '-':
          return l - r;
        case '*':
          return l * r;
        case '/':
          return r === 0 ? Number.NaN : l / r;
        case '^':
          return Math.pow(l, r);
      }
    }
  }
}

export type CompiledMathFn = (scope: Record<string, number>) => number;

export function compileExpression(expr: string): CompiledMathFn | null {
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return null;
    const ast = parseTokens(tokens);
    return (scope: Record<string, number>) => evalNode(ast, scope);
  } catch {
    return null;
  }
}
