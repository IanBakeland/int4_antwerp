import React, { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
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
