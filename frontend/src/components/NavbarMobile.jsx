import { NavLink } from 'react-router-dom';
import HomeIcon from '../assets/icons/Home';
import HomeFilledIcon from '../assets/icons/HomeFilled';
import RadarIcon from '../assets/icons/Radar';

export default function NavbarMobile() {
  return (
    <>
        <NavLink to="/" className="tab flexCenter alignUnder">
            {({ isActive }) => (
                <>
                    <div className="icon-container">
                        <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                            <HomeIcon />
                        </div>
                        <div className={`fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                            <HomeFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Home</p>
                </>
            )}
        </NavLink>
        <NavLink to="/radar" className="tab flexCenter alignUnder">
            {({ isActive }) => (
                <>
                    <div className="icon-container">
                        <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                            <RadarIcon />
                        </div>
                        <div className={`fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                            <RadarIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Radar</p>
                </>
            )}
        </NavLink>
        <NavLink to="/favourites" className="tab flexCenter alignUnder">
            Favourites
        </NavLink>
        <NavLink to="/share" className="tab flexCenter alignUnder">
            Share
        </NavLink>
    </>
  );
}