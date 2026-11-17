import React, {useMemo, useRef, useState} from 'react';
import {RotateCcw, ZoomIn, ZoomOut} from 'lucide-react';
import {compileExpression} from '@site/src/utils/mathParser';
import styles from './lesson.module.css';

export type CurveColor = 'cyan' | 'lime' | 'softCyan' | 'coral';

export interface GraphCurve {
  expr: string;
  label?: string;
  color?: CurveColor;
  dashed?: boolean;
}

export interface GraphParameter {
  name: string;
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
  title?: string;
  curves: GraphCurve[];
  parameters?: GraphParameter[];
  points?: GraphPoint[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  xLabel?: string;
  yLabel?: string;
  allowCustomExpr?: boolean;
}

const COLOR_HEX: Record<CurveColor, string> = {
  cyan: '#2BB3C0',
  lime: '#C8FF00',
  softCyan: '#7ADBE4',
  coral: '#FF6B6B',
};

const SVG_W = 680;
const SVG_H = 400;
const PAD = {top: 22, right: 22, bottom: 34, left: 42};
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function niceStep(range: number): number {
  const rough = range / 8;
  const pow10 = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1e-6))));
  const norm = rough / pow10;
  if (norm <= 1.5) return pow10;
  if (norm <= 3) return 2 * pow10;
  if (norm <= 7) return 5 * pow10;
  return 10 * pow10;
}

function formatTick(n: number): string {
  if (Math.abs(n) < 1e-9) return '0';
  if (Math.abs(n) >= 1000 || Math.abs(n) < 0.01) return n.toExponential(1);
  return Number(n.toFixed(2)).toString();
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
  const [xRange, setXRange] = useState<[number, number]>(xDomain);
  const [yRange, setYRange] = useState<[number, number]>(yDomain);

  const initialParams = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of parameters) {
      map[p.name] = p.defaultValue;
    }
    return map;
  }, [parameters]);

  const [paramValues, setParamValues] = useState<Record<string, number>>(initialParams);
  const [customExpr, setCustomExpr] = useState(curves[0]?.expr ?? 'x^2');
  const [traceX, setTraceX] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{
    active: boolean;
    startClientX: number;
    startClientY: number;
    startXRange: [number, number];
    startYRange: [number, number];
    moved: boolean;
  }>({
    active: false,
    startClientX: 0,
    startClientY: 0,
    startXRange: xDomain,
    startYRange: yDomain,
    moved: false,
  });

  const activeCurves = useMemo<GraphCurve[]>(() => {
    if (!allowCustomExpr || curves.length === 0) return curves;
    return [{...curves[0], expr: customExpr, label: `y = ${customExpr}`}, ...curves.slice(1)];
  }, [allowCustomExpr, curves, customExpr]);

  const compiledCurves = useMemo(
    () =>
      activeCurves.map((c, idx) => ({
        ...c,
        colorHex: COLOR_HEX[c.color ?? (idx === 0 ? 'cyan' : idx === 1 ? 'lime' : 'softCyan')],
        fn: compileExpression(c.expr),
      })),
    [activeCurves],
  );

  const toSvgX = (x: number) =>
    PAD.left + ((x - xRange[0]) / (xRange[1] - xRange[0])) * PLOT_W;

  const toSvgY = (y: number) =>
    PAD.top + ((yRange[1] - y) / (yRange[1] - yRange[0])) * PLOT_H;

  const fromSvgX = (sx: number) =>
    xRange[0] + ((sx - PAD.left) / PLOT_W) * (xRange[1] - xRange[0]);

  const xTicks = useMemo(() => {
    const step = niceStep(xRange[1] - xRange[0]);
    const start = Math.ceil(xRange[0] / step) * step;
    const out: number[] = [];
    for (let v = start; v <= xRange[1] + step * 1e-6; v += step) {
      out.push(Number(v.toFixed(6)));
    }
    return out;
  }, [xRange]);

  const yTicks = useMemo(() => {
    const step = niceStep(yRange[1] - yRange[0]);
    const start = Math.ceil(yRange[0] / step) * step;
    const out: number[] = [];
    for (let v = start; v <= yRange[1] + step * 1e-6; v += step) {
      out.push(Number(v.toFixed(6)));
    }
    return out;
  }, [yRange]);

  const curvePaths = useMemo(() => {
    const samples = 260;
    const spanY = yRange[1] - yRange[0];
    const maxJump = spanY * 1.4;

    return compiledCurves.map((curve) => {
      if (!curve.fn) return '';
      const segments: string[] = [];
      let penDown = false;
      let prevY = 0;

      for (let i = 0; i <= samples; i++) {
        const x = xRange[0] + (i / samples) * (xRange[1] - xRange[0]);
        const y = curve.fn({...paramValues, x});

        if (!Number.isFinite(y) || Math.abs(y) > Math.max(Math.abs(yRange[0]), Math.abs(yRange[1])) * 6 + 50) {
          penDown = false;
          continue;
        }

        if (penDown && Math.abs(y - prevY) > maxJump) {
          penDown = false;
        }

        const sx = toSvgX(x);
        const sy = toSvgY(y);
        segments.push(`${penDown ? 'L' : 'M'}${sx.toFixed(2)},${sy.toFixed(2)}`);
        penDown = true;
        prevY = y;
      }

      return segments.join(' ');
    });
  }, [compiledCurves, paramValues, xRange, yRange]);

  const primaryTrace = useMemo(() => {
    if (traceX === null || !compiledCurves[0]?.fn) return null;
    const y = compiledCurves[0].fn({...paramValues, x: traceX});
    if (!Number.isFinite(y)) return null;
    return {x: traceX, y};
  }, [traceX, compiledCurves, paramValues]);

  const zoom = (factor: number) => {
    const cx = (xRange[0] + xRange[1]) / 2;
    const cy = (yRange[0] + yRange[1]) / 2;
    const halfX = ((xRange[1] - xRange[0]) / 2) * factor;
    const halfY = ((yRange[1] - yRange[0]) / 2) * factor;
    if (halfX < 0.25 || halfX > 250) return;
    setXRange([cx - halfX, cx + halfX]);
    setYRange([cy - halfY, cy + halfY]);
  };

  const resetView = () => {
    setXRange(xDomain);
    setYRange(yDomain);
    setParamValues(initialParams);
    setTraceX(null);
    if (allowCustomExpr && curves[0]) {
      setCustomExpr(curves[0].expr);
    }
  };

  const getSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * SVG_W;
    const sy = ((clientY - rect.top) / rect.height) * SVG_H;
    return {sx, sy, rect};
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXRange: xRange,
      startYRange: yRange,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getSvgCoords(e.clientX, e.clientY);
    if (!coords) return;

    if (dragRef.current.active) {
      const dxPx = e.clientX - dragRef.current.startClientX;
      const dyPx = e.clientY - dragRef.current.startClientY;
      if (Math.abs(dxPx) > 3 || Math.abs(dyPx) > 3) {
        dragRef.current.moved = true;
      }

      const [sx0, sx1] = dragRef.current.startXRange;
      const [sy0, sy1] = dragRef.current.startYRange;
      const dxMath = (dxPx / ((coords.rect.width * PLOT_W) / SVG_W)) * (sx1 - sx0);
      const dyMath = (dyPx / ((coords.rect.height * PLOT_H) / SVG_H)) * (sy1 - sy0);

      setXRange([sx0 - dxMath, sx1 - dxMath]);
      setYRange([sy0 + dyMath, sy1 + dyMath]);
      return;
    }

    if (coords.sx >= PAD.left && coords.sx <= SVG_W - PAD.right) {
      setTraceX(fromSvgX(coords.sx));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current.active && !dragRef.current.moved) {
      const coords = getSvgCoords(e.clientX, e.clientY);
      if (coords && coords.sx >= PAD.left && coords.sx <= SVG_W - PAD.right) {
        setTraceX(fromSvgX(coords.sx));
      }
    }
    dragRef.current.active = false;
  };

  const axisXSvgY = toSvgY(0);
  const axisYSvgX = toSvgX(0);
  const clipId = useMemo(
    () => `plot-clip-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  return (
    <figure className={styles.graphShell}>
      <div className={styles.graphToolbar}>
        <div className={styles.graphTitleWrap}>
          <span className={styles.graphPill}>Interactive</span>
          <span className={styles.graphTitle}>{title}</span>
        </div>
        <div className={styles.graphControls}>
          <button
            type="button"
            className={styles.graphIconBtn}
            onClick={() => zoom(0.75)}
            aria-label="Zoom in"
            title="Zoom in">
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            className={styles.graphIconBtn}
            onClick={() => zoom(1.33)}
            aria-label="Zoom out"
            title="Zoom out">
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            className={styles.graphIconBtn}
            onClick={resetView}
            aria-label="Reset graph"
            title="Reset view & sliders">
            <RotateCcw size={17} />
          </button>
        </div>
      </div>

      <div className={styles.graphHud}>
        <div className={styles.legendList}>
          {compiledCurves.map((c, idx) => (
            <span key={idx} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                style={{backgroundColor: c.colorHex}}
              />
              <span>{c.label ?? `y = ${c.expr}`}</span>
            </span>
          ))}
        </div>
        <span className={styles.readoutPill}>
          {primaryTrace
            ? `(${primaryTrace.x.toFixed(2)}, ${primaryTrace.y.toFixed(2)})`
            : 'Tap or drag graph'}
        </span>
      </div>

      <div className={styles.graphCanvasWrap}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className={styles.graphSvg}
          role="img"
          aria-label={title}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}>
          <defs>
            <clipPath id={clipId}>
              <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
            </clipPath>
          </defs>

          <rect
            x={PAD.left}
            y={PAD.top}
            width={PLOT_W}
            height={PLOT_H}
            fill="#132238"
            stroke="#223b5d"
            strokeWidth="1"
          />

          {xTicks.map((tx) => {
            const sx = toSvgX(tx);
            if (sx < PAD.left - 1 || sx > SVG_W - PAD.right + 1) return null;
            return (
              <g key={`x-${tx}`}>
                <line
                  x1={sx}
                  y1={PAD.top}
                  x2={sx}
                  y2={SVG_H - PAD.bottom}
                  stroke="#1f3654"
                  strokeWidth="1"
                />
                <text
                  x={sx}
                  y={SVG_H - PAD.bottom + 18}
                  fill="#8fb0c7"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle">
                  {formatTick(tx)}
                </text>
              </g>
            );
          })}

          {yTicks.map((ty) => {
            const sy = toSvgY(ty);
            if (sy < PAD.top - 1 || sy > SVG_H - PAD.bottom + 1) return null;
            return (
              <g key={`y-${ty}`}>
                <line
                  x1={PAD.left}
                  y1={sy}
                  x2={SVG_W - PAD.right}
                  y2={sy}
                  stroke="#1f3654"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 8}
                  y={sy + 4}
                  fill="#8fb0c7"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="end">
                  {formatTick(ty)}
                </text>
              </g>
            );
          })}

          <g clipPath={`url(#${clipId})`}>
            {axisXSvgY >= PAD.top && axisXSvgY <= SVG_H - PAD.bottom && (
              <line
                x1={PAD.left}
                y1={axisXSvgY}
                x2={SVG_W - PAD.right}
                y2={axisXSvgY}
                stroke="#6b8ea8"
                strokeWidth="1.6"
              />
            )}
            {axisYSvgX >= PAD.left && axisYSvgX <= SVG_W - PAD.right && (
              <line
                x1={axisYSvgX}
                y1={PAD.top}
                x2={axisYSvgX}
                y2={SVG_H - PAD.bottom}
                stroke="#6b8ea8"
                strokeWidth="1.6"
              />
            )}

            {compiledCurves.map((curve, idx) => {
              const d = curvePaths[idx];
              if (!d) return null;
              return (
                <path
                  key={idx}
                  d={d}
                  fill="none"
                  stroke={curve.colorHex}
                  strokeWidth={idx === 0 ? 3.2 : 2.5}
                  strokeDasharray={curve.dashed ? '8 6' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {points.map((pt, idx) => {
              const sx = toSvgX(pt.x);
              const sy = toSvgY(pt.y);
              const col = COLOR_HEX[pt.color ?? 'lime'];
              return (
                <g key={idx}>
                  <circle
                    cx={sx}
                    cy={sy}
                    r={5.5}
                    fill={col}
                    stroke="#0b1524"
                    strokeWidth="2"
                  />
                  {pt.label && (
                    <text
                      x={sx + 9}
                      y={sy - 8}
                      fill={col}
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="monospace">
                      {pt.label}
                    </text>
                  )}
                </g>
              );
            })}

            {primaryTrace && (
              <g>
                <line
                  x1={toSvgX(primaryTrace.x)}
                  y1={PAD.top}
                  x2={toSvgX(primaryTrace.x)}
                  y2={SVG_H - PAD.bottom}
                  stroke="#C8FF00"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />
                <circle
                  cx={toSvgX(primaryTrace.x)}
                  cy={toSvgY(primaryTrace.y)}
                  r={6.5}
                  fill="#C8FF00"
                  stroke="#132238"
                  strokeWidth="2.2"
                />
              </g>
            )}
          </g>

          <text
            x={SVG_W - PAD.right - 4}
            y={SVG_H - 6}
            fill="#7ADBE4"
            fontSize="12"
            fontWeight="700"
            textAnchor="end">
            {xLabel}
          </text>
          <text
            x={PAD.left + 6}
            y={PAD.top + 14}
            fill="#7ADBE4"
            fontSize="12"
            fontWeight="700">
            {yLabel}
          </text>
        </svg>
      </div>

      {parameters.length > 0 && (
        <div className={styles.slidersPanel}>
          {parameters.map((param) => {
            const val = paramValues[param.name] ?? param.defaultValue;
            return (
              <label key={param.name} className={styles.sliderRow}>
                <span className={styles.sliderLabelRow}>
                  <span>{param.label ?? param.name}</span>
                  <span className={styles.sliderValue}>
                    {param.name} = {val}
                  </span>
                </span>
                <input
                  type="range"
                  className={styles.sliderInput}
                  min={param.min}
                  max={param.max}
                  step={param.step ?? 0.5}
                  value={val}
                  onChange={(e) =>
                    setParamValues((prev) => ({
                      ...prev,
                      [param.name]: Number(e.target.value),
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
          <label htmlFor="schwork-expr-input" className={styles.customExprLabel}>
            Try your own f(x) =
          </label>
          <input
            id="schwork-expr-input"
            type="text"
            className={styles.customExprInput}
            value={customExpr}
            onChange={(e) => setCustomExpr(e.target.value)}
            placeholder="e.g. a*x^2 + b*x + c or 2*sin(x)"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      )}

      <div className={styles.graphHint}>
        Drag to pan · Tap anywhere to read (x, y) coordinates · Use + / − buttons on phones to zoom.
      </div>
    </figure>
  );
}
