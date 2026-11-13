import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";

import { ENABLED_SWAP_CARD_TYPES } from "@constants/order.constant";
import useRouter from "@hooks/common/use-custom-router";
import { SWAP_CARD_TYPE, toEnabledSwapCardType } from "@models/order/order-type";
import { useGetLimitMarketPrices } from "@query/order/use-get-limit-market-prices";
import { LimitMarketPricePair } from "@repositories/order/request";
import { SwapState } from "@states/index";
import { canonicalizeLimitMarketPricePairs, getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";

interface LimitMarketPriceContextValue {
  getPrice: (pair: LimitMarketPricePair | null) => string | null;
  /** Replaces the pairs one registrant shows; `null` removes them. */
  setRegisteredPairs: (registrantId: string, pairs: readonly LimitMarketPricePair[] | null) => void;
}

const LimitMarketPriceContext = createContext<LimitMarketPriceContextValue | null>(null);

const useLimitMarketPriceContext = (hookName: string): LimitMarketPriceContextValue => {
  const context = useContext(LimitMarketPriceContext);
  if (!context) throw new Error(`${hookName} must be used within LimitMarketPriceProvider`);
  return context;
};

/**
 * Shares each directed pair's pool spot price between the Limit form and visible orders.
 * Queries refresh only while the Limit card is open.
 */
export const LimitMarketPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const isLimitOpen = toEnabledSwapCardType(router.query.type, ENABLED_SWAP_CARD_TYPES) === SWAP_CARD_TYPE.LIMIT;
  const { tokenA, tokenB } = useAtomValue(SwapState.swap);
  const [registeredPairs, setRegisteredPairsState] = useState<Record<string, readonly LimitMarketPricePair[]>>({});

  const pairs = useMemo(() => {
    const orderPairs = Object.values(registeredPairs).flat();
    if (!tokenA || !tokenB) return orderPairs;
    return [{ tokenIn: getSwapTokenPath(tokenA), tokenOut: getSwapTokenPath(tokenB) }, ...orderPairs];
  }, [registeredPairs, tokenA, tokenB]);
  const { data } = useGetLimitMarketPrices(pairs, { enabled: isLimitOpen });

  const getPrice = useCallback(
    (pair: LimitMarketPricePair | null) => {
      if (!pair || !data) return null;
      const rate = data[getLimitMarketPricePairKey(pair)]?.outputPerInput;
      if (!rate) return null;
      const value = BigNumber(rate);
      return value.isFinite() && value.isGreaterThan(0) ? rate : null;
    },
    [data],
  );

  const setRegisteredPairs = useCallback(
    (registrantId: string, nextPairs: readonly LimitMarketPricePair[] | null) =>
      setRegisteredPairsState(prev => {
        const next = { ...prev };
        if (nextPairs) next[registrantId] = nextPairs;
        else delete next[registrantId];
        return next;
      }),
    [],
  );

  const value = useMemo(() => ({ getPrice, setRegisteredPairs }), [getPrice, setRegisteredPairs]);

  return <LimitMarketPriceContext.Provider value={value}>{children}</LimitMarketPriceContext.Provider>;
};

/**
 * The current pool spot rate of a directed pair, in output tokens per input token, independent of any order size.
 * Null while it is unknown, the pool has none, or the market price API fails.
 */
export const useLimitMarketPrices = (): { getPrice: (pair: LimitMarketPricePair | null) => string | null } => {
  const { getPrice } = useLimitMarketPriceContext("useLimitMarketPrices");
  return { getPrice };
};

/**
 * Adds the pairs of the Limit orders on screen to the shared query until they leave it. Pairs are compared by
 * content, so a refreshed page of the same orders requests nothing new.
 */
export const useRegisterLimitMarketPricePairs = (pairs: readonly LimitMarketPricePair[]): void => {
  const { setRegisteredPairs } = useLimitMarketPriceContext("useRegisterLimitMarketPricePairs");
  const registrantId = useId();
  const canonicalPairs = useMemo(() => canonicalizeLimitMarketPricePairs(pairs), [pairs]);
  const pairsKey = JSON.stringify(canonicalPairs);
  const canonicalPairsRef = useRef(canonicalPairs);
  canonicalPairsRef.current = canonicalPairs;

  useEffect(() => {
    setRegisteredPairs(registrantId, canonicalPairsRef.current);
    return () => setRegisteredPairs(registrantId, null);
  }, [pairsKey, registrantId, setRegisteredPairs]);
};
