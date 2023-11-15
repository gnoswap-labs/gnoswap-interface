import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";

const UnstakePositionModalContainer = () => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <UnstakePositionModal close={close} onSubmit={onSubmit}/>;
};

export default UnstakePositionModalContainer;
