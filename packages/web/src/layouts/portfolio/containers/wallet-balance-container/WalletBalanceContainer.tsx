import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN } from "@common/values/token-constant";
import AssetReceiveModal from "@components/wallet/asset-receive-modal/AssetReceiveModal";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePosition } from "@hooks/pool/data/use-position";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetAvgBlockTime } from "@query/address";
import { useGetPositionRewards } from "@query/positions";
import { QUERY_KEY } from "@query/query-keys";
import { useGetAllTokenPrices } from "@query/token";
import { DexEvent } from "@repositories/common";
import { delay } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";
import { toUnitFormat } from "@utils/number-utils";
import { isEmptyObject } from "@utils/validation-utils";

import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import useSendAsset from "@hooks/wallet/data/useSendAsset";
import { BalanceDetailInfo } from "@layouts/portfolio/components/wallet-balance/wallet-balance-detail/WalletBalanceDetail";
import { BalanceSummaryInfo } from "@layouts/portfolio/components/wallet-balance/wallet-balance-summary/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import AssetSendModal from "../../components/asset-send-modal/AssetSendModal";
import WalletBalance from "../../components/wallet-balance/WalletBalance";

const WalletBalanceContainer: React.FC = () => {
  const { rpcProvider } = useGnoswapContext();
  const { connected, isSwitchNetwork, loadingConnect, account, walletType, currentChainId } = useWallet();
  const { address: userAddress = "" } = useAddress();
  const [address] = useState("");
  const { breakpoint } = useWindowSize();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>();
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>();
  const [loadngTransactionClaim, setLoadingTransactionClaim] = useState(false);
  const [sendAssetAmount, setSendAssetAmount] = useState("");

  const { data: blockTimeData } = useGetAvgBlockTime();
  const { balances: balancesPrice, loadingBalance, updateBalances, tokens } = useTokenData();

  const { positions, loading: loadingPositions } = usePositionData();
  const { data: positionRewards, isLoading: loadingPositionRewards } = useGetPositionRewards();

  const { invalidateQueryKey } = useInvalidateQueries();

  const handleRefreshData = useCallback(async () => {
    invalidateQueryKey("WalletBalance, ClaimAll", [
      [QUERY_KEY.tokenBalancesByAddress, userAddress],
      [QUERY_KEY.positions, currentChainId, userAddress],
      [QUERY_KEY.positionRewards, currentChainId, userAddress],
    ]);
  }, [invalidateQueryKey, currentChainId, userAddress]);

  const isLoadingPosition = useMemo(
    () => connected && (loadingPositions || loadingPositionRewards),
    [connected, loadingPositions, loadingPositionRewards],
  );

  const { claimAll } = usePosition([]);
  const { broadcastSuccess, broadcastError, broadcastRejected, broadcastLoading } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { openModal } = useTransactionConfirmModal();
  const { data: tokenPrices = {}, isLoading: isLoadingTokenPrices } = useGetAllTokenPrices();

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

  const claimAllInput = useMemo(() => {
    if (!positionRewards) {
      return {
        swapFeeTokenPaths: [],
        hasGnotStakingReward: false,
        positionsWithSwapFee: [],
        positionsWithStakingReward: [],
      };
    }

    const swapFeeTokenPaths = positionRewards.claimable.swapFee.map(item => item.tokenPath);
    const hasGnotStakingReward = [
      ...positionRewards.claimable.internalReward,
      ...positionRewards.claimable.externalReward,
    ].some(item => item.tokenPath === WRAPPED_GNOT_PATH);

    return {
      swapFeeTokenPaths,
      hasGnotStakingReward,
      positionsWithSwapFee: positionRewards.positionsWithSwapFee,
      positionsWithStakingReward: positionRewards.positionsWithStakingReward,
    };
  }, [positionRewards]);

  const claimAllReward = useCallback(() => {
    const amount = Number(positionRewards?.totalUsd.claimable.total ?? "0");

    const messageData = {
      tokenAAmount: toUnitFormat(amount, true, false),
    };

    broadcastLoading(getMessage(DexEvent.CLAIM_FEE, "pending", messageData));

    setLoadingTransactionClaim(true);
    claimAll({ rpcProvider, input: claimAllInput }).then(response => {
      if (response) {
        if (response?.code === 0 || response?.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: response?.data?.hash,
            action: DexEvent.CLAIM_FEE,
            checkWugnotTransfer: true,
            formatData: () => messageData,
            onUpdate: async () => {
              updateBalances();
            },
            onEmit: async () => {
              await delay(5000);
              handleRefreshData();
            },
            onSuccess: handleRefreshData,
          });
        }
        if (response?.code === 0) {
          openModal();
          broadcastSuccess(getMessage(DexEvent.CLAIM_FEE, "success", messageData, response?.data?.hash));
          setLoadingTransactionClaim(false);
        } else if (
          response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(getMessage(DexEvent.CLAIM_FEE, "error", messageData), () => {});
          setLoadingTransactionClaim(false);
          openModal();
        } else {
          openModal();
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          setLoadingTransactionClaim(false);
        }
      }
    });
  }, [claimAll, setLoadingTransactionClaim, claimAllInput, positionRewards, openModal]);

  const loadingTotalBalance = useMemo(() => {
    return (
      isLoadingPosition ||
      loadingConnect === "loading" ||
      isLoadingTokenPrices ||
      (account?.address && loadingBalance) ||
      !!(isEmptyObject(balancesPrice) && account?.address)
    );
  }, [isLoadingPosition, loadingConnect, account?.address, balancesPrice, isLoadingTokenPrices, loadingBalance]);

  const availableBalance = useMemo(() => {
    return Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "ugnot" ? WRAPPED_GNOT_PATH : key;
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

  const { stakedBalance, unStakedBalance } = useMemo(() => {
    if (!positions || positions.length === 0) {
      return { stakedBalance: 0, unStakedBalance: 0 };
    }

    return positions.reduce(
      (acc, curPosition) => {
        if (curPosition.closed) {
          return acc;
        }

        if (curPosition.staked) {
          acc.stakedBalance = BigNumber(acc.stakedBalance)
            .plus(Number(curPosition.stakedUsdValue ?? "0"))
            .toNumber();
        } else {
          acc.unStakedBalance = BigNumber(acc.unStakedBalance)
            .plus(Number(curPosition.usdValue ?? "0"))
            .toNumber();
        }

        return acc;
      },
      { stakedBalance: 0, unStakedBalance: 0 },
    );
  }, [positions]);

  const claimableRewards = Number(positionRewards?.totalUsd.claimable.total ?? "0");
  const totalClaimedRewards = Number(positionRewards?.totalUsd.claimed.total ?? "0");

  const sumTotalBalance = useMemo(() => {
    return formatOtherPrice(
      BigNumber(availableBalance).plus(unStakedBalance).plus(stakedBalance).plus(claimableRewards),
      { isKMB: false },
    );
  }, [availableBalance, unStakedBalance, stakedBalance, claimableRewards]);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false);
    setSendAssetAmount("");
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
        tokenAmount: BigNumber(amount).multipliedBy(Math.pow(10, withdrawInfo.decimals)).toNumber(),
      },
      withdrawInfo.type,
    );
    closeWithdraw();
  };

  const balanceSummaryInfo: BalanceSummaryInfo = React.useMemo(() => {
    if (!connected || isSwitchNetwork) {
      return {
        amount: "-",
        changeRate: "-",
        loading: false,
      };
    }

    return {
      amount: sumTotalBalance,
      changeRate: "0.0%",
      loading: loadingTotalBalance,
    };
  }, [connected, isSwitchNetwork, sumTotalBalance, loadingTotalBalance]);

  const balanceDetailInfo: BalanceDetailInfo = React.useMemo(() => {
    if (!connected || isSwitchNetwork) {
      return {
        availableBalance: "-",
        claimableRewards: "-",
        stakedLP: "-",
        unstakedLP: "-",
        loadingBalance: false,
        loadingPositions: false,
        totalClaimedRewards: "-",
      };
    }
    return {
      availableBalance: `${availableBalanceStr}`,
      claimableRewards: `${claimableRewards}`,
      stakedLP: `${stakedBalance}`,
      unstakedLP: `${unStakedBalance}`,
      loadingBalance: loadingTotalBalance,
      loadingPositions: loadingTotalBalance,
      totalClaimedRewards: `${totalClaimedRewards}`,
    };
  }, [
    connected,
    isSwitchNetwork,
    availableBalanceStr,
    claimableRewards,
    stakedBalance,
    unStakedBalance,
    loadingTotalBalance,
    totalClaimedRewards,
  ]);

  return (
    <>
      <WalletBalance
        connected={connected}
        balanceSummaryInfo={balanceSummaryInfo}
        balanceDetailInfo={balanceDetailInfo}
        deposit={deposit}
        withdraw={withdraw}
        claimAll={claimAllReward}
        breakpoint={breakpoint}
        isSwitchNetwork={isSwitchNetwork}
        loadngTransactionClaim={loadngTransactionClaim}
        positions={positions}
        positionRewards={positionRewards ?? null}
        tokens={tokens}
        tokenPrices={tokenPrices}
        walletType={walletType}
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
          amount={sendAssetAmount}
          setAmount={setSendAssetAmount}
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
