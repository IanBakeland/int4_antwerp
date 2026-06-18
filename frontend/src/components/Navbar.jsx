import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
import styles from './Navbar.module.css';

export default function Navbar() {

  return (
    <nav>
      <div className={`${styles.navbarMobile} noTablet noDesktop ${styles.glass}`}>
        <NavbarMobile />
      </div>
      <div className={`${styles.navbarDesktop} noMobile alignNext flexCenter`}>
        <NavbarDesktop />
      </div>
    </nav>
  );
}