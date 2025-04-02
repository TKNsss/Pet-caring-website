import React from "react";
import icon_dogwalking from "../../../assets/icon_dogwalking.png";
import icon_dogrunning from "../../../assets/icon_dogrunning.png";
import icon_dogboarding from "../../../assets/icon_dogboarding.png";
import icon_dogovernight from "../../../assets/icon_dogovernight.png";
import icon_doginhome from "../../../assets/icon_doginhome.png";
import icon_dogtaxi from "../../../assets/icon_dogtaxi.png";

const services = [
  {
    title: "Dog Walking",
    description:
      "Choose from a 30, 45, or 60-minute visit to give your pet their daily dose of fun-filled exercise.",
    icon: icon_dogwalking,
  },
  {
    title: "Dog Running",
    description:
      "It is for big dogs that need more exercise. Choose from a 25, 35 minute to give your pet daily dose.",
    icon: icon_dogrunning, // ô này mặc định màu tím
  },
  {
    title: "Dog Boarding",
    description:
      "Give your dogs the best day ever with our caring service from grooming to walking and playing.",
    icon: icon_dogboarding,
  },
  {
    title: "Dog Overnight Care",
    description:
      "If you’re away for the night, you definitely can let your dog stays with us for all the best cares.",
    icon: icon_dogovernight,
  },
  {
    title: "Pet in-home visit",
    description:
      "Service for cats and dogs. While you’re away we provide your pet all food, water, exercise, and attention.",
    icon: icon_doginhome,
  },
  {
    title: "Pet Taxi",
    description:
      "Service for cats and dogs. Does your pet need a lift to the groomers, vet, or dog park? We’ve got their tails covered.",
    icon: icon_dogtaxi,
  },
];

const OurService = () => {
  return (
    <div className="px-12 py-18">
      {/* Tiêu đề */}
      <h3 className="text-center text-[30px] font-bold text-[#33363F]">
        Our <span className="text-[30px] text-[#6F32BE]">Services</span>
      </h3>

      {/* Grid 6 ô dịch vụ */}
      <div className="mt-10 w-full grid grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-3">
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
  );
};

export default OurService;
