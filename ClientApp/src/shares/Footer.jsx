import React from "react";
import RequestServiceBtn from "./RequestServiceBtn";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { logo } from "../constants";

const Footer = ({ title, petImgs, id }) => {
  return (
    <div
      className={`${id === "RequestService" ? "bg-lightYellow" : "bg-primary"} relative text-white`}
    >
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

        {id !== "RequestService" && (
          <div className="lg flex h-[150px] items-center justify-between sm:h-[200px] lg:h-[280px] xl:h-[320px]">
            {/* <!-- Ảnh chú chó (bên trái) --> */}
            <img
              src={petImgs[0]}
              alt="Cool Dog"
              className="z-1 h-[150px] w-[155px] object-cover sm:h-[230px] sm:w-[250px] lg:h-[350px] lg:w-[400px] xl:h-[370px] xl:w-[450px]"
            />

            {/* <!-- Khối nội dung ở giữa --> */}
            <div className="flex-1 space-y-4 text-center">
              <h2 className="font-Poppins text-[15px] font-bold text-[#F1F1F1] sm:text-[25px] lg:text-[25px] xl:text-[35px]">
                {title}
              </h2>
              <RequestServiceBtn
                bgColor={"bg-mdYellow"}
                txtColor={"text-txt-2"}
                paddingX={"px-24"}
              />
            </div>

            {/* Ảnh chú mèo (bên phải) */}
            <img
              src={petImgs[1]}
              alt="Happy Cat"
              className={`z-10 mt-4 hidden object-cover md:mt-0 lg:block lg:h-[300px] lg:w-[300px] xl:h-[350px] xl:w-[300px] ${id === "Gallery" && "object-left"}`}
            />
          </div>
        )}

        {/* Thông tin phía dưới (Cream background) */}
        <div className="bg-lightYellow relative flex justify-center pt-[50px] pb-12 xl:block xl:pt-0">
          <svg
            className="absolute top-0 left-0 w-full"
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
          <div className="grid items-center justify-center gap-8 px-[30px] xl:w-full xl:gap-y-10 @max-xl:grid-cols-1 @xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-[0.8fr_1fr_1fr_1fr_0.2fr] @7xl:pt-8">
            {/* First Column - Working Hours */}
            <div className="text-center">
              <h1 className="font-chewy mb-[10px] text-[25px] leading-[100%] font-normal xl:text-[22px]">
                Working Hours
              </h1>
              <ul className="list-disc text-center text-[#000000]">
                <li className="font-Monserrat text-[16px] [&::marker]:text-[0.5rem]">
                  Monday - Sunday: 10 am - 9 pm
                </li>
                <li className="font-Monserrat text-[16px] [&::marker]:text-[0.5rem]">
                  All holidays & school vacations
                </li>
              </ul>
            </div>

            {/* Second Column - Location */}
            <div className="text-center">
              <h1 className="font-chewy mb-[10px] text-[25px] leading-[100%] font-normal xl:text-[22px]">
                Location
              </h1>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Happy Pet Care 115 Sutherland
              </p>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Rd.Brighton, MA
              </p>
            </div>

            {/* Third Column - Contact (Moves back to column 3 at @4xl) */}
            <div className="text-center @xl:col-span-2 @5xl:col-span-1">
              <h1 className="font-chewy mb-[10px] text-[25px] leading-[100%] font-normal xl:text-[22px]">
                Contact
              </h1>
              <p className="font-Monserrat text-[16px] text-[#000000]">
                Got question? Call us
              </p>
              <p className="font-Monserrat text-[16px] font-bold text-[#000000]">
                617-600-351
              </p>
            </div>

            {/* Fourth Column - Logo (Spans 2 columns at @xl) */}
            <div className="flex flex-col items-center justify-center @xl:col-span-2 @5xl:col-span-3 @7xl:order-first @7xl:col-span-1 @7xl:max-w-[200px] @7xl:flex-row @7xl:gap-2">
              <img src={logo} alt="logo" className="w-[100px]" />
              <h1 className="font-chewy text-[20px] lg:text-[15px] xl:text-[22px]">
                HAPPY PET CARE
              </h1>
            </div>

            {/* Fifth Column - Follow (Spans 2 columns at @xl) */}
            <div className="text-center @xl:col-span-2 @5xl:col-span-3 @7xl:col-span-1">
              <h1 className="font-chewy mb-[10px] hidden text-[25px] leading-[100%] font-normal xl:block xl:text-[22px]">
                Follow
              </h1>
              <div className="flex justify-center">
                <FaInstagram className="text-third mr-[10px] text-[22px]" />
                <FaFacebook className="text-third text-[22px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
