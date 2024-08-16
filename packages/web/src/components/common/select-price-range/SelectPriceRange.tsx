import React, { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  DefaultTick,
  PriceRangeStr,
  PriceRangeTooltip,
  PriceRangeType
} from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";
import { isFetchedPools } from "@states/pool";

import SelectPriceRangeCustom from "./select-price-range-custom/SelectPriceRangeCustom";

import {
  SelectPriceRangeItemWrapper,
  SelectPriceRangeWrapper,
  TooltipContentWrapper
} from "./SelectPriceRange.styles";

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
  isEmptyLiquidity: boolean;
  isKeepToken: boolean;
  setPriceRange: (type?: PriceRangeType) => void;
  resetPriceRangeTypeTarget: PriceRangeType;
  defaultTicks?: DefaultTick;
  isLoadingSelectPriceRange: boolean;
}

const SelectPriceRange: React.FC<SelectPriceRangeProps> = ({
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
  isEmptyLiquidity,
  isKeepToken,
  setPriceRange,
  resetPriceRangeTypeTarget,
  defaultTicks,
  isLoadingSelectPriceRange,
}) => {
  const { t } = useTranslation();

  const selectPriceRangeRef =
    useRef<React.ElementRef<typeof SelectPriceRangeCustom>>(null);
  const selectedTokenPair = true;

  const changePriceRangeWithClear = useCallback(
    (priceRange: AddLiquidityPriceRage) => {
      changePriceRange(priceRange);
      selectPriceRangeRef.current?.resetRange(priceRange.type);
    },
    [changePriceRange],
  );

  return (
    <SelectPriceRangeWrapper className={opened ? "open" : ""}>
      {!selectPool.isCreate && !showDim && (
        <div className="type-selector-wrapper">
          {priceRanges.map((item, index) => (
            <SelectPriceRangeItem
              key={index}
              selected={item.type === priceRange?.type}
              tooltip={t(
                PriceRangeTooltip[selectPool.feeTier || "NONE"][item.type] ||
                  "",
              )}
              priceRange={{
                ...item,
                text: PriceRangeStr[selectPool.feeTier || "NONE"][item.type],
              }}
              changePriceRange={changePriceRangeWithClear}
            />
          ))}
        </div>
      )}
      {selectedTokenPair && tokenA && tokenB && isFetchedPools && (
        <SelectPriceRangeCustom
          tokenA={tokenA}
          tokenB={tokenB}
          selectPool={selectPool}
          changeStartingPrice={changeStartingPrice}
          priceRangeType={priceRange?.type || null}
          showDim={showDim}
          defaultPrice={defaultPrice}
          handleSwapValue={handleSwapValue}
          isEmptyLiquidity={isEmptyLiquidity}
          isKeepToken={isKeepToken}
          setPriceRange={setPriceRange}
          defaultTicks={defaultTicks}
          resetPriceRangeTypeTarget={resetPriceRangeTypeTarget}
          ref={selectPriceRangeRef}
          isLoadingSelectPriceRange={isLoadingSelectPriceRange}
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
  const { t } = useTranslation();

  const priceRangeDisplay = useMemo(() => {
    switch (priceRange.type) {
      case "Active":
        return t("business:priceRangeType.active");
      case "Passive":
        return t("business:priceRangeType.passive");
      case "Custom":
        return t("business:priceRangeType.custom");
    }
  }, [priceRange.type, t]);

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
      <strong className="item-title">{priceRangeDisplay}</strong>
      {priceRange.text && <p>{priceRange.text}</p>}
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

export default SelectPriceRange;
