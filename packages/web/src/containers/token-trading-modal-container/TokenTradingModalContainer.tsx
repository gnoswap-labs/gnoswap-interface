import TokenTradingModal from "@components/common/token-trading-modal/TokenTradingModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";

interface Props {
  onClickConfirm: () => void;
}

const TokenTradingModalContainer:React.FC<Props> = ({ onClickConfirm }) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <TokenTradingModal close={close} onClickConfirm={onClickConfirm}/>;
};

export default TokenTradingModalContainer;
