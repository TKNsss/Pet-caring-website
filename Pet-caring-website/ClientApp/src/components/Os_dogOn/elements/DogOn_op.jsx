import React, { useState } from "react";
import Dogwalk from "../../../assets/puppyOn.jpg";
import Singlewalk from "../../../assets/singleOn.jpg";
import Groupwalk from "../../../assets/groupOn.jpg";
import { FaMoneyBill } from "react-icons/fa";

const DogOn_op = () => {
  const [activeTab, setActiveTab] = useState("puppy");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto px-10 py-8 lg:px-20">
      {/* Tiêu đề */}
      <h3 className="mb-14 text-4xl font-bold">
        Dog Overnight Care
        <span className="text-[#7759CC]"> Options</span>
      </h3>

      {/* Tab chọn loại dịch vụ */}
      <div className="mb-10 grid grid-cols-3 gap-8">
        <button
          className={`font-Monserrat rounded-lg py-5 font-bold shadow-md sm:text-[27px] lg:text-[23px] ${
            activeTab === "puppy"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("puppy")}
        >
          Puppy Care
        </button>
        <button
          className={`font-Monserrat rounded-lg py-5 font-bold shadow-md sm:text-[27px] lg:text-[23px] ${
            activeTab === "single"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("single")}
        >
          Single Care
        </button>
        <button
          className={`font-Monserrat rounded-lg py-5 font-bold shadow-md sm:text-[27px] lg:text-[23px] ${
            activeTab === "group"
              ? "bg-[#7759CC] text-white"
              : "bg-[#FFFFFF] text-[#FCCA5B]"
          }`}
          onClick={() => handleTabChange("group")}
        >
          Group Care
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
                className="top-0 left-0 h-full min-h-[300px] w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0 lg:rounded-r-none"
              />
            </div>

            <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
              <p className="font-Monserrat font-normal text-gray-700 sm:text-[26.5px] lg:mb-4 lg:text-[24px] lg:font-medium">
                Puppy Walks are available for dogs under{" "}
                <span className="font-normal lg:font-bold">
                  6 months of age
                </span>
                . Puppy Walks are done individually, protecting young dogs who
                are not fully vaccinated, and teaching them how to walk on a
                leash without distraction.
              </p>
              <div className="mb-6 flex items-start">
                <FaMoneyBill className="mr-2 text-[22px] text-[#F7CE72] sm:text-[40px] lg:text-[30px]" />
                <h3 className="font-bold text-[#7759CC] sm:text-[26.5px] lg:text-[20px]">
                  $16 for 20 mins{" "}
                  <span className="font-normal text-[#7759CC] sm:text-[20px]">
                    ($8/each additional dog)
                  </span>
                </h3>
              </div>
              <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 text-white hover:bg-purple-600 sm:text-[35px] lg:rounded-full lg:text-[25px]">
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
                className="top-0 left-0 h-full min-h-[300px] w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0 lg:rounded-r-none"
              />
            </div>

            <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
              <p className="font-Monserrat font-normal text-gray-700 sm:text-[26.5px] lg:mb-4 lg:text-[24px] lg:font-medium">
                Puppy Walks are available for dogs under{" "}
                <span className="font-normal lg:font-bold">
                  6 months of age
                </span>
                . Puppy Walks are done individually, protecting young dogs who
                are not fully vaccinated, and teaching them how to walk on a
                leash without distraction.
              </p>
              <div className="mb-6 flex items-start">
                <FaMoneyBill className="mr-2 text-[22px] text-[#F7CE72] sm:text-[40px] lg:text-[30px]" />
                <h3 className="font-bold text-[#7759CC] sm:text-[26.5px] lg:text-[20px]">
                  $16 for 20 mins{" "}
                  <span className="font-normal text-[#7759CC] sm:text-[20px]">
                    ($8/each additional dog)
                  </span>
                </h3>
              </div>
              <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 text-white hover:bg-purple-600 sm:text-[35px] lg:rounded-full lg:text-[25px]">
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
                className="top-0 left-0 h-full min-h-[300px] w-full rounded-lg object-cover lg:absolute lg:rounded-l-lg lg:px-0 lg:rounded-r-none"
              />
            </div>

            <div className="mt-4 h-full flex-1 rounded-r-lg sm:py-8 lg:mt-0 lg:w-1/2 lg:bg-[#EBE8FC] lg:px-8">
              <p className="font-Monserrat font-normal text-gray-700 sm:text-[26.5px] lg:mb-4 lg:text-[24px] lg:font-medium">
                Puppy Walks are available for dogs under{" "}
                <span className="font-normal lg:font-bold">
                  6 months of age
                </span>
                . Puppy Walks are done individually, protecting young dogs who
                are not fully vaccinated, and teaching them how to walk on a
                leash without distraction.
              </p>
              <div className="mb-6 flex items-start">
                <FaMoneyBill className="mr-2 text-[22px] text-[#F7CE72] sm:text-[40px] lg:text-[30px]" />
                <h3 className="font-bold text-[#7759CC] sm:text-[26.5px] lg:text-[20px]">
                  $16 for 20 mins{" "}
                  <span className="font-normal text-[#7759CC] sm:text-[20px]">
                    ($8/each additional dog)
                  </span>
                </h3>
              </div>
              <button className="font-chewy w-full rounded-2xl bg-[#7759CC] px-4 py-2 text-white hover:bg-purple-600 sm:text-[35px] lg:rounded-full lg:text-[25px]">
                Schedule a walk →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogOn_op;
