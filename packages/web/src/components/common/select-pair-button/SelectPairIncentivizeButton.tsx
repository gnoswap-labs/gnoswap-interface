import React, { useCallback } from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { TokenModel } from "@models/token/token-model";
import { useSelectTokenIncentivizeModal } from "@hooks/token/use-select-token-incentivize-modal";

interface SelectPairIncentivizeButtonProps {
  token: TokenModel | null;
  changeToken?: (token: TokenModel) => void;
  disabled?: boolean;
  hiddenModal?: boolean;
  callback?: (value: boolean) => void;
  isHiddenArrow?: boolean;
  className?: string;
}

const SelectPairIncentivizeButton: React.FC<SelectPairIncentivizeButtonProps> = ({
  token,
  changeToken,
  disabled,
  hiddenModal,
  callback,
  isHiddenArrow,
  className,
}) => {
  const { openModal } = useSelectTokenIncentivizeModal({ changeToken, callback });

  const onClickButton = useCallback(() => {
    if (disabled || hiddenModal) {
      return;
    }
    openModal();
    callback?.(false);
  }, [disabled, openModal, hiddenModal, callback]);

  return (
    <div
      css={wrapper(Boolean(token), disabled || hiddenModal, isHiddenArrow)}
      onClick={onClickButton}
      className={className}
    >
      {token ? (
        <div>
          <img src={token.logoURI} alt="token logo" className="token-logo" />
          <span className="token-symbol">{token.symbol}</span>
        </div>
      ) : (
        <span>Select</span>
      )}
      {!isHiddenArrow && <IconStrokeArrowDown className="arrow-icon" />}
    </div>
  );
};

export default SelectPairIncentivizeButton;
