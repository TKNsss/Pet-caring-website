import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { footerHome2 } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { fetchUserProfile } from "../../redux/features/users/usersSlice";
const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const userDetail = user?.user || {};

  const [profile, setProfile] = useState(userDetail);
  const [isEditable, setIsEditable] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    newConfirmedPassword: "",
  });

  useEffect(() => {
    if (userDetail) {
      setProfile({ ...userDetail });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const enableEdit = () => {
    setIsEditable((prevIsEditable) => !prevIsEditable);
  };

  const saveUserInfo = () => {
    console.log("Saving user info:", profile);
    alert("User information saved!");
  };

  const updatePassword = () => {
    console.log("Updating password:", passwords);
    alert("Password updated successfully!");
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      await dispatch(fetchUserProfile());
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <aside className="bg-primary font-Poppins h-auto p-6 text-white shadow-lg md:sticky md:top-0 md:h-screen md:w-1/4">
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <FaUserCircle className="text-secondary text-7xl" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-wider text-white">
            Welcome, {profile.username || "User"}
          </h2>
        </div>

        <nav className="mt-8 space-y-4 text-center md:text-left">
          {[
            { name: "My Profile", link: "#profile-section" },
            { name: "My Pets", link: "#pets-section" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="hover:bg-secondary block rounded-md px-4 py-2 transition"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="mt-8 text-center md:text-left">
          <button
            className="inline-flex items-center space-x-2 rounded-md px-4 py-2 transition hover:bg-white cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-2xl" /> <span>Log Out</span>
          </button>
        </div>

        <div className="absolute -bottom-2 left-0 mt-25 hidden md:block">
          <img src={footerHome2} alt="Cat Illustration" className="" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-lavender flex-1 overflow-y-auto rounded-lg p-6 shadow-lg md:p-10">
        <section id="profile-section">
          <h2 className="flex items-center text-3xl font-semibold tracking-wider text-gray-700 uppercase">
            <span className="bg-third mr-2 rounded-full px-5.5 py-2 text-4xl font-bold text-white">
              1
            </span>{" "}
            Your Personal Profile Info
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Profile Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-600">
                Profile
              </h3>
              <form className="space-y-4">
                {[
                  { name: "firstName", placeholder: "First name" },
                  { name: "lastName", placeholder: "Last name" },
                  { name: "username", placeholder: "Username" },
                  { name: "email", placeholder: "Your e-mail" },
                  { name: "phoneNumber", placeholder: "Phone Number" },
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    name={field.name}
                    value={profile[field.name] || ""}
                    onChange={handleChange}
                    className={`w-full rounded-md border p-2 ${!isEditable ? "bg-disable" : ""}`}
                    disabled={!isEditable}
                  />
                ))}
                <textarea
                  placeholder="Address"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                  className={`w-full resize-none rounded-md border p-2 ${!isEditable ? "bg-disable" : ""}`}
                  rows="3"
                  disabled={!isEditable}
                />
              </form>
              <div className="flex gap-5">
                <button
                  onClick={enableEdit}
                  className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  {isEditable ? "Cancel" : "Update Profile"}
                </button>
                <button
                  onClick={saveUserInfo}
                  className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-600">
                Password
              </h3>
              <form className="space-y-4">
                <input
                  type="password"
                  placeholder="Old password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="password"
                  placeholder="New password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  name="newConfirmedPassword"
                  value={passwords.newConfirmedPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border p-2"
                />
              </form>
              <button
                onClick={updatePassword}
                className="bg-mdYellow hover:bg-darkYellow mt-4 w-full rounded-md p-2 text-black transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </section>

        <hr className="my-6 border-t border-gray-400" />

        {/* Pet's Info Section */}
        <section id="pets-section">
          <h2 className="flex items-center text-3xl font-semibold tracking-wider text-gray-700 uppercase">
            <span className="bg-third mr-2 rounded-full px-5.5 py-3 text-4xl font-bold text-white">
              2
            </span>{" "}
            Your Pets
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-600">
                Pet Information
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Pet's Name"
                  className="w-full rounded-md border p-2"
                />
                <input
                  type="text"
                  placeholder="Pet's Breed"
                  className="w-full rounded-md border p-2"
                />
                <button className="w-full rounded-md bg-green-500 p-2 text-white transition hover:bg-green-600">
                  Save Pet Info
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
