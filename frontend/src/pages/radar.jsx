import { Link } from 'react-router-dom';

export default function Radar({ userLocation, isRadarActive, setIsRadarActive }) {
  return (
    <div>
      <h1>Radar Page</h1>
      <nav>
        <Link to="/">Go to Homepage</Link>
      </nav>

      <form>
        <label>
          <input 
            type="checkbox" 
            checked={isRadarActive} 
            onChange={(e) => setIsRadarActive(e.target.checked)} 
          />
          Enable Radar Tracking
        </label>
      </form>

      {isRadarActive ? (
        userLocation ? (
          <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
        ) : (
          <p>Loading location data...</p>
        )
      ) : (
        <p>Radar is disabled</p>
      )}
    </div>
  );
}