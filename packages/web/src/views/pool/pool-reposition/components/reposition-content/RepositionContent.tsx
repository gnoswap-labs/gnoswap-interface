import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  PriceRangeMeta,
  RANGE_STATUS_OPTION,
} from "@constants/option.constant";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";

import {
  IPriceRange,
  REPOSITION_BUTTON_TYPE,
} from "../../hooks/use-reposition-handle";
import BalanceChange from "../balance-change/BalanceChange";
import RepositionSelectPosition from "../reposition-select-position/RepositionSelectPosition";
import RepositionSelectRange from "../reposition-select-range/RepositionSelectRange";

import {
  RepositionContentWrapper,
  ToolTipContentWrapper,
} from "./RepositionContent.styles";

interface RepositionContentProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
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
  buttonType: REPOSITION_BUTTON_TYPE;
  onSubmit: () => void;
  selectPool: SelectPool;
  priceRanges: PriceRangeMeta[];
  priceRange: PriceRangeMeta;
  changePriceRange: (priceRange: PriceRangeMeta) => void;
  resetRange: () => void;
  currentAmounts: { amountA: string; amountB: string } | null;
  repositionAmounts: { amountA: string | null; amountB: string | null } | null;
  selectedPosition: PoolPositionModel | null;
  isLoadingPosition: boolean;
  isSkipSwap: boolean;
}

const RepositionContent: React.FC<RepositionContentProps> = ({
  tokenA,
  tokenB,
  fee,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  onSubmit,
  selectPool,
  priceRange,
  priceRanges,
  changePriceRange,
  resetRange,
  currentAmounts,
  repositionAmounts,
  selectedPosition,
  isLoadingPosition,
  buttonType,
  isSkipSwap,
}) => {
  const { t } = useTranslation();

  const submitButtonText = useMemo(() => {
    if (buttonType === "INSUFFICIENT_LIQUIDITY") {
      return t("Reposition:btn.insuffLiqui");
    }
    if (buttonType === "NON_SELECTED_RANGE") {
      return t("Reposition:btn.selectRange");
    }
    return t("Reposition:title");
  }, [buttonType, t]);

  const isSubmit = useMemo(() => {
    if (buttonType === "LOADING" && isSkipSwap) {
      return true;
    }
    return buttonType === "REPOSITION";
  }, [buttonType, isSkipSwap]);

  return (
    <RepositionContentWrapper>
      <div className="resposition-content-header">
        <h3>{t("Reposition:title")}</h3>
        <Tooltip
          placement="top"
          FloatingContent={
            <ToolTipContentWrapper>
              {t("Reposition:tooltip")}
            </ToolTipContentWrapper>
          }
        >
          <IconInfo />
        </Tooltip>
      </div>
      <article>
        <RepositionSelectPosition
          tokenA={tokenA}
          tokenB={tokenB}
          fee={fee}
          rangeStatus={rangeStatus}
          priceRangeSummary={priceRangeSummary}
          selectedPosition={selectedPosition}
          isLoadingPosition={isLoadingPosition}
        />
      </article>
      <article>
        <RepositionSelectRange
          aprFee={aprFee}
          tokenA={tokenA}
          tokenB={tokenB}
          fee={fee}
          rangeStatus={rangeStatus}
          priceRangeSummary={priceRangeSummary}
          selectPool={selectPool}
          priceRanges={priceRanges}
          priceRange={priceRange}
          changePriceRange={changePriceRange}
          resetRange={resetRange}
          isLoadingPosition={isLoadingPosition}
        />
      </article>

      <article>
        <BalanceChange
          tokenA={tokenA}
          tokenB={tokenB}
          currentAmounts={currentAmounts}
          repositionAmounts={repositionAmounts}
          isHiddenCurrentBalance={false}
          isLoadingPosition={isLoadingPosition}
          selectPool={selectPool}
        />
      </article>

      <Button
        onClick={onSubmit}
        text={submitButtonText}
        style={{
          hierarchy: isSubmit ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
          fullWidth: true,
        }}
        disabled={!isSubmit}
        className="button-confirm"
      />
    </RepositionContentWrapper>
  );
};

export default RepositionContent;
