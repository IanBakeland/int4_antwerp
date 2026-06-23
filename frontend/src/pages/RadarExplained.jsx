import useDocumentTitle from '../hooks/useDocumentTitle';
import qrCodeImg from '../assets/images/qrradar.png';
import styles from './RadarExplained.module.css';

export default function RadarExplained() {
  useDocumentTitle('Radar explained');

  return (
    <section className={styles['radar-explained']} id="radar-explained-page">
      <div className={styles['radar-explained__illustration']} aria-hidden="true" />
      <div className={styles['radar-explained__content-col']}>
        {/* Live Status Badge */}
        <div className={styles['radar-explained__live-badge']}>
          <span className={styles['radar-explained__live-dot']} aria-hidden="true"></span>
          Live in Antwerp
        </div>

        {/* Main Heading */}
        <h1 className={styles['radar-explained__title']}>
          Unlock stories<br />
          using the <span>RADAR</span>
        </h1>

        {/* Dynamic Numbered Steps */}
        <ol className={styles['radar-explained__steps-list']}>
          <li className={styles['radar-explained__step-item']}>
            <span className={styles['radar-explained__step-number']}>1</span>
            <div className={styles['radar-explained__step-content']}>
              <h2 className={styles['radar-explained__step-title']}>Use radar on your phone</h2>
              <p className={styles['radar-explained__step-description']}>
                Scan the QR-code below to easily acces this website on your phone and explore the radar.
              </p>
            </div>
          </li>

          <li className={styles['radar-explained__step-item']}>
            <span className={styles['radar-explained__step-number']}>2</span>
            <div className={styles['radar-explained__step-content']}>
              <h2 className={styles['radar-explained__step-title']}>
                Follow the pulse &amp; discover <span>hidden spots</span>
              </h2>
              <p className={styles['radar-explained__step-description']}>
                Follow the pulse to unlock the full story. Listen carefully, as there are <strong>hidden local spots</strong> tucked away in the story!
              </p>
            </div>
          </li>
        </ol>

        {/* Pink QR square (copied from the home page, static — no zoom) */}
        <div className={styles['radar-explained__qr-square']}>
          <img src={qrCodeImg} alt="QR code to open the radar on your phone" className={styles['radar-explained__qr-img']} />
        </div>
      </div>
    </section>
  );
}
