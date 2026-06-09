import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Radar from './pages/Radar';

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [isRadarActive, setIsRadarActive] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // handles turning  GPS tracking  on/off
  useEffect(() => {
    let watcherId;

    if (isRadarActive && "geolocation" in navigator) {
      watcherId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error(error.message);
          setIsRadarActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    } else {
      setUserLocation(null);
    }

    return () => {
      if (watcherId) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, [isRadarActive]);

  // calculates the distence between userLocation and selectedLocation
  useEffect(() => {
    if (userLocation) {
      if (selectedLocation) {
        
        // 1. Define the Earth's radius in meters directly
        const earthRadiusMeters = 6371000;

        // 2. Convert degrees to radians individually
        const userLatRadians = userLocation.lat * (Math.PI / 180);
        const targetLatRadians = selectedLocation.lat * (Math.PI / 180);
        
        // 3. Calculate the radian differences split up
        const latDifferenceRadians = (selectedLocation.lat - userLocation.lat) * (Math.PI / 180);
        const lngDifferenceRadians = (selectedLocation.lng - userLocation.lng) * (Math.PI / 180);

        // 4. Break down the core trigonometry components
        const intermediateValueA = 
          Math.sin(latDifferenceRadians / 2) * Math.sin(latDifferenceRadians / 2) +
          Math.cos(userLatRadians) * Math.cos(targetLatRadians) *
          Math.sin(lngDifferenceRadians / 2) * Math.sin(lngDifferenceRadians / 2);
        
        const intermediateValueC = 2 * Math.atan2(Math.sqrt(intermediateValueA), Math.sqrt(1 - intermediateValueA));

        // 5. Multiply by Earth's radius to get final meters
        const totalMeters = earthRadiusMeters * intermediateValueC;

        setDistance(totalMeters);
      }
    } else {
      setDistance(null);
    }
  }, [userLocation, selectedLocation]); // track changes for those variables and execute that effect

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home userLocation={userLocation} />} />
        <Route 
          path="/radar" 
          element={
            <Radar 
              userLocation={userLocation} 
              isRadarActive={isRadarActive} 
              setIsRadarActive={setIsRadarActive} 
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              distance={distance} // Passing the distance calculation down
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}