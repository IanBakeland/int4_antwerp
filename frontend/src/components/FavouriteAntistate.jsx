import { Link } from 'react-router-dom';
import styles from './FavouriteAntistate.module.css';

import PersonIcon from '../assets/icons/Person';
import HeartIcon from '../assets/icons/Heart';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';

import pano1 from '../assets/images/pano.jpeg';
import pano2 from '../assets/images/pano2.jpeg';
import pano3 from '../assets/images/pano3.jpeg';

export default function FavouriteAntistate() {
  return (
    <div className={styles.antistateContainer}>
      <div className={styles.cardsPile}>
        
        <div 
          className={`${styles.mockCard} ${styles.cardLouis}`}
          style={{ backgroundImage: `url(${pano3})` }}
        >
          <div className={styles.cardHeader}>
            <div className="iconTag">
              <PersonIcon />
              <p>Louis</p>
            </div>
            <div className="categoryTag cultureTag">
              <MonumentIcon />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.heartIcon}>
              <HeartIcon />
            </div>
          </div>
        </div>

        <div 
          className={`${styles.mockCard} ${styles.cardElise}`}
          style={{ backgroundImage: `url(${pano2})` }}
        >
          <div className={styles.cardHeader}>
            <div className="iconTag">
              <PersonIcon />
              <p>Elise</p>
            </div>
            <div className="categoryTag businessTag">
              <MonumentIcon />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.heartIcon}>
              <HeartIcon />
            </div>
          </div>
        </div>

        <div 
          className={`${styles.mockCard} ${styles.cardJonas}`}
          style={{ backgroundImage: `url(${pano1})` }}
        >
          <div className={styles.cardHeader}>
            <div className="iconTag">
              <PersonIcon />
              <p>Jonas</p>
            </div>
            <div className="categoryTag actionTag">
              <PersonRunningIcon />
            </div>
          </div>
          <div className={styles.cardFooter}>
            <h3>A wild night out</h3>
            <div className={styles.heartIcon}>
              <HeartIcon />
            </div>
          </div>
        </div>

      </div>

      <p className={styles.emptyText}>
        You do not have any favourite stories yet. Just tap the heart by the panorama’s to add your favourite items to the list!
      </p>

      <Link to="/" className={styles.exploreButton}>
        <span>Start exploring</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.buttonArrow}>
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}