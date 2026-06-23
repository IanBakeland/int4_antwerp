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
import logoAntwerpScenes from '../assets/images/logoantwerpscenes.png';
import backgroundMoments from '../assets/images/backgroundmoments.png';
import backgroundMomentsDesktop from '../assets/images/cathedral_moments.png';
import qrCodeImg from '../assets/images/qrradar.png';
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

const gridStories = Array.from({ length: 20 }, (_, index) => {
  // Random number between 1 and 5 with 1 decimal place
  const randomDist = (Math.random() * (5 - 1) + 1).toFixed(1);
  return {
    id: index + 1,
    title: index === 5 ? "The street that inspired my carreer for painting" : (index === 1 ? "A sudden adventure" : "My first kiss"),
    image: pano1,
    distance: `${randomDist} km`
  };
});


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

  const top10Ref = useRef(null);
  const top10ScrollRef = useRef(null);

  const handleScrollPrev = () => {
    if (top10ScrollRef.current) {
      top10ScrollRef.current.scrollBy({ left: -530, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (top10ScrollRef.current) {
      top10ScrollRef.current.scrollBy({ left: 530, behavior: 'smooth' });
    }
  };
  const [homeFilter, setHomeFilter] = useState('All');
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

  // Smooth scroll to TOP 10 section when navigating via the Panorama's navbar link
  useEffect(() => {
    if (location.hash === '#panoramas' && top10Ref.current) {
      top10Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  // Cleanup effect for safeguard timers
  useEffect(() => {
    return () => {
      if (transitionFallbackRef.current) {
        clearTimeout(transitionFallbackRef.current);
      }
    };
  }, []);

  const transitionClassMap = {
    'slide-active': styles['home__pano-image--slide-active'],
    'slide-leave-left': styles['home__pano-image--slide-leave-left'],
    'slide-leave-right': styles['home__pano-image--slide-leave-right'],
    'slide-enter-left': styles['home__pano-image--slide-enter-left'],
    'slide-enter-right': styles['home__pano-image--slide-enter-right'],
    'static-active': styles['home__pano-image--static-active'],
    'static-leave-prep-left': styles['home__pano-image--static-leave-prep-left'],
    'static-leave-prep-right': styles['home__pano-image--static-leave-prep-right'],
    'slide-enter-prep-left': styles['home__pano-image--slide-enter-prep-left'],
    'slide-enter-prep-right': styles['home__pano-image--slide-enter-prep-right'],
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
      <header className={styles['home__mobile-nav']}>
        <Link to="/" className={styles['home__mobile-logo-link']} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles['home__mobile-logo-image']} />
        </Link>
        <div className={styles['home__mobile-nav-right']}>
          <Link to="/account" className="iconbutton" aria-label="Account"><PersonIcon /></Link>
        </div>
      </header>
      <div className={styles.home}>
        <div className={styles['home__logo-wrapper']}>
          <img src={logoAntwerpScenes} alt="Antwerp Scenes" className={styles['home__logo-image']} />
        </div>

        <div
          className={styles['home__pano-wrapper']}
          role="region"
          aria-label={`360 degree panorama viewer displaying: ${activeStory.title}`}
        >
          {prevPanoIndex !== null && (
            <div
              className={`${styles['home__pano-image']} ${styles['home__static-slide']} ${transitionClassMap[prevTransitionClass]}`}
              onTransitionEnd={handleTransitionEnd}
            >
              <img src={stories[prevPanoIndex].image} alt="" className={styles['home__static-slide-image']} />
              <div className={styles['home__pano-gradient-overlay']} />
              <div className={styles['home__pano-content-wrapper']}>
                <p className={styles['home__pano-content-story-count']}>{stories[prevPanoIndex].storyCount}</p>
                <h2 className={styles['home__pano-content-title']}>{stories[prevPanoIndex].title}</h2>
                <p className={styles['home__pano-content-description']}>{stories[prevPanoIndex].description}</p>
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
            className={`${styles['home__pano-image']} ${transitionClassMap[transitionClass]}`}
          />

          {/* Desktop navigation circles */}
          <button
            className={`${styles['home__pano-nav-btn']} ${styles['home__pano-nav-btn--prev']}`}
            onClick={handlePrev}
            aria-label="Previous Panorama"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`${styles['home__pano-nav-btn']} ${styles['home__pano-nav-btn--next']}`}
            onClick={handleNext}
            aria-label="Next Panorama"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Pagination Indicators */}
        <div className={styles['home__pano-pagination']}>
          {stories.map((_, index) => (
            <button
              key={index}
              className={`${styles['home__pano-pagination-dot']} ${index === displayIndex ? styles['home__pano-pagination-dot--active'] : ''}`}
              onClick={() => navigateToPano(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Info Cards Grid */}
        <div className={styles['home__pano-info-grid']}>
          <div className={`${styles['home__pano-info-card']} ${styles['home__pano-info-card--orange']}`}>
            <span className={styles['home__pano-info-card-number']}>
              50+<span className={styles['home__pano-info-card-unit']}>KM</span>
            </span>
            <span className={styles['home__pano-info-card-label']}>Across Antwerp</span>
          </div>
          <div className={`${styles['home__pano-info-card']} ${styles['home__pano-info-card--blue']}`}>
            <span className={styles['home__pano-info-card-number']}>40+</span>
            <span className={styles['home__pano-info-card-label']}>Stories</span>
          </div>
          <div className={`${styles['home__pano-info-card']} ${styles['home__pano-info-card--pink']}`}>
            <span className={styles['home__pano-info-card-number']}>63</span>
            <span className={styles['home__pano-info-card-label']}>Hidden spots</span>
          </div>
          <div className={`${styles['home__pano-info-card']} ${styles['home__pano-info-card--lime']}`}>
            <span className={styles['home__pano-info-card-number']}>10</span>
            <span className={styles['home__pano-info-card-label']}>Weekly stories</span>
          </div>
        </div>

        {/* Desktop-only extra box */}
        <div className={styles['home__pano-extra-box']}>
          <div className={styles['home__pano-extra-box-square']}>
            <img src={qrCodeImg} alt="Radar QR Code" className={styles['home__pano-extra-box-qr-img']} />
          </div>
          <div className={styles['home__pano-extra-box-content']}>
            <h4 className={styles['home__pano-extra-box-title']}>
              Best experienced on your phone
            </h4>
            <p className={styles['home__pano-extra-box-desc']}>
              The Radar feature uses your location to guide you to hidden spots nearby. Scan the QR code on your phone to get started, no app download needed.
            </p>
          </div>
          <Link to="/radar-explained" className={styles['home__pano-extra-box-info-btn']}>
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.2041 22.4082C5.0166 22.4082 0 17.3916 0 11.2041C0 5.0166 5.0166 0 11.2041 0C17.3916 0 22.4082 5.0166 22.4082 11.2041C22.4082 17.3916 17.3916 22.4082 11.2041 22.4082ZM11.2041 19.9482C16.0381 19.9482 19.9482 16.0381 19.9482 11.2041C19.9482 6.37012 16.0381 2.45996 11.2041 2.45996C6.37012 2.45996 2.45996 6.37012 2.45996 11.2041C2.45996 16.0381 6.37012 19.9482 11.2041 19.9482ZM11.1611 7.83105C10.3447 7.83105 9.66797 7.16504 9.66797 6.34863C9.66797 5.5 10.3447 4.84473 11.1611 4.84473C11.9883 4.84473 12.6543 5.5 12.6543 6.34863C12.6543 7.16504 11.9883 7.83105 11.1611 7.83105ZM9.32422 17.0371C8.83008 17.0371 8.43262 16.6719 8.43262 16.1562C8.43262 15.6836 8.83008 15.2969 9.32422 15.2969H10.5596V11.1396H9.51758C9.0127 11.1396 8.62598 10.7852 8.62598 10.2695C8.62598 9.78613 9.0127 9.41016 9.51758 9.41016H11.5479C12.1816 9.41016 12.5146 9.85059 12.5146 10.5273V15.2969H13.6211C14.1152 15.2969 14.5127 15.6836 14.5127 16.1562C14.5127 16.6719 14.1152 17.0371 13.6211 17.0371H9.32422Z" fill="#FF82DC" />
            </svg>
            <span>More info</span>
          </Link>
        </div>

        <div className={styles['home__panorama-intro-group']}>
          <h2 className={styles['home__panorama-title']}>
            180° panorama <br /> moments
          </h2>

          <p className={styles['home__panorama-description']}>
            Discover Antwerp through the eyes of locals and visitors. Experience immersive <span className={styles['home__panorama-description--bold']}>panorama stories</span> with real images and sound, then continue the story in the city itself using our interactive <span className={styles['home__panorama-description--bold']}>radar</span>.
          </p>

          <Link to="/radar" className={styles['home__radar-button']}>
            Radar <span className={styles.discoverSpotsButton__arrow || ''}>→</span>
          </Link>
        </div>

        <picture>
          <source media="(min-width: 801px)" srcSet={backgroundMomentsDesktop} />
          <img src={backgroundMoments} alt="" className={styles['home__background-moments']} aria-hidden="true" />
        </picture>

        <div className={styles['home__scroll-banner']}>
          <div className={styles['home__scroll-banner-track']}>
            <div className={styles['home__scroll-banner-content']}>
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className={styles['home__scroll-banner-content']} aria-hidden="true">
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

        <div className={`${styles['home__scroll-banner']} ${styles['home__scroll-banner--horizontal']}`}>
          <div className={styles['home__scroll-banner-track']}>
            <div className={styles['home__scroll-banner-content']}>
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className={styles['home__scroll-banner-content']} aria-hidden="true">
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

        <div id="top-10" ref={top10Ref} className={styles['home__top-stories-title-wrapper']}>
          <h2 className={styles['home__top-stories-title-top']}>TOP 10</h2>
          <h3 className={styles['home__top-stories-title-sub']}>stories of the week</h3>
        </div>

        <div className={styles['home__top-stories-wrapper']}>
          <div className={styles['home__top-stories-container']} ref={top10ScrollRef}>
            <div className={styles['home__top-stories-list']}>
              {topStories.map((story, index) => (
                <div key={index} className={styles['home__top-stories-item']} style={{ zIndex: (index + 1) * 10 }}>
                  <span className={styles['home__top-stories-item-number']} style={{
                    WebkitTextStrokeColor: strokeColors[index % strokeColors.length],
                    left: getLeftOffset(index)
                  }}>
                    {index + 1}
                  </span>
                  <div className={styles['home__top-stories-item-card']} style={{ backgroundImage: `url(${story.image})` }}>
                    <AuthorBadge
                      author={story.author || 'Emma'}
                      colorIndex={index}
                      className={styles['home__author-badge-wrapper']}
                    />
                    <div className={styles['home__top-stories-item-gradient']} />
                    <h3 className={styles['home__top-stories-item-title']}>{story.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Scroll navigation buttons */}
          <button
            className={`${styles['home__top-stories-nav-btn']} ${styles['home__top-stories-nav-btn--prev']}`}
            onClick={handleScrollPrev}
            aria-label="Previous Stories"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`${styles['home__top-stories-nav-btn']} ${styles['home__top-stories-nav-btn--next']}`}
            onClick={handleScrollNext}
            aria-label="Next Stories"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className={styles['home__actions-row']}>
          <Link to="/share" className={styles['home__share-story-button']}>
            <AddCircleIcon className={styles['home__share-story-button-icon']} />
            Share your story
          </Link>

          <div className={styles['home__tools-container']}>
            <button className={styles['home__tool-circle']} aria-label="Filter stories">
              <FilterIcon />
            </button>
            <button className={styles['home__tool-circle']} aria-label="Search stories">
              <SearchIcon />
            </button>
          </div>

          <div className={styles['home__left-actions-desktop']}>
            <div className={styles['home__filters-desktop']}>
              <button
                className={`${styles['home__filter-btn-desktop']} ${homeFilter === 'All' ? styles['home__filter-btn-desktop--active'] : ''}`}
                onClick={() => setHomeFilter('All')}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5078 6.89062C9.60156 6.89062 8.0625 5.35156 8.0625 3.44531C8.0625 1.53906 9.60156 0 11.5078 0C13.4141 0 14.9531 1.53906 14.9531 3.44531C14.9531 5.35156 13.4141 6.89062 11.5078 6.89062ZM3.44531 6.89062C1.53906 6.89062 0 5.35156 0 3.44531C0 1.54688 1.53906 0 3.44531 0C5.35156 0 6.89062 1.54688 6.89062 3.44531C6.89062 5.35156 5.35156 6.89062 3.44531 6.89062ZM11.5078 14.9453C9.60156 14.9453 8.0625 13.4062 8.0625 11.5C8.0625 9.60156 9.60156 8.05469 11.5078 8.05469C13.4141 8.05469 14.9531 9.60156 14.9531 11.5C14.9531 13.4062 13.4141 14.9453 11.5078 14.9453ZM3.44531 14.9531C1.53906 14.9531 0 13.4062 0 11.5078C0 9.60156 1.53906 8.0625 3.44531 8.0625C5.35156 8.0625 6.89062 9.60156 6.89062 11.5078C6.89062 13.4062 5.35156 14.9531 3.44531 14.9531Z" fill="currentColor" />
                </svg>
                <span>ALL</span>
              </button>
              <button
                className={`${styles['home__filter-btn-desktop']} ${homeFilter === 'Locals' ? styles['home__filter-btn-desktop--active'] : ''}`}
                onClick={() => setHomeFilter('Locals')}
              >
                <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.1094 7.39844C13.1953 7.39844 11.6562 5.72656 11.6562 3.66406C11.6562 1.64844 13.2109 0 15.1094 0C17.0156 0 18.5547 1.625 18.5547 3.65625C18.5547 5.71875 17.0156 7.39844 15.1094 7.39844ZM6.01562 7.49219C4.35938 7.49219 3.00781 6.03125 3.00781 4.21094C3.00781 2.45312 4.36719 0.992188 6.01562 0.992188C7.67969 0.992188 9.02344 2.42969 9.02344 4.20312C9.02344 6.02344 7.67969 7.49219 6.01562 7.49219ZM15.1094 5.91406C16.1562 5.91406 17.0234 4.92188 17.0234 3.65625C17.0234 2.42188 16.1562 1.48438 15.1094 1.48438C14.0703 1.48438 13.1953 2.4375 13.1953 3.66406C13.1953 4.9375 14.0703 5.91406 15.1094 5.91406ZM6.01562 6.03125C6.85938 6.03125 7.57031 5.23438 7.57031 4.20312C7.57031 3.22656 6.86719 2.44531 6.01562 2.44531C5.17188 2.44531 4.46094 3.24219 4.46094 4.21094C4.46094 5.23438 5.17188 6.03125 6.01562 6.03125ZM1.74219 14.6875C0.578125 14.6875 0 14.1797 0 13.2109C0 10.6172 2.6875 8.25781 6.00781 8.25781C7.17969 8.25781 8.42969 8.57812 9.40625 9.15625C8.92969 9.46094 8.57812 9.82812 8.30469 10.25C7.67969 9.91406 6.8125 9.71094 6.00781 9.71094C3.57812 9.71094 1.54688 11.3516 1.54688 13.0469C1.54688 13.1719 1.60156 13.2344 1.74219 13.2344H7.07812C7.02344 13.7891 7.30469 14.4141 7.76562 14.6875H1.74219ZM10.2578 14.6875C8.875 14.6875 8.20312 14.2344 8.20312 13.2734C8.20312 11.0703 10.9453 8.26562 15.1016 8.26562C19.2656 8.26562 22.0078 11.0703 22.0078 13.2734C22.0078 14.2344 21.3281 14.6875 19.9453 14.6875H10.2578ZM10.0859 13.2031H20.1172C20.2891 13.2031 20.3516 13.1484 20.3516 13.0156C20.3516 11.8828 18.4531 9.75 15.1016 9.75C11.75 9.75 9.85938 11.8828 9.85938 13.0156C9.85938 13.1484 9.92188 13.2031 10.0859 13.2031Z" fill="currentColor" />
                </svg>
                <span>Locals</span>
              </button>
              <button
                className={`${styles['home__filter-btn-desktop']} ${homeFilter === 'Visitors' ? styles['home__filter-btn-desktop--active'] : ''}`}
                onClick={() => setHomeFilter('Visitors')}
              >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.14844 16.2969C3.64844 16.2969 0 12.6484 0 8.14844C0 3.64844 3.64844 0 8.14844 0C12.6484 0 16.2969 3.64844 16.2969 8.14844C16.2969 12.6484 12.6484 16.2969 8.14844 16.2969ZM6.14844 6.50781C6.54688 6.64062 6.96094 6.74219 7.375 6.82031C7.52344 4.92969 8.08594 3.09375 9.00781 1.45312C8.92969 1.4375 8.84375 1.42969 8.76562 1.42188C7.44531 2.64062 6.42969 4.11719 5.78125 5.75C5.97656 5.94531 6.10938 6.21094 6.14844 6.50781ZM2.60156 4.29688C3.07031 4.77344 3.58594 5.1875 4.13281 5.54688C4.30469 5.44531 4.49219 5.375 4.70312 5.35938C5.26562 3.9375 6.07812 2.625 7.10938 1.47656C5.25 1.76562 3.64062 2.8125 2.60156 4.29688ZM10.7031 4.32812C10.7031 4.89844 10.7656 5.46094 10.8828 6C11.2656 6.01562 11.6094 6.1875 11.8438 6.46094C12.6953 6.16406 13.4922 5.73438 14.2188 5.1875C13.5391 3.79688 12.3984 2.67969 11 2.02344C10.7891 2.77344 10.6953 3.55469 10.7031 4.32812ZM9.55469 4.33594C9.54688 3.74219 9.59375 3.16406 9.69531 2.59375C9.03125 3.94531 8.63281 5.41406 8.52344 6.94531C8.67188 6.95312 8.82031 6.95312 8.96875 6.95312C9.17188 6.95312 9.375 6.94531 9.57031 6.92969C9.625 6.76562 9.70312 6.61719 9.8125 6.48438C9.64844 5.78906 9.55469 5.07031 9.55469 4.33594ZM1.39844 8.14844C1.39844 8.21875 1.39844 8.29688 1.39844 8.375C2.14062 9 2.94531 9.52344 3.78125 9.94531C3.79688 9.19531 3.875 8.46094 4.00781 7.73438C3.69531 7.48438 3.49219 7.10938 3.49219 6.67969C3.49219 6.625 3.5 6.57031 3.5 6.51562C2.96875 6.17188 2.46875 5.78125 2.00781 5.34375C1.61719 6.19531 1.39844 7.14844 1.39844 8.14844ZM14.8984 8.14844C14.8984 7.50781 14.8125 6.89844 14.6484 6.3125C13.875 6.85156 13.0312 7.27344 12.1406 7.57812C12.0859 7.86719 11.9453 8.125 11.7344 8.3125C12.1641 9.10156 12.7266 9.82031 13.3984 10.4375C13.8359 10.2656 14.2656 10.0703 14.6875 9.84375C14.8281 9.30469 14.8984 8.73438 14.8984 8.14844ZM4.92969 10.4531C5.70312 10.7422 6.50781 10.9531 7.32031 11.0781C7.39844 10.9219 7.51562 10.7891 7.64844 10.6797C7.45312 9.79688 7.35156 8.89062 7.33594 7.96875C6.8125 7.89062 6.29688 7.76562 5.79688 7.60156C5.61719 7.78906 5.39062 7.92188 5.125 7.98438C4.97656 8.78906 4.91406 9.61719 4.92969 10.4531ZM8.96875 8.10156C8.8125 8.10156 8.64844 8.09375 8.49219 8.09375C8.50781 8.875 8.60156 9.64844 8.77344 10.4062C9.21094 10.5 9.57031 10.8047 9.73438 11.2109C10.5547 11.1641 11.3672 11.0391 12.1719 10.8281C11.5469 10.1797 11.0234 9.4375 10.6094 8.64062C10.25 8.57812 9.9375 8.36719 9.73438 8.07031C9.48438 8.08594 9.22656 8.10156 8.96875 8.10156ZM1.66406 10.0234C2.08594 11.4922 2.99219 12.75 4.19531 13.625C3.99219 12.8359 3.85938 12.0391 3.8125 11.2344C3.0625 10.9062 2.34375 10.5 1.66406 10.0234ZM8.14844 14.8984C8.55469 14.8984 8.96094 14.8594 9.34375 14.7891C8.99219 14.2344 8.6875 13.6562 8.42969 13.0625C7.89062 13.0312 7.44531 12.6953 7.25781 12.2266C6.49219 12.1172 5.73438 11.9375 5 11.6953C5.10938 12.6328 5.32812 13.5469 5.67188 14.4297C6.4375 14.7344 7.27344 14.8984 8.14844 14.8984ZM9.49219 12.6172C9.77344 13.2656 10.1172 13.8828 10.5078 14.4766C11.7734 14 12.8516 13.1641 13.625 12.0938C13.4688 11.9766 13.3125 11.8594 13.1562 11.7422C12.0234 12.1094 10.8516 12.3125 9.67969 12.3594C9.625 12.4531 9.5625 12.5391 9.49219 12.6172Z" fill="currentColor" />
                </svg>
                <span>Visitors</span>
              </button>
            </div>
            <div className={styles['home__filters-divider-desktop']} />
            <button className={styles['home__category-btn-desktop']}>
              <svg width="2" height="4" viewBox="0 0 2 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.583374 0.583008V3.41634" stroke="#141414" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Category</span>
            </button>
            <button className={styles['home__search-btn-desktop']}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6.46094C0 2.89062 2.89062 0 6.45312 0C10.0156 0 12.9062 2.89062 12.9062 6.46094C12.9062 7.78906 12.5 9.01562 11.7969 10.0234L15.1641 13.4062C15.4141 13.6562 15.5469 13.9922 15.5469 14.3516C15.5469 15.1016 14.9844 15.6875 14.2188 15.6875C13.8594 15.6875 13.5156 15.5625 13.2578 15.3047L9.85938 11.9062C8.88281 12.5391 7.71875 12.9141 6.45312 12.9141C2.89062 12.9141 0 10.0234 0 6.46094ZM1.84375 6.46094C1.84375 9 3.91406 11.0703 6.45312 11.0703C9 11.0703 11.0625 9 11.0625 6.46094C11.0625 3.91406 9 1.85156 6.45312 1.85156C3.91406 1.85156 1.84375 3.91406 1.84375 6.46094Z" fill="currentColor"/>
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>

        <div className={styles['home__stories-grid']}>
          {gridStories.map((story, i) => {
            const isLarge = (i % 11 === 0 || i % 11 === 5 || i % 11 === 6);
            return (
              <div
                key={i}
                className={isLarge ? styles['home__story-card-large'] : styles['home__story-card-small']}
                style={{ backgroundImage: `url(${story.image})` }}
              >
                <AuthorBadge
                  author="Emma"
                  colorIndex={i + 1} // Offset by 1 to differentiate from Top Stories
                  className={styles['home__author-badge-wrapper']}
                />
                {isLarge ? (
                  <div className={styles['home__story-card-badge']}>
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 0C5.69047 0 6.73798 0.422548 7.64258 1.2666C8.54718 2.11076 8.99994 3.24429 9 4.66699C9 5.61553 8.62709 6.64719 7.88184 7.76172C7.13656 8.87626 6.00929 10.0833 4.5 11.3828C2.99078 10.0834 1.86342 8.87623 1.11816 7.76172C0.37296 6.64723 0 5.6155 0 4.66699C6.49664e-05 3.24429 0.452824 2.11076 1.35742 1.2666C2.26202 0.422497 3.30952 2.80738e-05 4.5 0ZM4.54395 2.22852C3.37454 2.22858 2.42685 3.17623 2.42676 4.3457C2.42676 5.51525 3.37449 6.4638 4.54395 6.46387C5.71346 6.46387 6.66211 5.51529 6.66211 4.3457C6.66202 3.17619 5.7134 2.22852 4.54395 2.22852Z" fill="white" />
                    </svg>
                    <span>{story.distance}</span>
                  </div>
                ) : (
                  <div className={styles['home__story-card-badge-small']}>
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 0C5.69047 0 6.73798 0.422548 7.64258 1.2666C8.54718 2.11076 8.99994 3.24429 9 4.66699C9 5.61553 8.62709 6.64719 7.88184 7.76172C7.13656 8.87626 6.00929 10.0833 4.5 11.3828C2.99078 10.0834 1.86342 8.87623 1.11816 7.76172C0.37296 6.64723 0 5.6155 0 4.66699C6.49664e-05 3.24429 0.452824 2.11076 1.35742 1.2666C2.26202 0.422497 3.30952 2.80738e-05 4.5 0ZM4.54395 2.22852C3.37454 2.22858 2.42685 3.17623 2.42676 4.3457C2.42676 5.51525 3.37449 6.4638 4.54395 6.46387C5.71346 6.46387 6.66211 5.51529 6.66211 4.3457C6.66202 3.17619 5.7134 2.22852 4.54395 2.22852Z" fill="white" />
                    </svg>
                    <span>{story.distance}</span>
                  </div>
                )}
                <div className={styles['home__story-card-gradient']} />
                <h3 className={styles['home__story-card-title']}>{story.title}</h3>
                <div className={styles['home__story-card-heart']}>
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
            <clipPath id="pano-clip-desktop" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 C 0.5,0.10 0.5,0.10 1,0 L 1,1 C 0.5,0.90 0.5,0.90 0,1 Z" />
            </clipPath>
            <clipPath id="top10-card-clip-desktop" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 C 0.5,0.16 0.5,0.16 1,0.08 L 1,0.92 C 0.5,0.84 0.5,0.84 0,1 Z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
}
