import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT } from "@common/values";
import { GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { GNS_TOKEN_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import {
  useGetIncentiveCreationDeposit,
  useGetIncentivizePoolList,
  useGetPoolList,
  useRefetchGetPoolDetailByPath,
} from "@query/pools";
import { useGetPoolStakingListByAddress } from "@query/pools/use-get-pool-staking-list-by-address";
import { DexEvent } from "@repositories/common";
import { EarnState } from "@states/index";

import IncentivizePoolModal from "../../components/incentivize-pool-modal/IncentivizePoolModal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { CreateExternalIncentiveRequest } from "@repositories/pool/request/create-external-incentive-request";

const DAY_TIME = 24 * 60 * 60;
const MILLISECONDS = 1000;

interface IncentivizePoolModalContainerProps {
  poolPath?: string;
}

const IncentivizePoolModalContainer: React.FC<IncentivizePoolModalContainerProps> = ({ poolPath }) => {
  const { broadcastSuccess, broadcastError, broadcastRejected, broadcastLoading } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const { walletClient } = useWallet();
  const { address } = useAddress();

  // refetch functions
  const { tokens, isFetched: isFetchedTokens, updateBalances } = useTokenData(true);
  const gnsToken = useMemo(() => tokens.find(token => token.path === GNS_TOKEN_PATH) ?? GNS_TOKEN, [tokens]);
  const wugnotToken = useMemo(() => tokens.find(token => token.path === WRAPPED_GNOT_PATH) ?? WUGNOT_TOKEN, [tokens]);
  const { refetch: refetchPositions } = usePositionData({ address, scopeId: "IncentivizePoolModalContainer" });

  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchIncentivizePools } = useGetIncentivizePoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(poolPath);
  const { refetch: refetchStakingList } = useGetPoolStakingListByAddress(address || "");
  const { data: incentiveCreationDepositGnsAmount = DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT } =
    useGetIncentiveCreationDeposit();

  const { getMessage } = useMessage();

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();

    const pathName = router.pathname;
    if (pathName === "/earn/incentivize") {
      router.push("/earn");
    } else {
      router.push(router.asPath.replace("/incentivize", ""));
    }
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    closeCallback: onCloseConfirmTransactionModal,
  });

  const buildWalletCreateIncentiveAction = async (request: CreateExternalIncentiveRequest) => {
    return poolRepository.createExternalIncentive(request);
  };

  const createExternalIncentive = useCallback(async () => {
    if (!pool || !dataModal?.token || !address || !isFetchedTokens) {
      return null;
    }
    const startUTCDate = Date.UTC(startDate.year, startDate.month - 1, startDate.date, 0, 0, 0, 0);
    // `startTime` is current UTC time to Unix timestamp
    const startTime = new Date(startUTCDate).getTime() / MILLISECONDS;
    // `endTime` adds the period time to the start unix time.
    const endTime = startTime + period * DAY_TIME;

    const displayAmount = BigNumber(dataModal.amount).toFormat();

    const walletType = walletClient?.getWalletType();

    const request: CreateExternalIncentiveRequest = {
      poolPath: pool.poolPath,
      rewardToken: dataModal.token,
      gnsToken,
      wugnotToken,
      rewardAmount: dataModal.amount || "0",
      incentiveCreationDepositGnsAmount,
      startTime,
      endTime,
    };

    if (walletType === "ADENA") {
      broadcastLoading(
        getMessage(DexEvent.ADD_INCENTIVE, "pending", {
          tokenAAmount: displayAmount,
          tokenASymbol: dataModal?.token?.symbol,
        }),
      );
    }

    const result = await buildWalletCreateIncentiveAction(request);

    if (result) {
      if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
        enqueueEvent({
          txHash: result.data?.hash,
          action: DexEvent.ADD_INCENTIVE,
          visibleEmitResult: true,
          formatData: () => ({
            tokenAAmount: displayAmount,
            tokenASymbol: dataModal?.token?.symbol,
          }),
          onEmit: async () => {
            refetchPools();
            refetchPositions();
            refetchIncentivizePools();
            refetchPoolDetails();
            refetchStakingList();
          },
          onUpdate: async () => {
            updateBalances();
          },
        });
      }
      if (result.code === 0) {
        openTransactionConfirmModal();
        broadcastSuccess(
          getMessage(
            DexEvent.ADD_INCENTIVE,
            "success",
            {
              tokenAAmount: displayAmount,
              tokenASymbol: dataModal?.token?.symbol,
            },
            result.data?.hash,
          ),
        );
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status /// 4000
      ) {
        broadcastRejected(
          getMessage(DexEvent.ADD_INCENTIVE, "error", {
            tokenAAmount: displayAmount,
            tokenASymbol: dataModal?.token?.symbol,
          }),
        );
        openTransactionConfirmModal();
      } else {
        broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        openTransactionConfirmModal();
      }
    }
    return result;
  }, [
    address,
    poolRepository,
    dataModal,
    incentiveCreationDepositGnsAmount,
    gnsToken,
    wugnotToken,
    isFetchedTokens,
    period,
    pool,
    router,
    startDate.date,
    startDate.month,
    startDate.year,
  ]);

  return (
    <IncentivizePoolModal
      close={clearModal}
      onSubmit={createExternalIncentive}
      data={dataModal}
      date={startDate}
      period={period}
      pool={pool}
    />
  );
};

export default IncentivizePoolModalContainer;
