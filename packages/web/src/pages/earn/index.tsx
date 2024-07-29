import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWallet } from "@hooks/wallet/use-wallet";
import useCustomRouter from "@hooks/common/use-custom-router";
import SEOHeader from "@components/common/seo-header/seo-header";
import { formatAddress } from "@utils/string-utils";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn"])),
    },
  };
}

export default function Earn() {
  const { account } = useWallet();
  const router = useCustomRouter();
  const addr = router.getAddress();
  const isOtherPosition = !!(addr && addr !== account?.address);

  const seoInfo = useMemo(
    () => SEOInfo[addr ? "/earn?address" : "/earn"],
    [addr],
  );

  return (
    <>
      <SEOHeader
        title={seoInfo.title(
          [addr ? formatAddress(addr) : undefined].filter(
            item => item,
          ) as string[],
        )}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <EarnLayout
        header={<HeaderContainer />}
        positions={
          <EarnMyPositionContainer
            isOtherPosition={isOtherPosition}
            address={(addr || "") as string}
          />
        }
        incentivizedPools={
          <EarnIncentivizedPools
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
