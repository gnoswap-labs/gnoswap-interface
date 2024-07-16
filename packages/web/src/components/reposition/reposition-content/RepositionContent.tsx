import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import BalanceChange from "../balance-change/BalanceChange";
import RepositionSelectPosition from "../reposition-select-position/RepositionSelectPosition";
import RepositionSelectRange from "../reposition-select-range/RepositionSelectRange";
import { ToolTipContentWrapper } from "../reposition-select-range/RepositionSelectRange.styles";
import { RepositionContentWrapper } from "./RepositionContent.styles";
import { REPOSITION_BUTTON_TYPE } from "@hooks/reposition/use-reposition-handle";

interface RepositionContentProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
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
  buttonType: REPOSITION_BUTTON_TYPE;
  onSubmit: () => void;
  selectPool: SelectPool;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  currentAmounts: { amountA: string; amountB: string } | null;
  repositionAmounts: { amountA: string | null; amountB: string | null } | null;
  selectedPosition: PoolPositionModel | null;
  isLoadingPosition: boolean;
}

const RepositionContent: React.FC<RepositionContentProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  onSubmit,
  selectPool,
  priceRange,
  priceRanges,
  changePriceRange,
  currentAmounts,
  repositionAmounts,
  selectedPosition,
  isLoadingPosition,
  buttonType,
}) => {
  const submitButtonText = useMemo(() => {
    if (buttonType === "INSUFFICIENT_LIQUIDITY") {
      return "Insufficient Liquidity";
    }
    if (buttonType === "NON_SELECTED_RANGE") {
      return "Select Range";
    }
    return "Reposition";
  }, [buttonType]);

  const isSubmit = useMemo(() => {
    return buttonType === "REPOSITION";
  }, [buttonType]);

  return (
    <RepositionContentWrapper>
      <div className="resposition-content-header">
        <h3>Reposition</h3>
        <Tooltip
          placement="top"
          FloatingContent={
            <ToolTipContentWrapper>
              This will remove this position and create a new one with the
              underlying tokens by swapping them proportionally to the new
              range.
            </ToolTipContentWrapper>
          }
        >
          <IconInfo />
        </Tooltip>
      </div>
      <article>
        <RepositionSelectPosition
          aprFee={aprFee}
          tokenA={tokenA}
          tokenB={tokenB}
          fee={fee}
          minPriceStr={minPriceStr}
          maxPriceStr={maxPriceStr}
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
          minPriceStr={minPriceStr}
          maxPriceStr={maxPriceStr}
          rangeStatus={rangeStatus}
          priceRangeSummary={priceRangeSummary}
          selectPool={selectPool}
          priceRanges={priceRanges}
          priceRange={priceRange}
          changePriceRange={changePriceRange}
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
