/**
 * Interactive formula explainer that reveals a short plain-English explanation
 * when a student hovers (desktop) or taps/clicks (phone & desktop) on a formula.
 *
 * Works both inline inside paragraphs and as a block around display equations:
 *
 *   Inline:
 *     <FormulaHint short="Checks how many real roots exist.">$\Delta = b^2 - 4ac$</FormulaHint>
 *
 *   Display block:
 *     <FormulaHint block label="Quadratic Formula" short="Plug in a, b, and c to find the roots.">
 *     $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
 *     </FormulaHint>
 */

import React, {useEffect, useId, useRef, useState} from 'react';
import clsx from 'clsx';
import {HelpCircle, Sparkles, X} from 'lucide-react';
import {computeTooltipPlacement} from './tooltipPosition';
import styles from './FormulaHint.module.css';

export interface FormulaHintProps {
  /** Short, plain-English explanation shown on hover or click/tap. */
  short: string;
  /** Optional short label shown in the tooltip badge (defaults to "In short"). */
  label?: string;
  /** Set true when wrapping a display/block equation ($$...$$). Defaults to false (inline). */
  block?: boolean;
  /** The KaTeX formula or expression to explain. */
  children: React.ReactNode;
}

const HOVER_CLOSE_DELAY_MS = 120;

export default function FormulaHint({
  short,
  label = 'In short',
  block = false,
  children,
}: FormulaHintProps): React.JSX.Element {
  const hintId = useId();
  const wrapperRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [shiftX, setShiftX] = useState(0);
  const [placeBelow, setPlaceBelow] = useState(false);

  const isOpen = isHovered || isPinned;

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsHovered(false);
    }, HOVER_CLOSE_DELAY_MS);
  };

  const handleTogglePin = () => {
    clearCloseTimer();
    setIsPinned((previous) => {
      const next = !previous;
      if (!next) setIsHovered(false);
      return next;
    });
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    clearCloseTimer();
    setIsPinned(false);
    setIsHovered(false);
  };

  // Cleanup any pending hover-close timeout on unmount
  useEffect(() => () => clearCloseTimer(), []);

  // Dismiss when clicking/tapping outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsPinned(false);
        setIsHovered(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPinned(false);
        setIsHovered(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Clamp inline desktop popovers inside the viewport so text is never clipped
  useEffect(() => {
    if (!isOpen || block) return;
    const triggerEl = triggerRef.current;
    const popoverEl = popoverRef.current;
    if (!triggerEl || !popoverEl) return;

    const placement = computeTooltipPlacement(
      triggerEl.getBoundingClientRect(),
      {width: popoverEl.offsetWidth, height: popoverEl.offsetHeight},
      {width: window.innerWidth, height: window.innerHeight},
    );
    setShiftX(placement.shiftX);
    setPlaceBelow(placement.placeBelow);
  }, [isOpen, block]);

  if (block) {
    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
        }}
        className={styles.blockWrap}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {/* Use role="button" div so MDX display KaTeX (<p>/<div>) stays valid HTML */}
        <div
          ref={(node) => {
            triggerRef.current = node;
          }}
          role="button"
          tabIndex={0}
          className={clsx(styles.blockTrigger, isOpen && styles.blockTriggerActive)}
          aria-expanded={isOpen}
          aria-describedby={isOpen ? hintId : undefined}
          title={short}
          onClick={handleTogglePin}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleTogglePin();
            }
          }}
          onFocus={() => setIsHovered(true)}
          onBlur={() => {
            if (!isPinned) setIsHovered(false);
          }}>
          <div className={styles.blockPromptBar}>
            <span>{label}</span>
            <span className={styles.blockPromptTag}>
              <HelpCircle size={13} aria-hidden="true" />
              {isOpen ? 'Showing short meaning' : 'Hover or tap to explain'}
            </span>
          </div>
          <div className={styles.blockMath}>{children}</div>
        </div>

        {isOpen && (
          <div
            ref={(node) => {
              popoverRef.current = node;
            }}
            id={hintId}
            role="note"
            className={clsx(styles.popover, styles.blockPopover)}>
            <div className={styles.popoverHeader}>
              <span className={styles.popoverBadge}>
                <Sparkles size={12} aria-hidden="true" />
                {label} · In short
              </span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Close formula explanation">
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <span className={styles.popoverText}>{short}</span>
          </div>
        )}
      </div>
    );
  }

  // Inline mode uses only phrasing elements (<span> / <button>) so it is valid inside <p>
  return (
    <span
      ref={(node) => {
        wrapperRef.current = node;
      }}
      className={styles.inlineWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <button
        ref={(node) => {
          triggerRef.current = node;
        }}
        type="button"
        className={clsx(styles.inlineTrigger, isOpen && styles.inlineTriggerActive)}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? hintId : undefined}
        title={short}
        onClick={handleTogglePin}
        onFocus={() => setIsHovered(true)}
        onBlur={() => {
          if (!isPinned) setIsHovered(false);
        }}>
        <span>{children}</span>
        <span className={styles.inlineBadge} aria-hidden="true">
          ?
        </span>
      </button>

      {isOpen && (
        <span
          ref={(node) => {
            popoverRef.current = node;
          }}
          id={hintId}
          role="tooltip"
          className={clsx(styles.popover, placeBelow && styles.popoverBelow)}
          style={{'--hint-shift-x': `${shiftX}px`} as React.CSSProperties}>
          <span className={styles.popoverHeader}>
            <span className={styles.popoverBadge}>
              <Sparkles size={12} aria-hidden="true" />
              {label}
            </span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close formula explanation">
              <X size={14} aria-hidden="true" />
            </button>
          </span>
          <span className={styles.popoverText}>{short}</span>
        </span>
      )}
    </span>
  );
}
