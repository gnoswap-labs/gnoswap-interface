import SelectTokenContainer from "@containers/select-token-container/SelectTokenContainer";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface SelectTokenModalProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  additionalTokens?: TokenModel[];
}
export interface SelectTokenModalModel {
  openModal: () => void;
}

export const useSelectTokenModal = ({
  changeToken,
  callback,
  additionalTokens,
}: SelectTokenModalProps): SelectTokenModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <SelectTokenContainer changeToken={changeToken} callback={callback} additionalTokens={additionalTokens} />,
    );
  }, [additionalTokens, callback, changeToken, setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
