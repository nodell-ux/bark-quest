// ==================== ISOMETRIC ENTITIES ====================
import { CHARS, GARY_CFG, SOLID, TILE_W, TILE_H } from './config.js';
import { SFX } from './audio.js';

// ===== PLAYER =====
export class Player {
  constructor(charKey, col, row) {
    const cfg = CHARS[charKey];
    this.charKey = charKey;
    // World position (in tile units, floating point)
    this.col = col + 0.5;
    this.row = row + 0.5;
    this.speed = cfg.speed;
    this.hp = cfg.hp;
    this.maxHp = cfg.hp;
    this.barkRadius = cfg.barkRadius;
    this.barkCooldownMax = cfg.barkCooldown;
    this.barkCooldown = 0;
    this.facing = 'down'; // up, down, left, right
    this.frame = 0;
    this.moving = false;
    this.invincible = 0;
    this.barkTimer = 0;
    this.dead = false;
    this.biting = false;
    this.biteTimer = 0;
    this.stepTimer = 0;
  }

  update(input, grid, rows, cols) {
    this.frame++;
    this.moving = false;
    if (this.dead) return;
    if (this.invincible > 0) this.invincible--;
    if (this.barkCooldown > 0) this.barkCooldown--;
    if (this.barkTimer > 0) this.barkTimer--;
    if (this.biteTimer > 0) this.biteTimer--;

    // Movement mapped to SCREEN directions (isometric)
    // Screen-up    = -col, -row (northwest in grid)
    // Screen-down  = +col, +row (southeast in grid)
    // Screen-left  = -col, +row (southwest in grid)
    // Screen-right = +col, -row (northeast in grid)
    let dx = 0, dy = 0; // dx = col change, dy = row change
    if (input.up)    { dx -= 1; dy -= 1; this.facing = 'up'; }
    if (input.down)  { dx += 1; dy += 1; this.facing = 'down'; }
    if (input.left)  { dx -= 1; dy += 1; this.facing = 'left'; }
    if (input.right) { dx += 1; dy -= 1; this.facing = 'right'; }

    // Normalize if moving diagonally
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    if (dx !== 0 || dy !== 0) {
      this.moving = true;
      const speed = this.speed * 0.06;
      const newCol = this.col + dx * speed;
      const newRow = this.row + dy * speed;

      // Collision check (check the tile we'd move into)
      const margin = 0.3;
      // Try X movement
      if (!this.blocked(newCol, this.row, margin, grid, rows, cols)) {
        this.col = newCol;
      }
      // Try Y movement
      if (!this.blocked(this.col, newRow, margin, grid, rows, cols)) {
        this.row = newRow;
      }
    }

    // Bark
    if (input.bark && this.barkCooldown <= 0) {
      this.barkCooldown = this.barkCooldownMax;
      this.barkTimer = 20;
      SFX.bark(this.charKey === 'sully');
    }

    // Step sounds
    if (this.moving) {
      this.stepTimer++;
      if (this.stepTimer % 15 === 0) SFX.step();
    } else {
      this.stepTimer = 0;
    }
  }

  blocked(col, row, margin, grid, rows, cols) {
    // Check corners of bounding box
    const checks = [
      [col - margin, row - margin],
      [col + margin, row - margin],
      [col - margin, row + margin],
      [col + margin, row + margin],
    ];
    for (const [c, r] of checks) {
      const gc = Math.floor(c);
      const gr = Math.floor(r);
      if (gc < 0 || gr < 0 || gc >= cols || gr >= rows) return true;
      if (SOLID.has(grid[gr][gc])) return true;
    }
    return false;
  }

  hit() {
    if (this.invincible > 0) return;
    this.hp--;
    this.invincible = 90;
    SFX.hurt();
    if (this.hp <= 0) this.dead = true;
  }

  bite() {
    this.biting = true;
    this.biteTimer = 30;
    SFX.bite();
  }

  distTo(col, row) {
    return Math.sqrt((this.col - col) ** 2 + (this.row - row) ** 2);
  }
}

// ===== GARY =====
export class Gary {
  constructor(col, row) {
    this.col = col + 0.5;
    this.row = row + 0.5;
    this.speed = GARY_CFG.speed;
    this.throwTimer = GARY_CFG.throwInterval;
    this.yellTimer = GARY_CFG.yellInterval;
    this.facing = 'down';
    this.throwing = false;
    this.throwAnim = 0;
    this.currentYell = '';
    this.yellDisplay = 0;
    this.frame = 0;
    this.stunned = 0;
    this.hp = 3;
  }

  update(playerCol, playerRow) {
    this.frame++;
    if (this.stunned > 0) { this.stunned--; return []; }
    if (this.throwAnim > 0) this.throwAnim--;
    if (this.yellDisplay > 0) this.yellDisplay--;

    // Face the player
    const dx = playerCol - this.col;
    const dy = playerRow - this.row;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? 'right' : 'left';
    } else {
      this.facing = dy > 0 ? 'down' : 'up';
    }

    // Throw trash cans
    this.throwTimer--;
    const projectiles = [];
    if (this.throwTimer <= 0) {
      this.throwTimer = GARY_CFG.throwInterval + Math.floor(Math.random() * 40);
      this.throwing = true;
      this.throwAnim = 20;
      SFX.trashThrow();
      // Throw toward player
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      projectiles.push(new TrashCan(
        this.col, this.row,
        (dx / dist) * GARY_CFG.throwSpeed * 0.05,
        (dy / dist) * GARY_CFG.throwSpeed * 0.05
      ));
    }

    // Yell
    this.yellTimer--;
    if (this.yellTimer <= 0) {
      this.yellTimer = GARY_CFG.yellInterval + Math.floor(Math.random() * 60);
      this.currentYell = GARY_CFG.yells[Math.floor(Math.random() * GARY_CFG.yells.length)];
      this.yellDisplay = 120;
      SFX.garyYell();
    }

    return projectiles;
  }

  stun() { this.stunned = 60; }
}

// ===== TRASH CAN =====
export class TrashCan {
  constructor(col, row, vcol, vrow) {
    this.col = col;
    this.row = row;
    this.vcol = vcol;
    this.vrow = vrow;
    this.active = true;
    this.life = 180; // frames until despawn
    this.rollSound = 0;
  }

  update(grid, rows, cols) {
    if (!this.active) return;
    this.col += this.vcol;
    this.row += this.vrow;
    this.life--;

    // Hit a wall
    const gc = Math.floor(this.col);
    const gr = Math.floor(this.row);
    if (gc < 0 || gr < 0 || gc >= cols || gr >= rows || SOLID.has(grid[gr][gc])) {
      this.active = false;
      SFX.trashHit();
      return;
    }

    if (this.life <= 0) this.active = false;

    this.rollSound++;
    if (this.rollSound % 20 === 0) SFX.trashRoll();
  }

  distToPlayer(player) {
    return Math.sqrt((this.col - player.col) ** 2 + (this.row - player.row) ** 2);
  }
}

// ===== BONE =====
export class Bone {
  constructor(col, row) {
    this.col = col + 0.5;
    this.row = row + 0.5;
    this.collected = false;
    this.bobOffset = Math.random() * Math.PI * 2;
  }

  distToPlayer(player) {
    return Math.sqrt((this.col - player.col) ** 2 + (this.row - player.row) ** 2);
  }
}

// ===== CRITTER (roaming obstacle) =====
export class Critter {
  constructor(col, row, type) {
    this.col = col + 0.5;
    this.row = row + 0.5;
    this.type = type;
    this.facing = 'down';
    this.frame = 0;
    this.moveTimer = 0;
    this.dirCol = 0;
    this.dirRow = 0;
    this.stunned = 0;
    const speeds = { raccoon: 0.02, rabbit: 0.04, deer: 0.03, mailman: 0.015 };
    const ranges = { raccoon: 0.7, rabbit: 0.5, deer: 0.9, mailman: 0.8 };
    this.speed = speeds[type] || 0.02;
    this.hitRange = ranges[type] || 0.7;
  }

  update(grid, rows, cols, playerCol, playerRow) {
    this.frame++;
    if (this.stunned > 0) { this.stunned--; return; }
    this.moveTimer--;
    if (this.moveTimer <= 0) {
      this.moveTimer = 40 + Math.floor(Math.random() * 80);
      if (this.type === 'rabbit') {
        const dx = this.col - playerCol, dy = this.row - playerRow;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < 4) { this.dirCol = dx / d; this.dirRow = dy / d; }
        else { this.dirCol = Math.random() * 2 - 1; this.dirRow = Math.random() * 2 - 1; }
      } else if (this.type === 'raccoon') {
        const dx = playerCol - this.col, dy = playerRow - this.row;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        this.dirCol = dx / d * 0.5 + (Math.random() - 0.5);
        this.dirRow = dy / d * 0.5 + (Math.random() - 0.5);
      } else if (this.type === 'deer') {
        const a = Math.random() * Math.PI * 2;
        this.dirCol = Math.cos(a); this.dirRow = Math.sin(a);
      } else {
        this.dirCol = this.dirCol === 0 ? 1 : -this.dirCol; this.dirRow = 0;
      }
      const len = Math.sqrt(this.dirCol ** 2 + this.dirRow ** 2) || 1;
      this.dirCol /= len; this.dirRow /= len;
    }
    const nc = this.col + this.dirCol * this.speed;
    const nr = this.row + this.dirRow * this.speed;
    const gc = Math.floor(nc), gr = Math.floor(nr);
    if (gc >= 1 && gr >= 1 && gc < cols - 1 && gr < rows - 1 && !SOLID.has(grid[gr][gc])) {
      this.col = nc; this.row = nr;
    } else { this.moveTimer = 0; }
    if (Math.abs(this.dirCol) > Math.abs(this.dirRow))
      this.facing = this.dirCol > 0 ? 'right' : 'left';
    else this.facing = this.dirRow > 0 ? 'down' : 'up';
  }

  distToPlayer(p) { return Math.sqrt((this.col - p.col) ** 2 + (this.row - p.row) ** 2); }
  stun() { this.stunned = 90; }
}

// ===== VEHICLE (static obstacle) =====
export class Vehicle {
  constructor(col, row, type) {
    this.col = col + 0.5;
    this.row = row + 0.5;
    this.type = type;
    const sizes = { car: 1.4, boat: 1.6, rv: 1.8, trailer: 1.5, motorcycle: 0.8 };
    this.radius = sizes[type] || 1.2;
  }
}
