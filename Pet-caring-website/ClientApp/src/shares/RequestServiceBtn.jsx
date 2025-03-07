import React from "react";
import { motion } from "framer-motion";

import { buttonHoverEffect, buttonTapEffect, buttonTransition } from "../utils/motion";

const RequestServiceBtn = () => {
  return (
    <motion.button
      className="font-chewy bg-secondary hidden rounded-full px-6 py-3 text-lg font-thin text-white shadow-lg @5xl:inline-block"
      whileHover={buttonHoverEffect}
      whileTap={buttonTapEffect}
      transition={buttonTransition}
    >
      Request Service
    </motion.button>
  );
};

export default RequestServiceBtn;
