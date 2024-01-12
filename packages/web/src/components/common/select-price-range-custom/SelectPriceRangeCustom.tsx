import React, { useCallback, useEffect, useMemo, useState } from "react";
import IconRefresh from "../icons/IconRefresh";
import IconSwap from "../icons/IconSwap";
import SelectPriceRangeCutomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import { SelectPriceRangeCustomWrapper, StartingPriceWrapper } from "./SelectPriceRangeCustom.styles";
import PoolSelectionGraph from "../pool-selection-graph/PoolSelectionGraph";
import { TokenModel } from "@models/token/token-model";
import { SelectPool } from "@hooks/pool/use-select-pool";
import * as d3 from "d3";
import { PriceRangeType, SwapFeeTierPriceRange } from "@constants/option.constant";
import { toNumberFormat } from "@utils/number-utils";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { tickToPrice } from "@utils/swap-utils";
import { MAX_TICK } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import { numberToFormat } from "@utils/string-utils";
import IconRemove from "../icons/IconRemove";
import IconAdd from "../icons/IconAdd";

export interface SelectPriceRangeCustomProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  priceRangeType: PriceRangeType | null;
  selectPool: SelectPool;
  changeStartingPrice: (price: string) => void;
  showDim: boolean;
  defaultPrice: number | null;
}

const SelectPriceRangeCustom: React.FC<SelectPriceRangeCustomProps> = ({
  tokenA,
  tokenB,
  priceRangeType,
  selectPool,
  changeStartingPrice,
  showDim,
  defaultPrice,
}) => {
  const GRAPH_WIDTH = 388;
  const GRAPH_HEIGHT = 160;
  const [startingPriceValue, setStartingPriceValue] = useState<string>("");
  function getPriceRange(price?: number | null) {
    const currentPriceRangeType = priceRangeType;
    const currentPrice = price || selectPool.currentPrice || 1;
    if (!selectPool.feeTier || !currentPriceRangeType) {
      return [0, currentPrice * 2];
    }

    const visibleRate = SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType].max / 100;
    const range = currentPrice * visibleRate;
    return [currentPrice - range, currentPrice + range];
  }

  function getScaleRange() {
    const currentPrice = selectPool.currentPrice || 1;
    const [min, max] = getPriceRange();
    const rangeGap = max - min;

    return [currentPrice - rangeGap, currentPrice + rangeGap];
  }

  function getHeightRange() {
    const [, maxY] = d3.extent(selectPool.liquidityOfTickPoints.map(point => point[1]));
    return [0, maxY || 0];
  }

  /** D3 Variables */
  const defaultScaleX = d3
    .scaleLinear()
    .domain(getScaleRange())
    .range([0, GRAPH_WIDTH]);

  const scaleX = defaultScaleX.copy();

  const scaleY = d3
    .scaleLinear()
    .domain(getHeightRange())
    .range([GRAPH_HEIGHT, 0]);

  const isCustom = true;

  const isLoading = useMemo(() => selectPool.renderState === "LOADING", [selectPool.renderState]);

  const availSelect = Array.isArray(selectPool.liquidityOfTickPoints) && selectPool.renderState === "DONE";

  const comparedTokenA = selectPool.compareToken?.symbol !== tokenB.symbol;

  const currentTokenA = useMemo(() => {
    return comparedTokenA ? tokenA : tokenB;
  }, [comparedTokenA, tokenA, tokenB]);

  const currentTokenB = useMemo(() => {
    return comparedTokenA ? tokenB : tokenA;
  }, [comparedTokenA, tokenA, tokenB]);

  const currentPriceStr = useMemo(() => {
    if (!selectPool.currentPrice) {
      return "-";
    }
    const currentPrice = toNumberFormat(selectPool.currentPrice, 4);
    return `1 ${currentTokenA.symbol} = ${currentPrice} ${currentTokenB.symbol}`;
  }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

  const startingPriceDescription = useMemo(() => {
    if (!currentTokenA || !currentTokenB) {
      return "";
    }
    if (startingPriceValue === "" || BigNumber(startingPriceValue).isNaN()) {
      if (!defaultPrice || !selectPool.isCreate) {
        return "";
      }
      return `1 ${currentTokenA.symbol} = ${numberToFormat(defaultPrice, 4)} ${currentTokenB.symbol}`;
    }
    return `1 ${currentTokenA.symbol} = ${startingPriceValue} ${currentTokenB.symbol}`;
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
  }, [selectPool, tokenA, tokenB]);

  const selectFullRange = useCallback(() => {
    selectPool.selectFullRange();
  }, [selectPool]);

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    const currentPriceRangeType = inputPriceRangeType || priceRangeType;
    const currentPrice = selectPool.isCreate ? selectPool.startPrice : selectPool.currentPrice;
    if (currentPrice && selectPool.feeTier && currentPriceRangeType) {
      const priceRange = SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];
      const minRateAmount = currentPrice * (priceRange.min / 100);
      const maxRateAmount = currentPrice * (priceRange.max / 100);
      selectPool.setMinPosition(currentPrice + minRateAmount);
      selectPool.setMaxPosition(currentPrice + maxRateAmount);
    }
  }

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
  }, []);

  useEffect(() => {
    resetRange(priceRangeType);
  }, [selectPool.poolPath, selectPool.feeTier, priceRangeType, selectPool.startPrice]);

  useEffect(() => {
    if (!selectPool.poolPath) {
      changeStartingPrice(startingPriceValue);
    }
  }, [selectPool.poolPath, priceRangeType]);


  useEffect(() => {
    if (selectPool.currentPrice) {
      selectPool.setFocusPosition(scaleX(selectPool.currentPrice));
    }
    if (selectPool.isCreate && selectPool.startPrice !== null) {
      selectPool.setFocusPosition(scaleX(Number(selectPool.startPrice)));
    }
  }, [selectPool.currentPrice, selectPool.startPrice]);

  if (selectPool.renderState === "NONE") {
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
              <span className="description">{startingPriceDescription}</span>
            </div>
            <input
              className="starting-price-input"
              value={startingPriceValue}
              onChange={onChangeStartingPrice}
              onBlur={updateStartingPrice}
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
                    selectType={selectPool.compareToken?.symbol || ""}
                    list={[tokenA.symbol, tokenB.symbol]}
                    onClick={onClickTabItem}
                  />
                  <div className="graph-option-wrapper">
                    <span className={`graph-option-item decrease ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomIn}>
                      <IconRemove />
                    </span>
                    <span className={`graph-option-item increase ${isLoading || showDim ? "disabled-option" : ""}`} onClick={selectPool.zoomOut}>
                      <IconAdd />
                    </span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="loading-wrapper">
                  <LoadingSpinner />
                </div>
              )}

              {(showDim || availSelect) && (
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
                      setMinPrice={selectPool.setMinPosition}
                      setMaxPrice={selectPool.setMaxPosition}
                      liquidityOfTickPoints={selectPool.liquidityOfTickPoints}
                      currentPrice={selectPool.currentPrice}
                      focusPosition={selectPool.focusPosition}
                      width={GRAPH_WIDTH}
                      height={GRAPH_HEIGHT}
                      finishMove={finishMove}
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
                    />
                  </div>}
                  <div className="rangge-content-wrapper">
                    <div className="range-controller-wrapper">
                      <SelectPriceRangeCutomController
                        title="Min Price"
                        current={selectPool.minPrice}
                        token0Symbol={currentTokenA.symbol}
                        token1Symbol={currentTokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMin}
                        changePrice={selectPool.setMinPosition}
                        decrease={selectPool.decreaseMinTick}
                        increase={selectPool.increaseMinTick}
                      />
                      <SelectPriceRangeCutomController
                        title="Max Price"
                        current={selectPool.maxPrice}
                        token0Symbol={currentTokenA.symbol}
                        token1Symbol={currentTokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMax}
                        changePrice={selectPool.setMaxPosition}
                        decrease={selectPool.decreaseMaxTick}
                        increase={selectPool.increaseMaxTick}
                      />
                    </div>
                    <div className="extra-wrapper">
                      <div className="icon-button reset" onClick={() => resetRange()}>
                        <IconRefresh />
                        <span>Reset Range</span>
                      </div>
                      <div className="icon-button full" onClick={selectFullRange}>
                        <IconSwap />
                        <span>Full Price Range</span>
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
};

export default SelectPriceRangeCustom;