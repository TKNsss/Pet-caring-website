import React, { useState } from "react";
import Dogwalk from "../../../assets/dogwalk.png";
import Singlewalk from "../../../assets/singlewalk.jpg";
import Groupwalk from "../../../assets/groupwalk.jpg";
import { FaMoneyBill } from "react-icons/fa";

const Dogwalking_op = () => {
  const [activeTab, setActiveTab] = useState("puppy");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto px-10 py-8 lg:px-20">
      {/* Tiêu đề */}
      <h3 className="mb-14 text-4xl font-bold">
        Dog Walking
        <span className="text-[#7759CC]"> Options</span>
      </h3>

      {/* Tab chọn loại dịch vụ */}
      <div className="mb-10 grid grid-cols-3 gap-8">
        <button
          className={`font-Monserrat rounded-lg py-5 sm:text-[27px] font-bold shadow-md lg:text-[23px] ${
            activeTab === "puppy"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("puppy")}
        >
          Puppy Walks
        </button>
        <button
          className={`font-Monserrat rounded-lg py-5 sm:text-[27px] font-bold shadow-md lg:text-[23px] ${
            activeTab === "single"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("single")}
        >
          Single Walk
        </button>
        <button
          className={`font-Monserrat rounded-lg py-5 sm:text-[27px] font-bold shadow-md lg:text-[23px] ${
            activeTab === "group"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("group")}
        >
          Group Walks
        </button>
      </div>

      {/* Nội dung hiển thị tương ứng từng tab */}
      <div className="mt-6">
        {/* Puppy Walks */}
        {activeTab === "puppy" && (
          <div className="flex w-full flex-col items-start lg:flex-row lg:items-stretch">
            {/* Thay thế /puppy.jpg bằng ảnh thực tế của bạn */}
            <div className="w-full flex-1 px-6 lg:relative lg:w-1/2">
              <img
                src={Dogwalk}
                alt="Puppy Walk"
                className="top-0 min-h-[300px] left-0 h-full w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0"
              />
            </div>

            <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
              <p className="font-Monserrat sm:text-[26.5px] font-normal text-gray-700 lg:mb-4 lg:text-[24px] lg:font-medium">
                Puppy Walks are available for dogs under{" "}
                <span className="font-normal lg:font-bold">
                  6 months of age
                </span>
                . Puppy Walks are done individually, protecting young dogs who
                are not fully vaccinated, and teaching them how to walk on a
                leash without distraction.
              </p>
              <div className="mb-6 flex items-start">
                <FaMoneyBill className="mr-2 text-[22px] sm:text-[40px] text-[#F7CE72] lg:text-[30px]" />
                <h3 className="sm:text-[26.5px] font-bold text-[#7759CC] lg:text-[20px]">
                  $16 for 20 mins{" "}
                  <span className="sm:text-[20px] font-normal text-[#7759CC]">
                    ($8/each additional dog)
                  </span>
                </h3>
              </div>
              <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 sm:text-[35px] text-white hover:bg-purple-600 lg:rounded-full lg:text-[25px]">
                Schedule a walk →
              </button>
            </div>
          </div>
        )}

        {/* Single Walk */}
        {activeTab === "single" && (
          <div className="flex w-full flex-col items-start lg:flex-row lg:items-stretch">
          {/* Thay thế /puppy.jpg bằng ảnh thực tế của bạn */}
          <div className="w-full flex-1 px-6 lg:relative lg:w-1/2">
            <img
              src={Singlewalk}
              alt="Puppy Walk"
              className="top-0 min-h-[300px] left-0 h-full w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0"
            />
          </div>

          <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
            <p className="font-Monserrat sm:text-[26.5px] font-normal text-gray-700 lg:mb-4 lg:text-[24px] lg:font-medium">
              Puppy Walks are available for dogs under{" "}
              <span className="font-normal lg:font-bold">
                6 months of age
              </span>
              . Puppy Walks are done individually, protecting young dogs who
              are not fully vaccinated, and teaching them how to walk on a
              leash without distraction.
            </p>
            <div className="mb-6 flex items-start">
              <FaMoneyBill className="mr-2 text-[22px] sm:text-[40px] text-[#F7CE72] lg:text-[30px]" />
              <h3 className="sm:text-[26.5px] font-bold text-[#7759CC] lg:text-[20px]">
                $16 for 20 mins{" "}
                <span className="sm:text-[20px] font-normal text-[#7759CC]">
                  ($8/each additional dog)
                </span>
              </h3>
            </div>
            <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 sm:text-[35px] text-white hover:bg-purple-600 lg:rounded-full lg:text-[25px]">
              Schedule a walk →
            </button>
          </div>
        </div>
        )}

        {/* Group Walks */}
        {activeTab === "group" && (
          <div className="flex w-full flex-col items-start lg:flex-row lg:items-stretch">
          {/* Thay thế /puppy.jpg bằng ảnh thực tế của bạn */}
          <div className="w-full flex-1 px-6 lg:relative lg:w-1/2">
            <img
              src={Groupwalk}
              alt="Puppy Walk"
              className="top-0 min-h-[300px] left-0 h-full w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0"
            />
          </div>

          <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
            <p className="font-Monserrat sm:text-[26.5px] font-normal text-gray-700 lg:mb-4 lg:text-[24px] lg:font-medium">
              Puppy Walks are available for dogs under{" "}
              <span className="font-normal lg:font-bold">
                6 months of age
              </span>
              . Puppy Walks are done individually, protecting young dogs who
              are not fully vaccinated, and teaching them how to walk on a
              leash without distraction.
            </p>
            <div className="mb-6 flex items-start">
              <FaMoneyBill className="mr-2 text-[22px] sm:text-[40px] text-[#F7CE72] lg:text-[30px]" />
              <h3 className="sm:text-[26.5px] font-bold text-[#7759CC] lg:text-[20px]">
                $16 for 20 mins{" "}
                <span className="sm:text-[20px] font-normal text-[#7759CC]">
                  ($8/each additional dog)
                </span>
              </h3>
            </div>
            <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 sm:text-[35px] text-white hover:bg-purple-600 lg:rounded-full lg:text-[25px]">
              Schedule a walk →
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Dogwalking_op;
