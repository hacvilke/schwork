import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  LineChart,
  Smartphone,
} from 'lucide-react';
import SubjectDirectory from '@site/src/components/SubjectDirectory';
import styles from './index.module.css';

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Free High School Study Docs for Jamaica"
      description="Free, mobile-friendly high school study notes, interactive graphs, worked examples, and practice questions for Jamaican students in Grades 10 and 11.">
      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroGridBg} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <div className={styles.eyebrowRow}>
                <span className={styles.clashPill}>Jamaica · Grades 10–11</span>
                <span className={styles.cyanPill}>Free · No Login Needed</span>
              </div>

              <h1 className={styles.heroTitle}>
                Every high school subject, taught like{' '}
                <span className={styles.heroHighlight}>clear documentation.</span>
              </h1>

              <p className={styles.heroSubtitle}>
                Structured syllabus notes, interactive graphs, step-by-step worked
                examples, and quick exam checks — built to load fast on your phone,
                school computer, or parish library PC.
              </p>

              <div className={styles.heroCtas}>
                <Link to="/docs/sample-lesson" className={styles.ctaPrimary}>
                  Try a Sample Lesson
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to="/subjects" className={styles.ctaSecondary}>
                  Browse Subjects
                </Link>
              </div>
            </div>

            {/* Clean Student Study Preview Card */}
            <aside className={styles.previewCard} aria-label="Inside a Schwork lesson">
              <div className={styles.previewTop}>
                <span>Inside every topic</span>
                <span className={styles.previewTag}>Paper 1 &amp; 2</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewKicker}>Example Lesson Format</div>
                <h2 className={styles.previewHeading}>
                  Quadratic Functions &amp; Graphs
                </h2>
                <ul className={styles.previewList}>
                  <li>
                    <CheckCircle2 size={16} color="#C8FF00" />
                    <span>Checkable syllabus objectives to track progress</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color="#C8FF00" />
                    <span>Clear formula cards (Memorize vs Formula Sheet)</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color="#C8FF00" />
                    <span>Interactive graphs &amp; zoomable diagrams</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color="#C8FF00" />
                    <span>Worked examples + instant self-check quizzes</span>
                  </li>
                </ul>

                <Link to="/docs/sample-lesson" className={styles.previewFooterLink}>
                  Open Sample Lesson <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <main>
        {/* WHY STUDY HERE */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Made for Jamaican Students</span>
              <h2 className={styles.sectionTitle}>
                Structured like docs. Built for phones.
              </h2>
              <p className={styles.sectionDesc}>
                Whether you’re revising on your phone at home, on the bus, or printing
                notes at the parish library, every topic is fast, clean, and easy to follow.
              </p>
            </div>

            <div className={styles.pillarsGrid}>
              <article className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <Smartphone size={20} aria-hidden="true" />
                </div>
                <h3 className={styles.pillarTitle}>Phone-Friendly</h3>
                <p className={styles.pillarText}>
                  Big tap buttons, sideways-scrollable formulas and tables, zoomable
                  diagrams, and light pages that save mobile data.
                </p>
              </article>

              <article className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <BookOpen size={20} aria-hidden="true" />
                </div>
                <h3 className={styles.pillarTitle}>Syllabus Order</h3>
                <p className={styles.pillarText}>
                  Every subject has its own clean sidebar organized section by section so
                  you can jump straight to the exact topic you need.
                </p>
              </article>

              <article className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <LineChart size={20} aria-hidden="true" />
                </div>
                <h3 className={styles.pillarTitle}>Interactive Visuals</h3>
                <p className={styles.pillarText}>
                  Drag sliders to watch graphs change live, read coordinates by tapping,
                  and expand geometry or science diagrams full-screen.
                </p>
              </article>

              <article className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <ClipboardCheck size={20} aria-hidden="true" />
                </div>
                <h3 className={styles.pillarTitle}>Exam Practice</h3>
                <p className={styles.pillarText}>
                  Every lesson includes step-by-step worked examples, exam tips, and
                  Paper 1 &amp; Paper 2 practice checks with explanations.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SUBJECTS DIRECTORY */}
        <section id="subjects" className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>Subjects</span>
              <h2 className={styles.sectionTitle}>
                All High School Subjects &amp; University
              </h2>
              <p className={styles.sectionDesc}>
                Browse every Jamaican high school subject plus our University track —
                built thoroughly one subject at a time so every section is complete
                and dependable for revision.
              </p>
            </div>

            <SubjectDirectory />
          </div>
        </section>

        {/* SAMPLE LESSON BANNER */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.workflowBanner}>
              <div>
                <h2 className={styles.workflowTitle}>
                  See how a lesson works on your device
                </h2>
                <p className={styles.workflowText}>
                  Try the interactive quadratic graph, tap to zoom the geometry &amp;
                  vector diagrams, and test yourself on a Paper 1 &amp; Paper 2 practice check.
                </p>
              </div>
              <Link to="/docs/sample-lesson" className={styles.ctaPrimary}>
                <Compass size={18} aria-hidden="true" />
                Open Sample Lesson
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
