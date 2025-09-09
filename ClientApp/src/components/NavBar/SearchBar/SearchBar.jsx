import React from "react";

import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className="group relative mr-2 md:mr-0 max-md:w-full">
      <input type="search" placeholder="Search" className="search-bar" />
      <IoMdSearch className="group-hover:text-primary absolute top-1/2 left-0.75 -translate-y-1/2 text-xl duration-200" />
    </div>
  );
};

export default SearchBar;
