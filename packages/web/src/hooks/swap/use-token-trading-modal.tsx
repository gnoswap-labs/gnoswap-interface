import TokenTradingModalContainer from "@containers/token-trading-modal-container/TokenTradingModalContainer";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: (token: TokenModel) => void;
}

interface TokenTradingModalProps {
  onClickConfirm: (value: TokenModel) => void;
}

export const useTokenTradingModal = ({onClickConfirm}: TokenTradingModalProps): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  
  const openModal = useCallback((value: TokenModel) => {
    setOpenedModal(true);
    setModalContent(<TokenTradingModalContainer onClickConfirm={() => onClickConfirm(value)}/>);
  }, [setModalContent, setOpenedModal, onClickConfirm]);

  return {
    openModal,
  };
};
