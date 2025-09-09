import React from "react";
import { logoWhite, profile, womanHoldCat } from "../../../constants";
import { Link } from "react-router-dom";
import {
  clearSelectedPet,
  selectCurrentPetId,
} from "../../../redux/features/pets/petsSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ section, setSection }) => {
  const dispatch = useDispatch();
  const selectedPetId = useSelector(selectCurrentPetId);

  return (
    <div className="bg-profilePrimary sticky top-0 h-screen w-15 @5xl:w-64">
      <div className="flex h-full flex-col justify-between pt-6 text-white">
        <div className="@5xl:pl-6">
          <div className="mb-10 flex flex-col gap-2 @5xl:pr-6">
            <img
              src={logoWhite}
              alt="logo"
              className="mx-auto w-12 @5xl:w-20"
            />
            <h1 className="font-Poppins hidden text-center text-2xl font-semibold text-white @5xl:block">
              Happy Pet Care
            </h1>
          </div>

          <ul className="flex flex-col">
            {profile.map(({ id, title, icon: Icon }) => {
              const isActive = section === id;
              const baseClasses =
                "group relative flex items-center gap-3 rounded-l-full py-7 hover:text-black";
              const responsiveClasses =
                "@max-5xl:justify-center @5xl:px-8 @5xl:py-5";
              const activeClasses = isActive
                ? "bg-profileSecondary activeRadius text-black"
                : "";
              const iconClasses = "scale-item text-2xl";
              const labelClasses = "hidden scale-item @5xl:block";

              // Handle special "Home" case
              if (id === "Home") {
                return (
                  <li key={id}>
                    <Link
                      to="/"
                      className={`${baseClasses} ${responsiveClasses} ${activeClasses}`}
                      onClick={() => {
                        if (selectedPetId) {
                          dispatch(clearSelectedPet());
                        }
                      }}
                    >
                      <Icon className={iconClasses} />
                      <span className={labelClasses}>{title}</span>
                    </Link>
                  </li>
                );
              }

              // Default menu items
              return (
                <li
                  key={id}
                  onClick={() => setSection(id)}
                  className={`${baseClasses} ${responsiveClasses} ${activeClasses} cursor-pointer`}
                >
                  <Icon className={iconClasses} />
                  <span className={labelClasses}>{title}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ml-4 hidden overflow-hidden @5xl:block">
          <img
            src={womanHoldCat}
            alt="woman-hold-cat"
            className="w-62 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
