import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './FavouriteButton.module.css';

import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';

export default function FavouriteButton({ storyId, initialFavouriteDocId }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [favDocId, setFavDocId] = useState(initialFavouriteDocId);

  useEffect(() => {
    setFavDocId(initialFavouriteDocId);
  }, [initialFavouriteDocId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      navigate('/login');
      return;
    }

    const previousFavDocId = favDocId;

    if (favDocId) {
      setFavDocId(null);
      try {
        const res = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/favourites/${favDocId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to remove favourite");
      } catch (error) {
        console.error(error);
        setFavDocId(previousFavDocId);
      }
    } else {
      setFavDocId("temp-loading"); 
      try {
        const userRes = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error("Failed user fetch");
        const userData = await userRes.json();

        const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/favourites", {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            data: {
              story: storyId,
              user: userData.id
            }
          })
        });

        if (!res.ok) throw new Error("Failed to add favourite");
        const newData = await res.json();
        setFavDocId(newData.data.documentId);
      } catch (error) {
        console.error(error);
        setFavDocId(null);
      }
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      className={styles.favIcon}
      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
    >
      {favDocId ? <HeartFilledIcon /> : <HeartIcon />}
    </button>
  );
}