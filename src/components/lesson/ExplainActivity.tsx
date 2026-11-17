/**
 * Interactive "Explain in Your Own Words" active-recall activity.
 * Saves the student's written responses privately in browser localStorage
 * (no account needed) and lets them compare against key exam marking points.
 */

import React, {useEffect, useState} from 'react';
import {Eye, EyeOff, PenLine, RotateCcw} from 'lucide-react';
import styles from './ExplainActivity.module.css';

export interface ExplainPromptItem {
  /** Label for this short-answer box (e.g. "Integrity" or "Emerging Career"). */
  label: string;
  /** Optional placeholder guidance shown inside the textarea. */
  placeholder?: string;
  /** Key point / model explanation shown when the student taps "Compare with Key Points". */
  keyPoint: string;
}

export interface ExplainActivityProps {
  /** Unique storage key per lesson activity (e.g. "it-2-1-networks"). */
  id: string;
  /** Activity title. */
  title: string;
  /** Short instructions telling the student what to write. */
  prompt: string;
  /** One or more prompts the student explains in their own words. */
  items: ExplainPromptItem[];
}

function loadDraft(storageKey: string): Record<number, string> {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<number, string>) : {};
  } catch {
    return {};
  }
}

function saveDraft(storageKey: string, values: Record<number, string>): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {
    // Ignore storage errors in private browsing mode
  }
}

export default function ExplainActivity({
  id,
  title,
  prompt,
  items,
}: ExplainActivityProps): React.JSX.Element {
  const storageKey = `schwork:explain:${id}`;
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [showKeyPoints, setShowKeyPoints] = useState(false);

  useEffect(() => {
    setResponses(loadDraft(storageKey));
  }, [storageKey]);

  const updateResponse = (index: number, value: string) => {
    setResponses((previous) => {
      const next = {...previous, [index]: value};
      saveDraft(storageKey, next);
      return next;
    });
  };

  const clearAll = () => {
    setResponses({});
    saveDraft(storageKey, {});
  };

  const hasTypedAnything = Object.values(responses).some((text) => text.trim().length > 0);

  return (
    <section className={styles.card} aria-label={title}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <PenLine size={13} aria-hidden="true" />
          Explain in Your Own Words
        </span>
        <span className={styles.savedTag}>
          {hasTypedAnything ? 'Saved on this device' : 'Auto-saves locally'}
        </span>
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.prompt}>{prompt}</p>

      <div className={styles.fields}>
        {items.map((item, index) => (
          <label key={item.label} className={styles.field}>
            <span className={styles.fieldLabel}>{item.label}</span>
            <textarea
              className={styles.textarea}
              value={responses[index] ?? ''}
              placeholder={item.placeholder ?? `Explain ${item.label} in your own words…`}
              onChange={(event) => updateResponse(index, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          aria-expanded={showKeyPoints}
          onClick={() => setShowKeyPoints((prev) => !prev)}>
          {showKeyPoints ? (
            <>
              <EyeOff size={16} aria-hidden="true" />
              Hide Key Marking Points
            </>
          ) : (
            <>
              <Eye size={16} aria-hidden="true" />
              Compare with Key Marking Points
            </>
          )}
        </button>

        {hasTypedAnything && (
          <button type="button" className={styles.secondaryBtn} onClick={clearAll}>
            <RotateCcw size={15} aria-hidden="true" />
            Clear My Notes
          </button>
        )}
      </div>

      {showKeyPoints && (
        <div className={styles.guideBox}>
          <h4 className={styles.guideHeading}>Key Points Examiners Look For</h4>
          <ul className={styles.guideList}>
            {items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.keyPoint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
