import React from "react";
import { motion } from "framer-motion";
import {
  buttonHoverEffect,
  buttonTapEffect,
  buttonTransition,
} from "../utils/motions";
import { useNavigate } from "react-router-dom";

const RequestServiceBtn = ({
  icon: Icon,
  bgColor,
  iconColor,
  txtColor,
  paddingX,
  navBar,
}) => {
  const navigate = useNavigate();

  return (
    <motion.button
      className={`font-chewy ${bgColor} rounded-full ${paddingX === "px-24" ? `${paddingX} @max-lg:px-6` : paddingX} cursor-pointer py-2.25 font-thin ${txtColor} shadow-lg ${navBar && "@max-4xl:hidden"}`}
      whileHover={buttonHoverEffect}
      whileTap={buttonTapEffect}
      transition={buttonTransition}
      onClick={() => navigate("/request-services")}
    >
      {Icon && <Icon className={`mr-2 inline text-xl ${iconColor}`} />}
      Request Service
    </motion.button>
  );
};

export default RequestServiceBtn;
