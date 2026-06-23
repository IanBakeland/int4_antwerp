import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import styles from './Share.module.css';

import antwerpLogo from '../assets/images/antwerpLogo.png';
import PersonIcon from '../assets/icons/Person';
import termsPdf from '../assets/files/termsandconditions.pdf';

import HeartIcon from '../assets/icons/Heart';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import FilterIcon from '../assets/icons/Filter';
import SpeakerIcon from '../assets/icons/Speaker';

import birdsSound from '../assets/sounds/birds.mp3';
import citySound from '../assets/sounds/city.mp3';
import tramSound from '../assets/sounds/tram.mp3';
import churchSound from '../assets/sounds/church.mp3';
import rainSound from '../assets/sounds/rain.mp3';
import peopleSound from '../assets/sounds/people.mp3';

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.40197 14.5323C9.64197 13.4617 13.3346 9.99501 13.3346 6.66634C13.3346 5.25185 12.7727 3.8953 11.7725 2.89511C10.7723 1.89491 9.41579 1.33301 8.0013 1.33301C6.58681 1.33301 5.23026 1.89491 4.23007 2.89511C3.22987 3.8953 2.66797 5.25185 2.66797 6.66634C2.66797 9.99501 6.36064 13.4617 7.60064 14.5323C7.71615 14.6192 7.85677 14.6662 8.0013 14.6662C8.14583 14.6662 8.28645 14.6192 8.40197 14.5323Z" stroke="#5596FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#5596FF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
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
    <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="#00D77D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.0013 7.33366C6.73768 7.33366 7.33464 6.73671 7.33464 6.00033C7.33464 5.26395 6.73768 4.66699 6.0013 4.66699C5.26492 4.66699 4.66797 5.26395 4.66797 6.00033C4.66797 6.73671 5.26492 7.33366 6.0013 7.33366Z" stroke="#00D77D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 10.0004L11.9427 7.94312C11.6926 7.69315 11.3536 7.55273 11 7.55273C10.6464 7.55273 10.3074 7.69315 10.0573 7.94312L4 14.0004" stroke="#00D77D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#FF82DC" strokeWidth="1.33333"/>
    <circle cx="8" cy="8" r="3" stroke="#FF82DC" strokeWidth="1.33333"/>
    <circle cx="8" cy="8" r="0.8" fill="#FF82DC"/>
  </svg>
);

const SOUND_FILES = {
  Birds: birdsSound,
  City: citySound,
  Tram: tramSound,
  Church: churchSound,
  Rain: rainSound,
  People: peopleSound
};

export default function Share() {
  useDocumentTitle('Share your story');
  
  const [username, setUsername] = useState('Emma');
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('social');
  const [story, setStory] = useState('');
  const [spots, setSpots] = useState([]);
  const [currentSpot, setCurrentSpot] = useState('');
  const [soundEffects, setSoundEffects] = useState([]);
  const [panoramaFile, setPanoramaFile] = useState(null);
  const [panoramaPreview, setPanoramaPreview] = useState(null);
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [spotsError, setSpotsError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [playingSound, setPlayingSound] = useState(null);
  const audioRef = useRef(null);
  const previewTimeoutRef = useRef(null);

  const token = localStorage.getItem('token');
  const baseStoryRef = useRef('');
  const fileInputRef = useRef(null);

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
            setUserId(data.id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'nl-BE';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onresult = (event) => {
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          sessionTranscript += event.results[i][0].transcript;
        }
        const prefix = baseStoryRef.current ? baseStoryRef.current + ' ' : '';
        setStory(prefix + sessionTranscript);
      };

      setRecognition(rec);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const handleTranscribeClick = () => {
    if (!recognition) {
      alert('Spraakherkenning wordt niet ondersteund in deze browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      baseStoryRef.current = story;
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const handleAddSpot = () => {
    const spotTrimmed = currentSpot.trim();
    if (spotTrimmed) {
      if (spots.length >= 4) {
        setSpotsError('Je kunt maximaal 4 plekken toevoegen.');
        return;
      }
      if (!spots.includes(spotTrimmed)) {
        setSpots((prev) => [...prev, spotTrimmed]);
      }
      setCurrentSpot('');
      setSpotsError('');
    }
  };

  const handleRemoveSpot = (indexToRemove) => {
    setSpots((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (spots.length <= 4) setSpotsError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpot();
    }
  };

  const toggleSound = (sound) => {
    setSoundEffects(prev => 
      prev.includes(sound) 
        ? prev.filter(s => s !== sound)
        : [...prev, sound]
    );
  };

  const playPreview = (soundName) => {
    const audioEl = audioRef.current;
    
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    if (playingSound === soundName) {
      audioEl.pause();
      setPlayingSound(null);
      return;
    }

    audioEl.src = SOUND_FILES[soundName];
    audioEl.play().catch(e => console.error("Audio playback failed:", e));
    setPlayingSound(soundName);

    previewTimeoutRef.current = setTimeout(() => {
      audioEl.pause();
      setPlayingSound(null);
    }, 5000);
  };

const handleSoundClick = (soundName) => {
    const isTurningOff = soundEffects.includes(soundName);
    toggleSound(soundName);
    if (isTurningOff) {
      if (playingSound === soundName && audioRef.current) {
        audioRef.current.pause();
        setPlayingSound(null);
        if (previewTimeoutRef.current) {
          clearTimeout(previewTimeoutRef.current);
        }
      }
    } else {
      playPreview(soundName);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isImage = validTypes.includes(fileType) || 
                    fileName.endsWith('.jpg') || 
                    fileName.endsWith('.jpeg') || 
                    fileName.endsWith('.png');

    if (!isImage) {
      setErrorMessage('Ongeldig bestandsformaat. Upload alleen een JPG, JPEG of PNG bestand.');
      handleRemovePreview();
      return;
    }

    const maxSizeBytes = 30 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('Bestand is te groot. Maximale bestandsgrootte is 30 MB.');
      handleRemovePreview();
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.width;
      const height = img.height;
      const ratio = width / height;

      if (width < 4000 || height < 2000) {
        setErrorMessage(`De resolutie is te laag (${width} × ${height} px). De afbeelding moet minimaal 4000 × 2000 pixels zijn.`);
        handleRemovePreview();
        return;
      }

      if (ratio < 2.0) {
        setErrorMessage(`De beeldverhouding is ongeldig (${ratio.toFixed(2)}:1). Een panorama moet een minimale verhouding van 2:1 hebben.`);
        handleRemovePreview();
        return;
      }

      if (panoramaPreview) {
        URL.revokeObjectURL(panoramaPreview);
      }
      setErrorMessage('');
      setPanoramaFile(file);
      setPanoramaPreview(URL.createObjectURL(file));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMessage('Kon de afbeelding niet laden. Het bestand is mogelijk beschadigd.');
      handleRemovePreview();
    };
  };

  const handleRemovePreview = (e) => {
    if (e) e.stopPropagation();
    if (panoramaPreview) {
      URL.revokeObjectURL(panoramaPreview);
    }
    setPanoramaFile(null);
    setPanoramaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title || !location || !story || spots.length === 0 || !panoramaFile) {
      setErrorMessage('Vul alle verplichte velden in en upload een panorama.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('files', panoramaFile);
      
      const uploadRes = await fetch('https://necessary-light-a082e19892.strapiapp.com/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      const imageId = uploadData[0].id;

      const storyPayload = {
        data: {
          title: title,
          Location: location,
          story: story,
          category: category,
          hiddenSpots: spots,
          soundEffects: soundEffects,
          panorama: imageId,
          user: userId
        }
      };

      const res = await fetch('https://necessary-light-a082e19892.strapiapp.com/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(storyPayload)
      });

      if (!res.ok) throw new Error('Failed to save story');
      
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Er is iets misgegaan. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.share}>
      <header className={styles['share__mobile-nav']}>
        <Link to="/" className={styles['share__mobile-logo-link']} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles['share__mobile-logo-image']} />
        </Link>
        <div className={styles['share__mobile-nav-right']}>
          <Link to="/account" className="iconbutton" aria-label="Account">
            <PersonIcon />
          </Link>
        </div>
      </header>

      {isSubmitted ? (
        <div className={styles['share__success-content']}>
          <div className={styles['share__success-check-circle']}>
            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35.8327 10.75L16.1243 30.4583L7.16602 21.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles['share__success-title']}>
            Story <br /><span className={styles['share__success-title-orange']}>SHARED</span>!
          </h1>
          <p className={styles['share__success-message']}>
            Thank you, {username}. Your story has been received and will be checked soon.
          </p>
          <Link to="/" className={styles['share__success-button']}>
            Back to home
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      ) : (
        <div className={styles['share__content']}>
          <h1>Share your <span>story</span></h1>
          <p className={styles['share__subtitle']}>
            Share your own personal story about Antwerp and help others discover the city through your experience.
          </p>

          <form className={styles.share__form} onSubmit={handleSubmit}>
            <div className={styles['share__form-header']}>
              <h2>Hey {username},</h2>
              <p>share your Antwerp story!</p>
            </div>

            <div className={styles['share__input-group']}>
              <label htmlFor="title-input" className={styles['share__input-label']}>
                <PencilIcon />
                Story Title
                <span className={styles['share__required-asterisk']}>*</span>
              </label>
              <input
                id="title-input"
                type="text"
                className={styles['share__input-field']}
                placeholder="e.g. My First Kiss"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles['share__input-group']}>
              <label htmlFor="location-input" className={styles['share__input-label']}>
                <PinIcon />
                Location in Antwerp
                <span className={styles['share__required-asterisk']}>*</span>
              </label>
              <input
                id="location-input"
                type="text"
                className={styles['share__input-field']}
                placeholder="e.g. Leopoldstraat, Grote Markt, ..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className={styles['share__input-group']}>
              <label className={styles['share__input-label']}>
                <span className={styles.purpleIcon}><FilterIcon /></span>
                Category
                <span className={styles['share__required-asterisk']}>*</span>
              </label>
              <div className={styles['share__pill-group']}>
                <button 
                  type="button"
                  className={`${styles.filterButton} ${category === 'action' ? styles.limeTag : ''}`} 
                  onClick={() => setCategory('action')}
                >
                  <PersonRunningIcon />Action
                </button>
                <button 
                  type="button"
                  className={`${styles.filterButton} ${category === 'culture' ? styles.orangeTag : ''}`} 
                  onClick={() => setCategory('culture')}
                >
                  <MonumentIcon />Culture
                </button>
                <button 
                  type="button"
                  className={`${styles.filterButton} ${category === 'business' ? styles.blueTag : ''}`} 
                  onClick={() => setCategory('business')}
                >
                  <FolderIcon />Business
                </button>
                <button 
                  type="button"
                  className={`${styles.filterButton} ${category === 'romantic' ? styles.pinkTag : ''}`} 
                  onClick={() => setCategory('romantic')}
                >
                  <HeartIcon />Romantic
                </button>
                <button 
                  type="button"
                  className={`${styles.filterButton} ${category === 'social' ? styles.greenTag : ''}`} 
                  onClick={() => setCategory('social')}
                >
                  <PersonDoubleIcon />Social
                </button>
              </div>
            </div>

            <div className={styles['share__input-group']}>
              <div className={styles['share__label-row']}>
                <label htmlFor="story-input" className={styles['share__input-label']}>
                  <PencilIcon />
                  Your story
                  <span className={styles['share__required-asterisk']}>*</span>
                </label>
                <button 
                  type="button" 
                  className={`${styles['share__transcribe-button']} ${isListening ? styles['share__transcribe-button--active'] : ''}`}
                  onClick={handleTranscribeClick}
                >
                  {isListening ? <StopIcon /> : <MicIcon />}
                  {isListening ? 'Listening' : 'Transcribe'}
                </button>
              </div>
              <textarea
                id="story-input"
                className={styles['share__textarea-field']}
                placeholder="Type your story here, or use the microphone to record it..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
              />
            </div>

            <div className={styles['share__input-group']}>
              <label htmlFor="spots-input" className={styles['share__input-label']}>
                <SpotIcon />
                Hidden Spots
                <span className={styles['share__required-asterisk']}>*</span>
              </label>
              <p className={styles['share__spot-sublabel']}>
                Tag the exact places you mention (max 4).
              </p>
              <div className={styles['share__spot-input-row']}>
                <input
                  id="spots-input"
                  type="text"
                  className={styles['share__input-field']}
                  placeholder="e.g. Café Den Engel..."
                  value={currentSpot}
                  onChange={(e) => setCurrentSpot(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={spots.length >= 4}
                />
                <button 
                  type="button" 
                  className={styles['share__add-spot-button']} 
                  onClick={handleAddSpot}
                  disabled={spots.length >= 4}
                >
                  +
                </button>
              </div>
              {spots.length > 0 && (
                <div className={styles['share__spots-list']}>
                  {spots.map((spot, index) => (
                    <span key={index} className={styles['share__spot-tag']}>
                      {spot}
                      <button 
                        type="button" 
                        className={styles['share__remove-spot-button']} 
                        onClick={() => handleRemoveSpot(index)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {spotsError && (
                <div className={styles['share__error-box']}>
                  <p className={styles['share__error-text']}>{spotsError}</p>
                </div>
              )}
            </div>

            <div className={styles['share__input-group']}>
              <label className={styles['share__input-label']}>
                <span className={styles.bordeauxIcon}><SpeakerIcon /></span>
                Sound Effects
              </label>
              <p className={styles['share__spot-sublabel']}>
                Select the ambient sounds that fit your story.
              </p>
              <div className={styles['share__pill-group']}>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('City') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('City')}>
                  <SpeakerIcon />City
                </button>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('Rain') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('Rain')}>
                  <SpeakerIcon />Rain
                </button>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('People') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('People')}>
                  <SpeakerIcon />People
                </button>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('Birds') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('Birds')}>
                  <SpeakerIcon />Birds
                </button>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('Tram') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('Tram')}>
                  <SpeakerIcon />Tram
                </button>
                <button type="button" className={`${styles.filterButton} ${soundEffects.includes('Church') ? styles.orangeTag : ''}`} onClick={() => handleSoundClick('Church')}>
                  <SpeakerIcon />Church
                </button>
              </div>
            </div>

            <div className={styles['share__input-group']}>
              <label className={styles['share__input-label']}>
                <PhotoIcon />
                Panorama photo
                <span className={styles['share__required-asterisk']}>*</span>
              </label>
              
              <div className={styles['share__requirements-box']}>
                <h3 className={styles['share__requirements-title']}>Panorama requirements</h3>
                <ul className={styles['share__requirements-list']}>
                  <li className={styles['share__requirement-item']}>Minimum aspect ratio 2:1 wide</li>
                  <li className={styles['share__requirement-item']}>Format: JPG or PNG, maximum 30 MB</li>
                  <li className={styles['share__requirement-item']}>Must be a true panorama</li>
                </ul>
              </div>

              <div 
                className={`${styles['share__upload-dropzone']} ${panoramaPreview ? styles['share__upload-dropzone--has-preview'] : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && validateAndProcessFile(e.target.files[0])}
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                />
                {panoramaPreview ? (
                  <div className={styles['share__preview-container']}>
                    <img src={panoramaPreview} alt="Panorama preview" className={styles['share__preview-image']} />
                    <div className={styles['share__preview-overlay']}>
                      <span>Click to change panorama</span>
                    </div>
                    <button 
                      type="button" 
                      className={styles['share__remove-preview-button']} 
                      onClick={handleRemovePreview}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles['share__upload-icon-container']}>
                      <PhotoIcon />
                      <span className={styles['share__upload-plus-badge']}>+</span>
                    </div>
                    <span className={`${styles['share__upload-text']} ${styles.desktopOnly}`}>Click or drag & drop your panorama</span>
                    <span className={`${styles['share__upload-text']} ${styles.mobileOnly}`}>Click to add your panorama</span>
                  </>
                )}
              </div>

              {errorMessage && (
                <div className={styles['share__error-box']}>
                  <p className={styles['share__error-text']}>{errorMessage}</p>
                </div>
              )}
            </div>

            <button type="submit" className={styles['share__submit-button']} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit story'}
              {!isSubmitting && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            <p className={styles['share__disclaimer-text']}>
              Antwerp curates the stories featured on Antwerp Scenes. Your submission may be rewritten if it does not meet our quality standards. By submitting a story, you agree to our <a href={termsPdf} target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
            </p>
          </form>
        </div>
      )}
      
      <audio ref={audioRef} style={{ display: 'none' }} />
      
    </div>
  );
}