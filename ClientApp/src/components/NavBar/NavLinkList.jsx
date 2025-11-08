import React, { useState } from "react";
import { motion } from "framer-motion";
import { hoveredTransition, hoveredEffect } from "../../utils/motions";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import SearchBar from "./SearchBar/SearchBar";
import UserDropdown from "./UserDropdown/UserDropdown";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";

const SubLinkList = ({ links, isOpen, scrolled, id }) => {
  const { t } = useTranslation();

  return (
    <ul
      className={`font-Poppins flex-col ${isOpen ? "flex" : "hidden"} z-100 w-full @3xl:absolute @3xl:top-7.5 ${id === "About" ? "@3xl:-left-6.5" : "@3xl:-left-3"}  @3xl:w-[7.813rem]`}
    >
      {links.map((subLink) => (
        <li
          key={subLink.labelKey ?? subLink.label}
          className={`text-txt-2 hover:bg-darkYellow @3xl:border-navBorder @3xl:hover:text-mdYellow @3xl:hover:bg-navSubBg cursor-default py-2 pl-10 transition-colors first:mt-2 hover:text-white @3xl:border-t @3xl:border-r @3xl:border-l @3xl:pr-3 @3xl:pl-3 @3xl:text-center @3xl:first:mt-0 @3xl:last:border-b ${scrolled ? "bg-lavender/90 shadow-lg backdrop-blur-sm" : "bg-lavender"}`}
        >
          <Link to={subLink.href} className="sub-link">
            {subLink.labelKey ? t(subLink.labelKey) : subLink.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const NavLinkList = ({
  links,
  scope,
  isDesktop,
  user,
  scrolled,
  openLinks,
}) => {
  const [openDropdown, setOpenDropdown] = useState({});
  const { t } = useTranslation();

  // [id] is the dynamical key (instead of create a new key named "id", we use [id] for dynamically sets the key based on the value of id)
  const handleCLick = (id) => {
    setOpenDropdown((prevDropdown) => ({
      ...prevDropdown,
      [id]: !prevDropdown[id],
    }));
  };

  return (
    <ul
      className={`font-Poppins border-navBorder absolute right-0 z-1000 flex flex-col border-2 transition-colors @3xl:static @3xl:flex-row @3xl:justify-center @3xl:gap-12 @3xl:border-none @3xl:py-4 ${
        scrolled
          ? "bg-lavender/80 @3xl:bg-navBg/80 shadow backdrop-blur-sm"
          : "bg-lavender @3xl:bg-navBg/80"
      } ${openLinks ? "@3xl:opacity-100" : "@3xl:hidden @3xl:opacity-0"}`}
      ref={scope}
    >
      {links.map((link) => (
        <motion.li
          className={`text-txt-2 hover:bg-hoverPurple hover:text-mdYellow group @3xl:hover:text-txt-1 relative cursor-pointer px-3.5 py-3 @3xl:bg-transparent @3xl:px-0 @3xl:py-0 ${scrolled ? "@3xl:hover:bg-transparent" : "@3xl:hover:bg-navBg"}`}
          initial="initial"
          whileHover="hovered"
          key={link.id}
          onClick={() => handleCLick(link.id)}
        >
          <div className="flex items-center justify-between">
            <Link to={link.href} className="flex items-center gap-2">
              <link.icon className="text-lg @3xl:hidden" />
              <span className="relative block">
                {link.labelKey ? t(link.labelKey) : link.label}
                <motion.span
                  className={`bg-txt-2 absolute bottom-0 h-0.5 w-full rounded ${isDesktop ? "group-hover:bg-txt-1" : "group-hover:bg-mdYellow"}`}
                  variants={hoveredEffect}
                  transition={hoveredTransition}
                ></motion.span>
              </span>
            </Link>

            {["Services", "About"].includes(link.id) && (
              <MdKeyboardArrowDown
                className={`text-lg transition duration-150 ease-in-out ${
                  openDropdown[link.id] ? "rotate-0" : "-rotate-90"
                }`}
              />
            )}
          </div>

          {link.subLinks && link.subLinks.length > 0 && (
            <SubLinkList
              links={link.subLinks}
              isOpen={openDropdown[link.id]}
              scrolled={scrolled}
              id={link.id}
            />
          )}
        </motion.li>
      ))}

      {!isDesktop && (
        <li>
          <div className="border-t-navBorder text-txt-2 mx-auto flex w-full flex-col gap-3 border-t px-3.5 py-3">
            <LanguageSwitcher />
            <div className="flex w-full items-center justify-between">
              <SearchBar />

              {user ? (
                <UserDropdown user={user} scrolled={scrolled} />
              ) : (
                <Link
                  to={"/login"}
                  className="hover:text-primary flex items-center gap-1"
                >
                  <FiLogIn className="text-lg" />
                  {t("nav.auth.login")}
                </Link>
              )}
            </div>
          </div>
        </li>
      )}
    </ul>
  );
};

export default NavLinkList;
