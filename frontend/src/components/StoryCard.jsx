import styles from './StoryCard.module.css';

//icons 
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonIcon from '../assets/icons/Person';

export default function StoryCard({ title, category, username, image }) {
  const highQualityImage = image?.url || image?.formats?.large?.url;

  return (
    <div className={`${styles.storyCard} alignUnder`} style={ highQualityImage ? { backgroundImage: `url(${highQualityImage})` } : undefined }>
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