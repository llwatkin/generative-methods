const START_KEY = "Cosmecho";

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

const MIN_STAR_FREQ = 0.001; // Minimum frequency of stars
const MAX_STAR_FREQ = 0.2; // Maximum frequency of stars

const MID_NOTE_URLS = [
    // A
    "assets/bass_a.mp3",
    // G
    "assets/bass_g.mp3",
    // E
    "assets/bass_e.mp3",
    // C
    "assets/bass_c.mp3",
    // D
    "assets/bass_d.mp3"
];

const HI_NOTE_URLS = [
    // A
    "assets/bass_a_hi.mp3",
    // G
    "assets/bass_g_hi.mp3",
    // E
    "assets/bass_e_hi.mp3",
    // C
    "assets/bass_c_hi.mp3",
    // D
    "assets/bass_d_hi.mp3"
];

const LO_NOTE_URLS = [
    // A
    "assets/bass_a_lo.mp3",
    // G
    "assets/bass_g_lo.mp3",
    // E
    "assets/bass_e_lo.mp3",
    // C
    "assets/bass_c_lo.mp3",
    // D
    "assets/bass_d_lo.mp3"
];

const XLO_NOTE_URLS = [
    // A
    "assets/bass_a_xlo.mp3",
    // G
    "assets/bass_g_xlo.mp3",
    // E
    "assets/bass_e_xlo.mp3",
    // C
    "assets/bass_c_xlo.mp3",
    // D
    "assets/bass_d_xlo.mp3"
];

const NOTE_PITCHES = [MID_NOTE_URLS, LO_NOTE_URLS, HI_NOTE_URLS, XLO_NOTE_URLS];

const MAX_DIST = 100; // Maximum distance a star can be from the camera and still play sound