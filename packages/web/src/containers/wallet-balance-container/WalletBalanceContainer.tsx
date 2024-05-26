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
import { useGetTokenPrices } from "@query/token";
import BigNumber from "bignumber.js";
import React, { useCallback, useState, useMemo } from "react";
import { useLoading } from "@hooks/common/use-loading";
import { WRAPPED_GNOT_PATH } from "@common/clients/wallet-client/transaction-messages";
import { isEmptyObject } from "@utils/validation-utils";
import { toUnitFormat } from "@utils/number-utils";

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
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const { isLoadingCommon } = useLoading();

  const { balances: balancesPrice } = useTokenData();

  const { positions, loading: loadingPositions } = usePositionData();
  const { claimAll } = usePosition(positions);
  const { broadcastSuccess, broadcastPending, broadcastError, broadcastRejected } = useBroadcastHandler();
  const { openModal } = useTransactionConfirmModal();
  const { data: tokenPrices = {} } = useGetTokenPrices();
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
    const amount = positions.flatMap(item => item.reward).reduce((acc, item) => acc + Number(item.claimableAmount), 0);
    const data = {
      amount: toUnitFormat(amount, true, true),
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
          broadcastRejected(makeBroadcastClaimMessage("error", data), () => { }, true);
          setLoadingTransactionClaim(false);
        }
      }
    });
  }, [claimAll, setLoadingTransactionClaim, positions, openModal]);
  const loadingTotalBalance = useMemo(() => {
    return loadingPositions || loadingConnect === "loading" || isLoadingCommon || !!(isEmptyObject(balancesPrice) && account?.address);
  }, [loadingPositions, loadingConnect, isLoadingCommon, account?.address, balancesPrice]);

  const availableBalance = useMemo(() => {
    return Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "gnot" ? WRAPPED_GNOT_PATH : key;
      const balance = BigNumber(value || 0).multipliedBy(tokenPrices?.[path]?.pricesBefore?.latestPrice || 0).dividedBy(10 ** 6).toNumber() || 0;
      return BigNumber(acc).plus(balance).toNumber();
    }, 0);
  }, [balancesPrice, tokenPrices]);

  const { stakedBalance, unStakedBalance, claimableRewards } = positions.reduce(
    (acc, cur) => {
      if (cur.staked) {
        acc.stakedBalance = BigNumber(acc.stakedBalance)
          .plus(cur.stakedUsdValue ?? "0")
          .toNumber();
      } else {
        acc.unStakedBalance = BigNumber(acc.unStakedBalance)
          .plus(cur.totalClaimedUsd ?? "0")
          .toNumber();
      }

      cur.reward.forEach(x => {
        acc.claimableRewards = BigNumber(acc.claimableRewards)
          .plus(x.claimableUsd ?? "0")
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
    .toFormat(availableBalance === 0 ? 0 : 2);
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
      tokenAmount: BigNumber(amount).multipliedBy(Math.pow(10, withdrawInfo.decimals)).toNumber(),
    },
      withdrawInfo.type,);
    closeWithdraw();
  }
  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={{
          amount: isSwitchNetwork ? "$0" : `$${sumTotalBalance}`,
          changeRate: "0.0%",
          loading: loadingTotalBalance,
        }}
        balanceDetailInfo={{
          availableBalance: isSwitchNetwork ? "-" : `${availableBalance}`,
          claimableRewards: isSwitchNetwork ? "-" : `${claimableRewards}`,
          stakedLP: isSwitchNetwork ? "-" : `${stakedBalance}`,
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
