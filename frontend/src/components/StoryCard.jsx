export default function StoryCard({ title, category, username, image }) {
  const highQualityImage = image?.formats?.large?.url || image?.formats?.medium?.url || image?.url;

  return (
    <div className="storyCard">
      {highQualityImage && (
        <img 
          src={highQualityImage} 
          alt={title} 
        />
      )}
      <div className="storyInfo">
        <h3>{title}</h3>
        <p>{category}</p>
        {username && <p className="storyAuthor">By {username}</p>}
      </div>
    </div>
  );
}