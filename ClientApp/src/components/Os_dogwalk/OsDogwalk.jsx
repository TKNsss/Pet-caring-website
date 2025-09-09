import React from "react";
import Header from "./elements/Header";
import Dogwalking_op from "./elements/Dogwalking_op";
import Quality from "./elements/quality";
import UpdatesSection from "./elements/UpdatesSection";
import Reviews from "./elements/Reviews";
import Footer from "./elements/Footer";

const OsDogwalk = () => {
  return (
    <div>
      <Header />
      <Dogwalking_op />
      <Quality />
      <UpdatesSection />
      <Reviews />
      <Footer />
    </div>
  );
};

export default OsDogwalk;
