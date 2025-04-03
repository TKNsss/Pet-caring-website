import React from "react";
import Header from "../Os_dogwalk/elements/Header";
import Dogrunning_op from "./elements/Dogrunning_op";
import Quality from "../Os_dogwalk/elements/quality";
import UpdatesSection from "../Os_dogwalk/elements/UpdatesSection";
import Reviews from "../Os_dogwalk/elements/Reviews";
import Footer from "../Os_dogwalk/elements/Footer";

const OsDogrun = () => {
  return (
    <div>
      <Header />
      <Dogrunning_op />
      <Quality />
      <UpdatesSection />
      <Reviews />
      <Footer />
    </div>
  );
};

export default OsDogrun;
