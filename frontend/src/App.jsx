import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Radar from './pages/Radar';
import Favourites from './pages/Favourites';
import Share from './pages/Share';
import RadarExplained from './pages/RadarExplained';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Story from './pages/Story';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [isRadarActive, setIsRadarActive] = useState(true); 
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

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
          if (error.code === 1) setIsRadarActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
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
    <HashRouter>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar token={token} />
      <main id="main-content" tabIndex="-1" style={{ outline: 'none' }}>
        <Routes>
          <Route path="/" element={<Home userLocation={userLocation} />} />
          <Route 
            path="/radar" 
            element={
              <Radar 
                userLocation={userLocation} 
                isRadarActive={isRadarActive} 
                setIsRadarActive={setIsRadarActive} 
                formatDistance={formatDistance}
                selectedStory={selectedStory}
                setSelectedStory={setSelectedStory}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                token={token}
              />
            } 
          />
          <Route 
            path="/share" 
            element={
              token ? <Share /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="/radar-explained" element={<RadarExplained />} />
          <Route 
            path="/story" 
              element={<Story setToken={setToken} userLocation={userLocation} formatDistance={formatDistance} />} 
            />
          <Route 
            path="/favourites" 
            element={
              token ? (
                <Favourites 
                  selectedStory={selectedStory} 
                  setSelectedStory={setSelectedStory} 
                />
              ) : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/account" 
            element={
              token ? <Account setToken={setToken} /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/login" 
            element={
              !token ? <Login setToken={setToken} /> : <Navigate to="/account" replace />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !token ? <Signup /> : <Navigate to="/account" replace />
            } 
          />

        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}