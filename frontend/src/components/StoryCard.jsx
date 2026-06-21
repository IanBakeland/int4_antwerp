import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StoryCard.module.css';

import FavouriteButton from '../components/FavouriteButton';

import PersonIcon from '../assets/icons/Person'
import StarFilledIcon from '../assets/icons/StarFilled';
import MagnifierIcon from '../assets/icons/Magnifier';
import FilterIcon from '../assets/icons/Filter';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import LocationFilledIcon from '../assets/icons/LocationFilled';
import CircleGridFilledIcon from '../assets/icons/CircleGridFilled';

export default function StoryCard({ id, title, category, username, image, hiddenSpots, distance, favouriteDocId, onSelect }) {
  const navigate = useNavigate();
  const previewImage = image?.formats?.large?.url;
  const originalImage = image?.url;

  const [backgroundImage, setBackgroundImage] = useState(previewImage || originalImage);

  useEffect(() => {
    if (!originalImage || originalImage === previewImage) return;

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      setBackgroundImage(originalImage);
    };
  }, [originalImage, previewImage]);

  const categoryIcons = {
    action: PersonRunningIcon,
    culture: MonumentIcon,
    social: PersonDoubleIcon,
    romantic: HeartFilledIcon,
    business: FolderIcon,
  };

  const CategoryIcon = categoryIcons[category] || HeartFilledIcon;

  const handleClick = () => {
    if (distance) {
      if (onSelect) onSelect();
    } else if (id) {
      navigate(`/story?id=${id}`);
    }
  };

  return (
    <div
      className={`${styles.storyCard} alignUnder`}
      onClick={handleClick}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        cursor: "pointer"
      }}
    >
      <div className='alignNext' style={{ gap: '0.5rem' }}>
        <div class="iconTag">
          <PersonIcon />
          <p>{username}</p>
        </div>
        <div className={`categoryTag ${category}Tag`}>
          <CategoryIcon />
        </div>
      </div>

      <div className='alignNext' style={{gap: "0.4rem", marginTop: "auto" }}>
        {distance && (
          <div className="iconTag dark flexcenter">
            <LocationFilledIcon />
            <p>{distance}</p>
          </div>
        )}
        {distance && hiddenSpots != null && (
          <div className="iconTag dark ">
            <StarFilledIcon />
            <p>{hiddenSpots}</p>
          </div>
        )}
      </div>
      <div>
        <h3>{title}</h3>
        <FavouriteButton storyId={id} initialFavouriteDocId={favouriteDocId} />
      </div>
    </div>
  );
}