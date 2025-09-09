import React from "react";
import Header from "../../shares/Header";
import RequestForm from "./element/RequestForm";
import Footer from "../../shares/Footer";
import { reqServiceHeader } from "../../constants";

const RequestServices = () => {
  return (
    <div>
      <Header
        id={"RequestService"}
        title={"Ready to make your appointment with expert?"}
        subTitle={"Fill the form below"}
        headerImg={reqServiceHeader}
        bgColor={"bg-bgYellow"}
      />
      <RequestForm />
      <Footer id="RequestService" />
    </div>
  );
};

export default RequestServices;
