import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import GovernanceLayout from "@layouts/governance-layout/GovernanceLayout";
import GovernanceContainer from "@containers/governance-container/GovernanceContainer";
import ProposalListContainer from "@containers/proposal-list-container/ProposalListContainer";

export default function Dashboard() {
  return (
    <GovernanceLayout
      header={<HeaderContainer />}
      summary={<GovernanceContainer />}
      list={<ProposalListContainer />}
      footer={<Footer />}
    />
  );
}
