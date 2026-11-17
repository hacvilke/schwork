/**
 * Filterable & searchable subject directory used on the homepage and `/subjects`.
 * Data comes from `src/data/subjects.ts` — edit that file to add or unlock subjects.
 */

import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {Search, X} from 'lucide-react';
import {SUBJECTS, type SubjectCluster} from '@site/src/data/subjects';
import styles from './SubjectDirectory.module.css';

const FILTER_CLUSTERS: Array<'All' | SubjectCluster> = [
  'All',
  'Core',
  'Sciences',
  'Business & Tech',
  'Humanities & Languages',
  'Technical & Creative',
  'University',
];

export default function SubjectDirectory(): React.JSX.Element {
  const [selectedCluster, setSelectedCluster] = useState<'All' | SubjectCluster>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {All: SUBJECTS.length};
    for (const subject of SUBJECTS) {
      counts[subject.cluster] = (counts[subject.cluster] ?? 0) + 1;
    }
    return counts;
  }, []);

  const visibleSubjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return SUBJECTS.filter((subject) => {
      const matchesCluster =
        selectedCluster === 'All' || subject.cluster === selectedCluster;
      if (!matchesCluster) return false;
      if (!normalizedQuery) return true;
      return (
        subject.name.toLowerCase().includes(normalizedQuery) ||
        subject.shortCode.toLowerCase().includes(normalizedQuery) ||
        subject.cluster.toLowerCase().includes(normalizedQuery) ||
        subject.summary.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [selectedCluster, searchQuery]);

  return (
    <>
      <div className={styles.controlsBar}>
        <div className={styles.searchWrap}>
          <Search size={17} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Find a subject (e.g. Mathematics, Physics, Spanish, University)…"
            aria-label="Filter subjects by name or topic"
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearchQuery('')}
              aria-label="Clear subject search">
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

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
                cluster === 'University' && styles.filterBtnUniversity,
              )}>
              <span>{cluster}</span>
              <span className={styles.filterCount}>{clusterCounts[cluster] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {visibleSubjects.length === 0 ? (
        <div className={styles.emptyState}>
          No subjects matched <strong>“{searchQuery}”</strong>.{' '}
          <button
            type="button"
            className={styles.resetLink}
            onClick={() => {
              setSearchQuery('');
              setSelectedCluster('All');
            }}>
            Show all {SUBJECTS.length} subjects
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {visibleSubjects.map((subject) => (
            <article
              key={subject.id}
              className={clsx(
                styles.card,
                subject.cluster === 'University' && styles.cardUniversity,
              )}>
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
                  {subject.cluster === 'University'
                    ? 'Higher Education'
                    : subject.syllabusSections > 0
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
      )}
    </>
  );
}
