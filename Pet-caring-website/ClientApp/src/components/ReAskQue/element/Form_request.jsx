import React from "react";
import icon_dogwalking from "../../../assets/icon_dogwalking.png";
import icon_dogrunning from "../../../assets/icon_dogrunning.png";
import icon_dogboarding from "../../../assets/icon_dogboarding.png";
import icon_dogovernight from "../../../assets/icon_dogovernight.png";
import icon_doginhome from "../../../assets/icon_doginhome.png";
import icon_dogtaxi from "../../../assets/icon_dogtaxi.png";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

const Form_request = () => {
  return (
    <div className="px-20 py-8">
      {/* Dùng grid để chia 2 cột khi >= md (768px), còn <md sẽ dàn 1 cột */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {/* Form bên trái (chiếm 2 cột trên màn hình lớn) */}
        <div className="space-y-6 md:col-span-2">
          {/* Select Services */}
          {/* Tiêu đề trang */}
          <h3 className="mb-6 text-2xl font-bold text-[#7759CC] md:text-3xl">
            Request Services
          </h3>
          <p className="mb-8 text-[17px]">
            Please select any services you’re interested in and fill out the
            form
          </p>

          <div>
            <h3 className="font-Monserrat mb-2 text-[16px] font-bold">
              Select Service(s)<span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-wrap justify-between">
              {/* Mỗi service có thể là 1 button/card */}
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] hover:text-[#F7CE72] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_dogwalking}
                  alt=""
                  className="absolute top-0 left-1/2 mt-[4px] w-[50px] -translate-x-1/2 transform text-center sm:w-[90px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Dog Walking
                  </h3>
                </div>
              </div>
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_dogrunning}
                  alt=""
                  className="absolute top-0 left-1/2 mt-[5px] w-[40px] -translate-x-1/2 transform text-center text-red-500 mix-blend-multiply sm:w-[80px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Dog Running
                  </h3>
                </div>
              </div>
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_dogovernight}
                  alt=""
                  className="absolute top-0 left-1/2 mt-[4px] w-[50px] -translate-x-1/2 transform text-center sm:w-[90px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Dog Overnight Care
                  </h3>
                </div>
              </div>
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_dogboarding}
                  alt=""
                  className="absolute top-0 left-1/2 w-[50px] -translate-x-1/2 transform text-center sm:w-[90px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Dog Day Care
                  </h3>
                </div>
              </div>
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_doginhome}
                  alt=""
                  className="absolute top-0 left-1/2 w-[50px] -translate-x-1/2 transform text-center sm:w-[90px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Pet In-home Visit
                  </h3>
                </div>
              </div>
              <div className="group relative mb-3 h-[70px] w-[70px] flex-col items-center rounded-md border-3 border-[#7759CC] text-gray-700 hover:bg-[#7759CC] sm:h-[120px] sm:w-[120px]">
                <img
                  src={icon_dogtaxi}
                  alt=""
                  className="absolute top-0 left-1/2 w-[55px] -translate-x-1/2 transform text-center sm:w-[105px]"
                />
                <div className="absolute mt-[40px] w-full sm:mt-[70px]">
                  <h3 className="text-center text-[8px] text-[#7759CC] group-hover:text-[#F7CE72] sm:text-[14px]">
                    Pet Taxi
                  </h3>
                </div>
              </div>

              {/* Thêm các service khác tùy ý */}
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Your Name */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Your Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            {/* Pet Name(s) */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Pet Name(s)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="e.g. Lucky"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Phone<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Pet Type */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Pet Type<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="e.g. Dog, Cat..."
              />
            </div>

            {/* Your Location */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Your Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="City, State"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                Zip Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                placeholder="e.g. 12345"
              />
            </div>

            {/* How can we help? */}
            <div>
              <label className="font-monsterate mb-1 block text-[16px] font-bold">
                How can we help?
              </label>
              <textarea
                className="w-full border border-[#D9D9D9] px-3 py-2 shadow-lg focus:ring-2 focus:ring-[#7759CC] focus:outline-none"
                rows="3"
                placeholder="Describe your request..."
              />
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button className="font-chewy w-full rounded-full bg-[#7759CC] px-6 py-2 text-[15px] text-white hover:bg-purple-700 sm:text-[25px]">
              Submit Your Service Request
            </button>
          </div>
        </div>

        {/* Contact Us bên phải (chiếm 1 cột trên màn hình lớn) */}
        <div className="pl-3 md:ml-15 md:border-l md:border-[#AFB1B6]">
          <h3 className="mb-4 text-[30px] font-bold text-[#7759CC]">
            Contact Us
          </h3>
          <p className="font-Monserrat mb-4 md:text-[14px] lg:text-[18px]">
            We’re open for any suggestion or just to have a chat!
          </p>
          <ul className="space-y-3">
            <li className="font-Inter flex items-start font-normal text-[#33363F]">
              <FaPhoneAlt className="mt-1 mr-2 flex-shrink-0 text-[22px] text-[#7759CC9E]" />
              <p className="block md:text-[14px] md:inline lg:text-[18px]">
                <span className="font-bold">Phone:</span> 02135-607-312
              </p>
            </li>
            <li className="font-Inter flex items-start font-normal break-all text-[#33363F]">
              <IoMdMail className="mt-1 mr-2 flex-shrink-0 text-[22px] text-[#7759CC9E]" />
              <p className="block md:text-[14px] md:inline lg:text-[18px]">
                <span className="font-bold">Email:</span> HappyPetCare@gmail.com
              </p>
            </li>
            <li className="font-Inter flex items-start font-normal text-[#33363F]">
              <FaLocationDot className="mt-1 mr-2 flex-shrink-0 text-[22px] text-[#7759CC9E]" />
              <p className="block md:text-[14px] md:inline lg:text-[18px]">
                <span className="font-bold">Address:</span> Happy Pet Care, 151
                Sutherland Rd. Brighton, MA
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Form_request;
