import React from "react";
import { FaPaw } from "react-icons/fa";
import RequestServiceBtn from "./RequestServiceBtn";

const Header = ({ id, title, subTitle, headerImg, bgColor }) => {
  return (
    <div className={`${bgColor} relative`}>
      <img
        src={headerImg}
        alt="headerImage"
        className="ml-auto block w-full [clip-path:circle(75%_at_50%_0%)] sm:[clip-path:circle(68%_at_50%_0%)] lg:hidden"
      />
      <svg
        className="absolute bottom-0 left-0 z-1 w-full"
        viewBox="0 0 1536 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13,100 C512,20 1152,140 1536,80 L1536,100 L0,100 Z"
          fill="white"
        />
      </svg>

      <div className="flex">
        <div className="web-container @container">
          <div className="m-0 flex flex-col px-[2.25rem] lg:flex-row">
            <div
              className={`lg:w-3/5 ${["Whpc", "RequestService"].includes(id) ? "ml-auto" : ""}`}
            >
              <div
                className={`@5xl:mt-[82px] ${["Whpc", "RequestService"].includes(id) ? "@5xl:ml-8" : ""}`}
              >
                <h1
                  className={`mt-4 text-4xl ${["Whpc", "RequestService"].includes(id) ? "text-fourth" : "text-[#F1F1F1]"} @3xl:text-[55px] @5xl:mt-0`}
                  dangerouslySetInnerHTML={{ __html: title }}
                  data-testid={`header-title-${id}`}
                />
                <p
                  className={`font-Poppins ${id === "RequestService" ? "mt-12 lg:mt-15" : "mt-4 lg:mt-[30px] xl:mt-[30px]"} max-w-[715px] text-xl leading-[30px] ${["Whpc", "RequestService"].includes(id) ? "text-third" : "text-[#F1F1F1]"} lg:w-[46vw] lg:text-[23px]`}
                  dangerouslySetInnerHTML={{ __html: subTitle }}
                />
                <div
                  className="mt-[8%] mb-[12%]"
                  data-testid="request-service-btn-container"
                >
                  {id === "RequestService" ? (
                    <div className="px-6 opacity-0">nothing here</div>
                  ) : (
                    <RequestServiceBtn
                      icon={FaPaw}
                      bgColor={`${id === "Whpc" ? "bg-third" : "bg-secondary"}`}
                      iconColor={`${id === "Whpc" ? "text-mdYellow" : "text-white"}`}
                      txtColor={"text-white"}
                      paddingX={"px-6"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <img
          src={headerImg}
          alt="pet-pic"
          className={`absolute top-0 ${["Whpc", "RequestService"].includes(id) ? "left-0 rounded-tr-[199px] rounded-br-[279px]" : "right-0 rounded-tl-[199px] rounded-bl-[279px]"} hidden h-full w-[40%] object-cover object-right lg:block`}
        />
      </div>
    </div>
  );
};

export default Header;
