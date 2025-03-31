import React from "react";
import Intro from "../../../assets/whpc_intro.jpg";

const introduction = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-10 py-8">
      {/* Dùng grid để chia 2 cột khi md trở lên, còn màn nhỏ thì 1 cột */}
      <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* Cột 1: Hình ảnh */}
        <div>
          <img
            src={Intro} // Thay link ảnh thực tế
            alt="Pet Care"
            className="h-[500px] w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Cột 2: Nội dung */}
        <div className="mt-[10px]">
          <h3 className="mb-6 text-3xl font-bold md:text-4xl">
            We Are Providing Pet Care Service For{" "}
            <span className="text-3xl font-bold text-[#6F32BE] md:text-4xl">
              Years
            </span>
          </h3>
          <p className="mb-6 text-[21px] text-gray-600">
            "At Happy Pet Care, our goal is to make caring for a pet that much
            easier, by providing a flexible and reliable service, so pet owners
            can go about their business, and not have to worry about their pet
            waiting for them at home."
          </p>
          <p className="font-bold">
            Founder, Happy Pet Care <br /> Mary M
          </p>
        </div>
      </div>
    </section>
  );
};

export default introduction;
