import { Link } from 'react-router-dom';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';
import styles from './Navbar.module.css';

export default function Navbar() {

  return (
    <nav>
      <div className={`${styles.navbarMobile} ${styles.noTablet} ${styles.noDesktop} ${styles.glass}`}>
        <NavbarMobile />
      </div>
      <div className={`${styles.navbarDesktop} noMobile alignNext flexCenter`}>
        <NavbarDesktop />
      </div>
    </nav>
  );
}