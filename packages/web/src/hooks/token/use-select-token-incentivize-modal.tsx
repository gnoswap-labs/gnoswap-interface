import SelectTokenContainer from "@containers/select-token-incentivize-container/SelectTokenContainer";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface SelectTokenModalProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}
export interface SelectTokenModalModel {
  openModal: () => void;
}

export const useSelectTokenIncentivizeModal = ({ changeToken, callback }: SelectTokenModalProps): SelectTokenModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <SelectTokenContainer
        changeToken={changeToken}
        callback={callback}
      />
    );
  }, [changeToken, setModalContent, setOpenedModal, callback]);

  return {
    openModal
  };
};