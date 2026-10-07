import BigNumber from "bignumber.js";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import IconAdd from "@components/common/icons/IconAdd";
import IconRemove from "@components/common/icons/IconRemove";
import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { isNumber, subscriptFormat } from "@utils/number-utils";
import { convertToKMB, formatTokenExchangeRate } from "@utils/stake-position-utils";
import { findNearPrice } from "@utils/swap-utils";

import { PriceStepsWrapper } from "./PriceSteps.styles";

export interface PriceStepsProps {
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

export interface PriceStepsRef {
  formatData: () => void;
}

const PriceSteps = forwardRef<PriceStepsRef, PriceStepsProps>(
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

    const onChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const formattedValue = value.replace(/[^0-9.]/, "");
      setDisplayValue(formattedValue);
      setChanged(true);
    }, []);

    const formatControllerValue = useCallback(
      (value: number | null) => {
        if (value === null || BigNumber(Number(value)).isNaN()) {
          setDisplayValue("-");
          return;
        }

        const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
        const displayPrice = BigNumber(value).shiftedBy(priceRatio || 0);
        const currentValue = displayPrice.toNumber();

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
          setDisplayValue(greaterThan1Transform(displayPrice.toFixed()));
          return;
        }

        setDisplayValue(subscriptFormat(displayPrice.toFixed()));
      },
      [feeTier, priceRatio],
    );

    const onBlur = useCallback(() => {
      if (!changed) {
        return;
      }
      setChanged(false);
      const currentValue = BigNumber(displayValue).shiftedBy(-(priceRatio || 0));

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
      priceRatio,
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

      const displayPrice = BigNumber(current).shiftedBy(priceRatio || 0);
      const currentValue = displayPrice.toNumber();
      const { maxPrice, minPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];
      const maxPriceWithRatio = BigNumber(maxPrice)
        .shiftedBy(priceRatio || 0)
        .toNumber();
      const minPriceWithRatio = BigNumber(minPrice)
        .shiftedBy(priceRatio || 0)
        .toNumber();

      if (currentValue <= minPriceWithRatio) {
        return "0";
      }

      if (currentValue < 1 && currentValue !== 0) {
        return subscriptFormat(displayPrice.toFixed());
      }

      if (currentValue / maxPriceWithRatio > 0.9) {
        return "∞";
      }

      return formatTokenExchangeRate(displayPrice.toFixed(), {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    }, [current, feeTier, priceRatio]);

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
      if (current === null) {
        return displayValue;
      }

      const displayPrice = BigNumber(current).shiftedBy(priceRatio || 0);

      if (isNumber(displayPrice.toString()) && displayPrice.isGreaterThanOrEqualTo(1)) {
        return convertToKMB(displayPrice.toFixed(4));
      }

      if (!displayPrice.isZero()) {
        return subscriptFormat(displayPrice.toFixed());
      }

      return displayValue;
    }, [current, displayValue, priceRatio]);

    return (
      <PriceStepsWrapper>
        <span className="title">{title}</span>
        <div className="controller-wrapper">
          <div
            className={disabledController ? "icon-wrapper decrease disabled" : "icon-wrapper decrease"}
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
              autoComplete={"off"}
              spellCheck={"false"}
              inputMode={"decimal"}
            />
            <div style={{ fontSize: `${fontSize}px` }} className="fake-input">
              {ratioDisplay}
            </div>
          </div>
          <div
            className={disabledController ? "icon-wrapper increase disabled" : "icon-wrapper increase"}
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
      </PriceStepsWrapper>
    );
  },
);

PriceSteps.displayName = "PriceSteps";

export default PriceSteps;
