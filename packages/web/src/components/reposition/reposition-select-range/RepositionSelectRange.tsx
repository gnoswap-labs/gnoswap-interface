import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import SelectPriceRangeReposition from "@components/common/select-price-range-reposition/SelectPriceRangeReposition";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback, useState } from "react";
import DepositRatio from "../deposit-ratio/DepositRatio";
import { RepositionSelectRangeWrapper } from "./RepositionSelectRange.styles";

export interface RepositionSelectRangeProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  selectPool: SelectPool;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
}

const RepositionSelectRange: React.FC<RepositionSelectRangeProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  selectPool,
  priceRange,
  priceRanges,
  changePriceRange,
}) => {
  const [openedPriceRange, setOpenedPriceRange] = useState(true);

  const togglePriceRange = useCallback(() => {
    tokenA && tokenB && setOpenedPriceRange(!openedPriceRange);
  }, [tokenA, tokenB, openedPriceRange]);

  return (
    <RepositionSelectRangeWrapper open={openedPriceRange}>
      <div className="header-wrapper" onClick={togglePriceRange}>
        <div className="header-wrapper-title">
          <h5>2. Select New Range</h5>
          {!openedPriceRange ? <IconArrowDown /> : <IconArrowUp />}
        </div>
        <Badge text="Custom" type={BADGE_TYPE.LINE} className="fee-tier-bad" />
      </div>
      <SelectPriceRangeReposition
        opened={openedPriceRange}
        defaultPrice={1000}
        tokenA={tokenA}
        tokenB={tokenB}
        priceRanges={priceRanges}
        priceRange={priceRange}
        changePriceRange={changePriceRange}
        changeStartingPrice={() => {}}
        selectPool={selectPool}
        showDim={false}
        handleSwapValue={() => {}}
        isEmptyLiquidity={true}
        isKeepToken={false}
      />
      <DepositRatio
        aprFee={aprFee}
        tokenA={tokenA}
        tokenB={tokenB}
        fee={fee}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        priceRangeSummary={priceRangeSummary}
      />
    </RepositionSelectRangeWrapper>
  );
};

export default RepositionSelectRange;
