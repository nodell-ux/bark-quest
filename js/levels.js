// ==================== ISOMETRIC LEVEL DATA ====================
import { T } from './config.js';

const _ = T.GRASS;
const D = T.DIRT;
const G = T.GRAVEL;
const FH = T.FENCE_H;
const FV = T.FENCE_V;
const W = T.WALL;
const DR = T.DOOR;
const FL = T.FLOOR;
const P = T.PORCH;
const WA = T.WATER;
const TT = T.TREE;
const HN = T.HOUSE_WALL_N;
const HE = T.HOUSE_WALL_E;

// Obstacles and specials are placed separately from the tile grid
// This avoids multi-tile rendering bugs

// Level 1: Escape the House
const map1 = [
  [TT, _, _, _, TT, _, _, _, _, _, _, _, _, TT, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, HN,HN,HN,HN,HN,HN,HN,HN,HN, _, _, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL,HE, _, _, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL,HE, _, TT, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL,HE, _, _, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL,HE, _, _, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL,HE, _, _, _, _],
  [ _, _,HE, FL, FL, FL, FL, FL, FL, FL, DR, _, _, _, _],
  [ _, _, HN,HN,HN,HN,HN,HN,HN,HN,HN, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, D, D, _, _, _],
  [TT, _, _, _, _, _, _, _, _, _, _, D, _, _, TT],
  [ _, _, _, _, _, _, _, _, _, _, _, D, D, D, _],
  [TT, _, _, _, _, _, TT, _, _, _, _, _, _, _, _],
];

const obs1 = {
  spawn: { col: 3, row: 7 },
  goal: { col: 14, row: 12 },
  bones: [
    { col: 5, row: 4 }, { col: 8, row: 6 }, { col: 6, row: 3 },
    { col: 12, row: 10 }, { col: 3, row: 5 },
  ],
  furniture: [ // inside the house
    { col: 4, row: 3, type: 'couch' },
    { col: 7, row: 4, type: 'table' },
    { col: 9, row: 3, type: 'bookshelf' },
    { col: 4, row: 6, type: 'table' },
    { col: 8, row: 7, type: 'rug' },
  ],
  critters: [
    { col: 12, row: 8, type: 'raccoon' },
  ],
  vehicles: [],
  bonesRequired: 2,
  hasGary: false,
};

// Level 2: Cross the Backyard
const map2 = [
  [TT, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TT, _],
  [ _, _, _, _, _, _, TT, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, TT, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, TT, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, TT, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, TT, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, TT, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, TT, _, _],
  [ _, _, _, _, _, _, _, _, TT, _, _, _, _, _, _, _, _, _, _, _],
  [TT, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [FH,FH,FH,FH,FH,FH,FH,FH,FH, _,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

const obs2 = {
  spawn: { col: 2, row: 2 },
  goal: { col: 9, row: 12 }, // the gate in the fence
  bones: [
    { col: 4, row: 3 }, { col: 8, row: 5 }, { col: 14, row: 3 },
    { col: 6, row: 7 }, { col: 16, row: 6 }, { col: 11, row: 9 },
    { col: 3, row: 10 }, { col: 15, row: 8 },
  ],
  furniture: [],
  critters: [
    { col: 5, row: 4, type: 'rabbit' },
    { col: 12, row: 6, type: 'rabbit' },
    { col: 8, row: 9, type: 'deer' },
    { col: 15, row: 3, type: 'raccoon' },
    { col: 10, row: 7, type: 'mailman' },
  ],
  vehicles: [],
  bonesRequired: 4,
  hasGary: true,
  garyHouse: { col: 18, row: 13 }, // Gary yells from across the fence
};

// Level 3: Gary's Junkyard
const map3 = [
  [FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FV, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G,FV],
  [FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH,FH],
];

const obs3 = {
  spawn: { col: 1, row: 1 },
  goal: { col: 18, row: 12 },
  bones: [
    { col: 6, row: 3 }, { col: 14, row: 2 }, { col: 3, row: 7 },
    { col: 10, row: 5 }, { col: 17, row: 7 }, { col: 8, row: 10 },
    { col: 15, row: 11 }, { col: 5, row: 12 }, { col: 12, row: 8 },
    { col: 2, row: 4 },
  ],
  furniture: [],
  critters: [
    { col: 6, row: 6, type: 'raccoon' },
    { col: 14, row: 10, type: 'raccoon' },
  ],
  vehicles: [
    { col: 3, row: 2, type: 'car' },
    { col: 8, row: 2, type: 'boat' },
    { col: 15, row: 3, type: 'rv' },
    { col: 5, row: 5, type: 'trailer' },
    { col: 11, row: 4, type: 'motorcycle' },
    { col: 14, row: 6, type: 'car' },
    { col: 3, row: 9, type: 'boat' },
    { col: 8, row: 8, type: 'car' },
    { col: 16, row: 9, type: 'trailer' },
    { col: 11, row: 11, type: 'motorcycle' },
    { col: 6, row: 11, type: 'rv' },
  ],
  bonesRequired: 5,
  hasGary: true,
  garyHouse: { col: 16, row: 1 }, // Gary stands at his porch
};

// Level 4: The Reckoning - Gary's front yard and porch
const map4 = [
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _,HN,HN,HN,HN, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _,HE, P, P,HE, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _,HE, P, P,HE, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _,HE, P, P, DR, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, HN,HN,HN,HN, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, D, D, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, D, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, D, D, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, D, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [ _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [TT, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,TT],
  [ _, _, _, _, _, TT, _, _, _, _, _, _, _, TT, _, _, _, _],
];

const obs4 = {
  spawn: { col: 2, row: 13 },
  goal: { col: 14, row: 4 }, // Gary's porch
  bones: [
    { col: 5, row: 11 }, { col: 10, row: 10 }, { col: 14, row: 12 },
    { col: 3, row: 8 }, { col: 8, row: 6 }, { col: 12, row: 8 },
  ],
  furniture: [],
  critters: [
    { col: 6, row: 9, type: 'raccoon' },
    { col: 11, row: 7, type: 'raccoon' },
    { col: 4, row: 5, type: 'deer' },
  ],
  vehicles: [
    { col: 4, row: 10, type: 'car' },
    { col: 8, row: 9, type: 'motorcycle' },
    { col: 2, row: 6, type: 'boat' },
    { col: 6, row: 4, type: 'rv' },
    { col: 10, row: 12, type: 'trailer' },
    { col: 14, row: 10, type: 'car' },
  ],
  bonesRequired: 4,
  hasGary: true,
  garyHouse: { col: 14, row: 4 }, // Gary on his porch
};

export const LEVELS = [
  {
    name: 'THE GREAT ESCAPE',
    subtitle: 'Collect 3 bones and find the door!',
    grid: map1.map(r => [...r]),
    rows: map1.length, cols: map1[0].length,
    ...obs1,
  },
  {
    name: 'BACKYARD BLITZ',
    subtitle: 'Collect 5 bones to unlock the gate! Watch for critters!',
    grid: map2.map(r => [...r]),
    rows: map2.length, cols: map2[0].length,
    ...obs2,
  },
  {
    name: "GARY'S JUNKYARD",
    subtitle: 'Collect 7 bones! Gary appears at his porch!',
    grid: map3.map(r => [...r]),
    rows: map3.length, cols: map3[0].length,
    ...obs3,
  },
  {
    name: 'THE RECKONING',
    subtitle: 'Collect 4 bones, reach Gary, and BITE HIM!',
    grid: map4.map(r => [...r]),
    rows: map4.length, cols: map4[0].length,
    ...obs4,
  },
];
