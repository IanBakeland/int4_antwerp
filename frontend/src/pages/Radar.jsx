import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Radar.module.css';

import useDocumentTitle from '../hooks/useDocumentTitle';
import FiltersRadar from '../components/FiltersRadar';
import RadarVisual from '../components/RadarVisual';
import StoryCard from '../components/StoryCard';

import PersonIcon from '../assets/icons/Person';
import MuteIcon from '../assets/icons/Mute';
import LocationFilledIcon from '../assets/icons/LocationFilled';

export default function Radar({ userLocation, isRadarActive, setIsRadarActive, selectedLocation, setSelectedLocation, distance, setDistance, formatDistance }) {
  useDocumentTitle('Radar');

  const [stories, setStories] = useState([]);
  const [closestStory, setClosestStory] = useState(null);
  const [closestDistance, setClosestDistance] = useState(null);

  useEffect(() => {
      const fetchStories = async () => {
        try {
          const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/stories?populate[0]=panorama&populate[1]=user");
          if (!res.ok) throw new Error("Failed to fetch stories");
          const data = await res.json();
          setStories(data.data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchStories();
    }, []);

  useEffect(() => {
    if (userLocation && stories.length > 0) {
      let minDistance = Infinity;
      let nearest = null;
      const earthRadiusMeters = 6371000;
      const userLatRadians = userLocation.lat * (Math.PI / 180);

      stories.forEach(story => {
        if (story.latitude && story.longitude) {
          const targetLatRadians = story.latitude * (Math.PI / 180);
          const latDifferenceRadians = (story.latitude - userLocation.lat) * (Math.PI / 180);
          const lngDifferenceRadians = (story.longitude - userLocation.lng) * (Math.PI / 180);

          const intermediateValueA = 
            Math.sin(latDifferenceRadians / 2) * Math.sin(latDifferenceRadians / 2) +
            Math.cos(userLatRadians) * Math.cos(targetLatRadians) *
            Math.sin(lngDifferenceRadians / 2) * Math.sin(lngDifferenceRadians / 2);
          
          const intermediateValueC = 2 * Math.atan2(Math.sqrt(intermediateValueA), Math.sqrt(1 - intermediateValueA));
          const totalMeters = earthRadiusMeters * intermediateValueC;

          if (totalMeters < minDistance) {
            minDistance = totalMeters;
            nearest = story;
          }
        }
      });

      if (nearest) {
        setClosestStory(nearest);
        setClosestDistance(minDistance);
      }
    } else {
      setClosestStory(null);
      setClosestDistance(null);
    }
  }, [userLocation, stories]);

  const activeDistance = selectedLocation ? distance : closestDistance;
  const targetStoryToDisplay = selectedLocation ? null : closestStory;

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
      <div className={`toolbar noDesktop noTablet`}>
        <div className="alignNext">
          <h1>The <span>radar</span></h1>
          <Link to="#" className="iconbutton"><MuteIcon /></Link>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Radar</h1>
      </div>

      <FiltersRadar />
      
      <RadarVisual distance={activeDistance} isRadarActive={isRadarActive} />
      
      {activeDistance != null && isRadarActive && (
        <div className={`${styles.distanceTag} flexCenter`}>
          <LocationFilledIcon />
          <p>{formatDistance(activeDistance)}</p>
        </div>
      )}

      {targetStoryToDisplay && isRadarActive && !selectedLocation && (
        <div style={{ marginTop: "1rem", padding: "0 1rem" }}>
          <StoryCard 
            key={targetStoryToDisplay.documentId}
            title={targetStoryToDisplay.title}
            category={targetStoryToDisplay.category}
            username={targetStoryToDisplay.user?.username}
            image={targetStoryToDisplay.panorama}
          />
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