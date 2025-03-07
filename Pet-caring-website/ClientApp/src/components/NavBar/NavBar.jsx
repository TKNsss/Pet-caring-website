import React from "react";
import { useState, useEffect } from "react";
// data
import { logo } from "../../assets";
import { navLinks } from "../../constants";
// icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
// components + data
import NavLinkList from "./NavLinkList.jsx";
import SearchBar from "./SearchBar/SearchBar.jsx";
import RequestServiceBtn from "../../shares/RequestServiceBtn.jsx";
import UserDropdown from "./UserDropdown/UserDropdown.jsx";
import { userDropdownLinks } from "../../constants";

import useMediaQuery from "../../hooks/useMediaQuery.js";
import { useAnimate, motion } from "framer-motion";
import { animateMenu, animateListItems } from "../../utils/motion.js";

import { Outlet, Link } from "react-router-dom";

const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [scope, animate] = useAnimate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Run animation on first render
  // use scope.current instead of "ul" here because the ref was within the ul -> to access both ul and li you must lift up the ref.
  useEffect(() => {
    if (!isDesktop) {
      animateMenu(animate, scope, openMenu);
      animateListItems(animate, openMenu);
    } else {
      animate(scope.current, { width: "100%", height: "auto", opacity: 1 });
      animate("li", { opacity: 1, scale: 1, x: 0 });
    }
  }, [openMenu, isDesktop]);

  const handleClick = () => {
    return setOpenMenu((prevMenuState) => !prevMenuState);
  };

  const handleOpenUserMenu = () => {
    return setOpenUserMenu((prevUserMenuState) => !prevUserMenuState);
  };

  return (
    <>
      <div className="web-container @container">
        <nav className="flex items-center justify-between px-[2.25rem] @3xl:my-3 @3xl:px-7">
          <Link
            to={"/"}
            className="relative flex cursor-pointer items-center gap-2"
          >
            <img src={logo} className="h-18 w-18 @3xl:h-20 @3xl:w-20" />
            <h2 className="text-xl md:block">HAPPY PET CARE</h2>
          </Link>

          {isDesktop && <SearchBar />}

          <div className="text-txt-2 hidden @3xl:flex @3xl:items-center @3xl:gap-5">
            <RequestServiceBtn />

            <div
              href="/login"
              className="hover:text-primary focus:text-primary"
            >
              <FaUserCircle className="text-4xl" onClick={handleOpenUserMenu} />
              <UserDropdown open={openUserMenu} links={userDropdownLinks} />
            </div>
          </div>

          <motion.span
            className="bg-mdYellow absolute right-0 cursor-pointer @3xl:hidden"
            onClick={handleClick}
          >
            {openMenu ? (
              <IoClose className="text-txt-2 m-4.5 text-4xl" />
            ) : (
              <GiHamburgerMenu className="text-txt-2 m-4.5 text-4xl" />
            )}
          </motion.span>
        </nav>
      </div>

      <div className="@container">
        <NavLinkList links={navLinks} scope={scope} isDesktop={isDesktop} />
      </div>
      
      <Outlet />
    </>
  );
};

export default NavBar;
