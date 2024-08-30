import React, { useMemo } from "react";

import { usePoolData } from "@hooks/pool/use-pool-data";

import EarnIncentivizedPools from "../..//components/earn-incentivized-pools/EarnIncentivizedPools";

interface IncentivizedPoolsContainerProps {
  cardList: React.ReactNode;
  isOtherPosition: boolean;
}

const IncentivizedPoolsContainer: React.FC<IncentivizedPoolsContainerProps> = ({
  cardList,
  isOtherPosition,
}) => {
  const { pools } = usePoolData();

  const highestAprInfo: { apr: number; path: string } = useMemo(() => {
    let apr = 0;
    let path = "";
    pools.forEach(current => {
      if (Number(current.totalApr) > apr) {
        apr = Number(current.totalApr);
        path = current.poolPath;
      }
    });
    return { apr, path };
  }, [pools]);

  return (
    <EarnIncentivizedPools
      isOtherPosition={isOtherPosition}
      cardList={cardList}
      highestAprInfo={highestAprInfo}
    />
  );
};

export default IncentivizedPoolsContainer;
