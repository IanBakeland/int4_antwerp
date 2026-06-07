import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Radar from './pages/Radar';

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [isRadarActive, setIsRadarActive] = useState(false);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home userLocation={userLocation} />} />
        <Route path="/radar" element={<Radar userLocation={userLocation} isRadarActive={isRadarActive} setIsRadarActive={setIsRadarActive} />} />
      </Routes>
    </BrowserRouter>
  );
} 