export default function Home({ userLocation }) {
  return (
    <div>
      <h1>Homepage</h1>
      
      {userLocation && (
        <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
      )}
    </div>
  );
}