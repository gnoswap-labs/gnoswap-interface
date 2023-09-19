import React, { useCallback, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import { FEE_RATE_OPTION, PriceRangeType } from "@constants/option.constant";
import { DUMMY_FEE_TIERS, DUMMY_POOL_TICKS, DUMMY_PRICE_RANGE_MAP } from "./earn-add-liquidity-dummy";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";

export interface AddLiquidityFeeTier {
  feeRate: string;
  description: string;
  range: string;
}

export interface AddLiquidityPriceRage {
  range: {
    minTick: string;
    minPrice: string;
    maxTick: string;
    maxPrice: string;
  }
  apr?: string;
}

export interface PoolTick {
  value: string;
  price: string;
  tick: number;
}

export interface PriceRangeSummary {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

const feeTiers = DUMMY_FEE_TIERS;

const priceRangeMap = DUMMY_PRICE_RANGE_MAP;

const ticks = DUMMY_POOL_TICKS;

const token0Data = {
  tokenId: "1",
  tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
  name: "Bitcoin",
  symbol: "BTC",
};

const token1Data = {
  tokenId: "2",
  tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
  name: "Ethereum",
  symbol: "ETH",
};

const EarnAddLiquidityContainer: React.FC = () => {
  const [token0, setToken0] = useState<TokenDefaultModel>(token0Data);
  const [token1, setToken1] = useState<TokenDefaultModel>(token1Data);
  const token0AmountInput = useTokenAmountInput(token0);
  const token1AmountInput = useTokenAmountInput(token1);
  const [feeRate, setFeeRate] = useState<FEE_RATE_OPTION>();
  const [priceRange, setPriceRange] = useState<PriceRangeType>();

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    if (!priceRange) {
      return {
        depositRatio: "-",
        feeBoost: "-",
        estimatedApr: "-",
      };
    }
    return {
      depositRatio: "40.2% ETH / 59.8% GNOS",
      feeBoost: "x10.23",
      estimatedApr: "19.22%",
    };
  }, [priceRange]);

  const selectFeeTier = useCallback((feeRate: FEE_RATE_OPTION) => {
    setFeeRate(feeRate);
  }, []);

  const selectPriceRange = useCallback((priceRange: PriceRangeType) => {
    setPriceRange(priceRange);
  }, []);

  const changeToken0 = useCallback((token: TokenDefaultModel) => {
    setToken0(token);
  }, []);

  const changeToken1 = useCallback((token: TokenDefaultModel) => {
    setToken1(token);
  }, []);

  return (
    <EarnAddLiquidity
      mode={"POOL"}
      token0={token0}
      token1={token1}
      token0Input={token0AmountInput}
      token1Input={token1AmountInput}
      changeToken0={changeToken0}
      changeToken1={changeToken1}
      feeTiers={feeTiers}
      feeRate={feeRate}
      selectFeeTier={selectFeeTier}
      priceRangeMap={priceRangeMap}
      priceRange={priceRange}
      priceRangeSummary={priceRangeSummary}
      selectPriceRange={selectPriceRange}
      ticks={ticks}
      currentTick={ticks[20]}
    />
  );
};

export default EarnAddLiquidityContainer;
