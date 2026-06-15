import { Link } from 'react-router-dom';
import FiltersRadar from '../components/FiltersRadar';
import RadarVisual from '../components/RadarVisual';

//icons
import PersonIcon from '../assets/icons/Person';
import MuteIcon from '../assets/icons/Mute';
import { useEffect } from 'react';

export default function Radar({ userLocation, isRadarActive, setIsRadarActive, selectedLocation, setSelectedLocation, distance, setDistance, formatDistance }) {
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
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext ">
          <h1>Radar</h1>
          <Link to="#" className="iconbutton"><MuteIcon /></Link>
          <Link to="/profile" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Radar</h1>
      </div>

          <div>
            <input
              type="range"
              min="5"
              max="2500"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            />
            <p>Distance: {distance}</p>
          </div>
      <FiltersRadar />
      <RadarVisual distance={distance}/>
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
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
      <hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/>
    </div>
  );
}