import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight} from 'lucide-react';
import SubjectDirectory from '@site/src/components/SubjectDirectory';
import styles from './index.module.css';

export default function SubjectsPage(): React.JSX.Element {
  return (
    <Layout
      title="Subjects"
      description="Browse secondary school and university subjects on Schwork — structured study notes, interactive visuals, and exam practice.">
      <header className={styles.heroCompact}>
        <div className={styles.heroGridBg} aria-hidden="true" />
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sagePill}>Secondary &amp; University Study Docs</span>
          </div>
          <h1 className={styles.heroTitle} style={{fontSize: 'clamp(1.85rem, 3.6vw, 2.7rem)'}}>
            Subjects
          </h1>
          <p className={styles.heroSubtitle} style={{marginBottom: 0}}>
            Explore structured subjects across secondary school and higher education —
            built one subject at a time with learning objectives, interactive visuals,
            worked examples, and practice checks.
          </p>
        </div>
      </header>

      <main className={styles.section}>
        <div className="container">
          <SubjectDirectory />

          <div className={styles.workflowBanner} style={{marginTop: '2.25rem'}}>
            <div>
              <h2 className={styles.workflowTitle}>Want to preview a full lesson?</h2>
              <p className={styles.workflowText}>
                Open the sample lesson to try the interactive graph, zoomable diagrams,
                worked example, and quick quizzes right now.
              </p>
            </div>
            <Link to="/docs/sample-lesson" className={styles.ctaPrimary}>
              Open Sample Lesson
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
