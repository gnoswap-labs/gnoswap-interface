import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import IconRefresh from "../icons/IconRefresh";
import IconSwap from "../icons/IconSwap";
import SelectPriceRangeCustomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import { SelectPriceRangeCustomWrapper, StartingPriceWrapper, TooltipContentWrapper } from "./SelectPriceRangeCustom.styles";
import PoolSelectionGraph from "../pool-selection-graph/PoolSelectionGraph";
import { TokenModel } from "@models/token/token-model";
import { SelectPool } from "@hooks/pool/use-select-pool";
import * as d3 from "d3";
import { DefaultTick, PriceRangeType, SwapFeeTierPriceRange } from "@constants/option.constant";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { tickToPrice } from "@utils/swap-utils";
import { MAX_TICK } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import { numberToFormat } from "@utils/string-utils";
import IconRemove from "../icons/IconRemove";
import IconAdd from "../icons/IconAdd";
import { convertToKMB } from "@utils/stake-position-utils";
import IconKeyboardArrowLeft from "../icons/IconKeyboardArrowLeft";
import IconKeyboardArrowRight from "../icons/IconKeyboardArrowRight";
import IconInfo from "../icons/IconInfo";
import Tooltip from "../tooltip/Tooltip";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import ExchangeRate from "../exchange-rate/ExchangeRate";
import { subscriptFormat } from "@utils/number-utils";

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

const SelectPriceRangeCustom = forwardRef<SelectPriceRangeCustomHandle, SelectPriceRangeCustomProps>(({
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
}, ref) => {
  const { getGnotPath } = useGnotToGnot();
  const GRAPH_WIDTH = 388;
  const GRAPH_HEIGHT = 160;
  const [startingPriceValue, setStartingPriceValue] = useState<string>("");
  const [tempPrice, setTempPrice] = useState<string>("");
  const minPriceRangeCustomRef = useRef<React.ElementRef<typeof SelectPriceRangeCustomController>>(null);
  const maxPriceRangeCustomRef = useRef<React.ElementRef<typeof SelectPriceRangeCustomController>>(null);

  const getPriceRange = useCallback((price?: number | null) => {
    const currentPriceRangeType = priceRangeType;
    const currentPrice = price || selectPool.currentPrice || 1;
    if (!selectPool.feeTier || !currentPriceRangeType) {
      return [0, currentPrice * 2];
    }
    const visibleRate = SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType].max / 100;
    const range = currentPrice * visibleRate;

    return [currentPrice - range, currentPrice + range];
  }, [priceRangeType, selectPool.currentPrice, selectPool.feeTier]);

  const getScaleRange = useCallback(() => {
    const currentPrice = selectPool.currentPrice || 1;
    const [min, max] = getPriceRange();
    const rangeGap = max - min;

    return [currentPrice - rangeGap, currentPrice + rangeGap];
  }, [getPriceRange, selectPool.currentPrice]);

  const getHeightRange = useCallback(() => {
    const [, maxY] = d3.extent(selectPool.liquidityOfTickPoints.map(point => point[1]));
    return [0, maxY || 0];
  }, [selectPool.liquidityOfTickPoints]);

  /** D3 Variables */
  const defaultScaleX = useMemo(() => d3
    .scaleLinear()
    .domain(getScaleRange())
    .range([0, GRAPH_WIDTH]),
    [getScaleRange]
  );

  const scaleX = defaultScaleX.copy();

  const scaleY = useMemo(() => d3
    .scaleLinear()
    .domain(getHeightRange())
    .range([GRAPH_HEIGHT, 0]),
    [getHeightRange]
  );

  const isCustom = true;

  const isLoading = useMemo(() => selectPool.renderState() === "LOADING" || isLoadingSelectPriceRange, [selectPool.renderState, isLoadingSelectPriceRange]);

  const availSelect = Array.isArray(selectPool.liquidityOfTickPoints) && selectPool.renderState() === "DONE";

  const comparedTokenA = selectPool.compareToken?.symbol !== tokenB.symbol;

  const currentTokenA = useMemo(() => {
    return comparedTokenA ? getGnotPath(tokenA) : getGnotPath(tokenB);
  }, [comparedTokenA, tokenA, tokenB]);

  const currentTokenB = useMemo(() => {
    return comparedTokenA ? getGnotPath(tokenB) : getGnotPath(tokenA);
  }, [comparedTokenA, tokenA, tokenB]);

  const currentPriceStr = useMemo(() => {
    if (!selectPool.currentPrice) {
      return "-";
    }

    if (selectPool.currentPrice > 1) {
      return <>1 {currentTokenA.symbol} =&nbsp;{convertToKMB(selectPool.currentPrice.toString())}&nbsp;{currentTokenB.symbol}</>;
    }

    return <>1 {currentTokenA.symbol} =&nbsp;{subscriptFormat(selectPool.currentPrice)}&nbsp;{currentTokenB.symbol}</>;
  }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

  useImperativeHandle(ref, () => {
    return { resetRange };
  });

  const currentPriceStrReverse = useMemo(() => {
    if (!selectPool.currentPrice) {
      return "-";
    }
    const currentPrice = convertToKMB((1 / selectPool.currentPrice).toString(), { maximumFractionDigits: 4 });
    return `1 ${currentTokenB.symbol} = ${currentPrice} ${currentTokenA.symbol}`;
  }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

  const startingPriceDescription = useMemo(() => {
    if (!currentTokenA || !currentTokenB) {
      return "";
    }
    if (startingPriceValue === "" || BigNumber(startingPriceValue).isNaN()) {
      if (!defaultPrice || !selectPool.isCreate) {
        return "";
      }
      return <>1 {currentTokenA.symbol} = &nbsp;<ExchangeRate value={numberToFormat(defaultPrice, 4)} />&nbsp;{currentTokenB.symbol}</>;
    }
    return <>1 {currentTokenA.symbol} =&nbsp;<ExchangeRate value={startingPriceValue} />&nbsp; {currentTokenB.symbol}</>;
  }, [currentTokenA, currentTokenB, defaultPrice, selectPool.isCreate, startingPriceValue]);

  const onClickTabItem = useCallback((symbol: string) => {
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
  }, [selectPool, tokenA, tokenB, handleSwapValue]);

  const selectFullRange = useCallback(() => {
    selectPool.selectFullRange();
  }, [selectPool]);

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    const currentPriceRangeType = inputPriceRangeType || priceRangeType;
    const currentPrice = selectPool.isCreate ? selectPool.startPrice : selectPool.currentPrice;
    const { tickLower, tickUpper } = defaultTicks ?? {};

    if (inputPriceRangeType === "Custom" && tickLower && tickUpper) {
      selectPool.setMinPosition(tickLower);
      selectPool.setMaxPosition(tickUpper);
      return;
    }
    if (currentPrice && selectPool.feeTier && currentPriceRangeType) {
      const priceRange = SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];
      const minRateAmount = currentPrice * (priceRange.min / 100);
      const maxRateAmount = currentPrice * (priceRange.max / 100);
      selectPool.setMinPosition(currentPrice + minRateAmount);
      selectPool.setMaxPosition(currentPrice + maxRateAmount);
      return;
    }
  }

  function adjustRangeManually(adjustFn: () => void) {
    adjustFn();
  }

  useEffect(() => {
    if (selectPool.selectedFullRange) {
      setPriceRange("Custom");
    }
  }, [selectPool.selectedFullRange]);

  function resetRange(priceRangeType?: PriceRangeType | null) {
    selectPool.resetRange();
    initPriceRange(priceRangeType);
    defaultScaleX.domain(getScaleRange());
    scaleX.domain(defaultScaleX.domain());
  }

  const onChangeStartingPrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStartingPriceValue(value);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      changeStartingPrice(startingPriceValue);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [startingPriceValue]);

  const updateStartingPrice = useCallback(() => {
    if (startingPriceValue === "" || !Number(startingPriceValue)) {
      setStartingPriceValue("");
      changeStartingPrice("");
      return;
    }
    setTempPrice(startingPriceValue);
    changeStartingPrice(startingPriceValue);
  }, [startingPriceValue]);

  const finishMove = useCallback(() => {
    // Considering whether to adjust ticks at the end of a graph event 
  }, [selectPool]);

  const onSelectCustomRangeByMin = useCallback(() => {
    selectPool.setFullRange(false);
    selectPool.setMaxPosition(tickToPrice(MAX_TICK));
  }, [selectPool]);

  const onSelectCustomRangeByMax = useCallback(() => {
    selectPool.setFullRange(false);
    selectPool.setMinPosition(0);
  }, [selectPool]);

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
  }, [selectPool.poolPath, priceRangeType]);

  useEffect(() => {
    if (selectPool.selectedFullRange) {
      minPriceRangeCustomRef.current?.formatData();
      maxPriceRangeCustomRef.current?.formatData();
    }
  }, [selectPool.selectedFullRange, selectPool.minPrice, selectPool.maxPrice]);


  useEffect(() => {
    if (selectPool.currentPrice) {
      selectPool.setFocusPosition(scaleX(selectPool.currentPrice));
    }
    if (selectPool.isCreate && selectPool.startPrice !== null) {
      selectPool.setFocusPosition(scaleX(Number(selectPool.startPrice)));
    }
  }, [selectPool.currentPrice, selectPool.startPrice]);


  const selectTokenPair = useMemo(() => {
    if (isKeepToken) {
      return [getGnotPath(tokenB).symbol, getGnotPath(tokenA).symbol];
    }

    return [getGnotPath(tokenA).symbol, getGnotPath(tokenB).symbol];
  }, [tokenA, tokenB, isKeepToken]);

  if (selectPool.renderState() === "NONE") {
    return <></>;
  }

  if (!selectPool.isCreate && !isCustom) {
    return <></>;
  }

  return (
    <>
      {
        selectPool.isCreate && (
          <StartingPriceWrapper className="starting-price-wrapper">
            <div className="title-wrapper">
              <span className="sub-title">Starting Price</span>
              <div className="price-info">
                {!startingPriceValue && !isEmptyLiquidity && <Tooltip placement="top" FloatingContent={<TooltipContentWrapper>Suggested starting price based on the current price of the most liquid pool in the same pair.</TooltipContentWrapper>}>
                  <IconInfo />
                </Tooltip>}
                <span className="description">{startingPriceDescription}</span>
              </div>
            </div>
            <input
              className="starting-price-input"
              value={tempPrice ? subscriptFormat(tempPrice) : startingPriceValue}
              onChange={onChangeStartingPrice}
              onBlur={updateStartingPrice}
              onFocus={() => setTempPrice("")}
              placeholder="Enter price"
            />
          </StartingPriceWrapper>
        )
      }
      <SelectPriceRangeCustomWrapper>
        {
          (isCustom || selectPool.isCreate || showDim) && (
            <React.Fragment>
              {(availSelect || showDim) && (
                <div className="option-wrapper">
                  <SelectTab
                    selectType={getGnotPath(selectPool.compareToken)?.symbol || ""}
                    list={selectTokenPair}
                    onClick={onClickTabItem}
                  />
                  <div className="button-option-contaier">
                    <div className="graph-option-wrapper">
                      <span className={`graph-option-item decrease ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomIn}>
                        <IconKeyboardArrowLeft />
                      </span>
                      <span className={`graph-option-item increase ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomOut}>
                        <IconKeyboardArrowRight />
                      </span>
                    </div>
                    <div className="graph-option-wrapper">
                      <span className={`graph-option-item decrease ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomIn}>
                        <IconRemove />
                      </span>
                      <span className={`graph-option-item increase ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomOut}>
                        <IconAdd />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(selectPool.renderState(true) === "LOADING") && (
                <div className="loading-wrapper">
                  <LoadingSpinner />
                </div>
              )}

              {!isLoading && (showDim || availSelect) && (
                <React.Fragment>
                  {!showDim && <div className="current-price-wrapper">
                    <span>Current Price</span>
                    <span>{currentPriceStr}</span>
                  </div>}
                  {showDim && <div className="pool-initialization">
                    <span>Pool Initialization</span>
                    <div>As the first person to Add Position to this pool, you must initialize it. <span>Enter a starting price</span> for the pool, then select the price range and the deposit amount for your liquidity. Please note that <span>gas fees will be higher</span> than usual due to the initialization transaction.</div>
                  </div>}
                  {!showDim && <div className="range-graph-wrapper">
                    <PoolSelectionGraph
                      feeTier={selectPool.feeTier}
                      scaleX={scaleX}
                      scaleY={scaleY}
                      selectedFullRange={selectPool.selectedFullRange}
                      zoomLevel={selectPool.zoomLevel}
                      minPrice={selectPool.minPrice}
                      maxPrice={selectPool.maxPrice}
                      setMinPrice={(tick) => adjustRangeManually(() => selectPool.setMinPosition(tick))}
                      setMaxPrice={(tick) => adjustRangeManually(() => selectPool.setMaxPosition(tick))}
                      liquidityOfTickPoints={selectPool.liquidityOfTickPoints}
                      currentPrice={selectPool.currentPrice ? Number(selectPool.currentPrice) : null}
                      focusPosition={selectPool.focusPosition}
                      width={GRAPH_WIDTH}
                      height={GRAPH_HEIGHT}
                      finishMove={finishMove}
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
                    />
                  </div>}
                  <div className="rangge-content-wrapper">
                    <div className="range-controller-wrapper">
                      <SelectPriceRangeCustomController
                        title="Min Price"
                        current={selectPool.minPrice}
                        token0Symbol={currentTokenA.symbol}
                        token1Symbol={currentTokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMin}
                        changePrice={(tick) => adjustRangeManually(() => selectPool.setMinPosition(tick))}
                        decrease={() => adjustRangeManually(() => selectPool.decreaseMinTick())}
                        increase={() => adjustRangeManually(() => selectPool.increaseMinTick())}
                        currentPriceStr={currentPriceStr}
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
                        // priceRangeType={priceRangeType}
                        ref={minPriceRangeCustomRef}
                        priceRatio={tokenA.decimals / tokenB.decimals}

                      />
                      <SelectPriceRangeCustomController
                        title="Max Price"
                        current={selectPool.maxPrice}
                        token0Symbol={currentTokenA.symbol}
                        token1Symbol={currentTokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMax}
                        changePrice={(tick) => adjustRangeManually(() => selectPool.setMaxPosition(tick))}
                        decrease={() => adjustRangeManually(() => selectPool.decreaseMaxTick())}
                        increase={() => adjustRangeManually(() => selectPool.increaseMaxTick())}
                        currentPriceStr={currentPriceStrReverse}
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
                        // priceRangeType={priceRangeType}
                        ref={maxPriceRangeCustomRef}
                        priceRatio={tokenA.decimals / tokenB.decimals}
                      />
                    </div>
                    <div className="extra-wrapper">
                      <div className="icon-button reset" onClick={() => {
                        if (priceRangeType !== resetPriceRangeTypeTarget) {
                          setPriceRange(resetPriceRangeTypeTarget);
                          resetRange(resetPriceRangeTypeTarget);
                        }
                      }}>
                        <IconRefresh />
                        <span>Reset Range</span>
                        <span>Reset</span>
                      </div>
                      <div className="icon-button full" onClick={selectFullRange}>
                        <IconSwap />
                        <span>Full Price Range</span>
                        <span>Full Range</span>
                      </div>
                    </div>
                    {showDim && <div className="dim-content-3" />}
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )
        }
      </SelectPriceRangeCustomWrapper>
    </>
  );
});

SelectPriceRangeCustom.displayName = "SelectPriceRangeCustom";

export default SelectPriceRangeCustom;