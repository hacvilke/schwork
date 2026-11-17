import React from 'react';
import {Sigma} from 'lucide-react';
import styles from './lesson.module.css';

export interface FormulaCardProps {
  title: string;
  onFormulaSheet?: boolean;
  children: React.ReactNode;
}

export default function FormulaCard({
  title,
  onFormulaSheet = false,
  children,
}: FormulaCardProps): React.JSX.Element {
  return (
    <div className={styles.formulaCard}>
      <div className={styles.formulaTop}>
        <span className={styles.formulaTitle}>
          <Sigma size={16} aria-hidden="true" />
          {title}
        </span>
        <span
          className={
            onFormulaSheet
              ? styles.formulaBadgeGiven
              : styles.formulaBadgeMemorize
          }>
          {onFormulaSheet ? 'On Exam Formula Sheet' : 'Must Memorize'}
        </span>
      </div>
      <div className={styles.formulaBody}>{children}</div>
    </div>
  );
}
