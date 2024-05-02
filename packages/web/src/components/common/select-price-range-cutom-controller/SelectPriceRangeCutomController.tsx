import {
  PriceRangeType,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
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
  const [displayValue, setDisplayValue] = useState("");
  const [changed, setChanged] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  const disabledController = useMemo(() => {
    return (
      displayValue === "" ||
      displayValue === "-" ||
      BigNumber(displayValue).isNaN() ||
      displayValue === "NaN" ||
      displayValue === "0" ||
      displayValue === "∞"
    );
  }, [displayValue]);

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
      setDisplayValue(newValue);
      if (displayValue !== newValue) {
        setChanged(true);
      }
    },
    [displayValue],
  );

  const onBlur = useCallback(() => {
    if (!changed) {
      return;
    }
    setChanged(false);
    const currentValue = BigNumber(Number(displayValue.replace(",", "")));
   
    const nearPrice = findNearPrice(currentValue.toNumber(), tickSpacing);
    changePrice(nearPrice);
    setIsChangeMinMax(true);

    if (selectedFullRange) {
      onSelectCustomRange();
    }
  }, [changed, displayValue, tickSpacing, selectedFullRange, priceRangeType]);

  useImperativeHandle(ref, () => {
    return { formatData: () => {
      return;
    }};
  }, []);

  useEffect(() => {
    if (current === null || BigNumber(Number(current)).isNaN()) {
      setDisplayValue("-");
      return;
    }
    const currentValue = BigNumber(current).toNumber();
    if (currentValue < 0.00000001) {
      setDisplayValue("0");
      return;
    }
    const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
    if (currentValue <= minPrice) {
      setDisplayValue("0");
      return;
    }
    if (currentValue / maxPrice > 0.9) {
      setDisplayValue("∞");
      return;
    }
    if (currentValue >= 1) {
      setDisplayValue(greaterThan1Transform(BigNumber(current).toFixed()));
      return;
    }
    
    setDisplayValue(subscriptFormat(BigNumber(current).toFixed()));
  }, [current, feeTier]);
  

  const exchangePrice = useMemo(() => {
    if (Number(displayValue) < 1 && Number(displayValue) !== 0) {
      return subscriptFormat(displayValue);
    }
    
    if (displayValue === "∞") {
      return displayValue;
    }
    
    return convertToKMB(Number(displayValue).toFixed(5));
  }, [displayValue]);
    
      
  const priceValueString = (
    <>
      1 {token0Symbol} =&nbsp;{exchangePrice}&nbsp;{token1Symbol}
    </>
  );

  function greaterThan1Transform(numStr: string) {
    const number = Number(numStr);

    const significantNumber = 5;
      const [intPart] = numStr.split(".");

    if(intPart.length >= significantNumber) {
      const originalNumber = number;
      const digitCountRatio = Math.pow(10, intPart.length - significantNumber);

      const numberWith5SignificantNumber = (Math.round(originalNumber / digitCountRatio) * digitCountRatio).toString();

      return numberWith5SignificantNumber;
    }

    return number.toFixed(significantNumber - intPart.length);
  }

  useEffect(() => {
    const maxDefaultLength = 7;

    if(displayValue.length < maxDefaultLength) {
      setFontSize(24);
      return;
    }

    setFontSize((maxDefaultLength / displayValue.length) * 24);
  }, [displayValue]);

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
            value={displayValue}
            onChange={onChangeValue}
            onBlur={onBlur}
            ref={inputRef}
          />
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="fake-input"
            ref={divRef}
          >
            {isNumber(current ?? "") && Number(current) > 1
              ? convertToKMB(Number(displayValue).toFixed(4))
              : current
              ? subscriptFormat(current)
              : displayValue}
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
