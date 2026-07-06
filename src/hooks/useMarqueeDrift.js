import {
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useScroll,
  useVelocity,
  useSpring,
  useReducedMotion,
} from 'motion/react';

/* Endless leftward drift for a duplicated track, accelerated by scroll
 * velocity. Returns a `transform` template for a motion style prop.
 * The track must render its content twice; we wrap at -50%. */
export function useMarqueeDrift(basePctPerSec = 1.4, paused = false) {
  const p = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 300 });
  const reduced = useReducedMotion();

  useAnimationFrame((t, delta) => {
    if (reduced || paused) return;
    const boost = Math.min(Math.abs(smooth.get()) / 1200, 3);
    let next = p.get() - basePctPerSec * (1 + boost) * (delta / 1000);
    if (next <= -50) next += 50;
    p.set(next);
  });

  return useMotionTemplate`translateX(${p}%)`;
}
