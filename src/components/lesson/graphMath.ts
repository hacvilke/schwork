/**
 * Pure SVG coordinate & plotting helpers for <InteractiveGraph />.
 *
 * Keeping math-to-pixel conversions, axis ticks, and curve path sampling out of
 * the React component makes the graph easy to read, tweak, and unit-test.
 */

import type {CompiledMathFn} from '../../utils/mathParser';

export type CurveColor = 'cyan' | 'lime' | 'softCyan' | 'coral';

/** Named theme colours available for curves and plotted points. */
export const CURVE_COLORS: Record<CurveColor, string> = {
  cyan: '#2BB3C0',
  lime: '#C8FF00',
  softCyan: '#7ADBE4',
  coral: '#FF6B6B',
};

/** Fixed SVG viewBox geometry (scales responsively to any phone or desktop width). */
export const GRAPH_LAYOUT = {
  width: 680,
  height: 400,
  paddingTop: 22,
  paddingRight: 22,
  paddingBottom: 34,
  paddingLeft: 42,
  plotWidth: 680 - 42 - 22,
  plotHeight: 400 - 22 - 34,
} as const;

/** Choose a clean human-friendly grid spacing (1, 2, 5, 10, ...) for a given axis span. */
export function getNiceTickStep(axisSpan: number): number {
  const roughStep = axisSpan / 8;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(roughStep, 1e-6))));
  const normalized = roughStep / magnitude;

  if (normalized <= 1.5) return magnitude;
  if (normalized <= 3) return 2 * magnitude;
  if (normalized <= 7) return 5 * magnitude;
  return 10 * magnitude;
}

/** Generate evenly spaced axis tick values across [min, max]. */
export function buildAxisTicks([min, max]: [number, number]): number[] {
  const step = getNiceTickStep(max - min);
  const firstTick = Math.ceil(min / step) * step;
  const ticks: number[] = [];

  for (let value = firstTick; value <= max + step * 1e-6; value += step) {
    // Round tiny floating-point drift (e.g. 0.30000000000000004 -> 0.3)
    ticks.push(Number(value.toFixed(6)));
  }

  return ticks;
}

/** Format an axis tick number cleanly without trailing decimals or "-0". */
export function formatTickLabel(value: number): string {
  if (Math.abs(value) < 1e-9) return '0';
  if (Math.abs(value) >= 1000 || Math.abs(value) < 0.01) {
    return value.toExponential(1);
  }
  return Number(value.toFixed(2)).toString();
}

/** Convert a mathematical x value to an SVG x pixel coordinate. */
export function mathToSvgX(x: number, [xMin, xMax]: [number, number]): number {
  const fraction = (x - xMin) / (xMax - xMin);
  return GRAPH_LAYOUT.paddingLeft + fraction * GRAPH_LAYOUT.plotWidth;
}

/** Convert a mathematical y value to an SVG y pixel coordinate (SVG y grows downward). */
export function mathToSvgY(y: number, [yMin, yMax]: [number, number]): number {
  const fraction = (yMax - y) / (yMax - yMin);
  return GRAPH_LAYOUT.paddingTop + fraction * GRAPH_LAYOUT.plotHeight;
}

/** Convert an SVG x pixel coordinate back into a mathematical x value. */
export function svgToMathX(svgX: number, [xMin, xMax]: [number, number]): number {
  const fraction = (svgX - GRAPH_LAYOUT.paddingLeft) / GRAPH_LAYOUT.plotWidth;
  return xMin + fraction * (xMax - xMin);
}

/**
 * Sample a compiled math function across the visible xRange and build an SVG path string.
 * Automatically breaks the stroke across vertical asymptotes (such as 1/x or tan(x)).
 */
export function sampleCurvePath(
  fn: CompiledMathFn | null,
  parameters: Record<string, number>,
  xRange: [number, number],
  yRange: [number, number],
  sampleCount = 260,
): string {
  if (!fn) return '';

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const ySpan = yMax - yMin;
  const discontinuityJumpLimit = ySpan * 1.4;
  const extremeYLimit = Math.max(Math.abs(yMin), Math.abs(yMax)) * 6 + 50;

  const pathCommands: string[] = [];
  let isDrawing = false;
  let previousY = 0;

  for (let step = 0; step <= sampleCount; step++) {
    const x = xMin + (step / sampleCount) * (xMax - xMin);
    const y = fn({...parameters, x});

    // Lift the pen for undefined values (e.g. sqrt(-1), 1/0) or extreme asymptote spikes
    if (!Number.isFinite(y) || Math.abs(y) > extremeYLimit) {
      isDrawing = false;
      continue;
    }

    // Lift the pen if y jumped sharply between adjacent points (e.g. tan(x) crossing pi/2)
    if (isDrawing && Math.abs(y - previousY) > discontinuityJumpLimit) {
      isDrawing = false;
    }

    const svgX = mathToSvgX(x, xRange);
    const svgY = mathToSvgY(y, yRange);
    const command = isDrawing ? 'L' : 'M';

    pathCommands.push(`${command}${svgX.toFixed(2)},${svgY.toFixed(2)}`);
    isDrawing = true;
    previousY = y;
  }

  return pathCommands.join(' ');
}
