// ==================== BARK QUEST: THE RECKONING (ISOMETRIC) ====================
import { GAME_WIDTH, GAME_HEIGHT, CHARS } from './config.js';
import { SFX } from './audio.js';
import { getInput, getKeyJustPressed, setupTouchControls } from './input.js';
import { initSprites } from './sprites.js';
import { LEVELS } from './levels.js';
import { Player, Gary, TrashCan, Bone, Critter, Vehicle } from './entities.js';
import {
  initRenderer, render, updateCamera,
  drawTitle, drawCharSelect, drawLevelIntro, drawGameOver,
  drawVictory, drawPause, drawLevelComplete, addParticle
} from './renderer.js';

const STATE = {
  TITLE: 'title', SELECT: 'select', LEVEL_INTRO: 'levelIntro',
  PLAYING: 'playing', PAUSE: 'pause', LEVEL_COMPLETE: 'levelComplete',
  GAME_OVER: 'gameOver', VICTORY: 'victory',
};

let state = STATE.TITLE;
let frame = 0;
let selectedChar = 'sully';
let currentLevel = 0;
let score = 0;
let player = null;
let gary = null;
let trashCans = [];
let bones = [];
let critters = [];
let vehicles = [];
let levelData = null;
let introTimer = 0;
let levelCompleteTimer = 0;
let garyActive = false; // Gary only appears after enough bones collected
let goalUnlocked = false;

function init() {
  const canvas = document.getElementById('game-canvas');
  initRenderer(canvas);
  initSprites();
  setupTouchControls();

  // Use pointerdown - works on ALL devices (mouse, touch, pen)
  canvas.addEventListener('pointerdown', handlePointer);
  // Prevent context menu and text selection on long-press
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  // Prevent scrolling when touching canvas
  canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  requestAnimationFrame(gameLoop);
}

function handlePointer(e) {
  e.preventDefault();
  try { SFX.init(); } catch (_) {}
  const rect = e.target.getBoundingClientRect();
  const scaleX = GAME_WIDTH / rect.width;
  const x = (e.clientX - rect.left) * scaleX;
  processMenuTap(x);
}

function processMenuTap(x) {
  if (state === STATE.TITLE) { state = STATE.SELECT; SFX.menuConfirm(); }
  else if (state === STATE.SELECT) {
    const picked = x < GAME_WIDTH / 2 ? 'sully' : 'june';
    if (picked === selectedChar && window._lastTap === picked) {
      // Second tap on same character = confirm
      startGame();
    } else {
      selectedChar = picked;
      SFX.menuSelect();
    }
    window._lastTap = picked;
  }
  else if (state === STATE.LEVEL_INTRO) startLevel();
  else if (state === STATE.LEVEL_COMPLETE && levelCompleteTimer > 30) nextLevel();
  else if (state === STATE.GAME_OVER || state === STATE.VICTORY) resetToTitle();
}

function startGame() {
  currentLevel = 0; score = 0;
  state = STATE.LEVEL_INTRO; introTimer = 0;
  SFX.menuConfirm();
}

function startLevel() {
  const lvl = LEVELS[currentLevel];
  levelData = { ...lvl, grid: lvl.grid.map(r => [...r]) };

  player = new Player(selectedChar, lvl.spawn.col, lvl.spawn.row);

  // Gary is ALWAYS active on Gary levels - yelling, throwing trash from the start
  // Bones unlock the ability to BITE him, not his appearance
  gary = null;
  garyActive = false;
  goalUnlocked = lvl.bonesRequired === 0;
  if (lvl.hasGary && lvl.garyHouse) {
    gary = new Gary(lvl.garyHouse.col, lvl.garyHouse.row);
    garyActive = true;
  }

  bones = lvl.bones.map(b => new Bone(b.col, b.row));
  critters = (lvl.critters || []).map(c => new Critter(c.col, c.row, c.type));
  vehicles = (lvl.vehicles || []).map(v => new Vehicle(v.col, v.row, v.type));
  trashCans = [];
  state = STATE.PLAYING;
  levelCompleteTimer = 0;
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= LEVELS.length) { state = STATE.VICTORY; SFX.levelComplete(); }
  else { state = STATE.LEVEL_INTRO; introTimer = 0; }
}

function resetToTitle() {
  state = STATE.TITLE; player = null; gary = null;
  trashCans = []; bones = []; critters = []; vehicles = [];
  SFX.menuSelect();
}

function update() {
  frame++;
  const kp = getKeyJustPressed();
  if (kp['KeyM']) SFX.toggleMute();

  switch (state) {
    case STATE.TITLE:
      if (kp['Enter'] || kp['Space']) { state = STATE.SELECT; SFX.menuConfirm(); }
      break;
    case STATE.SELECT:
      if (kp['ArrowLeft'] || kp['KeyA']) { selectedChar = 'sully'; SFX.menuSelect(); window._lastTap = null; }
      if (kp['ArrowRight'] || kp['KeyD']) { selectedChar = 'june'; SFX.menuSelect(); window._lastTap = null; }
      if (kp['Enter'] || kp['Space']) startGame();
      break;
    case STATE.LEVEL_INTRO:
      introTimer++;
      if (kp['Enter'] || kp['Space'] || introTimer > 180) startLevel();
      break;
    case STATE.PLAYING:
      updatePlaying();
      if (kp['Escape']) state = STATE.PAUSE;
      break;
    case STATE.PAUSE:
      if (kp['Escape'] || kp['Enter'] || kp['Space']) state = STATE.PLAYING;
      break;
    case STATE.LEVEL_COMPLETE:
      levelCompleteTimer++;
      if ((kp['Enter'] || kp['Space']) && levelCompleteTimer > 30) nextLevel();
      break;
    case STATE.GAME_OVER:
      if (kp['Enter'] || kp['Space']) resetToTitle();
      break;
    case STATE.VICTORY:
      if (kp['Enter'] || kp['Space']) resetToTitle();
      break;
  }
}

function updatePlaying() {
  if (!player || !levelData) return;
  const input = getInput();
  const { grid, rows, cols, goal, bonesRequired, hasGary, garyHouse } = levelData;

  // Update player with vehicle collision
  player.update(input, grid, rows, cols);

  // Vehicle collision - push player out
  for (const v of vehicles) {
    const dx = player.col - v.col;
    const dy = player.row - v.row;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = v.radius * 0.5 + 0.3;
    if (dist < minDist && dist > 0) {
      // Push player out
      const push = (minDist - dist) / dist;
      player.col += dx * push;
      player.row += dy * push;
    }
  }

  updateCamera(player.col, player.row);

  // Count collected bones
  const collected = bones.filter(b => b.collected).length;

  // Check if bones requirement met
  if (collected >= bonesRequired && !goalUnlocked) {
    goalUnlocked = true;
    SFX.levelComplete(); // chime - you can now bite Gary or reach the goal!
  }

  // Gary is ALWAYS active on Gary levels - yelling & throwing from the start
  if (gary && garyActive) {
    const newTrash = gary.update(player.col, player.row);
    trashCans.push(...newTrash);

    // Bark stuns Gary
    if (player.barkTimer === 19) {
      const dist = player.distTo(gary.col, gary.row);
      if (dist < player.barkRadius * 0.02) {
        gary.stun();
        addParticle(gary.col, gary.row, '#FFD740', 8);
      }
    }

    // Bite Gary when close - BUT only if bones collected!
    const garyDist = player.distTo(gary.col, gary.row);
    if (garyDist < 1.5 && goalUnlocked) {
      if (!player.biting || player.biteTimer <= 0) {
        player.bite();
        gary.hp--;
        addParticle(gary.col, gary.row, '#E53935', 12);
        SFX.garyYell();
        if (gary.hp <= 0) {
          state = STATE.LEVEL_COMPLETE;
          SFX.levelComplete();
          return;
        }
      }
    }
  }

  // Trash cans
  for (const tc of trashCans) {
    tc.update(grid, rows, cols);
    if (tc.active && tc.distToPlayer(player) < 0.6) {
      player.hit();
      tc.active = false;
      addParticle(player.col, player.row, '#78909C', 6);
    }
  }
  trashCans = trashCans.filter(tc => tc.active);

  // Critters
  for (const c of critters) {
    c.update(grid, rows, cols, player.col, player.row);

    // Bark stuns critters
    if (player.barkTimer === 19) {
      const dist = c.distToPlayer(player);
      if (dist < player.barkRadius * 0.02) {
        c.stun();
        addParticle(c.col, c.row, '#FFD740', 4);
      }
    }

    // Critter damages player on contact
    if (c.stunned <= 0 && c.distToPlayer(player) < c.hitRange * 0.6) {
      player.hit();
      c.stun(); // critter also gets stunned after hitting
      addParticle(player.col, player.row, '#FF8A65', 4);
    }
  }

  // Bones
  for (const b of bones) {
    if (!b.collected && b.distToPlayer(player) < 0.8) {
      b.collected = true;
      score++;
      SFX.collectBone();
      addParticle(b.col, b.row, '#FFD740', 6);
    }
  }

  // Goal check (non-Gary levels - reach the goal after collecting enough bones)
  if (!hasGary && goalUnlocked) {
    const goalDist = Math.sqrt(
      (player.col - (goal.col + 0.5)) ** 2 + (player.row - (goal.row + 0.5)) ** 2
    );
    if (goalDist < 1.0) {
      state = STATE.LEVEL_COMPLETE;
      SFX.levelComplete();
    }
  }

  // Death
  if (player.dead) { state = STATE.GAME_OVER; SFX.gameOver(); }
}

function renderState() {
  switch (state) {
    case STATE.TITLE: drawTitle(frame); break;
    case STATE.SELECT: drawCharSelect(frame, selectedChar); break;
    case STATE.LEVEL_INTRO: drawLevelIntro(LEVELS[currentLevel], frame); break;
    case STATE.PLAYING:
    case STATE.PAUSE:
      if (levelData && player) {
        render({
          player, gary: garyActive ? gary : null,
          trashCans, bones, critters, vehicles,
          level: levelData, score, frame,
          goalUnlocked, bonesRequired: levelData.bonesRequired,
          bonesCollected: bones.filter(b => b.collected).length,
        });
      }
      if (state === STATE.PAUSE) drawPause();
      break;
    case STATE.LEVEL_COMPLETE:
      if (levelData && player) {
        render({
          player, gary: garyActive ? gary : null,
          trashCans, bones, critters, vehicles,
          level: levelData, score, frame,
          goalUnlocked, bonesRequired: levelData.bonesRequired,
          bonesCollected: bones.filter(b => b.collected).length,
        });
      }
      drawLevelComplete(LEVELS[currentLevel], score, frame);
      break;
    case STATE.GAME_OVER:
      if (levelData && player) {
        render({
          player, gary: garyActive ? gary : null,
          trashCans, bones, critters, vehicles,
          level: levelData, score, frame,
          goalUnlocked, bonesRequired: levelData.bonesRequired,
          bonesCollected: bones.filter(b => b.collected).length,
        });
      }
      drawGameOver(score, frame);
      break;
    case STATE.VICTORY: drawVictory(score, frame); break;
  }
}

function gameLoop() { update(); renderState(); requestAnimationFrame(gameLoop); }

window.addEventListener('DOMContentLoaded', init);
