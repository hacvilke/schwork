/**
 * Responsive diagram wrapper for static SVG/PNG illustrations (e.g. geometry proofs,
 * vector diagrams, optics rays, or science lab apparatus).
 * Automatically handles baseUrl for both Vercel ('/') and GitHub Pages ('/schwork/'),
 * shows the animated <LogoLoader /> while loading on slower mobile connections,
 * and includes a full-screen tap-to-zoom lightbox for phone screens.
 */

import React, {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import {Maximize2, X} from 'lucide-react';
import LogoLoader from '@site/src/components/LogoLoader';
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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // If the image was already cached before React hydrated, clear the loader immediately
  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [imageUrl]);

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
          {!isLoaded && (
            <div className={styles.loadingState}>
              <LogoLoader size="sm" label="Loading diagram…" />
            </div>
          )}
          <img
            ref={imageRef}
            src={imageUrl}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
            className={clsx(styles.image, !isLoaded && styles.imageLoading)}
          />
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
