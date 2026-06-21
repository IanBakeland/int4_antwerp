import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loading from '../components/Loading';
import styles from './Story.module.css';

export default function Story({ setToken }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const storyId = searchParams.get("id");
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        if (storyId) {
          // Fetch specific story by ID
          const res = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/stories?filters[documentId][$eq]=${storyId}&populate[0]=panorama&populate[1]=user`);
          if (!res.ok) throw new Error("Failed to fetch story");
          const data = await res.json();
          
          if (data.data && data.data.length > 0) {
            setStory(data.data[0]);
          } else {
            console.error("Story not found");
            setStory(null);
          }
        } else {
          // Fetch all stories to p3ick a random one
          const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/stories?populate[0]=panorama&populate[1]=user");
          if (!res.ok) throw new Error("Failed to fetch stories");
          const data = await res.json();
          
          if (data.data && data.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const randomStory = data.data[randomIndex];
            setStory(randomStory);
            setSearchParams({ id: randomStory.documentId }, { replace: true });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId, setSearchParams]);

  return (
    <div className={styles.storyContainer}>
      <div style={{ paddingTop: "1rem" }} className="noDesktop noTablet"></div>

      <div className="toolbar noDesktop noTablet">
        <div>
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loading message="Loading your story" />
      ) : story ? (
        <div className={styles.fullScreenLayout}>
          <h1>{story.title}</h1>
          <p>By {story.user?.username}</p>
        </div>
      ) : (
        <div className={styles.errorState}>
          <h2>Story not found.</h2>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
      )}
    </div>
  );
}