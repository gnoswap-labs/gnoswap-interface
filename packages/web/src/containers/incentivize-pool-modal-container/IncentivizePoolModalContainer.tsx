import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";

const IncentivizePoolModalContainer = () => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <IncentivizePoolModal close={close} onSubmit={onSubmit}/>;
};

export default IncentivizePoolModalContainer;
