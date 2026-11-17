/**
 * Global MDX component registry.
 * Any component added here becomes available in every `.md` / `.mdx` lesson
 * without needing manual import statements at the top of the file.
 */

import MDXComponents from '@theme-original/MDXComponents';
import {
  DiagramFigure,
  FormulaCard,
  InteractiveGraph,
  ObjectivesBox,
  QuickCheck,
  SyllabusHeader,
  WorkedExample,
} from '@site/src/components/lesson';

export default {
  ...MDXComponents,
  SyllabusHeader,
  ObjectivesBox,
  FormulaCard,
  WorkedExample,
  QuickCheck,
  InteractiveGraph,
  DiagramFigure,
};
