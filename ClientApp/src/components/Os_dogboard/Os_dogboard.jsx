import React from "react";
import Header from "../Os_dogwalk/elements/Header";
import Dogboarding_op from "./elements/Dogboarding_op";
import Quality from "../Os_dogwalk/elements/quality";
import UpdatesSection from "../Os_dogwalk/elements/UpdatesSection";
import Reviews from "../Os_dogwalk/elements/Reviews";
import Footer from "../Os_dogwalk/elements/Footer";

const OsDogrun = () => {
  return (
    <div>
      <Header />
      <Dogboarding_op />
      <Quality />
      <UpdatesSection />
      <Reviews />
      <Footer />
    </div>
  );
};

export default OsDogrun;
