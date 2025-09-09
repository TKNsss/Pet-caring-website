import React from "react";
import journalImage from "../../../assets/UpdatesSection.png"; // thay thế bằng đường dẫn ảnh của bạn
import { FaCircleCheck } from "react-icons/fa6";

const UpdatesSection = () => {
  return (
    <section className="px-[20px] md:px-[80px] py-[100px]">
      {/* Container flex, cột dọc trên mobile, cột ngang trên md */}
      <div className="flex flex-col items-start xl:flex-row xl:items-end xl:gap-8">
        
        {/* Phần text */}
        <div className="xl:w-1/2">
          <h3 className="text-[30px] font-bold xl:text-3xl">
            Updates with <span className="text-[#6F32BE]">Photos and Videos</span>
          </h3>
          <p className="mt-8 text-[25px] text-gray-700">
            Our walkers provide comprehensive journals of each walk that include:
          </p>
          <ul className="mt-8 list-disc list-inside space-y-2 text-gray-700">
            <li className="md:text-[30px] flex font-Monserrat items-start list-none">
                <FaCircleCheck color="#F7CE72" className="text-[20px] mt-3 mr-2" />
                Arrival and departure times</li>
            <li className="md:text-[30px] flex font-Monserrat items-start list-none">
                <FaCircleCheck color="#F7CE72" className="text-[20px] mt-3 mr-2" />
                Bathroom, food, and water updates</li>
            <li className="md:text-[30px] flex font-Monserrat items-start list-none">
                <FaCircleCheck color="#F7CE72" className="text-[20px] mt-3 mr-2" />
                Pet temperament and energy levels report</li>
            <li className="md:text-[30px] flex font-Monserrat items-start list-none">
                <FaCircleCheck color="#F7CE72" className="text-[20px] mt-3 mr-2" />
                Photos, videos, and personal written notes</li>
          </ul>
        </div>

        {/* Phần hình ảnh */}
        <div className="mt-8 w-full xl:mt-0 xl:w-1/2">
          <img
            src={journalImage}
            alt="Pet Care Journal"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default UpdatesSection;
