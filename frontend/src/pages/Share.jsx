import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import styles from './Share.module.css';

// images & icons
import antwerpLogo from '../assets/images/antwerpLogo.png';
import PersonFilledIcon from '../assets/icons/PersonFilled';

export default function Share() {
  useDocumentTitle('Share your story');

  return (
    <div className={styles.shareContainer}>
      <header className={styles.navbarMobileTop}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
        </Link>
        <div className={styles.navbarMobileTopRight}>
          <Link to="/account" className={`${styles.activeIconButton} iconbutton`} aria-label="Account">
            <PersonFilledIcon />
          </Link>
        </div>
      </header>

      <div className={styles.shareContent}>
        <h1>Share your<span> story</span></h1>
        {/* Hier komt de rest van de "Share your story" pagina */}
      </div>
    </div>
  );
}