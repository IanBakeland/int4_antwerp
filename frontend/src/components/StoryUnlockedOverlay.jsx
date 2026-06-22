import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './StoryUnlockedOverlay.module.css';

import FavouriteButton from './FavouriteButton';
import ReactionButton from './ReactionButton';

import PersonIcon from '../assets/icons/Person';
import StarFilledIcon from '../assets/icons/StarFilled';
import ShareFilledIcon from '../assets/icons/ShareFilled';
import MuteIcon from '../assets/icons/Mute';
import SpeakerIcon from '../assets/icons/Speaker';
import RadarIcon from '../assets/icons/Radar';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import HeartFilledIcon from '../assets/icons/HeartFilled';

export default function StoryUnlockedOverlay({ story, isMuted, setIsMuted, hasSpeech, favouriteDocId }) {
  const navigate = useNavigate();
  
  const originalImage = story?.panorama?.url;
  const previewImage = story?.panorama?.formats?.large?.url || originalImage;

  const categoryIcons = {
    action: PersonRunningIcon,
    culture: MonumentIcon,
    social: PersonDoubleIcon,
    romantic: HeartFilledIcon,
    business: FolderIcon,
  };

  const CategoryIcon = categoryIcons[story?.category] || HeartFilledIcon;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/story?id=${story?.documentId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title,
          text: story?.preview,
          url: shareUrl
        });
      } catch (error) {
        console.log('Sharing failed.', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link', error);
      }
    }
  };

  return (
    <div className={styles.overlayWrapper}>
      <img src={previewImage} alt="" className={styles.backgroundImage} />
      <div className={styles.gradientOverlay}></div>
      
      <div className={styles.topSection}>
        <div className={styles.dragHandle}></div>
        <div className={styles.unlockedBadge}>
          <RadarIcon />
          <span>Story unlocked</span>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.tagRow}>
          <div className="iconTag">
            <PersonIcon />
            <p>{story?.user?.username}</p>
          </div>
          <div className="iconTag dark">
            <StarFilledIcon />
            <p>{story?.hiddenSpots} Hidden spots</p>
          </div>
          <div className={`categoryTag ${story?.category}Tag`}>
            <CategoryIcon />
          </div>
        </div>

        <h2 className={styles.storyTitle}>{story?.title}</h2>
        
        <div className={styles.markdownContainer}>
          <ReactMarkdown>{story?.story || story?.preview}</ReactMarkdown>
        </div>

        <div className={styles.actionRow}>
          <FavouriteButton 
            storyId={story?.documentId} 
            initialFavouriteDocId={favouriteDocId} 
            iconButton={true}
          />
          
          <ReactionButton storyId={story?.documentId} />

          <button className="iconbutton dark" onClick={handleShare}>
            <ShareFilledIcon />
          </button>

          <button 
            onClick={() => {
              if (hasSpeech) setIsMuted(!isMuted);
            }} 
            className="iconbutton dark"
            style={{ 
              opacity: hasSpeech ? 1 : 0.5,
              cursor: hasSpeech ? 'pointer' : 'default'
            }}
          >
            {isMuted ? <MuteIcon /> : <SpeakerIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}