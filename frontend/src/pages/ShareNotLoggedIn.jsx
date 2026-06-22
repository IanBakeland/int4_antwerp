import { Link } from 'react-router-dom';
import styles from "./ShareNotLoggedIn.module.css";
import antwerpLogo from "../assets/images/antwerpLogo.png";
import PersonIcon from "../assets/icons/Person";

export default function ShareNotLoggedIn() {
  return (
    <>
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles['auth__mobile-logo-image']} />
          <Link to="/account" className="iconbutton" aria-label="Account"><PersonIcon /></Link>
        </div>
      </div>
      <div className={styles.auth__background}></div>
      <div className={styles['auth__image-mobile-container']}></div>
      <div className={styles.auth}>
        <div className={styles.auth__content}>
          <div className={styles.auth__card}>
            <h1>Oops...</h1>
            <p className={styles.auth__subtitle}>You are not logged in</p>
            <p className={styles.auth__message}>
              You must be logged in to share your story.
            </p>
            <Link to="/login">
              <button className={styles['auth__login-button']}>
                Log in <span className={styles['auth__button-arrow']}>→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
