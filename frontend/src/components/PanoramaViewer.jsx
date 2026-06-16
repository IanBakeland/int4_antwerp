import React, { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import { Link } from 'react-router-dom';
import '@photo-sphere-viewer/core/index.css';

export default function PanoramaViewer({ image, className }) {
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
  });
  const [gyroStarted, setGyroStarted] = useState(false);
  const [gyroFailed, setGyroFailed] = useState(false);
  const viewerRef = useRef(null);

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

  return (
    <div className={className} style={{ position: 'relative' }}>
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
      />
      
      {isMobile && gyroStarted && (
        <>
          <div className="panoGradientOverlay" />
          <div className="exploreActionsContainer">
          <Link
            to="#"
            onClick={(e) => e.preventDefault()}
            className="exploreSceneButton"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="exploreSceneButton__icon"
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
            className="discoverSpotsButton"
          >
            Discover spots
            <span className="discoverSpotsButton__arrow">→</span>
          </Link>
        </div>
      </>
      )}

      {isMobile && !gyroStarted && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 10
        }}>
          <button 
            className="button" 
            onClick={handleStartGyro}
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            Start Gyroscoop (Rondkijken)
          </button>
        </div>
      )}
    </div>
  );
}
