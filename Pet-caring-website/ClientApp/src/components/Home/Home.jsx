import React from "react";
import HomeHeader from "./HomeElements/HomeHeader";
import OurService from "./HomeElements/OurService";
import Achieve from "./HomeElements/achieve.jsx";
import Reviews from "./HomeElements/Reviews.jsx";
import Gallery from "./HomeElements/Gallery.jsx";
import Footer from "./HomeElements/Footer.jsx";

const Home = () => {
  return (
    <div className="">
      <HomeHeader />
      <OurService />
      <Achieve />
      <Reviews />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Home;
