import React from "react";
import { motion } from "framer-motion";

import {
  buttonHoverEffect,
  buttonTapEffect,
  buttonTransition,
} from "../utils/motions";

const RequestServiceBtn = ({
  icon: Icon,
  bgColor,
  iconColor,
  txtColor,
  paddingX,
}) => {
  return (
    <motion.button
      className={`font-chewy ${bgColor} rounded-full ${paddingX === "px-24" ? `${paddingX} @max-lg:px-6` : paddingX} py-3 text-lg font-thin ${txtColor} shadow-lg @5xl:inline-block`}
      whileHover={buttonHoverEffect}
      whileTap={buttonTapEffect}
      transition={buttonTransition}
    >
      {Icon && <Icon className={`mr-2 inline text-xl ${iconColor}`} />}
      Request Service
    </motion.button>
  );
};

export default RequestServiceBtn;
