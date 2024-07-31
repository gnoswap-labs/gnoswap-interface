import { PriceRangeStr, PriceRangeTooltip } from "@constants/option.constant";
import React, { useCallback, useMemo } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  SelectPriceRangeItemWrapper,
  SelectPriceRangeWrapper,
  TooltipContentWrapper,
} from "./SelectPriceRangeReposition.styles";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { TokenModel } from "@models/token/token-model";
import { SelectPool } from "@hooks/pool/use-select-pool";
import SelectPriceRangeCustom from "../select-price-range-custom/SelectPriceRangeCustomPosition";
import { useTranslation } from "react-i18next";

interface SelectPriceRangeProps {
  opened: boolean;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage | null;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  changeStartingPrice: (price: string) => void;
  selectPool: SelectPool;
  showDim: boolean;
  defaultPrice: number | null;
  handleSwapValue: () => void;
  resetRange: () => void;
  isEmptyLiquidity: boolean;
  isKeepToken: boolean;
}

const SelectPriceRangeReposition: React.FC<SelectPriceRangeProps> = ({
  opened,
  tokenA,
  tokenB,
  priceRanges,
  priceRange,
  changePriceRange,
  changeStartingPrice,
  selectPool,
  showDim,
  defaultPrice,
  handleSwapValue,
  resetRange,
  isEmptyLiquidity,
  isKeepToken,
}) => {
  const { t } = useTranslation();

  const changePriceRangeWithClear = useCallback(
    (priceRange: AddLiquidityPriceRage) => {
      changePriceRange(priceRange);
    },
    [changePriceRange],
  );

  return (
    <SelectPriceRangeWrapper className={opened ? "open" : ""}>
      <div className="type-selector-wrapper">
        {priceRanges?.map((item, index) => (
          <SelectPriceRangeItem
            key={index}
            selected={item.type === priceRange?.type}
            tooltip={t(
              PriceRangeTooltip[selectPool.feeTier || "NONE"]?.[item.type] ||
                "",
            )}
            priceRangeStr={
              PriceRangeStr[selectPool.feeTier || "NONE"]?.[item.type]
            }
            priceRange={item}
            changePriceRange={changePriceRangeWithClear}
          />
        ))}
      </div>
      {tokenA && tokenB && (
        <SelectPriceRangeCustom
          tokenA={tokenA}
          tokenB={tokenB}
          selectPool={selectPool}
          changeStartingPrice={changeStartingPrice}
          priceRangeType={priceRange?.type || null}
          showDim={showDim}
          defaultPrice={defaultPrice}
          resetRange={resetRange}
          handleSwapValue={handleSwapValue}
          isEmptyLiquidity={isEmptyLiquidity}
          isKeepToken={isKeepToken}
        />
      )}
    </SelectPriceRangeWrapper>
  );
};

interface SelectPriceRangeItemProps {
  selected: boolean;
  priceRange: AddLiquidityPriceRage;
  tooltip: string | undefined;
  priceRangeStr: string;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
}

export const SelectPriceRangeItem: React.FC<SelectPriceRangeItemProps> = ({
  selected,
  priceRange,
  tooltip,
  changePriceRange,
  priceRangeStr,
}) => {
  const aprStr = useMemo(() => {
    const apr = priceRange.apr;
    if (apr) {
      return `${apr}%`;
    }
    return "-";
  }, [priceRange]);

  const onClickItem = useCallback(() => {
    changePriceRange(priceRange);
  }, [priceRange, changePriceRange]);

  return (
    <SelectPriceRangeItemWrapper
      className={selected ? "selected" : ""}
      onClick={onClickItem}
    >
      <strong className="item-title">{priceRange.type}</strong>
      {priceRange.text && <p>{priceRangeStr}</p>}
      {tooltip && (
        <div className="tooltip-wrap">
          <Tooltip
            placement="top"
            FloatingContent={
              <TooltipContentWrapper
                dangerouslySetInnerHTML={{ __html: tooltip }}
              ></TooltipContentWrapper>
            }
          >
            <IconInfo className="tooltip-icon" />
          </Tooltip>
        </div>
      )}

      {aprStr ? (
        <span className="apr">{aprStr}</span>
      ) : (
        <IconStrokeArrowRight className="arrow-icon" />
      )}
    </SelectPriceRangeItemWrapper>
  );
};

export default SelectPriceRangeReposition;
