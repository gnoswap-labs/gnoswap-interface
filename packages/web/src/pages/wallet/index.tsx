import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import WalletLayout from "@layouts/wallet/WalletLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import WalletBalanceContainer from "@layouts/wallet/containers/wallet-balance-container/WalletBalanceContainer";
import AssetListContainer from "@layouts/wallet/containers/asset-list-container/AssetListContainer";
import WalletMyPositions from "@layouts/wallet/components/wallet-my-positions/WalletMyPositions";
import WalletMyPositionsHeader from "@layouts/wallet/components/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletPositionCardListContainer from "@layouts/wallet/containers/wallet-position-card-list-container/WalletPositionCardListContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "Wallet"])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
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
          <WalletMyPositions header={<WalletMyPositionsHeader />} cardList={<WalletPositionCardListContainer />} />
        }
        footer={<Footer />}
      />
    </>
  );
}
