import {currentSortingMethod, refreshItems} from './products';

const filterOpenButton = document.querySelector('.products__filter-button');
const filter = document.querySelector('.products__filter');
const overlay = document.querySelector('.overlay');
const moveZone = document.querySelector('.products__move-zone');

export const filterItems = (products) => {
  const activeCheckboxes = document.querySelectorAll('.products__filter-checkbox:checked');
  
  if (activeCheckboxes.length === 0) {
    return products;
  }
  
  return products.filter((product) => {
    return Array.from(activeCheckboxes).every((checkbox) => {
      return product[checkbox.name];
    });
  });
};

const onCheckboxChange = () => {
  refreshItems(currentSortingMethod);
};

const onResize = () => {
  const checkboxes = document.querySelectorAll('.products__filter-checkbox');
  if (window.matchMedia('(min-width: 1200px)').matches) {
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', onCheckboxChange);
    });
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.removeEventListener('change', onCheckboxChange);
    });
  }
};

export const initFilter = () => {
  let startY;
  let currentY;
  let initialBottom;
  
  const openFilter = () => {
    filter.classList.add('products__filter--open');
    document.body.classList.add('no-scroll');
    overlay.classList.add('overlay--open');
    initialBottom = 0;
  };
  
  const closeFilter = () => {
    filter.classList.remove('products__filter--open');
    overlay.classList.remove('overlay--open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('click', closeOnClick);
    refreshItems(currentSortingMethod);
  };
  
  const closeOnClick = (evt) => {
    if (evt.target.closest('.overlay')) {
      closeFilter();
    }
  };
  
  filterOpenButton.addEventListener('click', () => {
    openFilter();
    
    setTimeout(() => {
      document.addEventListener('click', closeOnClick);
    }, 0);
  });
  
  moveZone.addEventListener('touchstart', (evt) => {
    startY = evt.touches[0].clientY;
    initialBottom = parseInt(window.getComputedStyle(filter).bottom, 10);
  });
  
  moveZone.addEventListener('touchmove', (evt) => {
    currentY = evt.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY < 0) {
      return;
    }
    filter.style.bottom = `${initialBottom - deltaY}px`;
  });
  
  moveZone.addEventListener('touchend', () => {
    const deltaY = currentY - startY;
    if (deltaY > 50) {
      closeFilter();
      filter.style = '';
    } else {
      filter.style.bottom = '0';
    }
  });
  
  onResize();
  window.addEventListener('resize', onResize);
};
