// TODO : remove eslint-disable after work
/* eslint-disable */
import { ERROR_VALUE } from "@common/errors/adena";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import WalletBalance from "@components/wallet/wallet-balance/WalletBalance";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import useWithdrawTokens from "@components/wallet/withdraw-modal/useWithdrawTokens";
import { makeBroadcastClaimMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { usePosition } from "@hooks/common/use-position";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
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
  const { connected, isSwitchNetwork, loadingConnect, account } = useWallet();
  const [address, setAddress] = useState("");
  const { breakpoint } = useWindowSize();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>();
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>();
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);

  const { displayBalanceMap, updateBalances } = useTokenData();
  const { positions, loading: loadingPositions } = usePositionData();
  const { claimAll } = usePosition(positions);
  const { broadcastSuccess, broadcastPending, broadcastError, broadcastRejected } = useBroadcastHandler();
  const { openModal } = useTransactionConfirmModal();

  const changeTokenDeposit = useCallback((token?: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
    // setIsShowWithDrawModal(true);
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

  const claimAllReward = useCallback(() => {
    const data = {
      tokenASymbol: positions[0]?.pool?.tokenA?.symbol,
      tokenBSymbol: positions[0]?.pool?.tokenA?.symbol,
      tokenAAmount: "0.12",
      tokenBAmount: "0.13",
    };
    setLoadingTransactionClaim(true);
    claimAll().then(response => {
      if (response) {
        if (response.code === 0) {
          broadcastPending();
          setTimeout(() => {
            broadcastSuccess(makeBroadcastClaimMessage("success", data));
            setLoadingTransactionClaim(false);
          }, 1000);
          openModal();
        } else if (response.code === 4000 && response.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
          broadcastError(makeBroadcastClaimMessage("error", data));
          setLoadingTransactionClaim(false);
          openModal();
        } else {
          openModal();
          broadcastRejected(makeBroadcastClaimMessage("error", data), () => {}, true);
          setLoadingTransactionClaim(false);
        }
      }
    });
  }, [claimAll, setLoadingTransactionClaim, positions, openModal]);



  useEffect(() => {
    setLoadingBalance(true);
    updateBalances().finally(() => {
      setLoadingBalance(false);
    });
  }, [connected]);

  const loadingTotalBalance = loadingBalance || loadingPositions || loadingConnect === "loading";
  console.log(displayBalanceMap, "displayBalanceMap")
  const availableBalance: number = Object.keys(displayBalanceMap ?? {})
    .map(x => displayBalanceMap[x] ?? 0)
    .reduce(
      (acc: number, cur: number) => BigNumber(acc).plus(cur).toNumber(),
      0,
    );

  const { stakedBalance, unStakedBalance, claimableRewards } = positions.reduce(
    (acc, cur) => {
      if (cur.staked) {
        acc.stakedBalance = BigNumber(acc.stakedBalance)
          .plus(cur.stakedUsdValue ?? "0")
          .toNumber();
      } else {
        acc.unStakedBalance = BigNumber(acc.unStakedBalance)
          .plus(cur.stakedUsdValue ?? "0")
          .toNumber();
      }

      cur.rewards.forEach(x => {
        acc.claimableRewards = BigNumber(acc.claimableRewards)
          .plus(x.claimableUsdValue ?? "0")
          .toNumber();
      });
      return acc;
    },
    { stakedBalance: 0, unStakedBalance: 0, claimableRewards: 0 },
  );

  const sumTotalBalance = BigNumber(availableBalance)
    .plus(unStakedBalance)
    .plus(stakedBalance)
    .plus(claimableRewards)
    .decimalPlaces(2)
    .toFormat();

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
  
  const {
    isConfirm,
    setIsConfirm,
    onSubmit: handleSubmit,
  } = useWithdrawTokens();

  const onSubmit = (amount: any, address: string) => {
    if (!withdrawInfo || !account?.address) return;
    handleSubmit({
      fromAddress: account.address,
      toAddress: address,
      token: withdrawInfo, 
      tokenAmount: BigNumber(amount).multipliedBy(1000000).toNumber(),
    },
    withdrawInfo.type,);
    closeWithdraw();
  }

  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={{
          amount: `$${sumTotalBalance}`,
          changeRate: "0.0%",
          loading: loadingTotalBalance,
        }}
        balanceDetailInfo={{
          availableBalance: `${availableBalance}`,
          claimableRewards: `${claimableRewards}`,
          stakedLP: `${stakedBalance}`,
          unstakingLP: `${unStakedBalance}`,
          loadingBalance: loadingTotalBalance,
          loadingPositions: loadingTotalBalance,
        }}
        deposit={deposit}
        withdraw={withdraw}
        claimAll={claimAllReward}
        breakpoint={breakpoint}
        isSwitchNetwork={isSwitchNetwork}
        loadngTransactionClaim={loadngTransactionClaim}
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
          setIsConfirm={() => setIsConfirm(true)}
          isConfirm={isConfirm}
          handleSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default WalletBalanceContainer;
