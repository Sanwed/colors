import {sortItems} from './sort';
import {filterItems} from './filter';
import {updateCart} from './cart';

const FETCH_URL = 'https://6730890766e42ceaf16092ab.mockapi.io';

const productsList = document.querySelector('.products__list');
const productsCount = document.querySelector('.products__count');

export let currentSortingMethod = 1;
const setMethod = (newMethod) => {
  currentSortingMethod = newMethod;
};

const applyLastRowStyles = () => {
  const productsItems = productsList.querySelectorAll('.products__item');
  const columns = getComputedStyle(productsList).gridTemplateColumns.split(' ').length;
  const totalItems = productsItems.length;
  const lastRowStartIndex = totalItems - (totalItems % columns || columns);
  
  productsItems.forEach((item, index) => {
    if (index >= lastRowStartIndex) {
      item.classList.add('products__item--last');
    }
  });
};

const createProduct = (product) => {
  const productItem = document.createElement('li');
  productItem.dataset.productId = product.id;
  productItem.classList.add('products__item');
  productsList.appendChild(productItem);
  
  const productImage = document.createElement('div');
  productImage.classList.add('products__image');
  productItem.appendChild(productImage);
  
  const image = new Image();
  image.src = product.preview;
  image.alt = product.title;
  image.loading = 'lazy';
  productImage.appendChild(image);
  
  const title = document.createElement('h2');
  title.classList.add('products__title');
  title.textContent = product.title;
  productItem.appendChild(title);
  
  const priceWrapper = document.createElement('div');
  priceWrapper.classList.add('products__price-wrapper');
  productItem.appendChild(priceWrapper);
  
  const price = document.createElement('span');
  price.classList.add('products__price');
  price.textContent = `${Math.round(product.price)} ₽`;
  priceWrapper.appendChild(price);
  
  const button = document.createElement('button');
  button.classList.add('products__buy-button');
  button.setAttribute('aria-label', 'Добавить в корзину');
  button.addEventListener('click', updateCart);
  priceWrapper.appendChild(button);
};

const fetchProducts = async (method = 1) => {
  const response = await fetch(`${FETCH_URL}/products`);
  const products = await response.json();
  sortItems(products, method);
  const filteredProducts = filterItems(products);
  filteredProducts.forEach((product) => {
    createProduct(product);
  });
  productsCount.textContent = `${filteredProducts.length} товаров`;
  applyLastRowStyles();
};

export const refreshItems = async (method) => {
  productsList.innerHTML = '';
  setMethod(method);
  await fetchProducts(currentSortingMethod);
};

export const initProducts = () => {
  applyLastRowStyles();
  fetchProducts().then(() => {
    console.log('Products loaded');
  });
};
