import { Link, NavLink, useLocation } from 'react-router-dom';
import SmartButton from './SmartButton';
import styles from './NavbarDesktop.module.css';

//icons
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonIcon from '../assets/icons/Person';
import PersonFilledIcon from '../assets/icons/PersonFilled';
import PlusCircleIcon from '../assets/icons/PlusCircle';

export default function SecondaryNav() {
  const location = useLocation();

  // Helper function to check exact paths AND hashes
  const checkActive = (targetPath, targetHash = '') => {
    return location.pathname === targetPath && location.hash === targetHash;
  };

  return (
    <div className="alignNext">
      <Link to="/" className={styles.navbarAntwerpLogo} aria-label="Go to Homepage"></Link>
      <div className={`${styles.navbarDesktopAnimation} flexCenter`}>
        <Link to="/" className={`${styles.navbarDesktopItem} ${checkActive('/', '') ? styles.active : ''}`}>HOME</Link>
        <Link to="/#panoramas" className={`${styles.navbarDesktopItem} ${checkActive('/', '#panoramas') ? styles.active : ''}`}>PANORAMAS</Link>
        <Link to="/radar-explained" className={`${styles.navbarDesktopItem} ${checkActive('/radar-explained', '') ? styles.active : ''}`}>RADAR</Link>
      </div>


      <SmartButton to="/share" icon={<PlusCircleIcon />}>Share your story</SmartButton>


      <NavLink to="/favourites" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
          {({ isActive }) => (
              <>
                  <div className={styles.iconContainer}>
                      <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                          <HeartIcon />
                      </div>
                      <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                          <HeartFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
          {({ isActive }) => (
              <>
                  <div className={styles.iconContainer}>
                      <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                          <PersonIcon />
                      </div>
                      <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                          <PersonFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
    </div>
  );
}