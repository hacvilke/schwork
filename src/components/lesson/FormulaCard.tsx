/**
 * Highlighted formula reference card for Maths, Physics, Chemistry, and STEM lessons.
 * Clearly flags whether a formula is provided on the exam formula sheet or must be memorized,
 * and supports an optional short plain-English `summary` revealed on hover or tap/click.
 */

import React, {useId, useState} from 'react';
import {HelpCircle, Sigma, Sparkles} from 'lucide-react';
import styles from './FormulaCard.module.css';

export interface FormulaCardProps {
  /** Formula name shown in the top bar (e.g. "The Quadratic Formula"). */
  title: string;
  /** Set true if this formula is printed on the standard exam formula sheet. Defaults to false. */
  onFormulaSheet?: boolean;
  /** Optional short plain-English summary shown when hovering or tapping "In short". */
  summary?: string;
  /** Formula equations and notes (supports full Markdown & KaTeX inside MDX). */
  children: React.ReactNode;
}

export default function FormulaCard({
  title,
  onFormulaSheet = false,
  summary,
  children,
}: FormulaCardProps): React.JSX.Element {
  const summaryId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const showSummary = Boolean(summary) && (isHovered || isPinned);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>
          <Sigma size={16} aria-hidden="true" />
          {title}
        </span>

        <div className={styles.headerActions}>
          {summary && (
            <button
              type="button"
              className={styles.summaryBtn}
              aria-expanded={showSummary}
              aria-controls={summaryId}
              title={summary}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsPinned((prev) => !prev)}>
              <HelpCircle size={13} aria-hidden="true" />
              In short
            </button>
          )}
          <span className={onFormulaSheet ? styles.badgeGiven : styles.badgeMemorize}>
            {onFormulaSheet ? 'On Exam Formula Sheet' : 'Must Memorize'}
          </span>
        </div>
      </div>

      {showSummary && (
        <div id={summaryId} className={styles.summaryBar} role="note">
          <Sparkles size={15} className={styles.summaryIcon} aria-hidden="true" />
          <span>{summary}</span>
        </div>
      )}

      <div className={styles.body}>{children}</div>
    </div>
  );
}
