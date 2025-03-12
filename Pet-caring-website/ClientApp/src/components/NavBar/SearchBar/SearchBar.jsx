import React from "react";

import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className="group relative mr-2 @3xl:mr-0">
      <input type="text" placeholder="Search" className="search-bar" />
      <IoMdSearch className="group-hover:text-primary absolute top-1/2 left-0.75 -translate-y-1/2 text-2xl duration-200" />
    </div>
  );
};

export default SearchBar;
