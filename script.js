const board = document.getElementById("board-container");

// GLOBAL CONSTANTS
let boxWidth = 16;

let cols = window.innerWidth / boxWidth;
let rows = window.innerHeight / boxWidth;

let lightsInterval;
let lightsPopulationRate = (cols * rows) / 1000;
let filledSpaces = [];

// EVENT LISTENERS
window.addEventListener("resize", () => {
  console.log("new width", window.innerWidth);
  console.log("new height", window.innerHeight);
  setGridSize();
});

window.addEventListener("DOMContentLoaded", () => {
  drawBoardSpaces();
  setGridSize();
});

// From schemecolor.com
// https://www.schemecolor.com/raksha-bandhan-theme.php
// https://www.schemecolor.com/spring-sunset.php

const colors = [
  "#A50078",
  "#D01F6D",
  "#FA640E",
  "#ECEB16",
  "#FCC200",
  "#50B342",
  "#0794C5",
  "#35B0C9",
  "#F6CAA1",
  "#FB646E",
  "#C83E77",
  "#6E3771",
  "#159879",
  "#65B285",
  "#C1D994",
  "#F1F7E7",
  "#82F0F4",
  "#5BBCF0",
];

function setGridSize() {
  intervalHandler("stop");
  cols = window.innerWidth / boxWidth;
  rows = window.innerHeight / boxWidth;
  drawBoardSpaces();
  intervalHandler("start");
}

function drawBoardSpaces() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const space = document.createElement("div");
      space.classList.add("board-space");

      initListener(space, "mouseover", addColorToSpace);
      initListener(space, "mouseout", removeColorFromSpace);

      board.appendChild(space);
    }
  }
}

function initListener(element, eventType, cb) {
  element.addEventListener(eventType, () => cb(element));
}

function addColorToSpace(space) {
  let spaceColor = returnRandomColor();
  space.style.backgroundColor = spaceColor;
  space.style.boxShadow = `0 0 2px ${darken(spaceColor, 20)}, 0 0 10px ${darken(
    spaceColor,
    30
  )}`;
}

function returnRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function removeColorFromSpace(space) {
  space.style.backgroundColor = "#1d1d1d";
  space.style.boxShadow = `0 0 2px #000`;
}

function intervalHandler(trigger) {
  if (trigger === "start") {
    if (!lightsInterval) {
      lightsInterval = setInterval(fillRandomSpace, `${lightsPopulationRate}`);
    }
  }

  if (trigger === "stop") {
    clearInterval(lightsInterval);
    lightsInterval = null;
  }
}

function fillRandomSpace() {
  const numOfTotalSpaces = rows * cols;
  let makeOrDestroyRoll = Math.round(Math.random() * 10);

  let location;
  let space;

  if (makeOrDestroyRoll >= 5 || filledSpaces.length === 0) {
    location = Math.floor(Math.random() * numOfTotalSpaces);
    space = board.childNodes[location];

    filledSpaces.push(location);
    space.classList.add("active");
    addColorToSpace(space);
  } else {
    location = Math.floor(Math.random() * (filledSpaces.length - 1));
    space = board.childNodes[location];

    space.classList.remove("active");
    removeColorFromSpace(space);
    filledSpaces = filledSpaces.filter((n) => n !== location);
  }
}

function darken(hexValue, percentage) {
  let rgbArray = convertFromHexToRGB(hexValue);
  let rgbString = rgbArray
    .map((value) => String(value - Math.round(value * (percentage / 100))))
    .join(", ");
  return `rgb(${rgbString})`;
}

function convertFromHexToRGB(hexValue) {
  hexValue = hexValue.replace("#", "");
  let hexArray = [];
  for (let i = 0; i < hexValue.length; i += 2) {
    hexArray.push(hexValue.slice(i, i + 2));
  }
  return hexArray.map((valuePair) => parseInt(valuePair, 16));
}
