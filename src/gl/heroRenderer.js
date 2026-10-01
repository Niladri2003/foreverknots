/* The hero's WebGL stage. Plain WebGL 1, no library: one full-screen triangle,
 * two textures, one fragment shader.
 *
 *  - Frames are object-fit: cover'd in the shader (with an object-position
 *    focus), so a frame rendered at rest is pixel-identical to the <img> under
 *    it. That is what makes the hand-off from the LCP image invisible.
 *  - Transitions are a slow "silk" dissolve: a soft noise front sweeps up the
 *    frame, the incoming photograph flows in behind it with a little warp, and
 *    the front itself carries a faint candle-warm glow.
 *  - Every frame drifts in very slowly (a Ken Burns push) for its whole life.
 *  - A pool of warm light follows the cursor across the photograph.
 *
 * At rest the shader takes a uniform branch that skips all the noise, so the
 * steady state costs two texture reads per pixel. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uFocusA;
uniform vec2 uFocusB;
uniform float uZoomA;
uniform float uZoomB;
uniform float uProg;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

// object-fit: cover + object-position, in top-left-origin coordinates
vec2 cover(vec2 p, vec2 size, vec2 focus, float zoom) {
  float rs = uRes.x / uRes.y;
  float ri = size.x / size.y;
  vec2 vis = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  vis /= zoom;
  return (1.0 - vis) * focus + p * vis;
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y);
  vec3 col;

  if (uProg <= 0.0) {
    col = texture2D(uA, cover(p, uSizeA, uFocusA, uZoomA)).rgb;
  } else {
    float aspect = uRes.x / uRes.y;
    vec2 q = vec2(p.x * aspect, p.y);
    float n = fbm(q * 1.6 + vec2(0.0, uTime * 0.04));
    // the front climbs from the bottom with a slight diagonal lean
    float sweep = (1.0 - p.y) * 0.62 + p.x * 0.12 + n * 0.5;
    float t = uProg * 1.42 - 0.08;
    float m = smoothstep(sweep - 0.22, sweep, t);
    float front = m * (1.0 - m) * 4.0;

    vec2 warp = vec2(fbm(q * 2.4 + 3.1) - 0.5, fbm(q * 2.4 + 9.7) - 0.5);
    vec2 pa = p + warp * front * 0.05 + vec2(0.0, -0.025) * m;
    vec2 pb = p + warp * front * 0.07 * (1.0 - m) + vec2(0.0, 0.03) * (1.0 - m);

    vec3 a = texture2D(uA, cover(pa, uSizeA, uFocusA, uZoomA)).rgb;
    vec3 b = texture2D(uB, cover(pb, uSizeB, uFocusB, uZoomB)).rgb;
    col = mix(a, b, m);
    // candle-warm light riding the front, very faint
    col += vec3(1.0, 0.66, 0.36) * front * 0.12;
    col *= 1.0 - front * 0.12;
  }

  // a pool of warm light under the cursor
  if (uLight > 0.001) {
    float aspect = uRes.x / uRes.y;
    vec2 d = (p - uMouse) * vec2(aspect, 1.0);
    float l = exp(-dot(d, d) * 9.0) * uLight;
    col = col * (1.0 + l * 0.22) + vec3(1.0, 0.72, 0.44) * l * 0.035;
  }

  gl_FragColor = vec4(col, 1.0);
}`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log);
  }
  return s;
}

export function createHeroRenderer(canvas, { life = 9000, transition = 2400, push = 0.075 } = {}) {
  let gl;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (e) {
    console.warn('[hero] WebGL unavailable, using the image fallback.', e);
    return null;
  }
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uA', 'uB', 'uRes', 'uSizeA', 'uSizeB', 'uFocusA', 'uFocusB', 'uZoomA', 'uZoomB', 'uProg', 'uTime', 'uMouse', 'uLight'].forEach(
    (n) => { U[n] = gl.getUniformLocation(program, n); },
  );
  gl.uniform1i(U.uA, 0);
  gl.uniform1i(U.uB, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

  const textures = new Map(); // key -> { tex, w, h, focus }
  const state = {
    a: null, aBorn: 0,
    b: null, bBorn: 0,
    tStart: 0, transitioning: false,
    mouse: [0.5, 0.5], mouseT: [0.5, 0.5],
    light: 0, lightT: 0,
    w: 1, h: 1,
    raf: 0, running: false, dirty: true,
    onTransitionEnd: null,
  };

  function upload(key, img, focus = [0.5, 0.5]) {
    if (textures.has(key)) return textures.get(key);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    const t = { tex, w: img.naturalWidth || img.width, h: img.naturalHeight || img.height, focus };
    textures.set(key, t);
    return t;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w;
      canvas.height = h;
    }
    state.w = r.width;
    state.h = r.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    state.dirty = true;
  }

  const zoomFor = (born, now) => 1 + push * easeOut(Math.min(Math.max((now - born) / life, 0), 1));

  function draw(now) {
    const A = textures.get(state.a);
    if (!A) return false;
    let prog = 0;
    let B = null;
    if (state.transitioning) {
      B = textures.get(state.b);
      prog = Math.min((now - state.tStart) / transition, 1);
      if (prog >= 1) {
        state.a = state.b;
        state.aBorn = state.bBorn;
        state.b = null;
        state.transitioning = false;
        prog = 0;
        state.onTransitionEnd?.();
        return draw(now);
      }
    }
    const Acur = textures.get(state.a);
    gl.uniform2f(U.uRes, state.w, state.h);
    gl.uniform1f(U.uTime, now / 1000);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Acur.tex);
    gl.uniform2f(U.uSizeA, Acur.w, Acur.h);
    gl.uniform2f(U.uFocusA, Acur.focus[0], Acur.focus[1]);
    gl.uniform1f(U.uZoomA, zoomFor(state.aBorn, now));
    const Bt = B || Acur;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, Bt.tex);
    gl.uniform2f(U.uSizeB, Bt.w, Bt.h);
    gl.uniform2f(U.uFocusB, Bt.focus[0], Bt.focus[1]);
    gl.uniform1f(U.uZoomB, zoomFor(state.bBorn, now));
    gl.uniform1f(U.uProg, B ? ease(prog) : 0);

    state.mouse[0] += (state.mouseT[0] - state.mouse[0]) * 0.08;
    state.mouse[1] += (state.mouseT[1] - state.mouse[1]) * 0.08;
    state.light += (state.lightT - state.light) * 0.05;
    gl.uniform2f(U.uMouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(U.uLight, state.light);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }

  function loop(now) {
    if (!state.running) return;
    draw(now);
    state.raf = requestAnimationFrame(loop);
  }

  const api = {
    upload,
    has: (key) => textures.has(key),
    /* Show a frame immediately (the first one), at the start of its push. */
    show(key, bornAt = performance.now()) {
      state.a = key;
      state.aBorn = bornAt;
      draw(performance.now());
    },
    transitionTo(key, onEnd) {
      if (!textures.has(key) || key === state.a) return false;
      if (state.transitioning) {
        // land the current one instantly, then begin the next
        state.a = state.b;
        state.aBorn = state.bBorn;
      }
      state.b = key;
      state.bBorn = performance.now();
      state.tStart = performance.now();
      state.transitioning = true;
      state.onTransitionEnd = onEnd || null;
      return true;
    },
    pointer(x, y, inside) {
      state.mouseT[0] = x;
      state.mouseT[1] = y;
      state.lightT = inside ? 1 : 0;
      if (inside && state.light < 0.01) {
        state.mouse[0] = x;
        state.mouse[1] = y;
      }
    },
    resize,
    start() {
      if (state.running) return;
      state.running = true;
      state.raf = requestAnimationFrame(loop);
    },
    stop() {
      state.running = false;
      cancelAnimationFrame(state.raf);
    },
    destroy() {
      api.stop();
      textures.forEach((t) => gl.deleteTexture(t.tex));
      textures.clear();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      // No loseContext(): StrictMode re-mounts onto the same <canvas>, and a
      // lost context would come straight back from getContext().
    },
  };

  resize();
  return api;
}
