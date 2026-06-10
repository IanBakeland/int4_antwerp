import { Link } from 'react-router-dom';

export default function Favourites() {
  return (
    <div>
      <h1>Favourites Page</h1>
      <nav>
        <Link to="/">Go to Homepage</Link> | <Link to="/radar">Go to Radar Page</Link> | <Link to="/share">Go to Share Page</Link>
      </nav>
    </div>
  );
}