import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo, Fragment, useCallback } from 'react';
import gsap from 'gsap';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PanoramaViewer from '../components/PanoramaViewer';

// Images
import antwerpLogo from '../assets/images/antwerpLogo.png';
import logoAntwerpScenes from '../assets/images/logoantwerpscenes.png';
import backgroundMoments from '../assets/images/backgroundmoments.png';
import backgroundMomentsDesktop from '../assets/images/cathedral_moments.png';
import qrCodeImg from '../assets/images/qrradar.png';

// Standard Icons
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonIcon from '../assets/icons/Person';
import AddCircleIcon from '../assets/icons/AddCircle';
import FilterIcon from '../assets/icons/Filter';
import SearchIcon from '../assets/icons/Search';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import LocationFilledIcon from '../assets/icons/LocationFilled';
import StarFilledIcon from '../assets/icons/StarFilled';
import ChevronIcon from '../assets/icons/Chevron';

// Extracted Component Icons
import DividerIcon from '../assets/icons/Divider';
import ExploreIcon from '../assets/icons/Explore';
import AllIcon from '../assets/icons/All';
import LocalsIcon from '../assets/icons/Locals';
import VisitorsIcon from '../assets/icons/Visitors';
import CategoryMenuIcon from '../assets/icons/CategoryMenu';
import ExpandIcon from '../assets/icons/Expand';
import InfoIcon from '../assets/icons/Info';
import CloseIcon from '../assets/icons/Close';

import FavouriteButton from '../components/FavouriteButton';
import styles from './Home.module.css';

const STRAPI_URL = "https://necessary-light-a082e19892.strapiapp.com";

const getStoryCount = () => `One of 40+ stories in Antwerp`;

const truncate = (text, max = 120) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

const TOP_STORIES_COUNT = 10;
const GRID_MIN_CARDS = 20;

const gridImage = (story, useOriginal) =>
  (useOriginal && story?.panorama?.url) ||
  story?.panorama?.formats?.large?.url ||
  story?.panorama?.formats?.medium?.url ||
  story?.panorama?.url;

const isFeatureCard = (index) => index % 9 === 0 || index % 9 === 7;

const pseudoDistance = (seed) => {
  const n = ((seed * 9301 + 49297) % 233280) / 233280; 
  return `${(1 + n * 4).toFixed(1)} km`;
};

const haversineMeters = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (meters) => {
  if (meters == null) return '';
  if (meters < 1000) {
    return `${new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 0 }).format(Math.round(meters))} m`;
  }
  return `${new Intl.NumberFormat('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(meters / 1000)} km`;
};

const CATEGORY_COLOR = {
  action: '#D2FF4B',   
  culture: '#FF7D3C',  
  business: '#5597FE', 
  romantic: '#FF82DC', 
  social: '#00D77D',   
};

const CATEGORIES = [
  { label: 'Action', Icon: PersonRunningIcon, colorClass: 'filterChipLime' },
  { label: 'Culture', Icon: MonumentIcon, colorClass: 'filterChipOrange' },
  { label: 'Business', Icon: FolderIcon, colorClass: 'filterChipBlue' },
  { label: 'Romantic', Icon: HeartIcon, colorClass: 'filterChipPink' },
  { label: 'Social', Icon: PersonDoubleIcon, colorClass: 'filterChipGreen' },
];

const getCategoryIcon = (category) => {
  const cat = CATEGORIES.find(c => c.label.toLowerCase() === category?.toLowerCase());
  return cat ? cat.Icon : HeartFilledIcon;
};

const strokeColors = ['#FD7C3F', '#66A0FF', '#FF82DC', '#D2FF4B'];

const BANNER_ITEMS = [
  { label: 'RADAR', color: '#66A0FF' },
  { label: 'PANORAMIC SCENES', color: '#FF82DC' },
  { label: 'RELIVE MOMENTS', color: '#D2FF4B' },
  { label: 'LOCAL LIFE', color: '#66A0FF' },
];

const BannerContent = ({ ariaHidden }) => (
  <div className={styles.scrollBannerContent} aria-hidden={ariaHidden || undefined}>
    {BANNER_ITEMS.map(({ label, color }) => (
      <Fragment key={label}>
        <span>{label}</span>
        <DividerIcon style={{ color }} />
      </Fragment>
    ))}
  </div>
);

const ScrollBanner = ({ horizontal }) => (
  <div className={`${styles.scrollBanner}${horizontal ? ` ${styles.scrollBannerHorizontal}` : ''}`}>
    <div className={styles.scrollBannerTrack}>
      <BannerContent />
      <BannerContent ariaHidden />
    </div>
  </div>
);

const ExploreOverlay = () => (
  <div className={styles.storyCardOverlay}>
    <span className={styles.storyCardExplore}>
      <ExploreIcon className={styles.storyCardExploreIcon} />
      Explore Scene
    </span>
  </div>
);

export default function Home({ userLocation }) {
  const location = useLocation();
  const title = location.hash === '#panoramas' ? 'Panoramas' : 'Home';
  useDocumentTitle(title);

  const getLeftOffset = (idx) => {
    if (idx === 0) return '-28px'; 
    if (idx === 9) return '-65px'; 
    return '-48px'; 
  };

  const top10Ref = useRef(null);
  const top10ScrollRef = useRef(null);
  const infoGridRef = useRef(null);

  const [top10AtStart, setTop10AtStart] = useState(true);
  const [top10AtEnd, setTop10AtEnd] = useState(false);

  // Strip #panoramas from URL when scrolling up to the hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 200 && window.location.hash === '#panoramas') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTop10Scroll = useCallback(() => {
    if (!top10ScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = top10ScrollRef.current;
    setTop10AtStart(scrollLeft <= 0);
    setTop10AtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5);
  }, []);

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

  useEffect(() => {
    const el = top10ScrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleTop10Scroll);
      handleTop10Scroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleTop10Scroll);
    };
  }, [handleTop10Scroll]);

  const [homeFilter, setHomeFilter] = useState('All');
  const [allStories, setAllStories] = useState([]);
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  const [favMap, setFavMap] = useState({});
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 801px)').matches
  );
  const [favToastVisible, setFavToastVisible] = useState(false);
  const favToastTimerRef = useRef(null);

  const [activeFilters, setActiveFilters] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filterControlsRef = useRef(null);

  const [qrExpanded, setQrExpanded] = useState(false);
  const [panoReady, setPanoReady] = useState(false);

  useEffect(() => {
    if (!qrExpanded) return;
    const onKey = (e) => { if (e.key === 'Escape') setQrExpanded(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [qrExpanded]);

  const handleCategoryToggle = (value) => {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  };

  useEffect(() => {
    if (!isCategoryOpen) return;
    const onPointerDown = (e) => {
      if (filterControlsRef.current && !filterControlsRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isCategoryOpen]);

  const showFavToast = () => {
    setFavToastVisible(true);
    clearTimeout(favToastTimerRef.current);
    favToastTimerRef.current = setTimeout(() => setFavToastVisible(false), 2200);
  };

  useEffect(() => () => clearTimeout(favToastTimerRef.current), []);
  
  const [currentPanoIndex, setCurrentPanoIndex] = useState(0);
  const [prevPanoIndex, setPrevPanoIndex] = useState(null);
  const [transitionClass, setTransitionClass] = useState('slide-active');
  const [prevTransitionClass, setPrevTransitionClass] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitionLoading, setIsTransitionLoading] = useState(false);

  const transitionDirectionRef = useRef('next');
  const transitionFallbackRef = useRef(null);

  const stories = useMemo(() => allStories.slice(0, 4), [allStories]);

  const topStories = useMemo(() => {
    if (allStories.length === 0) return [];
    return allStories.slice(0, TOP_STORIES_COUNT);
  }, [allStories]);

  const filteredStories = useMemo(() => {
    let result = allStories;

    if (activeFilters.includes('Favourites')) {
      result = result.filter((s) => Boolean(favMap[s.documentId]));
    }

    const categoryFilters = activeFilters
      .filter((f) => f !== 'Favourites')
      .map((f) => f.toLowerCase());
    if (categoryFilters.length > 0) {
      result = result.filter((s) => categoryFilters.includes(s.category?.toLowerCase()));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allStories, activeFilters, searchQuery, favMap]);

  const isFiltering = activeFilters.length > 0 || searchQuery.trim() !== '';

  const gridCards = useMemo(() => {
    return filteredStories.map((story, i) => ({ story, seed: i }));
  }, [filteredStories]);

  const getCardDistance = (story, seed) => {
    if (userLocation && story?.latitude != null && story?.longitude != null) {
      return formatDistance(
        haversineMeters(userLocation.lat, userLocation.lng, story.latitude, story.longitude)
      );
    }
    return pseudoDistance(seed);
  };

  const activeStory = stories[currentPanoIndex];
  const descMaxLength = isDesktop ? 90 : 120;

  // Dynamic Info Counters
  const totalStories = allStories.length || 0;
  const totalHiddenSpots = useMemo(() => {
    return allStories.reduce((acc, curr) => acc + (curr.hiddenSpots?.length || 0), 0);
  }, [allStories]);

  const infoCardsData = useMemo(() => [
    { value: 50, suffix: '+', unit: 'KM', label: 'Across Antwerp', color: 'panoInfoCardOrange' },
    { value: totalStories, suffix: '', unit: null, label: 'Stories', color: 'panoInfoCardBlue' },
    { value: totalHiddenSpots, suffix: '', unit: null, label: 'Hidden spots', color: 'panoInfoCardPink' },
    { value: 10, suffix: '', unit: null, label: 'Weekly stories', color: 'panoInfoCardLime' },
  ], [totalStories, totalHiddenSpots]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 801px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const grid = infoGridRef.current;
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(grid.children, { opacity: 0, y: 40, scale: 0.92 });
    grid.querySelectorAll('[data-count]').forEach((el) => { el.textContent = '0'; });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPanoReady(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!panoReady || !storiesLoaded) return;
    const grid = infoGridRef.current;
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(grid.children, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.12,
      });
      grid.querySelectorAll('[data-count]').forEach((el) => {
        const counter = { value: 0 };
        tl.to(counter, {
          value: Number(el.dataset.count),
          duration: 1,
          ease: 'power1.out',
          onUpdate: () => { el.textContent = String(Math.round(counter.value)); },
        }, 0);
      });
    }, grid);

    return () => ctx.revert();
  }, [panoReady, storiesLoaded]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Removed populate[2]=hiddenSpots as Strapi populates JSON fields automatically
        const res = await fetch(
          `${STRAPI_URL}/api/stories?filters[state][$eq]=approved&populate[0]=panorama&populate[1]=user&sort=createdAt:desc&pagination[pageSize]=100`,
          { headers, signal: controller.signal }
        );
        if (!res.ok) throw new Error('Failed to fetch panoramas');
        const data = await res.json();
        setAllStories((data.data || []).filter((story) => story?.panorama?.url));
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setStoriesLoaded(true);
      }
    };

    fetchStories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const controller = new AbortController();

    const fetchFavourites = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const meRes = await fetch(`${STRAPI_URL}/api/users/me`, { headers, signal: controller.signal });
        if (!meRes.ok) throw new Error('Failed to fetch user');
        const me = await meRes.json();

        const favRes = await fetch(
          `${STRAPI_URL}/api/favourites?filters[user][id][$eq]=${me.id}&populate=story&pagination[pageSize]=200`,
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

  useEffect(() => {
    if (stories.length === 0) return;
    const nextIndex = (currentPanoIndex + 1) % stories.length;
    const prevIndex = (currentPanoIndex - 1 + stories.length) % stories.length;

    const nextImg = new Image();
    nextImg.src = stories[nextIndex].panorama?.url;

    const prevImg = new Image();
    prevImg.src = stories[prevIndex].panorama?.url;
  }, [currentPanoIndex, stories]);

  useEffect(() => {
    if (location.hash === '#panoramas' && top10Ref.current) {
      top10Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  useEffect(() => {
    return () => {
      if (transitionFallbackRef.current) {
        clearTimeout(transitionFallbackRef.current);
      }
    };
  }, []);

  const transitionClassMap = {
    'slide-active': styles.panoImageSlideActive,
    'slide-leave-left': styles.panoImageSlideLeaveLeft,
    'slide-leave-right': styles.panoImageSlideLeaveRight,
    'slide-enter-left': styles.panoImageSlideEnterLeft,
    'slide-enter-right': styles.panoImageSlideEnterRight,
    'static-active': styles.panoImageStaticActive,
    'static-leave-prep-left': styles.panoImageStaticLeavePrepLeft,
    'static-leave-prep-right': styles.panoImageStaticLeavePrepRight,
    'slide-enter-prep-left': styles.panoImageSlideEnterPrepLeft,
    'slide-enter-prep-right': styles.panoImageSlideEnterPrepRight,
  };

  const navigateToPano = (newIndex, forcedDirection) => {
    if (newIndex === currentPanoIndex || isTransitioning) return;
    setIsTransitioning(true);
    setIsTransitionLoading(true);

    const direction = forcedDirection || (newIndex > currentPanoIndex ? 'next' : 'prev');
    transitionDirectionRef.current = direction;

    setPrevPanoIndex(currentPanoIndex);
    setPrevTransitionClass('static-active');

    setCurrentPanoIndex(newIndex);
    setTransitionClass(direction === 'next' ? 'slide-enter-right' : 'slide-enter-left');

    setTimeout(() => {
      setPrevTransitionClass(direction === 'next' ? 'static-leave-prep-left' : 'static-leave-prep-right');
      setTransitionClass(direction === 'next' ? 'slide-enter-prep-right' : 'slide-enter-prep-left');
    }, 50);
  };

  const handlePanoLoaded = () => {
    setPanoReady(true);
    if (prevPanoIndex !== null && isTransitionLoading) {
      setIsTransitionLoading(false);
      const direction = transitionDirectionRef.current;

      setPrevTransitionClass(direction === 'next' ? 'slide-leave-left' : 'slide-leave-right');
      setTransitionClass('slide-active');

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
    if (isTransitionLoading) return;

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
    if (currentPanoIndex < stories.length - 1) {
      navigateToPano(currentPanoIndex + 1, 'next');
    }
  };

  const handlePrev = () => {
    if (currentPanoIndex > 0) {
      navigateToPano(currentPanoIndex - 1, 'prev');
    }
  };

  return (
    <>
      <header className={styles.mobileNav}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImage} />
        </Link>
        <div className={styles.mobileNavRight}>
          <Link to="/account" className="iconbutton" aria-label="Account"><PersonIcon /></Link>
        </div>
      </header>
      <div className={styles.home}>
        <div className={styles.logoWrapper}>
          <img src={logoAntwerpScenes} alt="Antwerp Scenes" className={styles.logoImage} />
        </div>

        <div
          className={styles.panoWrapper}
          role="region"
          aria-label={`360 degree panorama viewer displaying: ${activeStory?.title || 'panorama'}`}
        >
          {prevPanoIndex !== null && stories[prevPanoIndex] && (
            <div
              className={`${styles.panoImage} ${styles.staticSlide} ${transitionClassMap[prevTransitionClass]}`}
              onTransitionEnd={handleTransitionEnd}
            >
              <img src={stories[prevPanoIndex].panorama?.url} alt="" className={styles.staticSlideImage} />
              <div className={styles.panoGradientOverlay} />
              <div className={styles.panoContentWrapper}>
                <p className={styles.panoContentStoryCount}>{getStoryCount(prevPanoIndex)}</p>
                <h2 className={styles.panoContentTitle}>{stories[prevPanoIndex].title}</h2>
                <p className={styles.panoContentDescription}>{truncate(stories[prevPanoIndex].preview, descMaxLength)}</p>
              </div>
            </div>
          )}

          {(isTransitionLoading || !storiesLoaded) && (
            <div className={styles.transitionSpinnerWrapper}>
              <div className={styles.spinner} />
            </div>
          )}
          {activeStory && (
            <PanoramaViewer
              image={activeStory.panorama?.url}
              storyCount={getStoryCount(currentPanoIndex)}
              title={activeStory.title}
              description={truncate(activeStory.preview, descMaxLength)}
              exploreTo={`/story?id=${activeStory.documentId}`}
              onNext={handleNext}
              onPrev={handlePrev}
              onLoaded={handlePanoLoaded}
              className={`${styles.panoImage} ${transitionClassMap[transitionClass]}`}
            />
          )}

          <button
            className={`iconbutton dark ${styles.panoNavBtn} ${styles.panoNavBtnPrev} ${currentPanoIndex === 0 ? styles.disabledNav : ''}`}
            onClick={handlePrev}
            disabled={currentPanoIndex === 0}
            aria-label="Previous Panorama"
          >
            <ChevronIcon />
          </button>
          <button
            className={`iconbutton dark ${styles.panoNavBtn} ${styles.panoNavBtnNext} ${styles.navRight} ${currentPanoIndex === stories.length - 1 ? styles.disabledNav : ''}`}
            onClick={handleNext}
            disabled={currentPanoIndex === stories.length - 1}
            aria-label="Next Panorama"
          >
            <ChevronIcon />
          </button>
        </div>

        <div className={styles.panoPagination}>
          {stories.map((_, index) => (
            <button
              key={index}
              className={`${styles.panoPaginationDot} ${index === currentPanoIndex ? styles.panoPaginationDotActive : ''}`}
              onClick={() => navigateToPano(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className={styles.panoInfoGrid} ref={infoGridRef}>
          {infoCardsData.map(({ value, suffix, unit, label, color }) => (
            <div key={label} className={`${styles.panoInfoCard} ${styles[color]}`}>
              <span className={styles.panoInfoCardNumber}>
                <span data-count={value}>{value}</span>{suffix}
                {unit && <span className={styles.panoInfoCardUnit}>{unit}</span>}
              </span>
              <span className={styles.panoInfoCardLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.panoExtraBox}>
          <button
            type="button"
            className={styles.panoExtraBoxSquare}
            onClick={() => setQrExpanded(true)}
            aria-label="Click to expand QR code"
          >
            <img src={qrCodeImg} alt="" className={styles.panoExtraBoxQrImg} />
            <span className={styles.panoQrExpandBadge} aria-hidden="true">
              <ExpandIcon className={styles.qrExpandIconSmall} />
            </span>
          </button>
          <div className={styles.panoExtraBoxContent}>
            <h4 className={styles.panoExtraBoxTitle}>
              Best experienced on your phone
            </h4>
            <p className={styles.panoExtraBoxDesc}>
              The Radar feature uses your location to guide you to hidden spots nearby. Scan the QR code on your phone to get started, no app download needed.
            </p>
          </div>
          <Link to="/radar-explained" className={styles.panoExtraBoxInfoBtn}>
            <InfoIcon className={styles.panoExtraBoxInfoSvg} />
            <span>More info</span>
          </Link>
        </div>

        <div className={styles.panoramaIntroGroup}>
          <h2 className={styles.panoramaTitle}>
            180° panorama <br /> moments
          </h2>

          <p className={styles.panoramaDescription}>
            Discover Antwerp through the eyes of locals and visitors. Experience immersive <span className={styles.panoramaDescriptionBold}>panorama stories</span> with real images and sound, then continue the story in the city itself using our interactive <span className={styles.panoramaDescriptionBold}>radar</span>.
          </p>

          <Link to="/radar" className={styles.radarButton}>
            Radar <span>→</span>
          </Link>
        </div>

        <picture>
          <source media="(min-width: 801px)" srcSet={backgroundMomentsDesktop} />
          <img src={backgroundMoments} alt="" className={styles.backgroundMoments} aria-hidden="true" />
        </picture>

        <ScrollBanner />
        <ScrollBanner horizontal />

        <div id="panoramas" ref={top10Ref} className={styles.topStoriesTitleWrapper}>
          <h2 className={styles.topStoriesTitleTop}>TOP 10</h2>
          <h3 className={styles.topStoriesTitleSub}>stories of the week</h3>
        </div>

        <div className={styles.topStoriesWrapper}>
          <div className={styles.topStoriesContainer} ref={top10ScrollRef}>
            <div className={styles.topStoriesList}>
              {topStories.map((story, index) => {
                const CategoryIcon = getCategoryIcon(story.category);
                const categoryName = story.category?.toLowerCase() || 'social';
                
                return (
                  <div key={`${story.documentId}-${index}`} className={styles.topStoriesItem} style={{ zIndex: (index + 1) * 10 }}>
                    <span className={styles.topStoriesItemNumber} style={{
                      WebkitTextStrokeColor: strokeColors[index % strokeColors.length],
                      left: getLeftOffset(index)
                    }}>
                      {index + 1}
                    </span>
                    <Link
                      to={`/story?id=${story.documentId}`}
                      className={styles.topStoriesItemCard}
                      style={{ backgroundImage: `url(${gridImage(story)})` }}
                    >
                      <ExploreOverlay />

                      <div className={`${styles.authorBadgeWrapper} alignNext`} style={{ gap: '0.5rem' }}>
                        <div className="iconTag">
                          <PersonIcon />
                          <p>{story.user?.username || 'Emma'}</p>
                        </div>
                        <div className={`categoryTag ${categoryName}Tag`}>
                          <CategoryIcon />
                        </div>
                      </div>

                      <div className={styles.topStoriesItemGradient} />
                      
                      <div className={styles.storyCardFooter}>
                        <h3 className={styles.topStoriesItemTitle}>{story.title}</h3>
                        <div className={styles.storyCardHeartWrapper}>
                          <FavouriteButton
                            storyId={story.documentId}
                            initialFavouriteDocId={favMap[story.documentId]}
                            notLoggedInPath="/favourites"
                            onAdded={showFavToast}
                          />
                        </div>
                      </div>

                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            className={`iconbutton dark ${styles.topStoriesNavBtn} ${styles.topStoriesNavBtnPrev} ${top10AtStart ? styles.disabledNav : ''}`}
            onClick={handleScrollPrev}
            disabled={top10AtStart}
            aria-label="Previous Stories"
          >
            <ChevronIcon />
          </button>
          <button
            className={`iconbutton dark ${styles.topStoriesNavBtn} ${styles.topStoriesNavBtnNext} ${styles.navRight} ${top10AtEnd ? styles.disabledNav : ''}`}
            onClick={handleScrollNext}
            disabled={top10AtEnd}
            aria-label="Next Stories"
          >
            <ChevronIcon />
          </button>
        </div>

        <div ref={filterControlsRef} className={styles.filterControls}>
          <div className={styles.actionsRow}>
            <Link to="/share" className={styles.shareStoryButton}>
              <AddCircleIcon className={styles.shareStoryButtonIcon} />
              Share your story
            </Link>

            <div className={styles.toolsContainer}>
              <button
                className={`${styles.toolCircle} ${activeFilters.length > 0 ? styles.toolCircleActive : ''}`}
                aria-label="Filter stories"
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <FilterIcon />
              </button>
              <button
                className={`${styles.toolCircle} ${searchOpen ? styles.toolCircleActive : ''}`}
                aria-label="Search stories"
                aria-expanded={searchOpen}
                onClick={toggleSearch}
              >
                <SearchIcon />
              </button>
            </div>

            <div className={styles.leftActionsDesktop}>
              <div className={styles.filtersDesktop}>
                <button
                  className={`${styles.filterBtnDesktop} ${homeFilter === 'All' ? styles.filterBtnDesktopActive : ''}`}
                  onClick={() => setHomeFilter('All')}
                >
                  <AllIcon />
                  <span>All</span>
                </button>
                <button
                  className={`${styles.filterBtnDesktop} ${homeFilter === 'Locals' ? styles.filterBtnDesktopActive : ''}`}
                  onClick={() => setHomeFilter('Locals')}
                >
                  <LocalsIcon />
                  <span>Locals</span>
                </button>
                <button
                  className={`${styles.filterBtnDesktop} ${homeFilter === 'Visitors' ? styles.filterBtnDesktopActive : ''}`}
                  onClick={() => setHomeFilter('Visitors')}
                >
                  <VisitorsIcon />
                  <span>Visitors</span>
                </button>
              </div>
              <div className={styles.filtersDividerDesktop} />
              <button
                className={`${styles.categoryBtnDesktop} ${activeFilters.length > 0 ? styles.categoryBtnDesktopActive : ''}`}
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <CategoryMenuIcon />
                <span>Category</span>
              </button>
              <button
                className={`${styles.searchBtnDesktop} ${searchOpen ? styles.searchBtnDesktopActive : ''}`}
                aria-expanded={searchOpen}
                onClick={toggleSearch}
              >
                <SearchIcon className={styles.searchBtnDesktopSvg} />
                <span>Search</span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className={styles.searchBar}>
              <SearchIcon />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search a story..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search stories by title or category"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClear}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {isCategoryOpen && (
            <div className={styles.filterDropdown} role="menu" aria-label="Categories">
              <button
                type="button"
                className={`${styles.filterChip} ${activeFilters.length === 0 ? styles.filterChipActive : ''}`}
                onClick={() => setActiveFilters([])}
                aria-pressed={activeFilters.length === 0}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.filterChip} ${activeFilters.includes('Favourites') ? styles.filterChipPink : ''}`}
                onClick={() => handleCategoryToggle('Favourites')}
                aria-pressed={activeFilters.includes('Favourites')}
                role="menuitemcheckbox"
              >
                {activeFilters.includes('Favourites') ? <HeartFilledIcon /> : <HeartIcon />}
                Favourites
              </button>
              {CATEGORIES.map(({ label, Icon, colorClass }) => (
                <button
                  key={label}
                  type="button"
                  className={`${styles.filterChip} ${activeFilters.includes(label) ? styles[colorClass] : ''}`}
                  onClick={() => handleCategoryToggle(label)}
                  aria-pressed={activeFilters.includes(label)}
                  role="menuitemcheckbox"
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.storiesGrid}>
          {gridCards.map(({ story, seed }, i) => {
            const isLarge = (i % 11 === 0 || i % 11 === 5 || i % 11 === 6);
            const distance = getCardDistance(story, seed);
            const CategoryIcon = getCategoryIcon(story.category);
            const categoryName = story.category?.toLowerCase() || 'social';
            
            return (
              <Link
                key={`${story.documentId}-${i}`}
                to={`/story?id=${story.documentId}`}
                className={isLarge ? styles.storyCardLarge : styles.storyCardSmall}
                style={{ backgroundImage: `url(${gridImage(story, isFeatureCard(i))})` }}
              >
                <ExploreOverlay />

                <div className={`${styles.authorBadgeWrapper} alignNext`} style={{ gap: '0.5rem' }}>
                  <div className="iconTag">
                    <PersonIcon />
                    <p>{story.user?.username || 'Emma'}</p>
                  </div>
                  <div className={`categoryTag ${categoryName}Tag`}>
                    <CategoryIcon />
                  </div>
                </div>

                <div className={`${styles.storyCardDistanceWrapper} alignNext`} style={{ gap: "0.4rem" }}>
                  {distance && (
                    <div className="iconTag dark flexcenter">
                      <LocationFilledIcon />
                      <p>{distance}</p>
                    </div>
                  )}
                  {distance && story.hiddenSpots != null && (
                    <div className="iconTag dark ">
                      <StarFilledIcon />
                      <p>{story.hiddenSpots?.length || 0}</p>
                    </div>
                  )}
                </div>

                <div className={styles.storyCardGradient} />

                <div className={styles.storyCardFooter}>
                  <h3 className={styles.storyCardTitle}>{story.title}</h3>
                  <div className={styles.storyCardHeartWrapper}>
                    <FavouriteButton
                      storyId={story.documentId}
                      initialFavouriteDocId={favMap[story.documentId]}
                      notLoggedInPath="/favourites"
                      onAdded={showFavToast}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {isFiltering && gridCards.length === 0 && storiesLoaded && (
          <p className={styles.noResults}>
            No stories found. Try a different search or category.
          </p>
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

      <div
        className={`${styles.toast} ${favToastVisible ? styles.toastVisible : ''}`}
        role="status"
        aria-live="polite"
      >
        <HeartFilledIcon />
        <span>Added to favourites</span>
      </div>

      {qrExpanded && (
        <div
          className={styles.qrModalOverlay}
          onClick={() => setQrExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="QR Code"
        >
          <div
            className={styles.qrModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.qrModalClose}
              onClick={() => setQrExpanded(false)}
              aria-label="Close QR code"
            >
              <CloseIcon />
            </button>
            <p className={styles.qrModalLabel}>Radar QR Code</p>
            <div className={styles.qrModalImgWrap}>
              <img src={qrCodeImg} alt="Radar QR Code" className={styles.qrModalImg} />
            </div>
            <p className={styles.qrModalDesc}>
              Open the camera app on your phone and point it at the QR code to open the radar on your phone.
            </p>
          </div>
        </div>
      )}
    </>
  );
}