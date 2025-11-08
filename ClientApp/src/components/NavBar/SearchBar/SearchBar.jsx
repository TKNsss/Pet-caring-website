import React from "react";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <div className="group relative mr-2 md:mr-0 max-md:w-full">
      <input
        type="search"
        placeholder={t("common.search.placeholder")}
        className="search-bar"
      />
      <IoMdSearch className="group-hover:text-primary absolute top-1/2 left-0.75 -translate-y-1/2 text-xl duration-200" />
    </div>
  );
};

export default SearchBar;
