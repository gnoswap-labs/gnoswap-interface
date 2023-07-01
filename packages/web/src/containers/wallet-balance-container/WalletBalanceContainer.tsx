// TODO : remove eslint-disable after work
/* eslint-disable */
import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WalletBalance from "@components/wallet/wallet-balance/WalletBalance";

export interface BalanceSummaryInfo {
  amount: string;
  changeRate: string;
}

export interface BalanceDetailInfo {
  availableBalance: string;
  stakedLP: string;
  unstakingLP: string;
  claimableRewards: string;
}

const initialBalanceSummaryInfo: BalanceSummaryInfo = {
  amount: "$0.00",
  changeRate: "+0.0%"
};

async function fetchBalanceSummaryInfo(
  address: string
): Promise<BalanceSummaryInfo> {
  console.debug("fetchBalanceSummaryInfo", address);
  return Promise.resolve({ amount: "1324.40", changeRate: "+14.3%" });
}

const initialBalanceDetailInfo: BalanceDetailInfo = {
  availableBalance: "$0.00",
  stakedLP: "$0.00",
  unstakingLP: "$0.00",
  claimableRewards: "$0.00",
};

async function fetchBalanceDetailInfo(
  address: string
): Promise<BalanceDetailInfo> {
  console.debug("fetchBalanceDetailInfo", address);
  return Promise.resolve({
    availableBalance: "$1.1",
    stakedLP: "$1.2",
    unstakingLP: "$1.3",
    claimableRewards: "$1.4",
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
    queryKey: ["balanceSummaryInfo", connected, address],
    queryFn: () => {
      if (!connected) return initialBalanceSummaryInfo;
      return fetchBalanceSummaryInfo(address);
    },
    initialData: initialBalanceSummaryInfo
  });

  const {
    isLoading: isBalanceDetailInfoLoading,
    error: balanceDetailInfoError,
    data: balanceDetailInfo,
  } = useQuery<BalanceDetailInfo, Error>({
    queryKey: ["balanceDetailInfo", connected, address],
    queryFn: () => {
      if (!connected) return initialBalanceDetailInfo;
      return fetchBalanceDetailInfo(address);
    },
    initialData: initialBalanceDetailInfo
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
