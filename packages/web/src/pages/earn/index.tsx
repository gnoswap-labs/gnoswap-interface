import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { formatAddress } from "@utils/string-utils";
import { useWallet } from "@hooks/wallet/use-wallet";

import SEOHeader from "@components/common/seo-header/seo-header";
import EarnLayout from "@views/earn/EarnLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import EarnMyPositionContainer from "@views/earn/containers/earn-my-position-container/EarnMyPositionContainer";
import IncentivizedPoolsContainer from "@views/earn/containers/incentivized-pools-container/IncentivizedPoolsContainer";
import IncentivizedPoolCardListContainer from "@views/earn/containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@views/earn/containers/pool-list-container/PoolListContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn"])),
    },
  };
}

export default function Page() {
  const { account } = useWallet();
  const router = useCustomRouter();
  const addr = router.getAddress();
  const isOtherPosition = !!(addr && addr !== account?.address);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo[addr ? "/earn?address" : "/earn"], [addr]);

  return (
    <>
      <SEOHeader
        title={seoInfo.title([addr ? formatAddress(addr) : undefined].filter(item => item) as string[])}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <EarnLayout
        header={<HeaderContainer />}
        positions={<EarnMyPositionContainer isOtherPosition={isOtherPosition} address={(addr || "") as string} />}
        incentivizedPools={
          <IncentivizedPoolsContainer
            isOtherPosition={isOtherPosition}
            cardList={<IncentivizedPoolCardListContainer />}
          />
        }
        poolList={<PoolListContainer />}
        footer={<Footer />}
      />
    </>
  );
}
