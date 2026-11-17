import React from 'react';
import {BookOpen, Clock, FileText, Layers} from 'lucide-react';
import styles from './lesson.module.css';

export interface SyllabusHeaderProps {
  subject: string;
  section: string;
  code: string;
  papers?: string[];
  studyTime?: string;
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
    <div className={styles.syllabusHeader}>
      <div className={styles.syllabusTopRow}>
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
