import React from 'react';
import Layout from '@theme/Layout';
import SubjectDirectory from '@site/src/components/SubjectDirectory';
import styles from './index.module.css';

export default function SubjectsPage(): React.JSX.Element {
  return (
    <Layout
      title="Subjects"
      description="Browse all subjects on Schwork and jump directly to each subject's study page.">
      <header className={styles.heroCompact}>
        <div className={styles.heroGridBg} aria-hidden="true" />
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <h1 className={styles.heroTitle} style={{fontSize: 'clamp(1.85rem, 3.6vw, 2.6rem)'}}>
            Subjects
          </h1>
          <p className={styles.heroSubtitle} style={{marginBottom: 0}}>
            Choose any subject below to open its study page.
          </p>
        </div>
      </header>

      <main className={styles.section}>
        <div className="container">
          <SubjectDirectory />
        </div>
      </main>
    </Layout>
  );
}
