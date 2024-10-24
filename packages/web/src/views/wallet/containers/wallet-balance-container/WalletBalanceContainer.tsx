import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN } from "@common/values/token-constant";
import AssetReceiveModal from "@components/wallet/asset-receive-modal/AssetReceiveModal";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useMessage } from "@hooks/common/use-message";
import { usePosition } from "@hooks/common/use-position";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetAvgBlockTime } from "@query/address";
import { useGetAllTokenPrices } from "@query/token";
import { DexEvent } from "@repositories/common";
import { formatOtherPrice } from "@utils/new-number-utils";
import { toUnitFormat } from "@utils/number-utils";
import { isEmptyObject } from "@utils/validation-utils";

import AssetSendModal from "../../components/asset-send-modal/AssetSendModal";
import WalletBalance from "../../components/wallet-balance/WalletBalance";
import useSendAsset from "../../hooks/useSendAsset";

const WalletBalanceContainer: React.FC = () => {
  const { connected, isSwitchNetwork, loadingConnect, account } = useWallet();
  const [address] = useState("");
  const { breakpoint } = useWindowSize();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>();
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>();
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);

  const { data: blockTimeData } = useGetAvgBlockTime();
  const {
    balances: balancesPrice,
    loadingBalance,
    updateBalances,
  } = useTokenData();

  const {
    positions,
    loading: loadingPositions,
    refetch: refetchPositions,
  } = usePositionData();

  const isLoadingPosition = useMemo(
    () => connected && loadingPositions,
    [connected, loadingPositions],
  );

  const { claimAll } = usePosition(positions);
  const { broadcastSuccess, broadcastError, broadcastRejected } =
    useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { openModal } = useTransactionConfirmModal();
  const { data: tokenPrices = {}, isLoading: isLoadingTokenPrices } =
    useGetAllTokenPrices();

  const { getMessage } = useMessage();

  const changeTokenDeposit = useCallback((token?: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
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
    const amount = positions
      .flatMap(item => item.reward)
      .reduce((acc, item) => acc + Number(item.claimableUsd), 0);
    const data = {
      tokenAAmount: toUnitFormat(amount, true, true),
    };
    setLoadingTransactionClaim(true);
    claimAll().then(response => {
      if (response) {
        if (
          response?.code === 0 ||
          response?.code === ERROR_VALUE.TRANSACTION_FAILED.status
        ) {
          enqueueEvent({
            txHash: response?.data?.hash,
            action: DexEvent.CLAIM_FEE,
            formatData: () => data,
            onUpdate: async () => {
              await updateBalances();
            },
            onEmit: async () => {
              await refetchPositions();
            },
          });
        }
        if (response?.code === 0) {
          openModal();
          broadcastSuccess(
            getMessage(
              DexEvent.CLAIM_FEE,
              "success",
              data,
              response?.data?.hash,
            ),
          );
          setLoadingTransactionClaim(false);
        } else if (
          response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(
            getMessage(DexEvent.CLAIM_FEE, "error", data),
            () => {},
          );
          setLoadingTransactionClaim(false);
          openModal();
        } else {
          openModal();
          broadcastError(
            getMessage(DexEvent.CLAIM_FEE, "error", data, response?.data?.hash),
          );
          setLoadingTransactionClaim(false);
        }
      }
    });
  }, [claimAll, setLoadingTransactionClaim, positions, openModal]);

  const loadingTotalBalance = useMemo(() => {
    return (
      isLoadingPosition ||
      loadingConnect === "loading" ||
      isLoadingTokenPrices ||
      (account?.address && loadingBalance) ||
      !!(isEmptyObject(balancesPrice) && account?.address)
    );
  }, [
    isLoadingPosition,
    loadingConnect,
    account?.address,
    balancesPrice,
    isLoadingTokenPrices,
    loadingBalance,
  ]);

  const availableBalance = useMemo(() => {
    return Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "gnot" ? WRAPPED_GNOT_PATH : key;
      const balance =
        BigNumber(value || 0)
          .multipliedBy(tokenPrices?.[path]?.pricesBefore?.latestPrice || 0)
          .shiftedBy(GNOT_TOKEN.decimals * -1)
          .toNumber() || 0;
      return BigNumber(acc).plus(balance).toNumber();
    }, 0);
  }, [balancesPrice, tokenPrices]);

  const availableBalanceStr = useMemo(() => {
    return availableBalance;
  }, [availableBalance]);

  const {
    stakedBalance,
    unStakedBalance,
    claimableRewards,
    totalClaimedRewards,
  } = positions.reduce(
    (acc, curPosition) => {
      acc.totalClaimedRewards = BigNumber(acc.totalClaimedRewards)
        .plus(Number(curPosition.totalClaimedUsd ?? "0"))
        .toNumber();

      if (curPosition.staked) {
        acc.stakedBalance = BigNumber(acc.stakedBalance)
          .plus(Number(curPosition.stakedUsdValue ?? "0"))
          .toNumber();
      } else {
        acc.unStakedBalance = BigNumber(acc.unStakedBalance)
          .plus(Number(curPosition.usdValue ?? "0"))
          .toNumber();
      }

      curPosition.reward.forEach(rewardInfo => {
        acc.claimableRewards = BigNumber(acc.claimableRewards)
          .plus(Number(rewardInfo.claimableUsd ?? "0"))
          .toNumber();
      });
      return acc;
    },
    {
      stakedBalance: 0,
      unStakedBalance: 0,
      claimableRewards: 0,
      totalClaimedRewards: 0,
    },
  );

  const sumTotalBalance = useMemo(() => {
    return formatOtherPrice(
      BigNumber(availableBalance)
        .plus(unStakedBalance)
        .plus(stakedBalance)
        .plus(claimableRewards),
      { isKMB: false },
    );
  }, [availableBalance, unStakedBalance, stakedBalance, claimableRewards]);

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

  const { isConfirm, setIsConfirm, onSubmit: handleSubmit } = useSendAsset();

  const onSubmit = (amount: string, address: string) => {
    if (!withdrawInfo || !account?.address) return;
    handleSubmit(
      {
        fromAddress: account.address,
        toAddress: address,
        token: withdrawInfo,
        tokenAmount: BigNumber(amount)
          .multipliedBy(Math.pow(10, withdrawInfo.decimals))
          .toNumber(),
      },
      withdrawInfo.type,
    );
    closeWithdraw();
  };
  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={{
          amount: isSwitchNetwork ? "$0" : sumTotalBalance,
          changeRate: "0.0%",
          loading: loadingTotalBalance,
        }}
        balanceDetailInfo={{
          availableBalance: isSwitchNetwork ? "-" : `${availableBalanceStr}`,
          claimableRewards: isSwitchNetwork ? "-" : `${claimableRewards}`,
          stakedLP: isSwitchNetwork ? "-" : `${stakedBalance}`,
          unstakedLP: unStakedBalance.toString(),
          loadingBalance: loadingTotalBalance,
          loadingPositions: loadingTotalBalance,
          totalClaimedRewards: totalClaimedRewards.toString(),
        }}
        deposit={deposit}
        withdraw={withdraw}
        claimAll={claimAllReward}
        breakpoint={breakpoint}
        isSwitchNetwork={isSwitchNetwork}
        loadngTransactionClaim={loadngTransactionClaim}
        positions={positions}
        tokenPrices={tokenPrices}
      />
      {isShowDepositModal && (
        <AssetReceiveModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={depositInfo}
          avgBlockTime={blockTimeData?.AvgBlockTime || 2.2}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <AssetSendModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          avgBlockTime={blockTimeData?.AvgBlockTime || 2.2}
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
