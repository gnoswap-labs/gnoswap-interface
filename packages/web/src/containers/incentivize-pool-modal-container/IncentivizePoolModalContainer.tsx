import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";

const IncentivizePoolModalContainer = () => {
  const clearModal = useClearModal();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);
  
  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <IncentivizePoolModal close={close} onSubmit={onSubmit} data={dataModal} date={startDate} period={period} pool={pool} />;
};

export default IncentivizePoolModalContainer;
