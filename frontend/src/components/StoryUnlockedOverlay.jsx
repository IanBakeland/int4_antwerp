import { useState, useRef, useEffect } from 'react';
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
  
  // Starts in "initial" (off-screen) so it can slide in dynamically
  const [sheetState, setSheetState] = useState('initial');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const contentRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const originalImage = story?.panorama?.url;
  const previewImage = story?.panorama?.formats?.large?.url || originalImage;

  // Trigger the entrance slide-up animation the moment the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setSheetState('half');
    }, 50); // Tiny delay ensures the browser registers the CSS transition
    return () => clearTimeout(timer);
  }, []);

  const categoryIcons = {
    action: PersonRunningIcon,
    culture: MonumentIcon,
    social: PersonDoubleIcon,
    romantic: HeartFilledIcon,
    business: FolderIcon,
  };

  const CategoryIcon = categoryIcons[story?.category] || HeartFilledIcon;

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return; 
    
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    currentY.current = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    currentY.current = e.clientY;
    const delta = currentY.current - startY.current;

    // Prevent dragging above the 'full' maximum height
    if (sheetState === 'full' && delta < 0) return;

    setDragOffset(delta);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const delta = currentY.current - startY.current;
    setDragOffset(0);

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        if (sheetState === 'full') setSheetState('half');
        else if (sheetState === 'half') setSheetState('hidden');
      } else {
        if (sheetState === 'hidden') setSheetState('half');
        else if (sheetState === 'half') setSheetState('full');
      }
    }
  };

  const handleWheel = (e) => {
    if (sheetState === 'full' && contentRef.current?.scrollTop <= 0 && e.deltaY < 0) {
      setSheetState('half');
    }
  };

  const toggleState = () => {
    setSheetState(prev => {
      if (prev === 'hidden') return 'half';
      if (prev === 'half') return 'full';
      return 'half';
    });
  };

  const getTransformStyle = () => {
    if (isDragging) {
      if (sheetState === 'hidden') return `translateY(calc(100% - 11rem + ${dragOffset}px))`; // <-- Updated to 11rem
      if (sheetState === 'half') return `translateY(calc(45vh + ${dragOffset}px))`;
      if (sheetState === 'full') return `translateY(calc(5vh + ${dragOffset}px))`;
    }
    return undefined;
  };

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
    <>
      <div
        className={`${styles.backdrop} ${sheetState === 'full' ? '' : styles.backdropHidden}`}
        onClick={() => setSheetState('half')}
      />
      
      <div
        className={`
          ${styles.overlayWrapper}
          ${styles['state' + sheetState.charAt(0).toUpperCase() + sheetState.slice(1)]}
          ${isDragging ? styles.dragging : ''}
        `}
        style={{ 
          transform: getTransformStyle() || undefined,
          // CRITICAL: Covers nav bar perfectly on full view
          zIndex: sheetState === 'full' ? 99999 : 8900 
        }}
      >
        <div
          className={styles.dragArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={toggleState}
        />

        <div className={styles.fixedHeader}>
          <div className={styles.dragHandle}></div>
          <div className={styles.unlockedBadge}>
            <RadarIcon />
            <span>Story unlocked</span>
          </div>
        </div>

        <div
          className={`${styles.scrollableContent} ${sheetState !== 'full' ? styles.scrollDisabled : ''}`}
          ref={contentRef}
          onWheel={handleWheel}
        >
          <div 
            className={styles.imageContainer} 
            style={{ backgroundImage: `url(${previewImage})` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={sheetState !== 'full' ? toggleState : undefined}
          >
            <div className={styles.whiteGradient}></div>
          </div>

          <div className={styles.textContent}>
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
          </div>
        </div>

        {sheetState === 'full' && (
          <div className={styles.stickyActionRow}>
            <FavouriteButton 
              storyId={story?.documentId} 
              initialFavouriteDocId={favouriteDocId} 
              iconButton={true}
            />
            
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
            <ReactionButton storyId={story?.documentId} />
          </div>
        )}

      </div>
    </>
  );
}