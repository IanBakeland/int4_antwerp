import { Link } from 'react-router-dom';
import styles from './Radar.module.css';

import useDocumentTitle from '../hooks/useDocumentTitle';
import FiltersRadar from '../components/FiltersRadar';
import RadarVisual from '../components/RadarVisual';

//icons
import PersonIcon from '../assets/icons/Person';
import MuteIcon from '../assets/icons/Mute';
import LocationFilledIcon from '../assets/icons/LocationFilled';

export default function Radar({ userLocation, isRadarActive, setIsRadarActive, selectedLocation, setSelectedLocation, distance, setDistance, formatDistance }) {
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
      <div className={`${styles.toolbar} ${styles.noDesktop} ${styles.noTablet}`}>
        <div className="alignNext">
          <h1>Radar</h1>
          <Link to="#" className={styles.iconbutton}><MuteIcon /></Link>
          <Link to="/profile" className={styles.iconbutton}><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Radar</h1>
      </div>

      <FiltersRadar />
      <RadarVisual distance={distance} isRadarActive={isRadarActive} />
      {distance != null && isRadarActive && (
        <div className={`${styles.distanceTag} flexCenter`}>
          <LocationFilledIcon />
          <p>{formatDistance(distance)}</p>
        </div>
      )}
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <div>
        <input
          type="range"
          min="0"
          max="2000"
          value={distance ?? 2000}
          onChange={(e) => setDistance(e.target.value)}
        />
        <p>Distance: {distance}</p>
      </div>
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
          <input type="number" step="any" name="latitude" required/>
        </div>
        <div>
          <label>Longitude: </label>
          <input type="number" step="any" name="longitude" required />
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
