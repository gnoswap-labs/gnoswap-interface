// TODO : remove eslint-disable after work
/* eslint-disable */
import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WalletBalance from "@components/wallet/wallet-balance/WalletBalance";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import { TokenModel } from "@models/token/token-model";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";

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
  changeRate: "+0.0%",
};

async function fetchBalanceSummaryInfo(
  address: string,
): Promise<BalanceSummaryInfo> {
  console.debug("fetchBalanceSummaryInfo", address);
  return Promise.resolve({ amount: "$1,324.40", changeRate: "+14.3%" });
}

const initialBalanceDetailInfo: BalanceDetailInfo = {
  availableBalance: "$0.00",
  stakedLP: "$0.00",
  unstakingLP: "$0.00",
  claimableRewards: "$0.00",
};

async function fetchBalanceDetailInfo(
  address: string,
): Promise<BalanceDetailInfo> {
  console.debug("fetchBalanceDetailInfo", address);
  return Promise.resolve({
    availableBalance: "$1,234.1",
    stakedLP: "$1,234.2",
    unstakingLP: "$1,234.3",
    claimableRewards: "$1,234.4",
  });
}


const DEPOSIT_TO = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "Cosmos",
  logoURI:
    "/cosmos.svg",
  type: "grc20",
  priceId: "gno.land/r/gnos",
};

const DEPOSIT_FROM = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "Gnoland",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  type: "grc20",
  priceId: "gno.land/r/gnos",
};
const DEPOSIT_INFO = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "ATOM",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "ATOM",
  logoURI:
    "/atom.svg",
  type: "grc20",
  priceId: "gno.land/r/gnos",
};

const WalletBalanceContainer: React.FC = () => {
  const { connected, isSwitchNetwork } = useWallet();
  const [address, setAddress] = useState("");
  const { breakpoint } = useWindowSize();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState(DEPOSIT_INFO);
  const [withdrawInfo, setWithDrawInfo] = useState(DEPOSIT_INFO);

  const changeTokenDeposit = useCallback((token: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
    setIsShowWithDrawModal(true);
  }, []);

  const deposit = useCallback(() => {
    if (!connected) return;
    setIsShowDepositModal(true);
    if (!address) return;
  }, [connected, address]);

  const withdraw = useCallback(() => {
    if (!connected) return;
    setIsShowWithDrawModal(true);
    if (!address) return;
  }, [connected, address]);

  const claimAll = useCallback(() => { }, []);

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
    initialData: initialBalanceSummaryInfo,
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
    initialData: initialBalanceDetailInfo,
  });

  const closeDeposit = () => {
    setIsShowDepositModal(false)
  }

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false)
  }

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  }

  const callbackWithdraw = (value: boolean) => {
    setIsShowWithDrawModal(value);
  }

  usePreventScroll(isShowDepositModal || isShowWithdrawModal);

  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={balanceSummaryInfo}
        balanceDetailInfo={balanceDetailInfo}
        deposit={deposit}
        withdraw={withdraw}
        claimAll={claimAll}
        breakpoint={breakpoint}
        isSwitchNetwork={isSwitchNetwork}
      />
      {isShowDepositModal && (
        <DepositModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={depositInfo}
          fromToken={DEPOSIT_TO}
          toToken={DEPOSIT_FROM}
          connected={connected}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <WithDrawModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          fromToken={DEPOSIT_FROM}
          toToken={DEPOSIT_TO}
          connected={connected}
          changeToken={changeTokenWithdraw}
          callback={callbackWithdraw}
        />
      )}
    </>
  );
};

export default WalletBalanceContainer;
