import { useEffect, useState } from 'react';
import styles from './StoryCardSelected.module.css';

import PersonIcon from '../assets/icons/Person'
import PersonFilledIcon from '../assets/icons/PersonFilled';
import RadarIcon from '../assets/icons/Radar';
import RadarLocationIcon from '../assets/icons/RadarLocation';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';

export default function StoryCardSelected({ title, category, username, image, state, hiddenSpots, onSelect }) {
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
      className={`${styles.storyCard} alignUnder`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        cursor: state === "closest" ? "pointer" : "default" 
      }}
      onClick={state === "closest" ? onSelect : undefined}
    >
      {state === "selected" ? (
        <div className={`${styles.currentState} alignNext`}>
          <RadarLocationIcon />
          <p>Selected story</p>
        </div>
      ) : (
        <div className={`${styles.currentState} alignNext`}>
          <RadarIcon />
          <p>Currently locating</p>
        </div>
      )}
      <div className='alignNext' style={{ gap: '1rem' }}>
        <div className={styles.personTag}>
          <PersonIcon />
          <p>{username}</p>
        </div>
        <div className={styles.filterButton}>
          <PersonIcon />
          <p className={`${styles.filterButton}`}>{hiddenSpots} hidden spots</p>
        </div>
        <div className={`${styles.categoryTag} ${styles[`${category}Tag`]}`}>
          <CategoryIcon />
        </div>
      </div>
      <div>
        <h3>{title}</h3>
        <HeartFilledIcon />
      </div>
    </div>
  );
}