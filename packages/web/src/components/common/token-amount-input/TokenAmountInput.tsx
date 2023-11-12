import React, { useCallback, useMemo } from "react";
import { TokenAmountInputWrapper } from "./TokenAmountInput.styles";
import SelectPairButton from "../select-pair-button/SelectPairButton";
import BigNumber from "bignumber.js";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";

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
    const value = BigNumber(event.target.value).toString();
    changeAmount(value);
  }, [changeAmount]);

  const handleFillBalance = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(balance.replace(/,/g, "")).toString();
      changeAmount(formatValue);
    }
  }, [changeAmount, connected]);

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
          <SelectPairButton
            token={token}
            disabled={disabledSelectPair}
            changeToken={changeToken}
            isHiddenArrow={disabledSelectPair}
          />
        </div>
      </div>
      <div className="info">
        <span className="price-text">{usdValue}</span>
        <span className={`balance-text ${!connected ? "disable-pointer" : ""}`} onClick={handleFillBalance}>Balance: {balance}</span>
      </div>
    </TokenAmountInputWrapper>
  );
};

export default TokenAmountInput;