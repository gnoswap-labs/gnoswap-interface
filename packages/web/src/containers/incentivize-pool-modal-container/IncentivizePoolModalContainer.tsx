import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";

const DAY_TIME = 24 * 60 * 60;

const IncentivizePoolModalContainer = () => {
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
      clearModal();
      router.back();
      return response;
    });
  }, [clearModal, dataModal, period, pool, poolRepository, router, startDate.date, startDate.month, startDate.year]);

  return <IncentivizePoolModal close={close} onSubmit={onSubmit} data={dataModal} date={startDate} period={period} pool={pool} />;
};

export default IncentivizePoolModalContainer;
