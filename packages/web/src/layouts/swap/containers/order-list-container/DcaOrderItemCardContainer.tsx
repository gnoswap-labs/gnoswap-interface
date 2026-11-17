import BigNumber from "bignumber.js";
import React, { useMemo } from "react";

import { useGetRoutes } from "@query/router";
import { makeDisplayTokenAmountString } from "@utils/token-utils";

import DcaOrderItemCard, { DcaOrderItemCardProps } from "../../components/order-list/order-card/DcaOrderItemCard";

const MARKET_PRICE_REFETCH_INTERVAL = 10_000;

type DcaOrderItemCardContainerProps = Omit<DcaOrderItemCardProps, "marketPrice">;

/**
 * Shows the price of the pool the order trades on, as the order-api reports it, including a reported null. Only an
 * earlier order-api, which has no such price, falls back to a router quote of one round's input.
 */
const DcaOrderItemCardContainer: React.FC<DcaOrderItemCardContainerProps> = props => {
  const { inputToken, outputToken, amountPerExecution, marketPrice: poolPrice, isMarketPriceReported } = props.order;
  const { data: quote } = useGetRoutes(
    { inputToken, outputToken, tokenAmount: amountPerExecution, exactType: "EXACT_IN" },
    { enabled: !isMarketPriceReported, refetchInterval: MARKET_PRICE_REFETCH_INTERVAL },
  );
  const marketPrice = useMemo(() => {
    if (isMarketPriceReported) return poolPrice;
    if (quote?.status !== "SUCCESS") return null;
    const output = makeDisplayTokenAmountString(outputToken, quote.amount);
    if (!output) return null;
    const rate = BigNumber(output).dividedBy(amountPerExecution);
    return rate.isFinite() && rate.gt(0) ? rate.toFixed() : null;
  }, [amountPerExecution, isMarketPriceReported, outputToken, poolPrice, quote]);

  return <DcaOrderItemCard {...props} marketPrice={marketPrice} />;
};

export default DcaOrderItemCardContainer;
