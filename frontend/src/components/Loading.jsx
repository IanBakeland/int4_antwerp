import styles from './Loading.module.css';

export default function Loading({ message = '' }) {
  return (
    <div className={`${styles.loading} flexCenter alignUnder`}>
      <svg className={styles.spinner} viewBox="0 0 50 50">
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      {message && <p>{message}</p>}
    </div>
  );
}