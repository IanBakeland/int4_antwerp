import { Link } from 'react-router-dom';

export default function FavouritesNotLoggedIn() {
  return (
    <div style={{ position: 'relative', zIndex: 11 }}>
      <p>Log in om je favorieten te zien</p>
      <Link to="/login">
        <button>Log nu in</button>
      </Link>
    </div>
  );
}
