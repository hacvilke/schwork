/**
 * Collapsible "Extra Practice" drawer that starts collapsed by default so
 * study notes stay clean, focused, and uncluttered on mobile and desktop.
 * Students tap to expand quizzes, classification drills, or quick checks
 * only when they are ready to test themselves.
 */

import React, {useState} from 'react';
import {ChevronDown, ChevronUp, ClipboardCheck} from 'lucide-react';
import styles from './ExtraPractice.module.css';

export interface ExtraPracticeProps {
  /** Heading shown on the collapsed bar (defaults to "Extra Practice & Self-Check"). */
  title?: string;
  /** Short badge or summary of what is inside (e.g. "2 Quick Checks · 1 True/False"). */
  summary?: string;
  /** Whether the drawer starts expanded. Defaults to false so notes stay clean. */
  defaultOpen?: boolean;
  /** Practice components (QuickCheck, TrueFalseQuiz, ClassifyActivity, ExplainActivity, etc.). */
  children: React.ReactNode;
}

export default function ExtraPractice({
  title = 'Extra Practice & Self-Check',
  summary,
  defaultOpen = false,
  children,
}: ExtraPracticeProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles.drawer} aria-label={title}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}>
        <span className={styles.leftGroup}>
          <span className={styles.iconBadge} aria-hidden="true">
            <ClipboardCheck size={18} />
          </span>
          <span className={styles.textGroup}>
            <span className={styles.eyebrow}>Optional Practice</span>
            <span className={styles.title}>{title}</span>
            {summary && <span className={styles.summary}>{summary}</span>}
          </span>
        </span>
        <span className={styles.actionPill}>
          <span>{isOpen ? 'Hide' : 'Open'}</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {isOpen && <div className={styles.content}>{children}</div>}
    </section>
  );
}
