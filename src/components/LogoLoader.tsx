/**
 * Animated Schwork brand loader.
 * Shows the raised clenched fist (knuckles up) punching straight through the
 * middle of the graduation cap, breaking it cleanly in halves with a swinging
 * Acid Lime tassel and breakthrough sparks.
 */

import React from 'react';
import clsx from 'clsx';
import styles from './LogoLoader.module.css';

export interface LogoLoaderProps {
  /** Visual size preset. Defaults to `'md'` (84px). Use `'hero'` for the large homepage showcase. */
  size?: 'sm' | 'md' | 'lg' | 'hero';
  /** Optional loading caption displayed underneath the icon. */
  label?: string;
  /** Accessible label override (defaults to `label` or `'Loading'`). */
  ariaLabel?: string;
  /** Use `'img'` for brand showcase contexts instead of `'status'` loading alerts. */
  role?: 'status' | 'img';
  /** Whether to draw the Deep Navy rounded icon badge behind the animation. */
  showFrame?: boolean;
  /** Optional extra CSS class name on the outer wrapper. */
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<LogoLoaderProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  hero: styles.sizeHero,
};

export default function LogoLoader({
  size = 'md',
  label,
  ariaLabel,
  role = 'status',
  showFrame = true,
  className,
}: LogoLoaderProps): React.JSX.Element {
  const isHero = size === 'hero';
  return (
    <div
      className={clsx(styles.wrapper, isHero && styles.heroTempo, className)}
      role={role}
      aria-live={role === 'status' ? 'polite' : undefined}
      aria-label={ariaLabel ?? label ?? 'Loading'}>
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

        {/* Acid Lime breakthrough sparks above the knuckles */}
        <g className={styles.sparks}>
          <path
            d="M32 9V13M23.5 11.2L26 14M40.5 11.2L38 14"
            stroke="#C8FF00"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Left half of the graduation cap */}
        <g className={styles.capLeft}>
          <path
            d="M9.6 30.8L20.2 34.8V42.2C15.2 41.7 11.3 39.9 9.6 37.6V30.8Z"
            fill="#1A8E9A"
          />
          <path
            d="M9.6 30.8L20.2 34.8V37.3L9.6 33.3V30.8Z"
            fill="#126D77"
          />
          <path
            d="M3.8 27.4L20.4 20.2L19.4 25.6L20.8 28.8L19.8 33.6L3.8 27.4Z"
            fill="#2BB3C0"
          />
          <path
            d="M5.2 27.4L19.8 21"
            stroke="#8CE8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Right half of the graduation cap + swinging Acid Lime tassel */}
        <g className={styles.capRight}>
          <path
            d="M54.4 30.8L43.8 34.8V42.2C48.8 41.7 52.7 39.9 54.4 37.6V30.8Z"
            fill="#1A8E9A"
          />
          <path
            d="M54.4 30.8L43.8 34.8V37.3L54.4 33.3V30.8Z"
            fill="#126D77"
          />
          <path
            d="M60.2 27.4L43.6 20.2L44.6 25.6L43.2 28.8L44.2 33.6L60.2 27.4Z"
            fill="#2BB3C0"
          />
          <path
            d="M58.8 27.4L44.2 21"
            stroke="#8CE8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className={styles.tassel}>
            <path
              d="M56.8 28.4C57.8 32.2 57.6 36 56.6 39.4"
              stroke="#C8FF00"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <circle cx="56.6" cy="40" r="1.9" fill="#C8FF00" />
            <path
              d="M54.9 41.4H58.3L59.3 46.2H53.9L54.9 41.4Z"
              fill="#C8FF00"
            />
          </g>
        </g>

        {/* Raised clenched fist (knuckles up) punching straight up through the middle */}
        <g className={styles.hand}>
          <path
            d="M26 44.8V56.2C26 57.2 26.8 58 27.8 58H36.2C37.2 58 38 57.2 38 56.2V44.8H26Z"
            fill="#E3F3F7"
          />
          <rect x="26" y="52.6" width="12" height="2.6" rx="1.1" fill="#C8FF00" />
          <path
            d="M21.8 29.8C21.8 27 24 25 26.8 25H37.2C40 25 42.2 27 42.2 29.8V38.2C42.2 42.8 38.8 46.2 34 46.2H30C25.2 46.2 21.8 42.8 21.8 38.2V29.8Z"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <rect
            x="21.9"
            y="21.4"
            width="5.4"
            height="8.8"
            rx="2.7"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.85"
          />
          <rect
            x="26.9"
            y="19.8"
            width="5.4"
            height="9.8"
            rx="2.7"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.85"
          />
          <rect
            x="31.8"
            y="20.2"
            width="5.4"
            height="9.4"
            rx="2.7"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.85"
          />
          <rect
            x="36.8"
            y="21.8"
            width="5.3"
            height="8.6"
            rx="2.65"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.85"
          />
          <path
            d="M22.1 35.6V31.6C22.1 28.8 24.3 27.2 27.2 27.2H34.4C36.3 27.2 37.6 28.5 37.6 30.3C37.6 32.1 36.3 33.4 34.4 33.4H29.4C27.5 33.4 26.4 34.4 26.4 36.1V37.6"
            fill="#FFFFFF"
            stroke="#132238"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
