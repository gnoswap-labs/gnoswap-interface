import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import useRouter from "@hooks/common/use-custom-router";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import BigNumber from "bignumber.js";
import { useMessage } from "@hooks/common/use-message";
import { DexEvent } from "@repositories/common";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useGetPoolList } from "@query/pools";
import { useGetPositionsByAddress } from "@query/positions";

const DAY_TIME = 24 * 60 * 60;
const MILLISECONDS = 1000;

const IncentivizePoolModalContainer = () => {
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
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPositions } = useGetPositionsByAddress();

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
          if (response.code === 0) {
            enqueueEvent({
              txHash: response.data?.hash,
              action: DexEvent.ADD_INCENTIVE,
              formatData: () => ({
                tokenAAmount: displayAmount,
                tokenASymbol: dataModal?.token?.symbol,
              }),
              callback: async () => {
                await refetchPools();
                await refetchPositions();
              },
            });
            setTimeout(() => {
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
              openTransactionConfirmModal();
            }, 1000);
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
