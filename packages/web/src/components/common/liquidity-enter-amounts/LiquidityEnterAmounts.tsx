import React, { useMemo } from "react";
import IconAdd from "../icons/IconAdd";
import { LiquidityEnterAmountsWrapper } from "./LiquidityEnterAmounts.styles";
import TokenAmountInput from "../token-amount-input/TokenAmountInput";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";

interface LiquidityEnterAmountsProps {
  compareToken: TokenModel | null;
  depositRatio: number | null;
  tokenAInput: TokenAmountInputModel;
  tokenBInput: TokenAmountInputModel;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  connected: boolean;
  changeTokenAAmount: (amount: string) => void;
  changeTokenBAmount: (amount: string) => void;
}

const LiquidityEnterAmounts: React.FC<LiquidityEnterAmountsProps> = ({
  compareToken,
  depositRatio,
  tokenAInput,
  tokenBInput,
  changeTokenA,
  changeTokenB,
  connected,
  changeTokenAAmount,
  changeTokenBAmount,
}) => {
  console.log("🚀 234234 ~ tokenAInput:", tokenAInput.token?.path);
  console.log("🚀 234234 ~ compareToken:", compareToken?.path);
  const isSelectTokenA = useMemo(() => {
    if (compareToken?.path === null || tokenAInput?.token?.path === null) {
      return null;
    }
    return (compareToken?.path !== tokenAInput.token?.path);
  }, [compareToken?.path, tokenAInput.token]);
  console.log("🚀 ~ isSelectTokenA ~ isSelectTokenA:", isSelectTokenA);

  const visibleTokenA = useMemo(() => {
    if (isSelectTokenA === null || depositRatio === null) {
      return true;
    }
    return isSelectTokenA ? depositRatio <= 0 : depositRatio >= 100;
  }, [depositRatio, isSelectTokenA]);

  const visibleTokenB = useMemo(() => {
    if (isSelectTokenA === null || depositRatio === null) {
      return true;
    }
    return isSelectTokenA ? depositRatio >= 100 : depositRatio <= 0;
  }, [depositRatio, isSelectTokenA]);

  return (
    <LiquidityEnterAmountsWrapper>
      {
        (depositRatio === 0 || depositRatio === 100) ? (
          <React.Fragment>
            {visibleTokenA && (
              <TokenAmountInput {...tokenAInput} connected={connected} changeToken={changeTokenA} changeAmount={changeTokenAAmount} />
            )}
            {visibleTokenB && (
              <TokenAmountInput {...tokenBInput} connected={connected} changeToken={changeTokenB} changeAmount={changeTokenBAmount} />
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TokenAmountInput key={tokenAInput.token?.path} {...tokenAInput} connected={connected} changeToken={changeTokenA} changeAmount={changeTokenAAmount} />
            <TokenAmountInput key={tokenBInput.token?.path}  {...tokenBInput} connected={connected} changeToken={changeTokenB} changeAmount={changeTokenBAmount} />
            <div className="arrow">
              <div className="shape">
                <IconAdd className="add-icon" />
              </div>
            </div>
          </React.Fragment>
        )
      }
    </LiquidityEnterAmountsWrapper>
  );
};

export default LiquidityEnterAmounts;
