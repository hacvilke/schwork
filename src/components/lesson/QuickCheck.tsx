/**
 * Interactive self-check practice question for Paper 1 (multiple choice)
 * and Paper 2 (short-answer with revealable mark scheme).
 *
 * Pass `options` + `correctIndex` for multiple choice, or omit `options` for a mark-scheme reveal.
 */

import React, {useState} from 'react';
import {CheckCircle2, HelpCircle, RotateCcw, XCircle} from 'lucide-react';
import clsx from 'clsx';
import styles from './QuickCheck.module.css';

export interface QuickCheckProps {
  /** Paper type shown in the card header. Defaults to 'Paper 1'. */
  paper?: 'Paper 1' | 'Paper 2';
  /** Number of marks for this question. Defaults to 1. */
  marks?: number;
  /** Question text or JSX prompt. */
  question: React.ReactNode;
  /** Optional list of multiple-choice answers (omit for Paper 2 mark-scheme mode). */
  options?: string[];
  /** Zero-based index of the correct option (e.g. 0 = A, 1 = B, 2 = C, 3 = D). */
  correctIndex?: number;
  /** Worked explanation or Paper 2 mark scheme shown after answering. */
  explanation: React.ReactNode;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuickCheck({
  paper = 'Paper 1',
  marks = 1,
  question,
  options,
  correctIndex = 0,
  explanation,
}: QuickCheckProps): React.JSX.Element {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  const isMultipleChoice = Array.isArray(options) && options.length > 0;
  const hasAnswered = selectedOption !== null;
  const isCorrect = hasAnswered && selectedOption === correctIndex;
  const correctLetter = OPTION_LETTERS[correctIndex] ?? String(correctIndex + 1);

  return (
    <section className={styles.card} aria-label={`${paper} Quick Check`}>
      <div className={styles.header}>
        <span className={styles.label}>
          <HelpCircle size={15} aria-hidden="true" />
          Quick Check · {paper}
        </span>
        <span className={styles.marksPill}>
          [{marks} {marks === 1 ? 'mark' : 'marks'}]
        </span>
      </div>

      <div className={styles.prompt}>{question}</div>

      {isMultipleChoice ? (
        <>
          <div className={styles.optionList} role="group" aria-label="Answer choices">
            {options.map((optionText, index) => {
              const isRightOption = index === correctIndex;
              const isChosenOption = index === selectedOption;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => setSelectedOption(index)}
                  className={clsx(
                    styles.optionBtn,
                    hasAnswered && isRightOption && styles.optionCorrect,
                    hasAnswered && isChosenOption && !isRightOption && styles.optionWrong,
                  )}>
                  <span className={styles.optionLetter}>
                    {OPTION_LETTERS[index] ?? index + 1}
                  </span>
                  <span>{optionText}</span>
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <>
              <div
                className={clsx(
                  styles.feedback,
                  isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
                )}>
                <div className={styles.feedbackTitle}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={18} color="#16a34a" />
                      <span>Correct! ({correctLetter})</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} color="#dc2626" />
                      <span>Not quite — the correct option is {correctLetter}.</span>
                    </>
                  )}
                </div>
                <div>{explanation}</div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setSelectedOption(null)}>
                  <RotateCcw size={15} />
                  Try again
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setShowMarkScheme((visible) => !visible)}>
              {showMarkScheme ? 'Hide mark scheme' : 'Check mark scheme'}
            </button>
          </div>
          {showMarkScheme && <div className={styles.feedback}>{explanation}</div>}
        </>
      )}
    </section>
  );
}
