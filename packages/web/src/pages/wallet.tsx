import WalletLayout from "@layouts/wallet-layout/WalletLayout";
import AssetListContainer from "@containers/asset-list-container/AssetListContainer";
import WalletBalanceContainer from "@containers/wallet-balance-container/WalletBalanceContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import WalletMyPositions from "@components/wallet/wallet-my-positions/WalletMyPositions";
import WalletMyPositionsHeader from "@components/wallet/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { useMemo } from "react";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "common"])),
    },
  };
}

export default function Wallet() {
  const seoInfo = useMemo(() => SEOInfo["/wallet"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <WalletLayout
        header={<HeaderContainer />}
        balance={<WalletBalanceContainer />}
        assets={<AssetListContainer />}
        positions={
          <WalletMyPositions
            header={<WalletMyPositionsHeader />}
            cardList={<WalletPositionCardListContainer />}
          />
        }
        footer={<Footer />}
      />
    </>
  );
}
