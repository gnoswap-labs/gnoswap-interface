import React, { useCallback } from "react";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { useSelectTokenModal } from "@hooks/token/use-select-token-modal";
import { TokenModel } from "@models/token/token-model";
import MissingLogo from "../missing-logo/MissingLogo";

interface SelectPairButtonProps {
  token: TokenModel | null;
  changeToken?: (token: TokenModel) => void;
  disabled?: boolean;
  hiddenModal?: boolean;
  callback?: (value: boolean) => void;
  isHiddenArrow?: boolean;
  className?: string;
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({
  token,
  changeToken,
  disabled,
  hiddenModal,
  callback,
  isHiddenArrow,
  className,
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
      css={wrapper(Boolean(token), disabled || hiddenModal, isHiddenArrow)}
      onClick={onClickButton}
      className={`${className} ${token ? "selected-token" : "not-selected-token"}`}
    >
      {token ? (
        <div>
          <MissingLogo symbol={token.symbol} url={token.logoURI} className="token-logo" width={24} mobileWidth={24}/>
          <span className="token-symbol">{token.symbol}</span>
        </div>
      ) : (
        <span>Select</span>
      )}
      {!isHiddenArrow && <IconStrokeArrowDown className="arrow-icon" />}
    </div>
  );
};

export default SelectPairButton;
