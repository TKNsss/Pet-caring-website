import React from "react";
import footerHome from "../../../assets/footer_home.png";
import footerHome2 from "../../../assets/OsDogwalk_footer.png";
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
            class="z-10 mt-4 hidden object-cover md:mt-0 lg:block lg:h-[300px] lg:w-[230px] xl:h-[350px] xl:w-[270px]"
          />
        </div>
      </div>

      {/* Thông tin phía dưới (Cream background) */}
      <div class="xl: relative flex justify-center bg-[#FDF3DC] pt-[50px] pb-12 xl:block xl:pt-0">
        <svg
          class="absolute top-0 left-0 w-full"
          viewBox="0 0 1536 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
            M0,10
            C256,0 521,10 768,0
            C1024,0 1280,10 1536,10
            L1536,0
            L0,0
            Z
          "
            fill="#FFFFFF"
          />
        </svg>
        {/* Nội dung 4 cột */}
        <div class="flex flex-col items-end px-[30px] xl:flex-row xl:justify-between">
          <img src={logo} alt="logo" class="hidden w-[150px] xl:block" />

          <div class="flex flex-1 flex-col justify-between xl:flex-row">
            <h1 class="font-chewy mb-[10px] hidden text-[30px] font-normal text-[#7759CC] lg:text-[15px] xl:block xl:text-[22px]">
              HAPPY PET CARE
            </h1>

            <div class="mb-[40px] xl:mb-0">
              <h1 class="font-chewy mb-[10px] text-center text-[25px] leading-[100%] font-normal text-[#7759CC] xl:text-[22px]">
                Working Hours
              </h1>
              <ul class="list-disc text-center text-[#000000]">
                <li class="font-Monserrat text-[16px] [&::marker]:text-[0.5rem]">
                  Monday - Sunday: 10 am - 9 pm
                </li>
                <li class="font-Monserrat text-[16px] [&::marker]:text-[0.5rem]">
                  All holidays & school vacations
                </li>
              </ul>
            </div>

            <div class="mb-[40px] text-center xl:mb-0">
              <h1 class="font-chewy mb-[10px] text-center text-[25px] leading-[100%] font-normal text-[#7759CC] xl:text-[22px]">
                Location
              </h1>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Happy Pet Care 115 Sutherland
              </p>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Rd.Brighton, MA
              </p>
            </div>

            <div class="mb-[40px] text-center xl:mb-0">
              <h1 class="font-chewy mb-[10px] text-[25px] leading-[100%] font-normal text-[#7759CC] xl:text-[22px]">
                Contact
              </h1>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Got question? Call us
              </p>
              <p class="font-Monserrat text-[16px] font-bold text-[#000000]">
                617-600-351
              </p>
            </div>

            <div className="flex justify-center">
              <img src={logo} alt="logo" class="w-[100px] xl:hidden" />
            </div>

            <h1 class="font-chewy mb-[10px] text-center text-[20px] font-normal text-[#7759CC] lg:text-[15px] xl:hidden xl:text-[22px]">
              HAPPY PET CARE
            </h1>

            <div class="text-center">
              <h1 class="font-chewy mb-[10px] hidden text-[25px] leading-[100%] font-normal text-[#7759CC] xl:block xl:text-[22px]">
                Follow
              </h1>
              <div className="flex justify-center">
                <FaInstagram className="mr-[10px] text-[22px] text-[#7759CC99]" />
                <FaFacebook className="text-[22px] text-[#7759CC99]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
