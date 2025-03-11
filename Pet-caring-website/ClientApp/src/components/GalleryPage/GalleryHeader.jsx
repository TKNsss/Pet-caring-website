import React from 'react'
import pictureMain from "../../assets/gallery-main.png";
import pictureMain2 from "../../assets/gallery-main2.png";

const GalleryHeader = () => {
  return (
    <div style={{ backgroundColor: "#5A3BB3" }} className="relative flex flex-col lg:flex-row w-screen m-0">
      {/* <div className='absolute bottom-0 w-full border-b border-black p-4'></div> */}
      <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,100 C400,20 900,140 1200,80 L1200,100 L0,100 Z " fill="white"/>
      </svg>
      <img src={pictureMain2} alt="" className="block [clip-path:circle(75%_at_50%_0%)] h-[60vh] w-full ml-auto sm:h-[85vh] sm:[clip-path:circle(68%_at_50%_0%)] lg:hidden"/>
      <div className="text-center lg:w-2/5">
          <div className="lg:inline-block">
            <h1 style={{fontFamily: "chewy"}} className="text-center text-[40px] leading-[67.95px] sm:text-[50px] md:text-[60px] lg:pt-[72px] lg:text-left lg:text-[52px]">OUR HAPPY MOMENTS</h1>
            <p className="text-center text-[20px] mt-[2%] leading-[30px] pb-[30px] md:text-[30px] lg:text-left lg:mt-[30px]">We bring joys and loves to your besties</p>
            <button style={{fontFamily: "chewy"}} className='block text-center text-[23px] leading-[30.05px] w-[227px] h-[54px] bg-[#E4813A] text-white m-auto mb-[10%] rounded-[25px] shadow-[1px_4px_5px_rgba(0,0,0,0.3)]'>
              <i className='fa-solid fa-paw mr-[5px]'></i>
              Request Services
            </button>
          </div>
      </div>
      <img src={pictureMain} alt="" className="hidden lg:block h-[75vh] w-3/5 ml-auto"/>
    </div>
  )
}

export default GalleryHeader