// ==================== INPUT (ISOMETRIC) ====================
const keys = {};
const touches = { up: false, down: false, left: false, right: false, bark: false };

document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

export function setupTouchControls() {
  const map = {
    'btn-up': 'up', 'btn-down': 'down',
    'btn-left': 'left', 'btn-right': 'right',
    'btn-bark': 'bark',
  };
  for (const [id, action] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (!el) continue;
    const press = e => { e.preventDefault(); touches[action] = true; };
    const release = e => { e.preventDefault(); touches[action] = false; };
    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release, { passive: false });
    el.addEventListener('touchcancel', release, { passive: false });
    el.addEventListener('mousedown', press);
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', release);
  }
}

export function getInput() {
  return {
    up: keys['ArrowUp'] || keys['KeyW'] || touches.up,
    down: keys['ArrowDown'] || keys['KeyS'] || touches.down,
    left: keys['ArrowLeft'] || keys['KeyA'] || touches.left,
    right: keys['ArrowRight'] || keys['KeyD'] || touches.right,
    bark: keys['KeyB'] || keys['ShiftLeft'] || keys['ShiftRight'] || touches.bark,
  };
}

const prevKeys = {};
export function getKeyJustPressed() {
  const result = {};
  for (const code of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','KeyA','KeyD','KeyW','KeyS','Escape','KeyM']) {
    result[code] = keys[code] && !prevKeys[code];
    prevKeys[code] = keys[code];
  }
  return result;
}
