import React, { useCallback } from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { TokenModel } from "@models/token/token-model";
import { useSelectTokenIncentivizeModal } from "@hooks/token/use-select-token-incentivize-modal";
import MissingLogo from "../missing-logo/MissingLogo";

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
      className={`${className} ${token ? "selected-token" : "not-selected-token"}`}
    >
      {token ? (
        <div className="token-pair-wrapper">
          <MissingLogo symbol={token.symbol} url={token.logoURI} className="token-logo" width={24} mobileWidth={24}/>
          <span className="token-symbol">{token.symbol}</span>
        </div>
      ) : (
        <span className="token-label-select">Select</span>
      )}
      {!isHiddenArrow && <IconStrokeArrowDown className="arrow-icon" />}
    </div>
  );
};

export default SelectPairIncentivizeButton;
