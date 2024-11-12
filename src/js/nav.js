export const initNav = () => {
  const nav = document.querySelector('.nav');
  const openNavButton = document.querySelector('.header__nav-button');
  const closeNavButton = document.querySelector('.nav__close-button');
  
  openNavButton.addEventListener('click', () => {
    nav.classList.add('nav--open');
    document.body.classList.add('no-scroll');
  });
  
  closeNavButton.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    document.body.classList.remove('no-scroll');
  });
};
