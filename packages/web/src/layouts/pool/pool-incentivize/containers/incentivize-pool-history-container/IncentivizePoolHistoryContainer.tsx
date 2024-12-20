import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetPoolStakingListByAddress } from "@query/pools/use-get-pool-staking-list-by-address";
import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";

import IncentivizePoolHistory from "../../components/incentivize-pool-history/IncentivizePoolHistory";

const IncentivizePoolHistoryContainer = () => {
  const { account } = useWallet();

  const { data: rawPoolStakingList = [], isFetched: isFetchedStakingList } = useGetPoolStakingListByAddress(
    account?.address || "",
    {
      enabled: !!account?.address,
    },
  );

  const poolStakingList: ExtendedPoolStakingModel[] = rawPoolStakingList
    .map(item => ({
      ...item,
      depositGnsAmount: (item as ExtendedPoolStakingModel).depositGnsAmount,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.startTimestamp);
      const dateB = new Date(b.startTimestamp);

      return dateA.getTime() - dateB.getTime();
    });

  return isFetchedStakingList && poolStakingList.length > 0 ? (
    <IncentivizePoolHistory stakingList={poolStakingList} />
  ) : null;
};

export default IncentivizePoolHistoryContainer;
