import React from "react";

import { Link } from "react-router-dom";

const UserDropdown = ({ open, links }) => {
  return (
    <div className="font-Poppins relative z-1000">
      {open && (
        <div className="bg-lavender absolute -right-3 mt-6.5 w-52 rounded-lg shadow-lg">
          <div className="bg-lavender absolute -top-2 right-6 h-4 w-4 rotate-45 border-t border-l border-gray-200"></div>

          <div className="border-navBorder border-b p-4 text-center">
            <h3 className="text-txt-2 text-lg font-semibold">Welcome</h3>
            <p className="text-sm text-gray-400">Website Designer</p>
          </div>

          <ul className="text-txt-2 text-sm">
            {links.map((link) => (
              <li
                key={link.label}
                className="hover:bg-third hover:text-mdYellow group flex cursor-pointer items-center p-3"
              >
                <Link to={link.href}>
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

export default UserDropdown;
