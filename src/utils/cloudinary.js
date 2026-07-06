const BASE = 'https://res.cloudinary.com/dvbnkndyc/image/upload';

/**
 * Build a Cloudinary URL for an image in the foreverknots folder.
 * opts.fill crops to opts.ar (e.g. "4:5") with face-aware gravity.
 */
export function cld(name, { w, ar, fill } = {}) {
  let t = 'f_auto,q_auto';
  if (fill && ar) t += `,c_fill,g_auto,ar_${ar}`;
  if (w) t += `,w_${w}`;
  return `${BASE}/${t}/foreverknots/${name}.jpg`;
}

export function srcSet(name, widths = [480, 768, 1080, 1440], opts = {}) {
  return widths.map((w) => `${cld(name, { ...opts, w })} ${w}w`).join(', ');
}
