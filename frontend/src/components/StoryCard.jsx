import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StoryCard.module.css';

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

export default function StoryCard({ id, title, category, username, image, hiddenSpots, distance, onSelect }) {
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
      <div>
        <div>
          <PersonIcon />
          <p>{username}</p>
        </div>
        <div className={`${styles.filterButton} ${styles[`${category}Tag`]}`}>
          <CategoryIcon />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {distance && hiddenSpots != null && (
            <div className={styles.filterButton} style={{ width: "auto", padding: "0 0.8rem", borderRadius: "2rem" }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{hiddenSpots}</p>
            </div>
          )}
          



        </div>
      </div>
      {distance && (
        <div className={styles.filterButton} style={{ width: "auto", padding: "0 0.8rem", borderRadius: "2rem", backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.8rem" }}>{distance}</p>
        </div>
      )}
      <div>
        <h3>{title}</h3>
        <HeartFilledIcon />
      </div>
    </div>
  );
}