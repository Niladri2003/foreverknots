import { forwardRef } from 'react';
import { m } from 'motion/react';
import { fadeUp } from '../utils/motion';

/* Scroll-in wrapper replacing the old .reveal / IntersectionObserver pattern.
 * `root` scopes in-view detection to a scrollable ancestor (story modal). */
const Reveal = forwardRef(function Reveal(
  {
    as = 'div',
    variant = fadeUp,
    delay = 0,
    root,
    once = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Comp = m[as] || m.div;
  return (
    <Comp
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="show"
      custom={delay}
      viewport={{ once, margin: '-12% 0px -12% 0px', root }}
      variants={variant}
      {...rest}
    >
      {children}
    </Comp>
  );
});

export default Reveal;
