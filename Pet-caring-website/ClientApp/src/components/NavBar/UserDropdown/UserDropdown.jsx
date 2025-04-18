import { useState, React } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { userDropdownLinks } from "../../../constants";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/auth/authSlice";
import { fetchUserProfile } from "../../../redux/features/users/usersSlice";

const UserToggleSection = ({ open, links, user, onLogout }) => {
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
              {user ? user.username : "None"}
            </p>
          </div>

          <ul className="text-txt-2 text-sm">
            {links.map(({ label, href, icon: Icon }) => (
              <li
                key={label}
                className="hover:bg-third hover:text-mdYellow group cursor-pointer p-3"
              >
                {label === "Sign out" ? (
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center cursor-pointer text-left"
                  >
                    <Icon className="text-txt-2 group-hover:text-mdYellow mr-3" />
                    {label}
                  </button>
                ) : (
                  <Link to={href} className="flex items-center">
                    <Icon className="text-txt-2 group-hover:text-mdYellow mr-3" />
                    {label}
                  </Link>
                )}
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
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // returns a Redux action object with a type, payload, and other metadata.
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      await dispatch(fetchUserProfile())
    }
  };

  return (
    <>
      <div
        className="hover:text-primary focus:text-primary ml-auto flex cursor-pointer items-center"
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <FaUserCircle className="text-4xl" />
        <MdKeyboardArrowDown
          className={`text-xl transition duration-150 ease-out ${open ? "rotate-0" : "-rotate-180"} `}
        />
      </div>
      <UserToggleSection
        open={open}
        links={userDropdownLinks}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default UserDropdown;
