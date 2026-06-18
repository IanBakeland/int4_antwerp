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
        <Link to="/" className={`${styles.navbarDesktopItem} ${checkActive('/', '') ? styles.navbarDesktopItemActive : ''}`}>HOME</Link>
        <Link to="/#panoramas" className={`${styles.navbarDesktopItem} ${checkActive('/', '#panoramas') ? styles.navbarDesktopItemActive : ''}`}>PANORAMAS</Link>
        <Link to="/radar-explained" className={`${styles.navbarDesktopItem} ${checkActive('/radar-explained', '') ? styles.navbarDesktopItemActive : ''}`}>RADAR</Link>
      </div>


      <SmartButton to="/share" icon={<PlusCircleIcon />}>Share your story</SmartButton>


      <NavLink to="/favourites" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
          {({ isActive }) => (
              <>
                  <div className="iconContainer">
                      <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                          <HeartIcon />
                      </div>
                      <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
                          <HeartFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
          {({ isActive }) => (
              <>
                  <div className="iconContainer">
                      <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                          <PersonIcon />
                      </div>
                      <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
                          <PersonFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
    </div>
  );
}
