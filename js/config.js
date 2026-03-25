// ==================== ISOMETRIC GAME CONFIG ====================
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

// Isometric tile dimensions (2:1 ratio)
export const TILE_W = 64;
export const TILE_H = 32;
export const HALF_W = 32;
export const HALF_H = 16;

// Player movement
export const MOVE_SPEED_BASE = 1.8;

export const COLORS = {
  // PNW environment
  grass1: '#3A7D32',
  grass2: '#4CAF50',
  grass3: '#2E7D32',
  dirt: '#8D6E63',
  dirtDark: '#6D4C41',
  gravel: '#9E9E9E',
  gravelDark: '#757575',
  fence: '#8D6E63',
  fencePost: '#5D4037',
  water: '#4FC3F7',
  // Buildings
  houseWall: '#A1887F',
  houseWallDark: '#795548',
  houseDoor: '#5D4037',
  roof: '#C62828',
  roofDark: '#8E0000',
  porch: '#8D6E63',
  porchDark: '#5D4037',
  // Trees
  treeDark: '#1B5E20',
  treeLight: '#2E7D32',
  trunk: '#5D3A1A',
  // Characters
  sullyWhite: '#F0EDE8',
  sullyPatch: '#4A4A4A',
  juneBrown: '#C87533',
  juneDarkBrown: '#8B4513',
  juneWhite: '#F5F0E8',
  garySkin: '#FFCC80',
  garyHair: '#E8D44D',
  garyShirt: '#455A64',
  garyPants: '#37474F',
  garyMouth: '#D32F2F',
  // Vehicles
  carOrange: '#F57C00',
  carBlue: '#1565C0',
  carRed: '#C62828',
  boatWhite: '#FFF8E1',
  rvWhite: '#F5F5F5',
  trailerYellow: '#FFB300',
  // Items
  bone: '#F5F5DC',
  boneShadow: '#D4C9A8',
  trashCan: '#78909C',
  trashCanDark: '#546E7A',
  // UI
  uiBg: '#1A1A2E',
  uiText: '#E8E8E8',
  uiAccent: '#FF6B35',
  uiHealth: '#E53935',
  uiScore: '#FFD740',
};

export const CHARS = {
  sully: {
    name: 'Sully',
    breed: 'Pyrenean Mastiff',
    speed: 1.5,
    hp: 5,
    barkRadius: 80,
    barkCooldown: 90,
    desc: 'Slow but mighty. Can push obstacles.',
  },
  june: {
    name: 'June',
    breed: 'Basset Hound',
    speed: 2.2,
    hp: 3,
    barkRadius: 55,
    barkCooldown: 50,
    desc: 'Fast and nimble. Fits between tight spaces.',
  },
};

export const GARY_CFG = {
  speed: 1.0,
  throwInterval: 100,
  throwSpeed: 2.5,
  yellInterval: 150,
  yells: [
    "GET OFF MY LAWN!",
    "STUPID DOGS!",
    "I'LL GET YOU!",
    "COME HERE YOU MUTTS!",
    "YOU'RE GONNA PAY!",
    "NOT IN MY YARD!",
  ],
};

// Tile type enum
export const T = {
  GRASS: 0,
  DIRT: 1,
  GRAVEL: 2,
  FENCE_H: 3,
  FENCE_V: 4,
  WALL: 5,
  DOOR: 6,
  FLOOR: 7,
  PORCH: 8,
  WATER: 9,
  // Obstacles (solid)
  CAR: 10,
  BOAT: 11,
  RV: 12,
  TRAILER: 13,
  MOTORCYCLE: 14,
  TREE: 15,
  TRASH_CAN: 16,
  // Special
  BONE: 20,
  SPAWN: 21,
  GOAL: 22,
  GARY_SPAWN: 23,
  HOUSE_WALL_N: 24,
  HOUSE_WALL_E: 25,
  ROOF: 26,
};

// Which tiles block movement
export const SOLID = new Set([
  T.FENCE_H, T.FENCE_V, T.WALL, T.CAR, T.BOAT, T.RV,
  T.TRAILER, T.MOTORCYCLE, T.TREE, T.WATER,
  T.HOUSE_WALL_N, T.HOUSE_WALL_E, T.ROOF,
]);
