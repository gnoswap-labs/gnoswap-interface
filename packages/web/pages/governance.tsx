import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import GovernanceLayout from "@layouts/governance-layout/GovernanceLayout";
import GovernanceContainer from "@containers/governance-container/GovernanceContainer";
import ProposalListContainer from "@containers/proposal-list-container/ProposalListContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Dashboard() {
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
        summary={<GovernanceContainer />}
        list={<ProposalListContainer />}
        footer={<Footer />}
      />
    </>
  );
}