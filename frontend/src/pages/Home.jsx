import { Link } from 'react-router-dom';

export default function Home({ userLocation }) {
  return (
    <div>
      <h1>Homepage</h1>
      <nav>
        <Link to="/radar">Go to Radar Page</Link>
      </nav>
      
      {userLocation ? (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      ) : (
        <p>Loading location data...</p>
      )}
    </div>
  );
}