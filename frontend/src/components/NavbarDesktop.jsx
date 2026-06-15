import { Link, NavLink, useLocation } from 'react-router-dom';
import SmartButton from './SmartButton';

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
      <Link to="/" className="navbarAntwerpLogo" aria-label="Go to Homepage"></Link>
      <div className="navbarDesktopAnimation flexCenter">
        <Link to="/" className={`navbarDesktopItem ${checkActive('/', '') ? 'active' : ''}`}>HOME</Link>
        <Link to="/#panoramas" className={`navbarDesktopItem ${checkActive('/', '#panoramas') ? 'active' : ''}`}>PANORAMAS</Link>
        <Link to="/radar-explained" className={`navbarDesktopItem ${checkActive('/radar-explained', '') ? 'active' : ''}`}>RADAR</Link>
      </div>


      <SmartButton to="/share" icon={<PlusCircleIcon />}>Share your story</SmartButton>


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
    </div>
  );
}