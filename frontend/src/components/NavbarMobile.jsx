import { NavLink } from 'react-router-dom';
import styles from './NavbarMobile.module.css';

//icons
import HomeIcon from '../assets/icons/Home';
import HomeFilledIcon from '../assets/icons/HomeFilled';
import RadarIcon from '../assets/icons/Radar';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PlusCircleIcon from '../assets/icons/PlusCircle';
import PlusCircleFilledIcon from '../assets/icons/PlusCircleFilled';

export default function NavbarMobile() {
  return (
    <>
        <NavLink to="/" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
            {({ isActive }) => (
                <>
                    <div className={styles.iconContainer}>
                        <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                            <HomeIcon />
                        </div>
                        <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                            <HomeFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? styles.active : ''}>Home</p>
                </>
            )}
        </NavLink>
        <NavLink to="/radar" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
            {({ isActive }) => (
                <>
                    <div className={styles.iconContainer}>
                        <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                            <RadarIcon />
                        </div>
                        <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                            <RadarIcon />
                        </div>
                    </div>
                    <p className={isActive ? styles.active : ''}>Radar</p>
                </>
            )}
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
            {({ isActive }) => (
                <>
                    <div className={styles.iconContainer}>
                        <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                            <HeartIcon />
                        </div>
                        <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                            <HeartFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? styles.active : ''}>Favourites</p>
                </>
            )}
        </NavLink>
        <NavLink to="/share" className={({ isActive }) => `${styles.tab} flexCenter alignUnder ${isActive ? styles.active : ''}`}>
            {({ isActive }) => (
                <>
                    <div className={styles.iconContainer}>
                        <div className={`${styles.fadeIcon} ${isActive ? styles.iconHidden : styles.iconVisible}`}>
                            <PlusCircleIcon />
                        </div>
                        <div className={`${styles.active} ${styles.fadeIcon} ${isActive ? styles.iconVisible : styles.iconHidden}`}>
                            <PlusCircleFilledIcon />
                        </div>
                    </div>
                    <p className={isActive ? styles.active : ''}>Share</p>
                </>
            )}
        </NavLink>
    </>
  );
}