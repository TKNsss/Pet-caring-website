import React from "react";
import Header from "./WhpcElements/header";
import Introduction from "./WhpcElements/introduction";
import Introduction2 from "./WhpcElements/introduction2";
import Quality from "./WhpcElements/quality";
import Reviews from "./WhpcElements/reviews";
import Gallery from "./WhpcElements/gallery";
import Footer from "./WhpcElements/footer";
import { header } from "framer-motion/client";

const Whpc = () => {
  return (
    <>
      <Header />;
      <Introduction />
      <Quality />
      <Introduction2 />
      <Reviews />
      <Gallery />
      <Footer />
    </>
  );
};

export default Whpc;
