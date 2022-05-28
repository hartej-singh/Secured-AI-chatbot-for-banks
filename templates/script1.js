'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});
///////////////////////////////////////

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // Method 1 * old way
  /*
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
  // Method 2
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////

// Page navigation
/*
document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const id = el.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// IMPORTANT Pattern
// 1. Add event listener to common parent element
// 2. Determine which element orignates the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////

// Tabbed components

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Clear --active classes for btn and content
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(tabContent => {
    tabContent.classList.remove('operations__content--active');
  });

  // Add --active class to btn
  clicked.classList.toggle('operations__tab--active');

  // Matching target content and add --active class
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.toggle('operations__content--active');
});
///////////////////////////////////////

// Menu fade animation
// nav.addEventListener('click', function (e) {
//   console.log(this === e.currentTarget); //IMPORTANT true
// });
const handleHover = function (e) {
  const link = e.target;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');

  siblings.forEach(sibling => {
    if (sibling !== link) sibling.style.opacity = this;
  });
  logo.style.opacity = this;
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1.0));

// const handleHover = function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = this;
//     });
//     logo.style.opacity = this;
//   }
// };

// Passing "argument" into handler
// nav.addEventListener('mouseover', handleHover.bind(0.5));
// nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////

// Sticky navigation
/*
// 'scroll' event is not a good performance
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords.top);
console.log(window.scrollY);
window.addEventListener('scroll', function () {
  if (this.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/
/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const obsOptions = {
  // root: viewport
  root: null,
  threshold: 0,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  if (entry.isIntersecting) nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
///////////////////////////////////////

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
// FIXME remove /* */
/*
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
*/
///////////////////////////////////////

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => {
  imgObserver.observe(img);
});
///////////////////////////////////////

// Build a slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length;
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;

  const createDots = function () {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.classList.add('dots__dot');
      btn.setAttribute('data-slide', i);
      dotsContainer.appendChild(btn);
    });
  };
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      if (+dot.dataset.slide === slide) dot.classList.add('dots__dot--active');
    });
  };
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    activateDot(slide);
  };
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  // Initial
  goToSlide(0);
  createDots();
  activateDot(0);

  // Hanlde left/right buttons
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Hanlde left/right arrow keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Handle dots
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(+slide);
    }
  });
};
slider();

///////////////////////////////////////
/*
// NOTE 1. Selecting, Creating/Inserting, Deleting elements
// 1.1 Selecting elements
// (1) querySelector
const sections = document.querySelectorAll('.section');
// (2) document.getElement(s)
// document.getElementById
// const btns = document.getElementsByTagName('button');
const btns = document.getElementsByClassName('btn');
// console.log(btns);

// 1.2 Creating and inserting elements
// (1) prepend; append *insert element as CHILD
const message = document.createElement('div');
const header = document.querySelector('.header');
message.innerHTML =
  "<p>I enjoy <strong>cooking</strong></p> <btn class='btn btn--close-cookie'>Close</btn>";
message.classList.add('cookie-message');
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// (2) before; after *insert element as SIBLING
// header.before(message);
// header.after(message);
// header.insertAdjacentElement('afterbegin', message);

// 1.3 Deleting elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  // message.parentElement.removeChild(message); // old way
  message.remove(); // remove method is new
});
*/
///////////////////////////////////////
/*
// NOTE 2. Styles, Attributes and Classes
// 2.1 Styles
const btnCloseCookie = message.querySelector('.btn');
btnCloseCookie.style.color = 'black';
message.style.backgroundColor = 'black';
message.style.width = '100vw';
// console.log(message.style);
// IMPORTANT getComputedStyle
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 10 + 'px';
console.log(getComputedStyle(message).height);
// IMPORTANT setProperty
// console.log(document.documentElement === document.querySelector(':root'));// -> true
// document.documentElement.style.setProperty('--color-primary', 'orangered');
// message.style.setProperty('background-color', 'white');

// 2.2 Attributes
// (1) Get attr

const logo = document.querySelector('.nav__logo');
console.log(logo.src); // -> absolute URL
console.log(logo.getAttribute('src')); // -> relative URL
console.log(logo.alt);
console.log(logo.className);

// Non-standard attr
// console.log(logo.designer); // -> undefined
console.log(logo.getAttribute('designer'));

// (2) Set attr
logo.setAttribute('alt', 'Bankist logo here');

// (3) ABSOLUTE vs. RELATIVE url
const links = document.querySelectorAll('.nav__link');
console.log(links[0]);
console.log(links[0].href);
console.log(links[0].getAttribute('href'));

// (4) IMPORTANT Data attr.
console.log(logo.dataset.versionNumber);

// 2.3 Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');
logo.classList.replace('c', 'd');

// IMPORTANT DON'T use below:
// logo.className = 'jonas'
*/
///////////////////////////////////////

// NOTE 3. Types of Events and Event Handlers
// Method 1 *Old way
// h1.onmouseenter = function () {
//   alert('You entered h1!');
// };

// Method 2
// Patterns: Event only happens one time
const h1 = document.querySelector('h1');
const h1Alert = function () {
  alert('You entered h1!');
  h1.removeEventListener('mouseenter', h1Alert);
};
// h1.addEventListener('mouseenter', h1Alert);

///////////////////////////////////////

// NOTE 4. DOM Traversing
/*
const highlights = h1.querySelectorAll('.highlight');
// 4.1 Going downwards: child
console.log(highlights);
console.log(h1.childNodes);
console.log(h1.children); // live HTMLCollection
h1.firstElementChild.style.color = 'white';

// 4.2 Going upwards: parent
console.log(h1.parentNode);
console.log(h1.parentElement);
// Think of closest() as the opposite of querySelector
h1.closest('header').style.background = 'var(--gradient-secondary)';
console.log(h1.closest('h1')); // -> <h1>...</h1>
h1.closest('h1').style.background = 'var(--gradient-primary)';

// 4.3 Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
*/
///////////////////////////////////////
