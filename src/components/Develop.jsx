import { useState, useEffect, useRef, forwardRef } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';
import CloudImage from './CloudImage';
import { develop } from '../utils/motion';

/* A photograph that comes up like a print in the developing tray, the first
 * time it is seen. It waits for both the view and the image itself, so a slow
 * network never "develops" an empty frame. A timeout is the safety net. */
const Develop = forwardRef(function Develop(
  { name, alt = '', className, imgClassName, delay = 0, root, amount = 0.25, children, style, imgStyle, ...img },
  outerRef,
) {
  const localRef = useRef(null);
  const ref = outerRef || localRef;
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount, root });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inView || loaded) return;
    const t = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(t);
  }, [inView, loaded]);

  const show = reduced || (inView && loaded);

  return (
    <div ref={ref} className={className} style={style}>
      <m.div
        className="develop"
        variants={develop}
        custom={delay}
        initial={reduced ? false : 'hidden'}
        animate={show ? 'show' : 'hidden'}
      >
        <CloudImage
          name={name}
          alt={alt}
          className={imgClassName}
          style={imgStyle}
          onLoad={() => setLoaded(true)}
          {...img}
        />
      </m.div>
      {children}
    </div>
  );
});

export default Develop;
