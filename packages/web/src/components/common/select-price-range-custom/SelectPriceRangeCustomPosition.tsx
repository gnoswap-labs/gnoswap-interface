import {
  PriceRangeType,
  SwapFeeTierPriceRange,
} from "@constants/option.constant";
import { MAX_TICK } from "@constants/swap.constant";
import { useLoading } from "@hooks/common/use-loading";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { convertToKMB } from "@utils/stake-position-utils";
import { tickToPrice } from "@utils/swap-utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import IconAdd from "../icons/IconAdd";
import IconKeyboardArrowLeft from "../icons/IconKeyboardArrowLeft";
import IconKeyboardArrowRight from "../icons/IconKeyboardArrowRight";
import IconRefresh from "../icons/IconRefresh";
import IconRemove from "../icons/IconRemove";
import IconSwap from "../icons/IconSwap";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import SelectPriceRangeCutomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import { SelectPriceRangeCustomWrapper } from "./SelectPriceRangeCustom.styles";
import PoolSelectionGraph from "../pool-selection-graph/PoolSelectionGraph";
import { ZOOL_VALUES } from "@constants/graph.constant";
import { checkGnotPath } from "@utils/common";

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
}

const SelectPriceRangeCustom: React.FC<SelectPriceRangeCustomProps> = ({
  tokenA,
  tokenB,
  priceRangeType,
  selectPool,
  showDim,
  handleSwapValue,
  isKeepToken,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const [shiftPosition, setShiftPosition] = useState(0);
  const { isLoadingCommon } = useLoading();
  const GRAPH_WIDTH = 388;
  const GRAPH_HEIGHT = 160;

  const isCustom = true;

  const isLoading = useMemo(
    () => selectPool.renderState() === "LOADING" || isLoadingCommon,
    [selectPool.renderState, isLoadingCommon],
  );

  const availSelect =
    Array.isArray(selectPool.liquidityOfTickPoints) &&
    selectPool.renderState() === "DONE";

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
    const currentPrice = convertToKMB(selectPool.currentPrice.toFixed(4), {
      maximumFractionDigits: 4,
    });
    return `1 ${currentTokenA.symbol} = ${currentPrice} ${currentTokenB.symbol}`;
  }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

  const currentPriceStrReverse = useMemo(() => {
    if (!selectPool.currentPrice) {
      return "-";
    }
    const currentPrice = convertToKMB(
      (1 / selectPool.currentPrice).toString(),
      { maximumFractionDigits: 4 },
    );
    return `1 ${currentTokenB.symbol} = ${currentPrice} ${currentTokenA.symbol}`;
  }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

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
  }, [selectPool]);

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    // if (inputPriceRangeType === "Custom") return;
    const currentPriceRangeType = inputPriceRangeType || priceRangeType;
    const currentPrice = selectPool.isCreate
      ? selectPool.startPrice
      : selectPool.currentPrice;
    if (
      currentPrice &&
      selectPool.feeTier &&
      currentPriceRangeType &&
      !selectPool.isChangeMinMax
    ) {
      const priceRange =
        SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];
      const minRateAmount = currentPrice * (priceRange.min / 100);
      const maxRateAmount = currentPrice * (priceRange.max / 100);
      selectPool.setMinPosition(currentPrice + minRateAmount);
      selectPool.setMaxPosition(currentPrice + maxRateAmount);
    } else if (selectPool.isChangeMinMax) {
      selectPool.setMinPosition(selectPool.minPrice);
      selectPool.setMaxPosition(selectPool.maxPrice);
    }
  }

  function resetRange(priceRangeType?: PriceRangeType | null) {
    selectPool.resetRange();
    initPriceRange(priceRangeType);
  }

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
  }, [
    selectPool.poolPath,
    selectPool.feeTier,
    priceRangeType,
    selectPool.startPrice,
  ]);

  if (selectPool.renderState() === "NONE") {
    return <></>;
  }

  if (!selectPool.isCreate && !isCustom) {
    return <></>;
  }

  return (
    <>
      <SelectPriceRangeCustomWrapper>
        {(isCustom || selectPool.isCreate || showDim) && (
          <React.Fragment>
            {(availSelect || showDim) && (
              <div className="option-wrapper">
                <SelectTab
                  selectType={
                    getGnotPath(selectPool.compareToken)?.symbol || ""
                  }
                  list={[
                    !isKeepToken
                      ? getGnotPath(tokenA).symbol
                      : getGnotPath(tokenB).symbol,
                    isKeepToken
                      ? getGnotPath(tokenA).symbol
                      : getGnotPath(tokenB).symbol,
                  ]}
                  onClick={onClickTabItem}
                />
                <div className="button-option-contaier">
                  <div className="graph-option-wrapper">
                    <span
                      className={`graph-option-item decrease ${
                        isLoading || showDim ? "disabled-option" : ""
                      }`}
                      onClick={moveLeft}
                    >
                      <IconKeyboardArrowLeft />
                    </span>
                    <span
                      className={`graph-option-item increase ${
                        isLoading || showDim ? "disabled-option" : ""
                      }`}
                      onClick={moveRight}
                    >
                      <IconKeyboardArrowRight />
                    </span>
                  </div>
                  <div className="graph-option-wrapper">
                    <span
                      className={`graph-option-item decrease ${
                        isLoading || showDim ? "disabled-option" : ""
                      }`}
                      onClick={zoomOut}
                    >
                      <IconRemove />
                    </span>
                    <span
                      className={`graph-option-item increase ${
                        isLoading || showDim ? "disabled-option" : ""
                      }`}
                      onClick={zoomIn}
                    >
                      <IconAdd />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="loading-wrapper">
                <LoadingSpinner />
              </div>
            )}

            {!isLoading && (showDim || availSelect) && (
              <React.Fragment>
                {!showDim && (
                  <div className="current-price-wrapper">
                    <span>Current Price</span>
                    <span>{currentPriceStr}</span>
                  </div>
                )}
                {showDim && (
                  <div className="pool-initialization">
                    <span>Pool Initialization</span>
                    <div>
                      As the first person to Add Position to this pool, you must
                      initialize it. <span>Enter a starting price</span> for the
                      pool, then select the price range and the deposit amount
                      for your liquidity. Please note that{" "}
                      <span>gas fees will be higher</span> than usual due to the
                      initialization transaction.
                    </div>
                  </div>
                )}
                {!showDim && (
                  <div className="range-graph-wrapper">
                    <PoolSelectionGraph
                      tokenA={tokenA}
                      tokenB={tokenB}
                      bins={selectPool.bins || []}
                      width={GRAPH_WIDTH}
                      height={GRAPH_HEIGHT}
                      position="top"
                      offset={selectPool.bins?.length}
                      price={
                        selectPool.startPrice
                          ? selectPool.startPrice
                          : selectPool.currentPrice || 1
                      }
                      flip={
                        [
                          checkGnotPath(tokenA.path),
                          checkGnotPath(tokenB.path),
                        ].sort()[0] !== checkGnotPath(tokenA.path)
                      }
                      fullRange={selectPool.selectedFullRange}
                      zoomLevel={selectPool.zoomLevel}
                      minPrice={selectPool.minPrice}
                      maxPrice={selectPool.maxPrice}
                      setMinPrice={selectPool.setMinPosition}
                      setMaxPrice={selectPool.setMaxPosition}
                      shiftIndex={shiftPosition}
                      onFinishMove={finishMove}
                    />
                  </div>
                )}
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
                      currentPriceStr={currentPriceStr}
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
                      // priceRangeType={priceRangeType}
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
                      currentPriceStr={currentPriceStrReverse}
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
                      // priceRangeType={priceRangeType}
                    />
                  </div>
                  <div className="extra-wrapper">
                    <div
                      className="icon-button reset"
                      onClick={() => resetRange()}
                    >
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
        )}
      </SelectPriceRangeCustomWrapper>
    </>
  );
};

export default SelectPriceRangeCustom;
