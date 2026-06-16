import { useEffect } from 'react';

export default function RadarVisual({ distance, isRadarActive}) {
  let innerScale = 1;
  let middleScale = 1;
  let outerScale = 1;

  let innerOpacity = 1;
  let middleOpacity = 1;
  let outerOpacity = 1;

  let pulseSpeed = 5.0;

    // inner ring infinity to 1000m
    if (distance > 1000) {
      const clampedDistance = Math.min(distance, 2000);
      innerScale = 0.5 + 0.5 * ((2000 - clampedDistance) / 1000);
      middleScale = 0.66; 
      middleOpacity = 0;
      outerScale = 0.69;  
      outerOpacity = 0;
    }

    // middle ring 1000m to 500m
    else if (distance > 500) {
      innerScale = 1;
      const progress = (1000 - distance) / 500;
      middleScale = 0.66 + (0.34 * progress);
      middleOpacity = Math.min(1, progress * 2);
      outerScale = 0.69;
      outerOpacity = 0;
    }

    // outer ring 500m to 150m
    else if (distance > 150) {
      innerScale = 1;
      middleScale = 1;
      middleOpacity = 1;
      const progress = (500 - distance) / 350;

      outerScale = 0.69 + (0.31 * progress);
      outerOpacity = Math.min(1, progress * 2);
    }
    
    if (distance > 1000) {
      pulseSpeed = 5.0; 
    } else if (distance <= 150) {
      pulseSpeed = 2.0;
    } else {
      const progress = (1000 - distance) / 850; 
      pulseSpeed = 2.0 - (progress * 1.4);
    }

  const pulseDelay = `${pulseSpeed / 10}s`;

  // Story unlock logic from 150 which would be an equivlent to a street i think
  useEffect(() => {
    if (distance !== null && distance <= 150) {
      console.log("Story Unlocked!");
    }
  }, [distance]);

  return (
    <div className="radar-container">
    {distance != null && isRadarActive && (
    <>
        <div 
        className="radar-pulse-ring" 
        style={{ animationDuration: `${pulseSpeed}s` }}
        ></div>   
        <div 
        className="radar-pulse-ring" 
        style={{ 
            animationDuration: `${pulseSpeed}s`, 
            animationDelay: pulseDelay 
        }}
        ></div>
    </>
    )}

      
      <div 
        className="radar-outer" 
        style={{ transform: `scale(${outerScale})`, opacity: outerOpacity }}
      ></div>
      
      <div 
        className="radar-middle" 
        style={{ transform: `scale(${middleScale})`, opacity: middleOpacity }}
      ></div>
      
      <div 
        className="radar-inner" 
        style={{ transform: `scale(${innerScale})`, opacity: innerOpacity }}
      ></div>
    </div>
  );
}