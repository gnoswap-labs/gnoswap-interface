import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";

const SubmitPositionModalContainer = () => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <SubmitPositionModal close={close} onSubmit={onSubmit}/>;
};

export default SubmitPositionModalContainer;
