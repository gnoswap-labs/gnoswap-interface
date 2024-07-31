import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import {
  INCREASE_BUTTON_TYPE,
  IPriceRange,
} from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import IncreaseAmountPosition from "../increase-select-position/IncreaseAmount";
import IncreaseSelectPosition from "../increase-select-position/IncreaseSelectPosition";
import { IncreaseLiquidityWrapper } from "./IncreaseLiquidity.styles";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { useTranslation } from "react-i18next";

interface IncreaseLiquidityProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  connected: boolean;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  changeTokenAAmount: (amount: string) => void;
  changeTokenBAmount: (amount: string) => void;
  slippage: number;
  changeSlippage: (value: number) => void;
  buttonType: INCREASE_BUTTON_TYPE;
  onSubmit: () => void;
}

const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  connected,
  isDepositTokenA,
  isDepositTokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  changeTokenAAmount,
  changeTokenBAmount,
  slippage,
  changeSlippage,
  buttonType,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const activatedSubmit = useMemo(() => {
    switch (buttonType) {
      case "INCREASE_LIQUIDITY":
        return true;
      default:
        return false;
    }
  }, [buttonType]);
  const textButton = useMemo(() => {
    switch (buttonType) {
      case "INCREASE_LIQUIDITY":
        return t("IncreaseLiquidity:btn.increaseLiquidity");
      case "INSUFFICIENT_BALANCE":
        return t("IncreaseLiquidity:btn.insufficientBalance");
      case "ENTER_AMOUNT":
      default:
        return t("IncreaseLiquidity:btn.enterAmount");
    }
  }, [buttonType, t]);

  return (
    <IncreaseLiquidityWrapper>
      <h3>{t("IncreaseLiquidity:title")}</h3>
      <article>
        <IncreaseSelectPosition
          aprFee={aprFee}
          tokenA={tokenA}
          tokenB={tokenB}
          fee={fee}
          minPriceStr={minPriceStr}
          maxPriceStr={maxPriceStr}
          rangeStatus={rangeStatus}
          priceRangeSummary={priceRangeSummary}
        />
      </article>
      <article>
        <IncreaseAmountPosition
          tokenA={tokenA}
          tokenB={tokenB}
          connected={connected}
          isDepositTokenA={isDepositTokenA}
          isDepositTokenB={isDepositTokenB}
          changeTokenBAmount={changeTokenBAmount}
          tokenAAmountInput={tokenAAmountInput}
          tokenBAmountInput={tokenBAmountInput}
          changeTokenAAmount={changeTokenAAmount}
          changeSlippage={changeSlippage}
          slippage={slippage}
        />
      </article>
      <Button
        onClick={activatedSubmit ? onSubmit : undefined}
        disabled={!activatedSubmit}
        text={textButton}
        style={{
          hierarchy: activatedSubmit
            ? ButtonHierarchy.Primary
            : ButtonHierarchy.Gray,

          fullWidth: true,
        }}
        className={"button-confirm"}
      />
    </IncreaseLiquidityWrapper>
  );
};

export default IncreaseLiquidity;
