import React, {useState} from 'react';
import {ChevronDown, ChevronUp, Zap} from 'lucide-react';
import styles from './lesson.module.css';

export interface WorkedExampleProps {
  title: string;
  problem: React.ReactNode;
  marks?: number;
  examTip?: string;
  defaultOpen?: boolean;
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
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className={styles.workedCard}>
      <div className={styles.workedHeader}>
        <div className={styles.workedBadgeRow}>
          <span className={styles.workedTag}>Worked Example</span>
          <h4 className={styles.workedTitle}>{title}</h4>
        </div>
        {typeof marks === 'number' && (
          <span className={styles.marksPill}>
            [{marks} {marks === 1 ? 'mark' : 'marks'}]
          </span>
        )}
      </div>

      <div className={styles.workedProblem}>{problem}</div>

      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}>
        <span>{open ? 'Hide step-by-step solution' : 'Show step-by-step solution'}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && <div className={styles.workedSolution}>{children}</div>}

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
