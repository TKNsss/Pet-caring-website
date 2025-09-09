import React from "react";
import Header from "../../shares/Header.jsx";
import PetService from "../GalleryPage/GalleryElements/PetService";
import Footer from "../../shares/Footer.jsx";
import {
  galleryHeaderImg,
  dogFooterGallery,
  catFooterGallery,
} from "../../constants";

const GalleryPage = () => {
  const petImgs = [dogFooterGallery, catFooterGallery];

  return (
    <>
      <Header
        id={"Gallery"}
        title={"OUR HAPPY MOMENTS"}
        subTitle={"We bring joys and loves to your besties"}
        bgColor={"bg-primary"}
        headerImg={galleryHeaderImg}
      />
      <PetService />
      <Footer id="Gallery" title={"Bring Happiness to your pet"} petImgs={petImgs} />
    </>
  );
};

export default GalleryPage;
