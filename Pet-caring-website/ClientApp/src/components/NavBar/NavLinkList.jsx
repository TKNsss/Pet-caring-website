import React, { useState } from "react";
import { motion } from "framer-motion";
import { hoveredTransition, hoveredEffect } from "../../utils/motions";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import SearchBar from "./SearchBar/SearchBar";
import UserDropdown from "./UserDropdown/UserDropdown";
import { Link } from "react-router-dom";

const SubLinkList = ({ id, links, isOpen }) => {
  return (
    <ul
      className={`font-Poppins flex-col ${isOpen ? "flex" : "hidden"} z-100 w-full @3xl:absolute @3xl:top-8.5 ${id === "About" ? "@3xl:-left-9.5 @3xl:w-[175px]" : "@3xl:-left-1 @3xl:w-[135px]"}`}
    >
      {links.map((subLink) => (
        <li
          key={subLink.label}
          className="bg-lavender text-txt-2 hover:bg-darkYellow @3xl:border-navBorder @3xl:hover:text-mdYellow @3xl:hover:bg-navSubBg cursor-default py-2 pl-10 first:mt-2 hover:text-white @3xl:border-t @3xl:border-r @3xl:border-l @3xl:pr-3 @3xl:pl-3 @3xl:text-center @3xl:first:mt-0 @3xl:last:border-b"
        >
          <Link to={subLink.href} className="text-sm">
            {subLink.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const NavLinkList = ({ links, scope, isDesktop, user }) => {
  const [openDropdown, setOpenDropdown] = useState({});

  // [id] is the dynamical key (instead of create a new key named "id", we use [id] for dynamically sets the key based on the value of id)
  const handleCLick = (id) => {
    setOpenDropdown((prevDropdown) => ({
      ...prevDropdown,
      [id]: !prevDropdown[id],
    }));
  };

  return (
    <ul
      className="font-Poppins bg-lavender @3xl:bg-navBg border-navBorder absolute right-0 flex flex-col border-2 @3xl:static @3xl:flex-row @3xl:justify-center @3xl:gap-12 @3xl:border-none @3xl:py-5"
      ref={scope}
    >
      {links.map((link) => (
        <motion.li
          className="bg-lavender text-txt-2 @3xl:hover:bg-navBg hover:bg-hoverPurple hover:text-mdYellow group @3xl:hover:text-txt-1 relative cursor-pointer px-3.5 py-3 @3xl:bg-transparent @3xl:px-0 @3xl:py-0"
          initial="initial"
          whileHover="hovered"
          key={link.id}
          onClick={() => handleCLick(link.id)}
        >
          <div className="flex items-center justify-between">
            <Link to={link.href} className="flex gap-3">
              <link.icon className="text-xl @3xl:hidden" />
              <span className="relative block">
                {link.label}
                <motion.span
                  className={`bg-txt-2 absolute bottom-0 h-0.5 w-full rounded ${isDesktop ? "group-hover:bg-txt-1" : "group-hover:bg-mdYellow"}`}
                  variants={hoveredEffect}
                  transition={hoveredTransition}
                ></motion.span>
              </span>
            </Link>

            {["Services", "About"].includes(link.id) && (
              <MdKeyboardArrowDown
                className={`text-2xl transition duration-150 ease-in-out ${
                  openDropdown[link.id] ? "rotate-0" : "-rotate-90"
                }`}
              />
            )}
          </div>

          {link.subLinks && link.subLinks.length > 0 && (
            <SubLinkList
              id={link.id}
              links={link.subLinks}
              isOpen={openDropdown[link.id]}
            />
          )}
        </motion.li>
      ))}

      {!isDesktop && (
        <li>
          <div className="border-t-navBorder text-txt-2 mx-auto flex w-full items-center justify-between border-t px-3.5 py-3">
            <SearchBar />
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link to={"/login"} className="flex items-center gap-1 hover:text-primary">
                <FiLogIn className="text-2xl" />
                Login
              </Link>
            )}
          </div>
        </li>
      )}
    </ul>
  );
};

export default NavLinkList;
