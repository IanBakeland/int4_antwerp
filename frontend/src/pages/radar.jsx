import { useState, useEffect } from 'react';

export default function Radar() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  return (
    <div className="radar-container">
      <h1>Live Radar</h1>
      {userLocation ? (
        <p>Location found: {userLocation.lat}, {userLocation.lng}</p>
      ) : (
        <p>Searching for satellite signal...</p>
      )}
    </div>
  );
}