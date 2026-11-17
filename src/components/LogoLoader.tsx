/**
 * Animated Schwork brand loader.
 * Shows the closed hand pointing straight up as it rises through the middle of
 * the graduation cap, breaking it cleanly in halves with swinging tassel and
 * Acid Lime sparks.
 */

import React from 'react';
import clsx from 'clsx';
import styles from './LogoLoader.module.css';

export interface LogoLoaderProps {
  /** Visual size preset. Defaults to `'md'` (84px). */
  size?: 'sm' | 'md' | 'lg';
  /** Optional loading caption displayed underneath the icon. */
  label?: string;
  /** Whether to draw the Deep Navy rounded icon badge behind the animation. */
  showFrame?: boolean;
  /** Optional extra CSS class name on the outer wrapper. */
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<LogoLoaderProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export default function LogoLoader({
  size = 'md',
  label,
  showFrame = true,
  className,
}: LogoLoaderProps): React.JSX.Element {
  return (
    <div
      className={clsx(styles.wrapper, className)}
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={clsx(styles.svg, SIZE_CLASS[size])}
        aria-hidden="true">
        {showFrame && (
          <>
            <rect width="64" height="64" rx="14" fill="#132238" />
            <rect
              x="2.75"
              y="2.75"
              width="58.5"
              height="58.5"
              rx="11.5"
              stroke="#2BB3C0"
              strokeWidth="1.6"
              strokeOpacity="0.45"
            />
          </>
        )}

        {/* Acid Lime breakthrough sparks above the fingertip */}
        <g className={styles.sparks}>
          <path
            d="M32 6V9M25.6 8.4L27.5 10.3M38.4 8.4L36.5 10.3"
            stroke="#C8FF00"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </g>

        {/* Left half of the graduation cap */}
        <g className={styles.capLeft}>
          <path
            d="M10.5 29.6L22.2 33.9V41.6C16.7 41.1 12.4 39.2 10.5 36.8V29.6Z"
            fill="#1A8E9A"
          />
          <path
            d="M10.5 29.6L22.2 33.9V36.5L10.5 32.2V29.6Z"
            fill="#126D77"
          />
          <path
            d="M4.2 26.2L22.4 18.6L21.3 24.3L22.8 27.6L21.8 32.6L4.2 26.2Z"
            fill="#2BB3C0"
          />
          <path
            d="M5.6 26.2L21.8 19.4"
            stroke="#8CE8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Right half of the graduation cap + swinging Acid Lime tassel */}
        <g className={styles.capRight}>
          <path
            d="M53.5 29.6L41.8 33.9V41.6C47.3 41.1 51.6 39.2 53.5 36.8V29.6Z"
            fill="#1A8E9A"
          />
          <path
            d="M53.5 29.6L41.8 33.9V36.5L53.5 32.2V29.6Z"
            fill="#126D77"
          />
          <path
            d="M59.8 26.2L41.6 18.6L42.7 24.3L41.2 27.6L42.2 32.6L59.8 26.2Z"
            fill="#2BB3C0"
          />
          <path
            d="M58.4 26.2L42.2 19.4"
            stroke="#8CE8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className={styles.tassel}>
            <path
              d="M56.2 27.2C57.2 31 57 35 56 38.4"
              stroke="#C8FF00"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <circle cx="56" cy="39" r="1.9" fill="#C8FF00" />
            <path
              d="M54.3 40.4H57.7L58.7 45.4H53.3L54.3 40.4Z"
              fill="#C8FF00"
            />
          </g>
        </g>

        {/* Closed hand pointing straight up through the middle */}
        <g className={styles.hand}>
          <path
            d="M26.5 49.4V56.4C26.5 57.3 27.2 58 28.1 58H35.9C36.8 58 37.5 57.3 37.5 56.4V49.4H26.5Z"
            fill="#E3F3F7"
          />
          <rect x="26.5" y="53.4" width="11" height="2.4" rx="1" fill="#C8FF00" />
          <path
            d="M24.2 38.8C24.2 35.8 26.4 33.8 29.4 33.8H37.8C40.1 33.8 41.8 35.5 41.8 37.8V43.8C41.8 48.1 38.6 51.2 34.4 51.2H29.6C26.1 51.2 24.2 48.5 24.2 45V38.8Z"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M28.6 35.8V15.4C28.6 13.4 30.1 12 32 12C33.9 12 35.4 13.4 35.4 15.4V35.8"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="30.5" y="14.5" width="3" height="3.2" rx="1.5" fill="#C6E9F0" />
          <rect
            x="34.8"
            y="30.6"
            width="3.9"
            height="9"
            rx="1.95"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.65"
          />
          <rect
            x="37.9"
            y="32"
            width="3.6"
            height="8.4"
            rx="1.8"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.65"
          />
          <rect
            x="40.5"
            y="34"
            width="3.3"
            height="7.4"
            rx="1.65"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.65"
          />
          <path
            d="M24.2 42.6V39.2C24.2 36.2 26.3 34.6 29.2 34.6H34.2C35.9 34.6 37 35.8 37 37.4C37 39 35.9 40.2 34.2 40.2H30.8C29.3 40.2 28.4 41.2 28.4 42.8V43.8"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
