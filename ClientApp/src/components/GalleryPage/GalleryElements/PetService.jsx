import React from "react";
import { useState, useEffect } from "react";
// 1) Import component LazyLoadImage từ thư viện react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
// 2) Import file CSS cho hiệu ứng "blur"
import "react-lazy-load-image-component/src/effects/blur.css";
import { categories, images } from "../../../constants";

const PetService = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6); // Ban đầu hiển thị 6 ảnh

  // Dùng useEffect để cập nhật số ảnh ban đầu dựa theo chiều rộng trình duyệt
  useEffect(() => {
    const updateInitialCount = () => {
      if (window.innerWidth < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(6);
      }
    };

    // Cập nhật ngay khi component mount
    // updateInitialCount();

    // Lắng nghe sự thay đổi kích thước cửa sổ
    window.addEventListener("resize", updateInitialCount);
    return () => window.removeEventListener("resize", updateInitialCount);
  }, []);

  // Cập nhật ngay khi component mount

  // Hàm load thêm ảnh
  const toggleImages = () => {
    if (isExpanded && window.innerWidth < 1024) {
      setVisibleCount(4); // Thu gọn về 6 ảnh
    } else if (isExpanded && window.innerWidth >= 1024) {
      setVisibleCount(6);
    } else {
      setVisibleCount(images.length); // Hiển thị tất cả ảnh
    }
    setIsExpanded(!isExpanded); // Đảo trạng thái
  };
  // Lọc ảnh dựa trên danh mục được chọn
  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="web-container @container">
      <div className="mt-[86px] mb-8 px-[2.25rem]">
        <h3 className="mb-11 text-3xl font-bold text-black">
          Your Pet Is Our{" "}
          <span className="text-3xl font-bold text-[#6F32BE]">Family</span>{" "}
          Member
        </h3>

        {/* Thanh chọn danh mục */}
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
              {cat.label}
            </button>
          ))}
        </div>

        <div>
          <div className="relative grid grid-cols-1 justify-items-center lg:grid-cols-3 lg:gap-4">
            {filteredImages.slice(0, visibleCount).map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={`Image ${idx}`}
                effect="blur"
                className="mb-8 rounded-lg shadow-md @max-5xl:w-[500px]"
              />
            ))}
          </div>
          <div className="sticky bottom-[50px] left-0 mt-6 flex justify-center">
            <button
              onClick={toggleImages}
              className="border-third text-third hover:bg-third rounded-[25px] border-2 px-6 py-2 font-medium transition hover:text-white"
            >
              {isExpanded ? "Show Less" : "Load More"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetService;
