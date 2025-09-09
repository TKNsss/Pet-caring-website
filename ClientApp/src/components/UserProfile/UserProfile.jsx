import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import PaymentInfo from "./PaymentInfo/PaymentInfo";
import ProfileCard from "./ProfileCard/ProfileCard";
import SubscriptionBox from "./SubscriptionBox/SubscriptionBox";
import PetProfile from "./PetProfile/PetProfile";
import { FaSignOutAlt } from "react-icons/fa";
import { profileTopCat } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/features/users/usersSlice";
import PetCard from "./PetProfile/PetCard/PetCard";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [section, setSection] = useState("My Dashboard");
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="bg-profileSecondary @container relative flex min-h-screen font-sans">
      <Sidebar section={section} setSection={setSection} />

      <div className="mx-auto max-w-[64rem] flex-1 space-y-6 px-10 pb-10">
        <div className="relative flex items-center justify-between rounded-b-3xl bg-white px-6 py-4 shadow-md">
          <p className="text-xl font-bold text-black @md:text-3xl">
            {user?.username || "User"}
          </p>
          <img
            src={profileTopCat}
            className="absolute top-[70%] left-1/2 hidden w-25 -translate-x-1/2 -translate-y-1/2 @3xl:block"
          />
          <button className="cursor-pointer" onClick={handleLogout}>
            <FaSignOutAlt className="text-third scale-item text-xl @md:text-3xl" />
          </button>
        </div>

        {/* 🟡 3. Render section content conditionally */}
        <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
          {section === "My Dashboard" && (
            <>
              <div className="space-y-6 md:col-span-2">
                <ProfileCard user={user} />
                <PetProfile section={section} setSection={setSection} />
              </div>
              <div className="space-y-6">
                <PaymentInfo />
                <SubscriptionBox />
              </div>
            </>
          )}

          {section === "My Profile" && (
            <div className="space-y-6 md:col-span-3">
              <ProfileCard user={user} />
            </div>
          )}

          {section === "My Pets" && (
            <div className="space-y-6 md:col-span-3">
              <PetProfile section={section} setSection={setSection} />
              <PetCard />
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
