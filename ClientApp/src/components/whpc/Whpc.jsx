import React from "react";
import Header from "../../shares/Header";
import Introduction from "./WhpcElements/introduction";
import Introduction2 from "./WhpcElements/introduction2";
import Quality from "./WhpcElements/quality";
import Reviews from "../../shares/Reviews";
import Gallery from "../../shares/Gallery";
import Footer from "../../shares/Footer";
import { whpcHeaderImg } from "../../constants";
import { footerWhpcLeft, footerWhpcRight } from "../../constants";

const Whpc = () => {
  const petImgs = [footerWhpcLeft, footerWhpcRight];

  return (
    <>
      <Header
        id={"Whpc"}
        title={"FLEXIBLE AND RELIABLE CARE FOR YOUR PET"}
        subTitle={"Experienced, Animal-loving Pet Sitters"}
        headerImg={whpcHeaderImg}
        bgColor={"bg-bgYellow"}
      />
      <Introduction />
      <Quality />
      <Introduction2 />
      <Reviews bgColor={"bg-lightYellow"} />
      <Gallery />
      <Footer title={"Ready to use our services?"} petImgs={petImgs} />
    </>
  );
};

export default Whpc;
