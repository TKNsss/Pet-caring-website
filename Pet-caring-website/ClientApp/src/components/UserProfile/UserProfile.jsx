import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import PaymentInfo from "./PaymentInfo/PaymentInfo";
import ProfileCard from "./ProfileCard/ProfileCard";
import SubscriptionBox from "./SubscriptionBox/SubscriptionBox";
import CoursesTimeline from "./CoursesTimeline/CoursesTimeline";
import { FaSignOutAlt } from "react-icons/fa";
import { profileTopCat } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../redux/features/users/usersSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [section, setSection] = useState("My Dashboard");
  const userData = useSelector((state) => state.users.user);

  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      dispatch(fetchUserProfile());
      navigate("/login");
    }
  };

  return (
    <div className="bg-profileSecondary @container relative flex min-h-screen font-sans">
      <Sidebar section={section} setSection={setSection} />

      <div className="mx-auto max-w-[64rem] flex-1 space-y-6 px-10 pb-10">
        <div className="relative flex items-center justify-between rounded-b-3xl bg-white px-6 py-4 shadow-md">
          <p className="text-xl font-bold text-black @md:text-3xl">
            {userData?.username || "User"}
          </p>
          <img
            src={profileTopCat}
            className="absolute top-[70%] left-1/2 hidden w-25 -translate-x-1/2 -translate-y-1/2 @3xl:block"
          />
          <button className="cursor-pointer" onClick={handleLogout}>
            <FaSignOutAlt className="text-third transform text-xl transition-transform duration-300 hover:scale-110 @md:text-3xl" />
          </button>
        </div>

        {/* 🟡 3. Render section content conditionally */}
        <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
          {section === "My Dashboard" && (
            <>
              <div className="space-y-6 md:col-span-2">
                <ProfileCard user={userData} />
                <CoursesTimeline />
              </div>
              <div className="space-y-6">
                <PaymentInfo />
                <SubscriptionBox />
              </div>
            </>
          )}

          {section === "My Profile" && (
            <div className="space-y-6 md:col-span-3">
              <ProfileCard user={userData} />
            </div>
          )}

          {section === "My Pets" && (
            <div className="space-y-6 md:col-span-2">
              {/* Replace with actual pets component */}
              <div className="bg-white p-6 shadow-md">🐾 My Pets Section</div>
            </div>
          )}

          {section === "My Payment" && (
            <div className="space-y-6 md:col-span-2">
              <PaymentInfo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
