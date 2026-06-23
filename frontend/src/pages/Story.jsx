import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import '@photo-sphere-viewer/core/index.css';

import ChevronIcon from '../assets/icons/Chevron';
import PersonIcon from '../assets/icons/Person';
import LocationFilledIcon from '../assets/icons/LocationFilled';
import StarFilledIcon from '../assets/icons/StarFilled';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import RadarLocationIcon from '../assets/icons/RadarLocation';
import ShareFilledIcon from '../assets/icons/ShareFilled';

import Loading from '../components/Loading';
import FavouriteButton from '../components/FavouriteButton';
import ReactionButton from '../components/ReactionButton';
import styles from './Story.module.css';

const StorySlide = ({ 
  story, 
  isActive, 
  isMobile, 
  onReady, 
  distance, 
  formattedDistance, 
  setSelectedStory, 
  favouriteDocId, 
  onFavouriteAdded,
  onNavigate,
  disablePrev,
  disableNext
}) => {
  const [viewerLoading, setViewerLoading] = useState(true);
  const [gyroStarted, setGyroStarted] = useState(false);
  
  const viewerRef = useRef(null);
  const navigate = useNavigate();
  
  const panoramaImage = story?.panorama?.url;
  const plugins = isMobile ? [[GyroscopePlugin, { absolutePosition: true, moveMode: 'fast' }]] : [];
  
  const isNearActive = distance <= 1;

  useEffect(() => {
    if (isActive) setViewerLoading(true);
  }, [isActive]);

  const handleStartGyro = () => {
    setGyroStarted(true); // Hide the prompt immediately
    if (viewerRef.current) {
      const gyroPlugin = viewerRef.current.getPlugin(GyroscopePlugin);
      if (gyroPlugin) {
        gyroPlugin.start().catch((err) => {
          console.warn("Gyroscope start failed or denied:", err);
        });
      }
    }
  };

  const handleReady = (instance) => {
    instance.addEventListener('panorama-load', () => setViewerLoading(true));
    instance.addEventListener('panorama-loaded', () => {
      setTimeout(() => {
        setViewerLoading(false);
        if (onReady) onReady(); 
      }, 150);
    });
    instance.addEventListener('panorama-error', () => {
      setViewerLoading(false);
      if (onReady) onReady();
    });
  };

  const categoryIcons = {
    action: PersonRunningIcon,
    culture: MonumentIcon,
    social: PersonDoubleIcon,
    romantic: HeartFilledIcon,
    business: FolderIcon,
  };

  const CategoryIcon = categoryIcons[story?.category] || HeartFilledIcon;

  return (
    <div className={styles.slideContainer}>
      {isNearActive && panoramaImage ? (
        <>
          <div className={styles.panoramaContainer}>
            <div className={`${styles.preloaderOverlay} ${isActive && !viewerLoading ? styles.preloaderHidden : ''}`}>
              <img 
                src={panoramaImage} 
                alt="preloading" 
                className={styles.preloaderImage}
              />
            </div>

            {isActive && (
              <ReactPhotoSphereViewer
                ref={viewerRef}
                src={panoramaImage}
                height="100%"
                width="100%"
                plugins={plugins}
                mousemove={true}
                navbar={false}
                onReady={handleReady}
                touchmoveTwoFingers={isMobile}
                mousewheel={false} 
                minFov={70} 
                maxFov={70} 
                defaultZoomLvl={0}
              />
            )}

            {isActive && isMobile && !gyroStarted && !viewerLoading && (
              <button className={styles.gyroStartOverlay} onClick={handleStartGyro}>
                <svg viewBox="0 0 12 15" fill="none" className={styles.gyroStartOverlayIcon}>
                  <path d="M11.9531 7.1543C11.9531 7.89648 11.8262 8.59766 11.5723 9.25781C11.3223 9.91797 10.9707 10.5117 10.5176 11.0391C10.0645 11.5664 9.5332 12.002 8.92383 12.3457C8.31836 12.6934 7.66016 12.9258 6.94922 13.043V13.8809C6.94922 14.0215 6.91992 14.127 6.86133 14.1973C6.80664 14.2676 6.73242 14.3008 6.63867 14.2969C6.54883 14.2969 6.44922 14.2578 6.33984 14.1797L4.47656 12.873C4.33984 12.7754 4.27148 12.6641 4.27148 12.5391C4.27539 12.4141 4.34375 12.3047 4.47656 12.2109L6.3457 10.8984C6.45117 10.8984 6.54883 10.7871 6.63867 10.7871C6.73242 10.7832 6.80664 10.8164 6.86133 10.8867C6.91992 10.957 6.94922 11.0605 6.94922 11.1973V12.0234C7.51953 11.9141 8.04883 11.7129 8.53711 11.4199C9.02539 11.127 9.44922 10.7637 9.80859 10.3301C10.1719 9.89648 10.4531 9.41016 10.6523 8.87109C10.8555 8.33203 10.957 7.75977 10.957 7.1543C10.957 6.42383 10.8086 5.74023 10.5117 5.10352C10.2188 4.46289 9.82031 3.91211 9.31641 3.45117C9.18359 3.33398 9.11328 3.21484 9.10547 3.09375C9.10156 2.97266 9.13281 2.86328 9.19922 2.76562C9.28125 2.65625 9.39648 2.58984 9.54492 2.56641C9.69336 2.53906 9.83398 2.58594 9.9668 2.70703C10.5801 3.25391 11.0645 3.91211 11.4199 4.68164C11.7754 5.45117 11.9531 6.27539 11.9531 7.1543ZM0 7.1543C0 6.41211 0.125 5.71094 0.375 5.05078C0.628906 4.39062 0.982422 3.79688 1.43555 3.26953C1.89258 2.74219 2.42383 2.30469 3.0293 1.95703C3.63477 1.60938 4.29297 1.37891 5.00391 1.26562V0.421875C5.00391 0.28125 5.03125 0.175781 5.08594 0.105469C5.14453 0.0351562 5.21875 0.00195312 5.30859 0.00585938C5.40234 0.00585938 5.50391 0.0449219 5.61328 0.123047L7.47656 1.43555C7.61328 1.5332 7.68164 1.64453 7.68164 1.76953C7.68164 1.89453 7.61328 2.00391 7.47656 2.09766L5.60742 3.41016C5.50195 3.48438 5.40234 3.52344 5.30859 3.52734C5.21875 3.52734 5.14453 3.49219 5.08594 3.42188C5.03125 3.35156 5.00391 3.24805 5.00391 3.11133V2.28516C4.43359 2.39453 3.9043 2.5957 3.41602 2.88867C2.92773 3.18164 2.50195 3.54492 2.13867 3.97852C1.7793 4.41211 1.49805 4.89844 1.29492 5.4375C1.0957 5.97656 0.996094 6.54883 0.996094 7.1543C0.996094 7.88477 1.14258 8.57031 1.43555 9.21094C1.73242 9.84766 2.13477 10.3945 2.64258 10.8516C2.77148 10.9727 2.83789 11.0938 2.8418 11.2148C2.84961 11.3359 2.82031 11.4434 2.75391 11.5371C2.67188 11.6465 2.55664 11.7148 2.4082 11.7422C2.25977 11.7695 2.11914 11.7227 1.98633 11.6016C1.37305 11.0547 0.888672 10.3965 0.533203 9.62695C0.177734 8.85742 0 8.0332 0 7.1543Z" fill="white" />
                </svg>
                Allow motion access
              </button>
            )}
          </div>

          <div className={styles.uiOverlay}>
            <div className={styles.panoGradientOverlay}></div>
            
            <div className={styles.contentContainer}>
              <div className={styles.leftColumn}>
                
                <div className={styles.tagRow}>
                  <div className="iconTag">
                    <PersonIcon />
                    <p>{story?.user?.username}</p>
                  </div>
                  <div className={`categoryTag ${story?.category}Tag`}>
                    <CategoryIcon />
                  </div>
                </div>

                <div className={styles.tagRow}>
                  {formattedDistance && (
                    <div className="iconTag dark flexcenter">
                      <LocationFilledIcon />
                      <p>{formattedDistance}</p>
                    </div>
                  )}
                  {story?.hiddenSpots != null && (
                    <div className="iconTag dark ">
                      <StarFilledIcon />
                      <p>{story?.hiddenSpots?.length || 0} Hidden spots</p>
                    </div>
                  )}
                </div>

                <div className={styles.titleContainer}>
                  <button 
                    className={`iconbutton dark ${styles.desktopNavButton} ${disablePrev ? styles.disabledNav : ''}`} 
                    onClick={() => !disablePrev && onNavigate(-1)}
                    aria-label="Previous story"
                  >
                    <ChevronIcon />
                  </button>

                  <h1 className={styles.storyTitle}>{story?.title}</h1>

                  <button 
                    className={`iconbutton dark ${styles.desktopNavButton} ${styles.navRight} ${disableNext ? styles.disabledNav : ''}`} 
                    onClick={() => !disableNext && onNavigate(1)}
                    aria-label="Next story"
                  >
                    <ChevronIcon />
                  </button>
                </div>

                <p className={styles.storyPreview}>
                  {story?.preview}
                </p>
              </div>

              <div className={styles.rightColumn}>
                <FavouriteButton
                  storyId={story?.documentId}
                  initialFavouriteDocId={favouriteDocId}
                  iconButton={true}
                  onAdded={onFavouriteAdded}
                />
                
                <ReactionButton storyId={story?.documentId} />

                <button 
                  className="iconbutton dark"
                  onClick={() => {
                    setSelectedStory(story);
                    navigate('/radar');
                  }}
                >
                  <RadarLocationIcon />
                </button>

                <button 
                  className="iconbutton dark"
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}#/story?id=${story?.documentId}`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: story?.title || 'Check out this spot!',
                          text: story?.preview || 'I found this hidden spot on Radar.',
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
                  }}
                >
                  <ShareFilledIcon/>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptySlide} />
      )}
    </div>
  );
};

export default function Story({ setToken, userLocation, formatDistance, setSelectedStory }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [favMap, setFavMap] = useState({});
  
  const [apiLoaded, setApiLoaded] = useState(false);
  const [firstPanoReady, setFirstPanoReady] = useState(false);
  
  const [favToastVisible, setFavToastVisible] = useState(false);
  const favToastTimerRef = useRef(null);

  const showFavToast = useCallback(() => {
    setFavToastVisible(true);
    clearTimeout(favToastTimerRef.current);
    favToastTimerRef.current = setTimeout(() => setFavToastVisible(false), 2200);
  }, []);

  useEffect(() => () => clearTimeout(favToastTimerRef.current), []);

  const scrollLockRef = useRef(false);
  const wheelTimeoutRef = useRef(null);
  const feedRef = useRef(null);
  const scrollEndRef = useRef(null);
  const didInitRef = useRef(false);

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth <= 800;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/stories?populate[0]=panorama&populate[1]=user&populate[2]=favourites&filters[state][$eq]=approved", { headers });
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data = await res.json();
        
        let fetchedStories = data.data || [];
        
        for (let i = fetchedStories.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fetchedStories[i], fetchedStories[j]] = [fetchedStories[j], fetchedStories[i]];
        }
        
        const initialStoryId = searchParams.get("id");

        if (initialStoryId) {
          const targetIndex = fetchedStories.findIndex(s => s.documentId === initialStoryId);
          if (targetIndex !== -1) {
            const targetStory = fetchedStories.splice(targetIndex, 1)[0];
            fetchedStories.unshift(targetStory);
          }
        } 
        
        setStories(fetchedStories);

        if (fetchedStories.length > 0 && !initialStoryId) {
          setSearchParams({ id: fetchedStories[0].documentId }, { replace: true });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setApiLoaded(true); 
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const controller = new AbortController();

    const fetchFavourites = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const meRes = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me", { headers, signal: controller.signal });
        if (!meRes.ok) throw new Error('Failed to fetch user');
        const me = await meRes.json();

        const favRes = await fetch(
          `https://necessary-light-a082e19892.strapiapp.com/api/favourites?filters[user][id][$eq]=${me.id}&populate=story&pagination[pageSize]=200`,
          { headers, signal: controller.signal }
        );
        if (!favRes.ok) throw new Error('Failed to fetch favourites');
        const favData = await favRes.json();

        const map = {};
        (favData.data || []).forEach((fav) => {
          const storyDocId = fav.story?.documentId;
          if (storyDocId) map[storyDocId] = fav.documentId;
        });
        setFavMap(map);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    };

    fetchFavourites();
    return () => controller.abort();
  }, []);

  const N = stories.length;
  const hasLoop = N > 1;
  const loopStories = useMemo(
    () => (hasLoop ? [stories[N - 1], ...stories, stories[0]] : stories),
    [stories, hasLoop, N]
  );
  const toRealIndex = useCallback(
    (displayIndex) => (hasLoop ? (displayIndex - 1 + N) % N : displayIndex),
    [hasLoop, N]
  );

  useEffect(() => {
    if (!hasLoop || didInitRef.current) return;
    const container = feedRef.current;
    if (!container) return;
    const isDesktop = window.innerWidth > 800;
    const size = isDesktop ? window.innerWidth : window.innerHeight;
    if (isDesktop) container.scrollLeft = size;
    else container.scrollTop = size;
    setActiveIndex(1);
    didInitRef.current = true;
  }, [hasLoop]);

  useEffect(() => () => {
    clearTimeout(scrollEndRef.current);
    clearTimeout(wheelTimeoutRef.current);
  }, []);

  const handleNavClick = useCallback((direction) => {
    if (!feedRef.current || scrollLockRef.current) return;

    const nextIndex = activeIndex + direction;
    const isDesktop = window.innerWidth > 800;
    const size = isDesktop ? window.innerWidth : window.innerHeight;

    scrollLockRef.current = true;
    feedRef.current.scrollTo({
      left: isDesktop ? nextIndex * size : 0,
      top: isDesktop ? 0 : nextIndex * size,
      behavior: 'smooth'
    });

    setTimeout(() => {
      scrollLockRef.current = false;
    }, 600);
  }, [activeIndex]);

  const handleScroll = useCallback((e) => {
    const container = e.target;
    const isDesktop = window.innerWidth > 800;
    const size = isDesktop ? window.innerWidth : window.innerHeight;
    const pos = isDesktop ? container.scrollLeft : container.scrollTop;
    const newIndex = Math.round(pos / size);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      const realIndex = toRealIndex(newIndex);
      if (stories[realIndex]) {
        setSearchParams({ id: stories[realIndex].documentId }, { replace: true });
      }
    }

    if (hasLoop) {
      clearTimeout(scrollEndRef.current);
      scrollEndRef.current = setTimeout(() => {
        const settled = Math.round((isDesktop ? container.scrollLeft : container.scrollTop) / size);
        if (settled === 0) {
          if (isDesktop) container.scrollLeft = N * size;
          else container.scrollTop = N * size;
          setActiveIndex(N);
        } else if (settled === N + 1) {
          if (isDesktop) container.scrollLeft = size;
          else container.scrollTop = size;
          setActiveIndex(1);
        }
      }, 90);
    }
  }, [activeIndex, stories, hasLoop, N, toRealIndex, setSearchParams]);

  const handleWheel = useCallback((e) => {
    if (window.innerWidth <= 800 || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

    clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      scrollLockRef.current = false;
    }, 100);

    if (scrollLockRef.current) return;

    const direction = Math.sign(e.deltaY);
    const nextIndex = activeIndex + direction;

    if (nextIndex >= 0 && nextIndex < loopStories.length) {
      scrollLockRef.current = true;

      e.currentTarget.scrollTo({
        left: nextIndex * window.innerWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, loopStories.length]);

  const getDistanceStr = (story) => {
    if (!userLocation || !story.latitude || !story.longitude || !formatDistance) return "";
    const R = 6371000;
    const dLat = (story.latitude - userLocation.lat) * (Math.PI / 180);
    const dLng = (story.longitude - userLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * (Math.PI / 180)) * Math.cos(story.latitude * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return formatDistance(R * c);
  };

  if (apiLoaded && stories.length === 0) {
    return (
      <div className={`${styles.fullScreenWrapper} ${styles.noStoriesState} flexCenter`}>
        <h2>No stories found.</h2>
        <button onClick={() => navigate('/')} className={styles.backButtonCustom}>Return Home</button>
      </div>
    );
  }

  return (
    <>
      {(!apiLoaded || (stories.length > 0 && !firstPanoReady)) && (
        <div className={`${styles.fullScreenWrapper} ${styles.masterLoader}`}>
          <Loading />
        </div>
      )}

      <div className={` ${styles.fixedToolbar}`}>
        <button onClick={() => navigate(-1)} className="iconbutton dark">
          <ChevronIcon/>
        </button>
      </div>

      <div
        ref={feedRef}
        className={styles.feedContainer}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        {loopStories.map((story, index) => {
          const distance = Math.abs(index - activeIndex);
          const isActive = index === activeIndex;
          const formattedDistance = getDistanceStr(story);
          
          const realIndex = toRealIndex(index);
          const disablePrev = realIndex === 0;
          const disableNext = realIndex === stories.length - 1;

          return (
            <StorySlide
              key={`${story.documentId}-${index}`}
              story={story}
              isActive={isActive}
              distance={distance}
              isMobile={isMobile}
              formattedDistance={formattedDistance}
              onReady={isActive ? () => setFirstPanoReady(true) : null}
              setSelectedStory={setSelectedStory}
              favouriteDocId={favMap[story.documentId]}
              onFavouriteAdded={showFavToast}
              onNavigate={handleNavClick}
              disablePrev={disablePrev}
              disableNext={disableNext}
            />
          );
        })}
      </div>

      <div
        className={`${styles.favToast} ${favToastVisible ? styles.favToastVisible : ''}`}
        role="status"
        aria-live="polite"
      >
        <HeartFilledIcon />
        <span>Added to favourites</span>
      </div>
    </>
  );
}