import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import { makeBroadcastIncentivizeMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";

const DAY_TIME = 24 * 60 * 60;

const IncentivizePoolModalContainer = () => {
  const { broadcastSuccess, broadcastPending, broadcastError, broadcastRejected } = useBroadcastHandler();
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    if (!pool || !dataModal?.token) {
      return null;
    }
    const startUTCDate = Date.UTC(startDate.year, startDate.month - 1, startDate.date, 0, 0, 0, 0);
    const startTime = new Date(startUTCDate).getTime();
    const endTime = startTime + period * DAY_TIME;

    return poolRepository.createExternalIncentive({
      poolPath: pool.path,
      rewardToken: dataModal.token,
      rewardAmount: dataModal.amount || "0",
      startTime,
      endTime
    }).then(response => {
      if (response) {
        if (response.code === 0) {
          broadcastPending();
          setTimeout(() => {
            broadcastSuccess(makeBroadcastIncentivizeMessage("success"));
            clearModal();
          }, 1000);
        } else if (response.code === 4000 && response.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
          broadcastPending();
          setTimeout(() => {
            broadcastError(makeBroadcastIncentivizeMessage("error"));
            clearModal();
          }, 1000);
        } else {
          broadcastRejected(makeBroadcastIncentivizeMessage("error"));
        }
      }
      return response;
    }).catch(e => {
      console.log(e);
      return null;
    });
  }, [clearModal, dataModal, period, pool, poolRepository, router, startDate.date, startDate.month, startDate.year]);

  return <IncentivizePoolModal close={close} onSubmit={onSubmit} data={dataModal} date={startDate} period={period} pool={pool} />;
};

export default IncentivizePoolModalContainer;
