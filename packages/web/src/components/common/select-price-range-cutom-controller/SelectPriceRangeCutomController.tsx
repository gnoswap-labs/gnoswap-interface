import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SelectPriceRangeCutomControllerWrapper } from "./SelectPriceRangeCutomController.styles";

export interface SelectPriceRangeCutomControllerProps {
  title: string;
  token0Symbol: string;
  token1Symbol: string;
  current: number | null;
  feeTier: SwapFeeTierType
  tickSpacing?: number;
  selectedFullRange: boolean;
  onSelectCustomRange: () => void;
  changePrice: (price: number) => void;
  decrease: () => void;
  increase: () => void;
}

const SelectPriceRangeCutomController: React.FC<SelectPriceRangeCutomControllerProps> = ({
  title,
  token0Symbol,
  token1Symbol,
  current,
  feeTier,
  tickSpacing = 2,
  changePrice,
  decrease,
  increase,
  selectedFullRange,
  onSelectCustomRange,
}) => {
  const [value, setValue] = useState("");
  const [changed, setChanged] = useState(false);

  const tokenInfo = useMemo(() => {
    return `${token0Symbol} per ${token1Symbol}`;
  }, [token0Symbol, token1Symbol]);

  const onClickDecrease = useCallback(() => {
    decrease();
  }, [decrease]);

  const onClickIncrease = useCallback(() => {
    increase();
  }, [increase]);

  const onChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (value !== newValue) {
      setChanged(true);
    }
  }, [value]);

  const onBlurUpdate = useCallback(() => {
    if (!changed) {
      return;
    }
    setChanged(false);
    if (value === "∞") {
      return;
    }
    const currentValue = BigNumber(value.replace(",", ""));
    const nearTick = priceToNearTick(currentValue.toNumber(), tickSpacing);
    const price = tickToPrice(nearTick);
    changePrice(price);
    setValue(numberToFormat(price, 4));
    if (selectedFullRange) {
      onSelectCustomRange();
    }
  }, [value, tickSpacing, selectedFullRange]);

  useEffect(() => {
    if (current === null || Number.isNaN(current)) {
      setValue("-");
      return;
    }
    const currentValue = BigNumber(current).toNumber();
    const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
    if (currentValue <= minPrice) {
      setValue(numberToFormat(0, 4));
      return;
    }
    if (currentValue / maxPrice > 0.9) {
      setValue("∞");
      return;
    }
    setValue(numberToFormat(current, 4));
  }, [current, feeTier]);

  return (
    <SelectPriceRangeCutomControllerWrapper>
      <span className="title">{title}</span>
      <div className="controller-wrapper">
        <div className="icon-wrapper decrease" onClick={onClickDecrease}>
          <span>-</span>
        </div>
        <div className="value-wrapper">
          <input className="value" value={value === "NaN" ? "-" : value} onChange={onChangeValue} onBlur={onBlurUpdate} />
        </div>
        <div className="icon-wrapper increase" onClick={onClickIncrease}>
          <span>+</span>
        </div>
      </div>

      <div className="token-info-wrapper">
        <span className="token-info">{tokenInfo}</span>
      </div>
    </SelectPriceRangeCutomControllerWrapper>
  );
};
export default SelectPriceRangeCutomController;