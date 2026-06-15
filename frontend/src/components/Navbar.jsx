
import { Link } from 'react-router-dom';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import NavbarMobile from './NavbarMobile';
import NavbarDesktop from './NavbarDesktop';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';

export default function Navbar() {

  return (
    <nav>
      <div className="navbarMobileTop">
        <Link to="/" className="mobileLogoLink" aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className="mobileLogoImg" />
        </Link>
        <div className="navbarMobileTopRight">
          <Link to="/favourites" className="topNavIcon" aria-label="Favourites">
            <HeartIcon />
          </Link>
          <Link to="/account" className="topNavIcon" aria-label="Account">
            <PersonIcon />
          </Link>
        </div>
      </div>
      <div className="navbarMobile noTablet noDesktop glass">
        <NavbarMobile />
      </div>
      <div className="navbarDesktop noMobile alignNext flexCenter">
        <NavbarDesktop />
      </div>
    </nav>
  );
}