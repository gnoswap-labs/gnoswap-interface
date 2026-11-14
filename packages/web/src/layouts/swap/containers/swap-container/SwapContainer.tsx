import { useAtomValue } from "jotai";
import React, { useCallback } from "react";

import { ENABLED_SWAP_CARD_TYPES, IS_ORDER_ENABLED } from "@constants/order.constant";
import useRouter from "@hooks/common/use-custom-router";
import { SWAP_CARD_TYPE, SwapCardType, toEnabledSwapCardType } from "@models/order/order-type";
import { useGetDcaConfig, useGetLimitConfig } from "@query/order";
import { SwapState } from "@states/index";

import DcaOrderContainer from "../dca-order-container/DcaOrderContainer";
import LimitOrderContainer from "../limit-order-container/LimitOrderContainer";
import SwapCardContainer from "../swap-card-container/SwapCardContainer";

/**
 * Switches the swap card between Swap, DCA and Limit through the `type` query parameter.
 *
 * A card shows its skeleton only while the realm config it needs is loading. Both
 * configs are fetched here, whatever the selected tab, so switching tabs renders
 * the next card at once instead of flashing a skeleton between two renders.
 *
 * DCA and Limit are only offered when their realm path is configured. With
 * neither configured, the page renders the plain swap card as before.
 */
const SwapContainer: React.FC = () => {
  if (!IS_ORDER_ENABLED) return <SwapCardContainer />;
  return <SwapWithOrdersContainer />;
};

const SwapWithOrdersContainer: React.FC = () => {
  const router = useRouter();
  const swapValue = useAtomValue(SwapState.swap);
  const swapType = toEnabledSwapCardType(router.query.type, ENABLED_SWAP_CARD_TYPES);

  useGetDcaConfig({ enabled: ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.DCA) });
  useGetLimitConfig({ enabled: ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.LIMIT) });

  const changeSwapType = useCallback(
    (type: SwapCardType) => {
      if (type === swapType) return;
      // The pair carries over, so each card opens on the tokens the user already chose.
      const query: Record<string, string> = {};
      if (type !== SWAP_CARD_TYPE.SWAP) query.type = type;
      if (swapValue.tokenA?.path) query.from = swapValue.tokenA.path;
      if (swapValue.tokenB?.path) query.to = swapValue.tokenB.path;
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
    },
    [router, swapType, swapValue.tokenA?.path, swapValue.tokenB?.path],
  );

  switch (swapType) {
    case SWAP_CARD_TYPE.DCA:
      return <DcaOrderContainer swapType={swapType} changeSwapType={changeSwapType} />;
    case SWAP_CARD_TYPE.LIMIT:
      return <LimitOrderContainer swapType={swapType} changeSwapType={changeSwapType} />;
    default:
      return <SwapCardContainer swapType={swapType} changeSwapType={changeSwapType} />;
  }
};

export default SwapContainer;
