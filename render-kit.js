(() => {
  'use strict';
  const profile = new URL(location.href).searchParams.has('profile');
  const glyphs = '01アイウエオカキクケコサシスセソタチツテト{}<>/';
  const metrics = {};
  let metricsNode;
  if (profile) {
    metricsNode = document.createElement('meta');
    metricsNode.name = 'render-profile';
    metricsNode.content = '{}';
    document.head.append(metricsNode);
  }
  const atlases = new Map();
  function atlas(human) {
    if (atlases.has(human)) return atlases.get(human);
    const sheet = document.createElement('canvas');
    const cell = 20, levels = 5;
    sheet.width = glyphs.length * cell;
    sheet.height = levels * cell;
    const c = sheet.getContext('2d');
    c.font = '14px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
    // Bake the soft phosphor halo once, rather than filtering animated layers.
    c.shadowColor = human ? 'transparent' : 'rgba(181,255,60,.5)';
    c.shadowBlur = human ? 0 : 2;
    for (let level = 0; level < levels; level++) {
      c.fillStyle = human ? `rgba(145,67,39,${(level+1)/levels})` : `rgba(181,255,60,${(level+1)/levels})`;
      for (let i = 0; i < glyphs.length; i++) c.fillText(glyphs[i], i*cell+cell/2, level*cell+cell/2);
    }
    atlases.set(human, sheet);
    return sheet;
  }
  function glyph(ctx, index, x, y, size, opacity, human = false) {
    if (opacity < .1 || size <= 0) return;
    const level = Math.min(4, Math.max(0, Math.round(opacity*5)-1));
    const box = size*1.5;
    ctx.drawImage(atlas(human), index % glyphs.length * 20, level*20, 20, 20, x-box/2, y-box/2, box, box);
  }
  function record(name, ms) {
    if (!profile) return;
    const entry = metrics[name] || (metrics[name] = {samples: [], times: [], count: 0});
    entry.count++; entry.samples.push(ms); entry.times.push(performance.now());
    if (entry.samples.length > 180) {entry.samples.shift();entry.times.shift();}
    if (entry.count === 1 || entry.count % 30 === 0) metricsNode.content = JSON.stringify(metrics);
  }
  function flush() { if (profile) metricsNode.content = JSON.stringify(metrics); }
  window.RenderKit = {glyphs, glyph, atlas, profile, record, flush, interval: 1000/30};
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('effects-visible', entry.isIntersecting);
    });
    document.querySelectorAll('.ticker,.weather-visual,.index-visual').forEach(el => observer.observe(el));
  });
})();
