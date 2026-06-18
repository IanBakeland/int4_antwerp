import { Link } from 'react-router-dom';
import styles from './SmartButton.module.css';

export default function SmartButton({ children, to, onClick, type = 'button', icon }) {
  if (to) {
    return (
      <Link to={to} className={styles.button}>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
}