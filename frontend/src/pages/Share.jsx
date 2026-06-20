import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import styles from './Share.module.css';

// images & icons
import antwerpLogo from '../assets/images/antwerpLogo.png';
import PersonFilledIcon from '../assets/icons/PersonFilled';

// SVGs provided by the user
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.40197 14.5323C9.64197 13.4617 13.3346 9.99501 13.3346 6.66634C13.3346 5.25185 12.7727 3.8953 11.7725 2.89511C10.7723 1.89491 9.41579 1.33301 8.0013 1.33301C6.58681 1.33301 5.23026 1.89491 4.23007 2.89511C3.22987 3.8953 2.66797 5.25185 2.66797 6.66634C2.66797 9.99501 6.36064 13.4617 7.60064 14.5323C7.71615 14.6192 7.85677 14.6662 8.0013 14.6662C8.14583 14.6662 8.28645 14.6192 8.40197 14.5323Z" stroke="#5596FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#5596FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.17188 11.6797L0.367188 12.375C0.273438 12.4115 0.1875 12.388 0.109375 12.3047C0.0364583 12.2266 0.0182292 12.1406 0.0546875 12.0469L0.796875 10.3047L9.32812 1.78906L10.6953 3.16406L2.17188 11.6797ZM11.3828 2.49219L10 1.11719L10.7891 0.335938C10.987 0.143229 11.1875 0.0390625 11.3906 0.0234375C11.599 0.0078125 11.7917 0.0885417 11.9688 0.265625L12.2344 0.53125C12.4167 0.713542 12.5026 0.90625 12.4922 1.10938C12.4818 1.3125 12.375 1.51562 12.1719 1.71875L11.3828 2.49219Z" fill="#FF7D3C"/>
  </svg>
);

const MicIcon = () => (
  <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.71387 7.10938V2.88477C2.71387 1.18945 3.8418 0 5.42773 0C7.00683 0 8.13476 1.18945 8.13476 2.88477V7.10938C8.13476 8.81152 7.00683 9.99414 5.42773 9.99414C3.8418 9.99414 2.71387 8.81152 2.71387 7.10938ZM4.21094 7.15039C4.21094 7.99121 4.66894 8.58594 5.42773 8.58594C6.17969 8.58594 6.64453 7.99121 6.64453 7.15039V2.84375C6.64453 2.00293 6.17969 1.4082 5.42773 1.4082C4.66894 1.4082 4.21094 2.00977 4.21094 2.84375V7.15039ZM2.22851 15.3467C1.81836 15.3467 1.4834 15.0117 1.4834 14.6084C1.4834 14.2051 1.81836 13.877 2.22851 13.877H4.7168V12.6191C1.94824 12.332 -9.53674e-07 10.3564 -9.53674e-07 7.45117V6.125C-9.53674e-07 5.72168 0.33496 5.40723 0.745116 5.40723C1.14844 5.40723 1.49023 5.72168 1.49023 6.125V7.40332C1.49023 9.72754 3.10351 11.2588 5.42773 11.2588C7.74512 11.2588 9.36523 9.72754 9.36523 7.40332V6.125C9.36523 5.72168 9.70019 5.40723 10.1104 5.40723C10.5205 5.40723 10.8486 5.72168 10.8486 6.125V7.45117C10.8486 10.3564 8.90723 12.332 6.13183 12.6191V13.877H8.62695C9.03027 13.877 9.37207 14.2051 9.37207 14.6084C9.37207 15.0117 9.03027 15.3467 8.62695 15.3467H2.22851Z" fill="black"/>
  </svg>
);

const StopIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="12" height="12" rx="2.5" fill="#FF3B30"/>
  </svg>
);

const PhotoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#00D77D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.0013 7.33366C6.73768 7.33366 7.33464 6.73671 7.33464 6.00033C7.33464 5.26395 6.73768 4.66699 6.0013 4.66699C5.26492 4.66699 4.66797 5.26395 4.66797 6.00033C4.66797 6.73671 5.26492 7.33366 6.0013 7.33366Z" stroke="#00D77D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 10.0004L11.9427 7.94312C11.6926 7.69315 11.3536 7.55273 11 7.55273C10.6464 7.55273 10.3074 7.69315 10.0573 7.94312L4 14.0004" stroke="#00D77D" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const SpotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#FF82DC" stroke-width="1.33333"/>
    <circle cx="8" cy="8" r="3" stroke="#FF82DC" stroke-width="1.33333"/>
    <circle cx="8" cy="8" r="0.8" fill="#FF82DC"/>
  </svg>
);

export default function Share() {
  useDocumentTitle('Share your story');
  const [username, setUsername] = useState('Emma');
  const [story, setStory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetch('https://necessary-light-a082e19892.strapiapp.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch profile');
        })
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  // Dynamically reduce the main container's bottom margin for this page
  useEffect(() => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      const originalMarginBottom = mainEl.style.marginBottom;
      mainEl.style.marginBottom = '0px';
      return () => {
        mainEl.style.marginBottom = originalMarginBottom;
      };
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'nl-BE'; // Optimized for local Dutch storytelling, but works for clean English speech too

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setStory((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      setRecognition(rec);
    }
  }, []);

  const handleTranscribeClick = () => {
    if (!recognition) {
      alert('Spraakherkenning wordt niet ondersteund in deze browser. Probeer Google Chrome of Safari.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  return (
    <div className={styles.shareContainer}>
      <header className={styles.navbarMobileTop}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
        </Link>
        <div className={styles.navbarMobileTopRight}>
          <Link to="/account" className={`${styles.activeIconButton} iconbutton`} aria-label="Account">
            <PersonFilledIcon />
          </Link>
        </div>
      </header>

      <div className={styles.shareContent}>
        <h1>Share your<span> story</span></h1>
        <p className={styles.shareSubtitle}>
          Share your own personal story about Antwerp and help others discover the city through your experience.
        </p>

        <form className={styles.shareForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formHeader}>
            <h2>Hey {username},</h2>
            <p>share your Antwerp story!</p>
          </div>

          {/* Location Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="location-input" className={styles.inputLabel}>
              <PinIcon />
              Location in Antwerp
              <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="location-input"
              type="text"
              className={styles.inputField}
              placeholder="e.g. Leopoldstraat, Grote Markt, ..."
              required
            />
          </div>

          {/* Story Field */}
          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="story-input" className={styles.inputLabel}>
                <PencilIcon />
                Your story
                <span className={styles.requiredAsterisk}>*</span>
              </label>
              <button 
                type="button" 
                className={`${styles.transcribeButton} ${isListening ? styles.transcribeButtonActive : ''}`}
                onClick={handleTranscribeClick}
              >
                {isListening ? <StopIcon /> : <MicIcon />}
                {isListening ? 'Listening' : 'Transcribe'}
              </button>
            </div>
            <textarea
              id="story-input"
              className={styles.textareaField}
              placeholder="Type your story here, or use the microphone to record it..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
            />
          </div>

          {/* Specific Spots Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="spots-input" className={styles.inputLabel}>
              <SpotIcon />
              Specific spots in your story
              <span className={styles.requiredAsterisk}>*</span>
            </label>
            <p className={styles.spotSublabel}>
              Tag the exact places you mention. Streets, squares, buildings, cafés, etc.
            </p>
            <div className={styles.spotInputRow}>
              <input
                id="spots-input"
                type="text"
                className={styles.inputField}
                placeholder="e.g. Café Den Engel, Handelsbeurs..."
              />
              <button type="button" className={styles.addSpotButton} aria-label="Add spot">
                +
              </button>
            </div>
          </div>

          {/* Panorama photo requirements and dropzone */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <PhotoIcon />
              Panorama photo
            </label>
            
            <div className={styles.requirementsBox}>
              <h3 className={styles.requirementsTitle}>Panorama requirements</h3>
              <ul className={styles.requirementsList}>
                <li className={styles.requirementItem}>Minimum aspect ratio 2:1 wide (e.g. 4000 × 2000 px)</li>
                <li className={styles.requirementItem}>Format: JPG or PNG, maximum 30 MB</li>
                <li className={styles.requirementItem}>Must be a true panorama, not a cropped landscape photo</li>
              </ul>
            </div>

            <div className={styles.uploadDropzone}>
              <div className={styles.uploadIconContainer}>
                <PhotoIcon />
                <span className={styles.uploadPlusBadge}>+</span>
              </div>
              <span className={styles.uploadText}>Click to add your panorama</span>
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" className={styles.submitStoryButton}>
            Submit story &rarr;
          </button>

          {/* Disclaimer */}
          <p className={styles.disclaimerText}>
            Antwerp curates the stories featured on Antwerp Scenes. Your submission may be rewritten if it does not meet our quality standards. By submitting a story, you agree to our Terms and Conditions.
          </p>
        </form>
      </div>
    </div>
  );
}