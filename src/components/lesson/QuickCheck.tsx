import React, {useState} from 'react';
import {CheckCircle2, HelpCircle, RotateCcw, XCircle} from 'lucide-react';
import clsx from 'clsx';
import styles from './lesson.module.css';

export interface QuickCheckProps {
  paper?: 'Paper 1' | 'Paper 2';
  marks?: number;
  question: React.ReactNode;
  options?: string[];
  correctIndex?: number;
  explanation: React.ReactNode;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuickCheck({
  paper = 'Paper 1',
  marks = 1,
  question,
  options,
  correctIndex = 0,
  explanation,
}: QuickCheckProps): React.JSX.Element {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isMcq = Array.isArray(options) && options.length > 0;
  const isCorrect = selected !== null && selected === correctIndex;

  return (
    <section className={styles.quizCard} aria-label={`${paper} Quick Check`}>
      <div className={styles.quizHeader}>
        <span className={styles.quizLabel}>
          <HelpCircle size={15} aria-hidden="true" />
          Quick Check · {paper}
        </span>
        <span className={styles.marksPill}>
          [{marks} {marks === 1 ? 'mark' : 'marks'}]
        </span>
      </div>

      <div className={styles.quizPrompt}>{question}</div>

      {isMcq ? (
        <>
          <div className={styles.optionGrid} role="group" aria-label="Answer choices">
            {options.map((opt, idx) => {
              const showResult = selected !== null;
              const isThisCorrect = idx === correctIndex;
              const isThisSelected = idx === selected;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showResult}
                  onClick={() => setSelected(idx)}
                  className={clsx(
                    styles.optionBtn,
                    showResult && isThisCorrect && styles.optionCorrect,
                    showResult && isThisSelected && !isThisCorrect && styles.optionWrong,
                  )}>
                  <span className={styles.optionLetter}>{LETTERS[idx] ?? idx + 1}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <>
              <div
                className={clsx(
                  styles.quizFeedback,
                  isCorrect ? styles.quizFeedbackGood : styles.quizFeedbackBad,
                )}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                  }}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={18} color="#16a34a" />
                      <span>Correct! ({LETTERS[correctIndex]})</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} color="#dc2626" />
                      <span>
                        Not quite — the correct option is {LETTERS[correctIndex]}.
                      </span>
                    </>
                  )}
                </div>
                <div>{explanation}</div>
              </div>
              <div className={styles.quizActions}>
                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setSelected(null)}>
                  <RotateCcw size={15} />
                  Try again
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.quizActions}>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => setRevealed((v) => !v)}>
              {revealed ? 'Hide mark scheme' : 'Check mark scheme'}
            </button>
          </div>
          {revealed && <div className={styles.quizFeedback}>{explanation}</div>}
        </>
      )}
    </section>
  );
}
