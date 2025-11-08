import React from "react";
import Header from "../../shares/Header.jsx";
import OurService from "./HomeElements/OurService";
import Achieve from "./HomeElements/Achievement.jsx";
import Reviews from "../../shares/Reviews.jsx";
import Gallery from "../../shares/Gallery.jsx";
import Footer from "../../shares/Footer.jsx";
import { useTranslation } from "react-i18next";

import { pictureMain2, footerHome, footerHome2 } from "../../constants";

const Home = () => {
  const petImgs = [footerHome, footerHome2];
  const { t } = useTranslation();

  return (
    <>
      <Header
        id={"Home"}
        title={t("home.hero.title")}
        subTitle={t("home.hero.subtitle")}
        headerImg={pictureMain2}
        bgColor={"bg-primary"}
      />
      <OurService />
      <Achieve />
      <Reviews />
      <Gallery bgColor={"bg-lightYellow"} />
      <Footer title={t("home.footer.title")} petImgs={petImgs} />
    </>
  );
};

export default Home;
