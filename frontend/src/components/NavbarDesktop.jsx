import { Link, NavLink, useLocation } from 'react-router-dom';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonIcon from '../assets/icons/Person';
import PersonFilledIcon from '../assets/icons/PersonFilled';

export default function SecondaryNav() {
  const location = useLocation();

  // Helper function to check exact paths AND hashes
  const checkActive = (targetPath, targetHash = '') => {
    return location.pathname === targetPath && location.hash === targetHash;
  };

  return (
    <>
      <Link to="/" className="navbarAntwerpLogo" aria-label="Go to Homepage"></Link>
      <div className="navbarDesktopAnimation flexCenter">
        <Link to="/" className={`navbarDesktopItem ${checkActive('/', '') ? 'active' : ''}`}>Home</Link>
        <Link to="/#panoramas" className={`navbarDesktopItem ${checkActive('/', '#panoramas') ? 'active' : ''}`}>Panoramas</Link>
        <Link to="/radar-explained" className={`navbarDesktopItem ${checkActive('/radar-explained', '') ? 'active' : ''}`}>Radar</Link>
      </div>
      <NavLink to="/favourites" className="tab flexCenter alignUnder">
          {({ isActive }) => (
              <>
                  <div className="icon-container">
                      <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                          <HeartIcon />
                      </div>
                      <div className={`active fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                          <HeartFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
      <NavLink to="/account" className="tab flexCenter alignUnder">
          {({ isActive }) => (
              <>
                  <div className="icon-container">
                      <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                          <PersonIcon />
                      </div>
                      <div className={`active fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                          <PersonFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
    </>
  );
}