
import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/use-wallet";

import EarnIncentivizedPools from "./components/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "./containers/earn-my-position-container/EarnMyPositionContainer";
import IncentivizedPoolCardListContainer from "./containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "./containers/pool-list-container/PoolListContainer";
import EarnLayout from "./EarnLayout";

const Earn: React.FC = () => {
  const { account } = useWallet();
  const router = useCustomRouter();
  const addr = router.getAddress();
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
};

export default Earn;
