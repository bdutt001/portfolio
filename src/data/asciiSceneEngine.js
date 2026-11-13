// asciiSceneEngine.js
// Framework-free 3D ASCII renderer. Unlike asciiLogoEngine.js (which extrudes the flat logo),
// this one rebuilds the logo as an actual 3D scene — a frog with headphones sitting at a laptop
// on a little desk — out of signed-distance shapes, then ray-marches it from a perspective camera
// that orbits the scene. Each pixel becomes a character (density = light) with a colour per material.
//
// World: +y up, the frog faces +x, the camera starts on +z (so angle 0 is the logo's side view).

const RAMP = " .:-=+*#%@";
const LEVELS = 5;
const { sqrt, abs, max, min, sin, cos, pow, floor } = Math;

// ───────────────────────────── scene description ─────────────────────────────
// Proportions are read off the original logo's profile (1 world unit ≈ 233 logo px).

// Torso + head: ONE smooth lofted solid instead of separate blobs, so the back runs in a single
// curve from the rump up to the top of the head, like the logo's silhouette.
// Each station: x, top of the body, bottom of the body, half-width (z).
const STATIONS = [
  [-1.1, 0.5, 0.36, 0.1],
  [-1.06, 0.62, 0.26, 0.3],
  [-0.97, 0.79, 0.15, 0.42],
  [-0.82, 1.01, 0.1, 0.5],
  [-0.6, 1.24, 0.09, 0.56],
  [-0.3, 1.5, 0.09, 0.66],
  [-0.1, 1.66, 0.1, 0.62],
  [0.12, 1.76, 0.1, 0.56],
  [0.33, 1.81, 0.12, 0.52],
  [0.45, 1.82, 0.2, 0.5],
  [0.55, 1.82, 0.46, 0.48],
  [0.65, 1.8, 0.78, 0.45],
  [0.85, 1.72, 0.92, 0.42],
  [1.06, 1.57, 1.0, 0.36],
  [1.17, 1.48, 1.08, 0.3],
  [1.27, 1.38, 1.18, 0.2],
  [1.32, 1.3, 1.24, 0.09],
];
const NT = 200;
const X0 = STATIONS[0][0];
const X1 = STATIONS[STATIONS.length - 1][0];
const TINV = (NT - 1) / (X1 - X0);
const TT = new Float64Array(NT), TB = new Float64Array(NT), TH = new Float64Array(NT), TS = new Float64Array(NT);
(function buildLoft() {
  // cubic Hermite through the stations (finite-difference tangents) → smooth profile curves
  const n = STATIONS.length;
  const tangent = (k, c) => {
    const a = STATIONS[max(k - 1, 0)], b = STATIONS[min(k + 1, n - 1)];
    return (b[c] - a[c]) / (b[0] - a[0]);
  };
  for (let i = 0; i < NT; i++) {
    const x = X0 + (i / (NT - 1)) * (X1 - X0);
    let k = 0;
    while (k < n - 2 && STATIONS[k + 1][0] < x) k++;
    const a = STATIONS[k], b = STATIONS[k + 1];
    const h = b[0] - a[0], t = (x - a[0]) / h;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
    const val = (c) => h00 * a[c] + h10 * h * tangent(k, c) + h01 * b[c] + h11 * h * tangent(k + 1, c);
    TT[i] = val(1); TB[i] = val(2); TH[i] = max(val(3), 0.02);
  }
  // distance-estimate safety factor: shrinks where the profile is steep
  for (let i = 0; i < NT; i++) {
    const j = min(i + 1, NT - 1), l = max(i - 1, 0);
    const dx = (j - l) / TINV;
    const s = max(abs(TT[j] - TT[l]), abs(TB[j] - TB[l]), abs(TH[j] - TH[l])) / dx;
    TS[i] = max(0.45, 1 / sqrt(1 + s * s));
  }
})();

// Extra frog parts (ellipsoids: cx,cy,cz, rx,ry,rz) blended into the torso
const ELL = [];
const ell = (cx, cy, cz, rx, ry, rz, mirror) => {
  ELL.push(cx, cy, cz, rx, ry, rz);
  if (mirror) ELL.push(cx, cy, -cz, rx, ry, rz);
};
ell(-0.66, 0.5, 0.46, 0.5, 0.4, 0.22, true); // thighs
ell(-0.38, 0.075, 0.5, 0.5, 0.075, 0.14, true); // hind feet
ell(1.08, 0.11, 0.3, 0.16, 0.055, 0.1, true); // front paws, resting on the keys
const EYE = { x: 0.6, y: 1.6, z: 0.5, r: 0.1 }; // in front of the headphone, on the side of the head
ell(EYE.x, EYE.y, EYE.z, EYE.r, EYE.r, EYE.r, true);
const NE = ELL.length / 6;

// Arms: capsules (ax,ay,az, bx,by,bz, r) — down from the shoulder, then forward onto the keyboard
const CAP = [];
const cap = (ax, ay, az, bx, by, bz, r, mirror) => {
  const pack = (s) => {
    const dx = bx - ax, dy = by - ay, dz = (bz - az) * s;
    CAP.push(ax, ay, az * s, bx, by, bz * s, r, 1 / (dx * dx + dy * dy + dz * dz));
  };
  pack(1);
  if (mirror) pack(-1);
};
cap(0.66, 0.95, 0.4, 0.7, 0.3, 0.4, 0.14, true); // upper arm
cap(0.7, 0.3, 0.38, 1.02, 0.13, 0.3, 0.1, true); // forearm
const NC = CAP.length / 8;

const FROG_BOUND = { x: 0.1, y: 0.95, z: 0, r: 1.65 };

// Headset: ear cups at the back of the head, band arcing over it (leaning forward like the logo)
const PH = { cx: -0.25, cy: 1.38, cz: 0.64, R: 0.33, hh: 0.15, A: 0.64, B: 0.75, r: 0.05, tilt: (38 * Math.PI) / 180 };
const PH_SIN = sin(PH.tilt), PH_COS = cos(PH.tilt);
const PH_BOUND = { x: -0.05, y: 1.55, z: 0, r: 1.05 };

// Laptop: faces the frog head-on (screen toward -x), keyboard under the paws
const LAP = { x: 1.3, z: 0, yaw: 0, hw: 0.62, hd: 0.45, tilt: (17 * Math.PI) / 180, sh: 0.46 };
const LU = [sin(LAP.yaw), cos(LAP.yaw)]; // width axis (x,z)
const LW = [-cos(LAP.yaw), sin(LAP.yaw)]; // toward the user / front (x,z)
const LAP_BOUND = { x: LAP.x, y: 0.5, z: LAP.z, r: 1.0 };
// screen frame inside the (w, v) plane
const HINGE_W = -LAP.hd + 0.02;
const HINGE_V = 0.06;
const SA = [-sin(LAP.tilt), cos(LAP.tilt)]; // along the screen (w, v)
const SN = [cos(LAP.tilt), sin(LAP.tilt)]; // screen normal (w, v)
const SC_W = HINGE_W + LAP.sh * SA[0];
const SC_V = HINGE_V + LAP.sh * SA[1];

// Desk
const DESK = { x: 0.45, z: 0, r: 2.1, h: 0.05 };

const SCENE_CENTER = { x: 0.45, y: 0.8, z: 0, r: 2.5 };

// ───────────────────────────── distance functions ─────────────────────────────

const smin = (a, b, k) => {
  const h = max(k - abs(a - b), 0) / k;
  return min(a, b) - h * h * k * 0.25;
};

// Lofted torso: at each x the cross-section is a squarish ellipse (superellipse, n = 2.5) between
// the top and bottom curves. (k0 − 1)·min(radius) is a safe lower bound of the true distance.
function torsoD(px, py, pz) {
  let f = (px - X0) * TINV;
  f = f < 0 ? 0 : f > NT - 1 ? NT - 1 : f;
  const i = f >= NT - 1 ? NT - 2 : f | 0;
  const u = f - i;
  const yT = TT[i] + (TT[i + 1] - TT[i]) * u;
  const yB = TB[i] + (TB[i + 1] - TB[i]) * u;
  const hz = TH[i] + (TH[i + 1] - TH[i]) * u;
  const hy = (yT - yB) * 0.5;
  const a = abs(py - (yT + yB) * 0.5) / hy;
  const b = abs(pz) / hz;
  const k0 = pow(a * a * sqrt(a) + b * b * sqrt(b), 0.4);
  let d = (k0 - 1) * min(hy, hz) * TS[i];
  const dx = px < X0 ? X0 - px : px > X1 ? px - X1 : 0;
  if (dx > 0) d = sqrt(max(d, 0) * max(d, 0) + dx * dx) + min(d, 0);
  return d;
}

function frogD(px, py, pz) {
  let d = torsoD(px, py, pz);
  for (let i = 0; i < NE; i++) {
    const o = i * 6;
    const rx = ELL[o + 3], ry = ELL[o + 4], rz = ELL[o + 5];
    const x = (px - ELL[o]) / rx, y = (py - ELL[o + 1]) / ry, z = (pz - ELL[o + 2]) / rz;
    const k0 = sqrt(x * x + y * y + z * z);
    const x2 = x / rx, y2 = y / ry, z2 = z / rz;
    const k1 = sqrt(x2 * x2 + y2 * y2 + z2 * z2) || 1e-9;
    d = smin(d, (k0 * (k0 - 1)) / k1, 0.12);
  }
  for (let i = 0; i < NC; i++) {
    const o = i * 8;
    const pax = px - CAP[o], pay = py - CAP[o + 1], paz = pz - CAP[o + 2];
    const bax = CAP[o + 3] - CAP[o], bay = CAP[o + 4] - CAP[o + 1], baz = CAP[o + 5] - CAP[o + 2];
    let h = (pax * bax + pay * bay + paz * baz) * CAP[o + 7];
    h = h < 0 ? 0 : h > 1 ? 1 : h;
    const qx = pax - bax * h, qy = pay - bay * h, qz = paz - baz * h;
    d = smin(d, sqrt(qx * qx + qy * qy + qz * qz) - CAP[o + 6], 0.08);
  }
  return d;
}

function cupD(px, py, pz) {
  const rx = px - PH.cx, ry = py - PH.cy;
  const rd = sqrt(rx * rx + ry * ry) - (PH.R - 0.03);
  const hd = abs(abs(pz) - PH.cz) - (PH.hh - 0.03);
  const a = max(rd, 0), b = max(hd, 0);
  return min(max(rd, hd), 0) + sqrt(a * a + b * b) - 0.03;
}
// band: upper half of an ellipse (semi-axes A across the head, B along the tilted "up" axis)
function bandD(px, py, pz) {
  const dx = px - PH.cx, dy = py - PH.cy;
  const b = dx * PH_SIN + dy * PH_COS; // along the band's up axis
  const c = dx * PH_COS - dy * PH_SIN; // out of the band's plane
  if (b < 0) {
    const a = abs(pz) - PH.A;
    return sqrt(c * c + b * b + a * a) - PH.r;
  }
  const qa = abs(pz) / PH.A, qb = b / PH.B;
  const k0 = sqrt(qa * qa + qb * qb);
  const k1 = sqrt((qa / PH.A) ** 2 + (qb / PH.B) ** 2) || 1e-9;
  const d2 = abs((k0 * (k0 - 1)) / k1);
  return sqrt(d2 * d2 + c * c) - PH.r;
}
const phonesD = (x, y, z) => min(cupD(x, y, z), bandD(x, y, z));

// laptop-local coordinates: u across, w toward the user (front), v up
function laptopParts(px, py, pz) {
  const rx = px - LAP.x, rz = pz - LAP.z;
  const u = rx * LU[0] + rz * LU[1];
  const w = rx * LW[0] + rz * LW[1];
  // base slab
  let qx = abs(u) - (LAP.hw - 0.02), qy = abs(py - 0.03) - 0.01, qz = abs(w) - (LAP.hd - 0.02);
  const base = sqrt(max(qx, 0) ** 2 + max(qy, 0) ** 2 + max(qz, 0) ** 2) + min(max(qx, qy, qz), 0) - 0.02;
  // screen slab
  const dw = w - SC_W, dv = py - SC_V;
  const along = dw * SA[0] + dv * SA[1];
  const nrm = dw * SN[0] + dv * SN[1];
  qx = abs(u) - (LAP.hw - 0.015);
  qy = abs(along) - (LAP.sh - 0.015);
  qz = abs(nrm) - 0.012;
  const screen = sqrt(max(qx, 0) ** 2 + max(qy, 0) ** 2 + max(qz, 0) ** 2) + min(max(qx, qy, qz), 0) - 0.015;
  return [base, screen, u, along, nrm];
}
function laptopD(px, py, pz) {
  const rx = px - LAP.x, rz = pz - LAP.z;
  const u = rx * LU[0] + rz * LU[1];
  const w = rx * LW[0] + rz * LW[1];
  let qx = abs(u) - (LAP.hw - 0.02), qy = abs(py - 0.03) - 0.01, qz = abs(w) - (LAP.hd - 0.02);
  const base = sqrt(max(qx, 0) ** 2 + max(qy, 0) ** 2 + max(qz, 0) ** 2) + min(max(qx, qy, qz), 0) - 0.02;
  const dw = w - SC_W, dv = py - SC_V;
  const along = dw * SA[0] + dv * SA[1];
  const nrm = dw * SN[0] + dv * SN[1];
  qx = abs(u) - (LAP.hw - 0.015);
  qy = abs(along) - (LAP.sh - 0.015);
  qz = abs(nrm) - 0.012;
  const screen = sqrt(max(qx, 0) ** 2 + max(qy, 0) ** 2 + max(qz, 0) ** 2) + min(max(qx, qy, qz), 0) - 0.015;
  return min(base, screen);
}

function deskD(px, py, pz) {
  const rd = sqrt((px - DESK.x) ** 2 + (pz - DESK.z) ** 2) - (DESK.r - 0.03);
  const hd = abs(py + DESK.h) - (DESK.h - 0.03);
  const a = max(rd, 0), b = max(hd, 0);
  return min(max(rd, hd), 0) + sqrt(a * a + b * b) - 0.03;
}

const dist3 = (x, y, z, b) => sqrt((x - b.x) ** 2 + (y - b.y) ** 2 + (z - b.z) ** 2) - b.r;

// group ids
const G_DESK = 0, G_LAPTOP = 1, G_FROG = 2, G_PHONES = 3;

function map(x, y, z, noDesk) {
  let d = noDesk ? 1e9 : deskD(x, y, z);
  if (dist3(x, y, z, LAP_BOUND) < d) d = min(d, laptopD(x, y, z));
  if (dist3(x, y, z, FROG_BOUND) < d) d = min(d, frogD(x, y, z));
  if (dist3(x, y, z, PH_BOUND) < d) d = min(d, phonesD(x, y, z));
  return d;
}

function whichGroup(x, y, z) {
  const ds = [deskD(x, y, z), laptopD(x, y, z), frogD(x, y, z), phonesD(x, y, z)];
  let g = 0;
  for (let i = 1; i < 4; i++) if (ds[i] < ds[g]) g = i;
  return g;
}

// ───────────────────────────── materials ─────────────────────────────
// class table: name → [r,g,b], lum (base brightness), ink (kept visible as dim glyphs), min glyph index
const MAT = [
  { rgb: [70, 80, 75], lum: 0.3, min: 0 }, // 0 desk top
  { rgb: [110, 124, 117], lum: 0.4, min: 1 }, // 1 desk grid line
  { rgb: [236, 236, 236], lum: 1, min: 1 }, // 2 laptop light
  { rgb: [190, 190, 190], lum: 0.78, min: 1 }, // 3 laptop shade
  { rgb: [145, 208, 108], lum: 1, min: 1 }, // 4 frog light
  { rgb: [51, 160, 115], lum: 0.72, min: 1 }, // 5 frog shade
  { rgb: [78, 86, 82], lum: 0.4, min: 2 }, // 6 eye
  { rgb: [255, 255, 255], lum: 1, min: 1 }, // 7 pupil
  { rgb: [78, 86, 82], lum: 0.4, min: 2 }, // 8 mouth
  { rgb: [210, 210, 210], lum: 1, min: 1 }, // 9 headset light
  { rgb: [84, 90, 87], lum: 0.4, min: 2 }, // 10 headset rim
];
const hex = (v) => max(0, min(255, Math.round(v))).toString(16).padStart(2, "0");
export const PALETTE = MAT.map((m, i) =>
  Array.from({ length: LEVELS }, (_, l) => {
    const f = m.min >= 2 ? 1 : 0.42 + 0.58 * (l / (LEVELS - 1));
    return "#" + hex(m.rgb[0] * f) + hex(m.rgb[1] * f) + hex(m.rgb[2] * f);
  })
);

function material(g, px, py, pz, nx, ny, nz) {
  if (g === G_DESK) {
    if (py > -0.01) {
      const gx = abs(((px - DESK.x) / 0.5 + 100.5) % 1 - 0.5);
      const gz = abs(((pz - DESK.z) / 0.5 + 100.5) % 1 - 0.5);
      if (min(gx, gz) < 0.035) return 1;
    }
    return 0;
  }
  if (g === G_LAPTOP) {
    const [base, screen, u, along, nrm] = laptopParts(px, py, pz);
    if (base < screen) return ny > 0.6 ? 2 : 3;
    // screen: light front face with a darker swoosh on the lower right, back side shaded
    if (nrm < 0) return 3;
    const un = u / LAP.hw, sn = along / LAP.sh;
    return un * 0.95 - sn * 0.75 > 0.55 - 0.35 * sn * sn ? 3 : 2;
  }
  if (g === G_FROG) {
    for (const s of [1, -1]) {
      const dx = px - EYE.x, dy = py - EYE.y, dz = pz - EYE.z * s;
      if (sqrt(dx * dx + dy * dy + dz * dz) < EYE.r + 0.02 && py > 1.2) {
        if (dz * s > 0.07 && abs(dy + 0.03) < 0.045 && abs(dx - 0.04) < 0.1) return 7;
        return 6;
      }
    }
    if (abs(py - 1.18) < 0.03 && px > 0.56 && px < 1.25 && abs(pz) > 0.05) return 8;
    return ny < -0.12 ? 5 : 4;
  }
  // headset: dark rim / sides, light cup face and band
  const dx = px - PH.cx, dy = py - PH.cy;
  const onCup = cupD(px, py, pz) < bandD(px, py, pz);
  if (!onCup) return 9;
  const radial = sqrt(dx * dx + dy * dy);
  if (abs(nz) > 0.7 && radial < PH.R - 0.05) return 9;
  return 10;
}

// ───────────────────────────── renderer ─────────────────────────────

/**
 * @param {object} opts
 *   cols        character columns (default 140)
 *   charAspect  character cell width / height (default 0.5)
 *   aspect      image width / height (default 1.5) — sets the row count
 *   elevation   camera elevation above the desk in degrees (default 15)
 *   distance    camera distance (default 6.4; smaller = stronger perspective)
 *   fov         vertical field of view in degrees (default 34)
 *   axis        'y' orbit around the scene (default) | 'z' roll the camera flat
 *   desk        draw the desk (default true)
 *   outline     dim ink outlines where nearer surfaces overlap farther ones (default true)
 *   mode        'color' | 'mono'
 */
export function createAsciiScene(opts = {}) {
  const cols = opts.cols ?? 140;
  const charAspect = opts.charAspect ?? 0.5;
  const aspect = opts.aspect ?? 1.5;
  const elev = ((opts.elevation ?? 15) * Math.PI) / 180;
  const D = opts.distance ?? 6.4;
  const tanH = Math.tan(((opts.fov ?? 34) * Math.PI) / 360);
  const axis = opts.axis ?? "y";
  const showDesk = opts.desk ?? true;
  const outline = opts.outline ?? true;
  const mode = opts.mode ?? "color";
  const rows = Math.max(8, Math.round((cols * charAspect) / aspect));
  const imgAspect = (cols * charAspect) / rows;

  const TX = 0.45, TY = 0.82, TZ = 0; // look-at target
  const cell = new Uint8Array(cols * rows);
  const cls = new Int8Array(cols * rows);
  const lvl = new Uint8Array(cols * rows);
  const tbuf = new Float32Array(cols * rows); // hit distance per cell, for the outline pass
  const edge = new Uint8Array(cols * rows);

  const E = 0.0025;
  const normal = (x, y, z) => {
    const a = map(x + E, y - E, z - E), b = map(x - E, y - E, z + E);
    const c = map(x - E, y + E, z - E), d = map(x + E, y + E, z + E);
    const nx = a - b - c + d, ny = -a - b + c + d, nz = -a + b - c + d;
    const l = sqrt(nx * nx + ny * ny + nz * nz) || 1;
    return [nx / l, ny / l, nz / l];
  };

  function softShadow(ox, oy, oz, lx, ly, lz) {
    let res = 1, t = 0.05;
    for (let i = 0; i < 20; i++) {
      const h = map(ox + lx * t, oy + ly * t, oz + lz * t, true);
      if (h < 0.003) return 0;
      res = min(res, (7 * h) / t);
      t += max(0.04, min(h, 0.35));
      if (t > 4) break;
    }
    return res;
  }

  function render(angle) {
    const az = axis === "y" ? angle : 0;
    const roll = axis === "z" ? angle : 0;
    // camera frame
    const cx = TX + D * cos(elev) * sin(az), cy = TY + D * sin(elev), cz = TZ + D * cos(elev) * cos(az);
    let fx = TX - cx, fy = TY - cy, fz = TZ - cz;
    let l = sqrt(fx * fx + fy * fy + fz * fz);
    fx /= l; fy /= l; fz /= l;
    let rx = -fz, ry = 0, rz = fx;
    l = sqrt(rx * rx + rz * rz); rx /= l; rz /= l;
    let ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
    if (roll) {
      const c = cos(roll), s = sin(roll);
      const nrx = rx * c + ux * s, nry = ry * c + uy * s, nrz = rz * c + uz * s;
      ux = -rx * s + ux * c; uy = -ry * s + uy * c; uz = -rz * s + uz * c;
      rx = nrx; ry = nry; rz = nrz;
    }
    // light fixed relative to the camera: upper left, a little toward the viewer
    let lx = -0.45 * rx + 0.7 * ux - 0.95 * fx, ly = -0.45 * ry + 0.7 * uy - 0.95 * fy, lz = -0.45 * rz + 0.7 * uz - 0.95 * fz;
    l = sqrt(lx * lx + ly * ly + lz * lz); lx /= l; ly /= l; lz /= l;

    cls.fill(-1);
    for (let j = 0; j < rows; j++) {
      const v = (1 - ((j + 0.5) / rows) * 2) * tanH;
      for (let i = 0; i < cols; i++) {
        const u = (((i + 0.5) / cols) * 2 - 1) * tanH * imgAspect;
        let dx = fx + rx * u + ux * v, dy = fy + ry * u + uy * v, dz = fz + rz * u + uz * v;
        l = sqrt(dx * dx + dy * dy + dz * dz); dx /= l; dy /= l; dz /= l;

        // clip against the scene bounding sphere
        const ox = cx - SCENE_CENTER.x, oy = cy - SCENE_CENTER.y, oz = cz - SCENE_CENTER.z;
        const bq = ox * dx + oy * dy + oz * dz;
        const cq = ox * ox + oy * oy + oz * oz - SCENE_CENTER.r * SCENE_CENTER.r;
        const disc = bq * bq - cq;
        if (disc < 0) continue;
        let t = max(0, -bq - sqrt(disc));
        const tEnd = -bq + sqrt(disc);

        let hit = false;
        for (let s = 0; s < 70; s++) {
          const px = cx + dx * t, py = cy + dy * t, pz = cz + dz * t;
          let h = map(px, py, pz, !showDesk);
          if (h < 0.0025 + t * 0.0012) { hit = true; break; }
          t += h * 0.95;
          if (t > tEnd) break;
        }
        if (!hit) continue;

        const px = cx + dx * t, py = cy + dy * t, pz = cz + dz * t;
        const [nx, ny, nz] = normal(px, py, pz);
        const g = whichGroup(px, py, pz);
        const m = material(g, px, py, pz, nx, ny, nz);

        // lighting
        const ndl = nx * lx + ny * ly + nz * lz;
        let diff = pow(max(0, ndl * 0.65 + 0.35), 1.4);
        if (g === G_DESK || g === G_LAPTOP) {
          if (ndl > 0) diff *= 0.35 + 0.65 * softShadow(px + nx * 0.02, py + ny * 0.02, pz + nz * 0.02, lx, ly, lz);
        }
        // ambient occlusion from two samples along the normal
        const ao = 1 - 0.9 * max(0, (0.1 - map(px + nx * 0.1, py + ny * 0.1, pz + nz * 0.1)) / 0.1) * 0.5
                     - 0.5 * max(0, (0.3 - map(px + nx * 0.3, py + ny * 0.3, pz + nz * 0.3)) / 0.3) * 0.4;
        const vdot = max(0, -(nx * dx + ny * dy + nz * dz));
        const hx = lx - dx, hy = ly - dy, hz = lz - dz;
        const hl = sqrt(hx * hx + hy * hy + hz * hz) || 1;
        const spec = pow(max(0, (nx * hx + ny * hy + nz * hz) / hl), 28) * 0.3;
        const fres = pow(1 - vdot, 2) * 0.2;
        const light = max(0.1, min(1.15, (0.14 + 0.08 * ny + 0.86 * diff) * ao + fres));
        const shade = MAT[m].lum * light * 0.92 + (m === 7 || m === 6 ? 0 : spec);

        const idx = j * cols + i;
        let ch = Math.round(pow(min(1, shade), 1.35) * (RAMP.length - 1)); // gamma keeps mid-tones from collapsing into '@'
        ch = max(MAT[m].min, min(RAMP.length - 1, ch));
        cell[idx] = ch;
        cls[idx] = m;
        tbuf[idx] = t;
        lvl[idx] = min(LEVELS - 1, Math.round(min(1, light) * (LEVELS - 1)));
      }
    }

    // ink outline: where a nearer surface overlaps a farther one, the farther cell becomes a dim
    // line glyph — the equivalent of the black linework in the original logo
    edge.fill(0);
    if (outline) {
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          if (cls[idx] < 0) continue;
          const t0 = tbuf[idx];
          const thr = 0.1 + t0 * 0.012;
          if (
            (x > 0 && cls[idx - 1] >= 0 && tbuf[idx - 1] < t0 - thr) ||
            (x < cols - 1 && cls[idx + 1] >= 0 && tbuf[idx + 1] < t0 - thr) ||
            (y > 0 && cls[idx - cols] >= 0 && tbuf[idx - cols] < t0 - thr) ||
            (y < rows - 1 && cls[idx + cols] >= 0 && tbuf[idx + cols] < t0 - thr)
          ) {
            edge[idx] = 1;
            cell[idx] = 1; // "."
            lvl[idx] = 0;
          }
        }
    }

    const lines = [];
    let html = "";
    for (let y = 0; y < rows; y++) {
      let line = "", run = "", runColor = null;
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const c = cls[idx];
        const ch = c < 0 ? " " : RAMP[cell[idx]];
        line += ch;
        if (mode === "color") {
          const col = c < 0 ? null : PALETTE[c][lvl[idx]];
          if (col !== runColor && ch !== " ") {
            if (run) html += runColor ? `<span style="color:${runColor}">${run}</span>` : run;
            run = "";
            runColor = col;
          }
          run += ch;
        }
      }
      if (mode === "color") html += (runColor ? `<span style="color:${runColor}">${run}</span>` : run) + "\n";
      lines.push(line);
    }
    return { text: lines.join("\n"), html: mode === "color" ? html : null, cls, lvl, cell };
  }

  return { render, cols, rows };
}
