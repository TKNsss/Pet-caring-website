import React from "react";
import { services } from "../../../constants";
import { useTranslation } from "react-i18next";

const OurService = () => {
  const { t } = useTranslation();
  const localizedHeading = t("home.services.heading");

  return (
    <div className="web-container @container">
      <div className="px-[2.25rem] py-18">
        <h3
          className="text-center text-[30px] font-bold text-[#33363F]"
          dangerouslySetInnerHTML={{ __html: localizedHeading }}
        />

        <div className="mt-10 grid w-full grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-xl border border-[#7759CC] p-6 text-center shadow-sm transition-all duration-300 hover:bg-[#6F32BE]"
            >
              <div className="mb-[20px] inline-block rounded-full bg-[#EBE8FC] group-hover:bg-[#F7CE72]">
                <img
                  src={service.icon}
                  className="inline-block w-[78px] text-4xl text-[#7759cc] group-hover:text-[#F7CE72]"
                  alt=""
                />
              </div>

              <h3 className="mb-[20px] text-[22px] font-semibold text-[#7759cc] group-hover:text-[#F1F1F1]">
                {service.titleKey ? t(service.titleKey) : service.title}
              </h3>

              <p className="font-Lato mt-2 leading-relaxed font-normal group-hover:text-[#F1F1F1] lg:text-[19px] xl:text-[22px]">
                {service.descriptionKey
                  ? t(service.descriptionKey)
                  : service.description}
              </p>

              <button className="font-chewy mt-4 inline-block text-[18px] text-[#6F32BE] transition group-hover:text-[#F7CE72]">
                {t("home.services.learnMore")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurService;
