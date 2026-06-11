import { Link } from 'react-router-dom';

export default function NavbarMobile() {
  return (
    <>
      <Link to="/">Home</Link> | <Link to="/radar">Radar</Link> | <Link to="/favourites">Favourites</Link> | <Link to="/share">Share</Link>
    </>
  );
}