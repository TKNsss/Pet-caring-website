import React from "react";
import { FaPaw } from "react-icons/fa";
import RequestServiceBtn from "../../shares/RequestServiceBtn";
import HomeHeader from "./HomeElements/HomeHeader";
import OurService from "./HomeElements/OurService";
import Achieve from "./HomeElements/achieve.jsx";
import Reviews from "./HomeElements/Reviews.jsx";
import Gallery from "./HomeElements/Gallery.jsx";
import Footer from "./HomeElements/Footer.jsx";

const Home = () => {
  return (
    <>
      <HomeHeader />
      <OurService />
      <Achieve />
      <Reviews />
      <Gallery />
      <Footer />
    </>
  );
};

export default Home;
