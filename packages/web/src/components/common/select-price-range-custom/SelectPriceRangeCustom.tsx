import React, { useCallback, useMemo, useState } from "react";
import IconRefresh from "../icons/IconRefresh";
import IconSwap from "../icons/IconSwap";
import SelectPriceRangeCutomController from "../select-price-range-cutom-controller/SelectPriceRangeCutomController";
import SelectTab from "../select-tab/SelectTab";
import { SelectPriceRangeCustomWrapper } from "./SelectPriceRangeCustom.styles";
import { TokenInfo } from "@models/token/token-info";
import { PoolTick } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import PoolGraph from "../pool-graph/PoolGraph";
import BigNumber from "bignumber.js";

export interface SelectPriceRangeCustomProps {
  tokenA: TokenInfo | undefined;
  tokenB: TokenInfo | undefined;
  currentTick?: PoolTick;
  ticks: PoolTick[];
}

const SelectPriceRangeCustom: React.FC<SelectPriceRangeCustomProps> = ({
  tokenA,
  tokenB,
  currentTick,
  ticks,
}) => {
  const [minTick, setMinTick] = useState<PoolTick>();
  const [maxTick, setMaxTick] = useState<PoolTick>();

  const token0Symbol = useMemo(() => {
    return tokenA?.symbol || "";
  }, [tokenA]);

  const token1Symbol = useMemo(() => {
    return tokenB?.symbol || "";
  }, [tokenB]);

  const tabItems = useMemo(() => {
    return [token0Symbol, token1Symbol];
  }, [token0Symbol, token1Symbol]);

  const currentPriceInfo = useMemo(() => {
    if (!currentTick) {
      return "-";
    }
    const currentPrice = BigNumber(currentTick.price).toFixed(4);
    return `${currentPrice} ${token0Symbol} per ${token1Symbol}`;
  }, [currentTick, token0Symbol, token1Symbol]);

  const findPreviousTick = useCallback((tick: PoolTick) => {
    const tickIndex = ticks.findIndex(item => item.tick === tick.tick);
    if (tickIndex < 0) {
      return undefined;
    }
    if (tickIndex < 1) {
      return ticks[0];
    }
    return ticks[tickIndex - 1];
  }, [ticks]);

  const findNextTick = useCallback((tick: PoolTick) => {
    const tickIndex = ticks.findIndex(item => item.tick === tick.tick);
    if (tickIndex < 0) {
      return undefined;
    }
    if (tickIndex >= ticks.length - 1) {
      return ticks[ticks.length - 1];
    }
    return ticks[tickIndex + 1];
  }, [ticks]);

  const onClickTabItem = useCallback(() => {
    return;
  }, []);

  const decreaseMinPrice = useCallback(() => {
    if (!minTick) {
      return;
    }
    const tick = findPreviousTick(minTick);
    setMinTick(tick);
    return;
  }, [findPreviousTick, minTick]);

  const increaseMinPrice = useCallback(() => {
    if (!minTick) {
      return;
    }
    const tick = findNextTick(minTick);
    setMinTick(tick);
    return;
  }, [findNextTick, minTick]);

  const decreaseMaxPrice = useCallback(() => {
    if (!maxTick) {
      return;
    }
    const tick = findPreviousTick(maxTick);
    setMaxTick(tick);
    return;
  }, [findPreviousTick, maxTick]);

  const increaseMaxPrice = useCallback(() => {
    if (!maxTick) {
      return;
    }
    const tick = findNextTick(maxTick);
    setMaxTick(tick);
    return;
  }, [findNextTick, maxTick]);

  return (
    <SelectPriceRangeCustomWrapper>
      <div className="option-wrapper">
        <SelectTab
          selectType={token0Symbol}
          list={tabItems}
          onClick={onClickTabItem}
        />
        <div className="graph-option-wrapper">
          <span className="graph-option-item decrease">-</span>
          <span className="graph-option-item increase">+</span>
        </div>
      </div>
      <div className="current-price-wrapper">
        <span>Current Price</span>
        <span>{currentPriceInfo}</span>
      </div>
      <div className="range-graph-wrapper">
        <PoolGraph
          width={388}
          height={140}
          ticks={ticks}
          currentTick={currentTick}
          minTick={minTick}
          maxTick={maxTick}
          onChangeMinTick={setMinTick}
          onChangeMaxTick={setMaxTick}
        />
      </div>

      <div className="range-controller-wrapper">
        <SelectPriceRangeCutomController
          title="Min Price"
          current={minTick?.price}
          token0Symbol={token0Symbol}
          token1Symbol={token1Symbol}
          decrease={decreaseMinPrice}
          increase={increaseMinPrice}
        />
        <SelectPriceRangeCutomController
          title="Max Price"
          current={maxTick?.price}
          token0Symbol={token1Symbol}
          token1Symbol={token0Symbol}
          decrease={decreaseMaxPrice}
          increase={increaseMaxPrice}
        />
      </div>

      <div className="extra-wrapper">
        <div className="icon-button reset">
          <IconRefresh />
          <span>Reset Range</span>
        </div>
        <div className="icon-button full">
          <IconSwap />
          <span>Full Price Range</span>
        </div>
      </div>
    </SelectPriceRangeCustomWrapper>
  );
};

export default SelectPriceRangeCustom;