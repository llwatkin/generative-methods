// Project base code provided by {amsmith,ikarth}@ucsc.edu

let tile_width_step_main; // A width step is half a tile's width
let tile_height_step_main; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let canvas_container;
let key = START_KEY;
let tile_rows, tile_columns;
let camera_offset;
let camera_velocity;

// Disable default browser controls
window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function resizeScreen() {
    const container_rect = canvas_container[0].getBoundingClientRect();
    const container_width = container_rect.width;
    const container_height = container_rect.height;
    console.log("Container height: " + container_height);

    center_horz = container_width / 2;
    center_vert = container_height / 2;
    console.log("Resizing...");
    resizeCanvas(container_width, container_height);

    rebuildWorld(key, false);
}

/////////////////////////////
// Transforms between coordinate systems
// These are actually slightly weirder than in full 3d...
/////////////////////////////
function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i + camera_x, j + camera_y];
}


function tileRenderingOrder(offset) {
    return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
    screen_x -= camera_x;
    screen_y -= camera_y;
    screen_x /= tile_width_step_main * 2;
    screen_y /= tile_height_step_main * 2;
    screen_y += 0.5;
    return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
    let world_x = camera_x / (tile_width_step_main * 2);
    let world_y = camera_y / (tile_height_step_main * 2);
    return { x: Math.round(world_x), y: Math.round(world_y) };
}

function preload() {
    if (window.p3_preload) {
        window.p3_preload();
    }
}

function setup() {
    canvas_container = $("#canvas-container");
    let canvas = createCanvas(canvas_container.width(), canvas_container.height());
    angleMode(DEGREES);
    imageMode(CENTER);
    frameRate(60);
    canvas.parent("canvas-container");

    camera_offset = new p5.Vector(-width / 2, height / 2);
    camera_velocity = new p5.Vector(0, 0);

    if (window.p3_setup) {
        window.p3_setup();
    }

    let label = createP();
    label.html("World Key: ");
    label.parent("controls");

    let input = createInput(key);
    input.parent(label);
    input.input(() => {
        key = input.value();
        rebuildWorld(key, true);
    });

    createP("Move with WASD or Arrow Keys. Click on a star to toggle its sound.").parent("controls");

    rebuildWorld(key, true);

    $(window).resize(function () {
        resizeScreen();
    });
}

function rebuildWorld(key, clear) {
    console.log("rebuilt world with height: " + height);
    if (window.p3_worldKeyChanged) {
        window.p3_worldKeyChanged(key, clear);
    }
    tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : TILE_WIDTH;
    tile_height_step_main = window.p3_tileHeight ? window.p3_tileHeight() : TILE_HEIGHT;
    tile_columns = Math.ceil(width / (tile_width_step_main * 2));
    tile_rows = Math.ceil(height / (tile_height_step_main * 2));
}

function mouseClicked() {
    let world_pos = screenToWorld(
        [0 - mouseX, mouseY],
        [camera_offset.x, camera_offset.y]
    );

    if (window.p3_tileClicked) {
        window.p3_tileClicked(world_pos[0], world_pos[1]);
    }
    return false;
}


function draw() {
    // Movement controls!
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            camera_velocity.x -= 0.5;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            camera_velocity.x += 0.5;
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            camera_velocity.y -= 0.5;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            camera_velocity.y += 0.5;
        }
    }


    let camera_delta = new p5.Vector(0, 0);
    camera_velocity.add(camera_delta);
    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95); // cheap easing
    if (camera_velocity.mag() < 0.01) {
        camera_velocity.setMag(0);
    }

    let world_pos = screenToWorld(
        [0 - mouseX, mouseY],
        [camera_offset.x, camera_offset.y]
    );
    let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    background(0);

    if (window.p3_drawBefore) {
        window.p3_drawBefore();
    }

    let overdraw = 0.1;

    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
                camera_offset.x,
                camera_offset.y
            ]); // odd row
        }
        for (let x = x0; x < x1; x++) {
            drawTile(
                tileRenderingOrder([
                    x + 0.5 + world_offset.x,
                    y + 0.5 - world_offset.y
                ]),
                [camera_offset.x, camera_offset.y]
            ); // even rows are offset horizontally
        }
    }

    describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    if (window.p3_drawAfter) {
        window.p3_drawAfter();
    }

    cameraTileCoordinates();
}

// Display a description of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
        [world_x, world_y],
        [camera_x, camera_y]
    );
    drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function cameraTileCoordinates() {
    let world_pos = screenToWorld(
        [-width / 2, height / 2],
        [camera_offset.x, camera_offset.y]
    );
    return world_pos;
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
    push();
    translate(screen_x, screen_y);
    if (window.p3_drawSelectedTile) {
        window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
    }
    pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
        [world_x, world_y],
        [camera_x, camera_y]
    );
    push();
    translate(0 - screen_x, screen_y);
    if (window.p3_drawTile) {
        window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
    }
    pop();
}
