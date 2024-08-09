import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { ZOOL_VALUES } from "@constants/graph.constant";
import {
  PriceRangeType,
  SwapFeeTierPriceRange
} from "@constants/option.constant";
import { MAX_TICK } from "@constants/swap.constant";
import { useLoading } from "@hooks/common/use-loading";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { priceToTick, tickToPrice } from "@utils/swap-utils";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";

import IconAdd from "../icons/IconAdd";
import IconKeyboardArrowLeft from "../icons/IconKeyboardArrowLeft";
import IconKeyboardArrowRight from "../icons/IconKeyboardArrowRight";
import IconRefresh from "../icons/IconRefresh";
import IconRemove from "../icons/IconRemove";
import IconSwap from "../icons/IconSwap";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import PoolSelectionGraph from "../pool-selection-graph/PoolSelectionGraph";
import SelectPriceRangeCutomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import { SelectPriceRangeCustomWrapper } from "./SelectPriceRangeCustom.styles";

export interface SelectPriceRangeCustomRepositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  priceRangeType: PriceRangeType | null;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  selectPool: SelectPool;
  changeStartingPrice: (price: string) => void;
  showDim: boolean;
  defaultPrice: number | null;
  handleSwapValue: () => void;
  resetRange: () => void;
  isEmptyLiquidity: boolean;
  isKeepToken: boolean;
}

const SelectPriceRangeCustomReposition: React.FC<
  SelectPriceRangeCustomRepositionProps
> = ({
  tokenA,
  tokenB,
  priceRangeType,
  changePriceRange,
  selectPool,
  showDim,
  handleSwapValue,
  resetRange,
  isKeepToken,
}) => {
  const { t } = useTranslation();
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
        // return 1 / selectPool.startPrice;
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
    setShiftPosition(0);
    changePriceRange({ type: "Custom" });
  }, [selectPool]);

  function initPriceRange(inputPriceRangeType?: PriceRangeType | null) {
    const currentPriceRangeType = inputPriceRangeType || priceRangeType;

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

      selectPool.setMinPosition(getPriceWithTickSpacing(priceRange.min));
      selectPool.setMaxPosition(getPriceWithTickSpacing(priceRange.max));
      return;
    }
  }

  function onResetRange(priceRangeType?: PriceRangeType | null) {
    setShiftPosition(0);
    if (priceRangeType && priceRangeType !== "Custom") {
      initPriceRange(priceRangeType);
    } else {
      resetRange();
      changePriceRange({ type: "Custom" });
    }
  }

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
    if (priceRangeType !== "Custom") onResetRange(priceRangeType);
  }, [priceRangeType]);

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
                    <span>{t("business:currentPrice")}</span>
                    <span>{currentPriceStr}</span>
                  </div>
                )}
                {showDim && (
                  <div className="pool-initialization">
                    <span>{t("Reposition:form.selectRange.dim.title")}</span>
                    <div>
                      <Trans>
                        {t("Reposition:form.selectRange.dim.content")}
                      </Trans>
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
                      price={currentPrice || 0}
                      flip={flip}
                      fullRange={selectPool.selectedFullRange}
                      zoomLevel={selectPool.zoomLevel}
                      minPrice={selectPool.minPrice}
                      maxPrice={selectPool.maxPrice}
                      setMinPrice={selectPool.setMinPosition}
                      setMaxPrice={selectPool.setMaxPosition}
                      shiftIndex={shiftPosition}
                      onFinishMove={() => changePriceRange({ type: "Custom" })}
                    />
                  </div>
                )}
                <div className="rangge-content-wrapper">
                  <div className="range-controller-wrapper">
                    <SelectPriceRangeCutomController
                      title={t("Reposition:form.price.min")}
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
                      title={t("Reposition:form.price.max")}
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
                      <span>{t("Reposition:form.selectRange.resetRange")}</span>
                      <span>{t("common:reset")}</span>
                    </div>
                    <div className="icon-button full" onClick={selectFullRange}>
                      <IconSwap />
                      <span>{t("Reposition:form.selectRange.fullPrice")}</span>
                      <span>
                        {t("Reposition:form.selectRange.fullPrice", {
                          context: "short",
                        })}
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
};

export default SelectPriceRangeCustomReposition;
