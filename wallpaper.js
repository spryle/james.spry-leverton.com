// Triangle wallpaper — a faithful port of the 2014 site's canvas background.
//
// A grid of equilateral-right-triangles is split into two sets of diagonal
// stripes (X-axis = NE-SW, Y-axis = NW-SE). On each "paint" pass a colour
// scheme is generated; a band of stripes in each axis is then painted with
// a random gradient from that scheme. Where two painted stripes intersect
// on a triangle, the colours are mixed in RGB. Everything else stays at
// the dark default. The whole canvas is transparent over a dark page
// background so the per-stripe alpha jitter (0.97–1.00) bleeds through
// subtly — the trick that gives the original its texture.

const SIZE = 30;
const GRADIENT_STEPS = 20;
const SCREEN_OVERSCAN = 1.05;
const TRANSITION_MS = 150;

// X-stripes run NW-SE (BR ↔ TL), Y-stripes run NE-SW (TR ↔ BL).
// Painted-stripe counts per repaint:
const X_COUNT_MIN = 6;
const X_COUNT_MAX = 8;
const Y_COUNT_MIN = 4;
const Y_COUNT_MAX = 6;

const DEFAULT_RGB = { r: 0x1a, g: 0x1a, b: 0x1a };

const SCHEMES = ['mono', 'analogic'];
const VARIATIONS = ['pastel', 'soft', 'pale'];

// Saturation / value pairs from color-scheme-js — four S/V tuples per hue
// group, defining the four colour stops generated for each hue.
const VARIATION_PRESETS = {
  pastel: [
    { s: 0.5, v: 1.0 },
    { s: 0.5, v: 0.9 },
    { s: 0.5, v: 1.0 },
    { s: 0.5, v: 0.5 },
  ],
  soft: [
    { s: 0.3, v: 0.8 },
    { s: 0.3, v: 0.7 },
    { s: 0.5, v: 0.6 },
    { s: 0.6, v: 0.4 },
  ],
  pale: [
    { s: 0.1, v: 1.0 },
    { s: 0.1, v: 0.85 },
    { s: 0.1, v: 1.0 },
    { s: 0.5, v: 0.5 },
  ],
};

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// ---------- colour conversions ----------

function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp < 1) { r1 = c; g1 = x; }
  else if (hp < 2) { r1 = x; g1 = c; }
  else if (hp < 3) { g1 = c; b1 = x; }
  else if (hp < 4) { g1 = x; b1 = c; }
  else if (hp < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = v - c;
  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const conv = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: conv(hk + 1 / 3) * 255,
    g: conv(hk) * 255,
    b: conv(hk - 1 / 3) * 255,
  };
}

function darken(rgb, amount) {
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hslToRgb(h, s, l * (1 - amount));
}

// ---------- scheme + gradient ----------

function buildScheme({ hue, scheme, distance, variation }) {
  // mono = 1 hue, analogic = 3 adjacent hues offset by ±distance*60°.
  const offsets =
    scheme === 'analogic'
      ? [0, distance * 60, -distance * 60]
      : [0];
  const preset = VARIATION_PRESETS[variation];
  const colors = [];
  for (const offset of offsets) {
    const h = hue + offset;
    for (const { s, v } of preset) {
      colors.push(hsvToRgb(h, s, v));
    }
  }
  return colors.map((c) => ({
    gradient: rgbGradient(c, darken(c, 0.3), darken(c, 0.6), GRADIENT_STEPS),
    additive: true,
  }));
}

function rgbGradient(c0, c1, c2, steps) {
  const out = new Array(steps);
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    let a;
    let b;
    let local;
    if (t < 0.5) {
      a = c0;
      b = c1;
      local = t * 2;
    } else {
      a = c1;
      b = c2;
      local = (t - 0.5) * 2;
    }
    out[i] = {
      r: a.r + (b.r - a.r) * local,
      g: a.g + (b.g - a.g) * local,
      b: a.b + (b.b - a.b) * local,
    };
  }
  return out;
}

function randomSchemeOptions() {
  return {
    hue: randomNonBrownHue(),
    scheme: SCHEMES[Math.floor(Math.random() * SCHEMES.length)],
    distance: 0.3 + Math.random() * 0.4,
    variation: VARIATIONS[Math.floor(Math.random() * VARIATIONS.length)],
  };
}

function randomNonBrownHue() {
  // Skip the red-orange → yellow band where soft/pale darkened stops
  // render as brown / mud and the whole palette feels dingy.
  let hue;
  do {
    hue = 1 + Math.floor(Math.random() * 360);
  } while (hue >= 15 && hue <= 50);
  return hue;
}

// ---------- triangle geometry ----------

const xDiagonalId = (col, row) => Math.floor((row - col * 2 - 1) / 4);
const yDiagonalId = (col, row) => Math.floor((row + col * 2 + 1) / 4);

function rotation(col, row) {
  return col % 2
    ? ['tl', 'br', 'tr', 'bl'][row % 4]
    : ['tr', 'bl', 'tl', 'br'][row % 4];
}

function trianglePath(ctx, x, y, size, rot) {
  ctx.beginPath();
  switch (rot) {
    case 'tl':
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      break;
    case 'tr':
      ctx.moveTo(x + size, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y);
      break;
    case 'bl':
      ctx.moveTo(x, y + size);
      ctx.lineTo(x, y);
      ctx.lineTo(x + size, y + size);
      break;
    case 'br':
      ctx.moveTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x + size, y);
      break;
  }
  ctx.closePath();
}

// ---------- random helpers ----------

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function collectIds(map, start, end) {
  const out = [];
  for (let id = start; id <= end; id++) {
    if (map.has(id)) out.push(id);
  }
  return out;
}

function pickRandom(arr, n) {
  // Fisher-Yates partial shuffle: returns up to n distinct items from arr.
  const a = arr.slice();
  const out = [];
  const take = Math.min(n, a.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(Math.random() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
    out.push(a[i]);
  }
  return out;
}

// ---------- emphasis ----------

function publishEmphasis(scheme) {
  // Pick the most colourful *light* colour — score every stop in
  // every gradient by chroma × brightness², so a saturated colour
  // wins but a dark/dingy one loses to a bright one of similar hue.
  let best = scheme[0].gradient[0];
  let bestScore = colourfulness(best);
  for (const stripe of scheme) {
    for (const c of stripe.gradient) {
      const s = colourfulness(c);
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
  }
  document.documentElement.style.setProperty(
    '--emphasis-color',
    `rgb(${Math.round(best.r)},${Math.round(best.g)},${Math.round(best.b)})`
  );
}

function colourfulness(c) {
  const max = Math.max(c.r, c.g, c.b);
  const min = Math.min(c.r, c.g, c.b);
  return (max - min) * max * max;
}

// ---------- wallpaper ----------

class Wallpaper {
  constructor(canvas) {
    this.canvas = canvas;
    this.panel = canvas.parentElement;
    this.ctx = canvas.getContext('2d');

    this.options = randomSchemeOptions();
    this.scheme = buildScheme(this.options);
    publishEmphasis(this.scheme);

    this.triangles = [];
    this.diagonals = { x: new Map(), y: new Map() };
    this.painted = { x: new Map(), y: new Map() };

    this.transitioning = false;

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.handleResize();

    new ResizeObserver(this.handleResize).observe(this.panel);
    this.panel.addEventListener('click', this.handleClick);
  }

  // -- layout --

  handleResize() {
    const rect = this.panel.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.dpr = window.devicePixelRatio || 1;
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
    this.canvas.width = Math.floor(rect.width * this.dpr);
    this.canvas.height = Math.floor(rect.height * this.dpr);

    this.size = SIZE;
    this.numX = Math.ceil((rect.width * SCREEN_OVERSCAN) / this.size);
    this.numY = Math.ceil((rect.height * SCREEN_OVERSCAN) / this.size);

    this.buildGrid();
    this.applyPaint();
    this.render();
  }

  buildGrid() {
    this.triangles.length = 0;
    this.diagonals.x.clear();
    this.diagonals.y.clear();

    for (let col = 0; col < this.numX; col++) {
      for (let row = 0; row < this.numY * 2; row++) {
        const xId = xDiagonalId(col, row);
        const yId = yDiagonalId(col, row);
        const tri = {
          col,
          row,
          x: col * this.size,
          y: Math.floor(row / 2) * this.size,
          rot: rotation(col, row),
          xId,
          yId,
          xPos: 0,
          xLen: 0,
          yPos: 0,
          yLen: 0,
        };
        this.triangles.push(tri);
        if (!this.diagonals.x.has(xId)) this.diagonals.x.set(xId, []);
        if (!this.diagonals.y.has(yId)) this.diagonals.y.set(yId, []);
        this.diagonals.x.get(xId).push(tri);
        this.diagonals.y.get(yId).push(tri);
      }
    }

    for (const arr of this.diagonals.x.values()) {
      arr.sort((a, b) => a.col - b.col);
      arr.forEach((t, i) => {
        t.xPos = i;
        t.xLen = arr.length;
      });
    }
    for (const arr of this.diagonals.y.values()) {
      arr.sort((a, b) => a.row - b.row);
      arr.forEach((t, i) => {
        t.yPos = i;
        t.yLen = arr.length;
      });
    }
  }

  // -- paint --

  applyPaint() {
    this.painted.x.clear();
    this.painted.y.clear();

    // Anchor both painted bands at the bottom-right corner so the
    // pattern emanates from there. The bands extend along their
    // respective diagonals toward the upper-left.
    const brCol = this.numX - 1;
    const brRow = this.numY * 2 - 1;
    const xIdBR = xDiagonalId(brCol, brRow);
    const yIdBR = yDiagonalId(brCol, brRow);
    const bandWidth = Math.ceil(this.numX / 4);

    const xCandidates = collectIds(
      this.diagonals.x,
      xIdBR,
      xIdBR + bandWidth
    );
    const yCandidates = collectIds(
      this.diagonals.y,
      yIdBR - bandWidth,
      yIdBR
    );

    const xCount = randomInt(X_COUNT_MIN, X_COUNT_MAX);
    const yCount = randomInt(Y_COUNT_MIN, Y_COUNT_MAX);

    for (const id of pickRandom(xCandidates, xCount)) {
      this.painted.x.set(id, this.makeStripe());
    }
    for (const id of pickRandom(yCandidates, yCount)) {
      this.painted.y.set(id, this.makeStripe());
    }
  }

  makeStripe() {
    const sample = this.scheme[Math.floor(Math.random() * this.scheme.length)];
    return {
      gradient: sample.gradient,
      additive: sample.additive,
      alpha: (97 + Math.floor(Math.random() * 4)) / 100,
    };
  }

  // -- render --

  render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    for (let i = 0; i < this.triangles.length; i++) {
      const tri = this.triangles[i];
      ctx.fillStyle = this.triangleFill(tri);
      trianglePath(ctx, tri.x, tri.y, this.size, tri.rot);
      ctx.fill();
    }
  }

  triangleFill(tri) {
    const xStripe = this.painted.x.get(tri.xId);
    const yStripe = this.painted.y.get(tri.yId);

    if (!xStripe && !yStripe) {
      return `rgb(${DEFAULT_RGB.r},${DEFAULT_RGB.g},${DEFAULT_RGB.b})`;
    }

    const xCol = xStripe ? sampleStripe(xStripe, tri.xPos, tri.xLen) : null;
    const yCol = yStripe ? sampleStripe(yStripe, tri.yPos, tri.yLen) : null;

    let final;
    if (xCol && yCol) {
      final = {
        r: (xCol.r + yCol.r) / 2,
        g: (xCol.g + yCol.g) / 2,
        b: (xCol.b + yCol.b) / 2,
        a: (xCol.a + yCol.a) / 2,
      };
    } else {
      final = xCol || yCol;
    }

    return `rgba(${Math.round(final.r)},${Math.round(final.g)},${Math.round(
      final.b
    )},${final.a.toFixed(3)})`;
  }

  // -- interaction --

  handleClick() {
    if (this.transitioning) return;
    if (prefersReducedMotion) {
      this.repaint();
      return;
    }
    this.transitioning = true;
    this.panel.classList.add('is-repainting');
    window.setTimeout(() => {
      this.repaint();
      this.panel.classList.remove('is-repainting');
      window.setTimeout(() => {
        this.transitioning = false;
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }

  repaint() {
    this.options = randomSchemeOptions();
    this.scheme = buildScheme(this.options);
    publishEmphasis(this.scheme);
    this.applyPaint();
    this.render();
  }
}

function sampleStripe(stripe, pos, len) {
  const slot = Math.floor(pos / (len / stripe.gradient.length));
  const c = stripe.gradient[Math.min(slot, stripe.gradient.length - 1)];
  return { r: c.r, g: c.g, b: c.b, a: stripe.alpha };
}

// ---------- bootstrap ----------

function start() {
  const canvas = document.getElementById('wallpaper');
  if (!canvas) return;
  new Wallpaper(canvas);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () =>
    requestAnimationFrame(start)
  );
} else {
  requestAnimationFrame(start);
}
