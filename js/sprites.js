// ==================== ISOMETRIC SPRITES ====================
import { COLORS as C, HALF_W, HALF_H } from './config.js';

// All drawing happens directly in the renderer via these draw functions.
// Characters are drawn as small isometric figures.

export function initSprites() { /* nothing to pre-render for iso */ }
export function getSprites() { return {}; }

// ===== ISO HELPERS =====
function isoRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Draw isometric diamond (floor tile)
export function drawIsoDiamond(ctx, cx, cy, color, outline = null) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - HALF_H);
  ctx.lineTo(cx + HALF_W, cy);
  ctx.lineTo(cx, cy + HALF_H);
  ctx.lineTo(cx - HALF_W, cy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Draw isometric box (for obstacles, buildings)
export function drawIsoBox(ctx, cx, cy, w, h, depth, topColor, leftColor, rightColor) {
  const hw = w / 2;
  const hd = depth / 2;

  // Top face
  ctx.beginPath();
  ctx.moveTo(cx, cy - h - hd);
  ctx.lineTo(cx + hw, cy - h);
  ctx.lineTo(cx, cy - h + hd);
  ctx.lineTo(cx - hw, cy - h);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy - h);
  ctx.lineTo(cx, cy - h + hd);
  ctx.lineTo(cx, cy + hd);
  ctx.lineTo(cx - hw, cy);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(cx + hw, cy - h);
  ctx.lineTo(cx, cy - h + hd);
  ctx.lineTo(cx, cy + hd);
  ctx.lineTo(cx + hw, cy);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();
}

// ===== CHARACTER DRAWING (top-down isometric view) =====
export function drawSully(ctx, cx, cy, facing, frame, moving) {
  const bob = moving ? Math.sin(frame * 0.3) * 2 : 0;
  const by = cy + bob;
  const legOff = moving ? Math.sin(frame * 0.4) * 3 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (behind body)
  ctx.fillStyle = '#DDD8D0';
  ctx.fillRect(cx - 8, by - 2 + legOff, 4, 7);
  ctx.fillRect(cx + 4, by - 2 - legOff, 4, 7);
  ctx.fillStyle = '#8D6E63';
  ctx.fillRect(cx - 9, by + 3 + Math.abs(legOff) * 0.3, 5, 3);
  ctx.fillRect(cx + 3, by + 3 + Math.abs(legOff) * 0.3, 5, 3);

  // Tail (fluffy plume)
  const tailDir = facing === 'down' ? -1 : facing === 'up' ? 1 : facing === 'left' ? 1 : -1;
  const tailWag = moving ? Math.sin(frame * 0.5) * 3 : 0;
  ctx.fillStyle = C.sullyWhite;
  ctx.beginPath();
  ctx.ellipse(cx + tailDir * 10 + tailWag, by - 10, 4, 6, tailDir * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Big fluffy body
  ctx.fillStyle = C.sullyWhite;
  ctx.beginPath();
  ctx.ellipse(cx, by - 6, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C0BAB0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Body dark patches
  ctx.fillStyle = C.sullyPatch;
  ctx.beginPath();
  ctx.ellipse(cx - 4, by - 8, 6, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, by - 4, 4, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy chest
  ctx.fillStyle = '#FAF7F2';
  ctx.beginPath();
  ctx.ellipse(cx, by - 2, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head position based on facing
  const hx = facing === 'left' ? cx - 10 : facing === 'right' ? cx + 10 : cx;
  const hy = facing === 'up' ? by - 18 : facing === 'down' ? by - 8 : by - 14;

  // Ears (floppy)
  if (facing !== 'up') {
    ctx.fillStyle = C.sullyPatch;
    ctx.beginPath();
    ctx.ellipse(hx - 7, hy + 2, 3, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx + 7, hy + 2, 3, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big round head
  ctx.fillStyle = C.sullyWhite;
  ctx.beginPath();
  ctx.ellipse(hx, hy, 9, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C0BAB0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Head patch
  ctx.fillStyle = C.sullyPatch;
  ctx.beginPath();
  ctx.ellipse(hx - 3, hy - 2, 4, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  if (facing !== 'up') {
    ctx.fillStyle = '#FAF7F2';
    ctx.beginPath();
    ctx.ellipse(hx, hy + 3, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes
  if (facing !== 'up') {
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(hx - 3, hy - 1, 2, 0, Math.PI * 2);
    ctx.arc(hx + 3, hy - 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.fillRect(hx - 4, hy - 2, 1, 1);
    ctx.fillRect(hx + 2, hy - 2, 1, 1);
  }

  // Big black nose
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 3, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tongue when moving
  if (moving && facing !== 'up') {
    ctx.fillStyle = '#E57373';
    ctx.fillRect(hx + 1, hy + 5, 2, 3);
  }
}

export function drawJune(ctx, cx, cy, facing, frame, moving) {
  const bob = moving ? Math.sin(frame * 0.35) * 1 : 0;
  const by = cy + bob;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Long body (low to ground)
  ctx.fillStyle = C.juneWhite;
  ctx.beginPath();
  ctx.ellipse(cx, by - 3, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brown saddle
  ctx.fillStyle = C.juneBrown;
  ctx.beginPath();
  ctx.ellipse(cx, by - 4, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  const hx = facing === 'left' ? cx - 8 : facing === 'right' ? cx + 8 : cx;
  const hy = facing === 'up' ? by - 10 : facing === 'down' ? by - 3 : by - 7;
  ctx.fillStyle = C.juneBrown;
  ctx.beginPath();
  ctx.ellipse(hx, hy, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // White face blaze
  ctx.fillStyle = C.juneWhite;
  ctx.beginPath();
  ctx.ellipse(hx, hy + 1, 3, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Long droopy ears!
  ctx.fillStyle = C.juneDarkBrown;
  const earAngle = facing === 'left' ? 0.3 : facing === 'right' ? -0.3 : 0;
  ctx.beginPath();
  ctx.ellipse(hx - 5, hy + 3, 2, 5, earAngle - 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hx + 5, hy + 3, 2, 5, earAngle + 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  if (facing !== 'up') {
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(hx - 3, hy - 1, 2, 2);
    ctx.fillRect(hx + 1, hy - 1, 2, 2);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(hx - 3, hy - 1, 1, 1);
    ctx.fillRect(hx + 1, hy - 1, 1, 1);
  }

  // Nose
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(hx - 1, hy + 2, 2, 1);

  // Short tail
  const tailX = facing === 'left' ? cx + 8 : facing === 'right' ? cx - 8 : cx;
  ctx.fillStyle = C.juneWhite;
  ctx.fillRect(tailX - 1, by - 6, 2, 4);
}

export function drawGary(ctx, cx, cy, facing, frame, throwing) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pants
  ctx.fillStyle = C.garyPants;
  ctx.fillRect(cx - 5, cy - 10, 4, 10);
  ctx.fillRect(cx + 1, cy - 10, 4, 10);
  // Boots
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(cx - 6, cy - 2, 5, 3);
  ctx.fillRect(cx + 1, cy - 2, 5, 3);

  // Shirt
  ctx.fillStyle = C.garyShirt;
  ctx.fillRect(cx - 7, cy - 22, 14, 14);
  // Flannel lines
  ctx.fillStyle = '#546E7A';
  ctx.fillRect(cx - 3, cy - 22, 1, 14);
  ctx.fillRect(cx + 2, cy - 22, 1, 14);

  // Arms
  if (throwing) {
    // Throwing arm raised
    ctx.fillStyle = C.garyShirt;
    ctx.fillRect(cx - 10, cy - 28, 4, 10);
    ctx.fillStyle = C.garySkin;
    ctx.fillRect(cx - 10, cy - 30, 4, 3);
  } else {
    ctx.fillStyle = C.garyShirt;
    ctx.fillRect(cx - 10, cy - 18, 4, 8);
    ctx.fillRect(cx + 7, cy - 18, 4, 8);
    ctx.fillStyle = C.garySkin;
    ctx.fillRect(cx - 10, cy - 10, 4, 2);
    ctx.fillRect(cx + 7, cy - 10, 4, 2);
  }

  // Head
  ctx.fillStyle = C.garySkin;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 28, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wild hair
  ctx.fillStyle = C.garyHair;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 34, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Spiky bits
  ctx.fillRect(cx - 8, cy - 37, 3, 4);
  ctx.fillRect(cx + 5, cy - 37, 3, 4);
  ctx.fillRect(cx - 2, cy - 39, 4, 3);

  // Face
  if (facing !== 'up') {
    // Crazy eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(cx - 4, cy - 30, 3, 3);
    ctx.fillRect(cx + 1, cy - 30, 3, 3);
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(cx - 3, cy - 29, 2, 2);
    ctx.fillRect(cx + 2, cy - 29, 2, 2);
    // Crazy grin
    ctx.fillStyle = throwing ? C.garyMouth : '#FFF';
    ctx.fillRect(cx - 3, cy - 25, 6, 2);
    if (!throwing) {
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(cx - 3, cy - 25, 1, 2);
      ctx.fillRect(cx + 2, cy - 25, 1, 2);
    }
  }
}

// ===== ISOMETRIC VEHICLE DRAWING =====
// Helper: outlined iso box (bold 2px black outline like pixel art references)
function outlinedIsoBox(ctx, cx, cy, w, h, d, top, left, right) {
  const hw = w / 2, hd = d / 2;
  // Fill faces
  // Top
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(cx, cy-h-hd); ctx.lineTo(cx+hw, cy-h); ctx.lineTo(cx, cy-h+hd); ctx.lineTo(cx-hw, cy-h);
  ctx.closePath(); ctx.fill();
  // Left
  ctx.fillStyle = left;
  ctx.beginPath();
  ctx.moveTo(cx-hw, cy-h); ctx.lineTo(cx, cy-h+hd); ctx.lineTo(cx, cy+hd); ctx.lineTo(cx-hw, cy);
  ctx.closePath(); ctx.fill();
  // Right
  ctx.fillStyle = right;
  ctx.beginPath();
  ctx.moveTo(cx+hw, cy-h); ctx.lineTo(cx, cy-h+hd); ctx.lineTo(cx, cy+hd); ctx.lineTo(cx+hw, cy);
  ctx.closePath(); ctx.fill();
  // Bold outline
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
  // Top face outline
  ctx.beginPath();
  ctx.moveTo(cx, cy-h-hd); ctx.lineTo(cx+hw, cy-h); ctx.lineTo(cx, cy-h+hd); ctx.lineTo(cx-hw, cy-h);
  ctx.closePath(); ctx.stroke();
  // Left edge
  ctx.beginPath(); ctx.moveTo(cx-hw, cy-h); ctx.lineTo(cx-hw, cy); ctx.lineTo(cx, cy+hd); ctx.stroke();
  // Right edge
  ctx.beginPath(); ctx.moveTo(cx+hw, cy-h); ctx.lineTo(cx+hw, cy); ctx.lineTo(cx, cy+hd); ctx.stroke();
  // Front edge
  ctx.beginPath(); ctx.moveTo(cx, cy-h+hd); ctx.lineTo(cx, cy+hd); ctx.stroke();
}

// Iso wheel helper
function isoWheel(ctx, cx, cy, r) {
  ctx.fillStyle = '#1A1A1A'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#666';
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.45, r * 0.25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#999';
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.2, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawIsoCar(ctx, cx, cy, color = '#F57C00') {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(cx + 3, cy + 6, 28, 13, 0, 0, Math.PI * 2); ctx.fill();
  // Wheels (behind body)
  isoWheel(ctx, cx - 17, cy + 2, 6);
  isoWheel(ctx, cx + 17, cy + 2, 6);
  // Body (main lower box)
  outlinedIsoBox(ctx, cx, cy, 54, 12, 28, color, darken(color, 0.82), darken(color, 0.65));
  // Bumper trim
  ctx.fillStyle = '#9E9E9E';
  ctx.beginPath();
  ctx.moveTo(cx + 27, cy - 12); ctx.lineTo(cx + 27, cy - 9);
  ctx.lineTo(cx, cy - 9 + 14); ctx.lineTo(cx, cy - 12 + 14); ctx.closePath(); ctx.fill();
  // Cabin/roof (set back, smaller)
  outlinedIsoBox(ctx, cx - 2, cy - 12, 36, 10, 20, '#263238', '#1B1B1B', '#111');
  // Front windshield (left face of cabin)
  ctx.fillStyle = '#4DD0E1';
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 22); ctx.lineTo(cx - 2, cy - 22 + 10);
  ctx.lineTo(cx - 2, cy - 14 + 10); ctx.lineTo(cx - 20, cy - 14); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.stroke();
  // Side window (right face)
  ctx.fillStyle = '#4DD0E1';
  ctx.beginPath();
  ctx.moveTo(cx + 16, cy - 22); ctx.lineTo(cx - 2, cy - 22 + 10);
  ctx.lineTo(cx - 2, cy - 14 + 10); ctx.lineTo(cx + 16, cy - 14); ctx.closePath(); ctx.fill();
  ctx.stroke();
  // Window divider
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 7, cy - 20); ctx.lineTo(cx + 7, cy - 12); ctx.stroke();
  // Headlights
  ctx.fillStyle = '#FFF9C4';
  ctx.fillRect(cx + 22, cy - 5, 4, 3);
  ctx.fillStyle = '#FFCC80';
  ctx.fillRect(cx - 26, cy - 5, 4, 3);
  // Taillights
  ctx.fillStyle = '#E53935';
  ctx.fillRect(cx - 26, cy - 2, 3, 2);
}

export function drawIsoBoat(ctx, cx, cy) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(cx, cy + 6, 30, 14, 0, 0, Math.PI * 2); ctx.fill();
  // Hull - pointed bow shape
  ctx.fillStyle = '#F5F0E0';
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy - 4);  // bow point
  ctx.lineTo(cx + 8, cy - 14);  // top right
  ctx.lineTo(cx - 24, cy - 6);  // top left (stern)
  ctx.lineTo(cx - 24, cy + 4);  // bottom left
  ctx.lineTo(cx + 8, cy + 12);  // bottom right
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2; ctx.stroke();
  // Waterline (dark bottom)
  ctx.fillStyle = '#5D4037';
  ctx.beginPath();
  ctx.moveTo(cx + 28, cy);
  ctx.lineTo(cx + 8, cy + 10);
  ctx.lineTo(cx - 22, cy + 2);
  ctx.lineTo(cx - 22, cy + 4);
  ctx.lineTo(cx + 8, cy + 12);
  ctx.lineTo(cx + 30, cy + 1);
  ctx.closePath(); ctx.fill();
  // Deck details - seats
  ctx.fillStyle = '#8D6E63';
  outlinedIsoBox(ctx, cx - 6, cy - 3, 14, 5, 8, '#A1887F', '#8D6E63', '#795548');
  outlinedIsoBox(ctx, cx - 16, cy - 3, 10, 5, 6, '#A1887F', '#8D6E63', '#795548');
  // Console/windshield
  outlinedIsoBox(ctx, cx + 4, cy - 6, 10, 8, 6, '#78909C', '#546E7A', '#455A64');
  // Outboard motor
  ctx.fillStyle = '#333';
  ctx.fillRect(cx - 26, cy - 4, 5, 8);
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 26, cy - 4, 5, 8);
  ctx.fillStyle = '#555';
  ctx.fillRect(cx - 27, cy + 2, 3, 6);
}

export function drawIsoRV(ctx, cx, cy) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(cx + 2, cy + 6, 32, 16, 0, 0, Math.PI * 2); ctx.fill();
  // Wheels
  isoWheel(ctx, cx - 20, cy + 2, 6);
  isoWheel(ctx, cx + 20, cy + 2, 6);
  // Main body - large boxy (warm tan/brown like reference)
  outlinedIsoBox(ctx, cx, cy, 60, 26, 30, '#D4A574', '#B8845A', '#9C6E42');
  // Lighter upper band
  ctx.fillStyle = '#E8C9A0';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 26 - 15); ctx.lineTo(cx + 30, cy - 26);
  ctx.lineTo(cx + 30, cy - 18); ctx.lineTo(cx, cy - 18 - 15);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#DEBB90';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 26 - 15); ctx.lineTo(cx - 30, cy - 26);
  ctx.lineTo(cx - 30, cy - 18); ctx.lineTo(cx, cy - 18 - 15);
  ctx.closePath(); ctx.fill();
  // Roof boxes (AC/luggage)
  outlinedIsoBox(ctx, cx - 6, cy - 26, 20, 4, 12, '#BFA882', '#A08C6E', '#8A7A5E');
  outlinedIsoBox(ctx, cx + 10, cy - 26, 14, 3, 8, '#BFA882', '#A08C6E', '#8A7A5E');
  // Windows (left face - front)
  ctx.fillStyle = '#4DD0E1';
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 22); ctx.lineTo(cx - 18, cy - 22 + 5);
  ctx.lineTo(cx - 18, cy - 16 + 5); ctx.lineTo(cx - 28, cy - 16); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.stroke();
  // Windows (right face - side)
  for (let i = 0; i < 3; i++) {
    const wx = cx + 6 + i * 10;
    const wy = cy - 22 + i * 5;
    ctx.fillStyle = '#4DD0E1';
    ctx.fillRect(wx, wy, 6, 5);
    ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1;
    ctx.strokeRect(wx, wy, 6, 5);
  }
  // Door (right face)
  ctx.fillStyle = '#9C6E42';
  ctx.fillRect(cx + 24, cy - 16, 4, 12);
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1;
  ctx.strokeRect(cx + 24, cy - 16, 4, 12);
  // Bumper
  ctx.fillStyle = '#888';
  ctx.fillRect(cx - 30, cy - 2, 4, 3);
  ctx.fillRect(cx + 27, cy - 2, 4, 3);
}

export function drawIsoTrailer(ctx, cx, cy) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(cx, cy + 4, 24, 12, 0, 0, Math.PI * 2); ctx.fill();
  // Wheel
  isoWheel(ctx, cx - 10, cy + 2, 5);
  // Body - rounded camper style (yellow/lavender like reference)
  outlinedIsoBox(ctx, cx, cy, 46, 18, 24, '#E8D8E8', '#D0B8D0', '#B8A0B8');
  // Yellow lower half (left face)
  ctx.fillStyle = '#FFB300';
  ctx.beginPath();
  ctx.moveTo(cx - 23, cy - 8); ctx.lineTo(cx, cy - 8 + 12);
  ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 23, cy); ctx.closePath(); ctx.fill();
  // Yellow lower (right face)
  ctx.fillStyle = '#F9A825';
  ctx.beginPath();
  ctx.moveTo(cx + 23, cy - 8); ctx.lineTo(cx, cy - 8 + 12);
  ctx.lineTo(cx, cy + 12); ctx.lineTo(cx + 23, cy); ctx.closePath(); ctx.fill();
  // Outline on yellow
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - 23, cy - 8); ctx.lineTo(cx - 23, cy); ctx.lineTo(cx, cy + 12);
  ctx.lineTo(cx + 23, cy); ctx.lineTo(cx + 23, cy - 8); ctx.stroke();
  // Window (big, left face)
  ctx.fillStyle = '#546E7A';
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy - 16); ctx.lineTo(cx - 6, cy - 16 + 6);
  ctx.lineTo(cx - 6, cy - 10 + 6); ctx.lineTo(cx - 18, cy - 10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.stroke();
  // Small round window (right face)
  ctx.fillStyle = '#546E7A';
  ctx.beginPath(); ctx.ellipse(cx + 10, cy - 14, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.stroke();
  // Hitch bar
  ctx.fillStyle = '#333';
  ctx.fillRect(cx + 23, cy - 1, 10, 2);
  ctx.fillRect(cx + 31, cy - 4, 3, 8);
  // Door
  ctx.fillStyle = '#D0A030';
  ctx.fillRect(cx + 16, cy - 14, 4, 10);
  ctx.strokeStyle = '#1A1A1A'; ctx.strokeRect(cx + 16, cy - 14, 4, 10);
}

export function drawIsoMotorcycle(ctx, cx, cy) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(cx, cy + 3, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
  // Wheels
  isoWheel(ctx, cx - 10, cy + 1, 6);
  isoWheel(ctx, cx + 10, cy + 1, 6);
  // Frame (diagonal bar)
  ctx.fillStyle = '#D32F2F'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 6, cy - 1); ctx.lineTo(cx + 8, cy - 7);
  ctx.lineTo(cx + 8, cy - 3); ctx.lineTo(cx - 6, cy + 3); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Engine block
  outlinedIsoBox(ctx, cx - 2, cy - 1, 10, 6, 6, '#555', '#444', '#333');
  // Gas tank (on top of frame)
  ctx.fillStyle = '#E53935';
  ctx.beginPath(); ctx.ellipse(cx + 2, cy - 8, 6, 3.5, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5; ctx.stroke();
  // Seat
  ctx.fillStyle = '#3E2723';
  ctx.beginPath(); ctx.ellipse(cx - 4, cy - 8, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1; ctx.stroke();
  // Handlebars
  ctx.strokeStyle = '#888'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 9, cy - 12); ctx.lineTo(cx + 9, cy - 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 5, cy - 13); ctx.lineTo(cx + 13, cy - 13); ctx.stroke();
  // Headlight
  ctx.fillStyle = '#FFF9C4';
  ctx.beginPath(); ctx.ellipse(cx + 10, cy - 5, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
  // Exhaust pipe
  ctx.fillStyle = '#777';
  ctx.fillRect(cx - 10, cy - 2, 6, 2);
  ctx.fillStyle = '#555';
  ctx.fillRect(cx - 12, cy - 1, 3, 2);
}

export function drawIsoTree(ctx, cx, cy) {
  // Trunk
  ctx.fillStyle = C.trunk;
  ctx.fillRect(cx - 2, cy - 12, 4, 14);
  // Foliage layers (triangular evergreen)
  const layers = [[16, -36], [13, -28], [10, -20]];
  for (const [w, y] of layers) {
    ctx.fillStyle = C.treeDark;
    ctx.beginPath();
    ctx.moveTo(cx, cy + y);
    ctx.lineTo(cx - w, cy + y + 14);
    ctx.lineTo(cx + w, cy + y + 14);
    ctx.closePath();
    ctx.fill();
    // Lighter side
    ctx.fillStyle = C.treeLight;
    ctx.beginPath();
    ctx.moveTo(cx + 1, cy + y + 2);
    ctx.lineTo(cx + w - 2, cy + y + 13);
    ctx.lineTo(cx + 1, cy + y + 10);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawTrashCanIso(ctx, cx, cy) {
  // Body with vertical ridges
  outlinedIsoBox(ctx, cx, cy, 14, 14, 10, '#90A4AE', '#78909C', '#607D8B');
  // Ridges on left face
  ctx.strokeStyle = '#607D8B'; ctx.lineWidth = 1;
  for (let i = -4; i <= 4; i += 2) {
    ctx.beginPath(); ctx.moveTo(cx + i - 3, cy - 12); ctx.lineTo(cx + i - 3, cy); ctx.stroke();
  }
  // Lid with handle
  ctx.fillStyle = '#B0BEC5';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 12 - 4);
  ctx.lineTo(cx + 7, cy - 12);
  ctx.lineTo(cx, cy - 12 + 4);
  ctx.lineTo(cx - 7, cy - 12);
  ctx.closePath();
  ctx.fill();
}

export function drawBoneIso(ctx, cx, cy, frame) {
  const bob = Math.sin(frame * 0.08) * 2;
  const y = cy - 4 + bob;
  ctx.fillStyle = C.bone;
  // Bone shape
  ctx.beginPath();
  ctx.ellipse(cx - 4, y - 1, 2, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 4, y - 1, 2, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - 4, y + 1, 2, 2, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 4, y + 1, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 3, y - 1, 6, 3);
  // Glow
  ctx.fillStyle = `rgba(255,215,64,${0.2 + Math.sin(frame * 0.1) * 0.15})`;
  ctx.beginPath();
  ctx.ellipse(cx, y, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Color utility
function darken(hex, amount = 0.8) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.floor(r * amount)},${Math.floor(g * amount)},${Math.floor(b * amount)})`;
}
