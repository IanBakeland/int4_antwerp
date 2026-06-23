import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PanoramaViewer from '../components/PanoramaViewer';

//icons
import antwerpLogo from '../assets/images/antwerpLogo.png';
import logoAntwerpScenes from '../assets/images/logoantwerpscenes.png';
import backgroundMoments from '../assets/images/backgroundmoments.png';
import backgroundMomentsDesktop from '../assets/images/cathedral_moments.png';
import qrCodeImg from '../assets/images/qrradar.png';
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
import AuthorBadge from '../components/AuthorBadge';
import FavouriteButton from '../components/FavouriteButton';
import styles from './Home.module.css';

const STRAPI_URL = "https://necessary-light-a082e19892.strapiapp.com";

const getStoryCount = () => `One of 40+ stories in Antwerp`;

// Truncate long descriptions and append an ellipsis so the hero card stays tidy.
const truncate = (text, max = 120) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

// How many stories the TOP 10 strip shows. It just takes the newest from the database
// (like the grid lists stories) — it isn't a ranked top 10.
const TOP_STORIES_COUNT = 10;


const GRID_MIN_CARDS = 20;


const gridImage = (story, useOriginal) =>
  (useOriginal && story?.panorama?.url) ||
  story?.panorama?.formats?.large?.url ||
  story?.panorama?.formats?.medium?.url ||
  story?.panorama?.url;

// Desktop renders the 1st and 8th card of every 9 as a large 2x2 "feature" card
// (see the :nth-child(9n + 1) / :nth-child(9n + 8) rules in the CSS).
const isFeatureCard = (index) => index % 9 === 0 || index % 9 === 7;

// Deterministic placeholder distance (1.0–5.0 km) derived from the card index, so it
// stays stable across renders. Only used as a fallback while we don't yet know the
// visitor's location; once we do, the real distance is shown (same as the radar).
const pseudoDistance = (seed) => {
  const n = ((seed * 9301 + 49297) % 233280) / 233280; // 0..1, stable per seed
  return `${(1 + n * 4).toFixed(1)} km`;
};

// Great-circle distance in metres between two lat/lng points (same maths as the radar).
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

// Format a distance the same way the radar does (metres under 1 km, otherwise km).
const formatDistance = (meters) => {
  if (meters == null) return '';
  if (meters < 1000) {
    return `${new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 0 }).format(Math.round(meters))} m`;
  }
  return `${new Intl.NumberFormat('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(meters / 1000)} km`;
};

// Category → AuthorBadge colour. The AuthorBadge already draws the matching category
// symbol for each colour (heart/running/monument/folder/double-person), so feeding it
// the right colour makes the badge symbol match the story's real category (see the
// radar category filter). Same lime/orange/blue/pink/green as the filter chips.
const CATEGORY_COLOR = {
  action: '#D2FF4B',   // lime
  culture: '#FF7D3C',  // orange
  business: '#5597FE', // blue
  romantic: '#FF82DC', // pink
  social: '#00D77D',   // green
};

// Category filter options for the homepage grid (same categories as the radar).
const CATEGORIES = [
  { label: 'Action', Icon: PersonRunningIcon, colorClass: 'home__filter-chip--lime' },
  { label: 'Culture', Icon: MonumentIcon, colorClass: 'home__filter-chip--orange' },
  { label: 'Business', Icon: FolderIcon, colorClass: 'home__filter-chip--blue' },
  { label: 'Romantic', Icon: HeartIcon, colorClass: 'home__filter-chip--pink' },
  { label: 'Social', Icon: PersonDoubleIcon, colorClass: 'home__filter-chip--green' },
];


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

// Words for the marquee banners, each with the colour of the divider that follows it.
const BANNER_ITEMS = [
  { label: 'RADAR', color: '#66A0FF' },
  { label: 'PANORAMIC SCENES', color: '#FF82DC' },
  { label: 'RELIVE MOMENTS', color: '#D2FF4B' },
  { label: 'LOCAL LIFE', color: '#66A0FF' },
];

// One copy of the marquee words; the track renders it twice for seamless looping.
const BannerContent = ({ ariaHidden }) => (
  <div className={styles['home__scroll-banner-content']} aria-hidden={ariaHidden || undefined}>
    {BANNER_ITEMS.map(({ label, color }) => (
      <Fragment key={label}>
        <span>{label}</span>
        <DividerSVG color={color} />
      </Fragment>
    ))}
  </div>
);

const ScrollBanner = ({ horizontal }) => (
  <div className={`${styles['home__scroll-banner']}${horizontal ? ` ${styles['home__scroll-banner--horizontal']}` : ''}`}>
    <div className={styles['home__scroll-banner-track']}>
      <BannerContent />
      <BannerContent ariaHidden />
    </div>
  </div>
);

// Hover/tap CTA shared by the grid cards and the TOP 10 cards: a pink wash with an
// "Explore Scene" button (revealed on hover on desktop, the card tap opens on mobile).
const ExploreOverlay = () => (
  <div className={styles['home__story-card-overlay']}>
    <span className={styles['home__story-card-explore']}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles['home__story-card-explore-icon']}
        viewBox="0 0 16 12"
        fill="none"
      >
        <path d="M0.7942 5.45344C0.735267 5.61221 0.735267 5.78685 0.7942 5.94561C1.36818 7.33736 2.34249 8.52735 3.5936 9.3647C4.8447 10.202 6.31627 10.6491 7.82174 10.6491C9.3272 10.6491 10.7988 10.202 12.0499 9.3647C13.301 8.52735 14.2753 7.33736 14.8493 5.94561C14.9082 5.78685 14.9082 5.61221 14.8493 5.45344C14.2753 4.06169 13.301 2.87171 12.0499 2.03436C10.7988 1.19701 9.3272 0.75 7.82174 0.75C6.31627 0.75 4.8447 1.19701 3.5936 2.03436C2.34249 2.87171 1.36818 4.06169 0.7942 5.45344Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.82234 7.81998C8.99397 7.81998 9.94376 6.87019 9.94376 5.69856C9.94376 4.52694 8.99397 3.57715 7.82234 3.57715C6.65072 3.57715 5.70093 4.52694 5.70093 5.69856C5.70093 6.87019 6.65072 7.81998 7.82234 7.81998Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Explore Scene
    </span>
  </div>
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
  const [allStories, setAllStories] = useState([]);
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  // Map of storyDocumentId -> favourite documentId, for the CURRENT logged-in user only.
  const [favMap, setFavMap] = useState({});
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 801px)').matches
  );
  const [favToastVisible, setFavToastVisible] = useState(false);
  const favToastTimerRef = useRef(null);

  // Search + category filtering (same category logic as the radar).
  const [activeFilters, setActiveFilters] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filterControlsRef = useRef(null);

  // QR-code lightbox (desktop only)
  const [qrExpanded, setQrExpanded] = useState(false);

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

  // Close the category dropdown when clicking outside the filter controls.
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

  // Briefly show an "Added to favourites" toast (auto-dismisses).
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

  // The hero carousel shows the first 4 panoramas; the grid below shows them all.
  const stories = useMemo(() => allStories.slice(0, 4), [allStories]);

  // The TOP 10 strip always shows 10 cards straight from the database, repeating the
  // stories to fill when there are fewer than 10 (same idea as the grid).
  const topStories = useMemo(() => {
    if (allStories.length === 0) return [];
    return Array.from({ length: TOP_STORIES_COUNT }, (_, i) => allStories[i % allStories.length]);
  }, [allStories]);

  // Apply the active category/favourites filters and the search query (same category
  // logic as the radar). Search matches the title or the category, case-insensitive.
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

  // Build the grid. When filtering/searching, show the exact matches; otherwise repeat
  // the stories until the grid looks full. A stable distance is attached inside useMemo.
  const gridCards = useMemo(() => {
    if (filteredStories.length === 0) return [];
    const target = isFiltering
      ? filteredStories.length
      : Math.max(GRID_MIN_CARDS, filteredStories.length);
    return Array.from({ length: target }, (_, i) => {
      const story = filteredStories[i % filteredStories.length];
      return { story, seed: i };
    });
  }, [filteredStories, isFiltering]);

  // Real distance to the story when we know the visitor's location (same as the radar);
  // otherwise a stable placeholder so the tag still reads nicely.
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

  // Track desktop breakpoint so the hero description can be truncated a bit shorter on desktop.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 801px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Fetch all panoramas from Strapi (newest first) for both the hero carousel and the grid.
  useEffect(() => {
    const controller = new AbortController();

    const fetchStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(
          `${STRAPI_URL}/api/stories?filters[state][$eq]=approved&populate[0]=panorama&populate[1]=user&sort=createdAt:desc&pagination[pageSize]=100`,
          { headers, signal: controller.signal }
        );
        if (!res.ok) throw new Error('Failed to fetch panoramas');
        const data = await res.json();
        // Keep only entries that actually have a panorama image.
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

  // Fetch ONLY the current user's favourites so a heart is filled solely when this
  // specific user has favourited the story (not when anyone else has).
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
    // Intelligent Adjacent Preloading: preload only next and previous panoramas relative to active index
    if (stories.length === 0) return;
    const nextIndex = (currentPanoIndex + 1) % stories.length;
    const prevIndex = (currentPanoIndex - 1 + stories.length) % stories.length;

    const nextImg = new Image();
    nextImg.src = stories[nextIndex].panorama?.url;

    const prevImg = new Image();
    prevImg.src = stories[prevIndex].panorama?.url;
  }, [currentPanoIndex, stories]);

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
          aria-label={`360 degree panorama viewer displaying: ${activeStory?.title || 'panorama'}`}
        >
          {prevPanoIndex !== null && stories[prevPanoIndex] && (
            <div
              className={`${styles['home__pano-image']} ${styles['home__static-slide']} ${transitionClassMap[prevTransitionClass]}`}
              onTransitionEnd={handleTransitionEnd}
            >
              <img src={stories[prevPanoIndex].panorama?.url} alt="" className={styles['home__static-slide-image']} />
              <div className={styles['home__pano-gradient-overlay']} />
              <div className={styles['home__pano-content-wrapper']}>
                <p className={styles['home__pano-content-story-count']}>{getStoryCount(prevPanoIndex)}</p>
                <h2 className={styles['home__pano-content-title']}>{stories[prevPanoIndex].title}</h2>
                <p className={styles['home__pano-content-description']}>{truncate(stories[prevPanoIndex].preview, descMaxLength)}</p>
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
              className={`${styles['home__pano-image']} ${transitionClassMap[transitionClass]}`}
            />
          )}

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
              className={`${styles['home__pano-pagination-dot']} ${index === currentPanoIndex ? styles['home__pano-pagination-dot--active'] : ''}`}
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
          <button
            type="button"
            className={styles['home__pano-extra-box-square']}
            onClick={() => setQrExpanded(true)}
            aria-label="Click to expand QR code"
          >
            <img src={qrCodeImg} alt="" className={styles['home__pano-extra-box-qr-img']} />
            <span className={styles['home__pano-qr-expand-badge']} aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
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
            Radar <span>→</span>
          </Link>
        </div>

        <picture>
          <source media="(min-width: 801px)" srcSet={backgroundMomentsDesktop} />
          <img src={backgroundMoments} alt="" className={styles['home__background-moments']} aria-hidden="true" />
        </picture>

        <ScrollBanner />
        <ScrollBanner horizontal />

        <div id="top-10" ref={top10Ref} className={styles['home__top-stories-title-wrapper']}>
          <h2 className={styles['home__top-stories-title-top']}>TOP 10</h2>
          <h3 className={styles['home__top-stories-title-sub']}>stories of the week</h3>
        </div>

        <div className={styles['home__top-stories-wrapper']}>
          <div className={styles['home__top-stories-container']} ref={top10ScrollRef}>
            <div className={styles['home__top-stories-list']}>
              {topStories.map((story, index) => (
                <div key={`${story.documentId}-${index}`} className={styles['home__top-stories-item']} style={{ zIndex: (index + 1) * 10 }}>
                  <span className={styles['home__top-stories-item-number']} style={{
                    WebkitTextStrokeColor: strokeColors[index % strokeColors.length],
                    left: getLeftOffset(index)
                  }}>
                    {index + 1}
                  </span>
                  <Link
                    to={`/story?id=${story.documentId}`}
                    className={styles['home__top-stories-item-card']}
                    style={{ backgroundImage: `url(${gridImage(story)})` }}
                  >
                    <AuthorBadge
                      author={story.user?.username || 'Emma'}
                      color={CATEGORY_COLOR[story.category?.toLowerCase()]}
                      colorIndex={index}
                      className={styles['home__author-badge-wrapper']}
                    />
                    <div className={styles['home__top-stories-item-gradient']} />
                    <h3 className={styles['home__top-stories-item-title']}>{story.title}</h3>
                    <ExploreOverlay />
                  </Link>
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

        <div ref={filterControlsRef} className={styles['home__filter-controls']}>
          <div className={styles['home__actions-row']}>
            <Link to="/share" className={styles['home__share-story-button']}>
              <AddCircleIcon className={styles['home__share-story-button-icon']} />
              Share your story
            </Link>

            <div className={styles['home__tools-container']}>
              <button
                className={`${styles['home__tool-circle']} ${activeFilters.length > 0 ? styles['home__tool-circle--active'] : ''}`}
                aria-label="Filter stories"
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <FilterIcon />
              </button>
              <button
                className={`${styles['home__tool-circle']} ${searchOpen ? styles['home__tool-circle--active'] : ''}`}
                aria-label="Search stories"
                aria-expanded={searchOpen}
                onClick={toggleSearch}
              >
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
                  <span>All</span>
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
              <button
                className={`${styles['home__category-btn-desktop']} ${activeFilters.length > 0 ? styles['home__category-btn-desktop--active'] : ''}`}
                aria-haspopup="menu"
                aria-expanded={isCategoryOpen}
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <svg width="13" height="15" viewBox="58 53 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M70.8743 54.833H65.916" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M63.0833 54.833H58.125" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M70.875 60.5H64.5" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M61.6667 60.5H58.125" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M70.8757 66.167H67.334" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M64.5 66.167H58.125" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M65.916 53.417V56.2503" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M61.666 59.083V61.9163" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M67.334 64.75V67.5833" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Category</span>
              </button>
              <button
                className={`${styles['home__search-btn-desktop']} ${searchOpen ? styles['home__search-btn-desktop--active'] : ''}`}
                aria-expanded={searchOpen}
                onClick={toggleSearch}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6.46094C0 2.89062 2.89062 0 6.45312 0C10.0156 0 12.9062 2.89062 12.9062 6.46094C12.9062 7.78906 12.5 9.01562 11.7969 10.0234L15.1641 13.4062C15.4141 13.6562 15.5469 13.9922 15.5469 14.3516C15.5469 15.1016 14.9844 15.6875 14.2188 15.6875C13.8594 15.6875 13.5156 15.5625 13.2578 15.3047L9.85938 11.9062C8.88281 12.5391 7.71875 12.9141 6.45312 12.9141C2.89062 12.9141 0 10.0234 0 6.46094ZM1.84375 6.46094C1.84375 9 3.91406 11.0703 6.45312 11.0703C9 11.0703 11.0625 9 11.0625 6.46094C11.0625 3.91406 9 1.85156 6.45312 1.85156C3.91406 1.85156 1.84375 3.91406 1.84375 6.46094Z" fill="currentColor" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className={styles['home__search-bar']}>
              <SearchIcon />
              <input
                type="text"
                className={styles['home__search-input']}
                placeholder="Search a story..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search stories by title or category"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles['home__search-clear']}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {isCategoryOpen && (
            <div className={styles['home__filter-dropdown']} role="menu" aria-label="Categories">
              <button
                type="button"
                className={`${styles['home__filter-chip']} ${activeFilters.length === 0 ? styles['home__filter-chip--active'] : ''}`}
                onClick={() => setActiveFilters([])}
                aria-pressed={activeFilters.length === 0}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles['home__filter-chip']} ${activeFilters.includes('Favourites') ? styles['home__filter-chip--pink'] : ''}`}
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
                  className={`${styles['home__filter-chip']} ${activeFilters.includes(label) ? styles[colorClass] : ''}`}
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

        <div className={styles['home__stories-grid']}>
          {gridCards.map(({ story, seed }, i) => {
            const isLarge = (i % 11 === 0 || i % 11 === 5 || i % 11 === 6);
            const distance = getCardDistance(story, seed);
            // Colour the author badge by the story's real category so its symbol matches.
            const categoryColor = CATEGORY_COLOR[story.category?.toLowerCase()];
            return (
              <Link
                key={`${story.documentId}-${i}`}
                to={`/story?id=${story.documentId}`}
                className={isLarge ? styles['home__story-card-large'] : styles['home__story-card-small']}
                style={{ backgroundImage: `url(${gridImage(story, isFeatureCard(i))})` }}
              >
                {/* Name tag + category symbol, top-left (padding mirrors the distance tag) */}
                <AuthorBadge
                  author={story.user?.username || 'Emma'}
                  color={categoryColor}
                  colorIndex={i + 1} // Fallback colour when the story has no category
                  className={styles['home__author-badge-wrapper']}
                />

                {/* Distance tag — real distance when location is known (see radar), top-right */}
                <div className={styles['home__story-card-distance']}>
                  <LocationFilledIcon />
                  <span>{distance}</span>
                </div>

                <div className={styles['home__story-card-gradient']} />

                <div className={styles['home__story-card-footer']}>
                  <h3 className={styles['home__story-card-title']}>{story.title}</h3>
                </div>

                <FavouriteButton
                  storyId={story.documentId}
                  initialFavouriteDocId={favMap[story.documentId]}
                  className={styles['home__story-card-heart']}
                  activeClassName={styles['home__story-card-heart--active']}
                  notLoggedInPath="/favourites"
                  onAdded={showFavToast}
                />

                <ExploreOverlay />
              </Link>
            );
          })}
        </div>

        {isFiltering && gridCards.length === 0 && storiesLoaded && (
          <p className={styles['home__no-results']}>
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
        className={`${styles['home__toast']} ${favToastVisible ? styles['home__toast--visible'] : ''}`}
        role="status"
        aria-live="polite"
      >
        <HeartFilledIcon />
        <span>Added to favourites</span>
      </div>

      {qrExpanded && (
        <div
          className={styles['home__qr-modal-overlay']}
          onClick={() => setQrExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="QR Code"
        >
          <div
            className={styles['home__qr-modal']}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles['home__qr-modal-close']}
              onClick={() => setQrExpanded(false)}
              aria-label="Close QR code"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <p className={styles['home__qr-modal-label']}>Radar QR Code</p>
            <div className={styles['home__qr-modal-img-wrap']}>
              <img src={qrCodeImg} alt="Radar QR Code" className={styles['home__qr-modal-img']} />
            </div>
            <p className={styles['home__qr-modal-desc']}>
              Open the camera app on your phone and point it at the QR code to open the radar on your phone.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
