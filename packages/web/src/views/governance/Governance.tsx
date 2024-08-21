import React from "react";

import Footer from "@components/common/footer/Footer";
import GovernanceContainer from "@containers/governance-container/GovernanceContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import ProposalListContainer from "@containers/proposal-list-container/ProposalListContainer";

import GovernanceLayout from "./GovernanceLayout";

const Governance: React.FC = () => {
  return (
    <GovernanceLayout
      header={<HeaderContainer />}
      summary={<GovernanceContainer />}
      list={<ProposalListContainer />}
      footer={<Footer />}
    />
  );
};

export default Governance;