import { NavLink } from 'react-router-dom';

//icons
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
        <NavLink to="/" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
                <>
                    <div className="iconContainer">
                        <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                            <HomeIcon />
                        </div>
                        <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
                            <HomeFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Stories</p>
                </>
            )}
        </NavLink>
        <NavLink to="/radar" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
                <>
                    <div className="iconContainer">
                        <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                            <RadarIcon />
                        </div>
                        <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
                            <RadarIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Radar</p>
                </>
            )}
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
                <>
                    <div className="iconContainer">
                        <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                            <HeartIcon />
                        </div>
                        <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
                            <HeartFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? 'active' : ''}>Favourites</p>
                </>
            )}
        </NavLink>
        <NavLink to="/share" className={({ isActive }) => `tab flexCenter alignUnder ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
                <>
                    <div className="iconContainer">
                        <div className={`fadeIcon ${isActive ? 'iconHidden' : 'iconVisible'}`}>
                            <PlusCircleIcon />
                        </div>
                        <div className={`active fadeIcon ${isActive ? 'iconVisible' : 'iconHidden'}`}>
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
