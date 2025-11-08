import React from "react";
import Header from "../../shares/Header.jsx";
import PetService from "../GalleryPage/GalleryElements/PetService";
import Footer from "../../shares/Footer.jsx";
import {
  galleryHeaderImg,
  dogFooterGallery,
  catFooterGallery,
} from "../../constants";
import { useTranslation } from "react-i18next";

const GalleryPage = () => {
  const petImgs = [dogFooterGallery, catFooterGallery];
  const { t } = useTranslation();

  return (
    <>
      <Header
        id={"Gallery"}
        title={t("gallery.page.heroTitle")}
        subTitle={t("gallery.page.heroSubtitle")}
        bgColor={"bg-primary"}
        headerImg={galleryHeaderImg}
      />
      <PetService />
      <Footer
        id="Gallery"
        title={t("gallery.page.footerTitle")}
        petImgs={petImgs}
      />
    </>
  );
};

export default GalleryPage;
