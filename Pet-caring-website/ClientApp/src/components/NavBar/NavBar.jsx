import React from "react";
import { useState, useEffect } from "react";
// data
import { navLinks, logo } from "../../constants";
// icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
// components + data
import NavLinkList from "./NavLinkList.jsx";
import SearchBar from "./SearchBar/SearchBar.jsx";
import RequestServiceBtn from "../../shares/RequestServiceBtn.jsx";
import UserDropdown from "./UserDropdown/UserDropdown.jsx";
import { useAnimate, motion } from "framer-motion";
import { animateMenu, animateListItems } from "../../utils/motions";
import { Outlet, Link } from "react-router-dom";
import { useMediaQueryContext } from "../../contexts/MediaQueryProvider.jsx";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scope, animate] = useAnimate();
  const isDesktop = useMediaQueryContext();
  const { user } = useSelector((state) => state.users);

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

  return (
    <>
      <div className="web-container @container">
        <nav className="flex items-center justify-between px-[2.25rem] @3xl:gap-4 @3xl:px-6">
          <Link
            to={"/"}
            className="relative flex cursor-pointer items-center gap-2"
          >
            <img src={logo} className="h-18 w-18 @3xl:h-20 @3xl:w-20" />
            <h2 className="text-xl md:block">HAPPY PET CARE</h2>
          </Link>

          {isDesktop && <SearchBar />}

          <div className="text-txt-2 hidden @3xl:flex @3xl:items-center @3xl:gap-4">
            {user ? (
              <>
                <RequestServiceBtn txtColor={"text-white"} paddingX={"px-6"}/>
                <UserDropdown user={user} />
              </>
            ) : (
              <>
                <button className="text-txt-2 hover:text-primary cursor-pointer font-medium">
                  <Link to={"/register"} className="text-base">
                    Sign up
                  </Link>
                </button>
                <button className="bg-primary hover:bg-txt-2 rounded-full px-4.5 py-2 font-medium text-white">
                  <Link to={"/login"} className="text-base">
                    Log in
                  </Link>
                </button>
              </>
            )}
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
        <NavLinkList
          links={navLinks}
          scope={scope}
          isDesktop={isDesktop}
          user={user}
        />
      </div>
      <Outlet />
    </>
  );
};

export default NavBar;
