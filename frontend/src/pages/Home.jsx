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
import backgroundMoments from '../assets/images/backgroundmoments.png';
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

const topStories = [
  { title: "My first kiss", image: pano1 },
  { title: "The Silent Cathedral", image: pano2 },
  { title: "Port Authority", image: pano3 },
  { title: "Park Spoor Noord", image: pano4 },
  { title: "The MAS Museum", image: pano1 },
  { title: "Central Station Echo", image: pano2 },
  { title: "Scheldt Sunset", image: pano3 },
  { title: "Grote Markt Lights", image: pano4 },
  { title: "Het Steen Castle", image: pano1 },
  { title: "Zurenborg Beauty", image: pano2 }
];

const strokeColors = ['#FD7C3F', '#66A0FF', '#FF82DC', '#D2FF4B'];

const DividerSVG = ({ color }) => (
  <svg width="39" height="41" viewBox="0 0 39 41" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color, flexShrink: 0 }}>
    <path d="M3.48647 10.8305L0.000198364 12.6356L1.80529 16.1219L5.29156 14.3168L3.48647 10.8305Z" fill="currentColor"/>
    <path d="M6.97295 9.02586L3.48668 10.8309L5.29177 14.3172L8.77804 12.5121L6.97295 9.02586Z" fill="currentColor"/>
    <path d="M10.4594 7.22117L6.97316 9.02626L8.77825 12.5125L12.2645 10.7074L10.4594 7.22117Z" fill="currentColor"/>
    <path d="M13.9459 5.41649L10.4596 7.22157L12.2647 10.7078L15.751 8.90276L13.9459 5.41649Z" fill="currentColor"/>
    <path d="M8.77758 12.5122L5.29131 14.3173L7.09639 17.8035L10.5827 15.9985L8.77758 12.5122Z" fill="currentColor"/>
    <path d="M12.2641 10.7075L8.77779 12.5126L10.5829 15.9989L14.0691 14.1938L12.2641 10.7075Z" fill="currentColor"/>
    <path d="M15.7505 8.90086L12.2643 10.7059L14.0694 14.1922L17.5556 12.3871L15.7505 8.90086Z" fill="currentColor"/>
    <path d="M14.0687 14.1919L10.5824 15.997L12.3875 19.4832L15.8738 17.6781L14.0687 14.1919Z" fill="currentColor"/>
    <path d="M17.5552 12.3882L14.0689 14.1933L15.874 17.6795L19.3603 15.8744L17.5552 12.3882Z" fill="currentColor"/>
    <path d="M19.3613 15.8745L15.875 17.6796L17.6801 21.1659L21.1664 19.3608L19.3613 15.8745Z" fill="currentColor"/>
    <path d="M19.237 7.09617L15.7507 8.90126L17.5558 12.3875L21.0421 10.5824L19.237 7.09617Z" fill="currentColor"/>
    <path d="M21.0416 10.5835L17.5554 12.3886L19.3605 15.8748L22.8467 14.0697L21.0416 10.5835Z" fill="currentColor"/>
    <path d="M24.5281 8.77879L21.0418 10.5839L22.8469 14.0701L26.3332 12.2651L24.5281 8.77879Z" fill="currentColor"/>
    <path d="M22.8463 14.0698L19.36 15.8749L21.1651 19.3612L24.6514 17.5561L22.8463 14.0698Z" fill="currentColor"/>
    <path d="M26.3327 12.2632L22.8465 14.0683L24.6516 17.5545L28.1378 15.7494L26.3327 12.2632Z" fill="currentColor"/>
    <path d="M29.8192 10.4585L26.333 12.2636L28.138 15.7498L31.6243 13.9447L29.8192 10.4585Z" fill="currentColor"/>
    <path d="M21.1659 19.3608L17.6796 21.1659L19.4847 24.6522L22.971 22.8471L21.1659 19.3608Z" fill="currentColor"/>
    <path d="M19.484 24.6518L15.9978 26.4569L17.8029 29.9432L21.2891 28.1381L19.484 24.6518Z" fill="currentColor"/>
    <path d="M22.9705 22.8471L19.4843 24.6522L21.2893 28.1385L24.7756 26.3334L22.9705 22.8471Z" fill="currentColor"/>
    <path d="M17.8037 29.9429L14.3174 31.7479L16.1225 35.2342L19.6088 33.4291L17.8037 29.9429Z" fill="currentColor"/>
    <path d="M21.2902 28.1382L17.8039 29.9433L19.609 33.4295L23.0952 31.6244L21.2902 28.1382Z" fill="currentColor"/>
    <path d="M24.7752 26.3325L21.2889 28.1376L23.094 31.6239L26.5802 29.8188L24.7752 26.3325Z" fill="currentColor"/>
    <path d="M16.1218 35.2339L12.6355 37.039L14.4406 40.5252L17.9269 38.7201L16.1218 35.2339Z" fill="currentColor"/>
    <path d="M19.6083 33.4292L16.122 35.2343L17.9271 38.7205L21.4134 36.9155L19.6083 33.4292Z" fill="currentColor"/>
    <path d="M23.0948 31.6245L19.6085 33.4296L21.4136 36.9159L24.8999 35.1108L23.0948 31.6245Z" fill="currentColor"/>
    <path d="M26.5813 29.8198L23.095 31.6249L24.9001 35.1112L28.3863 33.3061L26.5813 29.8198Z" fill="currentColor"/>
    <path d="M24.6524 17.5561L21.1661 19.3612L22.971 22.8475L26.4575 21.0424L24.6524 17.5561Z" fill="currentColor"/>
    <path d="M28.1389 15.7514L24.6526 17.5565L26.4577 21.0428L29.9439 19.2377L28.1389 15.7514Z" fill="currentColor"/>
    <path d="M31.6239 13.9458L28.1376 15.7509L29.9427 19.2371L33.4289 17.4321L31.6239 13.9458Z" fill="currentColor"/>
    <path d="M26.457 21.0415L22.9707 22.8466L24.7758 26.3328L28.2621 24.5278L26.457 21.0415Z" fill="currentColor"/>
    <path d="M29.9435 19.2368L26.4572 21.0419L28.2623 24.5282L31.7486 22.7231L29.9435 19.2368Z" fill="currentColor"/>
    <path d="M28.2616 24.5278L24.7754 26.3329L26.5804 29.8192L30.0667 28.0141L28.2616 24.5278Z" fill="currentColor"/>
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

        <img src={backgroundMoments} alt="180° panorama moments" className="homeBackgroundMoments" />

        <div className="homeScrollBanner">
          <div className="homeScrollBanner__track">
            <div className="homeScrollBanner__content">
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className="homeScrollBanner__content" aria-hidden="true">
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

        <div className="homeScrollBanner homeScrollBanner--horizontal">
          <div className="homeScrollBanner__track">
            <div className="homeScrollBanner__content">
              <span>RADAR</span>
              <DividerSVG color="#66A0FF" />
              <span>PANORAMIC SCENES</span>
              <DividerSVG color="#FF82DC" />
              <span>RELIVE MOMENTS</span>
              <DividerSVG color="#D2FF4B" />
              <span>LOCAL LIFE</span>
              <DividerSVG color="#66A0FF" />
            </div>
            <div className="homeScrollBanner__content" aria-hidden="true">
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

        <div className="homeTopStoriesTitleWrapper">
          <h2 className="homeTopStoriesTitle__top">TOP 10</h2>
          <h3 className="homeTopStoriesTitle__sub">stories of the week</h3>
        </div>

        <div className="homeTopStoriesContainer">
          <div className="homeTopStoriesList">
            {topStories.map((story, index) => (
              <div key={index} className="homeTopStoriesItem" style={{ zIndex: (index + 1) * 10 }}>
                <span className="homeTopStoriesItem__number" style={{ 
                  WebkitTextStrokeColor: strokeColors[index % strokeColors.length],
                  left: getLeftOffset(index)
                }}>
                  {index + 1}
                </span>
                <div className="homeTopStoriesItem__card" style={{ backgroundImage: `url(${story.image})` }}>
                  <div className="homeTopStoriesItem__gradient" />
                  <h4 className="homeTopStoriesItem__title">{story.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

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