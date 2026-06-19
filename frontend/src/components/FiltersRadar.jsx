import { useState } from 'react';
import styles from './FiltersRadar.module.css';

//icons
import PersonIcon from '../assets/icons/Person';
import PersonFilledIcon from '../assets/icons/PersonFilled';
import MagnifierIcon from '../assets/icons/Magnifier';
import FilterIcon from '../assets/icons/Filter';
import HeartIcon from '../assets/icons/Heart';
import HeartFilledIcon from '../assets/icons/HeartFilled';
import PersonRunningIcon from '../assets/icons/PersonRunning';
import MonumentIcon from '../assets/icons/Monument';
import FolderIcon from '../assets/icons/Folder';
import PersonDoubleIcon from '../assets/icons/PersonDouble';
import CircleGridIcon from '../assets/icons/CircleGrid';
import CircleGridFilledIcon from '../assets/icons/CircleGridFilled';

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
                <button 
                  className={`${styles.filterButton} flexCenter ${styles.expand1} ${activeFilters.length === 0 ? styles.filterActive : ''}`}
                  onClick={() => {
                      setActiveFilters([]);
                      setIsDropdownOpen(false);
                  }}
                  aria-pressed={activeFilters.length === 0}
                >
                  {activeFilters.length === 0 ? <CircleGridFilledIcon /> : <CircleGridIcon />}All
                </button>
                <button 
                  className={`${styles.filterButton} flexCenter ${styles.expand2} ${activeFilters.includes('Favourites') ? styles.filterActive : ''}`} 
                  onClick={() => handleFilterClick('Favourites')}
                  aria-pressed={activeFilters.includes('Favourites')}
                >
                  {activeFilters.includes('Favourites') ? <HeartFilledIcon /> : <HeartIcon />}Favourites
                </button>
                <button 
                  className={`${styles.filterButton} flexCenter dropdown-trigger ${styles.expand2} ${activeFilters.some(filter => filter !== 'Favourites') ? styles.filterActive : ''}`} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                >
                  <FilterIcon />Categories
                </button>
            </div>
            <button className="iconbuttonSmall" aria-label="Search"><MagnifierIcon /></button>
        </div>
        {isDropdownOpen && (
        <div className={`${styles.filters} ${styles.filterMargin}`} role="menu" aria-label="Categories">
            <button className={`${styles.filterButton} ${activeFilters.includes('Action') ? styles.limeTag : ''}`} onClick={() => handleFilterClick('Action')} aria-pressed={activeFilters.includes('Action')} role="menuitemcheckbox"><PersonRunningIcon />Action</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Culture') ? styles.orangeTag : ''}`} onClick={() => handleFilterClick('Culture')} aria-pressed={activeFilters.includes('Culture')} role="menuitemcheckbox"><MonumentIcon />Culture</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Business') ? styles.blueTag : ''}`} onClick={() => handleFilterClick('Business')} aria-pressed={activeFilters.includes('Business')} role="menuitemcheckbox"><FolderIcon />Business</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Romantic') ? styles.pinkTag : ''}`} onClick={() => handleFilterClick('Romantic')} aria-pressed={activeFilters.includes('Romantic')} role="menuitemcheckbox"><HeartIcon />Romantic</button>
            <button className={`${styles.filterButton} ${activeFilters.includes('Social') ? styles.greenTag : ''}`} onClick={() => handleFilterClick('Social')} aria-pressed={activeFilters.includes('Social')} role="menuitemcheckbox"><PersonDoubleIcon />Social</button>
        </div>
        )}
    </>
  );
}
