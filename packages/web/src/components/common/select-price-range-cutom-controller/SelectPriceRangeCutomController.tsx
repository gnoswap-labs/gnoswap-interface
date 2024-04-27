import {
  PriceRangeType,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { numberToFormat } from "@utils/string-utils";
import { findNearPrice } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { SelectPriceRangeCutomControllerWrapper } from "./SelectPriceRangeCutomController.styles";
import IconAdd from "../icons/IconAdd";
import IconRemove from "../icons/IconRemove";
import { convertToKMB } from "@utils/stake-position-utils";
import { isNumber, subscriptFormat } from "@utils/number-utils";

export interface SelectPriceRangeCutomControllerProps {
  title: string;
  token0Symbol: string;
  token1Symbol: string;
  current: number | null;
  feeTier: SwapFeeTierType;
  tickSpacing?: number;
  selectedFullRange: boolean;
  onSelectCustomRange: () => void;
  changePrice: (price: number) => void;
  decrease: () => void;
  increase: () => void;
  currentPriceStr: JSX.Element | string;
  setIsChangeMinMax: (value: boolean) => void;
  priceRangeType: PriceRangeType | null;
}

export interface SelectPriceRangeCustomControllerRef {
  formatData: () => void;
}

const SelectPriceRangeCustomController = forwardRef<
  SelectPriceRangeCustomControllerRef, 
  SelectPriceRangeCutomControllerProps
>(({
  title,
  current,
  feeTier,
  tickSpacing = 2,
  changePrice,
  decrease,
  increase,
  selectedFullRange,
  onSelectCustomRange,
  setIsChangeMinMax,
  priceRangeType,
  token0Symbol,
  token1Symbol,
}, ref) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [changed, setChanged] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [currentValue, setCurrentValue] = useState("");
  const cachedFontSizeRef = useRef<number | null>(null);

  const disabledController = useMemo(() => {
    return (
      value === "" ||
      value === "-" ||
      BigNumber(value).isNaN() ||
      value === "NaN" ||
      value === "0" ||
      value === "∞"
    );
  }, [value]);

  const onClickDecrease = useCallback(() => {
    decrease();
    setIsChangeMinMax(true);
  }, [decrease, setIsChangeMinMax]);

  const onClickIncrease = useCallback(() => {
    increase();
    setIsChangeMinMax(true);
  }, [increase, setIsChangeMinMax]);

  const onChangeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      if (value !== newValue) {
        setChanged(true);
      }
    },
    [value],
  );

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
      setCurrentValue("-");
      return;
    }
    if (currentValue.isLessThanOrEqualTo(0.00000001)) {
      setValue("0");
      setCurrentValue("0");
      return;
    }
    const nearPrice = findNearPrice(currentValue.toNumber(), tickSpacing);
    changePrice(nearPrice);
    setIsChangeMinMax(true);
    if (nearPrice > 1) {
      setValue(numberToFormat(nearPrice, 4));
      setCurrentValue(numberToFormat(nearPrice, 4));
    } else {
      setValue(nearPrice.toString());
      setCurrentValue(nearPrice.toString());
    }
    if (selectedFullRange) {
      onSelectCustomRange();
    }
  }, [changed, value, tickSpacing, selectedFullRange, priceRangeType]);

  useImperativeHandle(ref, () => {
    return { formatData: () => setCurrentValue("") };
  }, []);

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
      setCurrentValue(BigNumber(current).toFixed(10));
      return;
    }
    setValue(BigNumber(current).toFixed(10));
    setCurrentValue(BigNumber(current).toFixed(10));
  }, [current, feeTier]);
  
  

  const exchangePrice = useMemo(() => {
    if (Number(value) < 1 && Number(value) !== 0) {
      return subscriptFormat(value);
    }
    
    if (value === "∞") {
      return value;
    }
    
    return convertToKMB(Number(value).toFixed(5));
  }, [value]);
    
      
  const priceValueString = (
    <>
      1 {token0Symbol} =&nbsp;{exchangePrice}&nbsp;{token1Symbol}
    </>
  );

  const transformValue = useMemo(() => {
    if(isNumber(currentValue) && Number(currentValue) >= 1) {
      return Number(value).toFixed(5);
    }  
    
    if(isNumber(currentValue) && Number(currentValue) < 1) {
      return subscriptFormat(currentValue);
    }
    
    if(value === "NaN") {
      title === "Min Price" && console.log("3");
      return "-";
    }
    
    return value;
  }, [currentValue, value]);

  useEffect(() => {
    const maxDefaultLength = 7;

    if(transformValue.length < maxDefaultLength) {
      setFontSize(24);
      return;
    }

    setFontSize((maxDefaultLength / transformValue.length) * 24);
  }, [transformValue]);

  return (
    <SelectPriceRangeCutomControllerWrapper>
      <span className="title">{title}</span>
      <div className="controller-wrapper">
        <div
          className={
            disabledController
              ? "icon-wrapper decrease disabled"
              : "icon-wrapper decrease"
          }
          onClick={onClickDecrease}
        >
          <span>
            <IconRemove />
          </span>
        </div>
        <div className="value-wrapper">
          <input
            style={{ fontSize: `${fontSize}px` }}
            className="value"
            value={transformValue}
            onChange={onChangeValue}
            onBlur={onBlurUpdate}
            ref={inputRef}
            onFocus={() => setCurrentValue("")}
          />
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="fake-input"
            ref={divRef}
          >
            {isNumber(currentValue) && Number(currentValue) > 1
              ? convertToKMB(Number(value).toFixed(4))
              : currentValue
              ? subscriptFormat(currentValue)
              : value}
          </div>
        </div>
        <div
          className={
            disabledController
              ? "icon-wrapper increase disabled"
              : "icon-wrapper increase"
          }
          onClick={onClickIncrease}
        >
          <span>
            <IconAdd />
          </span>
        </div>
      </div>

      <div className="token-info-wrapper">
        <span className="token-info">{priceValueString}</span>
      </div>
    </SelectPriceRangeCutomControllerWrapper>
  );
});

SelectPriceRangeCustomController.displayName = "SelectPriceRangeCustomController";

export default SelectPriceRangeCustomController;
