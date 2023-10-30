import React, { useCallback } from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { useSelectTokenModal } from "@hooks/token/use-select-token-modal";
import { TokenModel } from "@models/token/token-model";

interface SelectPairButtonProps {
  token: TokenModel | null;
  changeToken?: (token: TokenModel) => void;
  disabled?: boolean;
  hiddenModal?: boolean;
  callback?: (value: boolean) => void; 
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({
  token,
  changeToken,
  disabled,
  hiddenModal,
  callback,
}) => {
  const { openModal } = useSelectTokenModal({ changeToken, callback });

  const onClickButton = useCallback(() => {
    if (disabled || hiddenModal) {
      return;
    }
    openModal();
    callback?.(false);
  }, [disabled, openModal, hiddenModal, callback]);

  return (
    <div
      css={wrapper(Boolean(token), disabled || hiddenModal)}
      onClick={onClickButton}
    >
      {token ? (
        <div>
          <img src={token.logoURI} alt="token logo" className="token-logo" />
          <span className="token-symbol">{token.symbol}</span>
        </div>
      ) : (
        <span>Select</span>
      )}
      {!disabled && <IconStrokeArrowDown className="arrow-icon" />}
    </div>
  );
};

export default SelectPairButton;
