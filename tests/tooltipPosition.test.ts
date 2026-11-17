import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTooltipPlacement,
  NAVBAR_CLEARANCE_PX,
} from '../src/components/lesson/tooltipPosition.ts';

test('keeps centered tooltip unshifted when plenty of horizontal space exists', () => {
  const result = computeTooltipPlacement(
    {left: 500, top: 300, width: 80, height: 24},
    {width: 280, height: 90},
    {width: 1200, height: 800},
  );
  assert.equal(result.shiftX, 0);
  assert.equal(result.placeBelow, false);
});

test('shifts tooltip right when trigger sits near the left viewport edge', () => {
  const result = computeTooltipPlacement(
    {left: 16, top: 300, width: 60, height: 24},
    {width: 300, height: 90},
    {width: 1000, height: 800},
    12,
  );
  // Centered left would be 46 - 150 = -104; clamped to +12 => shiftX = +116
  assert.equal(result.shiftX, 116);
  assert.equal(result.placeBelow, false);
});

test('shifts tooltip left when trigger sits near the right viewport edge', () => {
  const result = computeTooltipPlacement(
    {left: 920, top: 300, width: 60, height: 24},
    {width: 300, height: 90},
    {width: 1000, height: 800},
    12,
  );
  // Centered left would be 950 - 150 = 800; maxLeft is 1000 - 300 - 12 = 688 => shiftX = -112
  assert.equal(result.shiftX, -112);
});

test('flips tooltip below the formula when close to the sticky navbar', () => {
  const result = computeTooltipPlacement(
    {left: 400, top: NAVBAR_CLEARANCE_PX + 40, width: 80, height: 24},
    {width: 280, height: 90},
    {width: 1200, height: 800},
    12,
  );
  assert.equal(result.placeBelow, true);
});
