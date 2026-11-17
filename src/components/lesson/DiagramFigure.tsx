import React, {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Maximize2, X} from 'lucide-react';
import styles from './lesson.module.css';

export interface DiagramFigureProps {
  src: string;
  alt: string;
  caption?: string;
  sourceLabel?: string;
}

export default function DiagramFigure({
  src,
  alt,
  caption,
  sourceLabel = 'Diagram',
}: DiagramFigureProps): React.JSX.Element {
  const resolvedSrc = useBaseUrl(src);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  return (
    <>
      <figure className={styles.figureCard}>
        <div className={styles.figureHeader}>
          <span className={styles.figureSourceTag}>{sourceLabel}</span>
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setExpanded(true)}
            aria-label="Expand diagram full screen">
            <Maximize2 size={14} aria-hidden="true" />
            Expand
          </button>
        </div>

        <button
          type="button"
          className={styles.figureMediaBtn}
          onClick={() => setExpanded(true)}
          aria-label={`Zoom ${alt}`}>
          <img
            src={resolvedSrc}
            alt={alt}
            loading="lazy"
            className={styles.figureImg}
          />
        </button>

        {caption && <figcaption className={styles.figureCaption}>{caption}</figcaption>}
      </figure>

      {expanded && (
        <div
          className={styles.lightboxBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setExpanded(false)}>
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setExpanded(false)}
            aria-label="Close expanded diagram">
            <X size={22} />
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}>
            <img src={resolvedSrc} alt={alt} className={styles.lightboxImg} />
          </div>
          {caption && <p className={styles.lightboxCaption}>{caption}</p>}
        </div>
      )}
    </>
  );
}
