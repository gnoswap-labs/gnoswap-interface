import TokenTradingModalContainer from "@containers/token-trading-modal-container/TokenTradingModalContainer";
import { useUncommonToken } from "@hooks/common/use-uncommon-token";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: (token: { [key in string]: string } | TokenModel) => void;
}

interface TokenTradingModalProps {
  onClickConfirm: (value: { [key in string]: string } | TokenModel) => void;
  onClickClose: () => void;
}

export const useTokenTradingModal = ({ onClickConfirm, onClickClose }: TokenTradingModalProps): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const { warningStatus, addToken } = useUncommonToken();

  const openModal = useCallback((value: { [key in string]: string } | TokenModel) => {
    if (warningStatus.includes(value.path)) {
      return;
    }

    setOpenedModal(true);
    setModalContent(<TokenTradingModalContainer onClose={onClickClose} onClickConfirm={() => {
      onClickConfirm(value);
      addToken(value.path);
    }} token={value} />);
  }, [setModalContent, setOpenedModal, onClickConfirm]);

  return {
    openModal,
  };
};
