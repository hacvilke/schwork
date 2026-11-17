/**
 * Responsive diagram wrapper for static SVG/PNG illustrations (e.g. geometry proofs,
 * vector diagrams, optics rays, or science lab apparatus).
 * Automatically handles baseUrl for both Vercel ('/') and GitHub Pages ('/schwork/'),
 * and includes a full-screen tap-to-zoom lightbox for phone screens.
 */

import React, {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Maximize2, X} from 'lucide-react';
import styles from './DiagramFigure.module.css';

export interface DiagramFigureProps {
  /** Path under `static/` (e.g. "/img/diagrams/template/vector-addition.svg"). */
  src: string;
  /** Accessible description of the diagram for screen readers. */
  alt: string;
  /** Optional caption shown underneath the diagram. */
  caption?: string;
  /** Short category label shown in the top-left bar. Defaults to "Diagram". */
  sourceLabel?: string;
}

export default function DiagramFigure({
  src,
  alt,
  caption,
  sourceLabel = 'Diagram',
}: DiagramFigureProps): React.JSX.Element {
  const imageUrl = useBaseUrl(src);
  const [isExpanded, setIsExpanded] = useState(false);

  // Allow closing the zoomed lightbox with the Escape key on desktop
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      <figure className={styles.card}>
        <div className={styles.header}>
          <span className={styles.sourceTag}>{sourceLabel}</span>
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setIsExpanded(true)}
            aria-label="Expand diagram full screen">
            <Maximize2 size={14} aria-hidden="true" />
            Expand
          </button>
        </div>

        <button
          type="button"
          className={styles.mediaBtn}
          onClick={() => setIsExpanded(true)}
          aria-label={`Zoom ${alt}`}>
          <img src={imageUrl} alt={alt} loading="lazy" className={styles.image} />
        </button>

        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>

      {isExpanded && (
        <div
          className={styles.lightboxBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setIsExpanded(false)}>
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setIsExpanded(false)}
            aria-label="Close expanded diagram">
            <X size={22} />
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}>
            <img src={imageUrl} alt={alt} className={styles.lightboxImage} />
          </div>
          {caption && <p className={styles.lightboxCaption}>{caption}</p>}
        </div>
      )}
    </>
  );
}
