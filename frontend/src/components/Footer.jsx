import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

// Logo and Social media icons
import logoAntwerpFooter from '../assets/images/logoantwerpfooter.png';
import pinterestIcon from '../assets/images/pinterest.png';
import tiktokIcon from '../assets/images/tiktok.png';
import facebookIcon from '../assets/images/facebook.png';
import instagramIcon from '../assets/images/instagram.png';
import youtubeIcon from '../assets/images/youtube.png';

export default function Footer() {
  const location = useLocation();
  const allowedPaths = ['/', '/favourites', '/share'];

  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      {/* Background SVG decoration for mobile */}
      <svg
        className={styles.footerBg}
        viewBox="0 0 393 715"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="393" height="244" fill="url(#paint0_linear_1639_3590)" />
        <g filter="url(#filter0_d_1639_3590)">
          <path
            d="M-1 215C-1 215 69.2008 235.78 196 235.78C322.799 235.78 393 215 393 215V468C393 468 318.578 447.22 196 447.22C73.4222 447.22 -1 468 -1 468V215Z"
            fill="#FF7D3C"
          />
        </g>
        <rect x="-1" y="401" width="394" height="314" fill="#FF7D3C" />
        <defs>
          <filter
            id="filter0_d_1639_3590"
            x="-71"
            y="175"
            width="534"
            height="393"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="30" />
            <feGaussianBlur stdDeviation="35" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1639_3590"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1639_3590"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1639_3590"
            x1="196.5"
            y1="0"
            x2="196.5"
            y2="244"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.216346" stopColor="white" stopOpacity="0.25" />
            <stop offset="0.475962" stopColor="white" stopOpacity="0.5" />
            <stop offset="0.716346" stopColor="white" stopOpacity="0.75" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
        </defs>
      </svg>

      {/* Footer Content Area */}
      <div className={styles.footerContent}>
        <div className={styles.footerLogoWrapper}>
          <img src={logoAntwerpFooter} alt="Antwerp Stories" className={styles.footerLogoImg} />
        </div>
        <nav className={styles.footerNav}>
          <Link to="/" className={styles.footerLink}>Home</Link>
          <Link to="/#panoramas" className={styles.footerLink}>Panorama's</Link>
          <Link to="/radar" className={styles.footerLink}>Radar</Link>
          <Link to="/favourites" className={styles.footerLink}>Favourites</Link>
          <Link to="/account" className={styles.footerLink}>Account</Link>
          <a
            href="https://www.visitantwerpen.be"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.footerLink} ${styles.footerLinkSpecial}`}
          >
            Visit Antwerp
          </a>
          
          <div className={styles.footerSocials}>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
              <img src={pinterestIcon} alt="Pinterest" className={styles.footerSocialIcon} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
              <img src={tiktokIcon} alt="TikTok" className={styles.footerSocialIcon} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
              <img src={facebookIcon} alt="Facebook" className={styles.footerSocialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
              <img src={instagramIcon} alt="Instagram" className={styles.footerSocialIcon} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
              <img src={youtubeIcon} alt="YouTube" className={styles.footerSocialIcon} />
            </a>
          </div>
        </nav>

        <p className={styles.footerCopyright}>
          © All rights reserved 2026
        </p>
      </div>
    </footer>
  );
}