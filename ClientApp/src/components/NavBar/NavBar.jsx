import React from "react";
import { useState, useEffect } from "react";
// data
import { navLinks, logo } from "../../constants";
// icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { HiMiniPlusCircle, HiMiniMinusCircle } from "react-icons/hi2";
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
import { selectCurrentUser } from "../../redux/features/users/usersSlice.js";

const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openLinks, setOpenLinks] = useState(true);
  const [userClosedManually, setUserClosedManually] = useState(false);
  const [scope, animate] = useAnimate();
  const isDesktop = useMediaQueryContext();
  const user = useSelector(selectCurrentUser);

  const toggleMenu = () => {
    if (openLinks) {
      // Closing manually
      setUserClosedManually(true);
      setOpenLinks(false);
    } else {
      // Opening manually
      setUserClosedManually(false);
      setOpenLinks(true);
    }
  };

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

  useEffect(() => {
    // resets if the effect re-runs
    let lastScrollY = window.scrollY; // store to detect only when crossing the 60px threshold

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      /*
        - not switching the state the instant we hit 60px.    
        - create a gap between the turn-on and turn-off points.  
        - This gap (55–65px) is called the 'dead zone'.
        - Inside this dead zone, we do nothing — we keep whatever the last state was.
      */
      // Turn ON blur only if you cross going down
      if (currentScrollY > 65 && !scrolled) {
        setScrolled(true);
      } else if (currentScrollY < 55 && scrolled) {
        // Turn OFF blur only if you cross going up
        setScrolled(false);
      }

      if (currentScrollY > 60 && lastScrollY <= 60) {
        // CASE A: Scrolling DOWN past 60px
        setOpenLinks(false);
      } else if (currentScrollY <= 60 && lastScrollY > 60) {
        // Case B — Scrolling UP past 60px
        if (!userClosedManually) setOpenLinks(true);
      }

      lastScrollY = currentScrollY;
    };

    // Run once to set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, userClosedManually]);

  const handleClick = () => {
    return setOpenMenu((prevMenuState) => !prevMenuState);
  };

  return (
    <>
      {/* Sticky Nav - full page */}
      <nav
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? "bg-white/80 shadow-lg backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="web-container @container flex items-center justify-between px-[2.25rem]">
          <Link
            to={"/"}
            className="relative flex cursor-pointer items-center gap-1.5"
          >
            <img src={logo} className="h-15 w-15 md:h-16 @md:w-16" />
            <h2 className="mb-0 md:block">HAPPY PET CARE</h2>
          </Link>

          {isDesktop && <SearchBar />}

          <div className="text-txt-2 hidden md:flex md:items-center md:gap-4">
            {user ? (
              <>
                <RequestServiceBtn
                  navBar={"NavBar"}
                  bgColor={"bg-secondary"}
                  txtColor={"text-white"}
                  paddingX={"px-6"}
                />
                <UserDropdown user={user} scrolled={scrolled} />
              </>
            ) : (
              <>
                <button className="text-txt-2 hover:text-primary cursor-pointer font-medium">
                  <Link to={"/register"}>Sign up</Link>
                </button>

                <button className="bg-primary hover:bg-txt-2 rounded-full px-4.5 py-2 font-medium text-white">
                  <Link to={"/login"}>Log in</Link>
                </button>
              </>
            )}
          </div>

          <motion.span
            className={`absolute right-0 cursor-pointer transition-colors duration-300 md:hidden ${
              scrolled
                ? "bg-mdYellow/80 shadow-md backdrop-blur-sm"
                : "bg-mdYellow"
            }`}
            onClick={handleClick}
          >
            {openMenu ? (
              <IoClose className="text-txt-2 m-4.25 text-2xl" />
            ) : (
              <GiHamburgerMenu className="text-txt-2 m-4.25 text-2xl" />
            )}
          </motion.span>
        </div>

        <div className="absolute top-13.5 left-1/2 z-1000 hidden -translate-x-1/2 md:block">
          <button
            className="scale-item opacity-90 hover:opacity-100"
            onClick={toggleMenu}
            title={openLinks ? "Hide links" : "Show links"}
          >
            {openLinks ? (
              <HiMiniMinusCircle className="text-secondary text-xl" />
            ) : (
              <HiMiniPlusCircle className="text-secondary text-xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Sticky NavLinkList */}
      <div className="@container sticky top-[4rem] z-40 shadow-md">
        <NavLinkList
          links={navLinks}
          scope={scope}
          isDesktop={isDesktop}
          user={user}
          scrolled={scrolled}
          openLinks={openLinks}
        />
      </div>

      <Outlet />
    </>
  );
};

export default NavBar;
