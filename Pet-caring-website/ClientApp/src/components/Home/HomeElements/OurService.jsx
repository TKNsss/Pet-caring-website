import React from "react";
import { services } from "../../../constants";

const OurService = () => {
  return (
    <div className="web-container @container">
      <div className="px-[2.25rem] py-18">
        {/* Tiêu đề */}
        <h3 className="text-center text-[30px] font-bold text-[#33363F]">
          Our <span className="text-[30px] text-[#6F32BE]">Services</span>
        </h3>

        {/* Grid 6 ô dịch vụ */}
        <div className="mt-10 grid w-full grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`group cursor-pointer rounded-xl border border-[#7759CC] p-6 text-center shadow-sm transition-all duration-300 hover:bg-[#6F32BE]`}
            >
              {/* Icon */}
              <div
                className={`mb-[20px] inline-block rounded-full bg-[#EBE8FC] group-hover:bg-[#F7CE72]`}
              >
                <img
                  src={service.icon}
                  className="inline-block w-[78px] text-4xl text-[#7759cc] group-hover:text-[#F7CE72]"
                ></img>
              </div>

              {/* Tiêu đề */}
              <h3 className="mb-[20px] text-[22px] font-semibold text-[#7759cc] group-hover:text-[#F1F1F1]">
                {service.title}
              </h3>

              {/* Mô tả */}
              <p className="font-Lato mt-2 leading-relaxed font-normal group-hover:text-[#F1F1F1] lg:text-[19px] xl:text-[22px]">
                {service.description}
              </p>

              {/* Link "Learn more" */}
              <a
                href="#"
                className={`font-chewy mt-4 inline-block text-[18px] text-[#6F32BE] group-hover:text-[#F7CE72]`}
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurService;
