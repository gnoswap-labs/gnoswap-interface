import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import GovernanceLayout from "@layouts/governance-layout/GovernanceLayout";
import GovernanceContainer from "@containers/governance-container/GovernanceContainer";
import ProposalListContainer from "@containers/proposal-list-container/ProposalListContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "Main"]))
    }
  };
}
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
