const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fallbackScene() {
  const calls = [];
  const sandbox = {
    window: {},
    RenderKit: {
      glyph(_ctx, _glyph, x, y, size, alpha) {
        calls.push({ x, y, size, alpha });
      }
    }
  };
  vm.runInNewContext(fs.readFileSync(`${__dirname}/gpu-scene.js`, 'utf8'), sandbox);
  const scene = Object.create(sandbox.window.GlyphScene.prototype);
  let clears = 0;
  scene.overlay = { width: 300, height: 300, getContext: () => ({ clearRect: () => clears++ }) };
  scene.points = Array.from({ length: 600 }, (_,i) => ({ x: Math.cos(i), y: Math.sin(i), z: .2, g: i }));
  const options = { w: 1000, h: 800, cx: 600, cy: 400, base: 100, rotation: .4, tilt: .2, time: 1 };
  return { scene, calls, options, clears: () => clears };
}

test('Canvas renders all journey phases without shadowed-variable failures', () => {
  const { scene, calls, options } = fallbackScene();
  for (const p of [0, .35, .5, .7, .92, 1]) {
    scene.fallback({ ...options, journey: true, p });
  }
  assert.ok(calls.length > 0);
  assert.ok(calls.every(c => [c.x,c.y,c.size,c.alpha].every(Number.isFinite)));
});

test('Canvas renders each morph endpoint and clears the previous frame', () => {
  const { scene, calls, options, clears } = fallbackScene();
  for (const form of [0, .5, 1, 1.5, 2, 2.5, 3]) scene.render({ ...options, form });
  assert.equal(clears(), 7);
  assert.ok(calls.length > 0);
  assert.ok(calls.every(c => [c.x,c.y,c.size,c.alpha].every(Number.isFinite)));
});
