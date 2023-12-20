import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import { findNearPrice } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
  const divRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [changed, setChanged] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const tokenInfo = useMemo(() => {
    return `${token1Symbol} per ${token0Symbol}`;
  }, [token0Symbol, token1Symbol]);

  const disabledController = useMemo(() => {
    return value === "" ||
      value === "-" ||
      BigNumber(value).isNaN() ||
      value === "NaN" ||
      value === "0" ||
      value === "∞";
  }, [value]);

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
    if (value === "∞" || value === "-") {
      return;
    }
    const currentValue = BigNumber(Number(value.replace(",", "")));
    if (currentValue.isNaN()) {
      setValue("-");
      return;
    }
    if (currentValue.isLessThanOrEqualTo(0.00000001)) {
      setValue("0");
      return;
    }
    const nearPrice = findNearPrice(currentValue.toNumber(), tickSpacing);
    changePrice(nearPrice);
    if (nearPrice > 1) {
      setValue(numberToFormat(nearPrice, 4));
    } else {
      setValue(nearPrice.toString());
    }
    if (selectedFullRange) {
      onSelectCustomRange();
    }
  }, [changed, value, tickSpacing, selectedFullRange]);

  useEffect(() => {
    if (current === null || BigNumber(Number(current)).isNaN()) {
      setValue("-");
      return;
    }
    const currentValue = BigNumber(current).toNumber();
    if (currentValue < 0.00000001) {
      setValue("0");
      return;
    }
    const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
    if (currentValue <= minPrice) {
      setValue("0");
      return;
    }
    if (currentValue / maxPrice > 0.9) {
      setValue("∞");
      return;
    }
    if (currentValue >= 1) {
      setValue(BigNumber(current).toFixed(4));
      return;
    }
    setValue(BigNumber(current).toFixed());
  }, [current, feeTier]);
  useEffect(() => {
    const divElement = divRef.current;
    const inputElement = inputRef.current;
    
    if (divElement && inputElement) {
      setFontSize(Math.min(inputElement.offsetWidth * fontSize / divElement.offsetWidth, 24));
    }
  }, [value]);
  
  return (
    <SelectPriceRangeCutomControllerWrapper>
      <span className="title">{title}</span>
      <div className="controller-wrapper">
        <div className={disabledController ? "icon-wrapper decrease disabled" : "icon-wrapper decrease"} onClick={onClickDecrease}>
          <span>-</span>
        </div>
        <div className="value-wrapper">
          <input style={{ fontSize: `${fontSize}px` }} className="value" value={value === "NaN" ? "-" : value} onChange={onChangeValue} onBlur={onBlurUpdate} ref={inputRef}/>
          <div style={{ fontSize: `${fontSize}px` }} className="fake-input" ref={divRef}>{value}</div>
        </div>
        <div className={disabledController ? "icon-wrapper increase disabled" : "icon-wrapper increase"} onClick={onClickIncrease}>
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