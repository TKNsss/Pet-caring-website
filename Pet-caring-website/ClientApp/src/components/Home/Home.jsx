import React from "react";
import Header from "../../shares/Header.jsx";
import OurService from "./HomeElements/OurService";
import Achieve from "./HomeElements/Achievement.jsx";
import Reviews from "../../shares/Reviews.jsx";
import Gallery from "../../shares/Gallery.jsx";
import Footer from "../../shares/Footer.jsx";

import { pictureMain2 } from "../../constants";
import { footerHome, footerHome2 } from "../../constants";

const Home = () => {
  const petImgs = [footerHome, footerHome2];

  return (
    <>
      <Header
        id={"Home"}
        title={
          'ONLY THE <span class="text-darkYellow">BEST</span> FOR YOUR BESTIES'
        }
        subTitle={
          'Provide pet care expertise in <span class="text-darkYellow">Allston, Brighton, Brookline, Chestnut Hill, Fenway, Kenmore, Newton Corner, MA</span>'
        }
        headerImg={pictureMain2}
        bgColor={"bg-primary"}
      />
      <OurService />
      <Achieve />
      <Reviews />
      <Gallery bgColor={"bg-lightYellow"} />
      <Footer title={"Bring Happiness to your pet"} petImgs={petImgs} />
    </>
  );
};

export default Home;
