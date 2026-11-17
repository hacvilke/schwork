/**
 * Step-by-step worked example card with a collapsible solution and optional Exam Tip bar.
 * Set `defaultOpen={false}` when you want students to attempt the problem before peeking.
 */

import React, {useState} from 'react';
import {ChevronDown, ChevronUp, Zap} from 'lucide-react';
import styles from './WorkedExample.module.css';

export interface WorkedExampleProps {
  /** Short title describing the worked example. */
  title: string;
  /** The question statement shown above the solution toggle. */
  problem: React.ReactNode;
  /** Optional mark allocation badge (e.g. `marks={4}` renders `[4 marks]`). */
  marks?: number;
  /** Optional highlighted exam tip pinned to the bottom of the card. */
  examTip?: string;
  /** Whether the step-by-step solution starts expanded. Defaults to true. */
  defaultOpen?: boolean;
  /** Step-by-step working (supports full Markdown & KaTeX inside MDX). */
  children: React.ReactNode;
}

export default function WorkedExample({
  title,
  problem,
  marks,
  examTip,
  defaultOpen = true,
  children,
}: WorkedExampleProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.tag}>Worked Example</span>
          <h4 className={styles.title}>{title}</h4>
        </div>
        {typeof marks === 'number' && (
          <span className={styles.marksPill}>
            [{marks} {marks === 1 ? 'mark' : 'marks'}]
          </span>
        )}
      </div>

      <div className={styles.problem}>{problem}</div>

      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}>
        <span>{isOpen ? 'Hide step-by-step solution' : 'Show step-by-step solution'}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && <div className={styles.solution}>{children}</div>}

      {examTip && (
        <div className={styles.examTip}>
          <Zap size={18} className={styles.examTipIcon} aria-hidden="true" />
          <div>
            <strong>Exam Tip:</strong> {examTip}
          </div>
        </div>
      )}
    </article>
  );
}
