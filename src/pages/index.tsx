import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight} from 'lucide-react';
import LogoLoader from '@site/src/components/LogoLoader';
import styles from './index.module.css';

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Clear Study Documentation"
      description="Free, mobile-friendly study notes, interactive visuals, worked examples, and practice checks designed for comfortable reading on any screen.">
      <main className={styles.heroMain}>
        <header className={styles.hero}>
          <div className={styles.heroGridBg} aria-hidden="true" />
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <h1 className={styles.heroTitle}>
                  Every subject, taught like{' '}
                  <span className={styles.heroHighlight}>clear documentation.</span>
                </h1>

                <p className={styles.heroSubtitle}>
                  Structured study notes, interactive graphs, step-by-step worked
                  examples, and quick exam checks — built to read cleanly on your
                  phone, laptop, or school computer.
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

              <div className={styles.heroLogoStage}>
                <LogoLoader
                  size="hero"
                  role="img"
                  ariaLabel="Schwork animated logo: raised clenched fist breaking through a graduation cap"
                  showFrame={false}
                />
              </div>
            </div>
          </div>
        </header>
      </main>
    </Layout>
  );
}
