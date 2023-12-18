import React, { useCallback, useMemo } from "react";
import { TokenAmountInputWrapper } from "./TokenAmountInput.styles";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { isAmount } from "@common/utils/data-check-util";
import SelectPairIncentivizeButton from "../select-pair-button/SelectPairIncentivizeButton";
import BigNumber from "bignumber.js";

export interface TokenAmountInputProps extends TokenAmountInputModel {
  changable?: boolean;
  changeToken: (token: TokenModel) => void;
  connected: boolean;
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  changable,
  token,
  amount,
  balance,
  usdValue,
  changeAmount,
  changeToken,
  connected,
}) => {

  const disabledSelectPair = useMemo(() => {
    return changable !== true;
  }, [changable]);

  const onChangeAmountInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== "" && !isAmount(value)) return;
    changeAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
  }, [changeAmount]);

  const handleFillBalance = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(balance.replace(/,/g, "")).toString();
      changeAmount(formatValue);
    }
  }, [changeAmount, connected, balance]);

  const balanceADisplay = useMemo(() => {
    if (connected && balance !== "-") {
      return BigNumber(balance.replace(/,/g, "")).toFormat(2);
    }
    return "-";
  }, [balance, connected]);

  return (
    <TokenAmountInputWrapper>
      <div className="amount">
        <input
          className="amount-text"
          type="number"
          value={amount}
          onChange={onChangeAmountInput}
          placeholder="0"
        />
        <div className="token">
          <SelectPairIncentivizeButton
            token={token}
            disabled={disabledSelectPair}
            changeToken={changeToken}
            isHiddenArrow={disabledSelectPair}
          />
        </div>
      </div>
      <div className="info">
        <span className="price-text disable-pointer ">{usdValue}</span>
        <span className={`balance-text ${!connected ? "disable-pointer" : ""}`} onClick={handleFillBalance}>Balance: {balanceADisplay}</span>
      </div>
    </TokenAmountInputWrapper>
  );
};

export default TokenAmountInput;