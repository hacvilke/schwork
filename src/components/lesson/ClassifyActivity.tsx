/**
 * Interactive classification & definition-matching drill.
 * Works for matching definitions to business types, classifying Fixed vs Current Assets,
 * sorting Current vs Long-Term Liabilities, or any category-sorting classwork across subjects.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {CheckCircle2, Layers, RotateCcw, XCircle} from 'lucide-react';
import styles from './ClassifyActivity.module.css';

export interface ClassifyItem {
  /** The item or definition the student must classify. */
  prompt: string;
  /** Exact matching label from `categories`. */
  answer: string;
  /** Brief explanation shown after the student taps a category. */
  explanation: string;
}

export interface ClassifyActivityProps {
  /** Card title (e.g. "Classify Each Asset: Fixed vs Current"). */
  title: string;
  /** Short instructions shown under the title. */
  instruction?: string;
  /** Category buttons displayed for every item. */
  categories: string[];
  /** Items or definitions to classify. */
  items: ClassifyItem[];
}

export default function ClassifyActivity({
  title,
  instruction = 'Tap the category that matches each item below for instant feedback.',
  categories,
  items,
}: ClassifyActivityProps): React.JSX.Element {
  const [selections, setSelections] = useState<Record<number, string>>({});

  const answeredCount = Object.keys(selections).length;
  const correctCount = items.reduce(
    (sum, item, index) => sum + (selections[index] === item.answer ? 1 : 0),
    0,
  );

  const pickCategory = (index: number, category: string) => {
    setSelections((previous) => ({...previous, [index]: category}));
  };

  return (
    <section className={styles.card} aria-label={title}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <Layers size={19} color="#2BB3C0" aria-hidden="true" />
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.scoreBadge}>
            {correctCount}/{items.length} correct
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setSelections({})}>
              <RotateCcw size={13} aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      <p className={styles.subtitle}>{instruction}</p>

      <div className={styles.list}>
        {items.map((item, index) => {
          const picked = selections[index];
          const hasAnswered = picked !== undefined;
          const isCorrect = hasAnswered && picked === item.answer;

          return (
            <div
              key={index}
              className={clsx(
                styles.row,
                hasAnswered && (isCorrect ? styles.rowCorrect : styles.rowWrong),
              )}>
              <p className={styles.promptText}>
                <span className={styles.indexNum}>{index + 1}.</span>
                {item.prompt}
              </p>

              <div className={styles.categoryRow} role="group" aria-label={`Item ${index + 1}`}>
                {categories.map((category) => {
                  const isPicked = picked === category;
                  const showRightHint = hasAnswered && !isPicked && item.answer === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={isPicked}
                      className={clsx(
                        styles.catBtn,
                        isPicked &&
                          (isCorrect ? styles.catSelectedCorrect : styles.catSelectedWrong),
                        showRightHint && styles.catAnswerHint,
                      )}
                      onClick={() => pickCategory(index, category)}>
                      {category}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className={styles.explanation}>
                  {isCorrect ? (
                    <CheckCircle2 size={17} className={styles.iconCorrect} aria-hidden="true" />
                  ) : (
                    <XCircle size={17} className={styles.iconWrong} aria-hidden="true" />
                  )}
                  <div>
                    <strong>
                      {isCorrect ? 'Correct' : `Answer: ${item.answer}`}.
                    </strong>{' '}
                    {item.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
