import React from "react";
import footerHome from "../../../assets/footer_home.png";
import footerHome2 from "../../../assets/footer2_home.png";
import logo from "../../../assets/logo.png";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <div>
      <div class="relative bg-[#5A3BB3] text-white">
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
        {/* <!-- Nội dung chính (Chó - Tiêu đề - Mèo) --> */}
        <div class="lg flex h-[150px] items-center justify-between sm:h-[200px] lg:h-[280px] xl:h-[320px]">
          {/* <!-- Ảnh chú chó (bên trái) --> */}
          <img
            src={footerHome}
            alt="Cool Dog"
            class="z-1 h-[150px] w-[155px] object-cover sm:h-[230px] sm:w-[250px] lg:h-[350px] lg:w-[400px] xl:h-[370px] xl:w-[450px]"
          />

          {/* <!-- Khối nội dung ở giữa --> */}
          <div class="flex-1 space-y-4 text-center">
            <h2 class="font-Poppins text-[15px] font-bold text-[#F1F1F1] sm:text-[25px] lg:text-[25px] xl:text-[35px]">
              Bring Happiness to your pet
            </h2>
            <button class="font-chewy w-[150px] rounded-full bg-[#FBE2AC] px-6 py-2 text-[15px] font-normal text-black sm:w-[300px] sm:text-[25px] lg:w-[250px] xl:w-[30vw]">
              Request Services
            </button>
          </div>

          {/* Ảnh chú mèo (bên phải) */}
          <img
            src={footerHome2}
            alt="Happy Cat"
            class="z-10 mt-4 hidden object-cover md:mt-0 lg:block lg:h-[300px] lg:w-[300px] xl:h-[350px] xl:w-[300px]"
          />
        </div>
      </div>

      {/* Thông tin phía dưới (Cream background) */}
      
    </div>
  );
};

export default Footer;
