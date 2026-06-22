import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PersonIcon from '../assets/icons/Person';
import FavouriteAntistate from '../components/FavouriteAntistate';
import Loading from '../components/Loading';
import StoryCard from '../components/StoryCard';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import styles from './Favourites.module.css';

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
        
        const favRes = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/favourites?${inQuery}&populate[story][populate][0]=panorama&populate[story][populate][1]=user`, {
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
        <div className={`alignNext ${styles.toolbarInner}`}>
          {(!loading && favourites.length === 0) ? (
            <Link to="/" className="mobileLogoLink" aria-label="Go to Homepage">
              <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
            </Link>
          ) : (
            <h1>Your <span>favourites</span></h1>
          )}
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      
      {(loading || favourites.length > 0) && (
        <div className="noMobile">
          <h1>Your <span>favourites</span></h1>
        </div>
      )}
      
      <div className="favouritesContainer">
        {loading ? (
          <>
            <Loading message="Loading your favourite stories..." />
          </> 
        ) : favourites.length > 0 ? (
          <div className="storyCardContainer">
            {favourites.map((favItem) => {
              const story = favItem.story;
              
              if (!story) return null; 

              return (
                <StoryCard 
                  key={favItem.documentId}
                  id={story.documentId}
                  title={story.title}
                  category={story.category}
                  username={story.user?.username}
                  image={story.panorama}
                  favouriteDocId={favItem.documentId}
                />
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