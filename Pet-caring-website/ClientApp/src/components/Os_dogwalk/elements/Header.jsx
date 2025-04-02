import React from "react";
import dogwalk_header from "../../../assets/dogwalk_header.png";
import dogwalk_header2 from "../../../assets/dogwalk_header2.png";
import { FaPaw } from "react-icons/fa";
const Header = () => {
  return (
    <div
      style={{ backgroundColor: "#FFE99A" }}
      className="relative m-0 flex w-screen flex-col lg:flex-row"
    >
      {/* <div className='absolute bottom-0 w-full border-b border-black p-4'></div> */}
      <svg
        class="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1536 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13,100 C512,20 1152,140 1536,80 L1536,100 L0,100 Z"
          fill="white"
        />
      </svg>
      <img
        src={dogwalk_header2}
        alt=""
        className="ml-auto block h-[60vh] w-full [clip-path:circle(75%_at_50%_0%)] sm:h-[85vh] sm:[clip-path:circle(68%_at_50%_0%)] lg:hidden"
      />
      <div className="text-center lg:w-2/5">
        <div className="lg:inline-block">
          <h1 className="text-center text-[40px] leading-[67.95px] text-[#6F32BE] sm:text-[50px] md:text-[60px] lg:mt-[82px] lg:text-[42px] xl:mt-[72px] xl:text-left xl:text-[52px]">
            DOG WALKING SERVICES{" "}
          </h1>
          <p className="mt-[2%] pb-[30px] text-center text-[20px] leading-[30px] text-[#6F32BE] md:text-[30px] lg:mt-[30px] lg:text-[20px] xl:mt-[30px] xl:text-left">
            Local, experienced dog walkers you can trust
          </p>
          <button
            style={{ fontFamily: "chewy" }}
            className="mx-auto mb-[10%] flex w-[227px] justify-center rounded-[25px] bg-[#7759CC] px-3.5 py-2 text-center text-[23px] leading-[30.05px] text-white shadow-[1px_4px_5px_rgba(0,0,0,0.3)] lg:m-0 lg:mt-[30px]"
          >
            <FaPaw className="mr-[5px]" />
            Request Services
          </button>
        </div>
      </div>
      <img
        src={dogwalk_header}
        alt=""
        className="ml-auto hidden h-[75vh] w-3/5 lg:block"
      />
    </div>
  );
};

export default Header;
