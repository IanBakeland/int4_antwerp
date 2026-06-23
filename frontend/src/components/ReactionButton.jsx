import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import styles from './ReactionButton.module.css';

import ReactionFilledIcon from '../assets/icons/ReactionFilled';
import PlusCircleFilledIcon from '../assets/icons/PlusCircleFilled';

export default function ReactionButton({ storyId }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [reactions, setReactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [flameParticles, setFlameParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const isPendingRef = useRef(false);

  const fireParticles = (emojis) => {
    const generatedParticles = [];
    for (let i = 0; i < 7; i++) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      generatedParticles.push({
        id: Date.now() + i,
        emoji: randomEmoji,
        spreadX: `${(Math.random() - 0.5) * 40}px`,
        endY: `-${Math.random() * 50 + 50}px`,
        duration: `${Math.random() * 1.0 + 1.5}s`,
        delay: `${Math.random() * 0.3}s`,
        rot: `${(Math.random() - 0.5) * 120}deg`
      });
    }
    setFlameParticles(generatedParticles);
    setTimeout(() => setFlameParticles([]), 3000);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (token) {
          const userRes = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserId(userData.id);
          }
        }

        const res = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/reactions?filters[story][documentId][$eq]=${storyId}&populate=user&pagination[limit]=100`);
        if (res.ok) {
          const data = await res.json();
          setReactions(data.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (storyId) {
      fetchInitialData();
    }
  }, [storyId, token]);

  useEffect(() => {
    if (reactions.length > 0 && !hasAnimatedRef.current && isVisible && !isPendingRef.current) {
      const usedEmojis = reactions.map(r => r.emoji).filter(Boolean);

      if (usedEmojis.length > 0) {
        isPendingRef.current = true;

        setTimeout(() => {
          hasAnimatedRef.current = true;
          fireParticles(usedEmojis);
        }, 1000);
      }
    }
  }, [reactions, isVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsBarOpen(false);
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const myReaction = reactions.find(r => r.user?.id === userId);

  const topEmojis = () => {
    const counts = {};
    reactions.forEach(r => {
      if (r.emoji) {
        counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMainClick = async (e) => {
    e.stopPropagation();

    if (!token) {
      navigate('/login');
      return;
    }

    if (myReaction) {
      const previousReactions = [...reactions];
      setReactions(reactions.filter(r => r.documentId !== myReaction.documentId));

      try {
        await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/reactions/${myReaction.documentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error(error);
        setReactions(previousReactions);
      }
    } else {
      setIsBarOpen(!isBarOpen);
      setShowPicker(false);
    }
  };

  const handleSelectEmoji = async (emojiStr) => {
    if (!token || !userId) return;

    setIsBarOpen(false);
    setShowPicker(false);

    fireParticles([emojiStr]);

    let updatedReactions = reactions;
    if (myReaction) {
      updatedReactions = reactions.filter(r => r.documentId !== myReaction.documentId);
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticReaction = {
      documentId: tempId,
      emoji: emojiStr,
      user: { id: userId }
    };
    setReactions([...updatedReactions, optimisticReaction]);

    try {
      if (myReaction) {
        await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/reactions/${myReaction.documentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/reactions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            emoji: emojiStr,
            story: storyId,
            user: userId
          }
        })
      });

      if (res.ok) {
        const newData = await res.json();

        const finalReaction = {
          ...newData.data,
          user: { id: userId }
        };

        setReactions(prev => prev.map(r => r.documentId === tempId ? finalReaction : r));
      }
    } catch (error) {
      console.error(error);
      setReactions(reactions);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {flameParticles.length > 0 && (
        <div className={styles.particleContainer}>
          {flameParticles.map(p => (
            <span
              key={p.id}
              className={styles.flameParticle}
              style={{
                '--spread-x': p.spreadX,
                '--end-y': p.endY,
                '--duration': p.duration,
                '--delay': p.delay,
                '--rot': p.rot
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {isBarOpen && (
        <div className={styles.floatingBar}>
          {topEmojis().map((item) => (
            <div
              key={item.emoji}
              className={styles.emojiItem}
              onClick={() => handleSelectEmoji(item.emoji)}
            >
              <span className={styles.emojiCount}>{item.count}</span>
              <span className={styles.emojiChar}>{item.emoji}</span>
            </div>
          ))}
          <button
            className={styles.addEmojiButton}
            onClick={() => setShowPicker(!showPicker)}
          >
            <PlusCircleFilledIcon />
          </button>
        </div>
      )}

      {showPicker && (
        <div className={styles.pickerContainer}>
          <EmojiPicker
            onEmojiClick={(emojiData) => handleSelectEmoji(emojiData.emoji)}
            theme="dark"
            width={300}
            height={400}
            searchDisabled={true}
          />
        </div>
      )}

      <button
        className="iconbutton dark"
        onClick={handleMainClick}
        style={{ fontSize: myReaction ? '1.5rem' : 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {myReaction ? myReaction.emoji : <ReactionFilledIcon />}
      </button>
    </div>
  );
}