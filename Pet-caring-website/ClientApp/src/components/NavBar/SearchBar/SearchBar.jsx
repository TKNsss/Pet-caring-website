import React from "react";

import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className="group relative">
      <input type="text" placeholder="Search" className="search-bar" />
      <IoMdSearch className="group-hover:text-primary absolute top-1/2 left-0.75 -translate-y-1/2 text-2xl duration-200" />
      {/* top: 50% and translateY: -50%, it is a common technique used to center the element vertically within its containing block. */}
    </div>
  );
};

export default SearchBar;
