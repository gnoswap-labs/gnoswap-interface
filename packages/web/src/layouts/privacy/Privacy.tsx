import React from "react";

import PrivacyLayout from "./PrivacyLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

const Privacy = () => {
  return <PrivacyLayout header={<HeaderContainer />} footer={<Footer />} />;
};

export default Privacy;
