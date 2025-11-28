import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { categories, images } from "../../../constants";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

const PetService = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const { t } = useTranslation();

  useEffect(() => {
    const updateInitialCount = () => {
      setVisibleCount(window.innerWidth < 1024 ? 4 : 6);
    };

    window.addEventListener("resize", updateInitialCount);
    return () => window.removeEventListener("resize", updateInitialCount);
  }, []);

  const toggleImages = () => {
    if (isExpanded) {
      setVisibleCount(window.innerWidth < 1024 ? 4 : 6);
    } else {
      setVisibleCount(images.length);
    }
    setIsExpanded((prev) => !prev);
  };

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="web-container @container">
      <div className="mt-[86px] mb-8 px-[2.25rem]">
        <h3
          className="mb-11 text-3xl font-bold text-black"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(t("gallery.page.heading")),
          }}
        />

        <div className="mb-11 flex space-x-4 overflow-x-auto whitespace-nowrap xl:justify-between">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`font-Monserrat cursor-pointer rounded-md px-4 py-2 text-lg font-bold ${
                selectedCategory === cat.key
                  ? "text-third underline"
                  : "text-navBorder"
              }`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.labelKey ? t(cat.labelKey) : cat.label}
            </button>
          ))}
        </div>

        <div>
          <div className="relative grid grid-cols-1 justify-items-center lg:grid-cols-3 lg:gap-4">
            {filteredImages.slice(0, visibleCount).map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={`Gallery ${idx + 1}`}
                className="mb-8 rounded-lg shadow-md @max-5xl:w-[500px]"
              />
            ))}
          </div>
          <div className="sticky bottom-[50px] left-0 mt-6 flex justify-center">
            <button
              onClick={toggleImages}
              className="border-third text-third hover:bg-third rounded-[25px] border-2 px-6 py-2 font-medium transition hover:text-white"
            >
              {isExpanded
                ? t("gallery.page.showLess")
                : t("gallery.page.loadMore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetService;
