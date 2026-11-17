/**
 * Interactive True / False drill for checking theory understanding across any subject.
 * Students tap True or False on each statement for immediate explanations and a live score.
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import {CheckCircle2, ListChecks, RotateCcw, XCircle} from 'lucide-react';
import styles from './TrueFalseQuiz.module.css';

export interface TrueFalseItem {
  /** The statement the student evaluates as True or False. */
  statement: string;
  /** Correct boolean answer (`true` or `false`). */
  answer: boolean;
  /** Short explanation revealed after the student answers. */
  explanation: string;
}

export interface TrueFalseQuizProps {
  /** Card title (e.g. "True or False: Users & Careers in POA"). */
  title?: string;
  /** List of True / False statements. */
  items: TrueFalseItem[];
}

export default function TrueFalseQuiz({
  title = 'True or False Activity',
  items,
}: TrueFalseQuizProps): React.JSX.Element {
  // Maps statement index -> student's boolean choice
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = items.reduce(
    (sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0),
    0,
  );

  const selectAnswer = (index: number, value: boolean) => {
    setAnswers((previous) => ({...previous, [index]: value}));
  };

  const resetAll = () => {
    setAnswers({});
  };

  return (
    <section className={styles.card} aria-label={title}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <ListChecks size={19} color="#2BB3C0" aria-hidden="true" />
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.scoreBadge}>
            {correctCount}/{items.length} correct
          </span>
          {answeredCount > 0 && (
            <button type="button" className={styles.resetBtn} onClick={resetAll}>
              <RotateCcw size={13} aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {items.map((item, index) => {
          const picked = answers[index];
          const hasAnswered = picked !== undefined;
          const isCorrect = hasAnswered && picked === item.answer;

          return (
            <div
              key={index}
              className={clsx(
                styles.row,
                hasAnswered && (isCorrect ? styles.rowCorrect : styles.rowWrong),
              )}>
              <div className={styles.statementTop}>
                <p className={styles.statementText}>
                  <span className={styles.indexNum}>{index + 1}.</span>
                  {item.statement}
                </p>

                <div className={styles.btnGroup} role="group" aria-label={`Statement ${index + 1}`}>
                  {[true, false].map((choice) => {
                    const isPicked = picked === choice;
                    const showCorrectHighlight = hasAnswered && !isPicked && item.answer === choice;

                    return (
                      <button
                        key={String(choice)}
                        type="button"
                        aria-pressed={isPicked}
                        className={clsx(
                          styles.choiceBtn,
                          isPicked &&
                            (isCorrect
                              ? styles.choiceSelectedCorrect
                              : styles.choiceSelectedWrong),
                          showCorrectHighlight && styles.choiceAnswerHighlight,
                        )}
                        onClick={() => selectAnswer(index, choice)}>
                        {choice ? 'True' : 'False'}
                      </button>
                    );
                  })}
                </div>
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
                      {isCorrect ? 'Correct' : `Not quite — it is ${item.answer ? 'True' : 'False'}`}.
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
