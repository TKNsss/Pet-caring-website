import React, { useState } from "react";
import { FaCircleChevronRight } from "react-icons/fa6";
import home_gallery1 from "../../../assets/home-gallery1.jpg";
import home_gallery2 from "../../../assets/home-gallery2.jpg";
import home_gallery3 from "../../../assets/home-gallery3.jpg";

const Gallery = () => {
  const images = [home_gallery1, home_gallery2, home_gallery3];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div>
      <div className="relative hidden bg-[#FDF3DC] lg:block">
        <svg
          class="absolute bottom-0 left-0 w-full"
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
          class="absolute top-0 left-0 w-full"
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

        <div className="px-13 py-10">
          {/* Tiêu đề */}
          <h3 className="text-center text-3xl font-bold text-gray-900">
            See Our{" "}
            <span className="text-3xl font-bold text-[#6F32BE]">Happy</span>{" "}
            Moments
          </h3>

          {/* Hình ảnh */}
          <div className="mt-8 flex justify-between">
            <div className="boder-2 boder-[#AFB1B6] h-70 w-70 overflow-hidden rounded-lg xl:h-80 xl:w-80">
              <img
                src={home_gallery1}
                alt="Sleeping Dog"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="boder-2 boder-[#AFB1B6] h-70 w-70 overflow-hidden rounded-lg xl:h-80 xl:w-80">
              <img
                src={home_gallery2}
                alt="Dog Grooming"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="boder-2 boder-[#AFB1B6] h-70 w-70 overflow-hidden rounded-lg xl:h-80 xl:w-80">
              <img
                src={home_gallery3}
                alt="Cat Grooming"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Nút bấm */}
          <div className="mt-8 text-center">
            <button className="font-chewy rounded-full border-2 border-[#7759CC] px-15 py-2 text-[25px] text-[#7759CC] hover:bg-[#7759CC] hover:text-white">
              See Gallery →
            </button>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div>
        <div className="relative block bg-[#FDF3DC] p-6 lg:hidden">
          {/* Tiêu đề */}
          <h3 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            See Our <span className="text-[#6F32BE]">Happy</span> Moments
          </h3>

          {/* Hình ảnh */}
          <div className="mt-6 flex items-center justify-center">
            <div className="relative rounded-lg">
              <img
                src={images[currentIndex]}
                alt="Gallery Image"
                className="h-90 w-90 object-cover"
              />
              <button
                onClick={nextImage}
                className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-3 text-3xl leading-none text-white shadow-md transition hover:bg-yellow-500 "
              > 
                →
              </button>
            </div>

          </div>

          {/* Nút Gallery */}
          <div className="mt-6 text-center">
            <button className="font-chewy rounded-full border-2 border-[#7759CC] px-15 py-2 text-[25px] text-[#7759CC] hover:bg-[#7759CC] hover:text-white">
              See Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
