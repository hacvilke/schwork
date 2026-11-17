/**
 * Interactive checklist of syllabus learning objectives.
 * Students can tap each objective as they master it; progress is saved locally in their browser.
 */

import React, {useEffect, useState} from 'react';
import {Check, Target} from 'lucide-react';
import clsx from 'clsx';
import styles from './ObjectivesBox.module.css';

export interface ObjectivesBoxProps {
  /** Unique storage key per lesson (e.g. "math-s7-01") so checkboxes persist independently. */
  id: string;
  /** Optional custom heading. Defaults to "Learning Objectives". */
  title?: string;
  /** Ordered list of syllabus objective statements. */
  objectives: string[];
}

function loadSavedProgress(storageKey: string, count: number): boolean[] {
  const empty = Array.from({length: count}, () => false);
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return empty;
    return empty.map((_, index) => Boolean(parsed[index]));
  } catch {
    // Private browsing or locked-down library browsers may block localStorage
    return empty;
  }
}

function saveProgress(storageKey: string, values: boolean[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {
    // Silently ignore storage quota or privacy restrictions
  }
}

export default function ObjectivesBox({
  id,
  title = 'Learning Objectives',
  objectives,
}: ObjectivesBoxProps): React.JSX.Element {
  const storageKey = `schwork:obj:${id}`;
  const [checkedItems, setCheckedItems] = useState<boolean[]>(() =>
    objectives.map(() => false),
  );

  useEffect(() => {
    setCheckedItems(loadSavedProgress(storageKey, objectives.length));
  }, [storageKey, objectives.length]);

  const toggleObjective = (index: number) => {
    setCheckedItems((previous) => {
      const updated = [...previous];
      updated[index] = !updated[index];
      saveProgress(storageKey, updated);
      return updated;
    });
  };

  const completedCount = checkedItems.filter(Boolean).length;

  return (
    <section className={styles.box} aria-label={title}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Target size={18} aria-hidden="true" />
          {title}
        </h3>
        <span className={styles.progressBadge}>
          {completedCount}/{objectives.length} mastered
        </span>
      </div>

      <ul className={styles.list}>
        {objectives.map((objectiveText, index) => {
          const isDone = Boolean(checkedItems[index]);
          return (
            <li key={index}>
              <label className={clsx(styles.item, isDone && styles.itemDone)}>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleObjective(index)}
                  className={styles.hiddenInput}
                />
                <span className={styles.checkbox} aria-hidden="true">
                  {isDone && <Check size={14} strokeWidth={3} />}
                </span>
                <span className={styles.text}>{objectiveText}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
