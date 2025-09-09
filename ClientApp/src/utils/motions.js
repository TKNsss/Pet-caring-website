import { stagger } from "framer-motion";

export const staggerList = stagger(0.05, { startDelay: 0.12 });

export const animateMenu = (animate, scope, openMenu) => {
  animate(
    scope.current,
    {
      width: openMenu ? "58.3333%" : 0,
      height: openMenu ? "auto" : 0,
      opacity: openMenu ? 1 : 0,
    },
    { type: "spring", bounce: 0, duration: 0.4 },
  );
};

export const animateListItems = (animate, openMenu) => {
  animate(
    "li",
    openMenu
      ? { opacity: 1, scale: 1, x: 0 }
      : { opacity: 0, scale: 0.3, x: "-100%" },
    { duration: 0.2, delay: openMenu ? staggerList : 0 },
  );
};

export const hoveredEffect = {
  initial: {
    scaleX: 0,
    left: 0,
    transformOrigin: "right",
  },
  hovered: {
    scaleX: 1,
    transformOrigin: "left",
  },
};

export const hoveredTransition = { duration: 0.5, ease: "easeOut" };

// button animation
export const buttonHoverEffect = { scale: 1.1 };
export const buttonTapEffect = { scale: 0.9 };
export const buttonTransition = { bounceDamping: 100, bounceStiffness: 600 };
