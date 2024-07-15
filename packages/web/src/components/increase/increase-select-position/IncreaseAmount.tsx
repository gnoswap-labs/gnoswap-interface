import IconAdd from "@components/common/icons/IconAdd";
import IconSettings from "@components/common/icons/IconSettings";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import React, { useState } from "react";
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
}) => {
  const [openedSetting, setOpenedSetting] = useState(false);
  return (
    <IncreaseSelectPositionWrapper>
      <div className="header-wrapper">
        <h5 className="enter-increase-amount">2. Enter Increasing Amount</h5>
        <button
          className="setting-button"
          onClick={() => setOpenedSetting(true)}
        >
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
            changeToken={() => { }}
          />
        )}
        {isDepositTokenB && (
          <TokenAmountInput
            {...tokenBAmountInput}
            token={tokenB}
            connected={connected}
            changeAmount={changeTokenBAmount}
            changeToken={() => { }}
          />
        )}
        {(isDepositTokenA && isDepositTokenB) && (
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
