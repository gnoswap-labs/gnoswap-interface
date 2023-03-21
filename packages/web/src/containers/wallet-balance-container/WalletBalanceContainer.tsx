import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import WalletBalance from "@components/wallet/wallet-balance/WalletBalance";

export interface BalanceSummaryInfo {
  amount: number;
  changeRate: number;
}

export interface BalacneDetailInfo {
  availableBalance: number;
  stakedLP: number;
  unstakingLP: number;
  claimableRewards: number;
}

async function fetchBalanceSummaryInfo(
  address: string
): Promise<BalanceSummaryInfo> {
  console.debug("fetchBalanceSummaryInfo", address);
  return Promise.resolve({ amount: 1324.40, changeRate: 14.3 });
}

async function fetchBalanceDetailInfo(
  address: string
): Promise<BalacneDetailInfo> {
  console.debug("fetchBalanceDetailInfo", address);
  return Promise.resolve({
    availableBalance: 1,
    stakedLP: 1,
    unstakingLP: 1,
    claimableRewards: 1,
  });
}

const WalletBalanceContainer: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  const deposit = useCallback(() => {
    if (!connected) return;
    if (!address) return;
  }, [connected, address]);

  const withdraw = useCallback(() => {
    if (!connected) return;
    if (!address) return;
  }, [connected, address]);

  const earn = useCallback(() => {
  }, []);

  const {
    isLoading: isBalanceSummaryInfoLoading,
    error: balanceSummaryInfoError,
    data: balanceSummaryInfo,
  } = useQuery<BalanceSummaryInfo, Error>({
    queryKey: ["balacne", address],
    queryFn: () => fetchBalanceSummaryInfo(address),
  });

  const {
    isLoading: isBalanceDetailInfoLoading,
    error: balanceDetailInfoError,
    data: balanceDetailInfo,
  } = useQuery<BalacneDetailInfo, Error>({
    queryKey: ["balacne", address],
    queryFn: () => fetchBalanceDetailInfo(address),
  });

  return (
    <WalletBalance
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      balanceDetailInfo={balanceDetailInfo}
      deposit={deposit}
      withdraw={withdraw}
      earn={earn}
    />
  );
};

export default WalletBalanceContainer;
