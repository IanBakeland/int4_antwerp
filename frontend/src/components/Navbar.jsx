
import { Link } from 'react-router-dom';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';

export default function Navbar() {

  return (
    <nav>
      <div className="navbarMobile noTablet noDesktop glass">
        <NavbarMobile />
      </div>
      <div className="navbarDesktop noMobile alignNext flexCenter">
        <NavbarDesktop />
      </div>
    </nav>
  );
}