import test from 'node:test';
import assert from 'node:assert/strict';
import {compileExpression} from '../src/utils/mathParser.ts';
import {
  buildAxisTicks,
  formatTickLabel,
  getNiceTickStep,
  mathToSvgX,
  mathToSvgY,
  sampleCurvePath,
  svgToMathX,
} from '../src/components/lesson/graphMath.ts';

test('chooses clean human-friendly axis tick spacing', () => {
  assert.equal(getNiceTickStep(16), 2);
  assert.equal(getNiceTickStep(10), 1);
  assert.deepEqual(buildAxisTicks([-4, 4]), [-4, -3, -2, -1, 0, 1, 2, 3, 4]);
});

test('formats tick labels without -0 or ugly float noise', () => {
  assert.equal(formatTickLabel(-0), '0');
  assert.equal(formatTickLabel(1e-12), '0');
  assert.equal(formatTickLabel(2.5), '2.5');
});

test('maps math coordinates to SVG pixels and back accurately', () => {
  const xRange: [number, number] = [-10, 10];
  const yRange: [number, number] = [-5, 5];

  const svgX = mathToSvgX(4, xRange);
  assert.ok(Math.abs(svgToMathX(svgX, xRange) - 4) < 1e-9);

  // Higher mathematical y should map to a smaller SVG y pixel value
  assert.ok(mathToSvgY(5, yRange) < mathToSvgY(-5, yRange));
});

test('samples curves cleanly and lifts the pen across asymptotes', () => {
  const linePath = sampleCurvePath(compileExpression('2x + 1'), {}, [-5, 5], [-10, 10], 20);
  assert.ok(linePath.startsWith('M'));
  assert.ok(linePath.includes('L'));

  // 1/x jumps sharply across x = 0 so it should produce multiple disconnected M segments
  const hyperbola = sampleCurvePath(compileExpression('1 / x'), {}, [-5, 5], [-5, 5], 100);
  const moveCommands = hyperbola.match(/M/g) ?? [];
  assert.ok(moveCommands.length >= 2, 'Expected asymptote break in 1/x path');
});
