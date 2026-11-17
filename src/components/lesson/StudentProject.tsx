/**
 * Structured hands-on Student Mini-Project card.
 * Gives students a concrete real-world task for each lesson topic, with
 * checkable step progress saved locally, clear deliverables, and a rubric.
 */

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {
  Briefcase,
  Check,
  ClipboardCheck,
  Clock,
  FileText,
  RotateCcw,
} from 'lucide-react';
import styles from './StudentProject.module.css';

export interface StudentProjectProps {
  /** Unique localStorage key (e.g. "poa-s1-01-project"). */
  id: string;
  /** Project title shown in the Deep Navy header. */
  title: string;
  /** Suggested time to complete (e.g. "25–35 mins"). */
  duration?: string;
  /** Realistic role/scenario for the student. */
  scenario: string;
  /** Ordered hands-on tasks the student checks off as they work. */
  steps: string[];
  /** Concrete outputs the student submits or puts in their notebook. */
  deliverables: string[];
  /** Self-check rubric items so students know what earns full marks. */
  rubric: string[];
}

function loadSteps(storageKey: string, count: number): boolean[] {
  const empty = Array.from({length: count}, () => false);
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return empty;
    return empty.map((_, index) => Boolean(parsed[index]));
  } catch {
    return empty;
  }
}

function saveSteps(storageKey: string, values: boolean[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {
    // Ignore storage quota or private browsing limits
  }
}

export default function StudentProject({
  id,
  title,
  duration = '25–35 mins',
  scenario,
  steps,
  deliverables,
  rubric,
}: StudentProjectProps): React.JSX.Element {
  const storageKey = `schwork:project:${id}`;
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(() =>
    steps.map(() => false),
  );

  useEffect(() => {
    setCheckedSteps(loadSteps(storageKey, steps.length));
  }, [storageKey, steps.length]);

  const toggleStep = (index: number) => {
    setCheckedSteps((previous) => {
      const next = [...previous];
      next[index] = !next[index];
      saveSteps(storageKey, next);
      return next;
    });
  };

  const resetSteps = () => {
    const empty = steps.map(() => false);
    setCheckedSteps(empty);
    saveSteps(storageKey, empty);
  };

  const completedCount = checkedSteps.filter(Boolean).length;
  const progressPercent =
    steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <section className={styles.card} aria-label={`Student Project: ${title}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.badge}>
            <Briefcase size={13} aria-hidden="true" />
            Student Project
          </span>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.timePill}>
            <Clock size={13} aria-hidden="true" />
            {duration}
          </span>
          <span className={styles.progressPill}>
            {completedCount}/{steps.length} done
          </span>
        </div>
      </div>

      {/* Soft Sage step completion bar */}
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Project step completion"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={completedCount}>
        <div
          className={styles.progressFill}
          style={{width: `${progressPercent}%`}}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.scenarioBox}>
          <span className={styles.sectionLabel}>Project Brief</span>
          <p className={styles.scenarioText}>{scenario}</p>
        </div>

        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <span className={styles.sectionLabel}>Action Steps (Tick As You Go)</span>
            {completedCount > 0 && (
              <button type="button" className={styles.resetBtn} onClick={resetSteps}>
                <RotateCcw size={13} aria-hidden="true" />
                Reset progress
              </button>
            )}
          </div>
          <ol className={styles.stepList}>
            {steps.map((stepText, index) => {
              const isDone = Boolean(checkedSteps[index]);
              return (
                <li key={index}>
                  <label className={clsx(styles.stepItem, isDone && styles.stepItemDone)}>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleStep(index)}
                      className={styles.hiddenInput}
                    />
                    <span className={styles.checkbox} aria-hidden="true">
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span className={styles.stepText}>
                      <strong className={styles.stepNum}>Step {index + 1}:</strong>{' '}
                      {stepText}
                    </span>
                  </label>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.twoCol}>
          <div className={styles.subCard}>
            <div className={styles.subCardTitle}>
              <FileText size={16} className={styles.iconSage} aria-hidden="true" />
              <span>What You Will Submit</span>
            </div>
            <ul className={styles.bulletList}>
              {deliverables.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.subCard}>
            <div className={styles.subCardTitle}>
              <ClipboardCheck size={16} className={styles.iconCoral} aria-hidden="true" />
              <span>Self-Check Rubric</span>
            </div>
            <ul className={styles.bulletList}>
              {rubric.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
