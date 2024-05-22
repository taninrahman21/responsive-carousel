const wrapper = document.querySelector(".carousel-container");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".carousel-card").offsetWidth;
let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

const getCardPerView = () => Math.round(carousel.offsetWidth / firstCardWidth);

const updateActiveItem = () => {
  const middleIndex = Math.floor((carousel.scrollLeft + carousel.offsetWidth / 2) / firstCardWidth);
  [...carousel.children].forEach((card, index) => {
    card.classList.remove('active', 'left-side', 'right-side');
    if (index === middleIndex) card.classList.add('active');
    else if (index < middleIndex) card.classList.add('left-side');
    else card.classList.add('right-side');
  });
};

const insertClones = () => {
  const cardPerView = getCardPerView();
  const children = [...carousel.children];
  children.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });
  children.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });
};

const initializeCarousel = () => {
  insertClones();
  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");
  updateActiveItem();
  autoPlay();
};

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX || e.touches[0].clientX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  const x = e.pageX || e.touches[0].clientX;
  const walk = x - startX;
  carousel.scrollLeft = startScrollLeft - walk;
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
    carousel.classList.remove("no-transition");
  } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  updateActiveItem();
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth > 800 || !isAutoPlay) return;
  timeoutId = setTimeout(() => {
    carousel.scrollLeft += firstCardWidth;
  }, 2500);
};


carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);
carousel.addEventListener("touchend", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
carousel.addEventListener("touchstart", (e) => e.preventDefault());
carousel.addEventListener("touchmove", (e) => e.preventDefault());

initializeCarousel();