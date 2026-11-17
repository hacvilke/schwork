import test from 'node:test';
import assert from 'node:assert/strict';
import {compileExpression} from '../src/utils/mathParser.ts';

function evalExpr(expr: string, vars: Record<string, number> = {}): number {
  const fn = compileExpression(expr);
  assert.ok(fn, `Expected "${expr}" to compile`);
  return fn(vars);
}

test('evaluates arithmetic & standard operator precedence', () => {
  assert.equal(evalExpr('2 + 3 * 4'), 14);
  assert.equal(evalExpr('(2 + 3) * 4'), 20);
  assert.equal(evalExpr('-x^2', {x: 3}), -9);
  assert.equal(evalExpr('(-x)^2', {x: 3}), 9);
  assert.equal(evalExpr('2^3^2'), 512);
});

test('supports implicit multiplication and named variables', () => {
  assert.equal(evalExpr('2x + 3', {x: 4}), 11);
  assert.equal(evalExpr('(x + 1)(x - 1)', {x: 5}), 24);
  assert.equal(evalExpr('a*x^2 + b*x + c', {a: 1, b: -2, c: -3, x: 3}), 0);
  assert.equal(evalExpr('a*x^2 + b*x + c', {a: 1, b: -2, c: -3, x: 1}), -4);
});

test('supports built-in math functions and constants', () => {
  assert.ok(Math.abs(evalExpr('2sin(pi / 2)') - 2) < 1e-9);
  assert.equal(evalExpr('sqrt(16) + abs(-3)'), 7);
  assert.ok(Math.abs(evalExpr('ln(e)') - 1) < 1e-9);
});

test('handles division by zero and malformed expressions safely', () => {
  assert.ok(Number.isNaN(evalExpr('1 / x', {x: 0})));
  assert.equal(compileExpression(''), null);
  assert.equal(compileExpression('2 + *'), null);
  assert.equal(compileExpression('sin(x'), null);
});
