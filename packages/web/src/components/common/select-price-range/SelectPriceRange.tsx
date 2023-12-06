import { PriceRangeTooltip } from "@constants/option.constant";
import React, { useCallback, useMemo } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Tooltip from "@components/common/tooltip/Tooltip";
import { SelectPriceRangeItemWrapper, SelectPriceRangeWrapper, TooltipContentWrapper } from "./SelectPriceRange.styles";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import SelectPriceRangeCustom from "../select-price-range-custom/SelectPriceRangeCustom";
import { TokenModel } from "@models/token/token-model";
import { SelectPool } from "@hooks/pool/use-select-pool";

interface SelectPriceRangeProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage | null;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  changeStartingPrice: (price: string) => void;
  selectPool: SelectPool
}

const SelectPriceRange: React.FC<SelectPriceRangeProps> = ({
  tokenA,
  tokenB,
  priceRanges,
  priceRange,
  changePriceRange,
  changeStartingPrice,
  selectPool
}) => {
  const selectedTokenPair = true;

  const changePriceRangeWithClear = useCallback((priceRange: AddLiquidityPriceRage) => {
    changePriceRange(priceRange);
  }, [changePriceRange]);

  return (
    <SelectPriceRangeWrapper>
      <div className="type-selector-wrapper">
        {priceRanges.map((item, index) => (
          <SelectPriceRangeItem
            key={index}
            selected={item.type === priceRange?.type}
            tooltip={PriceRangeTooltip[selectPool.feeTier || "NONE"][item.type]}
            priceRange={item}
            changePriceRange={changePriceRangeWithClear}
          />
        ))}
      </div>
      {(selectedTokenPair && tokenA && tokenB) && (
        <SelectPriceRangeCustom
          tokenA={tokenA}
          tokenB={tokenB}
          selectPool={selectPool}
          changeStartingPrice={changeStartingPrice}
          priceRangeType={priceRange?.type || null}
        />
      )}
    </SelectPriceRangeWrapper>
  );
};

interface SelectPriceRangeItemProps {
  selected: boolean;
  priceRange: AddLiquidityPriceRage;
  tooltip: string | undefined;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
}

export const SelectPriceRangeItem: React.FC<SelectPriceRangeItemProps> = ({
  selected,
  priceRange,
  tooltip,
  changePriceRange,
}) => {

  const aprStr = useMemo(() => {
    const apr = priceRange.apr;
    if (apr) {
      return `${apr}%`;
    }
    if (priceRange.type === "Custom") {
      return null;
    }
    return "-";
  }, [priceRange]);

  const onClickItem = useCallback(() => {
    changePriceRange(priceRange);
  }, [priceRange, changePriceRange]);

  return (
    <SelectPriceRangeItemWrapper className={selected ? "selected" : ""} onClick={onClickItem}>
      <strong className="item-title">{priceRange.type}</strong>
      {tooltip && (
        <div className="tooltip-wrap">
          <Tooltip
            placement="top"
            FloatingContent={<TooltipContentWrapper dangerouslySetInnerHTML={{ __html: tooltip }}></TooltipContentWrapper>}
          >
            <IconInfo className="tooltip-icon" />
          </Tooltip>
        </div>
      )}

      {aprStr ?
        <span className="apr">{aprStr}</span> :
        <IconStrokeArrowRight className="arrow-icon" />
      }
    </SelectPriceRangeItemWrapper>
  );
};

export default SelectPriceRange;
