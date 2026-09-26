import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import IconAdd from "@components/common/icons/IconAdd";
import IconSettings from "@components/common/icons/IconSettings";
import SettingMenuModal from "@components/common/setting-menu-modal/SettingMenuModal";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import { MaxNativeAmountParams } from "@hooks/gas";
import { TokenAmountInputModel } from "@hooks/token/data/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";

import { IncreaseSelectPositionWrapper } from "./IncreaseSelectPosition.styles";

export interface IncreaseSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  connected: boolean;
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  changeTokenAAmount: (amount: string) => void;
  changeTokenBAmount: (amount: string) => void;
  slippage: number;
  changeSlippage: (value: number) => void;
  makeMaxAmountMessages?: (deposited: "A" | "B") => MaxNativeAmountParams["makeMessages"];
}

const IncreaseAmountPosition: React.FC<IncreaseSelectPositionProps> = ({
  tokenA,
  tokenB,
  connected,
  isDepositTokenA,
  isDepositTokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  changeTokenAAmount,
  changeTokenBAmount,
  slippage,
  changeSlippage,
  makeMaxAmountMessages,
}) => {
  const { t } = useTranslation();
  const [openedSetting, setOpenedSetting] = useState(false);

  return (
    <IncreaseSelectPositionWrapper>
      <div className="header-wrapper">
        <h5 className="enter-increase-amount">{t("IncreaseLiquidity:form.enterincreasingAmount.label")}</h5>
        <button className="setting-button" onClick={() => setOpenedSetting(true)}>
          <IconSettings className="setting-icon" />
        </button>
        {openedSetting && (
          <SettingMenuModal
            slippage={slippage}
            changeSlippage={changeSlippage}
            close={() => setOpenedSetting(false)}
            className="setting-modal"
          />
        )}
      </div>
      <div className="increase-amount-wrapper">
        {isDepositTokenA && (
          <TokenAmountInput
            {...tokenAAmountInput}
            token={tokenA}
            connected={connected}
            changeAmount={changeTokenAAmount}
            changeToken={() => {}}
            makeMaxAmountMessages={makeMaxAmountMessages?.("A")}
          />
        )}
        {isDepositTokenB && (
          <TokenAmountInput
            {...tokenBAmountInput}
            token={tokenB}
            connected={connected}
            changeAmount={changeTokenBAmount}
            changeToken={() => {}}
            makeMaxAmountMessages={makeMaxAmountMessages?.("B")}
          />
        )}
        {isDepositTokenA && isDepositTokenB && (
          <div className="arrow">
            <div className="shape">
              <IconAdd className="add-icon" />
            </div>
          </div>
        )}
      </div>
    </IncreaseSelectPositionWrapper>
  );
};

export default IncreaseAmountPosition;
