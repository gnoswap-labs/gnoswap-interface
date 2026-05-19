import React, { useCallback } from "react";
import { cx } from "@emotion/css";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import { wrapper } from "./SelectPairButton.styles";
import { useSelectTokenModal } from "@hooks/token/ui/use-select-token-modal";
import { TokenModel } from "@models/token/token-model";
import MissingLogo from "../missing-logo/MissingLogo";
import { useTranslation } from "react-i18next";
import { formatDisplayTokenSymbol } from "@utils/token-utils";

interface SelectPairButtonProps {
  token: TokenModel | null;
  changeToken?: (token: TokenModel) => void;
  disabled?: boolean;
  hiddenModal?: boolean;
  callback?: (value: boolean) => void;
  isHiddenArrow?: boolean;
  className?: string;
  isChanging?: boolean;
}

const SelectPairButton: React.FC<SelectPairButtonProps> = ({
  token,
  changeToken,
  disabled,
  hiddenModal,
  callback,
  isHiddenArrow,
  className,
  isChanging,
}) => {
  const { t } = useTranslation();
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
      className={cx(className, {
        isChanging: Boolean(isChanging),
        "selected-token": Boolean(token),
        "not-selected-token": !token,
      })}
    >
      {token ? (
        <div className={cx("token-info", { isChanging: isChanging })}>
          <MissingLogo symbol={token.symbol} url={token.logoURI} className="token-logo" width={24} mobileWidth={24} />
          <span className={"token-symbol"}>{formatDisplayTokenSymbol(token.symbol)}</span>
        </div>
      ) : (
        <span>{t("common:selectPairBtn.select")}</span>
      )}
      {!isHiddenArrow && <IconStrokeArrowDown className="arrow-icon" />}
    </div>
  );
};

export default SelectPairButton;
