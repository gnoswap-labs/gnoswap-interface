import { PriceRangeTooltip, PriceRangeType } from "@constants/option.constant";
import React, { useCallback, useMemo } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Tooltip from "@components/common/tooltip/Tooltip";
import { SelectPriceRangeItemWrapper, SelectPriceRangeWrapper } from "./SelectPriceRange.styles";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";

interface SelectPriceRangeProps {
  priceRangeMap: { [key in PriceRangeType]: AddLiquidityPriceRage | undefined };
  priceRange: PriceRangeType | undefined;
  selectPriceRange: (priceRange: PriceRangeType) => void;
}

const PRICE_RANGE_ORDERS: PriceRangeType[] = ["Active", "Passive", "Custom"];

const SelectPriceRange: React.FC<SelectPriceRangeProps> = ({
  priceRangeMap,
  priceRange,
  selectPriceRange,
}) => {

  return (
    <SelectPriceRangeWrapper>
      <div className="type-selector-wrapper">
        {PRICE_RANGE_ORDERS.map((priceRangeType, index: number) => (
          <SelectPriceRangeItem
            key={index}
            selected={priceRangeType === priceRange}
            tooltip={PriceRangeTooltip[priceRangeType]}
            priceRage={priceRangeType}
            selectPriceRange={selectPriceRange}
            apr={priceRangeMap[priceRangeType]?.apr}
          />
        ))}
      </div>
    </SelectPriceRangeWrapper>
  );
};

interface SelectPriceRangeItemProps {
  selected: boolean;
  priceRage: PriceRangeType;
  tooltip: string | undefined;
  apr: string | undefined;
  selectPriceRange: (priceRange: PriceRangeType) => void;
}

export const SelectPriceRangeItem: React.FC<SelectPriceRangeItemProps> = ({
  selected,
  priceRage,
  tooltip,
  apr,
  selectPriceRange,
}) => {

  const aprStr = useMemo(() => {
    if (apr) {
      return `${apr}%`;
    }
    if (priceRage === "Custom") {
      return null;
    }
    return "-";
  }, [apr, priceRage]);

  const onClickItem = useCallback(() => {
    selectPriceRange(priceRage);
  }, [priceRage, selectPriceRange]);

  return (
    <SelectPriceRangeItemWrapper className={selected ? "selected" : ""} onClick={onClickItem}>
      <strong className="item-title">{priceRage}</strong>
      {tooltip && (
        <div className="tooltip-wrap">
          <Tooltip
            placement="top"
            FloatingContent={<p className="tooltip-content">{tooltip}</p>}
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
