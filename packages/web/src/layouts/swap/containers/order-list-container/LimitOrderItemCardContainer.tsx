import BigNumber from "bignumber.js";
import React, { useMemo } from "react";

import { useGetRoutes } from "@query/router";
import { makeDisplayTokenAmountString } from "@utils/token-utils";

import LimitOrderItemCard, { LimitOrderItemCardProps } from "../../components/order-list/order-card/LimitOrderItemCard";

const MARKET_PRICE_REFETCH_INTERVAL = 10_000;

type LimitOrderItemCardContainerProps = Omit<LimitOrderItemCardProps, "marketPrice">;

/** Quotes the original making amount, as the Limit form does; closed orders still show today's quote. */
const LimitOrderItemCardContainer: React.FC<LimitOrderItemCardContainerProps> = props => {
  const { tokenIn, tokenOut, makingAmount } = props.order;
  const { data: quote } = useGetRoutes(
    { inputToken: tokenIn, outputToken: tokenOut, tokenAmount: makingAmount, exactType: "EXACT_IN" },
    { refetchInterval: MARKET_PRICE_REFETCH_INTERVAL },
  );
  const marketPrice = useMemo(() => {
    if (quote?.status !== "SUCCESS") return null;
    const output = makeDisplayTokenAmountString(tokenOut, quote.amount);
    if (!output) return null;
    const rate = BigNumber(output).dividedBy(makingAmount);
    return rate.isFinite() && rate.gt(0) ? rate.toFixed() : null;
  }, [makingAmount, quote, tokenOut]);

  return <LimitOrderItemCard {...props} marketPrice={marketPrice} />;
};

export default LimitOrderItemCardContainer;
