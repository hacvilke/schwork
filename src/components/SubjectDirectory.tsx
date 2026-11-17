/**
 * Plain alphabetical list of all subjects linking directly to each subject's page.
 * Data comes from `src/data/subjects.ts`.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import {ArrowRight} from 'lucide-react';
import {SUBJECTS} from '@site/src/data/subjects';
import styles from './SubjectDirectory.module.css';

export default function SubjectDirectory(): React.JSX.Element {
  return (
    <ul className={styles.list}>
      {SUBJECTS.map((subject) => (
        <li key={subject.id} className={styles.item}>
          <Link to={subject.docPath} className={styles.link}>
            <span className={styles.name}>{subject.name}</span>
            <ArrowRight size={17} className={styles.arrow} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
