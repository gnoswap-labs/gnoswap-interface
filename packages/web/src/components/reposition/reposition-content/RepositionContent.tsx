import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import {
  INCREASE_BUTTON_TYPE,
  IPriceRange,
} from "@hooks/increase/use-increase-handle";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import BalanceChange from "../balance-change/BalanceChange";
import RepositionSelectPosition from "../reposition-select-position/RepositionSelectPosition";
import RepositionSelectRange from "../reposition-select-range/RepositionSelectRange";
import { ToolTipContentWrapper } from "../reposition-select-range/RepositionSelectRange.styles";
import { RepositionContentWrapper } from "./RepositionContent.styles";

interface RepositionContentProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
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
  slippage: string;
  changeSlippage: (value: string) => void;
  buttonType: INCREASE_BUTTON_TYPE;
  onSubmit: () => void;
  selectPool: SelectPool;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  currentAmounts: { amountA: number; amountB: number } | null;
  repositionAmounts: { amountA: number; amountB: number } | null;
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
}) => {
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
        />
      </article>

      <article>
        <BalanceChange
          tokenA={tokenA}
          tokenB={tokenB}
          currentAmounts={currentAmounts}
          repositionAmounts={repositionAmounts}
          isHiddenCurrentBalance={false}
        />
      </article>

      <Button
        onClick={onSubmit}
        text="Reposition"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </RepositionContentWrapper>
  );
};

export default RepositionContent;
