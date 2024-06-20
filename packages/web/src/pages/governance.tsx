import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import GovernanceLayout from "@layouts/governance-layout/GovernanceLayout";
import GovernanceContainer from "@containers/governance-container/GovernanceContainer";
import ProposalListContainer from "@containers/proposal-list-container/ProposalListContainer";
import SEOHeader from "@components/common/seo-header/seo-header";

export default function Dashboard() {
  return (
    <>
      <SEOHeader
        title={"Governance | Gnoswap"}
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
        ogDescription="Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity."
      />
      <GovernanceLayout
        header={<HeaderContainer />}
        summary={<GovernanceContainer />}
        list={<ProposalListContainer />}
        footer={<Footer />}
      />
    </>
  );
}
