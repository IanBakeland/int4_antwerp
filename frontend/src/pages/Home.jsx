import { useLocation, Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import LogoAS from '../assets/icons/Logo';
import panoImage from '../assets/images/pano.jpeg';
import PanoramaViewer from '../components/PanoramaViewer';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import NavbarMobile from '../components/NavbarMobile';
import NavbarDesktop from '../components/NavbarDesktop';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  return (
    <>
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
    <div className="homeContainer">
      <div className="homeLogoWrapper">
        <LogoAS />
      </div>
      
      <PanoramaViewer image={panoImage} className="homePanoImage" />
      
      {userLocation && (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      )}

      {/* SVG ClipPath for the curved mobile banner effect */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id="pano-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 C 0.5,0.04 0.5,0.04 1,0 L 1,1 C 0.5,0.96 0.5,0.96 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
    </>
  );
}