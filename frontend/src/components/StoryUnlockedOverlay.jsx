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
import LockIcon from '../assets/icons/Lock';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import HeartFilledIcon from '../assets/icons/HeartFilled';

export default function StoryUnlockedOverlay({ story, isMuted, setIsMuted, hasSpeech, favouriteDocId }) {
  const navigate = useNavigate();
  
  const [sheetState, setSheetState] = useState('initial');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const contentRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const originalImage = story?.panorama?.url;
  const previewImage = story?.panorama?.formats?.large?.url || originalImage;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSheetState('half');
    }, 50);
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

  const handleDragStart = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return; 
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    currentY.current = e.clientY;
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    currentY.current = e.clientY;
    const delta = currentY.current - startY.current;
    if (sheetState === 'full' && delta < 0) return;
    setDragOffset(delta);
  };

  const handleDragEnd = (e) => {
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

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaY = e.changedTouches[0].clientY - startY.current;

    if (sheetState === 'full' && contentRef.current?.scrollTop <= 0 && deltaY > 50) {
      setSheetState('half');
    } else if (sheetState === 'half') {
      if (deltaY > 50) setSheetState('hidden');
      else if (deltaY < -50) setSheetState('full');
    } else if (sheetState === 'hidden') {
      if (deltaY < -50) setSheetState('half');
    }
  };

  const handleWheel = (e) => {
    if (sheetState === 'full' && contentRef.current?.scrollTop <= 0 && e.deltaY < 0) {
      setSheetState('half');
    } else if (sheetState === 'half') {
      if (e.deltaY < 0) setSheetState('full');
      else if (e.deltaY > 0) setSheetState('hidden');
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
      if (sheetState === 'hidden') return `translateY(calc(100% - 11rem + ${dragOffset}px))`;
      if (sheetState === 'half') return `translateY(calc(45vh + ${dragOffset}px))`;
      if (sheetState === 'full') return `translateY(calc(5vh + ${dragOffset}px))`;
    }
    return undefined;
  };

  const getBackdropClass = () => {
    if (sheetState === 'full') return styles.backdropFull;
    if (sheetState === 'half') return styles.backdropHalf;
    return styles.backdropHidden;
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
        className={`${styles.backdrop} ${getBackdropClass()}`}
        onClick={() => {
          if (sheetState === 'full') setSheetState('half');
          else if (sheetState === 'half') setSheetState('hidden');
        }}
        onWheel={(e) => {
          if (sheetState === 'half' && e.deltaY > 0) setSheetState('hidden');
        }}
        style={{ zIndex: sheetState === 'full' ? 99998 : 8899 }}
      />
      
      <div
        className={`
          ${styles.overlayWrapper}
          ${styles['state' + sheetState.charAt(0).toUpperCase() + sheetState.slice(1)]}
          ${isDragging ? styles.dragging : ''}
        `}
        style={{ 
          transform: getTransformStyle() || undefined,
          zIndex: sheetState === 'full' ? 99999 : 8900 
        }}
      >
        <div
          className={styles.dragArea}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onClick={toggleState}
        />

        <div className={styles.fixedHeader}>
          <div className={styles.dragHandle}></div>
          <div className={styles.unlockedBadge}>
            <LockIcon />
            <span>Story unlocked</span>
          </div>
        </div>

        <div
          className={`${styles.scrollableContent} ${sheetState !== 'full' ? styles.scrollDisabled : ''}`}
          ref={contentRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={styles.imageContainer} 
            style={{ backgroundImage: `url(${previewImage})` }}
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