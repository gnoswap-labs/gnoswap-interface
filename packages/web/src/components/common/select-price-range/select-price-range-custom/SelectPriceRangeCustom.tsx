import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";

import { ZOOL_VALUES } from "@constants/graph.constant";
import {
  DefaultTick,
  PriceRangeType,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierPriceRange,
} from "@constants/option.constant";
import { MAX_TICK } from "@constants/swap.constant";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { priceToTick, tickToPrice } from "@utils/swap-utils";

import IconAdd from "../../icons/IconAdd";
import IconKeyboardArrowLeft from "../../icons/IconKeyboardArrowLeft";
import IconKeyboardArrowRight from "../../icons/IconKeyboardArrowRight";
import IconRefresh from "../../icons/IconRefresh";
import IconRemove from "../../icons/IconRemove";
import IconSwap from "../../icons/IconSwap";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import PoolSelectionGraph from "../../pool-selection-graph/PoolSelectionGraph";
import SelectTab from "../../select-tab/SelectTab";
import PriceSteps from "./price-steps/PriceSteps";
import StartingPrice from "./starting-price/StartingPrice";

import {
  SelectPriceRangeCustomWrapper
} from "./SelectPriceRangeCustom.styles";

export interface SelectPriceRangeCustomProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  priceRangeType: PriceRangeType | null;
  selectPool: SelectPool;
  changeStartingPrice: (price: string) => void;
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

export interface SelectPriceRangeCustomHandle {
  resetRange: (priceRangeType?: PriceRangeType | null) => void;
}

const SelectPriceRangeCustom = forwardRef<
  SelectPriceRangeCustomHandle,
  SelectPriceRangeCustomProps
>(
  (
    {
      tokenA,
      tokenB,
      priceRangeType,
      selectPool,
      changeStartingPrice,
      showDim,
      defaultPrice,
      handleSwapValue,
      isEmptyLiquidity,
      isKeepToken,
      resetPriceRangeTypeTarget,
      setPriceRange,
      defaultTicks,
      isLoadingSelectPriceRange,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const { getGnotPath } = useGnotToGnot();
    const [shiftPosition, setShiftPosition] = useState(0);
    const GRAPH_WIDTH = 388;
    const GRAPH_HEIGHT = 160;
    const [startingPriceValue, setStartingPriceValue] = useState<string>("");
    const minPriceRangeCustomRef =
      useRef<React.ElementRef<typeof PriceSteps>>(null);
    const maxPriceRangeCustomRef =
      useRef<React.ElementRef<typeof PriceSteps>>(null);

    const isCustom = true;

    const isLoading = useMemo(
      () => selectPool.renderState() === "LOADING" || isLoadingSelectPriceRange,
      [selectPool.renderState, isLoadingSelectPriceRange],
    );

    const availSelect =
      Array.isArray(selectPool.liquidityOfTickPoints) &&
      selectPool.renderState() === "DONE";

    const flip = useMemo(() => {
      const compareTokenPaths = [
        checkGnotPath(tokenA.path),
        checkGnotPath(tokenB.path),
      ].sort();
      return (
        compareTokenPaths[0] !== checkGnotPath(selectPool.compareToken?.path || "")
      );
    }, [
      selectPool.compareToken,
      tokenA.path,
      tokenB.path,
    ]);

    const currentPriceStr = useMemo(() => {
      if (!selectPool.currentPrice) {
        return "-";
      }

      const currentPrice = (() => {
        if (selectPool.compareToken?.path === tokenA.path) {
          return (
            10 ** ((tokenB.decimals || 0) - (tokenA.decimals || 0)) *
            selectPool.currentPrice
          );
        }

        return (
          10 ** ((tokenA.decimals || 0) - (tokenB.decimals || 0)) *
          selectPool.currentPrice
        );
      })();

      return (
        <>
          1 {tokenA.symbol} =&nbsp;
          {formatTokenExchangeRate(currentPrice, {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })}
          &nbsp;
          {tokenB.symbol}
        </>
      );
    }, [
      selectPool.compareToken?.path,
      selectPool.currentPrice,
      tokenA.symbol,
      tokenA.decimals,
      tokenA.path,
      tokenB.symbol,
      tokenB.decimals,
    ]);

    useImperativeHandle(ref, () => {
      return { resetRange };
    });

    const onClickTabItem = useCallback(
      (symbol: string) => {
        const compareToken = tokenA.symbol === symbol ? tokenA : tokenB;
        selectPool.setCompareToken(compareToken);
        const { minPosition, maxPosition } = selectPool;
        if (minPosition !== null) {
          selectPool.setMaxPosition(1 / minPosition);
        }
        if (maxPosition !== null) {
          selectPool.setMinPosition(1 / maxPosition);
        }
        handleSwapValue();
      },
      [selectPool, tokenA, tokenB, handleSwapValue],
    );

    const selectFullRange = useCallback(() => {
      selectPool.selectFullRange();
      setShiftPosition(0);
    }, [selectPool]);

    function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
      const currentPriceRangeType = inputPriceRangeType || priceRangeType;
      const currentPrice = selectPool.isCreate
        ? selectPool.startPrice
        : selectPool.currentPrice;
      const { tickLower, tickUpper } = defaultTicks ?? {};
      const { minPrice, maxPrice } =
        SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];

      if (inputPriceRangeType === "Custom" && tickLower && tickUpper) {
        selectPool.setMinPosition(tickLower < minPrice ? minPrice : tickLower);
        selectPool.setMaxPosition(tickUpper > maxPrice ? maxPrice : tickUpper);
        return;
      }

      if (currentPrice && selectPool.feeTier && currentPriceRangeType) {
        const priceRange =
          SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];

        const getPriceWithTickSpacing = (range: number) => {
          const rangeDiffAmount = currentPrice * (range / 100);
          const currentTick = priceToTick(currentPrice + rangeDiffAmount);
          const nearTick =
            Math.round(currentTick / selectPool.tickSpacing) *
            selectPool.tickSpacing;
          return tickToPrice(nearTick);
        };

        const priceLower = getPriceWithTickSpacing(priceRange.min);
        const priceUpper = getPriceWithTickSpacing(priceRange.max);
        selectPool.setMinPosition(
          priceLower < minPrice ? minPrice : priceLower,
        );
        selectPool.setMaxPosition(
          priceUpper > maxPrice ? maxPrice : priceUpper,
        );
        return;
      }
    }

    useEffect(() => {
      if (selectPool.selectedFullRange) {
        setPriceRange("Custom");
      }
    }, [selectPool.selectedFullRange]);

    function resetRange(priceRangeType?: PriceRangeType | null) {
      selectPool.resetRange();
      setShiftPosition(0);
      initPriceRange(priceRangeType);
    }

    const onSelectCustomRangeByMin = useCallback(() => {
      selectPool.setFullRange(false);
      selectPool.setMaxPosition(tickToPrice(MAX_TICK));
    }, [selectPool]);

    const onSelectCustomRangeByMax = useCallback(() => {
      selectPool.setFullRange(false);
      selectPool.setMinPosition(0);
    }, [selectPool]);

    const availZoomIn = useMemo(() => {
      return selectPool.zoomLevel < ZOOL_VALUES.length - 1;
    }, [selectPool.zoomLevel]);

    const availZoomOut = useMemo(() => {
      return selectPool.zoomLevel > 0;
    }, [selectPool.zoomLevel]);

    const availMoveLeft = useMemo(() => {
      if (!selectPool.bins) {
        return false;
      }
      const moveRange = selectPool.bins.length / 2 - 20;
      return shiftPosition + moveRange > 0;
    }, [selectPool.bins, shiftPosition]);

    const availMoveRight = useMemo(() => {
      if (!selectPool.bins) {
        return false;
      }
      const moveRange = selectPool.bins.length / 2 - 20;
      return moveRange - shiftPosition > 0;
    }, [selectPool.bins, shiftPosition]);

    const zoomIn = useCallback(() => {
      if (!availZoomIn) {
        return;
      }
      selectPool.zoomIn();
      setShiftPosition(0);
    }, [availZoomIn, selectPool]);

    const zoomOut = useCallback(() => {
      if (!availZoomOut) {
        return;
      }
      selectPool.zoomOut();
      setShiftPosition(0);
    }, [availZoomOut, selectPool]);

    const moveLeft = useCallback(() => {
      if (!availMoveLeft) {
        return;
      }
      setShiftPosition(value => value - 1);
    }, [availMoveLeft]);

    const moveRight = useCallback(() => {
      if (!availMoveRight) {
        return;
      }
      setShiftPosition(value => value + 1);
    }, [availMoveRight]);

    useEffect(() => {
      selectPool.setCompareToken(tokenA);
    }, [tokenA]);

    useEffect(() => {
      resetRange(priceRangeType);
    }, [selectPool.poolPath, selectPool.feeTier, selectPool.startPrice]);

    useEffect(() => {
      if (!selectPool.poolPath) {
        changeStartingPrice(startingPriceValue);
      }
    }, [selectPool.poolPath, startingPriceValue]);

    useEffect(() => {
      if (selectPool.selectedFullRange) {
        minPriceRangeCustomRef.current?.formatData();
        maxPriceRangeCustomRef.current?.formatData();
      }
    }, [
      selectPool.selectedFullRange,
      selectPool.minPrice,
      selectPool.maxPrice,
    ]);

    const selectTokenPair = useMemo(() => {
      if (!isKeepToken) {
        return [getGnotPath(tokenB).symbol, getGnotPath(tokenA).symbol];
      }

      return [getGnotPath(tokenA).symbol, getGnotPath(tokenB).symbol];
    }, [tokenA, tokenB, isKeepToken]);

    const decimalsRatio = useMemo(
      () => tokenB.decimals - tokenA.decimals || 0,
      [tokenA.decimals, tokenB.decimals],
    );

    if (selectPool.renderState() === "NONE") {
      return <></>;
    }

    if (!selectPool.isCreate && !isCustom) {
      return <></>;
    }

    return (
      <>
        {selectPool.isCreate && (
          <StartingPrice
            tokenASymbol={tokenA.symbol || ""}
            tokenBSymbol={tokenB.symbol || ""}
            isEmptyLiquidity={isEmptyLiquidity}
            defaultPrice={defaultPrice}
            startingPriceValue={startingPriceValue}
            setStartingPriceValue={setStartingPriceValue}
            changeStartingPrice={changeStartingPrice}
          />
        )}
        <SelectPriceRangeCustomWrapper>
          {(isCustom || selectPool.isCreate || showDim) && (
            <React.Fragment>
              {(availSelect || showDim) && (
                <div className="option-wrapper">
                  <SelectTab
                    selectType={
                      getGnotPath(selectPool.compareToken)?.symbol || ""
                    }
                    list={selectTokenPair}
                    onClick={onClickTabItem}
                  />
                  <div className="button-option-contaier">
                    <div className="graph-option-wrapper">
                      <span
                        className={`graph-option-item decrease ${
                          isLoading || showDim || !availMoveLeft
                            ? "disabled-option"
                            : ""
                        }`}
                        onClick={moveLeft}
                      >
                        <IconKeyboardArrowLeft />
                      </span>
                      <span
                        className={`graph-option-item increase ${
                          isLoading || showDim || !availMoveRight
                            ? "disabled-option"
                            : ""
                        }`}
                        onClick={moveRight}
                      >
                        <IconKeyboardArrowRight />
                      </span>
                    </div>
                    <div className="graph-option-wrapper">
                      <span
                        className={`graph-option-item decrease ${
                          isLoading || showDim || !availZoomOut
                            ? "disabled-option"
                            : ""
                        }`}
                        onClick={zoomOut}
                      >
                        <IconRemove />
                      </span>
                      <span
                        className={`graph-option-item increase ${
                          isLoading || showDim || !availZoomIn
                            ? "disabled-option"
                            : ""
                        }`}
                        onClick={zoomIn}
                      >
                        <IconAdd />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectPool.renderState(true) === "LOADING" && (
                <div className="loading-wrapper">
                  <LoadingSpinner />
                </div>
              )}

              {!isLoading && (showDim || availSelect) && (
                <React.Fragment>
                  {!showDim && (
                    <div className="current-price-wrapper">
                      <span>{t("business:currentPrice")}</span>
                      <span
                        style={{ wordBreak: "break-all", textAlign: "center" }}
                      >
                        {currentPriceStr}
                      </span>
                    </div>
                  )}
                  {showDim && (
                    <div className="pool-initialization">
                      <span>{t("AddPosition:form.priceRange.dim.title")}</span>
                      <div>
                        <Trans
                          i18nKey={"AddPosition:form.priceRange.dim.content"}
                          components={{ bold: <span className="bold" /> }}
                        />
                      </div>
                    </div>
                  )}
                  {!showDim && (
                    <div className="range-graph-wrapper">
                      <PoolSelectionGraph
                        tokenA={tokenA}
                        tokenB={tokenB}
                        bins={selectPool.bins || []}
                        feeTier={selectPool.feeTier || "NONE"}
                        tickSpacing={selectPool.tickSpacing || 1}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                        position="top"
                        offset={selectPool.bins?.length}
                        price={selectPool.currentPrice || 1}
                        flip={flip}
                        fullRange={selectPool.selectedFullRange}
                        zoomLevel={selectPool.zoomLevel}
                        minPrice={selectPool.minPrice}
                        maxPrice={selectPool.maxPrice}
                        setMinPrice={selectPool.setMinPosition}
                        setMaxPrice={selectPool.setMaxPosition}
                        shiftIndex={shiftPosition}
                        onFinishMove={() => setPriceRange("Custom")}
                      />
                    </div>
                  )}
                  <div className="rangge-content-wrapper">
                    <div className="range-controller-wrapper">
                      <PriceSteps
                        title={t("AddPosition:form.priceRange.minPrice")}
                        current={selectPool.minPrice}
                        token0Symbol={tokenA.symbol}
                        token1Symbol={tokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMin}
                        changePrice={tick => selectPool.setMinPosition(tick)}
                        decrease={() => selectPool.decreaseMinTick()}
                        increase={() => selectPool.increaseMinTick()}
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
                        ref={minPriceRangeCustomRef}
                        priceRatio={decimalsRatio}
                      />
                      <PriceSteps
                        title={t("AddPosition:form.priceRange.maxPrice")}
                        current={selectPool.maxPrice}
                        token0Symbol={tokenA.symbol}
                        token1Symbol={tokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMax}
                        changePrice={tick => selectPool.setMaxPosition(tick)}
                        decrease={() => selectPool.decreaseMaxTick()}
                        increase={() => selectPool.increaseMaxTick()}
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
                        ref={maxPriceRangeCustomRef}
                        priceRatio={decimalsRatio}
                      />
                    </div>
                    <div className="extra-wrapper">
                      <div
                        className="icon-button reset"
                        onClick={() => {
                          setPriceRange(resetPriceRangeTypeTarget);
                          resetRange(resetPriceRangeTypeTarget);
                        }}
                      >
                        <IconRefresh />
                        <span>{t("common:reset")}</span>
                      </div>
                      <div
                        className="icon-button full"
                        onClick={selectFullRange}
                      >
                        <IconSwap />
                        <span>
                          {t("AddPosition:form.priceRange.fullPrice")}
                        </span>
                      </div>
                    </div>
                    {showDim && <div className="dim-content-3" />}
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </SelectPriceRangeCustomWrapper>
      </>
    );
  },
);

SelectPriceRangeCustom.displayName = "SelectPriceRangeCustom";

export default SelectPriceRangeCustom;
