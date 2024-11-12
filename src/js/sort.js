import {refreshItems} from './products';

const sortMethods = [
  {id: 1, name: 'Сначала дорогие'},
  {id: 2, name: 'Сначала недорогие'},
  {id: 3, name: 'Сначала популярные'},
  {id: 4, name: 'Сначала новые'},
];

const sort = document.querySelector('.products__sort');
const sortOpenButton = document.querySelector('.products__open-sort-button');
const overlay = document.querySelector('.overlay');
const sortList = document.querySelector('.products__sort-list');

export const sortItems = (items, method) => {
  switch (method) {
    case 1:
      return items.sort((a, b) => b.price - a.price);
    case 2:
      return items.sort((a, b) => a.price - b.price);
    case 3:
      return items.sort((a, b) => b.sells - a.sells);
    case 4:
      return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    default:
      return items;
  }
}

const createSortButton = (method, isActive) => {
  const sortButton = document.createElement('button');
  sortButton.classList.add('products__sort-button');
  if (isActive) {
    sortButton.classList.add('products__sort-button--active');
  }
  sortButton.dataset.sortId = method.id;
  sortButton.textContent = method.name;
  sortButton.addEventListener('click', onSortButtonClick);
  return sortButton;
};

const onSortButtonClick = (evt) => {
  const btnText = document.querySelector('.products__open-sort-button-text');
  btnText.textContent = evt.target.textContent;
  closeSort();
  refreshItems(Number(evt.target.dataset.sortId));
};

const createSortButtons = (id) => {
  const buttons = sortMethods.map((method) => createSortButton(method, method.id === id));
  const activeBtnIndex = buttons.findIndex((btn) => btn.classList.contains('products__sort-button--active'));
  const activeBtn = buttons.splice(activeBtnIndex, 1)[0];
  buttons.unshift(activeBtn);
  buttons.forEach((btn) => sortList.appendChild(btn));
};

const removeSortButtons = () => {
  while (sortList.firstChild) {
    sortList.removeChild(sortList.firstChild);
  }
};

const openSort = () => {
  const task = sortMethods.find((method) => method.name === sortOpenButton.textContent);
  createSortButtons(task.id);
  sort.classList.add('products__sort--open');
  overlay.classList.add('overlay--open');
  document.body.classList.add('no-scroll');
  setTimeout(() => document.addEventListener('click', closeOnClick), 0);
};

const closeSort = () => {
  sort.classList.remove('products__sort--open');
  overlay.classList.remove('overlay--open');
  document.removeEventListener('click', closeOnClick);
  document.body.classList.remove('no-scroll');
  removeSortButtons();
  
};

const closeOnClick = (evt) => {
  if (evt.target.closest('.overlay')) {
    closeSort();
  }
};

export const initSort = () => {
  sortOpenButton.addEventListener('click', openSort);
};
