import { useEffect, useState } from 'react';
import styles from './StoryCard.module.css';

//icons
import PersonIcon from '../assets/icons/Person'
import PersonFilledIcon from '../assets/icons/PersonFilled';
import MagnifierIcon from '../assets/icons/Magnifier';
import FilterIcon from '../assets/icons/Filter';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import CircleGridIcon from '../assets/icons/CircleGrid';
import CircleGridFilledIcon from '../assets/icons/CircleGridFilled';


export default function StoryCard({ title, category, username, image }) {
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
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      <div>
        <div>
          <PersonIcon />
          <p>{username}</p>
        </div>
        <div className={`${styles.filterButton} ${styles[`${category}Tag`]}`}>
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