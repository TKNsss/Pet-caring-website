import React from "react";
import { BsAwardFill } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import { BsFillPinAngleFill } from "react-icons/bs";
import { HiShieldCheck } from "react-icons/hi2";

const Quality = () => {
  return (
    <div className="bg-lavender relative">
      <div className="web-container @container">
        <section className="py-18">
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

          <div className="mx-auto max-w-screen-xl px-4">
            {/* Tiêu đề */}
            <h3 className="text-3xl font-bold md:text-4xl">
              Your Pet is <span className="text-[#6F32BE]">Safe</span> with us
            </h3>

            {/* Khối nội dung: 4 mục */}
            <div className="mt-10 grid grid-cols-1 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 text-txt-2">
              {/* Mục 1 */}
              <div className="mb-5 flex flex-col items-start text-left">
                <BsAwardFill size={60} color="#6F32BE" />
                <h3 className="mt-4 mb-2 text-2xl font-bold text-[#6F32BE] lg:mt-10">
                  Well-trained Staffs
                </h3>
                <p className="font-Monserrat mt-2 text-xl lg:mt-5">
                  Our staffs are fully trained in canine and feline first-aid &
                  CPR
                </p>
              </div>

              {/* Mục 2 */}
              <div className="mb-5 flex flex-col items-start text-left">
                <AiFillLike size={60} color="#6F32BE" />
                <h3 className="mt-4 mb-2 text-2xl font-bold text-[#6F32BE] lg:mt-10">
                  Squeaky-Toy Clean
                </h3>
                <p className="font-Monserrat mt-2 text-xl lg:mt-5">
                  We use only the safest cleaning products formulated
                  specifically for use around animals
                </p>
              </div>

              {/* Mục 3 */}
              <div className="mb-5 flex flex-col items-start text-left">
                <BsFillPinAngleFill size={60} color="#6F32BE" />
                <h3 className="mt-4 mb-2 text-2xl font-bold text-[#6F32BE] lg:mt-10">
                  Monitor your Pup
                </h3>
                <p className="font-Monserrat mt-2 text-xl lg:mt-5">
                  Access our live webcam on your phones and laptops
                </p>
              </div>

              {/* Mục 4 */}
              <div className="mb-5 flex flex-col items-start text-left">
                <HiShieldCheck size={60} color="#6F32BE" />
                <h3 className="mt-4 mb-2 text-2xl font-bold text-[#6F32BE] lg:mt-10">
                  Safe Environment
                </h3>
                <p className="font-Monserrat mt-2 text-xl lg:mt-5">
                  All boarding pets are healthy, spayed, neutered & vaccinated
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Quality;
