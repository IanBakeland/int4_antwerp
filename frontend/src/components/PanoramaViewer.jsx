import React, { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import { Link } from 'react-router-dom';
import '@photo-sphere-viewer/core/index.css';
import styles from './PanoramaViewer.module.css';

export default function PanoramaViewer({
  image,
  storyCount,
  title,
  description,
  onNext,
  onPrev,
  className,
  onLoaded
}) {
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
  });
  const [gyroStarted, setGyroStarted] = useState(false);
  const [gyroFailed, setGyroFailed] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(true);
  const viewerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Keep track of the freshest onLoaded callback to prevent stale closures in event listeners
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    console.log("PanoramaViewer: isMobile =", isMobile, "width =", window.innerWidth, "UA =", navigator.userAgent);
  }, [isMobile]);


  const plugins = isMobile ? [
    [GyroscopePlugin, { absolutePosition: true, moveMode: 'fast' }]
  ] : [];

  const handleStartGyro = () => {
    if (viewerRef.current) {
      const gyroPlugin = viewerRef.current.getPlugin(GyroscopePlugin);
      if (gyroPlugin) {
        gyroPlugin.start().then(() => {
          setGyroStarted(true);
          setGyroFailed(false);
        }).catch(err => {
          console.warn("Gyroscoop niet ondersteund op dit apparaat/browser, fallback naar muisbesturing:", err);
          // Verberg de overlay en sta slepen met 1 vinger/muis toe
          setGyroStarted(true);
          setGyroFailed(true);
        });
      }
    }
  };

  const handleReady = (instance) => {
    setViewerLoading(false);

    instance.addEventListener('panorama-load', () => {
      setViewerLoading(true);
    });

    instance.addEventListener('panorama-loaded', () => {
      setTimeout(() => {
        setViewerLoading(false);
        if (onLoadedRef.current) onLoadedRef.current();
      }, 150);
    });

    instance.addEventListener('panorama-error', () => {
      setViewerLoading(false);
      if (onLoadedRef.current) onLoadedRef.current();
    });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1 && onNext && onPrev) {
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      const diffY = e.changedTouches[0].clientY - touchStartY.current;

      // Determine swipe if horizontal diff is greater than vertical diff and exceeds threshold (50px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          onPrev(); // Swipe right -> Previous scene
        } else {
          onNext(); // Swipe left -> Next scene
        }
      }
    }
  };

  return (
    <div
      className={className}
      style={{ position: 'relative' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ReactPhotoSphereViewer
        ref={viewerRef}
        src={image}
        height={"100%"}
        width={"100%"}
        plugins={plugins}
        mousemove={true}
        mousewheel={true}
        // In development, if the gyroscope fails (e.g. on a desktop emulator), we disable the 
        // two-finger requirement so the developer can easily drag using a single mouse click.
        // In production, we keep it true on mobile so that if the user rejects the gyroscope, 
        // they can still scroll the webpage with 1 finger and drag the panorama with 2 fingers.
        touchmoveTwoFingers={isMobile && (!gyroFailed || !import.meta.env.DEV)}
        navbar={false}
        onReady={handleReady}
      />

      {/* Loading/Placeholder Overlay */}
      <div className={`${styles.panoPlaceholder} ${!viewerLoading ? styles.panoPlaceholderHidden : ''}`}>
        <img
          src={image}
          alt=""
          className={styles.panoPlaceholderImage}
        />
        <div className={styles.loadingSpinnerWrapper}>
          <div className={styles.spinner} />
        </div>
      </div>

      {isMobile && (
        <>
          <div className={styles.panoGradientOverlay} />
          <div className={styles.panoContentWrapper}>
            <p className={styles.panoContent__storyCount}>{storyCount}</p>
            <h2 className={styles.panoContent__title}>{title}</h2>
            <p className={styles.panoContent__description}>{description}</p>
            <div className={styles.exploreActionsContainer}>
              <Link
                to="#"
                onClick={(e) => e.preventDefault()}
                className={styles.exploreSceneButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.exploreSceneButton__icon}
                  viewBox="0 0 16 12"
                  fill="none"
                >
                  <path
                    d="M0.7942 5.45344C0.735267 5.61221 0.735267 5.78685 0.7942 5.94561C1.36818 7.33736 2.34249 8.52735 3.5936 9.3647C4.8447 10.202 6.31627 10.6491 7.82174 10.6491C9.3272 10.6491 10.7988 10.202 12.0499 9.3647C13.301 8.52735 14.2753 7.33736 14.8493 5.94561C14.9082 5.78685 14.9082 5.61221 14.8493 5.45344C14.2753 4.06169 13.301 2.87171 12.0499 2.03436C10.7988 1.19701 9.3272 0.75 7.82174 0.75C6.31627 0.75 4.8447 1.19701 3.5936 2.03436C2.34249 2.87171 1.36818 4.06169 0.7942 5.45344Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.82234 7.81998C8.99397 7.81998 9.94376 6.87019 9.94376 5.69856C9.94376 4.52694 8.99397 3.57715 7.82234 3.57715C6.65072 3.57715 5.70093 4.52694 5.70093 5.69856C5.70093 6.87019 6.65072 7.81998 7.82234 7.81998Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Explore Scene
              </Link>
              <Link
                to="#"
                onClick={(e) => e.preventDefault()}
                className={styles.discoverSpotsButton}
              >
                Discover spots
                <span className={styles.discoverSpotsButton__arrow}>→</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {isMobile && !gyroStarted && (
        <button
          className={styles.gyroStartOverlay}
          onClick={handleStartGyro}
        >
          <svg
            width="0.75rem"
            height="0.9375rem"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.gyroStartOverlay__icon}
            style={{ flexShrink: 0 }}
          >
            <path
              d="M11.9531 7.1543C11.9531 7.89648 11.8262 8.59766 11.5723 9.25781C11.3223 9.91797 10.9707 10.5117 10.5176 11.0391C10.0645 11.5664 9.5332 12.002 8.92383 12.3457C8.31836 12.6934 7.66016 12.9258 6.94922 13.043V13.8809C6.94922 14.0215 6.91992 14.127 6.86133 14.1973C6.80664 14.2676 6.73242 14.3008 6.63867 14.2969C6.54883 14.2969 6.44922 14.2578 6.33984 14.1797L4.47656 12.873C4.33984 12.7754 4.27148 12.6641 4.27148 12.5391C4.27539 12.4141 4.34375 12.3047 4.47656 12.2109L6.3457 10.8984C6.45117 10.8984 6.54883 10.7871 6.63867 10.7871C6.73242 10.7832 6.80664 10.8164 6.86133 10.8867C6.91992 10.957 6.94922 11.0605 6.94922 11.1973V12.0234C7.51953 11.9141 8.04883 11.7129 8.53711 11.4199C9.02539 11.127 9.44922 10.7637 9.80859 10.3301C10.1719 9.89648 10.4531 9.41016 10.6523 8.87109C10.8555 8.33203 10.957 7.75977 10.957 7.1543C10.957 6.42383 10.8086 5.74023 10.5117 5.10352C10.2188 4.46289 9.82031 3.91211 9.31641 3.45117C9.18359 3.33398 9.11328 3.21484 9.10547 3.09375C9.10156 2.97266 9.13281 2.86328 9.19922 2.76562C9.28125 2.65625 9.39648 2.58984 9.54492 2.56641C9.69336 2.53906 9.83398 2.58594 9.9668 2.70703C10.5801 3.25391 11.0645 3.91211 11.4199 4.68164C11.7754 5.45117 11.9531 6.27539 11.9531 7.1543ZM0 7.1543C0 6.41211 0.125 5.71094 0.375 5.05078C0.628906 4.39062 0.982422 3.79688 1.43555 3.26953C1.89258 2.74219 2.42383 2.30469 3.0293 1.95703C3.63477 1.60938 4.29297 1.37891 5.00391 1.26562V0.421875C5.00391 0.28125 5.03125 0.175781 5.08594 0.105469C5.14453 0.0351562 5.21875 0.00195312 5.30859 0.00585938C5.40234 0.00585938 5.50391 0.0449219 5.61328 0.123047L7.47656 1.43555C7.61328 1.5332 7.68164 1.64453 7.68164 1.76953C7.68164 1.89453 7.61328 2.00391 7.47656 2.09766L5.60742 3.41016C5.50195 3.48438 5.40234 3.52344 5.30859 3.52734C5.21875 3.52734 5.14453 3.49219 5.08594 3.42188C5.03125 3.35156 5.00391 3.24805 5.00391 3.11133V2.28516C4.43359 2.39453 3.9043 2.5957 3.41602 2.88867C2.92773 3.18164 2.50195 3.54492 2.13867 3.97852C1.7793 4.41211 1.49805 4.89844 1.29492 5.4375C1.0957 5.97656 0.996094 6.54883 0.996094 7.1543C0.996094 7.88477 1.14258 8.57031 1.43555 9.21094C1.73242 9.84766 2.13477 10.3945 2.64258 10.8516C2.77148 10.9727 2.83789 11.0938 2.8418 11.2148C2.84961 11.3359 2.82031 11.4434 2.75391 11.5371C2.67188 11.6465 2.55664 11.7148 2.4082 11.7422C2.25977 11.7695 2.11914 11.7227 1.98633 11.6016C1.37305 11.0547 0.888672 10.3965 0.533203 9.62695C0.177734 8.85742 0 8.0332 0 7.1543Z"
              fill="white"
            />
          </svg>
          Touch to move
        </button>
      )}
    </div>
  );
}
