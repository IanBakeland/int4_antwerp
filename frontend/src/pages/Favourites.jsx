import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PersonIcon from '../assets/icons/Person';
import FavouriteAntistate from '../components/FavouriteAntistate';

export default function Favourites() {
  useDocumentTitle('Favourites');

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFavourites = async () => {
      try {
        const userRes = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me?populate=favourites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!userRes.ok) throw new Error("Failed to fetch user profile.");
        const userData = await userRes.json();

        if (!userData.favourites?.length) {
          setFavourites([]);
          return;
        }

        const inQuery = userData.favourites
          .map((fav, index) => `filters[documentId][$in][${index}]=${fav.documentId}`)
          .join('&');
        
        const favRes = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/favourites?${inQuery}&populate[story][populate]=panorama`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!favRes.ok) throw new Error("Failed to fetch detailed favourites.");
        const favData = await favRes.json();

        setFavourites(favData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [token]);

  return (
    <div>
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext">
          <h1>Your <span>favourites</span></h1>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className="noMobile">
        <h1>Your <span>favourites</span></h1>
      </div>
      
      <div className="favouritesContainer">
        {loading ? (
          <p>Loading your saved panoramas...</p>
        ) : favourites.length > 0 ? (
          <div className="favouritesGrid">
            {favourites.map((favItem) => {
              const story = favItem.story;
              
              if (!story) return null; 

              return (
                <div key={favItem.documentId} className="favouriteCard">
                  {story.panorama && (
                    <img 
                      src={story.panorama.formats?.high?.url || story.panorama.url} 
                      alt={story.title} 
                    />
                  )}
                  <div className="favouriteInfo">
                    <h3>{story.title}</h3>
                    <p>{story.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <FavouriteAntistate />
        )}
      </div>
    </div>
  );
}