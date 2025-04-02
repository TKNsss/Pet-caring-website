import React from 'react'
import logo from "../../../assets/logo.png";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
const Footer = () => {
  return (
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
  )
}

export default Footer