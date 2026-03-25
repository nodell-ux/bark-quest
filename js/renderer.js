// ==================== ISOMETRIC RENDERER ====================
import { GAME_WIDTH, GAME_HEIGHT, TILE_W, TILE_H, HALF_W, HALF_H, T, COLORS as COL } from './config.js';
import {
  drawIsoDiamond, drawIsoBox, drawSully, drawJune, drawGary,
  drawIsoCar, drawIsoBoat, drawIsoRV, drawIsoTrailer, drawIsoMotorcycle,
  drawIsoTree, drawTrashCanIso, drawBoneIso
} from './sprites.js';

let canvas, ctx;
let camX = 0, camY = 0;
let particles = [];

export function initRenderer(el) {
  canvas = el;
  ctx = canvas.getContext('2d');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  ctx.imageSmoothingEnabled = false;
}

// Convert grid (col, row) to screen (x, y)
function toScreen(col, row) {
  return {
    x: (col - row) * HALF_W - camX + GAME_WIDTH / 2,
    y: (col + row) * HALF_H - camY + GAME_HEIGHT / 2 - 40,
  };
}

export function updateCamera(col, row) {
  const tx = (col - row) * HALF_W;
  const ty = (col + row) * HALF_H;
  camX += (tx - camX) * 0.1;
  camY += (ty - camY) * 0.1;
}

// ===== PARTICLES =====
export function addParticle(col, row, color, count = 5) {
  const { x, y } = toScreen(col, row);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 1) * 3,
      life: 15 + Math.random() * 15,
      color, size: 2 + Math.random() * 2,
    });
  }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = p.life / 30;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ===== TILE DRAWING =====
function drawTile(cx, cy, type) {
  switch (type) {
    case T.GRASS:
      drawIsoDiamond(ctx, cx, cy, COL.grass1, 'rgba(0,0,0,0.05)');
      break;
    case T.DIRT:
      drawIsoDiamond(ctx, cx, cy, COL.dirt, COL.dirtDark);
      break;
    case T.GRAVEL:
      drawIsoDiamond(ctx, cx, cy, COL.gravel, COL.gravelDark);
      break;
    case T.FLOOR:
      drawIsoDiamond(ctx, cx, cy, '#C8B59A', '#A0896B');
      break;
    case T.PORCH:
      drawIsoDiamond(ctx, cx, cy, COL.porch, COL.porchDark);
      break;
    case T.WATER:
      drawIsoDiamond(ctx, cx, cy, COL.water, '#039BE5');
      break;
    case T.DOOR:
      drawIsoDiamond(ctx, cx, cy, '#C8B59A', '#A0896B');
      // Door frame
      drawIsoBox(ctx, cx, cy, 20, 18, 10, COL.houseDoor, '#4E342E', '#3E2723');
      break;
    case T.FENCE_H:
    case T.FENCE_V:
      drawIsoDiamond(ctx, cx, cy, COL.grass1, 'rgba(0,0,0,0.05)');
      // Fence posts and rails
      drawIsoBox(ctx, cx, cy, 4, 12, 4, COL.fence, COL.fencePost, COL.fencePost);
      // Rails
      ctx.fillStyle = COL.fence;
      ctx.fillRect(cx - HALF_W + 4, cy - 8, HALF_W * 2 - 8, 2);
      ctx.fillRect(cx - HALF_W + 4, cy - 4, HALF_W * 2 - 8, 2);
      break;
    case T.WALL:
    case T.HOUSE_WALL_N:
    case T.HOUSE_WALL_E:
      drawIsoDiamond(ctx, cx, cy, '#C8B59A', '#A0896B');
      drawIsoBox(ctx, cx, cy, TILE_W - 4, 22, TILE_H - 2, COL.houseWall, COL.houseWallDark, '#6D4C41');
      break;
    case T.ROOF:
      drawIsoDiamond(ctx, cx, cy, COL.roof, COL.roofDark);
      break;
    default:
      drawIsoDiamond(ctx, cx, cy, COL.grass1, 'rgba(0,0,0,0.05)');
  }
}

function drawObstacleTile(cx, cy, type) {
  switch (type) {
    case T.CAR: drawIsoCar(ctx, cx, cy - 4); break;
    case T.BOAT: drawIsoBoat(ctx, cx, cy - 4); break;
    case T.RV: drawIsoRV(ctx, cx, cy - 4); break;
    case T.TRAILER: drawIsoTrailer(ctx, cx, cy - 4); break;
    case T.MOTORCYCLE: drawIsoMotorcycle(ctx, cx, cy - 2); break;
    case T.TREE: drawIsoTree(ctx, cx, cy); break;
    case T.TRASH_CAN: drawTrashCanIso(ctx, cx, cy); break;
  }
}

// ===== HUD =====
function drawHUD(player, score, levelName, bonesCollected, bonesRequired, goalUnlocked) {
  // Health bar
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(4, 4, 84, 16);
  ctx.fillStyle = COL.uiHealth;
  ctx.fillRect(6, 6, (player.hp / player.maxHp) * 80, 12);
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, 82, 14);
  ctx.fillStyle = '#FFF';
  ctx.font = '8px monospace';
  ctx.fillText('HP', 8, 15);

  // Bone progress (key mechanic!)
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(GAME_WIDTH - 120, 4, 116, 16);
  const bonePct = Math.min(1, bonesCollected / bonesRequired);
  ctx.fillStyle = goalUnlocked ? '#81C784' : COL.uiScore;
  ctx.fillRect(GAME_WIDTH - 118, 6, 112 * bonePct, 12);
  ctx.strokeStyle = '#FFF';
  ctx.strokeRect(GAME_WIDTH - 119, 5, 114, 14);
  ctx.fillStyle = '#FFF';
  ctx.font = '8px monospace';
  ctx.textAlign = 'right';
  if (goalUnlocked) {
    ctx.fillText('GO!', GAME_WIDTH - 10, 15);
  } else {
    ctx.fillText(`BONES: ${bonesCollected}/${bonesRequired}`, GAME_WIDTH - 10, 15);
  }

  // Level name
  ctx.fillStyle = '#FFF';
  ctx.textAlign = 'center';
  ctx.font = '9px monospace';
  ctx.fillText(levelName, GAME_WIDTH / 2, 14);
  ctx.textAlign = 'left';

  // Bark cooldown
  if (player.barkCooldown > 0) {
    const pct = player.barkCooldown / player.barkCooldownMax;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(4, 24, 44, 8);
    ctx.fillStyle = '#64B5F6';
    ctx.fillRect(4, 24, 44 * (1 - pct), 8);
    ctx.fillStyle = '#FFF';
    ctx.font = '7px monospace';
    ctx.fillText('BARK', 6, 31);
  }
}

// ===== CRITTER DRAWING =====
function drawCritter(cx, cy, critter, frame) {
  const bob = Math.sin(frame * 0.2 + critter.col) * 1;
  const by = cy + bob;

  if (critter.stunned > 0) {
    // Stunned = spinning stars
    ctx.fillStyle = '#FFD740';
    for (let i = 0; i < 3; i++) {
      const a = frame * 0.15 + i * 2.1;
      ctx.fillRect(cx + Math.cos(a) * 8, by - 12 + Math.sin(a) * 4, 2, 2);
    }
  }

  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (critter.type) {
    case 'raccoon':
      // Grey body
      ctx.fillStyle = '#78909C';
      ctx.beginPath();
      ctx.ellipse(cx, by - 3, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Dark mask face
      ctx.fillStyle = '#37474F';
      ctx.beginPath();
      ctx.ellipse(cx, by - 6, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // White eye patches
      ctx.fillStyle = '#FFF';
      ctx.fillRect(cx - 3, by - 7, 2, 2);
      ctx.fillRect(cx + 1, by - 7, 2, 2);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(cx - 2, by - 7, 1, 1);
      ctx.fillRect(cx + 2, by - 7, 1, 1);
      // Striped tail
      ctx.fillStyle = '#78909C';
      ctx.fillRect(cx - 8, by - 5, 4, 3);
      ctx.fillStyle = '#37474F';
      ctx.fillRect(cx - 7, by - 5, 1, 3);
      break;

    case 'rabbit':
      // White/brown body
      ctx.fillStyle = '#D7CCC8';
      ctx.beginPath();
      ctx.ellipse(cx, by - 2, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#BCAAA4';
      ctx.beginPath();
      ctx.ellipse(cx + 2, by - 5, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Long ears
      ctx.fillStyle = '#D7CCC8';
      ctx.fillRect(cx, by - 11, 2, 5);
      ctx.fillRect(cx + 3, by - 11, 2, 5);
      ctx.fillStyle = '#FFAB91';
      ctx.fillRect(cx + 1, by - 10, 1, 3);
      ctx.fillRect(cx + 4, by - 10, 1, 3);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(cx + 1, by - 5, 1, 1);
      // Cotton tail
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(cx - 4, by - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'deer':
      // Brown body
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.ellipse(cx, by - 4, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(cx - 5, by, 2, 5);
      ctx.fillRect(cx + 3, by, 2, 5);
      // Neck and head
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(cx + 5, by - 10, 3, 7);
      ctx.beginPath();
      ctx.ellipse(cx + 7, by - 12, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Antlers
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(cx + 5, by - 17, 2, 5);
      ctx.fillRect(cx + 8, by - 17, 2, 5);
      ctx.fillRect(cx + 4, by - 17, 7, 1);
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(cx + 7, by - 12, 1, 1);
      // White tail
      ctx.fillStyle = '#FFF';
      ctx.fillRect(cx - 8, by - 5, 2, 3);
      break;

    case 'mailman':
      // Blue uniform body
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(cx - 4, by - 12, 8, 10);
      // Pants
      ctx.fillStyle = '#0D47A1';
      ctx.fillRect(cx - 3, by - 2, 3, 4);
      ctx.fillRect(cx, by - 2, 3, 4);
      // Head
      ctx.fillStyle = '#FFCC80';
      ctx.beginPath();
      ctx.ellipse(cx, by - 16, 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mail hat
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(cx - 4, by - 20, 8, 3);
      ctx.fillRect(cx - 5, by - 18, 10, 2);
      // Mail bag
      ctx.fillStyle = '#795548';
      ctx.fillRect(cx + 4, by - 10, 5, 6);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(cx - 2, by - 16, 1, 1);
      ctx.fillRect(cx + 1, by - 16, 1, 1);
      break;
  }
}

// ===== FURNITURE DRAWING =====
function drawFurniture(cx, cy, type) {
  switch (type) {
    case 'couch':
      drawIsoBox(ctx, cx, cy, 36, 10, 18, '#795548', '#5D4037', '#4E342E');
      // Cushions
      drawIsoBox(ctx, cx, cy - 2, 30, 4, 14, '#8D6E63', '#6D4C41', '#5D4037');
      break;
    case 'table':
      drawIsoBox(ctx, cx, cy, 24, 10, 16, '#8D6E63', '#6D4C41', '#5D4037');
      break;
    case 'bookshelf':
      drawIsoBox(ctx, cx, cy, 16, 20, 10, '#5D4037', '#4E342E', '#3E2723');
      // Books
      ctx.fillStyle = '#C62828';
      ctx.fillRect(cx - 4, cy - 18, 3, 6);
      ctx.fillStyle = '#1565C0';
      ctx.fillRect(cx - 1, cy - 17, 3, 5);
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(cx + 2, cy - 16, 3, 4);
      break;
    case 'rug':
      // Flat oval on floor
      ctx.fillStyle = '#C62828';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFB74D';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

// ===== BARK EFFECT =====
function drawBarkEffect(player, frame) {
  if (player.barkTimer <= 0) return;
  const { x, y } = toScreen(player.col, player.row);
  const r = player.barkRadius * 0.5 * (1 - player.barkTimer / 20);
  ctx.strokeStyle = `rgba(255,200,50,${player.barkTimer / 20})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y - 6, r, r * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = `rgba(255,230,100,${player.barkTimer / 20})`;
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WOOF!', x, y - 24);
  ctx.textAlign = 'left';
}

// ===== GARY YELL =====
function drawYellBubble(gary) {
  if (gary.yellDisplay <= 0) return;
  const { x, y } = toScreen(gary.col, gary.row);
  const alpha = Math.min(1, gary.yellDisplay / 20);
  ctx.globalAlpha = alpha;
  const text = gary.currentYell;
  ctx.font = 'bold 8px monospace';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x - tw / 2 - 4, y - 54, tw + 8, 14);
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 40);
  ctx.lineTo(x, y - 35);
  ctx.lineTo(x + 3, y - 40);
  ctx.fill();
  ctx.fillStyle = '#D32F2F';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y - 43);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
}

// ===== GOAL INDICATOR =====
function drawGoalMarker(col, row, frame) {
  const { x, y } = toScreen(col + 0.5, row + 0.5);
  const pulse = 0.5 + Math.sin(frame * 0.08) * 0.3;
  ctx.fillStyle = `rgba(255,215,64,${pulse})`;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,200,0,${pulse})`;
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('>>>',  x, y - 8);
  ctx.textAlign = 'left';
}

// ===== MAIN RENDER =====
export function render(state) {
  const { player, gary, trashCans, bones, critters, vehicles,
          level, score, frame, goalUnlocked, bonesRequired, bonesCollected } = state;
  const { grid, rows, cols, goal, furniture } = level;

  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, '#7A9AAD');
  grad.addColorStop(1, '#B0C8D4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const renderList = [];

  // Draw floor tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { x, y } = toScreen(c + 0.5, r + 0.5);
      if (x < -TILE_W || x > GAME_WIDTH + TILE_W || y < -60 || y > GAME_HEIGHT + 40) continue;
      drawTile(x, y, grid[r][c]);
    }
  }

  // Add furniture to render list
  if (furniture) {
    for (const f of furniture) {
      const { x, y } = toScreen(f.col + 0.5, f.row + 0.5);
      renderList.push({ depth: f.row + f.col, type: 'furniture', x, y, furnitureType: f.type });
    }
  }

  // Add vehicles
  if (vehicles) {
    for (const v of vehicles) {
      const { x, y } = toScreen(v.col, v.row);
      renderList.push({ depth: v.row + v.col, type: 'vehicle', x, y, vehicleType: v.type });
    }
  }

  // Add bones
  for (const b of bones) {
    if (b.collected) continue;
    const { x, y } = toScreen(b.col, b.row);
    renderList.push({ depth: b.row + b.col, type: 'bone', x, y });
  }

  // Add critters
  if (critters) {
    for (const c of critters) {
      const { x, y } = toScreen(c.col, c.row);
      renderList.push({ depth: c.row + c.col, type: 'critter', x, y, entity: c });
    }
  }

  // Add trash cans
  for (const tc of trashCans) {
    if (!tc.active) continue;
    const { x, y } = toScreen(tc.col, tc.row);
    renderList.push({ depth: tc.row + tc.col, type: 'trashcan', x, y });
  }

  // Add player
  if (player && !player.dead) {
    const { x, y } = toScreen(player.col, player.row);
    renderList.push({ depth: player.row + player.col, type: 'player', x, y, entity: player });
  }

  // Add Gary
  if (gary) {
    const { x, y } = toScreen(gary.col, gary.row);
    renderList.push({ depth: gary.row + gary.col, type: 'gary', x, y, entity: gary });
  }

  // Add goal marker (only show when unlocked or not a gary level)
  if (goalUnlocked && !level.hasGary) {
    renderList.push({ depth: goal.row + goal.col - 0.1, type: 'goal', col: goal.col, row: goal.row });
  }

  // Sort by depth
  renderList.sort((a, b) => a.depth - b.depth);

  // Render sorted objects
  for (const obj of renderList) {
    switch (obj.type) {
      case 'furniture':
        drawFurniture(obj.x, obj.y, obj.furnitureType);
        break;
      case 'vehicle': {
        const vDrawMap = {
          car: drawIsoCar, boat: drawIsoBoat, rv: drawIsoRV,
          trailer: drawIsoTrailer, motorcycle: drawIsoMotorcycle,
        };
        const drawFn = vDrawMap[obj.vehicleType];
        if (drawFn) drawFn(ctx, obj.x, obj.y - 4);
        break;
      }
      case 'bone':
        drawBoneIso(ctx, obj.x, obj.y, frame);
        break;
      case 'critter':
        drawCritter(obj.x, obj.y, obj.entity, frame);
        break;
      case 'trashcan':
        drawTrashCanIso(ctx, obj.x, obj.y);
        break;
      case 'player': {
        const p = obj.entity;
        const show = p.invincible <= 0 || Math.floor(p.invincible / 4) % 2 === 0;
        if (show) {
          if (p.charKey === 'sully') drawSully(ctx, obj.x, obj.y, p.facing, frame, p.moving);
          else drawJune(ctx, obj.x, obj.y, p.facing, frame, p.moving);
        }
        drawBarkEffect(p, frame);
        break;
      }
      case 'gary': {
        const g = obj.entity;
        drawGary(ctx, obj.x, obj.y, g.facing, frame, g.throwAnim > 0);
        drawYellBubble(g);
        break;
      }
      case 'goal':
        drawGoalMarker(obj.col, obj.row, frame);
        break;
    }
  }

  drawParticles();

  if (player) drawHUD(player, score, level.name, bonesCollected || 0, bonesRequired || 0, goalUnlocked);
}

// ===== MENU SCREENS =====
export function drawTitle(frame) {
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  for (let i = 0; i < 40; i++) {
    const sx = (i * 47 + frame * 0.2) % GAME_WIDTH;
    const sy = (i * 31) % (GAME_HEIGHT - 60);
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frame * 0.05 + i) * 0.3})`;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.fillStyle = COL.uiAccent;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BARK QUEST', GAME_WIDTH / 2, 80);
  ctx.fillStyle = COL.uiScore;
  ctx.font = 'bold 12px monospace';
  ctx.fillText('THE RECKONING', GAME_WIDTH / 2, 100);
  ctx.fillStyle = '#AAA';
  ctx.font = '9px monospace';
  ctx.fillText('A tale of two dogs and one terrible neighbor', GAME_WIDTH / 2, 125);
  const alpha = 0.5 + Math.sin(frame * 0.08) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = '11px monospace';
  ctx.fillText('PRESS ENTER OR TAP TO START', GAME_WIDTH / 2, 200);
  ctx.fillStyle = '#666';
  ctx.font = '8px monospace';
  ctx.fillText('ARROWS/WASD: Move | B/SPACE: Bark | M: Mute', GAME_WIDTH / 2, 230);
  ctx.textAlign = 'left';
}

export function drawCharSelect(frame, selected) {
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = COL.uiAccent;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHOOSE YOUR HERO', GAME_WIDTH / 2, 35);

  const sullyX = GAME_WIDTH * 0.25, juneX = GAME_WIDTH * 0.75;
  const boxW = 140, boxH = 160;

  for (const [key, cx] of [['sully', sullyX], ['june', juneX]]) {
    const sel = selected === key;
    ctx.strokeStyle = sel ? COL.uiAccent : '#555';
    ctx.lineWidth = sel ? 3 : 1;
    ctx.strokeRect(cx - boxW / 2, 50, boxW, boxH);
    if (sel) { ctx.fillStyle = 'rgba(255,107,53,0.1)'; ctx.fillRect(cx - boxW / 2, 50, boxW, boxH); }

    // Draw character preview
    if (key === 'sully') drawSully(ctx, cx, 100, 'down', frame, false);
    else drawJune(ctx, cx, 100, 'down', frame, false);

    const cfg = key === 'sully'
      ? { name: 'SULLY', breed: 'Pyrenean Mastiff', hp: 5, trait: 'Slow & Mighty', perk: 'Powerful bark' }
      : { name: 'JUNE', breed: 'Basset Hound', hp: 3, trait: 'Fast & Nimble', perk: 'Quick bark recovery' };
    ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px monospace'; ctx.fillText(cfg.name, cx, 130);
    ctx.fillStyle = '#AAA'; ctx.font = '8px monospace'; ctx.fillText(cfg.breed, cx, 145);
    ctx.fillText(`HP: ${cfg.hp} | ${cfg.trait}`, cx, 158);
    ctx.fillStyle = '#888'; ctx.fillText(cfg.perk, cx, 172);
  }

  const alpha = 0.5 + Math.sin(frame * 0.08) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = '10px monospace';
  ctx.fillText('LEFT/RIGHT to choose, ENTER to confirm', GAME_WIDTH / 2, 235);
  ctx.textAlign = 'left';
}

export function drawLevelIntro(level, frame) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = COL.uiAccent;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(level.name, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
  ctx.fillStyle = '#CCC';
  ctx.font = '10px monospace';
  ctx.fillText(level.subtitle, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
  const alpha = 0.5 + Math.sin(frame * 0.1) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillText('PRESS ENTER OR TAP', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
  ctx.textAlign = 'left';
}

export function drawGameOver(score, frame) {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = COL.uiHealth;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
  ctx.fillStyle = COL.uiScore;
  ctx.font = '12px monospace';
  ctx.fillText(`BONES: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
  const alpha = 0.5 + Math.sin(frame * 0.08) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = '10px monospace';
  ctx.fillText('PRESS ENTER TO TRY AGAIN', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
  ctx.textAlign = 'left';
}

export function drawVictory(score, frame) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  for (let i = 0; i < 8; i++) {
    const fx = (i * 67 + frame * 2) % GAME_WIDTH;
    const fy = 30 + Math.sin(frame * 0.05 + i * 1.5) * 20;
    const colors = ['#FF6B35', '#FFD740', '#E53935', '#64B5F6', '#81C784'];
    ctx.fillStyle = colors[i % colors.length];
    for (let j = 0; j < 5; j++) {
      const angle = frame * 0.1 + j * 1.2;
      ctx.fillRect(fx + Math.cos(angle) * 8, fy + Math.sin(angle) * 8, 3, 3);
    }
  }
  ctx.fillStyle = COL.uiScore;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU GOT GARY!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
  ctx.fillStyle = '#FFF';
  ctx.font = '11px monospace';
  ctx.fillText("Gary won't make you bark", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);
  ctx.fillText('for no reason again!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 5);
  ctx.fillStyle = COL.uiScore;
  ctx.fillText(`TOTAL BONES: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35);
  const alpha = 0.5 + Math.sin(frame * 0.08) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = '10px monospace';
  ctx.fillText('PRESS ENTER TO PLAY AGAIN', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70);
  ctx.textAlign = 'left';
}

export function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);
  ctx.font = '10px monospace';
  ctx.fillText('Press ESC to resume', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15);
  ctx.textAlign = 'left';
}

export function drawLevelComplete(level, score, frame) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = COL.uiScore;
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL COMPLETE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
  ctx.fillStyle = '#FFF';
  ctx.font = '10px monospace';
  ctx.fillText(`Bones: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
  const alpha = 0.5 + Math.sin(frame * 0.08) * 0.5;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillText('PRESS ENTER FOR NEXT LEVEL', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
  ctx.textAlign = 'left';
}
