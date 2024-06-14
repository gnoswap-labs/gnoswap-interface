import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";



export default function Earn() {
  const { account } = useWallet();
  const router = useRouter();
  const addr = router?.query?.addr;
  const isOtherPosition = !!(addr && addr !== account?.address);

  return (
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
  );
}
