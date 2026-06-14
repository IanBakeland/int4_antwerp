import { useState, useEffect, useRef } from 'react';

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
        <div className="filters">
            <button className={`filterButton flexCenter ${activeFilters.length === 0 ? 'active' : ''}`}
            onClick={() => {
                setActiveFilters([]);
                setIsDropdownOpen(false);
            }}>
            <PersonIcon />All</button> 

            <button className={`filterButton flexCenter ${activeFilters.includes('Favourites') ? 'active' : ''}`} onClick={() => handleFilterClick('Favourites')}><PersonIcon />Favourites</button>

                <button className={`filterButton flexCenter dropdown-trigger ${activeFilters.some(filter => filter !== 'Favourites') ? 'active' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}><PersonIcon />Categories</button>
                
        </div>
        <button className="iconbuttonSmall"><PersonIcon /></button>
        {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button className={`filterButton ${activeFilters.includes('Action') ? 'limeTag' : ''}`} onClick={() => handleFilterClick('Action')}><PersonIcon />Action</button>
                    <button className={`filterButton ${activeFilters.includes('Culture') ? 'orangeTag' : ''}`} onClick={() => handleFilterClick('Culture')}><PersonIcon />Culture</button>
                    <button className={`filterButton ${activeFilters.includes('Business') ? 'blueTag' : ''}`} onClick={() => handleFilterClick('Business')}><PersonIcon />Business</button>
                    <button className={`filterButton ${activeFilters.includes('Romantic') ? 'pinkTag' : ''}`} onClick={() => handleFilterClick('Romantic')}><PersonIcon />Romantic</button>
                    <button className={`filterButton ${activeFilters.includes('Social') ? 'greenTag' : ''}`} onClick={() => handleFilterClick('Social')}><PersonIcon />Social</button>
                </div>
                )}
    </>
  );
}