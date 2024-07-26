import {
  PriceRangeType,
  SwapFeeTierPriceRange,
} from "@constants/option.constant";
import { MAX_TICK } from "@constants/swap.constant";
import { useLoading } from "@hooks/common/use-loading";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
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
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

export interface SelectPriceRangeCustomProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  priceRangeType: PriceRangeType | null;
  selectPool: SelectPool;
  changeStartingPrice: (price: string) => void;
  showDim: boolean;
  defaultPrice: number | null;
  handleSwapValue: () => void;
  resetRange?: () => void;
  isEmptyLiquidity: boolean;
  isKeepToken: boolean;
}

const SelectPriceRangeCustom: React.FC<SelectPriceRangeCustomProps> = ({
  tokenA,
  tokenB,
  priceRangeType,
  selectPool,
  showDim,
  resetRange,
  handleSwapValue,
  isKeepToken,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const [shiftPosition, setShiftPosition] = useState(0);
  const { isLoading: isLoadingCommon } = useLoading();
  const GRAPH_WIDTH = 388;
  const GRAPH_HEIGHT = 160;

  const isCustom = true;

  const isLoading = useMemo(
    () => selectPool.renderState() === "LOADING" || isLoadingCommon,
    [selectPool.renderState, isLoadingCommon],
  );

  const availSelect = useMemo(
    () =>
      Array.isArray(selectPool.liquidityOfTickPoints) &&
      selectPool.renderState() === "DONE",
    [selectPool],
  );

  const flip = useMemo(() => {
    if (!selectPool.compareToken) {
      return false;
    }
    if (selectPool.startPrice) {
      return false;
    }

    const compareTokenPaths = [
      checkGnotPath(tokenA.path),
      checkGnotPath(tokenB.path),
    ].sort();
    return compareTokenPaths[0] !== checkGnotPath(selectPool.compareToken.path);
  }, [
    selectPool.compareToken,
    selectPool.startPrice,
    tokenA.path,
    tokenB.path,
  ]);

  const currentTokenA = useMemo(() => {
    return flip ? getGnotPath(tokenB) : getGnotPath(tokenA);
  }, [flip, tokenA, tokenB]);

  const currentTokenB = useMemo(() => {
    return flip ? getGnotPath(tokenA) : getGnotPath(tokenB);
  }, [flip, tokenA, tokenB]);

  const currentPrice = useMemo(() => {
    if (selectPool.startPrice) {
      if (!selectPool.startPrice) return 0;

      if (flip) {
        1 / selectPool.startPrice;
      }
      return selectPool.startPrice;
    }

    if (flip) {
      if (!selectPool.currentPrice) {
        return 0;
      }
      return 1 / selectPool.currentPrice;
    }
    return selectPool.currentPrice;
  }, [flip, selectPool.currentPrice, selectPool.startPrice]);

  const currentPriceStr = useMemo(() => {
    if (!currentPrice) {
      return "-";
    }

    const priceWithDecimal = (() => {
      if (selectPool.compareToken?.path === tokenA.path) {
        return (
          10 ** ((tokenB.decimals || 0) - (tokenA.decimals || 0)) * currentPrice
        );
      }

      return (
        10 ** ((tokenA.decimals || 0) - (tokenB.decimals || 0)) * currentPrice
      );
    })();

    return (
      <>
        1 {currentTokenA.symbol} =&nbsp;
        {formatTokenExchangeRate(priceWithDecimal, {
          maxSignificantDigits: 6,
          minLimit: 0.000001,
        })}
        &nbsp;
        {currentTokenB.symbol}
      </>
    );
  }, [
    currentPrice,
    currentTokenA.symbol,
    currentTokenB.symbol,
    selectPool.compareToken?.path,
    tokenA.path,
    tokenA.decimals,
    tokenB.decimals,
  ]);

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
      const compareToken =
        getGnotPath(tokenA).symbol === symbol ? tokenA : tokenB;
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
    [tokenA, tokenB, selectPool],
  );

  const selectFullRange = useCallback(() => {
    selectPool.selectFullRange();
  }, [selectPool]);

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    const currentPriceRangeType = inputPriceRangeType || priceRangeType;

    if (currentPrice && selectPool.feeTier && currentPriceRangeType) {
      const priceRange =
        SwapFeeTierPriceRange[selectPool.feeTier][currentPriceRangeType];
      const minRateAmount = currentPrice * (priceRange.min / 100);
      const maxRateAmount = currentPrice * (priceRange.max / 100);
      selectPool.setMinPosition(currentPrice + minRateAmount);
      selectPool.setMaxPosition(currentPrice + maxRateAmount);
      return;
    }
  }

  function onResetRange(priceRangeType?: PriceRangeType | null) {
    if (resetRange) {
      resetRange();
      return;
    }
    selectPool.resetRange();
    setShiftPosition(0);
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
    onResetRange(priceRangeType);
  }, [
    selectPool.poolPath,
    selectPool.feeTier,
    priceRangeType,
    selectPool.startPrice,
  ]);

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
                      feeTier={selectPool.feeTier || "NONE"}
                      width={GRAPH_WIDTH}
                      height={GRAPH_HEIGHT}
                      position="top"
                      offset={selectPool.bins?.length}
                      price={currentPrice || 0}
                      flip={flip}
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
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
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
                      setIsChangeMinMax={selectPool.setIsChangeMinMax}
                    />
                  </div>
                  <div className="extra-wrapper">
                    <div
                      className="icon-button reset"
                      onClick={() => onResetRange()}
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
