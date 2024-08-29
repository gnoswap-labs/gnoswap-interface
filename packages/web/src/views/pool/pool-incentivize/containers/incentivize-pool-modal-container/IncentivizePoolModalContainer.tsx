import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useAddress } from "@hooks/address/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { usePositionData } from "@hooks/common/use-position-data";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import {
  useGetIncentivizePoolList,
  useGetPoolList,
  useRefetchGetPoolDetailByPath,
} from "@query/pools";
import { DexEvent } from "@repositories/common";
import { EarnState } from "@states/index";

import IncentivizePoolModal from "../../components/incentivize-pool-modal/IncentivizePoolModal";

const DAY_TIME = 24 * 60 * 60;
const MILLISECONDS = 1000;

interface IncentivizePoolModalContainerProps {
  poolPath?: string;
}

const IncentivizePoolModalContainer: React.FC<
  IncentivizePoolModalContainerProps
> = ({ poolPath }) => {
  const {
    broadcastSuccess,
    broadcastError,
    broadcastRejected,
    broadcastLoading,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const { address } = useAddress();

  // refetch functions
  const { refetch: refetchPositions } = usePositionData({ address });
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchIncentivizePools } = useGetIncentivizePoolList();
  const { refetch: refetchPoolDetails } =
    useRefetchGetPoolDetailByPath(poolPath);

  const { getMessage } = useMessage();

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();

    const pathName = router.pathname;
    if (pathName === "/earn/incentivize") {
      router.push("/earn?back=q");
    } else {
      router.push(router.asPath.replace("/incentivize", ""));
    }
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal(
    {
      closeCallback: onCloseConfirmTransactionModal,
    },
  );

  const onSubmit = useCallback(() => {
    if (!pool || !dataModal?.token) {
      return null;
    }
    const startUTCDate = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.date,
      0,
      0,
      0,
      0,
    );
    // `startTime` is current UTC time to Unix timestamp
    const startTime = new Date(startUTCDate).getTime() / MILLISECONDS;
    // `endTime` adds the period time to the start unix time.
    const endTime = startTime + period * DAY_TIME;

    const displayAmount = BigNumber(dataModal.amount).toFormat();

    broadcastLoading(
      getMessage(DexEvent.ADD_INCENTIVE, "pending", {
        tokenAAmount: displayAmount,
        tokenASymbol: dataModal?.token?.symbol,
      }),
    );

    return poolRepository
      .createExternalIncentive({
        poolPath: pool.poolPath,
        rewardToken: dataModal.token,
        rewardAmount: dataModal.amount || "0",
        startTime,
        endTime,
      })
      .then(response => {
        if (response) {
          if (
            response.code === 0 ||
            response.code === ERROR_VALUE.TRANSACTION_FAILED.status
          ) {
            enqueueEvent({
              txHash: response.data?.hash,
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
              },
            });
          }
          if (response.code === 0) {
            openTransactionConfirmModal();
            broadcastSuccess(
              getMessage(
                DexEvent.ADD_INCENTIVE,
                "success",
                {
                  tokenAAmount: displayAmount,
                  tokenASymbol: dataModal?.token?.symbol,
                },
                response.data?.hash,
              ),
            );
          } else if (
            response.code === ERROR_VALUE.TRANSACTION_REJECTED.status /// 4000
          ) {
            broadcastRejected(
              getMessage(DexEvent.ADD_INCENTIVE, "error", {
                tokenAAmount: displayAmount,
                tokenASymbol: dataModal?.token?.symbol,
              }),
            );
            openTransactionConfirmModal();
          } else {
            broadcastError(
              getMessage(
                DexEvent.ADD_INCENTIVE,
                "error",
                {
                  tokenAAmount: displayAmount,
                  tokenASymbol: dataModal?.token?.symbol,
                },
                response.data?.hash,
              ),
            );
            openTransactionConfirmModal();
          }
        }
        return response;
      })
      .catch(e => {
        console.log(e);
        return null;
      });
  }, [
    poolRepository,
    dataModal,
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
      onSubmit={onSubmit}
      data={dataModal}
      date={startDate}
      period={period}
      pool={pool}
    />
  );
};

export default IncentivizePoolModalContainer;
