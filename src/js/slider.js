const slides = [
  {
    title: 'Краски',
    description: 'Идеально подходят для стен и других поверхностей. Найди свой идеальный цвет!',
  },
  {
    title: 'Слайд 2',
    description: 'Описание для второго слайда.',
  },
  {
    title: 'Слайд 3',
    description: 'Описание для третьего слайда.',
  },
];

let currentSlide = 0;

const createSlide = (slide) => {
  const slideElement = document.createElement('div');
  slideElement.classList.add('slider__slide');
  slideElement.innerHTML = `
    <h2 class="slider__title">${slide.title}</h2>
    <p class="slider__description">${slide.description}</p>
  `;
  return slideElement;
};

const createNavButton = (index) => {
  const navButton = document.createElement('button');
  navButton.classList.add('slider__nav-button');
  if (index === 0) {
    navButton.classList.add('slider__nav-button--active');
  }
  navButton.setAttribute('aria-label', `Слайд ${index + 1}`);
  navButton.addEventListener('click', () => goToSlide(index));
  return navButton;
};

const renderSlides = () => {
  const sliderInner = document.querySelector('.slider__inner');
  sliderInner.innerHTML = '';
  sliderInner.appendChild(createSlide(slides[currentSlide]));
};

const renderNavButtons = () => {
  const navList = document.querySelector('.slider__nav-list');
  navList.innerHTML = '';
  slides.forEach((_, index) => {
    navList.appendChild(createNavButton(index));
  });
};

const updateNavButtons = () => {
  const navButtons = document.querySelectorAll('.slider__nav-button');
  navButtons.forEach((button, index) => {
    button.classList.toggle('slider__nav-button--active', index === currentSlide);
  });
};

const goToSlide = (index) => {
  currentSlide = index;
  renderSlides();
  updateNavButtons();
};

const nextSlide = () => {
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlides();
  updateNavButtons();
};

const prevSlide = () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  renderSlides();
  updateNavButtons();
};

export const initSlider = () => {
  renderSlides();
  renderNavButtons();
  document.querySelector('.slider__control--next').addEventListener('click', nextSlide);
  document.querySelector('.slider__control--prev').addEventListener('click', prevSlide);
};
