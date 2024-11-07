import React from "react";

import TermsLayout from "./TermsLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

const Terms = () => {
  return <TermsLayout header={<HeaderContainer />} footer={<Footer />} />;
};

export default Terms;
