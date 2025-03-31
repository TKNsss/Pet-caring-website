import { useState, React } from "react";

import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { userDropdownLinks } from "../../../constants";

const UserToggleSection = ({ open, links, user }) => {
  return (
    <div className="font-Poppins relative z-1000">
      {open && (
        <div className="bg-lavender absolute -right-3 mt-11 w-52 rounded-lg shadow-lg @3xl:-right-0.5 @3xl:mt-10">
          <div className="bg-lavender absolute -top-2 right-6 h-4 w-4 rotate-45 border-t border-l border-gray-200"></div>

          <div className="border-navBorder border-b p-4 text-center">
            <h3 className="text-txt-2 text-lg font-semibold">
              {user ? "Welcome" : "Not logged in"}
            </h3>
            <p className="text-sm text-gray-400">
              {user ? user.user.username : "None"}
            </p>
          </div>

          <ul className="text-txt-2 text-sm">
            {links.map((link) => (
              <li
                key={link.label}
                className="hover:bg-third hover:text-mdYellow group cursor-pointer p-3"
              >
                <Link to={link.href} className="flex items-center">
                  <link.icon className="text-txt-2 group-hover:text-mdYellow mr-3" />{" "}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="hover:text-primary cursor-pointer focus:text-primary ml-auto flex items-center"
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <FaUserCircle className="text-4xl" />
        <MdKeyboardArrowDown
          className={`text-xl transition duration-150 ease-out ${open ? "rotate-0" : "-rotate-180"} `}
        />
      </div>
      <UserToggleSection open={open} links={userDropdownLinks} user={user}/>
    </>
  );
};

export default UserDropdown;
