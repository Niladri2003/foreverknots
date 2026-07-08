const BASE = 'https://res.cloudinary.com/dvbnkndyc/image/upload';

// The uploaded masters are ~2048px on the long edge, so never request more —
// beyond the source Cloudinary upscales and detail turns to mush.
export const MAX_W = 2048;

/**
 * Build a Cloudinary URL for an image in the foreverknots folder.
 * opts.q  quality tier (default 'auto:best' — this is a photography portfolio,
 *         so favour fidelity over bytes; pass 'auto:good' where size matters more).
 * opts.fill crops to opts.ar (e.g. "4:5") with face-aware gravity.
 * opts.blur produces a ~1 kB LQIP placeholder at the same crop.
 */
export function cld(name, { w, ar, fill, blur, q = 'auto:best' } = {}) {
  let t = blur ? 'f_auto,q_1' : `f_auto,q_${q}`;
  if (fill && ar) t += `,c_fill,g_auto,ar_${ar}`;
  if (w) t += `,w_${Math.min(w, MAX_W)}`;
  if (blur) t += ',e_blur:1000';
  return `${BASE}/${t}/foreverknots/${name}.jpg`;
}

export function srcSet(name, widths = [480, 768, 1080, 1440, 1920], opts = {}) {
  return widths.map((w) => `${cld(name, { ...opts, w })} ${w}w`).join(', ');
}
