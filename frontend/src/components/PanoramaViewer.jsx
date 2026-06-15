import React, { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import '@photo-sphere-viewer/core/index.css';

export default function PanoramaViewer({ image, className }) {
  const [isMobile, setIsMobile] = useState(false);
  const [gyroStarted, setGyroStarted] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const plugins = [
    [GyroscopePlugin, { absolutePosition: true }]
  ];

  const handleStartGyro = () => {
    if (viewerRef.current) {
      const gyroPlugin = viewerRef.current.getPlugin(GyroscopePlugin);
      if (gyroPlugin) {
        gyroPlugin.start().then(() => {
          setGyroStarted(true);
        }).catch(err => {
          console.error("Gyroscope error:", err);
          alert("Kon gyroscoop niet starten. Controleer of je toestel dit ondersteunt en of je in Safari 'Motion & Orientation Access' aan hebt staan.");
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
        mousemove={!isMobile}
        mousewheel={true}
        touchmoveTwoFingers={true}
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
