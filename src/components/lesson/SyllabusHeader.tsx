/**
 * Top banner card shown at the start of every lesson page.
 * Displays the topic code, subject label, section description, exam papers, and study time.
 */

import React from 'react';
import {BookOpen, Clock, FileText, Layers} from 'lucide-react';
import styles from './SyllabusHeader.module.css';

export interface SyllabusHeaderProps {
  /** Subject label shown next to the code badge (e.g. "Mathematics"). */
  subject: string;
  /** Short syllabus section description (e.g. "Section 7 · Relations, Functions & Graphs"). */
  section: string;
  /** Unique topic identifier pill (e.g. "MATH-S7-01"). */
  code: string;
  /** Exam papers covered by this lesson. Defaults to ['Paper 1', 'Paper 2']. */
  papers?: string[];
  /** Estimated reading & practice time. Defaults to '15 min'. */
  studyTime?: string;
  /** Lesson difficulty level. Defaults to 'Core'. */
  difficulty?: 'Foundation' | 'Core' | 'Exam Mastery';
}

export default function SyllabusHeader({
  subject,
  section,
  code,
  papers = ['Paper 1', 'Paper 2'],
  studyTime = '15 min',
  difficulty = 'Core',
}: SyllabusHeaderProps): React.JSX.Element {
  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <span className={styles.codePill}>
          <Layers size={14} aria-hidden="true" />
          {code}
        </span>
        <span className={styles.subjectTag}>{subject}</span>
      </div>

      <p className={styles.sectionText}>{section}</p>

      <div className={styles.metaRow}>
        {papers.map((paper) => (
          <span key={paper} className={styles.metaPill}>
            <FileText size={13} aria-hidden="true" />
            {paper}
          </span>
        ))}
        <span className={styles.metaPill}>
          <Clock size={13} aria-hidden="true" />
          {studyTime}
        </span>
        <span className={styles.metaPill}>
          <BookOpen size={13} aria-hidden="true" />
          {difficulty}
        </span>
      </div>
    </div>
  );
}
