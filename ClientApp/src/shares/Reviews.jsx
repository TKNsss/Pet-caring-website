import { yelp } from "../assets";
import { reviews } from "../constants";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const Reviews = ({ bgColor }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <div className={bgColor}>
      <div className="web-container @container">
        <div className="px-[2.25rem] py-15">
          <div className="hidden md:block">
            <div className="mb-[50px] flex items-end">
              <h3
                className="ml-10 text-left text-[30px] font-bold"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(t("home.reviews.desktopHeading")),
                }}
              />
              <img src={yelp} className="h-[61px] w-[152px]" alt="Yelp" />
            </div>

            <div className="relative mt-8 flex snap-x snap-mandatory space-x-8 overflow-x-auto">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`w-110 flex-shrink-0 rounded-lg bg-white p-5 shadow-lg ${
                    index % 2 === 0 ? "mt-15" : "mb-15"
                  }`}
                >
                  <div className="mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="h-[400px] w-[400px] rounded-2xl object-cover"
                    />
                  </div>
                  <div className="mb-[10px] flex">
                    <img
                      src={review.ava}
                      alt={review.name}
                      className="mr-[20px] h-[50px] w-[50px] rounded-full border-2 border-[#AFB1B6] object-cover object-top"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{review.name}</h3>
                      <div className="mb-2 flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            className={`h-5 w-5 ${
                              starIndex < Math.floor(review.rating)
                                ? "text-[#F5B972]"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049.927c.3-.921 1.603-.921 1.902 0l1.569 4.843a1 1 0 00.95.69h5.096c.969 0 1.37 1.24.588 1.81l-4.122 2.997a1 1 0 00-.364 1.118l1.57 4.842c.3.92-.755 1.688-1.54 1.118L10 14.347l-4.12 2.999c-.784.57-1.84-.197-1.54-1.118l1.569-4.842a1 1 0 00-.364-1.118L1.422 8.27c-.782-.57-.38-1.81.588-1.81h5.096a1 1 0 00.95-.69L9.049.927z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-Monserrat text-[20px] text-gray-700">
                    {review.reviewKey ? t(review.reviewKey) : review.review}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="font-chewy rounded-full border-2 border-[#7759CC] px-20 py-2 text-[25px] text-[#7759CC] hover:bg-[#7759CC] hover:text-white">
                {t("home.reviews.button")}
              </button>
            </div>
          </div>

          <div className="mx-auto flex flex-col items-center rounded-xl bg-white p-6 md:hidden">
            <div className="flex items-end gap-2">
              <h3 className="text-lg font-bold">
                {t("home.reviews.mobileTitle")}
              </h3>
              <img src={yelp} className="h-8" alt="Yelp" />
            </div>

            <h1 className="font-Inter text-[50px] leading-none font-bold text-[#7759CC]">
              {reviews[activeIndex].rating}
            </h1>

            <h2 className="flex text-2xl font-bold text-[#6F32BE]">
              {[...Array(5)].map((_, starIndex) => (
                <svg
                  key={starIndex}
                  className={`h-5 w-5 ${
                    starIndex < Math.floor(reviews[activeIndex].rating)
                      ? "text-[#F7CE72]"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049.927c.3-.921 1.603-.921 1.902 0l1.569 4.843a1 1 0 00.95.69h5.096c.969 0 1.37 1.24.588 1.81l-4.122 2.997a1 1 0 00-.364 1.118l1.57 4.842c.3.92-.755 1.688-1.54 1.118L10 14.347l-4.12 2.999c-.784.57-1.84-.197-1.54-1.118l1.569-4.842a1 1 0 00-.364-1.118L1.422 8.27c-.782-.57-.38-1.81.588-1.81h5.096a1 1 0 00.95-.69L9.049.927z" />
                </svg>
              ))}
            </h2>

            <h3 className="mt-3 text-lg font-bold">
              {reviews[activeIndex].name}
            </h3>
            <p className="mt-1 text-center text-gray-600">
              {reviews[activeIndex].reviewKey
                ? t(reviews[activeIndex].reviewKey)
                : reviews[activeIndex].review}
            </p>

            <div className="mt-4 flex gap-2">
              {reviews.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  className={`h-3 w-3 rounded-full transition-all ${
                    activeIndex === dotIndex ? "bg-[#6F32BE]" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(dotIndex)}
                />
              ))}
            </div>

            <button className="font-chewy mt-4 rounded-full border-2 border-[#6F32BE] px-6 py-2 text-lg text-[#6F32BE] transition hover:bg-[#6F32BE] hover:text-white">
              {t("home.reviews.mobileButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
