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

function placeInnerEdge(grid, row, col, target) {
    const code = getLocationCode(grid, row, col, target);
    const edgeTile = innerEdgeLookup[code];
    if (edgeTile) placeTile(row, col, edgeTile[0], edgeTile[1]);
}

function placeOuterEdge(grid, row, col, target) {
    const code = getLocationCode(grid, row, col, target);
    const edgeTile = outerEdgeLookup[code];
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

    /* Cave Rooms */
    // Restrict generation area by the room size and margin
    const maxRow = numRows - MARGIN - ROOM_SIZE;
    const maxCol = numCols - MARGIN - ROOM_SIZE;
    // Choose a random starting point
    let row = fRandom(MARGIN, numRows - MARGIN - ROOM_SIZE);
    let col = fRandom(MARGIN, numCols - MARGIN - ROOM_SIZE);
    // Walk around randomly, creating new rooms at each step
    // Note that "rooms" blend into each other to form one large cave
    for (let i = 0; i < 100; i++) {
        [row, col] = walk(grid, row, col, maxRow, maxCol);
        // Create a room in new location
        addLava(grid, row, col);
    }

    /* Rocks */
    // Place rocks at random throughout the cave
    for (let r = MARGIN; r < numRows - MARGIN; r++) {
        for (let c = MARGIN; c < numCols - MARGIN; c++) {
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

// Create a square of lava with sides of length ROOM_SIZE starting at (row, col)
function addLava(grid, row, col) {
    for (let r = row; r < row + ROOM_SIZE; r++) {
        for (let c = col; c < col + ROOM_SIZE; c++) {
            grid[r][c] = "*";
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
    if (row > MARGIN + ROOM_SIZE) directions.push([-ROOM_SIZE, 0]);
    if (col > MARGIN + ROOM_SIZE) directions.push([0, -ROOM_SIZE]);
    // Choose a random direction from viable directions and move
    let direction = random(directions);
    let [newRow, newCol] = [row + direction[0], col + direction[1]];

    return [newRow, newCol];
}

function drawGrid(grid) {
    background(0);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // Place base rocks
            if (grid[row][col] == "-") {
                placeTile(row, col, fRandom(0, 4), 16);
                // Place edges
                placeOuterEdge(grid, row, col, "*");
            }
            // Place lava
            if (grid[row][col] == "*") {
                let t1 = fRandom(0, 4);
                let t2 = fRandom(0, 4);
                if (noise(millis() / 2000, row, col) > 0.5)
                    placeTile(row, col, t1, 4);
                else placeTile(row, col, t2, 4);

                // Place edges
                placeInnerEdge(grid, row, col, "-");
            }
            // Place rocks
            if (grid[row][col] == "^") {
                placeTile(row, col, fRandom(0, 4), 16);
                placeTile(row, col, 14, 9);
            }
        }
    }
}
