import React, { useState } from "react";
import yelp from "../../../assets/yelp.png";
import KhalJonas from "../../../assets/KhalJonas.jpg";
import ThomasZarki from "../../../assets/ThomasZarki.jpg";
import ElizabethWan from "../../../assets/ElizabethWan.jpg";
import MichaelDoe from "../../../assets/MichaelDoe.jpg";
import ava_KhalJonas from "../../../assets/ava_KhalJonas.jpg";
import ava_ThomasZarki from "../../../assets/ava_ThomasZarki.jpg";
import ava_ElizabethWan from "../../../assets/ava_ElizabethWan.jpg";
import ava_MichaelDoe from "../../../assets/ava_MichaelDoe.jpg";

const reviews = [
  {
    id: 1,
    name: "Khal Jonas",
    image: KhalJonas,
    ava: ava_ThomasZarki,
    rating: 5,
    review:
      "So happy I found this place! They are all absolutely wonderful and genuinely care about your pets. Also prices are very reasonable for all the work they do (like watering plants). Can't thank you all enough!",
  },
  {
    id: 2,
    name: "Thomas Zarki",
    image: ThomasZarki,
    ava: ava_KhalJonas,
    rating: 4.5,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 3,
    name: "Elizabeth Wan",
    image: ElizabethWan,
    ava: ava_ElizabethWan,
    rating: 5,
    review:
      "My dog loves walking with their friendly staff.The owner Mary is very responsive and reliable, overall I have a good experience with their service.",
  },
  {
    id: 4,
    name: "Michael Doe",
    image: MichaelDoe,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 5,
    name: "Michael Doe",
    image: MichaelDoe,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
  {
    id: 6,
    name: "Michael Doe",
    image: ElizabethWan,
    ava: ava_MichaelDoe,
    rating: 4.8,
    review:
      "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat! I have been using Happy Pet Care for over a year and a half and I can not recommend them highly enough.",
  },
];

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="py-15 pl-10 bg-[#FDF3DC]">
      <div className="hidden md:block">
        <div className="mb-[50px] flex items-end">
          <h3 className="ml-10 text-left text-[30px] font-bold">
            We’ve Earned{" "}
            <span className="text-[30px] text-[#6F32BE]">4.9 rating</span>{" "}
            on{" "}
          </h3>
          <img src={yelp} className="h-[61px] w-[152px]" alt="" />
        </div>

        {/* Review Container */}
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
                  {/* Star Rating */}
                  <div className="mb-2 flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(review.rating)
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
                {review.review}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-8 text-center">
          <button className="font-chewy rounded-full border-2 border-[#7759CC] px-20 py-2 text-[25px] text-[#7759CC] hover:bg-[#7759CC] hover:text-white">
            See Reviews →
          </button>
        </div>
      </div>

      {/* mobile */}
      <div className="mx-auto flex flex-col items-center rounded-xl bg-white p-6 md:hidden">
        {/* Title */}
        <div className="flex items-end gap-2">
          <h3 className="text-lg font-bold">Review on</h3>
          <img src={yelp} className="h-8" alt="Yelp Logo" />
        </div>

        <h1 className="font-Inter text-[50px] leading-none font-bold text-[#7759CC]">
          {reviews[activeIndex].rating}
        </h1>
        {/* Rating */}
        <h2 className="flex text-2xl font-bold text-[#6F32BE]">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`h-5 w-5 ${
                index < Math.floor(reviews[activeIndex].rating)
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

        {/* Review */}
        <h3 className="mt-3 text-lg font-bold">{reviews[activeIndex].name}</h3>
        <p className="mt-1 text-center text-gray-600">
          {reviews[activeIndex].review}
        </p>

        {/* Dots */}
        <div className="mt-4 flex gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full transition-all ${
                activeIndex === index ? "bg-[#6F32BE]" : "bg-gray-300"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Button */}
        <button className="font-chewy mt-4 rounded-full border-2 border-[#6F32BE] px-6 py-2 text-lg  text-[#6F32BE] transition hover:bg-[#6F32BE] hover:text-white">
          See Reviews
        </button>
      </div>
    </div>
  );
};

export default Reviews;
