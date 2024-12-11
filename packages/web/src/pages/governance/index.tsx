import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import GovernanceLayout from "@layouts/governance/GovernanceLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import GovernanceSummaryContainer from "@layouts/governance/containers/governance-summary-container/GovernanceSummaryContainer";
import MyDelegationContainer from "@layouts/governance/containers/my-delegation-container/MyDelegationContainer";
import ProposalListContainer from "@layouts/governance/containers/proposal-list-container/ProposalListContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Governance", "Wallet", ...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = SEOInfo["/governance"];

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <GovernanceLayout
        header={<HeaderContainer />}
        summary={<GovernanceSummaryContainer />}
        myDelegation={<MyDelegationContainer />}
        list={<ProposalListContainer />}
        footer={<Footer />}
      />
    </>
  );
}
