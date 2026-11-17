/**
 * Lightweight page-transition loader powered by <LogoLoader />.
 * Plays a quick, non-blocking animated brand transition on first client mount
 * and whenever the student switches routes so pages feel snappy and alive.
 */

import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import clsx from 'clsx';
import LogoLoader from './LogoLoader';
import styles from './PageLoader.module.css';

const INITIAL_SHOW_MS = 750;
const ROUTE_CHANGE_SHOW_MS = 520;
const FADE_OUT_MS = 240;

export default function PageLoader(): React.JSX.Element | null {
  const {pathname} = useLocation();
  const isFirstRenderRef = useRef(true);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = isFirstRenderRef.current
      ? INITIAL_SHOW_MS
      : ROUTE_CHANGE_SHOW_MS;
    isFirstRenderRef.current = false;

    setVisible(true);
    setFading(false);

    const fadeTimer = window.setTimeout(() => {
      setFading(true);
    }, duration);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, duration + FADE_OUT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <div className={styles.topBar} aria-hidden="true" />
      <div
        className={clsx(styles.overlay, fading && styles.overlayFading)}
        aria-hidden="true">
        <div className={styles.pill}>
          <LogoLoader size="md" label="Loading schwork…" />
        </div>
      </div>
    </>
  );
}
