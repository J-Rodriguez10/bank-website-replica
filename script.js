"strict";

/*
====================
Customer Service Tab
====================
*/
const customerServTab = document.querySelector(".customer-service-tab");
const customerServOpt = document.querySelector(".customer-service-options");


customerServTab.addEventListener("click", function () {
  customerServTab.classList.toggle("customer-service-tab-active");
  console.log("it is currently: ", customerServOpt.style.display);

  customerServOpt.style.display = `${
    customerServOpt.style.display === "" ? "revert" : ""
  }`;
});

/*
====================
Nav Toggle Menu
====================
*/
const navToggleMenu = document.querySelector(".nav-toggle-menu");
const toggleBtn = document.querySelector(".nav-toggle");
const exitBtn = document.querySelector(".x-style");

const testFunction = () => console.log("you clicked me");

const toggleOverlay = function() {
  document.body.classList.toggle("overlay");
};

toggleBtn.addEventListener("click", function() {
  navToggleMenu.style.transform = "translateX(0%)";
  toggleOverlay();
});

exitBtn.addEventListener("click", function() {
  navToggleMenu.style.transform = "translateX(-110%)";
  toggleOverlay();
});

console.log(toggleBtn);

/*
====================
Remember Me Button
====================
*/

const rememberBtn = document.querySelector(".btn-square");

rememberBtn.addEventListener("click", function () {
  console.log("You pressed the square btn");
  rememberBtn.classList.toggle("btn-square-active");
});
/*
====================
Slider
====================
*/

const sliderContainer = document.querySelector(".slider-container");
const leftArrow = document.querySelector(".arrow-left");
const rightArrow = document.querySelector(".arrow-right");

let currentPosition = 0;
let slidePercent;

const lowestPosition = 0;
const highestPosition = 9;

const originalTransition = sliderContainer.style.transition;
const transitionTime = 400; //in ms

console.log("Position starts at: ", currentPosition);

//FUNCTIONS:
const slideContainer = function (position) {
  // if window's width is greater than 995px we slide the container
  //by 20% - for the 5 items, else we shift by 33.33% - for the 3 items
  slidePercent = window.innerWidth > 995 ? 20 : 33.33;
  sliderContainer.style.transform = `translate(-${
    position * slidePercent + slidePercent
  }%)`;
  // activating the proper button
  activatePaginationButton(position);
};

//both used to mimic an infinite slider
const swapToStart = function () {
  currentPosition = lowestPosition;
  slideContainer(currentPosition);
};
const swapToEnd = function () {
  currentPosition = highestPosition;
  slideContainer(currentPosition);
};

//HELPER method to slideLeft() and slideRight()
const slideTo = function (newPosition) {
  slideContainer(newPosition);

  // if it goes out of bounds, swapping back to the end or start to create illusion of infinite scroll
  if (newPosition > highestPosition || newPosition < lowestPosition) {
    console.log("im looping again");
    // wait 4ms and then re-start the cylce
    setTimeout(function () {
      // removing transition
      sliderContainer.style.transition = "none";

      // swapping to either front or end
      newPosition > highestPosition ? swapToStart() : swapToEnd();

      // adding transition back after some time
      // NOTE: if time isn't allowed, loop illusion fails.
      // Why? - JS re-adds the transition faster than the
      // sliderContainer swaps to start/end
      setTimeout(function () {
        sliderContainer.style.transition = originalTransition;
      }, 20);
    }, transitionTime);
  }
};

// const slideLeft = function () {
//   console.log("old position", currentPosition);
//   currentPosition--;
//   console.log("position after decrementing:", currentPosition);
//   slideTo(currentPosition);
//   console.log("new position:", currentPosition);
//   console.log("----------------------------");
// };
const slideLeft = function () {
  currentPosition--;
  slideTo(currentPosition);
};

const slideRight = function () {
  currentPosition++;
  slideTo(currentPosition);
};

//EVENT LISTENERS:
leftArrow.addEventListener("click", slideLeft);
rightArrow.addEventListener("click", slideRight);
// arrow keys
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") slideLeft();
  if (e.key === "ArrowRight") slideRight();
});

/*
====================
Slider - Pagination
====================
*/
const pagination = document.querySelector(".pagination");
const btnAmount = 10;

// creates 10 pagination btns
const createButtons = function () {
  for (let i = 0; i < btnAmount; i++) {
    pagination.insertAdjacentHTML(
      "beforeend",
      `<button class="btn-dot" data-position="${i}"></button>`
    );
  }
};
createButtons();

//activates correct pag-btn badsed on currentPostion variable
const activatePaginationButton = function () {
  if (currentPosition < lowestPosition || currentPosition > highestPosition) {
    console.log("out of bounds");
    return;
  }
  // looping through all the btns and removing active class
  document
    .querySelectorAll(".btn-dot")
    .forEach((dot) => dot.classList.remove("btn-dot-active"));

  // now adding the active class to the proper button
  document
    .querySelector(`.btn-dot[data-position="${currentPosition}"]`)
    .classList.add("btn-dot-active");
};

activatePaginationButton();

//moves slider based on the pagination btn pressed
let updatedPosition;
pagination.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-dot")) {
    // extracting the proper index position from the button that is pressed
    updatedPosition = parseInt(e.target.dataset.position);
    // then updating the currentPosition;
    currentPosition = updatedPosition;
    slideTo(currentPosition);
  }
});

/*
=============================================
Slider - Recalibration 
=============================================
*/
// reclibrates slider by clicking proper paginiation button
const recalibrateSlider = function (currentPosition) {
  let btn = document.querySelector(
    `.btn-dot[data-position="${currentPosition}"]`
  );
  console.log(btn);
  btn.click();
};

// creating mediaQuerey
const mediaQuery = window.matchMedia("(min-width: 995px)");

// wether media query matches or not, we recalibrate
const handleWindowSizeChange = (mediaQuery) => {
  recalibrateSlider(currentPosition);
};

// adding a listener to wait for the screen size to change
mediaQuery.addListener(handleWindowSizeChange);
