/**
 * Interactive visual diagram explorer for Schwork lessons.
 * Supports three visual diagram layouts:
 *  - 'flow'    : Connected step-by-step process / pipeline diagram
 *  - 'hub'     : Interactive SVG hub-and-spoke concept map
 *  - 'compare' : Interactive side-by-side comparison visual (A vs B)
 *
 * Accessibility: keyboard accessible, tracks explored nodes with a Soft Sage
 * progress bar, and always pairs color states with icons and text labels.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Lightbulb,
  Sparkles,
  XCircle,
} from 'lucide-react';
import styles from './InteractiveDiagram.module.css';

export interface InteractiveDiagramNode {
  /** Short label displayed on the diagram node (e.g. "1. Record" or "Creditors"). */
  label: string;
  /** Optional short badge or group tag (e.g. "Internal", "External", "Traditional", "Emerging"). */
  tag?: string;
  /** Optional tone indicator for icons & accessible labels (never color-only). */
  tone?: 'neutral' | 'positive' | 'warning';
  /** Clear explanation displayed when this node is selected. */
  detail: string;
  /** Concrete accounting or real-world example for this node. */
  example?: string;
  /** Optional exam tip or key takeaway. */
  examTip?: string;
  /** Used in 'compare' layout: Side A label & explanation. */
  sideALabel?: string;
  sideAText?: string;
  /** Used in 'compare' layout: Side B label & explanation. */
  sideBLabel?: string;
  sideBText?: string;
}

export interface InteractiveDiagramProps {
  /** Diagram heading shown in the Deep Navy top bar. */
  title: string;
  /** Visual layout style. Defaults to `'flow'`. */
  layout?: 'flow' | 'hub' | 'compare';
  /** Central concept label (used in `'hub'` layout). */
  centerLabel?: string;
  /** Optional sub-label inside the center hub. */
  centerSublabel?: string;
  /** Short instruction prompt for students. */
  instruction?: string;
  /** Ordered interactive nodes in the diagram. */
  nodes: InteractiveDiagramNode[];
}

/** Computes clean SVG positions around the central hub for 4–8 spoke nodes. */
function getHubNodeCoords(count: number): Array<{x: number; y: number}> {
  const cx = 360;
  const cy = 165;
  const rx = count >= 7 ? 265 : 245;
  const ry = count >= 7 ? 124 : 114;

  return Array.from({length: count}, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return {
      x: Math.round(cx + rx * Math.cos(angle)),
      y: Math.round(cy + ry * Math.sin(angle)),
    };
  });
}

export default function InteractiveDiagram({
  title,
  layout = 'flow',
  centerLabel = 'Core Concept',
  centerSublabel,
  instruction = 'Select any node in the diagram below to explore how it works.',
  nodes,
}: InteractiveDiagramProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState<Record<number, boolean>>({0: true});

  const safeIndex = Math.min(activeIndex, Math.max(nodes.length - 1, 0));
  const activeNode = nodes[safeIndex];
  const exploredCount = Object.keys(explored).length;
  const progressPercent =
    nodes.length > 0 ? Math.round((exploredCount / nodes.length) * 100) : 0;

  const selectNode = (index: number) => {
    setActiveIndex(index);
    setExplored((previous) => ({...previous, [index]: true}));
  };

  const stepBy = (delta: number) => {
    if (nodes.length === 0) return;
    const next = (safeIndex + delta + nodes.length) % nodes.length;
    selectNode(next);
  };

  const hubCoords = layout === 'hub' ? getHubNodeCoords(nodes.length) : [];

  return (
    <section className={styles.shell} aria-label={title}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.badge}>
            <Compass size={13} aria-hidden="true" />
            Interactive Diagram
          </span>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.exploredBadge}>
            {exploredCount}/{nodes.length} explored
          </span>
          <div className={styles.stepControls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => stepBy(-1)}
              aria-label="Previous diagram node"
              title="Previous">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => stepBy(1)}
              aria-label="Next diagram node"
              title="Next">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Soft Sage exploration progress bar */}
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Diagram exploration progress"
        aria-valuemin={0}
        aria-valuemax={nodes.length}
        aria-valuenow={exploredCount}>
        <div className={styles.progressFill} style={{width: `${progressPercent}%`}} />
      </div>

      <p className={styles.instruction}>{instruction}</p>

      {/* Visual Diagram Stage */}
      <div className={styles.stage}>
        {layout === 'hub' && (
          <div className={styles.hubStageWrap}>
            <svg
              viewBox="0 0 720 330"
              className={styles.hubSvg}
              role="group"
              aria-label={`${title} interactive concept map`}>
              {/* Radiating connection lines */}
              {hubCoords.map((pt, index) => {
                const isActive = index === safeIndex;
                const isVisited = Boolean(explored[index]);
                return (
                  <line
                    key={`line-${index}`}
                    x1={360}
                    y1={165}
                    x2={pt.x}
                    y2={pt.y}
                    stroke={isActive ? '#F5A352' : isVisited ? '#6BC4B0' : '#4E8577'}
                    strokeWidth={isActive ? 3.2 : 1.8}
                    strokeDasharray={isActive ? undefined : '5 4'}
                    opacity={isActive ? 1 : 0.72}
                  />
                );
              })}

              {/* Central hub emblem */}
              <rect
                x={272}
                y={131}
                width={176}
                height={68}
                rx={14}
                fill="#122440"
                stroke="#6BC4B0"
                strokeWidth={2.2}
              />
              <text
                x={360}
                y={centerSublabel ? 159 : 170}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13.5"
                fontWeight="700"
                fontFamily="system-ui, sans-serif">
                {centerLabel}
              </text>
              {centerSublabel && (
                <text
                  x={360}
                  y={180}
                  textAnchor="middle"
                  fill="#9DD9CB"
                  fontSize="10.5"
                  fontFamily="monospace">
                  {centerSublabel}
                </text>
              )}

              {/* Clickable outer nodes */}
              {nodes.map((node, index) => {
                const pt = hubCoords[index];
                if (!pt) return null;
                const isActive = index === safeIndex;
                const isVisited = Boolean(explored[index]);
                const boxW = 148;
                const boxH = node.tag ? 48 : 38;
                return (
                  <g
                    key={node.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    className={styles.svgNode}
                    onClick={() => selectNode(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectNode(index);
                      }
                    }}>
                    <rect
                      x={pt.x - boxW / 2}
                      y={pt.y - boxH / 2}
                      width={boxW}
                      height={boxH}
                      rx={10}
                      fill={isActive ? '#C84E24' : '#1E3C66'}
                      stroke={isActive ? '#F5A352' : isVisited ? '#6BC4B0' : '#4A6E94'}
                      strokeWidth={isActive ? 2.4 : 1.5}
                    />
                    <text
                      x={pt.x}
                      y={node.tag ? pt.y - 3 : pt.y + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11.5"
                      fontWeight="700"
                      fontFamily="system-ui, sans-serif">
                      {node.label.length > 21
                        ? `${node.label.slice(0, 19)}…`
                        : node.label}
                    </text>
                    {node.tag && (
                      <text
                        x={pt.x}
                        y={pt.y + 14}
                        textAnchor="middle"
                        fill={isActive ? '#FDEFDF' : '#9DD9CB'}
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="monospace">
                        {isVisited ? `✓ ${node.tag}` : node.tag}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {layout === 'flow' && (
          <div className={styles.flowTrack} role="tablist" aria-label={title}>
            {nodes.map((node, index) => {
              const isActive = index === safeIndex;
              const isVisited = Boolean(explored[index]);
              return (
                <React.Fragment key={node.label}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectNode(index)}
                    className={clsx(
                      styles.flowNode,
                      isActive && styles.flowNodeActive,
                      isVisited && !isActive && styles.flowNodeVisited,
                    )}>
                    <span className={styles.flowStepBadge}>
                      {isVisited ? '✓' : index + 1}
                    </span>
                    <span className={styles.flowNodeLabel}>{node.label}</span>
                    {node.tag && <span className={styles.flowNodeTag}>{node.tag}</span>}
                  </button>
                  {index < nodes.length - 1 && (
                    <ArrowRight
                      size={18}
                      className={styles.flowArrow}
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {layout === 'compare' && (
          <div className={styles.compareChips} role="tablist" aria-label={title}>
            {nodes.map((node, index) => {
              const isActive = index === safeIndex;
              const isVisited = Boolean(explored[index]);
              return (
                <button
                  key={node.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectNode(index)}
                  className={clsx(
                    styles.compareChip,
                    isActive && styles.compareChipActive,
                  )}>
                  {isVisited && <CheckCircle2 size={14} aria-hidden="true" />}
                  <span>{node.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Node Detail Panel */}
      {activeNode && (
        <div className={styles.detailPanel}>
          <div className={styles.detailTop}>
            <span className={styles.detailStepPill}>
              {safeIndex + 1} of {nodes.length}
            </span>
            <h4 className={styles.detailTitle}>{activeNode.label}</h4>
            {activeNode.tag && (
              <span
                className={clsx(
                  styles.detailTag,
                  activeNode.tone === 'positive' && styles.detailTagPositive,
                  activeNode.tone === 'warning' && styles.detailTagWarning,
                )}>
                {activeNode.tone === 'positive' && (
                  <CheckCircle2 size={13} aria-hidden="true" />
                )}
                {activeNode.tone === 'warning' && (
                  <XCircle size={13} aria-hidden="true" />
                )}
                <span>{activeNode.tag}</span>
              </span>
            )}
          </div>

          <p className={styles.detailText}>{activeNode.detail}</p>

          {layout === 'compare' &&
            (activeNode.sideAText || activeNode.sideBText) && (
              <div className={styles.compareGrid}>
                {activeNode.sideAText && (
                  <div className={styles.compareSideGood}>
                    <div className={styles.compareSideHeadingGood}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{activeNode.sideALabel ?? 'Appropriate Practice'}</span>
                    </div>
                    <p className={styles.compareSideBody}>{activeNode.sideAText}</p>
                  </div>
                )}
                {activeNode.sideBText && (
                  <div className={styles.compareSideBad}>
                    <div className={styles.compareSideHeadingBad}>
                      <XCircle size={16} aria-hidden="true" />
                      <span>{activeNode.sideBLabel ?? 'Inappropriate Practice'}</span>
                    </div>
                    <p className={styles.compareSideBody}>{activeNode.sideBText}</p>
                  </div>
                )}
              </div>
            )}

          {activeNode.example && (
            <div className={styles.calloutExample}>
              <Sparkles size={15} className={styles.calloutIconSage} aria-hidden="true" />
              <div>
                <strong>Example:</strong> {activeNode.example}
              </div>
            </div>
          )}

          {activeNode.examTip && (
            <div className={styles.calloutTip}>
              <Lightbulb size={15} className={styles.calloutIconCoral} aria-hidden="true" />
              <div>
                <strong>Exam Tip:</strong> {activeNode.examTip}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
