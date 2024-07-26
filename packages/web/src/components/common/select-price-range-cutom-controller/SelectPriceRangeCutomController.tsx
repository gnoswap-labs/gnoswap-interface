import {
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { findNearPrice } from "@utils/swap-utils";
import BigNumber from "bignumber.js";
import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { SelectPriceRangeCutomControllerWrapper } from "./SelectPriceRangeCutomController.styles";
import IconAdd from "../icons/IconAdd";
import IconRemove from "../icons/IconRemove";
import {
  convertToKMB,
  formatTokenExchangeRate,
} from "@utils/stake-position-utils";
import { isNumber, subscriptFormat } from "@utils/number-utils";

export interface SelectPriceRangeCustomControllerProps {
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
  setIsChangeMinMax: (value: boolean) => void;
  priceRatio?: number;
}

export interface SelectPriceRangeCustomControllerRef {
  formatData: () => void;
}

const SelectPriceRangeCustomController = forwardRef<
  SelectPriceRangeCustomControllerRef,
  SelectPriceRangeCustomControllerProps
>(
  (
    {
      title,
      current,
      feeTier,
      tickSpacing = 1,
      changePrice,
      decrease,
      increase,
      selectedFullRange,
      onSelectCustomRange,
      setIsChangeMinMax,
      token0Symbol,
      token1Symbol,
      priceRatio,
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState("");
    const [changed, setChanged] = useState(false);
    const [fontSize, setFontSize] = useState(24);

    const submitCountRef = useRef(0);

    const disabledController = useMemo(() => {
      return (
        displayValue === "" ||
        displayValue === "-" ||
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
        const value = event.target.value;
        const formattedValue = value.replace(/[^0-9.]/, "");
        setDisplayValue(formattedValue);
        setChanged(true);
      },
      [],
    );

    const formatControllerValue = useCallback(
      (value: number | null) => {
        if (value === null || BigNumber(Number(value)).isNaN()) {
          setDisplayValue("-");
          return;
        }

        const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
        const currentValue = BigNumber(value)
          .shiftedBy(priceRatio || 0)
          .toNumber();

        const minPriceWithRatio = BigNumber(minPrice)
          .shiftedBy(priceRatio || 0)
          .toNumber();

        const maxPriceWithRatio = BigNumber(maxPrice)
          .shiftedBy(priceRatio || 0)
          .toNumber();

        if (currentValue <= minPriceWithRatio) {
          setDisplayValue("0");
          return;
        }
        if (currentValue / maxPriceWithRatio > 0.9) {
          setDisplayValue("∞");
          return;
        }
        if (currentValue >= 1) {
          setDisplayValue(greaterThan1Transform(BigNumber(value).toFixed()));
          return;
        }

        setDisplayValue(subscriptFormat(BigNumber(value).toFixed()));
      },
      [feeTier, priceRatio, selectedFullRange],
    );

    const onBlur = useCallback(() => {
      if (!changed) {
        return;
      }
      setChanged(false);
      const currentValue = BigNumber(Number(displayValue));

      const nearPrice = findNearPrice(currentValue.toNumber(), tickSpacing);

      if (nearPrice !== current) {
        changePrice(nearPrice);
      } else {
        formatControllerValue(nearPrice);
      }
      submitCountRef.current = submitCountRef.current++;
      setIsChangeMinMax(true);

      if (selectedFullRange) {
        onSelectCustomRange();
      }
    }, [
      changed,
      displayValue,
      tickSpacing,
      current,
      setIsChangeMinMax,
      selectedFullRange,
      changePrice,
      formatControllerValue,
      onSelectCustomRange,
    ]);

    useImperativeHandle(
      ref,
      () => {
        return {
          formatData: () => {
            return;
          },
        };
      },
      [],
    );

    useEffect(() => {
      formatControllerValue(current);
    }, [current, formatControllerValue]);

    const exchangePrice = useMemo(() => {
      if (current === null || BigNumber(Number(current)).isNaN()) {
        return "-";
      }

      const currentValue = BigNumber(current).toNumber();
      const { maxPrice, minPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];

      if (currentValue <= minPrice) {
        return "0";
      }

      if (currentValue < 1 && currentValue !== 0) {
        return subscriptFormat(BigNumber(current).toFixed());
      }

      if (currentValue / maxPrice > 0.9) {
        return "∞";
      }

      return formatTokenExchangeRate(current, {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    }, [current, feeTier]);

    const priceValueString = (
      <>
        1 {token0Symbol} =&nbsp;{exchangePrice}&nbsp;{token1Symbol}
      </>
    );

    function greaterThan1Transform(numStr: string) {
      return formatTokenExchangeRate(numStr, {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    }

    useEffect(() => {
      const maxDefaultLength = 7;

      if (displayValue.length < maxDefaultLength) {
        setFontSize(24);
        return;
      }

      setFontSize((maxDefaultLength / displayValue.length) * 24);
    }, [displayValue]);

    const ratioDisplay = useMemo(() => {
      if (isNumber(current ?? "") && Number(current) >= 1) {
        return convertToKMB(Number(current).toFixed(4));
      }

      if (current) {
        return subscriptFormat(current);
      }

      return displayValue;
    }, [current, displayValue]);

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
            />
            <div style={{ fontSize: `${fontSize}px` }} className="fake-input">
              {ratioDisplay}
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
  },
);

SelectPriceRangeCustomController.displayName =
  "SelectPriceRangeCustomController";

export default SelectPriceRangeCustomController;
