import { forwardRef } from 'react';
import { m } from 'motion/react';
import { fadeUp } from '../utils/motion';

/* Scroll-in wrapper. `root` scopes in-view detection to a scrollable ancestor
 * (the story modal). Used for blocks of reading text; display type uses
 * SplitWords, photographs use Develop. */
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
      viewport={{ once, margin: '-10% 0px -10% 0px', root }}
      variants={variant}
      {...rest}
    >
      {children}
    </Comp>
  );
});

export default Reveal;
