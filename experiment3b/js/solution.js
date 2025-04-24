function checkLocation(grid, row, col, target) {
    if (row >= 0 && row < grid.length) {
        if (col >= 0 && col < grid[row].length) {
            return grid[row][col] == target ? 1 : 0;
        }
    }
    return 0;
}

function getLocationCode(grid, row, col, target) {
    let northBit = checkLocation(grid, row - 1, col, target);
    let westBit = checkLocation(grid, row, col - 1, target);
    let eastBit = checkLocation(grid, row, col + 1, target);
    let southBit = checkLocation(grid, row + 1, col, target);

    let northWestBit, northEastBit, southWestBit, southEastBit;
    if (!northBit && !southBit && !westBit && !eastBit) {
        northWestBit = checkLocation(grid, row - 1, col - 1, target);
        northEastBit = checkLocation(grid, row - 1, col + 1, target);
        southWestBit = checkLocation(grid, row + 1, col - 1, target);
        southEastBit = checkLocation(grid, row + 1, col + 1, target);
    }

    return (
        (northWestBit << 0) +
        (northBit << 1) +
        (northEastBit << 2) +
        (westBit << 3) +
        (eastBit << 4) +
        (southWestBit << 5) +
        (southBit << 6) +
        (southEastBit << 7)
    );
}

function placeEdge(grid, row, col, target, lookup) {
    const code = getLocationCode(grid, row, col, target);
    const edgeTile = lookup[code];
    if (edgeTile) placeTile(row, col, edgeTile[0], edgeTile[1]);
}

function generateGrid(numCols, numRows) {
    let grid = [];
    for (let r = 0; r < numRows; r++) {
        let row = [];
        for (let c = 0; c < numCols; c++) {
            row.push("-");
        }
        grid.push(row);
    }

    /* Water */
    // Restrict generation area by the room size and margin
    const maxRow = numRows - ROOM_SIZE;
    const maxCol = numCols - ROOM_SIZE;
    // Choose a random starting point at the bottommost row
    let row = maxRow;
    let col = fRandom(0, maxCol);
    // Walk around randomly, creating new rooms at each step
    // Note that "rooms" blend into each other to form one large mass of water
    while (true) {
        // Create a room in location
        addWater(grid, row, col);
        [row, col] = walk(grid, row, col, maxRow, maxCol);
        // End loop when river reaches the top
        if (row == 0) {
            addWater(grid, row, col);
            break;
        }
    }

    // Fill in the edges of the water with ice
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c] == "~" && getLocationCode(grid, r, c, "-") != 0) grid[r][c] = "*";
        }
    }

    /* Rocks */
    // Place rocks at random throughout the cave
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c] == "-" && random() < 0.1) {
                if (
                    getLocationCode(grid, r, c, "*") == 0 &&
                    getLocationCode(grid, r, c, "^") == 0
                )
                    grid[r][c] = "^";
            }
        }
    }

    return grid;
}

// Returns a floored random value [min, max)
function fRandom(min, max) {
    return floor(random(min, max));
}

// Create a square of ice with sides of length ROOM_SIZE starting at (row, col)
function addWater(grid, row, col) {
    for (let r = row; r < row + ROOM_SIZE; r++) {
        for (let c = col; c < col + ROOM_SIZE; c++) {
            grid[r][c] = "~";
        }
    }
}

// Determines what directions are viable and chooses one to walk in at random
// Returns new row and col values
function walk(grid, row, col, maxRow, maxCol) {
    let directions = [];
    // Determine viable directions
    if (row < maxRow - ROOM_SIZE) directions.push([ROOM_SIZE, 0]);
    if (col < maxCol - ROOM_SIZE) directions.push([0, ROOM_SIZE]);
    if (row > 0) directions.push([-ROOM_SIZE, 0]);
    if (col > ROOM_SIZE) directions.push([0, -ROOM_SIZE]);
    // Prefer up direction, but choose randomly otherwise
    let direction;
    if (random() < 0.5 && row > ROOM_SIZE) {
        direction = [-ROOM_SIZE, 0];
    } else direction = random(directions);
    let [newRow, newCol] = [row + direction[0], col + direction[1]];

    return [newRow, newCol];
}

function drawGrid(grid) {
    background(0);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // Place base snow
            if (grid[row][col] == "-") {
                placeTile(row, col, fRandom(0, 4), 12);
                // Place edges
                placeEdge(grid, row, col, "*", outerEdgeLookup);
            }
            // Place water
            if (grid[row][col] == "~") {
                let t1 = fRandom(0, 4);
                let t2 = fRandom(0, 4);
                if (noise(millis() / 2000, row, col) > 0.5)
                    placeTile(row, col, t1, 13);
                else placeTile(row, col, t2, 13);

                // Place edges
                placeEdge(grid, row, col, "*", iceEdgeLookup);
            }
            // Place ice
            if (grid[row][col] == "*") {
                placeTile(row, col, 20, 12);
                // Place edges
                placeEdge(grid, row, col, "-", innerEdgeLookup);
            }
            // Place rocks
            if (grid[row][col] == "^") {
                placeTile(row, col, fRandom(0, 4), 12);
                placeTile(row, col, 20, 9);
            }
        }
    }
}
