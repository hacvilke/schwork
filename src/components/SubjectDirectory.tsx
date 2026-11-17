import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {SUBJECTS, type SubjectCluster} from '@site/src/data/subjects';
import styles from '@site/src/pages/index.module.css';

const CLUSTERS: Array<'All' | SubjectCluster> = [
  'All',
  'Core',
  'Sciences',
  'Business & Tech',
  'Humanities',
];

export default function SubjectDirectory(): React.JSX.Element {
  const [activeCluster, setActiveCluster] = useState<'All' | SubjectCluster>('All');

  const filteredSubjects =
    activeCluster === 'All'
      ? SUBJECTS
      : SUBJECTS.filter((s) => s.cluster === activeCluster);

  return (
    <>
      <div className={styles.filterRow} role="tablist" aria-label="Filter subjects by category">
        {CLUSTERS.map((cluster) => (
          <button
            key={cluster}
            type="button"
            role="tab"
            aria-selected={activeCluster === cluster}
            onClick={() => setActiveCluster(cluster)}
            className={clsx(
              styles.filterBtn,
              activeCluster === cluster && styles.filterBtnActive,
            )}>
            {cluster}
          </button>
        ))}
      </div>

      <div className={styles.subjectGrid}>
        {filteredSubjects.map((subject) => (
          <article key={subject.id} className={styles.subjectCard}>
            <div>
              <div className={styles.subjectCardTop}>
                <span className={styles.subjectCode}>{subject.shortCode}</span>
                <span
                  className={
                    subject.status === 'live'
                      ? styles.statusLive
                      : styles.statusPlanned
                  }>
                  {subject.status === 'live' ? 'Available' : 'Coming Soon'}
                </span>
              </div>
              <h3 className={styles.subjectName}>{subject.name}</h3>
              <p className={styles.subjectSummary}>{subject.summary}</p>
            </div>

            <div className={styles.subjectFooter}>
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
