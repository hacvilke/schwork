import React, {useEffect, useState} from 'react';
import {Check, Target} from 'lucide-react';
import clsx from 'clsx';
import styles from './lesson.module.css';

export interface ObjectivesBoxProps {
  id: string;
  title?: string;
  objectives: string[];
}

export default function ObjectivesBox({
  id,
  title = 'Learning Objectives',
  objectives,
}: ObjectivesBoxProps): React.JSX.Element {
  const storageKey = `schwork:obj:${id}`;
  const [checked, setChecked] = useState<boolean[]>(() =>
    objectives.map(() => false),
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setChecked(objectives.map((_, idx) => Boolean(parsed[idx])));
        }
      }
    } catch {
      // Ignore storage errors (private browsing / restricted library PCs)
    }
  }, [storageKey, objectives.length]);

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <section className={styles.objectivesBox} aria-label={title}>
      <div className={styles.objectivesHeader}>
        <h3 className={styles.objectivesTitle}>
          <Target size={18} aria-hidden="true" />
          {title}
        </h3>
        <span className={styles.progressBadge}>
          {completedCount}/{objectives.length} mastered
        </span>
      </div>
      <ul className={styles.objectivesList}>
        {objectives.map((item, idx) => {
          const isDone = Boolean(checked[idx]);
          return (
            <li key={idx}>
              <label
                className={clsx(
                  styles.objectiveItem,
                  isDone && styles.objectiveDone,
                )}>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(idx)}
                  style={{position: 'absolute', opacity: 0, pointerEvents: 'none'}}
                />
                <span className={styles.objectiveCheck} aria-hidden="true">
                  {isDone && <Check size={14} strokeWidth={3} />}
                </span>
                <span className={styles.objectiveText}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
