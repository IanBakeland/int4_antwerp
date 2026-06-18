import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

//icons
import PersonIcon from '../assets/icons/Person';
import FavouriteAntistate from '../components/FavouriteAntistate';

export default function Favourites() {
  useDocumentTitle('Favourites');

  const [favourites, setFavourites] = useState([]);

  return (
    <div>
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext">
          <h1>Your <span>favourites</span></h1>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Your favourites</h1>
      </div>
      
      <div className="favouritesContainer">
        {favourites.length > 0 ? (
          <div className="favouritesGrid">
            <p>Favourites list will map here</p>
          </div>
        ) : (
          <FavouriteAntistate />
        )}
      </div>
    </div>
  );
}