/**
 * Safe, zero-dependency math expression parser used by <InteractiveGraph />.
 *
 * Why a custom parser instead of eval() or a large library?
 *   1. Security: never runs eval() or Function() on user input.
 *   2. Mobile speed: tiny footprint (~3 KB) for students on limited mobile data.
 *   3. Easy to extend: add a function to SUPPORTED_FUNCTIONS or a constant to
 *      SUPPORTED_CONSTANTS below and it works everywhere automatically.
 *
 * Operator precedence (lowest to highest):
 *   1. Addition & subtraction:       a + b, a - b
 *   2. Multiplication & division:    a * b, a / b  (plus implicit: 2x, 3(x + 1))
 *   3. Unary sign:                   -x, +x
 *   4. Exponents (right-to-left):    x^2, 2^3^2
 *   5. Atoms:                        numbers, variables, constants, fn(...), (...)
 */

/** Built-in math functions available inside graph expressions (case-insensitive). */
export const SUPPORTED_FUNCTIONS: Record<string, (value: number) => number> = {
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

/** Built-in named constants available inside graph expressions (case-insensitive). */
export const SUPPORTED_CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

type Operator = '+' | '-' | '*' | '/' | '^';

type Token =
  | {type: 'number'; value: number}
  | {type: 'ident'; value: string}
  | {type: 'op'; value: Operator}
  | {type: 'lparen'}
  | {type: 'rparen'};

type AstNode =
  | {kind: 'number'; value: number}
  | {kind: 'variable'; name: string}
  | {kind: 'unary'; op: '+' | '-'; operand: AstNode}
  | {kind: 'binary'; op: Operator; left: AstNode; right: AstNode}
  | {kind: 'call'; fn: (value: number) => number; argument: AstNode};

/**
 * Step 1: Convert raw text like "2x^2 - 3x + 1" into a flat list of tokens.
 * Also inserts implicit "*" tokens (e.g. "2x" -> "2 * x", "2(x+1)" -> "2 * (x+1)").
 */
function tokenize(input: string): Token[] {
  const rawTokens: Token[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];

    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // Numbers (integers and decimals like 3.14 or .5)
    if (/[0-9.]/.test(char)) {
      let digits = '';
      while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
        digits += input[cursor++];
      }
      const parsed = Number(digits);
      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid number: ${digits}`);
      }
      rawTokens.push({type: 'number', value: parsed});
      continue;
    }

    // Identifiers: variables (x, a, b), constants (pi, e), or function names (sin, sqrt)
    if (/[a-zA-Z_]/.test(char)) {
      let name = '';
      while (cursor < input.length && /[a-zA-Z0-9_]/.test(input[cursor])) {
        name += input[cursor++];
      }
      rawTokens.push({type: 'ident', value: name});
      continue;
    }

    if (char === '+' || char === '-' || char === '*' || char === '/' || char === '^') {
      rawTokens.push({type: 'op', value: char});
      cursor++;
      continue;
    }

    if (char === '(') {
      rawTokens.push({type: 'lparen'});
      cursor++;
      continue;
    }

    if (char === ')') {
      rawTokens.push({type: 'rparen'});
      cursor++;
      continue;
    }

    throw new Error(`Unexpected character "${char}"`);
  }

  return insertImplicitMultiplication(rawTokens);
}

function insertImplicitMultiplication(rawTokens: Token[]): Token[] {
  const tokens: Token[] = [];

  for (const currentToken of rawTokens) {
    const previousToken = tokens[tokens.length - 1];

    if (previousToken) {
      const previousIsValue =
        previousToken.type === 'number' ||
        previousToken.type === 'rparen' ||
        (previousToken.type === 'ident' &&
          !(previousToken.value.toLowerCase() in SUPPORTED_FUNCTIONS));

      const currentStartsValue =
        currentToken.type === 'ident' ||
        currentToken.type === 'lparen' ||
        currentToken.type === 'number';

      if (previousIsValue && currentStartsValue) {
        tokens.push({type: 'op', value: '*'});
      }
    }

    tokens.push(currentToken);
  }

  return tokens;
}

/**
 * Step 2: Parse the token list into an Abstract Syntax Tree (AST) following
 * standard mathematical order of operations (BODMAS / PEMDAS).
 */
function parseTokens(tokens: Token[]): AstNode {
  let index = 0;

  const peek = (): Token | undefined => tokens[index];
  const consume = (): Token => tokens[index++];

  // Level 1: Addition and subtraction
  function parseAddSub(): AstNode {
    let left = parseMulDiv();
    while (true) {
      const token = peek();
      if (token?.type === 'op' && (token.value === '+' || token.value === '-')) {
        consume();
        left = {kind: 'binary', op: token.value, left, right: parseMulDiv()};
      } else {
        break;
      }
    }
    return left;
  }

  // Level 2: Multiplication and division
  function parseMulDiv(): AstNode {
    let left = parseUnary();
    while (true) {
      const token = peek();
      if (token?.type === 'op' && (token.value === '*' || token.value === '/')) {
        consume();
        left = {kind: 'binary', op: token.value, left, right: parseUnary()};
      } else {
        break;
      }
    }
    return left;
  }

  // Level 3: Unary plus and minus (ensures "-x^2" means "-(x^2)", not "(-x)^2")
  function parseUnary(): AstNode {
    const token = peek();
    if (token?.type === 'op' && (token.value === '+' || token.value === '-')) {
      consume();
      return {kind: 'unary', op: token.value, operand: parseUnary()};
    }
    return parsePower();
  }

  // Level 4: Exponents (right-associative: "2^3^2" = "2^(3^2)" = 512)
  function parsePower(): AstNode {
    const base = parsePrimary();
    const token = peek();
    if (token?.type === 'op' && token.value === '^') {
      consume();
      return {kind: 'binary', op: '^', left: base, right: parseUnary()};
    }
    return base;
  }

  // Level 5: Numbers, variables, constants, function calls, and parentheses
  function parsePrimary(): AstNode {
    const token = peek();
    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'number') {
      consume();
      return {kind: 'number', value: token.value};
    }

    if (token.type === 'ident') {
      consume();
      const lowerName = token.value.toLowerCase();

      if (lowerName in SUPPORTED_FUNCTIONS) {
        if (peek()?.type !== 'lparen') {
          throw new Error(`Expected "(" after function ${token.value}`);
        }
        consume(); // '('
        const argument = parseAddSub();
        if (peek()?.type !== 'rparen') {
          throw new Error(`Expected ")" after ${token.value}(...)`);
        }
        consume(); // ')'
        return {kind: 'call', fn: SUPPORTED_FUNCTIONS[lowerName], argument};
      }

      if (lowerName in SUPPORTED_CONSTANTS) {
        return {kind: 'number', value: SUPPORTED_CONSTANTS[lowerName]};
      }

      return {kind: 'variable', name: token.value};
    }

    if (token.type === 'lparen') {
      consume(); // '('
      const inner = parseAddSub();
      if (peek()?.type !== 'rparen') {
        throw new Error('Missing closing parenthesis ")"');
      }
      consume(); // ')'
      return inner;
    }

    throw new Error('Invalid syntax in expression');
  }

  const root = parseAddSub();
  if (index < tokens.length) {
    throw new Error('Unexpected trailing input in expression');
  }
  return root;
}

/** Step 3: Evaluate a compiled AST against variable values (e.g. { x: 2, a: 1 }). */
function evaluateNode(node: AstNode, variables: Record<string, number>): number {
  switch (node.kind) {
    case 'number':
      return node.value;

    case 'variable': {
      const value = variables[node.name];
      return typeof value === 'number' ? value : Number.NaN;
    }

    case 'unary': {
      const value = evaluateNode(node.operand, variables);
      return node.op === '-' ? -value : value;
    }

    case 'call':
      return node.fn(evaluateNode(node.argument, variables));

    case 'binary': {
      const leftValue = evaluateNode(node.left, variables);
      const rightValue = evaluateNode(node.right, variables);
      switch (node.op) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          return rightValue === 0 ? Number.NaN : leftValue / rightValue;
        case '^':
          return Math.pow(leftValue, rightValue);
      }
    }
  }
}

export type CompiledMathFn = (variables: Record<string, number>) => number;

/**
 * Compile a math string into a fast reusable evaluator function.
 * Returns `null` if the string is empty or contains a syntax error
 * (useful while a student is mid-way through typing in the graph sandbox).
 */
export function compileExpression(expression: string): CompiledMathFn | null {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return null;
    const ast = parseTokens(tokens);
    return (variables: Record<string, number>) => evaluateNode(ast, variables);
  } catch {
    return null;
  }
}
