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
}) => {
  return (
    <RepositionContentWrapper>
      <div className="resposition-content-header">
        <h3>Reposition</h3>
        <Tooltip
          placement="top"
          FloatingContent={
            <ToolTipContentWrapper>
              Suggested starting price based on the current price of the most
              liquid pool in the same pair.
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
