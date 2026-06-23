import { useEffect, useState } from 'react';
import styles from './StoryCardSelected.module.css';

import FavouriteButton from '../components/FavouriteButton';

//Icons
import PersonIcon from '../assets/icons/Person'
import StarFilledIcon from '../assets/icons/StarFilled';
import RadarIcon from '../assets/icons/Radar';
import RadarLocationIcon from '../assets/icons/RadarLocation';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';

export default function StoryCardSelected({ id, title, category, username, image, state, hiddenSpots, favouriteDocId, onSelect }) {
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

  return (
    <div
      className={`${styles.storyCard} alignUnder ${state === "selected" ? styles.selected : ""}`}       
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        cursor: "pointer"
      }}
      onClick={onSelect}
    >
      {state === "selected" ? (
        <div className={`${styles.currentState} alignNext`}>
          <RadarLocationIcon />
          <p>Selected story</p>
        </div>
      ) : (
        <div className={`${styles.currentState} alignNext`}>
          <RadarIcon />
          <p>Closest story</p>
        </div>
      )}
      <div className='alignNext' style={{ gap: '0.4rem' }}>
        <div className="iconTag">
          <PersonIcon />
          <p>{username}</p>
        </div>
        <div className={`categoryTag ${category}Tag`}>
          <CategoryIcon />
        </div>
        <div className="iconTag dark">
          <StarFilledIcon />
          <p>{hiddenSpots?.length || 0} hidden spots</p>
        </div>
      </div>
      <div>
        <h3>{title}</h3>
        <FavouriteButton 
          storyId={id} 
          initialFavouriteDocId={favouriteDocId} 
        />
      </div>
    </div>
  );
}