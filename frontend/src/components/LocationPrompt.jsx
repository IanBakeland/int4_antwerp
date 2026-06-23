import { useEffect } from 'react';
import LocationFilledIcon from '../assets/icons/LocationFilled';
import styles from './LocationPrompt.module.css';

// Shown when the visitor blocks (or has blocked) location access. The Radar and the
// real-distance tags need geolocation, so we explain why and how to turn it back on.
export default function LocationPrompt({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles['location-prompt__overlay']}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-prompt-title"
    >
      <div className={styles['location-prompt__card']} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles['location-prompt__close']}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <span className={styles['location-prompt__icon']} aria-hidden="true">
          <LocationFilledIcon />
        </span>

        <h2 id="location-prompt-title" className={styles['location-prompt__title']}>
          This website works with location
        </h2>

        <p className={styles['location-prompt__desc']}>
          Antwerp Scenes uses your location to guide you to nearby stories and power the
          Radar. Allow location access to see how far each scene is from you.
        </p>

        <div className={styles['location-prompt__hint']}>
          <span className={styles['location-prompt__hint-badge']} aria-hidden="true">
            <LocationFilledIcon />
          </span>
          <p className={styles['location-prompt__hint-text']}>
            Tap the location icon in your browser's address bar and choose
            <strong> Allow</strong>, then reload the page.
          </p>
        </div>

        <button type="button" className={styles['location-prompt__btn']} onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
