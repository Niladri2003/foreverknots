import { cld, srcSet } from '../utils/cloudinary';

export default function CloudImage({
  name,
  alt = '',
  widths = [480, 768, 1080, 1440],
  sizes = '100vw',
  ar,
  fill = false,
  eager = false,
  placeholder = true,
  className,
  style,
  ...rest
}) {
  const opts = { ar, fill };
  // Blurred LQIP behind the streaming image; skipped for preloaded hero frames
  const lqip = placeholder && !eager
    ? {
        backgroundImage: `url("${cld(name, { ...opts, w: 32, blur: true })}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;
  return (
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
}
