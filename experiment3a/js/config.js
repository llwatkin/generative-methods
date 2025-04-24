const MARGIN = 1; // Number of tiles between cave rooms and the canvas edge
const ROOM_SIZE = 3;

const outerEdgeLookup = {
    1: [8, 4], // NW corner
    2: [5, 3], // N side
    4: [8, 3], // NE corner
    8: [4, 4], // W side
    10: [4, 3], // NW sides
    16: [6, 4], // E side
    18: [6, 3], // NE sides
    32: [7, 4], // SW corner
    64: [5, 5], // S side
    72: [4, 5], // SW sides
    80: [6, 5], // SE sides
    128: [7, 3], // SE corner
}

const innerEdgeLookup = {
    1: [13, 4], // NW corner
    2: [10, 3], // N side
    4: [12, 4], // NE corner
    8: [9, 4], // W side
    10: [9, 3], // NW sides
    16: [11, 4], // E side
    18: [11, 3], // NE sides
    32: [13, 3], // SW corner
    64: [10, 5], // S side
    72: [9, 5], // SW sides
    80: [11, 5], // SE sides
    128: [12, 3], // SE corner
};