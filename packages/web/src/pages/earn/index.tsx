import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWallet } from "@hooks/wallet/use-wallet";
import useUrlParam from "@hooks/common/use-url-param";

export default function Earn() {
  const { account } = useWallet();
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({ addr: account?.address });

  return (
    <EarnLayout
      header={<HeaderContainer />}
      positions={<EarnMyPositionContainer address={initializedData?.addr} />}
      incentivizedPools={
        <EarnIncentivizedPools
          address={initializedData?.addr}
          cardList={<IncentivizedPoolCardListContainer />}
        />
      }
      poolList={<PoolListContainer />}
      footer={<Footer />}
    />
  );
}
