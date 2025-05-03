// main.js - Implementation and rendering of cosmecho
// Author: Lyle Watkins
// Date: 4/30/2025

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let tileTextures = [];
let stars = {};
let active_stars = [];
let universe_type;


function p3_preload() {
    tileTextures[0] = loadImage("assets/stars_1.png");
    tileTextures[1] = loadImage("assets/stars_2.png");
    tileTextures[2] = loadImage("assets/stars_3.png");
    tileTextures[3] = loadImage("assets/stars_4.png");
    tileTextures[4] = loadImage("assets/stars_5.png");
    tileTextures[5] = loadImage("assets/stars_6.png");
}

function p3_setup() { }

let worldSeed;

function p3_worldKeyChanged(key, clear) {
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
    if (clear) {
        stars = {}; // Clear all stars
        active_stars = []; // Clear active stars
        star_types = []; // Clear star types

        // Create a random universe type
        universe_type = new UniverseType();
    }
}

function p3_tileWidth() {
    return TILE_WIDTH;
}

function p3_tileHeight() {
    return TILE_HEIGHT;
}

function p3_tileClicked(i, j) {
    let key = [i, j];
    // If there is a star on this tile
    if (stars[key]) {
        if (stars[key].clicked == true) {
            stars[key].clicked = false;
            // Remove star from array of active stars
            let index = active_stars.indexOf(stars[key]);
            active_stars.splice(index, 1);
        }
        else {
            stars[key].clicked = true;
            // Add star to array of active stars
            active_stars.push(stars[key]);
        }
    }
    // If there is no star, do nothing
}

function p3_drawBefore() {
    for (let star of active_stars) star.update(); // Update all active stars
    for (let star of active_stars) {
        if (star.volume == 0) { // If a star has gone quiet, it becomes inactive
            let index = active_stars.indexOf(star);
            star.clicked = false;
            active_stars.splice(index, 1); // Remove star from active stars
        }
    }
}

function p3_drawTile(i, j) {
    let hash = XXH.h32("tile:" + [i, j], worldSeed);
    randomSeed(hash);

    // Tile texture
    let texture;
    if (random() < 0.5) {
        texture = random(tileTextures);
    } else fill(0);

    // Draw tile
    if (texture) image(texture, 0, 0, tw * 2, th * 4);
    else {
        beginShape();
        vertex(-tw, 0);
        vertex(0, th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
    }

    // Check if there's a star here
    if (noise(hash) < universe_type.star_freq) {
        // If so, check if a Star instance has already been created for it
        // If not, create one, addressable in the stars dictionary with [i, j]
        if (!stars[[i, j]]) stars[[i, j]] = new Star([i, j]);
        // Draw the star
        stars[[i, j]].draw();
    }
}

// TODO: animated outline (if time)
function p3_drawSelectedTile(i, j) {
    noFill();
    stroke(255, 255, 255, 100);

    // Selection outline
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    // Debug text
    //text("tile " + [i, j], 20, 20);
}

function p3_drawAfter() { }
