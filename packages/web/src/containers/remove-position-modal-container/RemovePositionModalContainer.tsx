import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";

const RemovePositionModalContainer = () => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <RemovePositionModal close={close} onSubmit={onSubmit}/>;
};

export default RemovePositionModalContainer;
