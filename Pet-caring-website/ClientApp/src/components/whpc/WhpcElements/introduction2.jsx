import React from "react";
import Intro from "../../../assets/whpc_intro2.jpg";
import { FaCircleCheck } from "react-icons/fa6";

const introduction2 = () => {
  return (
    <section className="px-10 py-12">
      <div className="grid grid-cols-1 items-center gap-15 md:grid-cols-2">
        {/* Cột 1: Nội dung văn bản */}
        <div>
          <h3 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            Your House is <span className="text-[#6F32BE]">Protected</span>
          </h3>
          <p className="mb-8 text-[18px] text-gray-700">
            We know that after the health, safety, and happiness of your pet,
            the security of your home is a big priority. Here is how we ensure
            your home's security while you're away:
          </p>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li className="flex items-start text-[18px] mb-5">
                <FaCircleCheck color="#F7CE72" className="mt-2 mr-1" />
              The only people who have access to your key or access code are
              your location's main office and your sitter
            </li>
            <li className="flex items-start text-[18px] mb-5">
                <FaCircleCheck color="#F7CE72" className="mt-2 mr-1" />
              We track all key movements, meaning if your sitter needs a key
              they are required to put a request in our system app tracking
            </li>
            <li className="flex items-start text-[18px] mb-5">
                <FaCircleCheck color="#F7CE72" className="mt-2 mr-1" />
              If your home has an access code, it will only be available to your
              sitter during scheduled service hours
            </li>
          </ul>
        </div>

        {/* Cột 2: Hình ảnh */}
        <div>
          <img
            src={Intro} // Thay link ảnh thực tế
            alt="House Security"
            className="h-[500px] w-full rounded-lg object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default introduction2;
