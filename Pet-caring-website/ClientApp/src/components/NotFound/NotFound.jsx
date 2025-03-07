import { Link } from "react-router-dom";
import { cryIcon } from "../../assets";
import {motion } from "framer-motion"
import {buttonHoverEffect, buttonTapEffect, buttonTransition} from "../../utils/motion"

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white text-center @container">
      <div className="max-w-[32.5rem] ">
        <h1 className="font-Monserrat flex justify-center font-bold text-black">
          <span className="relative left-5 z-1 self-end text-7xl @3xl:text-9xl">4</span>
          <img src={cryIcon} className="z-100 h-24 w-24 @3xl:h-36 @3xl:w-36" />
          <span className="relative right-5 z-1 self-end text-7xl @3xl:text-9xl">4</span>
        </h1>
        <h2 className="font-Monserrat mt-4 text-[1.375rem] font-bold text-[#232323]">
          OOPS! PAGE NOT BE FOUND
        </h2>
        <p className="font-Monserrat mt-2 text-base font-light text-[#787878]">
          Sorry but the page you are looking for does not exist, have been
          removed, name changed or is temporarily unavailable
        </p>
        <motion.button
          className="font-Monserrat mt-6 rounded-full bg-[#f99827] px-[1.875rem] py-3 font-bold text-white hover:bg-orange-600"
          whileHover={buttonHoverEffect}
          whileTap={buttonTapEffect}
          transition={buttonTransition}
        >
          <Link to="/" className="text-base">
            Back to Homepage
          </Link>
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
