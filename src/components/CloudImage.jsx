import { cld, srcSet } from '../utils/cloudinary';

export default function CloudImage({
  name,
  alt = '',
  widths = [480, 768, 1080, 1440, 1920],
  sizes = '100vw',
  ar,
  fill = false,
  q,
  eager = false,
  placeholder = true,
  className,
  style,
  // Art direction: an alternate Cloudinary name served to narrow screens (a
  // portrait crop of the same frame). Omitted → a plain <img>, unchanged.
  portrait,
  portraitOpts,
  portraitWidths = [540, 768, 1080, 1350],
  portraitMedia = '(max-width: 768px)',
  ...rest
}) {
  const opts = { ar, fill, q };
  // Blurred LQIP behind the streaming image; skipped for preloaded hero frames
  const lqip = placeholder && !eager
    ? {
        backgroundImage: `url("${cld(name, { ...opts, w: 32, blur: true })}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;
  const img = (
    <img
      src={cld(name, { ...opts, w: widths[widths.length - 1] })}
      srcSet={srcSet(name, widths, opts)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      // Eager (hero) frame decodes synchronously so it paints the same frame it mounts,
      // keeping the handoff from the boot image seamless.
      decoding={eager ? 'sync' : 'async'}
      fetchpriority={eager ? 'high' : undefined}
      className={className}
      style={lqip || style ? { ...lqip, ...style } : undefined}
      {...rest}
    />
  );
  if (!portrait) return img;
  // <img> stays the wide/default source (and the one the browser preloads);
  // narrow screens pick the portrait <source> before any download starts.
  return (
    <picture>
      <source media={portraitMedia} srcSet={srcSet(portrait, portraitWidths, { ...opts, ...portraitOpts })} sizes={sizes} />
      {img}
    </picture>
  );
}
