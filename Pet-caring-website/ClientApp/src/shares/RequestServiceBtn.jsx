import React from "react";
import { motion } from "framer-motion";

import {
  buttonHoverEffect,
  buttonTapEffect,
  buttonTransition,
} from "../utils/motions";

const RequestServiceBtn = ({ icon: Icon }) => {
  return (
    <motion.button
      className={`font-chewy bg-secondary rounded-full px-6 py-3 text-lg font-thin text-white shadow-lg @5xl:inline-block ${Icon ? "flex items-center gap-1.5" : "hidden"}`}
      whileHover={buttonHoverEffect}
      whileTap={buttonTapEffect}
      transition={buttonTransition}
    >
      {Icon && <Icon className="text-xl" />}
      Request Service
    </motion.button>
  );
};

export default RequestServiceBtn;
