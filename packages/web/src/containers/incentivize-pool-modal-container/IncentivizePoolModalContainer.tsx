import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import {
  makeBroadcastIncentivizeMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";

const DAY_TIME = 24 * 60 * 60;

const IncentivizePoolModalContainer = () => {
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const {
    broadcastLoading,
    broadcastRejected,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
  } = useBroadcastHandler();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const moveToBack = useCallback(() => {
    close();
    router.back();
  }, [close, router]);

  const onSubmit = useCallback(() => {
    if (!pool || !dataModal?.token || !dataModal?.amount) {
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
    const startTime = new Date(startUTCDate).getTime();
    const endTime = startTime + period * DAY_TIME;

    const broadcastPayload = {
      tokenASymbol: dataModal?.token?.symbol,
      tokenAAmount: dataModal?.amount,
    };

    broadcastLoading(
      makeBroadcastIncentivizeMessage("pending", broadcastPayload),
    );

    return poolRepository
      .createExternalIncentive({
        poolPath: pool.path,
        rewardToken: dataModal.token,
        rewardAmount: dataModal.amount || "0",
        startTime,
        endTime,
      })
      .then(result => {
        if (result) {
          if (result.code === 0) {
            broadcastPending();
            setTimeout(() => {
              broadcastSuccess(
                makeBroadcastIncentivizeMessage("success", broadcastPayload),
                moveToBack,
              );
            }, 500);
            return true;
          } else if (result.code === 4000) {
            broadcastRejected(
              makeBroadcastIncentivizeMessage("error", broadcastPayload),
            );
            return true;
          }
        }
        return false;
      })
      .catch(() => false)
      .then(broadcasted => {
        if (broadcasted) {
          return;
        }
        broadcastError(
          makeBroadcastIncentivizeMessage("error", broadcastPayload),
        );
      });
  }, [
    broadcastError,
    broadcastLoading,
    broadcastPending,
    broadcastRejected,
    broadcastSuccess,
    dataModal?.amount,
    dataModal?.token,
    moveToBack,
    period,
    pool,
    poolRepository,
    startDate.date,
    startDate.month,
    startDate.year,
  ]);

  return (
    <IncentivizePoolModal
      close={close}
      onSubmit={onSubmit}
      data={dataModal}
      date={startDate}
      period={period}
      pool={pool}
    />
  );
};

export default IncentivizePoolModalContainer;
