import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Radar from './pages/Radar';
import Favourites from './pages/Favourites';
import Share from './pages/Share';
import RadarExplained from './pages/RadarExplained';
import Account from './pages/Account';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
    if (userLocation && selectedLocation) {
      const earthRadiusMeters = 6371000;
      const userLatRadians = userLocation.lat * (Math.PI / 180);
      const targetLatRadians = selectedLocation.lat * (Math.PI / 180);
      const latDifferenceRadians = (selectedLocation.lat - userLocation.lat) * (Math.PI / 180);
      const lngDifferenceRadians = (selectedLocation.lng - userLocation.lng) * (Math.PI / 180);

      const intermediateValueA = 
        Math.sin(latDifferenceRadians / 2) * Math.sin(latDifferenceRadians / 2) +
        Math.cos(userLatRadians) * Math.cos(targetLatRadians) *
        Math.sin(lngDifferenceRadians / 2) * Math.sin(lngDifferenceRadians / 2);
      
      const intermediateValueC = 2 * Math.atan2(Math.sqrt(intermediateValueA), Math.sqrt(1 - intermediateValueA));
      const totalMeters = earthRadiusMeters * intermediateValueC;

      setDistance(totalMeters);
    } else {
      setDistance(null);
    }
  }, [userLocation, selectedLocation]);

  // Formatting function for meters 
  const formatDistance = (meters) => {
    if (meters === null || meters === undefined) return '';
    
    if (meters < 1000) {
      const roundedMeters = Math.round(meters);
      return new Intl.NumberFormat('nl-BE', { 
        maximumFractionDigits: 0 
      }).format(roundedMeters) + ' m';
    }
    
    const kilometers = meters / 1000;
    return new Intl.NumberFormat('nl-BE', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 1 
    }).format(kilometers) + ' km';
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar />
      <main>
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
                distance={distance}
                formatDistance={formatDistance}
              />
            } 
          />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/share" element={<Share />} />
          <Route path="/radar-explained" element={<RadarExplained />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}