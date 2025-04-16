// Vignette
const VIGNETTE_WIDTH = 200;
const VIGNETTE_BANDS = 5;

// Pebbles
const PEBBLE_COLOR = { h: 62, s: 54, b: 35 };
const MIN_PEBBLE_SIZE = 5;
const MAX_PEBBLE_SIZE = 10;
const PEBBLE_POS_MOD = 5; // Maximum amount of position variation in pebbles
const PEBBLE_COLOR_MOD = 10; // Maximum amount of color variation

// Lilypads
const LILYPAD_COLORS = [
    { h: 88, s: 57, b: 70 },
    { h: 51, s: 57, b: 83 }
];
const MIN_LILYPADS = 15;
const MAX_LILYPADS = 30;
const MIN_LILYPAD_SIZE = 50;
const MAX_LILYPAD_SIZE = 70;
const MIN_OPENING_SIZE = 0.35;
const MAX_OPENING_SIZE = 1.25;
const LILYPAD_COLOR_MOD = 4;

// Leaves
const LEAF_COLOR = { h: 110, s: 35, b: 85 };
const MIN_LEAVES = 100
const MAX_LEAVES = 200;
const LEAF_COLOR_MOD = 6;
const MIN_LEAF_SIZE = 40;
const MAX_LEAF_SIZE = 50;
const MIDRIB_THICKNESS = 2;
const LEAF_POS_MOD = 30;
const MIN_LEAF_ANGLE = -20;
const MAX_LEAF_ANGLE = 20;

// Fish
const FISH_COLORS = [
    { h: 7, s: 68, b: 87 },
    { h: 46, s: 13, b: 81 },
    { h: 20, s: 15, b: 22 },
];
const MAX_FISH = 15; // Max number of fish in a pond
const MIN_FISH_SIZE = 10;
const MAX_FISH_SIZE = 50;
const FISH_COLOR_MOD = 15;
const MAX_FISH_SPEED = 1;

// Ripples
const RIPPLE_COLOR = { h: 224, s: 10, b: 82 };
const MAX_RIPPLE_SIZE = 10;
const RIPPLE_INTENSITY = 20;

// Environment
const BG_COLOR = { h: 105, s: 12, b: 12 };
const STROKE_DARKNESS = 10;
const SHADOW_INTENSITY = 50;
const SUN_ANGLE_X = 10;
const SUN_ANGLE_Y = 5;