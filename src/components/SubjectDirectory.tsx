/**
 * Filterable subject directory grid used on both the homepage and `/subjects`.
 * Data comes from `src/data/subjects.ts` — edit that file to add or unlock subjects.
 */

import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {SUBJECTS, type SubjectCluster} from '@site/src/data/subjects';
import styles from './SubjectDirectory.module.css';

const FILTER_CLUSTERS: Array<'All' | SubjectCluster> = [
  'All',
  'Core',
  'Sciences',
  'Business & Tech',
  'Humanities',
];

export default function SubjectDirectory(): React.JSX.Element {
  const [selectedCluster, setSelectedCluster] = useState<'All' | SubjectCluster>('All');

  const visibleSubjects =
    selectedCluster === 'All'
      ? SUBJECTS
      : SUBJECTS.filter((subject) => subject.cluster === selectedCluster);

  return (
    <>
      <div className={styles.filterRow} role="tablist" aria-label="Filter subjects by category">
        {FILTER_CLUSTERS.map((cluster) => (
          <button
            key={cluster}
            type="button"
            role="tab"
            aria-selected={selectedCluster === cluster}
            onClick={() => setSelectedCluster(cluster)}
            className={clsx(
              styles.filterBtn,
              selectedCluster === cluster && styles.filterBtnActive,
            )}>
            {cluster}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visibleSubjects.map((subject) => (
          <article key={subject.id} className={styles.card}>
            <div>
              <div className={styles.cardTop}>
                <span className={styles.code}>{subject.shortCode}</span>
                <span
                  className={
                    subject.status === 'live'
                      ? styles.statusLive
                      : styles.statusPlanned
                  }>
                  {subject.status === 'live' ? 'Available' : 'Coming Soon'}
                </span>
              </div>
              <h3 className={styles.name}>{subject.name}</h3>
              <p className={styles.summary}>{subject.summary}</p>
            </div>

            <div className={styles.footer}>
              <span>
                {subject.syllabusSections > 0
                  ? `${subject.syllabusSections} syllabus sections`
                  : 'Expanding library'}
              </span>
              {subject.docPath ? (
                <Link to={subject.docPath}>Start Studying →</Link>
              ) : (
                <span>{subject.cluster}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
