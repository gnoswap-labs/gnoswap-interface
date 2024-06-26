import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import IconRefresh from "../icons/IconRefresh";
import IconSwap from "../icons/IconSwap";
import SelectPriceRangeCustomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import {
  SelectPriceRangeCustomWrapper,
  StartingPriceWrapper,
  TooltipContentWrapper,
} from "./SelectPriceRangeCustom.styles";
import { TokenModel } from "@models/token/token-model";
import { SelectPool } from "@hooks/pool/use-select-pool";
import {
  DefaultTick,
  PriceRangeType,
  SwapFeeTierPriceRange,
} from "@constants/option.constant";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { tickToPrice } from "@utils/swap-utils";
import { MAX_TICK } from "@constants/swap.constant";
import BigNumber from "bignumber.js";
import IconRemove from "../icons/IconRemove";
import IconAdd from "../icons/IconAdd";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import IconKeyboardArrowLeft from "../icons/IconKeyboardArrowLeft";
import IconKeyboardArrowRight from "../icons/IconKeyboardArrowRight";
import IconInfo from "../icons/IconInfo";
import Tooltip from "../tooltip/Tooltip";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
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
    const { getGnotPath } = useGnotToGnot();
    const [shiftPosition, setShiftPosition] = useState(0);
    const GRAPH_WIDTH = 388;
    const GRAPH_HEIGHT = 160;
    const [startingPriceValue, setStartingPriceValue] = useState<string>("");
    const [tempPrice, setTempPrice] = useState<string>("");
    const minPriceRangeCustomRef =
      useRef<React.ElementRef<typeof SelectPriceRangeCustomController>>(null);
    const maxPriceRangeCustomRef =
      useRef<React.ElementRef<typeof SelectPriceRangeCustomController>>(null);

    const isCustom = true;

    const isLoading = useMemo(
      () => selectPool.renderState() === "LOADING" || isLoadingSelectPriceRange,
      [selectPool.renderState, isLoadingSelectPriceRange],
    );

    const availSelect =
      Array.isArray(selectPool.liquidityOfTickPoints) &&
      selectPool.renderState() === "DONE";

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
      return (
        compareTokenPaths[0] !== checkGnotPath(selectPool.compareToken.path)
      );
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

    const currentPriceStr = useMemo(() => {
      if (!selectPool.currentPrice) {
        return "-";
      }

      return (
        <>
          1 {currentTokenA.symbol} =&nbsp;
          {formatTokenExchangeRate(selectPool.currentPrice.toString(), {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })}
          &nbsp;
          {currentTokenB.symbol}
        </>
      );
    }, [currentTokenA.symbol, currentTokenB.symbol, selectPool.currentPrice]);

    useImperativeHandle(ref, () => {
      return { resetRange };
    });

    const startingPriceDescription = useMemo(() => {
      if (!currentTokenA || !currentTokenB) {
        return "";
      }
      if (startingPriceValue === "" || BigNumber(startingPriceValue).isNaN()) {
        if (!defaultPrice || !selectPool.isCreate) {
          return "";
        }
        return (
          <>
            1 {currentTokenA.symbol} = &nbsp;
            {formatTokenExchangeRate(defaultPrice, {
              maxSignificantDigits: 6,
              minLimit: 0.000001,
            })}
            &nbsp;{currentTokenB.symbol}
          </>
        );
      }
      return (
        <>
          1 {currentTokenA.symbol} =&nbsp;
          {formatTokenExchangeRate(startingPriceValue, {
            maxSignificantDigits: 6,
            minLimit: 0.000001,
          })}
          &nbsp; {currentTokenB.symbol}
        </>
      );
    }, [
      currentTokenA,
      currentTokenB,
      defaultPrice,
      selectPool.isCreate,
      startingPriceValue,
    ]);

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

      if (inputPriceRangeType === "Custom" && tickLower && tickUpper) {
        selectPool.setMinPosition(tickLower);
        selectPool.setMaxPosition(tickUpper);
        return;
      }

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
      setShiftPosition(0);
      initPriceRange(priceRangeType);
    }

    const onChangeStartingPrice = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const formattedValue = value.replace(/[^0-9.]/, "");
        setStartingPriceValue(formattedValue);
      },
      [],
    );

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
    }, [selectPool.poolPath, priceRangeType]);

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

    const formatStartingPrice = useMemo(() => {
      if (tempPrice) {
        return tempPrice;
      }

      return startingPriceValue;
    }, [startingPriceValue, tempPrice]);

    if (selectPool.renderState() === "NONE") {
      return <></>;
    }

    if (!selectPool.isCreate && !isCustom) {
      return <></>;
    }

    return (
      <>
        {selectPool.isCreate && (
          <StartingPriceWrapper className="starting-price-wrapper">
            <div className="title-wrapper">
              <span className="sub-title">Starting Price</span>
              <div className="price-info">
                {!startingPriceValue && !isEmptyLiquidity && (
                  <Tooltip
                    placement="top"
                    FloatingContent={
                      <TooltipContentWrapper>
                        Suggested starting price based on the current price of
                        the most liquid pool in the same pair.
                      </TooltipContentWrapper>
                    }
                  >
                    <IconInfo />
                  </Tooltip>
                )}
                <span className="description">{startingPriceDescription}</span>
              </div>
            </div>
            <input
              className="starting-price-input"
              value={formatStartingPrice}
              onChange={onChangeStartingPrice}
              onBlur={updateStartingPrice}
              onFocus={() => setTempPrice("")}
              placeholder="Enter price"
              type={"number"}
            />
          </StartingPriceWrapper>
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
                      <span>Current Price</span>
                      <span
                        style={{ wordBreak: "break-all", textAlign: "center" }}
                      >
                        {currentPriceStr}
                      </span>
                    </div>
                  )}
                  {showDim && (
                    <div className="pool-initialization">
                      <span>Pool Initialization</span>
                      <div>
                        As the first person to Add Position to this pool, you
                        must initialize it. <span>Enter a starting price</span>{" "}
                        for the pool, then select the price range and the
                        deposit amount for your liquidity. Please note that{" "}
                        <span>gas fees will be higher</span> than usual due to
                        the initialization transaction.
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
                      <SelectPriceRangeCustomController
                        title="Min Price"
                        current={selectPool.minPrice}
                        token0Symbol={currentTokenA.symbol}
                        token1Symbol={currentTokenB.symbol}
                        tickSpacing={selectPool.tickSpacing}
                        feeTier={selectPool.feeTier || "NONE"}
                        selectedFullRange={selectPool.selectedFullRange}
                        onSelectCustomRange={onSelectCustomRangeByMin}
                        changePrice={tick =>
                          adjustRangeManually(() =>
                            selectPool.setMinPosition(tick),
                          )
                        }
                        decrease={() =>
                          adjustRangeManually(() =>
                            selectPool.decreaseMinTick(),
                          )
                        }
                        increase={() =>
                          adjustRangeManually(() =>
                            selectPool.increaseMinTick(),
                          )
                        }
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
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
                        changePrice={tick =>
                          adjustRangeManually(() =>
                            selectPool.setMaxPosition(tick),
                          )
                        }
                        decrease={() =>
                          adjustRangeManually(() =>
                            selectPool.decreaseMaxTick(),
                          )
                        }
                        increase={() =>
                          adjustRangeManually(() =>
                            selectPool.increaseMaxTick(),
                          )
                        }
                        setIsChangeMinMax={selectPool.setIsChangeMinMax}
                        ref={maxPriceRangeCustomRef}
                        priceRatio={tokenA.decimals / tokenB.decimals}
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
                        <span>Reset Range</span>
                        <span>Reset</span>
                      </div>
                      <div
                        className="icon-button full"
                        onClick={selectFullRange}
                      >
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
  },
);

SelectPriceRangeCustom.displayName = "SelectPriceRangeCustom";

export default SelectPriceRangeCustom;
