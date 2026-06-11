import { NavLink } from 'react-router-dom';
import HomeIcon from '../assets/icons/Home';
import HomeFilledIcon from '../assets/icons/HomeFilled';
import RadarIcon from '../assets/icons/Radar';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PlusCircleIcon from '../assets/icons/PlusCircle';
import PlusCircleFilledIcon from '../assets/icons/PlusCircleFilled';

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
            {({ isActive }) => (
                <>
                    <div className="icon-container">
                        <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                            <HeartIcon />
                        </div>
                        <div className={`fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                            <HeartFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Favourites</p>
                </>
            )}
        </NavLink>
        <NavLink to="/share" className="tab flexCenter alignUnder">
            {({ isActive }) => (
                <>
                    <div className="icon-container">
                        <div className={`fade-icon ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                            <PlusCircleIcon />
                        </div>
                        <div className={`fade-icon ${isActive ? 'icon-visible' : 'icon-hidden'}`}>
                            <PlusCircleFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Share</p>
                </>
            )}
        </NavLink>
    </>
  );
}