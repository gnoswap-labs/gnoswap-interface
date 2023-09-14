import React, { useCallback } from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { useSelectTokenModal } from "@hooks/token/use-select-token-modal";

interface SelectPairButtonProps {
  token?: TokenDefaultModel;
  changeToken?: (token: TokenDefaultModel) => void;
  disabled?: boolean;
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({
  token,
  changeToken,
  disabled,
}) => {
  const { openModal } = useSelectTokenModal({ changeToken });

  const onClickButton = useCallback(() => {
    if (disabled) {
      return;
    }
    openModal();
  }, [disabled, openModal]);

  return (
    <div css={wrapper(Boolean(token), disabled)} onClick={onClickButton}>
      {token ? (
        <>
          <img src={token.tokenLogo} alt="token logo" className="token-logo" />
          <span className="token-symbol">{token.symbol}</span>
        </>
      ) : (
        <span>Select</span>
      )}
      {!disabled && <IconStrokeArrowDown className="arrow-icon" />}

    </div>
  );
};

export default SelectPairButton;
