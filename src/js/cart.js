const cart = document.querySelector('.cart');
const cartList = document.querySelector('.cart__list');
const openCartButton = document.querySelector('.header__user-link--cart');
const closeCartButton = document.querySelector('.cart__close-button');
const overlay = document.querySelector('.overlay');
const cartCount = document.querySelector('.cart__count');
const cartClearButton = document.querySelector('.cart__clear-button');
const commonPrice = document.querySelector('.cart__common-price-value');

const cartItems = [];

const createItem = (product) => {
  const li = document.createElement('li');
  li.dataset.cartId = product.id;
  li.classList.add('cart__item');
  
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cart__image');
  const img = document.createElement('img');
  img.src = product.image;
  img.width = 96;
  img.height = 96;
  imageDiv.appendChild(img);
  
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cart__description');
  const title = document.createElement('h3');
  title.classList.add('cart__title');
  title.textContent = product.title;
  const price = document.createElement('p');
  price.classList.add('cart__price');
  price.textContent = `${product.price} ₽`;
  descriptionDiv.appendChild(title);
  descriptionDiv.appendChild(price);
  
  const addProductWrapper = document.createElement('div');
  addProductWrapper.classList.add('cart__add-product-wrapper');
  const removeButton = document.createElement('button');
  removeButton.classList.add('cart__product-button', 'cart__product-button--remove');
  removeButton.setAttribute('aria-label', 'Добавить 1 товар');
  removeButton.addEventListener('click', decreaseCount);
  const productCount = document.createElement('span');
  productCount.classList.add('cart__product-count');
  productCount.textContent = product.count;
  const addButton = document.createElement('button');
  addButton.classList.add('cart__product-button', 'cart__product-button--add');
  addButton.setAttribute('aria-label', 'Убрать 1 товар');
  addButton.addEventListener('click', increaseCount);
  addProductWrapper.appendChild(removeButton);
  addProductWrapper.appendChild(productCount);
  addProductWrapper.appendChild(addButton);
  
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart__delete-button');
  deleteButton.setAttribute('aria-label', 'Удалить товар из корзины');
  deleteButton.addEventListener('click', removeItem);
  
  li.appendChild(imageDiv);
  li.appendChild(descriptionDiv);
  li.appendChild(addProductWrapper);
  li.appendChild(deleteButton);
  
  cartList.appendChild(li);
};

const updatePrice = () => {
  const price = cartItems.reduce((acc, product) => acc + product.price * product.count, 0);
  commonPrice.textContent = `${price} ₽`;
};

const removeItem = (evt) => {
  const cartItem = evt.target.closest('.cart__item');
  const id = cartItem.dataset.cartId;
  const existingItem = cartItems.find((product) => product.id === id);
  const index = cartItems.indexOf(existingItem);
  cartItems.splice(index, 1);
  renderCart();
};

const removeAll = () => {
  cartItems.length = 0;
  renderCart();
};

const updateCartCount = () => {
  let count = cartItems.reduce((acc, product) => acc + product.count, 0);
  cartCount.textContent = `${count} товаров`;
  openCartButton.textContent = count;
};

const renderCart = () => {
  cartList.innerHTML = '';
  
  if (cartItems.length === 0) {
    const span = document.createElement('span');
    span.textContent = 'Корзина пуста';
    cartList.appendChild(span);
  }
  
  cartItems.forEach((product) => {
    createItem(product);
  });
  
  updateCartCount();
  updatePrice();
};

function decreaseCount(evt) {
  const cartItem = evt.target.closest('.cart__item');
  const id = cartItem.dataset.cartId;
  const existingItem = cartItems.find((product) => product.id === id);
  if (existingItem.count > 1) {
    existingItem.count--;
    renderCart();
  }
}

function increaseCount(evt) {
  const cartItem = evt.target.closest('.cart__item');
  const id = cartItem.dataset.cartId;
  const existingItem = cartItems.find((product) => product.id === id);
  existingItem.count++;
  renderCart();
}

export const updateCart = (evt) => {
  const item = evt.target.closest('.products__item');
  const id = item.dataset.productId;
  const title = item.querySelector('.products__title').textContent;
  const price = item.querySelector('.products__price').textContent.split(' ')[0];
  const image = item.querySelector('.products__image img').src;
  
  const existingItem = cartItems.find((product) => product.id === id);
  
  updatePrice();
  
  if (existingItem) {
    existingItem.count++;
    updateCartCount();
    return;
  }
  
  cartItems.unshift({
    id,
    title,
    price,
    image,
    count: 1,
  });
  updateCartCount();
};

export const initCart = () => {
  const openCart = () => {
    cart.classList.add('cart--open');
    document.body.classList.add('no-scroll');
    overlay.classList.add('overlay--open');
    
    renderCart();
  };
  
  const closeCart = () => {
    cart.classList.remove('cart--open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('click', closeOnClick);
    overlay.classList.remove('overlay--open');
  };
  
  const closeOnClick = (evt) => {
    if (evt.target.closest('.overlay')) {
      closeCart();
    }
  };
  
  openCartButton.addEventListener('click', () => {
    openCart();
    setTimeout(() => {
      document.addEventListener('click', closeOnClick);
    }, 0);
  });
  closeCartButton.addEventListener('click', closeCart);
  cartClearButton.addEventListener('click', removeAll);
  
  updateCartCount();
};
