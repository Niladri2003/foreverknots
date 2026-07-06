const BASE = 'https://res.cloudinary.com/dvbnkndyc/image/upload';

/**
 * Build a Cloudinary URL for an image in the foreverknots folder.
 * opts.fill crops to opts.ar (e.g. "4:5") with face-aware gravity.
 * opts.blur produces a ~1 kB LQIP placeholder at the same crop.
 */
export function cld(name, { w, ar, fill, blur } = {}) {
  let t = blur ? 'f_auto,q_1' : 'f_auto,q_auto';
  if (fill && ar) t += `,c_fill,g_auto,ar_${ar}`;
  if (w) t += `,w_${w}`;
  if (blur) t += ',e_blur:1000';
  return `${BASE}/${t}/foreverknots/${name}.jpg`;
}

export function srcSet(name, widths = [480, 768, 1080, 1440], opts = {}) {
  return widths.map((w) => `${cld(name, { ...opts, w })} ${w}w`).join(', ');
}
