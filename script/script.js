const wrapper = document.querySelector(".carousel-container");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".carousel-card").offsetWidth;
let carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;


// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);



const updateActiveItem = () => {
  const middleIndex = Math.floor((carousel.scrollLeft + carousel.offsetWidth / 2) / firstCardWidth);
  carouselChildrens.forEach((card, index) => {
    card.classList.remove('active', 'left-side', 'right-side');
    if (index === middleIndex) {
      card.classList.add('active');
    } else if (index < middleIndex) {
      card.classList.add('left-side');
    } else {
      card.classList.add('right-side');
    }
  });
};


// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
  carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});


// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Update the reference to the children after adding duplicates
carouselChildrens = [...carousel.children];

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");


// Call updateActiveItem initially to set up the active and side classes
updateActiveItem();



const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  // startX = e.pageX;
  startX = e.pageX || e.touches[0].clientX;
  startScrollLeft = carousel.scrollLeft;
  console.log("Drag start:", startX, startScrollLeft);
}

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  // const deltaX = startX - e.pageX;
  // Check if the movement is significant enough to be considered a drag
  // if (Math.abs(deltaX) > 10) { // Adjust the threshold as needed
  //   carousel.scrollLeft = startScrollLeft + deltaX;
  // }
  // carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  const x = e.pageX || e.touches[0].pageX;
  const walk = x - startX;
  carousel.scrollLeft = startScrollLeft - walk;
  console.log("Dragging:", x, walk, carousel.scrollLeft);
}

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
  console.log("Drag stop");
}

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Update active and side elements classes on scroll
  updateActiveItem();

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();

}


const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// document.addEventListener("mouseup", dragStop);
// carousel.addEventListener("scroll", infiniteScroll);
// wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
// wrapper.addEventListener("mouseleave", autoPlay);

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

// Prevent default behavior to avoid scrolling the entire page while dragging
carousel.addEventListener("touchstart", (e) => e.preventDefault());
carousel.addEventListener("touchmove", (e) => e.preventDefault());