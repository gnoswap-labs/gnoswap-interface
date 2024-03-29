import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import PoolListContainer from "@containers/pool-list-container/PoolListContainer";
import EarnLayout from "@layouts/earn-layout/EarnLayout";
import EarnIncentivizedPools from "@components/earn/earn-incentivized-pools/EarnIncentivizedPools";
import EarnMyPositionContainer from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWallet } from "@hooks/wallet/use-wallet";
import useUrlParam from "@hooks/common/use-url-param";
import { addressValidationCheck } from "@utils/validation-utils";

export default function Earn() {
  const { account } = useWallet();
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({ addr: account?.address });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  return (
    <EarnLayout
      header={<HeaderContainer />}
      positions={<EarnMyPositionContainer address={address} />}
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
