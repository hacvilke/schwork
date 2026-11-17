/**
 * Highlighted formula reference card for Maths, Physics, Chemistry, and POA lessons.
 * Clearly flags whether a formula is provided on the exam formula sheet or must be memorized.
 */

import React from 'react';
import {Sigma} from 'lucide-react';
import styles from './FormulaCard.module.css';

export interface FormulaCardProps {
  /** Formula name shown in the top bar (e.g. "The Quadratic Formula"). */
  title: string;
  /** Set true if this formula is printed on the standard exam formula sheet. Defaults to false. */
  onFormulaSheet?: boolean;
  /** Formula equations and notes (supports full Markdown & KaTeX inside MDX). */
  children: React.ReactNode;
}

export default function FormulaCard({
  title,
  onFormulaSheet = false,
  children,
}: FormulaCardProps): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>
          <Sigma size={16} aria-hidden="true" />
          {title}
        </span>
        <span className={onFormulaSheet ? styles.badgeGiven : styles.badgeMemorize}>
          {onFormulaSheet ? 'On Exam Formula Sheet' : 'Must Memorize'}
        </span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
