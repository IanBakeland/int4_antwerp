import { Link } from 'react-router-dom';
import styles from "./FavouritesNotLoggedIn.module.css";
import antwerpLogo from "../assets/images/antwerpLogo.png";
import PersonFilledIcon from "../assets/icons/PersonFilled";

export default function FavouritesNotLoggedIn() {
  return (
    <>
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles['auth__mobile-logo-image']} />
          <Link to="/account" className={`${styles['auth__active-icon-button']} iconbutton`} aria-label="Account"><PersonFilledIcon /></Link>
        </div>
      </div>
      <div className={styles.auth__background}></div>
      <div className={styles.auth}>
        <div className={styles.auth__content}>
          <div className={styles.auth__card}>
            <h1>Oops...</h1>
            <p className={styles.auth__subtitle}>Log in to see your favourites</p>
            <p className={styles.auth__message}>
              To view your favourite stories and moments, you must first log in.
            </p>
            <Link to="/login">
              <button className={styles['auth__login-button']}>Log in now</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
