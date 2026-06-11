import { Link } from 'react-router-dom';

export default function Share() {
  return (
    <div>
      <h1>Share Page</h1>
      <nav>
        <Link to="/">Go to Homepage</Link> | <Link to="/radar">Go to Radar Page</Link> | <Link to="/favourites">Go to Favourites Page</Link>
      </nav>
    </div>
  );
}