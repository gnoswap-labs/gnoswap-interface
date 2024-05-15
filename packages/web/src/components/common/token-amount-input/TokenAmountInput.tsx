import React, { useCallback, useMemo } from "react";
import { TokenAmountInputWrapper } from "./TokenAmountInput.styles";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { isAmount } from "@common/utils/data-check-util";
import SelectPairIncentivizeButton from "../select-pair-button/SelectPairIncentivizeButton";
import BigNumber from "bignumber.js";
import { DEFAULT_CONTRACT_USE_FEE, DEFAULT_GAS_FEE } from "@common/values";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { cutDecimalNumberWithoutRounding } from "@utils/regex";

export interface TokenAmountInputProps extends TokenAmountInputModel {
  changable?: boolean;
  changeToken: (token: TokenModel) => void;
  connected: boolean;
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  changable,
  token,
  balance,
  usdValue,
  changeAmount,
  changeToken,
  connected,
  amount,
}) => {
  const disabledSelectPair = useMemo(() => {
    return changable !== true;
  }, [changable]);

  const onChangeAmountInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value !== "" && !isAmount(value)) return;
    const formattedValue = value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1");
    changeAmount(formattedValue);
  }, [changeAmount]);

  const handleFillBalance = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(balance.replace(/,/g, "")).toString();
      if (token && isNativeToken(token)) {
        const nativeFullBalance = BigNumber(formatValue)
          .minus(makeDisplayTokenAmount(token, DEFAULT_CONTRACT_USE_FEE + DEFAULT_GAS_FEE) || 0)
          .toString();
        changeAmount(nativeFullBalance);
      } else {
        changeAmount(BigNumber(formatValue).toString());
      }
    }
  }, [connected, balance, token, changeAmount]);

  const balanceADisplay = useMemo(() => {
    if (connected && balance !== "-") {
      if (balance === "0") return 0;

      const result = BigNumber((balance.replace(/,/g, "")
        .toString().match(cutDecimalNumberWithoutRounding(2)))?.toString() ?? 0).toFormat();

      return result;
    }
    return "-";
  }, [balance, connected, token?.decimals]);

  return (
    <TokenAmountInputWrapper>
      <div className="amount">
        <input
          value={amount}
          className="amount-text"
          type="number"
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