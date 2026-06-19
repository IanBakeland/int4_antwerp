import { useEffect, useState } from 'react';
import styles from './StoryCard.module.css';

//icons
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonIcon from '../assets/icons/Person';

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
          <HeartFilledIcon />
        </div>
      </div>
      <div>
        <h3>{title}</h3>
        <HeartFilledIcon />
      </div>
    </div>
  );
}