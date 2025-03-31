import React from "react";
import PetService_1 from "../../../assets/petService_1.jpg";
import PetService_2 from "../../../assets/PetService_2.jpg";
import PetService_3 from "../../../assets/PetService_3.jpg";
import PetService_4 from "../../../assets/PetService_4.jpg";
import PetService_5 from "../../../assets/PetService_5.jpg";
import PetService_6 from "../../../assets/PetService_6.jpg";
import { useState, useEffect } from "react";
// 1) Import component LazyLoadImage từ thư viện react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
// 2) Import file CSS cho hiệu ứng "blur"
import "react-lazy-load-image-component/src/effects/blur.css";
import { script } from "framer-motion/client";

const categories = [
  { key: "all", label: "All" },
  { key: "dog-walking", label: "Dog Walking" },
  { key: "dog-running", label: "Dog Running" },
  { key: "dog-day-care", label: "Dog Day Care" },
  { key: "dog-overnight-care", label: "Dog Overnight Care" },
  { key: "pet-in-home", label: "Pet In-home Visit" },
  { key: "pet-taxi", label: "Pet Taxi" },
];

const images = [
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_6, category: "dog-walking" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_2, category: "dog-running" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_3, category: "dog-day-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_1, category: "dog-overnight-care" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_5, category: "pet-in-home" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_1, category: "pet-taxi" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
  { src: PetService_4, category: "dog-running" },
];
// 3) Mảng ảnh mẫu (thay đường dẫn thành ảnh thật của bạn)

// 4) Component chính

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
    <div className="mt-[86px] p-15">
      <h3 className="mb-11 text-3xl font-bold text-black">
        Your Pet Is Our{" "}
        <span className="text-3xl font-bold text-[#6F32BE]">Family</span> Member
      </h3>

      {/* Thanh chọn danh mục */}

      <div className="mb-11 flex space-x-4 overflow-x-auto whitespace-nowrap xl:justify-between">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`font-Montserrat cursor-pointer rounded-md px-4 py-2 text-[23px] font-bold ${
              selectedCategory === cat.key
                ? "text-[#7759CC] underline"
                : "text-[#AFB1B6]"
            }`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div>
        <div className="relative lg:grid lg:grid-cols-3 lg:gap-4">
          {filteredImages.slice(0, visibleCount).map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={`Image ${idx}`}
              effect="blur"
              className="mb-8 rounded-lg shadow-md"
            />
          ))}
        </div>
        <div className="sticky bottom-[50px] left-0 mt-6 flex justify-center">
          <button
            onClick={toggleImages}
            className="rounded-[25px] border-2 border-[#7759CC] px-6 py-2 font-medium text-[#7759CC] transition hover:bg-[#7759CC] hover:text-white"
          >
            {isExpanded ? "Show Less" : "Load More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetService;
