import './scss/main.scss';
import {initNav} from './js/nav';
import {initFilter} from './js/filter';
import {initSort} from './js/sort';
import {initProducts} from './js/products';
import {initCart} from './js/cart';
import {initSlider} from './js/slider';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSlider();
  initProducts();
  initFilter();
  initSort();
  initCart();
});
