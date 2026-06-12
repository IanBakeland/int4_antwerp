import { Link, NavLink } from 'react-router-dom';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';

export default function NavbarDesktop() {
  return (
    <>
      <Link to="/" className="navbarAntwerpLogo" aria-label="Go to Homepage"></Link>
      <Link to="/">Home</Link>
      <Link to="/#panoramas">Home</Link>
      <Link to="/radar-explained">Radar</Link>
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
                          <HeartIcon />
                      </div>
                      <div className={`active fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                          <HeartFilledIcon />
                      </div>
                  </div>
              </>
          )}
      </NavLink>
    </>
  );
}