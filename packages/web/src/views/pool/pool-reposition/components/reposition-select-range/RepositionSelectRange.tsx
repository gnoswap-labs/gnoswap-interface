import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import SelectPriceRangeReposition from "@components/common/select-price-range/SelectPriceRangeReposition";
import {
  PriceRangeMeta,
  RANGE_STATUS_OPTION,
} from "@constants/option.constant";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";

import DepositRatio from "../deposit-ratio/DepositRatio";
import { RepositionSelectRangeWrapper } from "./RepositionSelectRange.styles";

export interface RepositionSelectRangeProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  selectPool: SelectPool;
  priceRanges: PriceRangeMeta[];
  priceRange: PriceRangeMeta;
  changePriceRange: (priceRange: PriceRangeMeta) => void;
  resetRange: () => void;
  isLoadingPosition: boolean;
}

const RepositionSelectRange: React.FC<RepositionSelectRangeProps> = ({
  tokenA,
  tokenB,
  fee,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  selectPool,
  priceRange,
  priceRanges,
  changePriceRange,
  resetRange,
  isLoadingPosition,
}) => {
  const { t } = useTranslation();
  const [openedPriceRange, setOpenedPriceRange] = useState(true);

  const togglePriceRange = useCallback(() => {
    if (tokenA && tokenB) setOpenedPriceRange(!openedPriceRange);
  }, [tokenA, tokenB, openedPriceRange]);

  return (
    <RepositionSelectRangeWrapper open={openedPriceRange}>
      <div className="header-wrapper" onClick={togglePriceRange}>
        <div className="header-wrapper-title">
          <h5>{t("Reposition:form.selectRange.title")}</h5>
          {!openedPriceRange ? <IconArrowDown /> : <IconArrowUp />}
        </div>
        <Badge
          text={priceRange.type}
          type={BADGE_TYPE.LINE}
          className="fee-tier-bad"
        />
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
        resetRange={resetRange}
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
        rangeStatus={rangeStatus}
        priceRangeSummary={priceRangeSummary}
        isLoadingPosition={isLoadingPosition}
        selectPool={selectPool}
      />
    </RepositionSelectRangeWrapper>
  );
};

export default RepositionSelectRange;
