import useDocumentTitle from '../hooks/useDocumentTitle';
import styles from './RadarExplained.module.css';

export default function RadarExplained() {
  useDocumentTitle('Radar explained');

  return (
    <section className={styles.container} id="radar-explained-page">
      <div className={styles.contentCol}>
        {/* Live Status Badge */}
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} aria-hidden="true"></span>
          Live in Antwerp
        </div>

        {/* Main Heading */}
        <h1 className={styles.title}>
          Unlock stories<br />
          using the <span>RADAR</span>
        </h1>

        {/* Dynamic Numbered Steps */}
        <div className={styles.stepsList}>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Use radar on your phone</h2>
              <p className={styles.stepDescription}>
                Scan the QR-code below to easily acces this website on your phone and explore the radar.
              </p>
            </div>
          </div>

          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                Follow the pulse &amp; discover <span>hidden spots</span>
              </h2>
              <p className={styles.stepDescription}>
                Follow the pulse to unlock the full story. Listen carefully, as there are <strong>hidden local spots</strong> tucked away in the story!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}