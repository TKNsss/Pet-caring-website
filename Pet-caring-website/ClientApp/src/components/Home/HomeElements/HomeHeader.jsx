import React from "react";
import pictureMain from "../../../assets/home-header.png";
import pictureMain2 from "../../../assets/home-header2.jpg";
import { FaPaw } from "react-icons/fa";

const HomeHeader = () => {
  return (
    <div
      style={{ backgroundColor: "#5A3BB3" }}
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
        src={pictureMain2}
        alt=""
        className="ml-auto block h-[60vh] w-full [clip-path:circle(75%_at_50%_0%)] sm:h-[85vh] sm:[clip-path:circle(68%_at_50%_0%)] lg:hidden"
      />
      <div className="text-center lg:w-3/5">
        <div className="inline-block">
          <h1 className="text-center text-[40px] leading-[67.95px] text-[#F1F1F1] sm:text-[50px] md:text-[60px] lg:mt-[82px] lg:text-left lg:text-[42px] xl:mt-[72px] xl:text-[52px]">
            ONLY THE{" "}
            <span className="text-[40px] leading-[67.95px] text-[#F7CE72] sm:text-[50px] md:text-[60px] lg:mt-[82px] lg:text-left lg:text-[42px] xl:mt-[72px] xl:text-[52px]">
              BEST
            </span>{" "}
            FOR YOUR BESTIES
          </h1>
          <p className="mt-[2%] pb-[30px] text-center text-[20px] leading-[30px] text-[#F1F1F1] md:text-[30px] lg:mt-[30px] lg:w-[46vw] lg:text-left lg:text-[20px] xl:mt-[30px]">
            Provide pet care expertise in{" "}
            <span className="text-[20px] leading-[30px] text-[#F7CE72] md:text-[30px] lg:text-left lg:text-[20px]">
              Allston, Brighton, Brookline, Chestnut Hill, Fenway, Kenmore,
              Newton Corner, MA
            </span>
          </p>
          <button
            style={{ fontFamily: "chewy" }}
            className="mx-auto mb-[10%] flex w-[227px] justify-center rounded-[25px] bg-[#E4813A] px-3.5 py-2 text-[23px] leading-[30.05px] text-white shadow-[1px_4px_5px_rgba(0,0,0,0.3)] lg:m-0 lg:mt-[30px]"
          >
            <FaPaw className="mr-[5px]" />
            Request Services
          </button>
        </div>
      </div>
      <img
        src={pictureMain}
        alt=""
        className="ml-auto hidden h-[70vh] w-2/5 lg:block"
      />
    </div>
  );
};

export default HomeHeader;
