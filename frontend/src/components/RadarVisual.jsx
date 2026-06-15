import { useEffect } from 'react';

export default function RadarVisual({ distance }) {
  let innerScale = 1;
  let middleScale = 1;
  let outerScale = 1;

  let innerOpacity = 1;
  let middleOpacity = 1;
  let outerOpacity = 1;

  // The scaling math based on distance
  if (distance !== null && distance !== undefined) {
    if (distance > 1000) {
      const clampedDistance = Math.min(distance, 2000);
      innerScale = 0.5 + 0.5 * ((2000 - clampedDistance) / 1000);
    }

    if (distance > 1000) {
      middleScale = 0;
      middleOpacity = 0;
    } else if (distance > 500) {
      middleScale = 1 - ((distance - 700) / 500);
      middleOpacity = 1;
    }

    if (distance > 500) {
      outerScale = 0;
      outerOpacity = 0;
    } else if (distance > 150) {
      outerScale = 1 - ((distance - 150) / 350);
      outerOpacity = 1;
    }
  }

  // Story unlock logic
  useEffect(() => {
    if (distance !== null && distance <= 150) {
      console.log("Story Unlocked!");
    }
  }, [distance]);

  return (
    <div className="radar-container">
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