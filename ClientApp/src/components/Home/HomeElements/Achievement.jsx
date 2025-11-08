import React, { useState } from "react";
import { statsData } from "../../../constants";
import { useTranslation } from "react-i18next";

const Achievement = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  // Xử lý chuyển sang mục trước
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? statsData.length - 1 : prev - 1));
  };

  // Xử lý chuyển sang mục sau
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === statsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-[#FDF3DC] sm:bg-[#EBE8FC]">
      <div className="web-container @container">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1536 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
            M0,0
            C256,7 521,-1 768,10
            C1024,10 1280,0 1536,10
            L1536,20
            L0,20
            Z
          "
            fill="#FFFFFF"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1536 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
            M0,0
            C256,10 521,0 768,10
            C1024,10 1280,0 1536,10
            L1536,0
            L0,0
            Z
          "
            fill="#FFFFFF"
          />
        </svg>

        <div className="px-[2.25rem] py-16 sm:px-6 lg:px-8">
          <h3
            className="mb-8 text-center text-[30px] font-bold text-[#33363F] md:text-3xl"
            dangerouslySetInnerHTML={{ __html: t("home.achievements.heading") }}
          />

          {/* màn lớn */}
          <div className="hidden grid-cols-3 gap-8 text-center sm:grid">
            {statsData.map((item) => (
              <div key={item.id}>
                <h1 className="mb-2 text-[80px] font-bold text-[#6F32BE] sm:text-5xl">
                  {item.number}
                </h1>
                <p className="font-Monserrat text-[20px] font-bold text-gray-600">
                  {item.descriptionKey
                    ? t(item.descriptionKey)
                    : item.description}
                </p>
              </div>
            ))}
          </div>

          {/* màn bé */}
          <div className="flex items-center justify-center gap-[50px] sm:hidden">
            {/* Vùng hiển thị item hiện tại */}
            <button
              onClick={handlePrev}
              className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F7CE72] text-gray-700 shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"
            >
              &lt;
            </button>

            <div className="flex flex-col items-center">
              <div className="relative mb-[30px] flex h-[200px] w-[200px] items-center justify-center">
                <div className="absolute inset-0 z-10">
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full overflow-visible"
                  >
                    <path
                      fill="transparent"
                      stroke="#000000"
                      strokeWidth="2"
                      d="M44.3,-43C52.2,-36.4,49.8,-18.2,45,-4.8C40.1,8.5,32.9,17.1,25,21.8C17.1,26.6,8.5,27.6,-4.4,32C-17.3,36.3,-34.5,44.1,-45.8,39.3C-57.1,34.5,-62.4,17.3,-62.5,-0.1C-62.6,-17.5,-57.6,-35,-46.3,-41.6C-35,-48.2,-17.5,-43.9,0.3,-44.3C18.2,-44.6,36.4,-49.6,44.3,-43Z
                    "
                      transform="translate(110 100) scale(2)"
                    />
                  </svg>
                </div>

                {/* <!-- Blob màu trắng, viền đen --> */}
                <div className="absolute inset-0">
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full overflow-visible"
                  >
                    <path
                      fill="#FFFFFF"
                      // stroke="#000000"
                      // strokeWidth="2"
                      d="M44.3,-43C52.2,-36.4,49.8,-18.2,45,-4.8C40.1,8.5,32.9,17.1,25,21.8C17.1,26.6,8.5,27.6,-4.4,32C-17.3,36.3,-34.5,44.1,-45.8,39.3C-57.1,34.5,-62.4,17.3,-62.5,-0.1C-62.6,-17.5,-57.6,-35,-46.3,-41.6C-35,-48.2,-17.5,-43.9,0.3,-44.3C18.2,-44.6,36.4,-49.6,44.3,-43Z"
                      transform="translate(100 110) scale(2)"
                    />
                  </svg>
                </div>

                <p className="font-chewy relative mb-2 text-[90px] font-bold text-[#6F32BE]">
                  {statsData[currentIndex].number}
                </p>
              </div>

              <p className="text-gray-700">
                {statsData[currentIndex].descriptionKey
                  ? t(statsData[currentIndex].descriptionKey)
                  : statsData[currentIndex].description}
              </p>
            </div>

            {/* Nút Prev/Next */}

            <button
              onClick={handleNext}
              className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F7CE72] text-gray-700 shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
