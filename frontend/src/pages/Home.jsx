import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import LogoAS from '../assets/icons/Logo';
import pano1 from '../assets/images/pano.jpeg';
import pano2 from '../assets/images/pano2.jpeg';
import pano3 from '../assets/images/pano3.jpeg';
import pano4 from '../assets/images/pano4.jpeg';
import PanoramaViewer from '../components/PanoramaViewer';
import antwerpLogo from '../assets/images/antwerpLogo.png';
import HeartIcon from '../assets/icons/Heart';
import PersonIcon from '../assets/icons/Person';

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
    title: "Port Authority",
    description: "Gaze at the futuristic lines merging with the historical harbor docks."
  },
  {
    image: pano4,
    storyCount: "Four of 40+ stories in Antwerp",
    title: "Park Spoor Noord",
    description: "Feel the vibrant summer energy of Antwerp's green oasis."
  }
];

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('slide-active');
  const activeStory = stories[currentPanoIndex];

  const navigateToPano = (newIndex) => {
    if (newIndex === currentPanoIndex) return;
    const direction = newIndex > currentPanoIndex ? 'next' : 'prev';

    // 1. Slide out current panorama
    setTransitionClass(direction === 'next' ? 'slide-leave-left' : 'slide-leave-right');

    setTimeout(() => {
      // 2. Change active index
      setCurrentPanoIndex(newIndex);
      // 3. Render off-screen without animation
      setTransitionClass(direction === 'next' ? 'slide-enter-right' : 'slide-enter-left');

      // 4. Slide in smoothly to center
      setTimeout(() => {
        setTransitionClass('slide-active');
      }, 50);
    }, 250);
  };

  const handleNext = () => {
    navigateToPano((currentPanoIndex + 1) % stories.length);
  };

  const handlePrev = () => {
    navigateToPano((currentPanoIndex - 1 + stories.length) % stories.length);
  };

  return (
    <>
      <div className="navbarMobileTop">
        <Link to="/" className="mobileLogoLink" aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className="mobileLogoImg" />
        </Link>
        <div className="navbarMobileTopRight">
          <Link to="/favourites" className="topNavIcon" aria-label="Favourites">
            <HeartIcon />
          </Link>
          <Link to="/account" className="topNavIcon" aria-label="Account">
            <PersonIcon />
          </Link>
        </div>
      </div>
      <div className="homeContainer">
        <div className="homeLogoWrapper">
          <LogoAS />
        </div>

        <PanoramaViewer
          image={activeStory.image}
          storyCount={activeStory.storyCount}
          title={activeStory.title}
          description={activeStory.description}
          onNext={handleNext}
          onPrev={handlePrev}
          className={`homePanoImage ${transitionClass}`}
        />

        {/* Pagination Indicators */}
        <div className="panoPagination">
          {stories.map((_, index) => (
            <button
              key={index}
              className={`panoPagination__dot ${index === currentPanoIndex ? 'active' : ''}`}
              onClick={() => navigateToPano(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Info Cards Grid */}
        <div className="panoInfoGrid">
          <div className="panoInfoCard panoInfoCard--orange">
            <span className="panoInfoCard__number">
              50+<span className="panoInfoCard__unit">KM</span>
            </span>
            <span className="panoInfoCard__label">Across Antwerp</span>
          </div>
          <div className="panoInfoCard panoInfoCard--blue">
            <span className="panoInfoCard__number">40+</span>
            <span className="panoInfoCard__label">Stories</span>
          </div>
          <div className="panoInfoCard panoInfoCard--pink">
            <span className="panoInfoCard__number">63</span>
            <span className="panoInfoCard__label">Hidden spots</span>
          </div>
          <div className="panoInfoCard panoInfoCard--lime">
            <span className="panoInfoCard__number">10</span>
            <span className="panoInfoCard__label">Weekly stories</span>
          </div>
        </div>

        <h2 className="homePanoramaTitle">
          180° panorama <br /> moments
        </h2>

        <p className="homePanoramaDescription">
          Discover Antwerp through the eyes of locals and visitors. Experience immersive <span className="homePanoramaDescription--bold">panorama stories</span> with real images and sound, then continue the story in the city itself using our interactive <span className="homePanoramaDescription--bold">radar</span>.
        </p>

        <Link to="/radar" className="homeRadarButton">
          Radar <span className="discoverSpotsButton__arrow">→</span>
        </Link>

        {userLocation && (
          <p>Live Coordinates: {userLocation.lat}, {userLocation.lng}</p>
        )}

        {/* SVG ClipPath for the curved mobile banner effect */}
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