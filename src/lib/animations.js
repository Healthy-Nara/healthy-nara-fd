export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeOutBack = [0.34, 1.56, 0.64, 1];

export const springSoft = { type: "spring", stiffness: 300, damping: 26 };
export const springSnappy = { type: "spring", stiffness: 500, damping: 32 };

export const tapScale = { scale: 0.96 };

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutExpo },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 22 },
  },
};

export const staggerContainer = (stagger = 0.07, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export const modalPanelUp = {
  hidden: { opacity: 0, y: 56, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.97,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export const modalPanelCenter = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

export const shakeX = {
  hidden: { opacity: 0, x: 0 },
  show: {
    opacity: 1,
    x: [0, -8, 8, -5, 5, -2, 0],
    transition: { duration: 0.45 },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export const sheetUp = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.22, ease: "easeIn" },
  },
};
