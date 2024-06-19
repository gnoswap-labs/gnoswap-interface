import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";
import SEOHeader from "@components/common/seo-header/seo-header";
import { formatAddress } from "@utils/string-utils";



export default function Earn() {
  const { account } = useWallet();
  const router = useRouter();
  const addr = router?.query?.addr as string;
  const isOtherPosition = !!(addr && addr !== account?.address);

  const title = useMemo(() => {
    if (addr) {
      return `${formatAddress(addr)}'s Positions | Gnoswap`;
    }

    return "Earn | Gnoswap";
  }, [addr]);

  const description = useMemo(() => {
    if (addr) {
      return "Create your own positions and provide liquidity to earn trading fees.";
    }

    return "The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders.";
  }, [addr]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={description}
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
