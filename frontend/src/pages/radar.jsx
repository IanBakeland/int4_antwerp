import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Radar({ userLocation, isRadarActive, setIsRadarActive, selectedLocation, setSelectedLocation, distance, formatDistance }) {
  useDocumentTitle('Radar');
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const lat = data.get('latitude');
    const lng = data.get('longitude');
    
    if (lat && lng) {
      setSelectedLocation({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }
  };

  return (
    <div>
      <h1>Radar Page</h1>

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

      <h2>Test Location Input</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Latitude: </label>
          <input 
            type="number" 
            step="any"
            name="latitude"
            required 
          />
        </div>
        <div>
          <label>Longitude: </label>
          <input 
            type="number" 
            step="any"
            name="longitude"
            required 
          />
        </div>
        <button type="submit">Save Target Location</button>
      </form>

      {selectedLocation && (
        <div>
          <h3>Saved Target Location:</h3>
          <p>Target Lat: {selectedLocation.lat}</p>
          <p>Target Lng: {selectedLocation.lng}</p>
        </div>
      )}

      {distance !== null && (
        <div>
          <h2>Proximity Calculation</h2>
          <p>Distance to target: {formatDistance(distance)}</p>
        </div>
      )}

      <h2>Live Status</h2>
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