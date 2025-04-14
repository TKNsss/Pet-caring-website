import React, { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { userFields } from "../../../constants";
import { updateUserProfile, triggerRefreshUserProfile } from "../../../redux/features/users/usersSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ProfileCard = ({ user }) => {
  const [update, setUpdate] = useState(false);
  const [unEditable, setUnEditable] = useState(true);

  const dispatch = useDispatch();

  const getInitialFormData = (user) => ({
    username: user?.username || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState(getInitialFormData(user));

  useEffect(() => {
    setFormData(getInitialFormData(user));
  }, [user]);

  const resetForm = () => {
    setFormData(getInitialFormData(user));
    setUnEditable(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      toast.error("No user profile found.");
      return;
    }

    // Build the updated profile object by comparing with original
    const updatedProfile = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (
          !key.toLowerCase().includes("password") &&
          value !== undefined &&
          value !== user[key]
        ) {
          acc[key] = value.trim();
        }
        return acc;
      },
      {},
    );

    if (Object.keys(updatedProfile).length === 0) {
      toast.info("No changes made to the profile.");
      setUnEditable(true);
      return;
    }

    try {
      await dispatch(updateUserProfile(updatedProfile)).unwrap();
      dispatch(triggerRefreshUserProfile());
      setUnEditable(true);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-4 shadow-md @max-3xl:items-center @xl:p-6 @3xl:flex-row">
      <div className="flex w-full flex-col items-center gap-6 @3xl:flex-row">
        <img
          src="https://i.imgur.com/uL8jzDN.png"
          alt="avatar"
          className={`h-24 w-24 rounded-full @3xl:${update && "self-start"}`}
        />

        <div className="w-full">
          {update ? (
            <div className="flex flex-col gap-4 @3xl:flex-row">
              {/* LEFT COLUMN */}
              <div className="w-full">
                <p className="font-Poppins mb-3 font-semibold tracking-wider">
                  <span className="bg-third rounded-full px-3 py-1 text-white">
                    1
                  </span>{" "}
                  PROFILE
                </p>
                {userFields
                  .filter(
                    (field) =>
                      field.name !== "newPassword" &&
                      field.name !== "confirmedPassword",
                  )
                  .map(({ label, name }) => (
                    <div key={name} className="mb-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      {name === "address" ? (
                        <textarea
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          rows={3}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          disabled={unEditable}
                          className={`w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm ${unEditable && "bg-gray-100"}`}
                        />
                      ) : (
                        <input
                          type={name === "email" ? "email" : "text"}
                          name={name}
                          value={formData[name]}
                          disabled={name === "email" ? true : unEditable}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          onChange={handleChange}
                          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${name === "email" && "bg-gray-100"} ${unEditable && "bg-gray-100"}`}
                        />
                      )}
                    </div>
                  ))}
              </div>

              {/* RIGHT COLUMN - Passwords */}
              <div className="w-full">
                <p className="font-Poppins mb-3 font-semibold tracking-wider">
                  <span className="bg-third rounded-full px-2.5 py-1 text-white">
                    2
                  </span>{" "}
                  Password
                </p>
                {userFields
                  .filter(
                    (field) =>
                      field.name === "newPassword" ||
                      field.name === "confirmedPassword",
                  )
                  .map(({ label, name }) => (
                    <div key={name} className="mb-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        type="password"
                        name={name}
                        disabled={unEditable}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={formData[name]}
                        onChange={handleChange}
                        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${unEditable && "bg-gray-100"}`}
                      />
                    </div>
                  ))}

                {/* Buttons */}
                <div className="mt-4 grid grid-cols-1 justify-center gap-2 text-sm @lg:grid-cols-2">
                  <button
                    className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 @5xl:px-2 @5xl:py-1 @5xl:text-xs @6xl:px-4 @6xl:py-2 @6xl:text-sm"
                    onClick={() => {
                      if (unEditable) {
                        setUnEditable(false);
                      } else {
                        resetForm();
                      }
                    }}
                  >
                    {unEditable ? "Update" : "Cancel"}
                  </button>
                  <button
                    className={`rounded-md bg-green-500 px-4 py-2 text-white ${unEditable ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-green-600"}`}
                    onClick={handleUpdateProfile}
                    disabled={unEditable}
                  >
                    Save
                  </button>
                  <button
                    className="bg-third cursor-pointer rounded-md px-4 py-2 text-white hover:bg-purple-900 @3xl:col-span-2"
                    onClick={() => console.log("Save New Password clicked")}
                  >
                    Save Password
                  </button>
                  <button
                    className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 @3xl:col-span-2 @3xl:mx-auto @3xl:w-fit"
                    onClick={() => setUpdate(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="@lg:text-center @3xl:text-left">
              <p className="text-primary text-xl font-semibold @md:text-2xl">
                {formData.username || (
                  <span className="text-gray-400">User name?</span>
                )}
              </p>
              <p className="@max-md:text-base">
                Full name:{" "}
                {formData.firstname || formData.lastname ? (
                  <>
                    {formData.firstname} {formData.lastname}
                  </>
                ) : (
                  <span className="text-gray-400">your full name?</span>
                )}
              </p>
              <p className="@max-md:text-base">
                Address:{" "}
                {formData.address || (
                  <span className="text-gray-400">your address?</span>
                )}
              </p>
              <p className="@max-md:text-base">
                E-mail:{" "}
                <span className="text-blue-500 @max-sm:text-xs">
                  {formData.email || (
                    <span className="text-gray-400">your email?</span>
                  )}
                </span>
              </p>
              <p className="@max-md:text-base">
                Mobile:{" "}
                {formData.phone || (
                  <span className="text-gray-400">your phone number?</span>
                )}
              </p>
            </div>
          )}

          <div className="mt-2 flex gap-3">
            {["instagram", "facebook", "vk"].map((icon) => (
              <span
                key={icon}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm"
              >
                🌐
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        className={`text-third @3xl:self-start ${update && "hidden"} transform cursor-pointer transition-transform duration-300 hover:scale-110`}
        onClick={() => setUpdate((prev) => !prev)}
      >
        <BsPencilSquare className="text-3xl @3xl:text-2xl" />
      </button>
    </div>
  );
};

export default ProfileCard;
