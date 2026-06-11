import { NavLink } from 'react-router-dom';
import HomeIcon from '../assets/icons/Home';
import HomeIconFilled from '../assets/icons/HomeFilled';

export default function NavbarMobile() {
  return (
    <>
        <NavLink to="/" className="tab flexCenter alignUnder">
            {({ isActive }) => (
                <>
                    <div>
                        {isActive ? (
                            <HomeIconFilled />
                        ) : (
                            <HomeIcon />
                        )}
                    </div>
                    <p style={{ fontWeight: isActive ? 'bold' : 'normal' }}>Home</p>
                </>
            )}
        </NavLink>
        <NavLink to="/radar" className="tab flexCenter alignUnder">
            Radar
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