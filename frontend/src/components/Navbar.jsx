import { useLocation } from 'react-router-dom';
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const isStoryPage = location.pathname.startsWith('/story');

  return (
    <nav>
      <div className={`${styles.navbarMobile} noTablet noDesktop ${isStoryPage ? 'darkNav' : ''}`}>
        <NavbarMobile />
      </div>
      <div className={`${styles.navbarDesktop} noMobile alignNext flexCenter`}>
        <NavbarDesktop />
      </div>
    </nav>
  );
}