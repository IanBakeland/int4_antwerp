import { useLocation } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  return (
    <div>
      <h1>Homepage</h1>
      
      {userLocation && (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      )}
    </div>
  );
}