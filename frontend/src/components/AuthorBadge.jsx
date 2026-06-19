import React from 'react';
import UserCircleIcon from '../assets/icons/UserCircle';
import styles from './AuthorBadge.module.css';

// Reusable list of styling options for easy updates or mapping to database fields
export const BADGE_COLORS = [
  '#FF82DC', // Pink
  '#D2FF4B', // Lime
  '#FF7D3C', // Orange
  '#5597FE', // Blue
  '#00D77D'  // Green
];

export default function AuthorBadge({ author = 'Emma', color, colorIndex, className }) {
  // Determine color:
  // 1. Explicitly passed color prop
  // 2. Color from predefined index
  // 3. Stably hashed from the author name
  let circleColor = color;
  if (!circleColor) {
    if (typeof colorIndex === 'number') {
      circleColor = BADGE_COLORS[colorIndex % BADGE_COLORS.length];
    } else {
      // Deterministic fallback based on author name length + character codes
      const hash = author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      circleColor = BADGE_COLORS[hash % BADGE_COLORS.length];
    }
  }

  return (
    <div className={`${styles.badgeContainer} ${className || ''}`}>
      <div className={styles.authorBadge}>
        <UserCircleIcon className={styles.authorBadgeIcon} />
        <span className={styles.authorName}>{author}</span>
      </div>
      <div
        className={styles.badgeCircle}
        style={{ backgroundColor: circleColor }}
        aria-hidden="true"
      />
    </div>
  );
}
