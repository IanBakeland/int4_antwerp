import { useLocation } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import LogoAS from '../assets/icons/Logo';
import panoImage from '../assets/images/pano.jpeg';

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  return (
    <div className="homeContainer">
      <div className="homeLogoWrapper">
        <LogoAS />
      </div>
      
      <img src={panoImage} alt="Panorama" className="homePanoImage" />
      
      {userLocation && (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      )}

      {/* SVG ClipPath for the curved mobile banner effect */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id="pano-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 C 0.5,0.08 0.5,0.08 1,0 L 1,1 C 0.5,0.92 0.5,0.92 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}