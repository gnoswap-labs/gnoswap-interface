// TODO : remove eslint-disable after work
/* eslint-disable */
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import WalletBalance from "@components/wallet/wallet-balance/WalletBalance";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";

export interface BalanceSummaryInfo {
  amount: string;
  changeRate: string;
  loading: boolean;
}

export interface BalanceDetailInfo {
  availableBalance: string;
  stakedLP: string;
  unstakingLP: string;
  claimableRewards: string;
  loadingBalance: boolean;
  loadingPositions: boolean;
}

const WalletBalanceContainer: React.FC = () => {
  const { connected, isSwitchNetwork } = useWallet();
  const [address, setAddress] = useState("");
  const { breakpoint } = useWindowSize();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>();
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>();

  const changeTokenDeposit = useCallback((token?: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
    setIsShowWithDrawModal(true);
  }, []);

  const deposit = useCallback(() => {
    if (!connected) return;
    changeTokenDeposit(undefined);
    if (!address) return;
  }, [connected, address, changeTokenDeposit]);

  const withdraw = useCallback(() => {
    if (!connected) return;
    setIsShowWithDrawModal(true);
    if (!address) return;
  }, [connected, address]);

  const claimAll = useCallback(() => {}, []);

  const { displayBalanceMap, loadingBalance } = useTokenData();
  const { positions, loading: loadingPositions } = usePositionData();

  const loadingTotalBalance = loadingBalance || loadingPositions;

  const availableBalance: number = Object.keys(displayBalanceMap ?? {})
    .map(x => displayBalanceMap[x] ?? 0)
    .reduce((acc: number, cur: number) => acc + cur, 0);

  const { stakedBalance, unStakedBalance, claimableRewards } = positions.reduce(
    (acc, cur) => {
      if (cur.staked) {
        acc.stakedBalance + +cur.stakedUsdValue;
      } else {
        acc.unStakedBalance + +cur.stakedUsdValue;
      }

      cur.rewards.forEach(x => (acc.claimableRewards += +x.claimableUsdValue));
      return acc;
    },
    { stakedBalance: 0, unStakedBalance: 0, claimableRewards: 0 },
  );

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  const callbackWithdraw = (value: boolean) => {
    setIsShowWithDrawModal(value);
  };

  usePreventScroll(isShowDepositModal || isShowWithdrawModal);

  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={{
          amount: `$${(
            availableBalance +
            unStakedBalance +
            stakedBalance
          ).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`,
          changeRate: "0.0%",
          loading: loadingTotalBalance,
        }}
        balanceDetailInfo={{
          availableBalance: `${availableBalance}`,
          claimableRewards: `${claimableRewards}`,
          stakedLP: `${stakedBalance}`,
          unstakingLP: `${unStakedBalance}`,
          loadingBalance,
          loadingPositions,
        }}
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
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <WithDrawModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          connected={connected}
          changeToken={changeTokenWithdraw}
          callback={callbackWithdraw}
        />
      )}
    </>
  );
};

export default WalletBalanceContainer;
