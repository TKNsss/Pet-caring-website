import React from "react";
import { logoWhite, profile, womanHoldCat } from "../../../constants";

const Sidebar = ({ section, setSection }) => {
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
            {profile.map(({ id, title, icon: Icon }) => (
              <li
                key={id}
                onClick={() => setSection(id)}
                className={`group relative flex cursor-pointer items-center gap-3 rounded-l-full py-7 hover:text-black @max-5xl:justify-center @5xl:px-8 @5xl:py-5 ${section === id ? "bg-profileSecondary activeRadius text-black" : ""} `}
              >
                <Icon className="transform text-2xl transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden transform transition-transform duration-300 group-hover:scale-110 @5xl:block">
                  {title}
                </span>
              </li>
            ))}
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
