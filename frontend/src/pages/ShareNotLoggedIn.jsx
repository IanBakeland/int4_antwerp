import { Link } from 'react-router-dom';

export default function ShareNotLoggedIn() {
  return (
    <div style={{ position: 'relative', zIndex: 11 }}>
      <p>Je bent niet ingelogd. Je moet eerst inloggen vooraleer je story kan delen</p>
      <Link to="/login">
        <button>Log in</button>
      </Link>
    </div>
  );
}
