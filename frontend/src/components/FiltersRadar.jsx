import { useState } from 'react';
import styles from './FiltersRadar.module.css';

//icons
import PersonIcon from '../assets/icons/Person';

export default function FiltersRadar() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // The toggle logic for adding/removing filters
  const handleFilterClick = (filterValue) => {
    if (activeFilters.includes(filterValue)) {
      setActiveFilters(activeFilters.filter(item => item !== filterValue));
    } else {
      setActiveFilters([...activeFilters, filterValue]);
    }
  };

  return (
    <>
        <div className={`alignNext ${styles.filterBar}`}>
            <div className={styles.filters}>
                <button className={`${styles.filterButton} flexCenter ${styles.expand1} ${activeFilters.length === 0 ? styles.filterActive : ''}`}
                onClick={() => {
                    setActiveFilters([]);
                    setIsDropdownOpen(false);
                }}>
                <PersonIcon />All</button> 
                <button className={`${styles.filterButton} flexCenter ${styles.expand2} ${activeFilters.includes('Favourites') ? styles.filterActive : ''}`} onClick={() => handleFilterClick('Favourites')}><PersonIcon />Favourites</button>
                <button className={`${styles.filterButton} flexCenter dropdown-trigger ${styles.expand2} ${activeFilters.some(filter => filter !== 'Favourites') ? styles.filterActive : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}><PersonIcon />Categories</button>
            </div>
            <button className={styles.iconbuttonSmall}><PersonIcon /></button>
        </div>
        {isDropdownOpen && (
        <div className={`${styles.filters} ${styles.filterMargin}`}>
            <button className={`${styles.filterButton} ${activeFilters.includes('Action') ? styles.limeTag : ''}`} onClick={() => handleFilterClick('Action')}><PersonIcon />Action</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Culture') ? styles.orangeTag : ''}`} onClick={() => handleFilterClick('Culture')}><PersonIcon />Culture</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Business') ? styles.blueTag : ''}`} onClick={() => handleFilterClick('Business')}><PersonIcon />Business</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Romantic') ? styles.pinkTag : ''}`} onClick={() => handleFilterClick('Romantic')}><PersonIcon />Romantic</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Social') ? styles.greenTag : ''}`} onClick={() => handleFilterClick('Social')}><PersonIcon />Social</button>
        </div>
        )}
    </>
  );
}
