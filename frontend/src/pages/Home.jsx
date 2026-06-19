import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PanoramaViewer from '../components/PanoramaViewer';

//panoramas (tijdelijk tot werking van database)
import pano1 from '../assets/images/pano.jpeg';
import pano2 from '../assets/images/pano2.jpeg';
import pano3 from '../assets/images/pano3.jpeg';
import pano4 from '../assets/images/pano4.jpeg';

//icons
import antwerpLogo from '../assets/images/antwerpLogo.png';
import LogoAS from '../assets/icons/Logo';
import backgroundMoments from '../assets/images/backgroundmoments.png';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';
import AddCircleIcon from '../assets/icons/AddCircle';
import FilterIcon from '../assets/icons/Filter';
import SearchIcon from '../assets/icons/Search';
import UserCircleIcon from '../assets/icons/UserCircle';
import AuthorBadge from '../components/AuthorBadge';
import styles from './Home.module.css';

const stories = [
  {
    image: pano1,
    storyCount: "One of 40+ stories in Antwerp",
    title: "My first kiss",
    description: "Step into the place where Emma’s first kiss became a lasting memory."
  },
  {
    image: pano2,
    storyCount: "Two of 40+ stories in Antwerp",
    title: "The Silent Cathedral",
    description: "Listen to the quiet echo of the historic bells in the heart of the city."
  },
  {
    image: pano3,
    storyCount: "Three of 40+ stories in Antwerp",
    title: "The street that inspired my carreer for painting",
    description: "Gaze at the futuristic lines merging with the historical harbor docks."
  },
  {
    image: pano4,
    storyCount: "Four of 40+ stories in Antwerp",
    title: "Park Spoor Noord",
    description: "Feel the vibrant summer energy of Antwerp's green oasis."
  }
];

const topStories = [
  { title: "My first kiss", image: pano1 },
  { title: "The Silent Cathedral", image: pano2 },
  { title: "The street that inspired my carreer for painting", image: pano3 },
  { title: "Park Spoor Noord", image: pano4 },
  { title: "The MAS Museum", image: pano1 },
  { title: "Central Station Echo", image: pano2 },
  { title: "Scheldt Sunset", image: pano3 },
  { title: "Grote Markt Lights", image: pano4 },
  { title: "Het Steen Castle", image: pano1 },
  { title: "Zurenborg Beauty", image: pano2 }
];

const gridStories = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: index === 5 ? "The street that inspired my carreer for painting" : "My first kiss",
  image: pano1,
}));


const strokeColors = ['#FD7C3F', '#66A0FF', '#FF82DC', '#D2FF4B'];

const DividerSVG = ({ color }) => (
  <svg width="39" height="41" viewBox="0 0 39 41" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color, flexShrink: 0 }}>
    <path d="M3.48647 10.8305L0.000198364 12.6356L1.80529 16.1219L5.29156 14.3168L3.48647 10.8305Z" fill="currentColor" />
    <path d="M6.97295 9.02586L3.48668 10.8309L5.29177 14.3172L8.77804 12.5121L6.97295 9.02586Z" fill="currentColor" />
    <path d="M10.4594 7.22117L6.97316 9.02626L8.77825 12.5125L12.2645 10.7074L10.4594 7.22117Z" fill="currentColor" />
    <path d="M13.9459 5.41649L10.4596 7.22157L12.2647 10.7078L15.751 8.90276L13.9459 5.41649Z" fill="currentColor" />
    <path d="M8.77758 12.5122L5.29131 14.3173L7.09639 17.8035L10.5827 15.9985L8.77758 12.5122Z" fill="currentColor" />
    <path d="M12.2641 10.7075L8.77779 12.5126L10.5829 15.9989L14.0691 14.1938L12.2641 10.7075Z" fill="currentColor" />
    <path d="M15.7505 8.90086L12.2643 10.7059L14.0694 14.1922L17.5556 12.3871L15.7505 8.90086Z" fill="currentColor" />
    <path d="M14.0687 14.1919L10.5824 15.997L12.3875 19.4832L15.8738 17.6781L14.0687 14.1919Z" fill="currentColor" />
    <path d="M17.5552 12.3882L14.0689 14.1933L15.874 17.6795L19.3603 15.8744L17.5552 12.3882Z" fill="currentColor" />
    <path d="M19.3613 15.8745L15.875 17.6796L17.6801 21.1659L21.1664 19.3608L19.3613 15.8745Z" fill="currentColor" />
    <path d="M19.237 7.09617L15.7507 8.90126L17.5558 12.3875L21.0421 10.5824L19.237 7.09617Z" fill="currentColor" />
    <path d="M21.0416 10.5835L17.5554 12.3886L19.3605 15.8748L22.8467 14.0697L21.0416 10.5835Z" fill="currentColor" />
    <path d="M24.5281 8.77879L21.0418 10.5839L22.8469 14.0701L26.3332 12.2651L24.5281 8.77879Z" fill="currentColor" />
    <path d="M22.8463 14.0698L19.36 15.8749L21.1651 19.3612L24.6514 17.5561L22.8463 14.0698Z" fill="currentColor" />
    <path d="M26.3327 12.2632L22.8465 14.0683L24.6516 17.5545L28.1378 15.7494L26.3327 12.2632Z" fill="currentColor" />
    <path d="M29.8192 10.4585L26.333 12.2636L28.138 15.7498L31.6243 13.9447L29.8192 10.4585Z" fill="currentColor" />
    <path d="M21.1659 19.3608L17.6796 21.1659L19.4847 24.6522L22.971 22.8471L21.1659 19.3608Z" fill="currentColor" />
    <path d="M19.484 24.6518L15.9978 26.4569L17.8029 29.9432L21.2891 28.1381L19.484 24.6518Z" fill="currentColor" />
    <path d="M22.9705 22.8471L19.4843 24.6522L21.2893 28.1385L24.7756 26.3334L22.9705 22.8471Z" fill="currentColor" />
    <path d="M17.8037 29.9429L14.3174 31.7479L16.1225 35.2342L19.6088 33.4291L17.8037 29.9429Z" fill="currentColor" />
    <path d="M21.2902 28.1382L17.8039 29.9433L19.609 33.4295L23.0952 31.6244L21.2902 28.1382Z" fill="currentColor" />
    <path d="M24.7752 26.3325L21.2889 28.1376L23.094 31.6239L26.5802 29.8188L24.7752 26.3325Z" fill="currentColor" />
    <path d="M16.1218 35.2339L12.6355 37.039L14.4406 40.5252L17.9269 38.7201L16.1218 35.2339Z" fill="currentColor" />
    <path d="M19.6083 33.4292L16.122 35.2343L17.9271 38.7205L21.4134 36.9155L19.6083 33.4292Z" fill="currentColor" />
    <path d="M23.0948 31.6245L19.6085 33.4296L21.4136 36.9159L24.8999 35.1108L23.0948 31.6245Z" fill="currentColor" />
    <path d="M26.5813 29.8198L23.095 31.6249L24.9001 35.1112L28.3863 33.3061L26.5813 29.8198Z" fill="currentColor" />
    <path d="M24.6524 17.5561L21.1661 19.3612L22.971 22.8475L26.4575 21.0424L24.6524 17.5561Z" fill="currentColor" />
    <path d="M28.1389 15.7514L24.6526 17.5565L26.4577 21.0428L29.9439 19.2377L28.1389 15.7514Z" fill="currentColor" />
    <path d="M31.6239 13.9458L28.1376 15.7509L29.9427 19.2371L33.4289 17.4321L31.6239 13.9458Z" fill="currentColor" />
    <path d="M26.457 21.0415L22.9707 22.8466L24.7758 26.3328L28.2621 24.5278L26.457 21.0415Z" fill="currentColor" />
    <path d="M29.9435 19.2368L26.4572 21.0419L28.2623 24.5282L31.7486 22.7231L29.9435 19.2368Z" fill="currentColor" />
    <path d="M28.2616 24.5278L24.7754 26.3329L26.5804 29.8192L30.0667 28.0141L28.2616 24.5278Z" fill="currentColor" />
  </svg>
);

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  const getLeftOffset = (idx) => {
    if (idx === 0) return '-28px'; // Number 1
    if (idx === 9) return '-65px'; // Number 10 (two characters)
    return '-48px'; // Numbers 2 to 9
  };

  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);
  const [prevPanoIndex, setPrevPanoIndex] = useState(null);
  const [transitionClass, setTransitionClass] = useState('slide-active');
  const [prevTransitionClass, setPrevTransitionClass] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitionLoading, setIsTransitionLoading] = useState(false);

  const transitionDirectionRef = useRef('next');
  const transitionFallbackRef = useRef(null);
  const activeStory = stories[currentPanoIndex];
  const displayIndex = currentPanoIndex;

  useEffect(() => {
    // Intelligent Adjacent Preloading: preload only next and previous panoramas relative to active index
    const nextIndex = (currentPanoIndex + 1) % stories.length;
    const prevIndex = (currentPanoIndex - 1 + stories.length) % stories.length;

    const nextImg = new Image();
    nextImg.src = stories[nextIndex].image;

    const prevImg = new Image();
    prevImg.src = stories[prevIndex].image;
  }, [currentPanoIndex]);

  // Cleanup effect for safeguard timers
  useEffect(() => {
    return () => {
      if (transitionFallbackRef.current) {
        clearTimeout(transitionFallbackRef.current);
      }
    };
  }, []);

  const transitionClassMap = {
    'slide-active': styles.slideActive,
    'slide-leave-left': styles.slideLeaveLeft,
    'slide-leave-right': styles.slideLeaveRight,
    'slide-enter-left': styles.slideEnterLeft,
    'slide-enter-right': styles.slideEnterRight,
    'static-active': styles.staticActive,
    'static-leave-prep-left': styles.staticLeavePrepLeft,
    'static-leave-prep-right': styles.staticLeavePrepRight,
    'slide-enter-prep-left': styles.slideEnterPrepLeft,
    'slide-enter-prep-right': styles.slideEnterPrepRight,
  };

  const navigateToPano = (newIndex, forcedDirection) => {
    if (newIndex === currentPanoIndex || isTransitioning) return;
    setIsTransitioning(true);
    setIsTransitionLoading(true);

    const direction = forcedDirection || (newIndex > currentPanoIndex ? 'next' : 'prev');
    transitionDirectionRef.current = direction;

    // 1. Lock the current panorama in place as a static top layer
    setPrevPanoIndex(currentPanoIndex);
    setPrevTransitionClass('static-active');

    // 2. Load the new index offscreen in the WebGL viewer underneath (keeps translation offscreen)
    setCurrentPanoIndex(newIndex);
    setTransitionClass(direction === 'next' ? 'slide-enter-right' : 'slide-enter-left');

    // 3. Phase 1: Immediately slide both elements slightly (20%) to show loading state
    setTimeout(() => {
      setPrevTransitionClass(direction === 'next' ? 'static-leave-prep-left' : 'static-leave-prep-right');
      setTransitionClass(direction === 'next' ? 'slide-enter-prep-right' : 'slide-enter-prep-left');
    }, 50);
  };

  const handlePanoLoaded = () => {
    if (prevPanoIndex !== null && isTransitionLoading) {
      setIsTransitionLoading(false);
      const direction = transitionDirectionRef.current;

      // 4. Start side-by-side sliding transition only now that rendering is complete
      setPrevTransitionClass(direction === 'next' ? 'slide-leave-left' : 'slide-leave-right');
      setTransitionClass('slide-active');

      // 5. Fallback safeguard: if transitionend fails, force cleanup in 500ms
      if (transitionFallbackRef.current) {
        clearTimeout(transitionFallbackRef.current);
      }
      transitionFallbackRef.current = setTimeout(() => {
        setPrevPanoIndex(null);
        setPrevTransitionClass('');
        setIsTransitioning(false);
      }, 500);
    } else {
      setIsTransitioning(false);
      setIsTransitionLoading(false);
    }
  };

  const handleTransitionEnd = (e) => {
    // During Phase 1 (loading), the element transitions to the 20% prep state, which we must keep.
    if (isTransitionLoading) return;

    // 6. Cleanup outgoing slide and release lock after transition finishes (supports webkit-transform)
    if (e.propertyName.includes('transform')) {
      if (transitionFallbackRef.current) {
        clearTimeout(transitionFallbackRef.current);
        transitionFallbackRef.current = null;
      }

      setPrevPanoIndex(null);
      setPrevTransitionClass('');
      setIsTransitioning(false);
    }
  };

  const handleNext = () => {
    navigateToPano((currentPanoIndex + 1) % stories.length, 'next');
  };

  const handlePrev = () => {
    navigateToPano((currentPanoIndex - 1 + stories.length) % stories.length, 'prev');
  };

  return (
    <>
      <div className={styles.navbarMobileTop}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
        </Link>
        <div className={styles.navbarMobileTopRight}>
          <Link to="/account" className="iconbutton"><PersonIcon /></Link>
        </div>
      </div>
      <div className={styles.homeContainer}>
        <div className={styles.homeLogoWrapper}>
          <LogoAS />
        </div>

        <div className={styles.homePanoWrapper}>
          {prevPanoIndex !== null && (
            <div
              className={`${styles.homePanoImage} ${styles.staticSlide} ${transitionClassMap[prevTransitionClass]}`}
              onTransitionEnd={handleTransitionEnd}
            >
              <img src={stories[prevPanoIndex].image} alt="" className={styles.staticSlideImage} />
              <div className={styles.panoGradientOverlay} />
              <div className={styles.panoContentWrapper}>
                <p className={styles.panoContent__storyCount}>{stories[prevPanoIndex].storyCount}</p>
                <h2 className={styles.panoContent__title}>{stories[prevPanoIndex].title}</h2>
                <p className={styles.panoContent__description}>{stories[prevPanoIndex].description}</p>
              </div>
            </div>
          )}

          {isTransitionLoading && (
            <div className={styles.transitionSpinnerWrapper}>
              <div className={styles.spinner} />
            </div>
          )}
          <PanoramaViewer
            image={activeStory.image}
            storyCount={activeStory.storyCount}
            title={activeStory.title}
            description={activeStory.description}
            onNext={handleNext}
            onPrev={handlePrev}
            onLoaded={handlePanoLoaded}
            className={`${styles.homePanoImage} ${transitionClassMap[transitionClass]}`}
          />
        </div>

        {/* Pagination Indicators */}
        <div className={styles.panoPagination}>
          {stories.map((_, index) => (
            <button
              key={index}
              className={`${styles.panoPagination__dot} ${index === displayIndex ? styles.panoPagination__dotActive : ''}`}
              onClick={() => navigateToPano(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Info Cards Grid */}
        <div className={styles.panoInfoGrid}>
          <div className={`${styles.panoInfoCard} ${styles['panoInfoCard--orange']}`}>
            <span className={styles.panoInfoCard__number}>
              50+<span className={styles.panoInfoCard__unit}>KM</span>
            </span>
            <span className={styles.panoInfoCard__label}>Across Antwerp</span>
          </div>
          <div className={`${styles.panoInfoCard} ${styles['panoInfoCard--blue']}`}>
            <span className={styles.panoInfoCard__number}>40+</span>
            <span className={styles.panoInfoCard__label}>Stories</span>
          </div>
          <div className={`${styles.panoInfoCard} ${styles['panoInfoCard--pink']}`}>
            <span className={styles.panoInfoCard__number}>63</span>
            <span className={styles.panoInfoCard__label}>Hidden spots</span>
          </div>
          <div className={`${styles.panoInfoCard} ${styles['panoInfoCard--lime']}`}>
            <span className={styles.panoInfoCard__number}>10</span>
            <span className={styles.panoInfoCard__label}>Weekly stories</span>
          </div>
        </div>

        <h2 className={styles.homePanoramaTitle}>
          180° panorama <br /> moments
        </h2>

        <p className={styles.homePanoramaDescription}>
          Discover Antwerp through the eyes of locals and visitors. Experience immersive <span className={styles['homePanoramaDescription--bold']}>panorama stories</span> with real images and sound, then continue the story in the city itself using our interactive <span className={styles['homePanoramaDescription--bold']}>radar</span>.
        </p>

        <Link to="/radar" className={styles.homeRadarButton}>
          Radar <span className={styles.discoverSpotsButton__arrow || ''}>→</span>
        </Link>

        <img src={backgroundMoments} alt="180° panorama moments" className={styles.homeBackgroundMoments} />

        <div className={styles.homeScrollBanner}>
          <div className={styles.homeScrollBanner__track}>
            <div className={styles.homeScrollBanner__content}>
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className={styles.homeScrollBanner__content} aria-hidden="true">
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
          </div>
        </div>

        <div className={`${styles.homeScrollBanner} ${styles['homeScrollBanner--horizontal']}`}>
          <div className={styles.homeScrollBanner__track}>
            <div className={styles.homeScrollBanner__content}>
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className={styles.homeScrollBanner__content} aria-hidden="true">
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
          </div>
        </div>

        <div className={styles.homeTopStoriesTitleWrapper}>
          <h2 className={styles.homeTopStoriesTitle__top}>TOP 10</h2>
          <h3 className={styles.homeTopStoriesTitle__sub}>stories of the week</h3>
        </div>

        <div className={styles.homeTopStoriesContainer}>
          <div className={styles.homeTopStoriesList}>
            {topStories.map((story, index) => (
              <div key={index} className={styles.homeTopStoriesItem} style={{ zIndex: (index + 1) * 10 }}>
                <span className={styles.homeTopStoriesItem__number} style={{
                  WebkitTextStrokeColor: strokeColors[index % strokeColors.length],
                  left: getLeftOffset(index)
                }}>
                  {index + 1}
                </span>
                <div className={styles.homeTopStoriesItem__card} style={{ backgroundImage: `url(${story.image})` }}>
                  <AuthorBadge 
                    author={story.author || 'Emma'} 
                    colorIndex={index} 
                    className={styles.homeAuthorBadgeWrapper}
                  />
                  <div className={styles.homeTopStoriesItem__gradient} />
                  <h4 className={styles.homeTopStoriesItem__title}>{story.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.homeActionsRow}>
          <Link to="/share" className={styles.homeShareStoryButton}>
            <AddCircleIcon className={styles.homeShareStoryButton__icon} />
            Share your story
          </Link>

          <div className={styles.homeToolsContainer}>
            <button className={styles.homeToolCircle} aria-label="Filter stories">
              <FilterIcon />
            </button>
            <button className={styles.homeToolCircle} aria-label="Search stories">
              <SearchIcon />
            </button>
          </div>
        </div>

        <div className={styles.homeStoriesGrid}>
          {gridStories.map((story, i) => {
            const isLarge = (i % 11 === 0 || i % 11 === 5 || i % 11 === 6);
            return (
              <div
                key={i}
                className={isLarge ? styles.homeStoryCardLarge : styles.homeStoryCardSmall}
                style={{ backgroundImage: `url(${story.image})` }}
              >
                <AuthorBadge 
                  author="Emma" 
                  colorIndex={i + 1} // Offset by 1 to differentiate from Top Stories
                  className={styles.homeAuthorBadgeWrapper}
                />
                <div className={styles.homeStoryCardGradient} />
                <h4 className={styles.homeStoryCardTitle}>{story.title}</h4>
                <div className={styles.homeStoryCardHeart}>
                  <HeartIcon />
                </div>

              </div>
            );
          })}
        </div>

        {userLocation && (
          <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
        )}

        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
          <defs>
            <clipPath id="pano-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 C 0.5,0.04 0.5,0.04 1,0 L 1,1 C 0.5,0.96 0.5,0.96 0,1 Z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
}
