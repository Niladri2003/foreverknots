import { cld, srcSet } from '../utils/cloudinary';

export default function CloudImage({
  name,
  alt = '',
  widths = [480, 768, 1080, 1440],
  sizes = '100vw',
  ar,
  fill = false,
  eager = false,
  className,
  ...rest
}) {
  const opts = { ar, fill };
  return (
    <img
      src={cld(name, { ...opts, w: widths[widths.length - 1] })}
      srcSet={srcSet(name, widths, opts)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      className={className}
      {...rest}
    />
  );
}
