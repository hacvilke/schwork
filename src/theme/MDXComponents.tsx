/**
 * Global MDX component registry.
 * Any component exported here can be used directly inside `.mdx` lesson files
 * without writing import statements at the top of every lesson.
 */

import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import {
  AccountingCycle,
  ClassifyActivity,
  DiagramFigure,
  ExplainActivity,
  FormulaCard,
  FormulaHint,
  InteractiveGraph,
  ObjectivesBox,
  QuickCheck,
  SyllabusHeader,
  TAccount,
  TrueFalseQuiz,
  WorkedExample,
} from '@site/src/components/lesson';

function ResponsiveTable(
  props: React.TableHTMLAttributes<HTMLTableElement>,
): React.JSX.Element {
  return (
    <div className="schwork-table-wrap">
      <table {...props} />
    </div>
  );
}

export default {
  ...MDXComponents,
  table: ResponsiveTable,
  SyllabusHeader,
  ObjectivesBox,
  FormulaCard,
  FormulaHint,
  WorkedExample,
  QuickCheck,
  TrueFalseQuiz,
  ClassifyActivity,
  ExplainActivity,
  AccountingCycle,
  TAccount,
  InteractiveGraph,
  DiagramFigure,
};
