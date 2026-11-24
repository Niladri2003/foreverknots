import { Children, Fragment, isValidElement } from 'react';
import { m } from 'motion/react';
import { EXPO } from '../utils/motion';

/* Type that rises into place word by word, each word in its own mask.
 * Children may be strings and simple inline elements (<em>, <br/>); strings are
 * split on spaces, an element is treated as one unit (its words split inside).
 *
 *   play     undefined → plays when scrolled into view
 *            boolean   → controlled (hero, preloader)
 *   delay    seconds before the first word
 *   stagger  seconds between words */
const word = {
  hidden: { y: '108%' },
  show: { y: '0%', transition: { duration: 1.4, ease: EXPO } },
};

function splitNode(node, keyBase) {
  if (typeof node === 'string') {
    const parts = node.split(/(\s+)/);
    return parts.map((p, i) =>
      /^\s+$/.test(p) || p === '' ? (
        <Fragment key={`${keyBase}-s${i}`}>{p}</Fragment>
      ) : (
        <span className="rw" key={`${keyBase}-w${i}`}>
          <m.span className="rw__i" variants={word}>{p}</m.span>
        </span>
      ),
    );
  }
  if (isValidElement(node)) {
    if (node.type === 'br') return node;
    const Tag = node.type;
    return (
      <Tag key={keyBase} {...node.props}>
        {Children.toArray(node.props.children).flatMap((c, i) => splitNode(c, `${keyBase}-${i}`))}
      </Tag>
    );
  }
  return node;
}

export default function SplitWords({
  as = 'span',
  children,
  className,
  play,
  delay = 0,
  stagger = 0.06,
  once = true,
  amount = 0.4,
  ...rest
}) {
  const Comp = m[as] || m.span;
  const controlled = typeof play === 'boolean';
  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <Comp
      className={className}
      variants={parent}
      initial="hidden"
      {...(controlled
        ? { animate: play ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once, amount } })}
      {...rest}
    >
      {Children.toArray(children).flatMap((c, i) => splitNode(c, `n${i}`))}
    </Comp>
  );
}
