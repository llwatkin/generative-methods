const ROOM_SIZE = 5;

const outerEdgeLookup = {
    1: [8, 13], // NW corner
    2: [5, 12], // N side
    4: [7, 12], // NE corner
    8: [4, 13], // W side
    10: [4, 12], // NW sides
    16: [6, 13], // E side
    18: [6, 12], // NE sides
    32: [8, 12], // SW corner
    64: [5, 14], // S side
    72: [4, 14], // SW sides
    80: [6, 14], // SE sides
    128: [7, 12], // SE corner
}

const innerEdgeLookup = {
    1: [13, 13], // NW corner
    2: [10, 12], // N side
    4: [12, 13], // NE corner
    8: [9, 13], // W side
    10: [9, 12], // NW sides
    16: [11, 13], // E side
    18: [11, 12], // NE sides
    32: [13, 12], // SW corner
    64: [10, 14], // S side
    72: [9, 14], // SW sides
    80: [11, 14], // SE sides
    128: [12, 12], // SE corner
};

const iceEdgeLookup = {
    1: [25, 13], // NW corner
    2: [22, 12], // N side
    4: [24, 13], // NE corner
    8: [21, 13], // W side
    10: [21, 12], // NW sides
    16: [23, 13], // E side
    18: [23, 12], // NE sides
    32: [25, 12], // SW corner
    64: [22, 14], // S side
    72: [21, 14], // SW sides
    80: [11, 14], // SE sides
    128: [24, 12], // SE corner
}