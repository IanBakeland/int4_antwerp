import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
export default function Home({ userLocation }) {
  return (
    <div>
      <h1>Homepage</h1>
      <Navbar />
      
      {userLocation && (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      )}
    </div>
  );
}