export const ease = [0.22, 1, 0.36, 1]; // easeOutQuint
export const spring = { type: 'spring', stiffness: 260, damping: 30, mass: 0.8 };
export const reveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
};
export const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

export const defaultViewport = { once: true, amount: 0.3 };
