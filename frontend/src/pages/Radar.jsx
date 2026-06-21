import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Radar.module.css';

import useDocumentTitle from '../hooks/useDocumentTitle';
import FiltersRadar from '../components/FiltersRadar';
import RadarVisual from '../components/RadarVisual';
import StoryCardSelected from '../components/StoryCardSelected';
import StoryCard from '../components/StoryCard';

import PersonIcon from '../assets/icons/Person';
import MuteIcon from '../assets/icons/Mute';
import LocationFilledIcon from '../assets/icons/LocationFilled';

export default function Radar({ 
  userLocation, 
  isRadarActive, 
  setIsRadarActive, 
  formatDistance,
  selectedStory,
  setSelectedStory,
  activeFilters,
  setActiveFilters,
  token
}) {
  useDocumentTitle('Radar');

  const [stories, setStories] = useState([]);
  const [userFavourites, setUserFavourites] = useState({});

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/stories?populate[0]=panorama&populate[1]=user");
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data = await res.json();
        setStories(data.data || []);

        if (token) {
          const userRes = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me?populate=favourites", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            
            if (userData.favourites && userData.favourites.length > 0) {
              const inQuery = userData.favourites
                .map((fav, index) => `filters[documentId][$in][${index}]=${fav.documentId}`)
                .join('&');

              const favRes = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/favourites?${inQuery}&populate=story`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (favRes.ok) {
                const favData = await favRes.json();
                
                const favMapping = {};
                favData.data.forEach(favItem => {
                  if (favItem.story?.documentId) {
                    favMapping[favItem.story.documentId] = favItem.documentId;
                  }
                });

                setUserFavourites(favMapping);
              }
            } else {
              setUserFavourites({});
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStories();
  }, [token]);

  const { activeStory, activeDistance, nearbyStories } = useMemo(() => {
    let filteredStories = stories;

    if (activeFilters.includes('Favourites')) {
      filteredStories = filteredStories.filter(story => Boolean(userFavourites[story.documentId]));
    }

    const categoryFilters = activeFilters.filter(f => f !== 'Favourites').map(f => f.toLowerCase());
    if (categoryFilters.length > 0) {
      filteredStories = filteredStories.filter(story => categoryFilters.includes(story.category?.toLowerCase()));
    }

    if (!userLocation || filteredStories.length === 0) {
      return { activeStory: null, activeDistance: null, nearbyStories: [] };
    }

    const earthRadiusMeters = 6371000;
    const userLatRadians = userLocation.lat * (Math.PI / 180);

    const getDistance = (lat, lng) => {
      const targetLatRadians = lat * (Math.PI / 180);
      const latDifferenceRadians = (lat - userLocation.lat) * (Math.PI / 180);
      const lngDifferenceRadians = (lng - userLocation.lng) * (Math.PI / 180);

      const intermediateValueA = 
        Math.sin(latDifferenceRadians / 2) * Math.sin(latDifferenceRadians / 2) +
        Math.cos(userLatRadians) * Math.cos(targetLatRadians) *
        Math.sin(lngDifferenceRadians / 2) * Math.sin(lngDifferenceRadians / 2);
      
      const intermediateValueC = 2 * Math.atan2(Math.sqrt(intermediateValueA), Math.sqrt(1 - intermediateValueA));
      return earthRadiusMeters * intermediateValueC;
    };

    const storiesWithDistance = filteredStories
      .filter(story => story.latitude && story.longitude)
      .map(story => ({
        ...story,
        calculatedDistance: getDistance(story.latitude, story.longitude)
      }))
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);

    let currentActiveStory = null;
    let currentActiveDistance = null;

    if (selectedStory) {
      currentActiveStory = selectedStory;
      currentActiveDistance = getDistance(selectedStory.latitude, selectedStory.longitude);
    } else if (storiesWithDistance.length > 0) {
      currentActiveStory = storiesWithDistance[0];
      currentActiveDistance = storiesWithDistance[0].calculatedDistance;
    }

    let nearby = [];
    if (currentActiveStory) {
      nearby = storiesWithDistance
        .filter(story => story.documentId !== currentActiveStory.documentId)
        .slice(0, 6);
    }

    return { 
      activeStory: currentActiveStory, 
      activeDistance: currentActiveDistance, 
      nearbyStories: nearby 
    };
  }, [userLocation, stories, selectedStory, activeFilters, userFavourites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputId = data.get('storyId')?.trim();

    const target = stories.find(s => s.documentId === inputId || String(s.id) === inputId);

    if (!target) {
      alert(`Error: Could not find a story with ID '${inputId}'.`);
      return;
    }

    if (!target.latitude || !target.longitude) {
      alert(`Error: Story ${inputId} does not have coordinates.`);
      return;
    }

    setActiveFilters([]); 
    setSelectedStory(target);
  };

  const handleReset = () => {
    setSelectedStory(null);
  };

  return (
    <div>
      <div className={`toolbar noDesktop noTablet`}>
        <div className="alignNext">
          <h1>The <span>radar</span></h1>
          <Link to="#" className="iconbutton" aria-label="Mute sounds"><MuteIcon /></Link>
          <Link to="/account" className="iconbutton" aria-label="Account"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>The <span>radar</span></h1>
      </div>

      <FiltersRadar 
        activeFilters={activeFilters} 
        setActiveFilters={setActiveFilters} 
        selectedStory={selectedStory}
        setSelectedStory={setSelectedStory} 
      />
      
      <RadarVisual distance={activeDistance} isRadarActive={isRadarActive} />
      
      {activeDistance != null && isRadarActive && (
        <div className={`${styles.distanceTag} flexCenter`}>
          <LocationFilledIcon />
          <p>{formatDistance(activeDistance)}</p>
        </div>
      )}

      {activeStory && isRadarActive && (
          <StoryCardSelected 
            key={activeStory.documentId}
            id={activeStory.documentId}
            title={activeStory.title}
            category={activeStory.category}
            username={activeStory.user?.username}
            image={activeStory.panorama}
            favouriteDocId={userFavourites[activeStory.documentId] || null}
            state={selectedStory ? "selected" : "closest"}
            hiddenSpots={activeStory.hiddenSpots}
            onSelect={() => {
              setSelectedStory(activeStory);
            }}
          />
      )}

      {nearbyStories.length > 0 && isRadarActive && (
        <>
          <h2>Stories <span>nearby</span></h2>
          <div className="storyCardContainer">
            {nearbyStories.map((story) => (
              <StoryCard 
                key={story.documentId}
                id={story.documentId}
                title={story.title}
                category={story.category}
                username={story.user?.username}
                hiddenSpots={story.hiddenSpots}
                image={story.panorama}
                favouriteDocId={userFavourites[story.documentId] || null}
                distance={formatDistance(story.calculatedDistance)}
                onSelect={() => {
                  setSelectedStory(story);
                }}
              />
            ))}
          </div>
        </>
      )}

      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

      <form>
        <label htmlFor="radar-tracking-checkbox">
          Enable Radar Tracking
        </label>
        <input
          id="radar-tracking-checkbox"
          type="checkbox"
          checked={isRadarActive}
          onChange={(e) => setIsRadarActive(e.target.checked)}
        />
      </form>

      <h2>Test Location Input</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="story-id-input">Story ID: </label>
          <input id="story-id-input" type="text" name="storyId" placeholder="Enter documentId or ID" required/>
        </div>
        <button type="submit">Lock Target to Story</button>
      </form>

      {selectedStory && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleReset} style={{ backgroundColor: "red", color: "white" }}>
            Debug Reset Target
          </button>
        </div>
      )}

      {activeStory && (
        <div>
          <h3>Active Target:</h3>
          <p>Title: {activeStory.title}</p>
          <p>Target Lat: {activeStory.latitude}</p>
          <p>Target Lng: {activeStory.longitude}</p>
        </div>
      )}

      {activeDistance !== null && (
        <div>
          <h2>Proximity Calculation</h2>
          <p>Distance to target: {formatDistance(activeDistance)}</p>
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