// sketch.js - Experiment 2: Living Impressions
// Author: Lyle Watkins
// Date: 04/15/2025

// Globals
let pond;
let canvasContainer;
let generateButton = document.getElementById("generate-button");

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  colorMode(HSB);

  // Create and fill pond
  pond = new Pond();
  pond.fill();

  // Generate button
  generateButton.addEventListener("click", () => {
    pond.seed++;
    pond.clear();
    pond.fill();
  });
}

function draw() {
  background(getColor(BG_COLOR));
  pond.draw();
}

// Returns a p5 Color object from an HSB dictionary ex. { h: 0, s: 0, b: 0 }
// + optional color modification setting and amount
function getColor(colorObj, setting, amt) {
  if (setting == "variate") {
    return color(colorObj.h + random(-amt, amt), colorObj.s + random(-amt, amt), colorObj.b + random(-amt, amt));
  }
  return color(colorObj.h, colorObj.s, colorObj.b);
}

// Gets a darker version of an existing p5 Color obj
function getStroke(colorObj) {
  return getColor({
    h: hue(colorObj),
    s: saturation(colorObj),
    b: brightness(colorObj) - STROKE_DARKNESS
  });
}