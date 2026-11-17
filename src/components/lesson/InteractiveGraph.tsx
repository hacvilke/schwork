/**
 * Touch-friendly interactive SVG function grapher for Maths, Physics, and STEM lessons.
 *
 * Pure coordinate and curve-sampling math lives in `./graphMath.ts` so this file
 * stays focused on user interactions (pan, zoom, sliders, trace readout) and rendering.
 */

import React, {useId, useMemo, useRef, useState} from 'react';
import {RotateCcw, ZoomIn, ZoomOut} from 'lucide-react';
import {compileExpression} from '@site/src/utils/mathParser';
import {
  buildAxisTicks,
  CURVE_COLORS,
  formatTickLabel,
  GRAPH_LAYOUT,
  mathToSvgX,
  mathToSvgY,
  sampleCurvePath,
  svgToMathX,
  type CurveColor,
} from './graphMath';
import styles from './InteractiveGraph.module.css';

export interface GraphCurve {
  /** Math expression in terms of x and any slider parameter names (e.g. "a*x^2 + b*x + c"). */
  expr: string;
  /** Human-readable label shown in the legend. Defaults to `y = ${expr}`. */
  label?: string;
  /** Theme colour name. Defaults to 'cyan' for the first curve, 'lime' for the second. */
  color?: CurveColor;
  /** Render as a dashed reference line (useful for asymptotes or y = 0). */
  dashed?: boolean;
}

export interface GraphParameter {
  /** Variable name used inside curve expressions (e.g. "a", "m", "c"). */
  name: string;
  /** Friendly slider label (e.g. "Gradient (m)"). */
  label?: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: CurveColor;
}

export interface InteractiveGraphProps {
  /** Heading shown in the top toolbar. */
  title?: string;
  /** One or more mathematical curves to plot. */
  curves: GraphCurve[];
  /** Optional interactive sliders wired to variables in the curve expressions. */
  parameters?: GraphParameter[];
  /** Optional key points (intercepts, turning points) highlighted on the graph. */
  points?: GraphPoint[];
  /** Initial visible x-axis range [min, max]. Defaults to [-8, 8]. */
  xDomain?: [number, number];
  /** Initial visible y-axis range [min, max]. Defaults to [-6, 6]. */
  yDomain?: [number, number];
  xLabel?: string;
  yLabel?: string;
  /** Allow students to type their own expression for the primary curve. */
  allowCustomExpr?: boolean;
}

interface DragState {
  isDragging: boolean;
  hasMoved: boolean;
  startClientX: number;
  startClientY: number;
  startXRange: [number, number];
  startYRange: [number, number];
}

function getDefaultCurveColor(index: number): CurveColor {
  if (index === 0) return 'cyan';
  if (index === 1) return 'lime';
  return 'softCyan';
}

function buildInitialParameters(parameters: GraphParameter[]): Record<string, number> {
  const values: Record<string, number> = {};
  for (const param of parameters) {
    values[param.name] = param.defaultValue;
  }
  return values;
}

export default function InteractiveGraph({
  title = 'Interactive Graph',
  curves,
  parameters = [],
  points = [],
  xDomain = [-8, 8],
  yDomain = [-6, 6],
  xLabel = 'x',
  yLabel = 'y',
  allowCustomExpr = false,
}: InteractiveGraphProps): React.JSX.Element {
  // 1. Viewport, slider, and trace state
  const [xRange, setXRange] = useState<[number, number]>(xDomain);
  const [yRange, setYRange] = useState<[number, number]>(yDomain);

  const initialParams = useMemo(() => buildInitialParameters(parameters), [parameters]);
  const [paramValues, setParamValues] = useState<Record<string, number>>(initialParams);
  const [customExpr, setCustomExpr] = useState(curves[0]?.expr ?? 'x^2');
  const [traceX, setTraceX] = useState<number | null>(null);

  const uniqueId = useId();
  const clipPathId = `schwork-graph-clip-${uniqueId}`;
  const exprInputId = `schwork-expr-input-${uniqueId}`;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<DragState>({
    isDragging: false,
    hasMoved: false,
    startClientX: 0,
    startClientY: 0,
    startXRange: xDomain,
    startYRange: yDomain,
  });

  // 2. Compile curve expressions & calculate ticks and SVG paths
  const activeCurves = useMemo<GraphCurve[]>(() => {
    if (!allowCustomExpr || curves.length === 0) return curves;
    const editablePrimary = {
      ...curves[0],
      expr: customExpr,
      label: `y = ${customExpr}`,
    };
    return [editablePrimary, ...curves.slice(1)];
  }, [allowCustomExpr, curves, customExpr]);

  const compiledCurves = useMemo(
    () =>
      activeCurves.map((curve, index) => ({
        ...curve,
        colorHex: CURVE_COLORS[curve.color ?? getDefaultCurveColor(index)],
        fn: compileExpression(curve.expr),
      })),
    [activeCurves],
  );

  const xTicks = useMemo(() => buildAxisTicks(xRange), [xRange]);
  const yTicks = useMemo(() => buildAxisTicks(yRange), [yRange]);

  const curvePaths = useMemo(
    () =>
      compiledCurves.map((curve) =>
        sampleCurvePath(curve.fn, paramValues, xRange, yRange),
      ),
    [compiledCurves, paramValues, xRange, yRange],
  );

  const tracedPoint = useMemo(() => {
    const primaryFn = compiledCurves[0]?.fn;
    if (traceX === null || !primaryFn) return null;
    const y = primaryFn({...paramValues, x: traceX});
    return Number.isFinite(y) ? {x: traceX, y} : null;
  }, [traceX, compiledCurves, paramValues]);

  // 3. Zoom, reset, and pointer pan / tap-to-trace handlers
  const zoomBy = (scaleFactor: number) => {
    const centerX = (xRange[0] + xRange[1]) / 2;
    const centerY = (yRange[0] + yRange[1]) / 2;
    const nextHalfX = ((xRange[1] - xRange[0]) / 2) * scaleFactor;
    const nextHalfY = ((yRange[1] - yRange[0]) / 2) * scaleFactor;

    // Prevent zooming into float-precision noise or out past useful ranges
    if (nextHalfX < 0.25 || nextHalfX > 250) return;

    setXRange([centerX - nextHalfX, centerX + nextHalfX]);
    setYRange([centerY - nextHalfY, centerY + nextHalfY]);
  };

  const resetGraph = () => {
    setXRange(xDomain);
    setYRange(yDomain);
    setParamValues(initialParams);
    setTraceX(null);
    if (allowCustomExpr && curves[0]) {
      setCustomExpr(curves[0].expr);
    }
  };

  const clientToSvgPoint = (clientX: number, clientY: number) => {
    const svgElement = svgRef.current;
    if (!svgElement) return null;
    const bounds = svgElement.getBoundingClientRect();
    return {
      svgX: ((clientX - bounds.left) / bounds.width) * GRAPH_LAYOUT.width,
      svgY: ((clientY - bounds.top) / bounds.height) * GRAPH_LAYOUT.height,
      bounds,
    };
  };

  const isInsidePlotX = (svgX: number) =>
    svgX >= GRAPH_LAYOUT.paddingLeft &&
    svgX <= GRAPH_LAYOUT.width - GRAPH_LAYOUT.paddingRight;

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      isDragging: true,
      hasMoved: false,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startXRange: xRange,
      startYRange: yRange,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const pointer = clientToSvgPoint(event.clientX, event.clientY);
    if (!pointer) return;

    if (dragRef.current.isDragging) {
      const deltaPixelsX = event.clientX - dragRef.current.startClientX;
      const deltaPixelsY = event.clientY - dragRef.current.startClientY;
      if (Math.abs(deltaPixelsX) > 3 || Math.abs(deltaPixelsY) > 3) {
        dragRef.current.hasMoved = true;
      }

      const [startXMin, startXMax] = dragRef.current.startXRange;
      const [startYMin, startYMax] = dragRef.current.startYRange;
      const plotWidthPx = (pointer.bounds.width * GRAPH_LAYOUT.plotWidth) / GRAPH_LAYOUT.width;
      const plotHeightPx = (pointer.bounds.height * GRAPH_LAYOUT.plotHeight) / GRAPH_LAYOUT.height;

      const shiftX = (deltaPixelsX / plotWidthPx) * (startXMax - startXMin);
      const shiftY = (deltaPixelsY / plotHeightPx) * (startYMax - startYMin);

      setXRange([startXMin - shiftX, startXMax - shiftX]);
      setYRange([startYMin + shiftY, startYMax + shiftY]);
      return;
    }

    // Desktop hover updates the live coordinate crosshair
    if (isInsidePlotX(pointer.svgX)) {
      setTraceX(svgToMathX(pointer.svgX, xRange));
    }
  };

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    // A tap without dragging pins the coordinate marker on phones
    if (dragRef.current.isDragging && !dragRef.current.hasMoved) {
      const pointer = clientToSvgPoint(event.clientX, event.clientY);
      if (pointer && isInsidePlotX(pointer.svgX)) {
        setTraceX(svgToMathX(pointer.svgX, xRange));
      }
    }
    dragRef.current.isDragging = false;
  };

  const {width, height, paddingTop, paddingRight, paddingBottom, paddingLeft, plotWidth, plotHeight} =
    GRAPH_LAYOUT;
  const xAxisSvgY = mathToSvgY(0, yRange);
  const yAxisSvgX = mathToSvgX(0, xRange);

  // 4. Render toolbar, HUD legend, SVG canvas, sliders, and optional expression sandbox
  return (
    <figure className={styles.shell}>
      <div className={styles.toolbar}>
        <div className={styles.titleWrap}>
          <span className={styles.badge}>Interactive</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => zoomBy(0.75)}
            aria-label="Zoom in"
            title="Zoom in">
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => zoomBy(1.33)}
            aria-label="Zoom out"
            title="Zoom out">
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={resetGraph}
            aria-label="Reset graph"
            title="Reset view & sliders">
            <RotateCcw size={17} />
          </button>
        </div>
      </div>

      <div className={styles.hud}>
        <div className={styles.legendList}>
          {compiledCurves.map((curve, index) => (
            <span key={index} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                style={{backgroundColor: curve.colorHex}}
              />
              <span>{curve.label ?? `y = ${curve.expr}`}</span>
            </span>
          ))}
        </div>
        <span className={styles.readoutPill}>
          {tracedPoint
            ? `(${tracedPoint.x.toFixed(2)}, ${tracedPoint.y.toFixed(2)})`
            : 'Tap or drag graph'}
        </span>
      </div>

      <div className={styles.canvasWrap}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          role="img"
          aria-label={title}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}>
          <defs>
            <clipPath id={clipPathId}>
              <rect x={paddingLeft} y={paddingTop} width={plotWidth} height={plotHeight} />
            </clipPath>
          </defs>

          {/* Plot canvas */}
          <rect
            x={paddingLeft}
            y={paddingTop}
            width={plotWidth}
            height={plotHeight}
            fill="#1B365D"
            stroke="#2D507C"
            strokeWidth="1"
          />

          {/* Vertical gridlines & x-axis ticks */}
          {xTicks.map((tick) => {
            const svgX = mathToSvgX(tick, xRange);
            if (svgX < paddingLeft - 1 || svgX > width - paddingRight + 1) return null;
            return (
              <g key={`x-${tick}`}>
                <line
                  x1={svgX}
                  y1={paddingTop}
                  x2={svgX}
                  y2={height - paddingBottom}
                  stroke="#274773"
                  strokeWidth="1"
                />
                <text
                  x={svgX}
                  y={height - paddingBottom + 18}
                  fill="#A5C0D6"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle">
                  {formatTickLabel(tick)}
                </text>
              </g>
            );
          })}

          {/* Horizontal gridlines & y-axis ticks */}
          {yTicks.map((tick) => {
            const svgY = mathToSvgY(tick, yRange);
            if (svgY < paddingTop - 1 || svgY > height - paddingBottom + 1) return null;
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={paddingLeft}
                  y1={svgY}
                  x2={width - paddingRight}
                  y2={svgY}
                  stroke="#274773"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={svgY + 4}
                  fill="#A5C0D6"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="end">
                  {formatTickLabel(tick)}
                </text>
              </g>
            );
          })}

          {/* Clipped plot contents: axes, curves, highlighted points, live trace crosshair */}
          <g clipPath={`url(#${clipPathId})`}>
            {xAxisSvgY >= paddingTop && xAxisSvgY <= height - paddingBottom && (
              <line
                x1={paddingLeft}
                y1={xAxisSvgY}
                x2={width - paddingRight}
                y2={xAxisSvgY}
                stroke="#7B9EB8"
                strokeWidth="1.6"
              />
            )}
            {yAxisSvgX >= paddingLeft && yAxisSvgX <= width - paddingRight && (
              <line
                x1={yAxisSvgX}
                y1={paddingTop}
                x2={yAxisSvgX}
                y2={height - paddingBottom}
                stroke="#7B9EB8"
                strokeWidth="1.6"
              />
            )}

            {compiledCurves.map((curve, index) => {
              const pathData = curvePaths[index];
              if (!pathData) return null;
              return (
                <path
                  key={index}
                  d={pathData}
                  fill="none"
                  stroke={curve.colorHex}
                  strokeWidth={index === 0 ? 3.2 : 2.5}
                  strokeDasharray={curve.dashed ? '8 6' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {points.map((point, index) => {
              const svgX = mathToSvgX(point.x, xRange);
              const svgY = mathToSvgY(point.y, yRange);
              const colorHex = CURVE_COLORS[point.color ?? 'lime'];
              return (
                <g key={index}>
                  <circle cx={svgX} cy={svgY} r={5.5} fill={colorHex} stroke="#122440" strokeWidth="2" />
                  {point.label && (
                    <text
                      x={svgX + 9}
                      y={svgY - 8}
                      fill={colorHex}
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="monospace">
                      {point.label}
                    </text>
                  )}
                </g>
              );
            })}

            {tracedPoint && (
              <g>
                <line
                  x1={mathToSvgX(tracedPoint.x, xRange)}
                  y1={paddingTop}
                  x2={mathToSvgX(tracedPoint.x, xRange)}
                  y2={height - paddingBottom}
                  stroke="#F5A352"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <circle
                  cx={mathToSvgX(tracedPoint.x, xRange)}
                  cy={mathToSvgY(tracedPoint.y, yRange)}
                  r={6.5}
                  fill="#F5A352"
                  stroke="#1B365D"
                  strokeWidth="2.2"
                />
              </g>
            )}
          </g>

          {/* Axis end labels */}
          <text
            x={width - paddingRight - 4}
            y={height - 6}
            fill="#9DD9CB"
            fontSize="12"
            fontWeight="700"
            textAnchor="end">
            {xLabel}
          </text>
          <text x={paddingLeft + 6} y={paddingTop + 14} fill="#9DD9CB" fontSize="12" fontWeight="700">
            {yLabel}
          </text>
        </svg>
      </div>

      {parameters.length > 0 && (
        <div className={styles.slidersPanel}>
          {parameters.map((param) => {
            const currentValue = paramValues[param.name] ?? param.defaultValue;
            return (
              <label key={param.name} className={styles.sliderRow}>
                <span className={styles.sliderLabelRow}>
                  <span>{param.label ?? param.name}</span>
                  <span className={styles.sliderValue}>
                    {param.name} = {currentValue}
                  </span>
                </span>
                <input
                  type="range"
                  className={styles.sliderInput}
                  min={param.min}
                  max={param.max}
                  step={param.step ?? 0.5}
                  value={currentValue}
                  onChange={(event) =>
                    setParamValues((previous) => ({
                      ...previous,
                      [param.name]: Number(event.target.value),
                    }))
                  }
                />
              </label>
            );
          })}
        </div>
      )}

      {allowCustomExpr && (
        <div className={styles.customExprBar}>
          <label htmlFor={exprInputId} className={styles.customExprLabel}>
            Try your own f(x) =
          </label>
          <input
            id={exprInputId}
            type="text"
            className={styles.customExprInput}
            value={customExpr}
            onChange={(event) => setCustomExpr(event.target.value)}
            placeholder="e.g. a*x^2 + b*x + c or 2*sin(x)"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      )}

      <div className={styles.hint}>
        Drag to pan · Tap anywhere to read (x, y) coordinates · Use + / − buttons on phones to zoom.
      </div>
    </figure>
  );
}
