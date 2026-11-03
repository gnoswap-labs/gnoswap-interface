import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";

import useRouter from "@hooks/common/use-custom-router";
import { SWAP_CARD_TYPE, SwapCardType, toSwapCardType } from "@models/order/order-type";
import { SwapState, ThemeState } from "@states/index";

import OrderCardSkeleton from "../../components/order-form/OrderCardSkeleton";
import { SwapCardWrapper } from "../../components/swap-card/SwapCard.styles";
import SwapCardHeader from "../../components/swap-card/swap-card-header/SwapCardHeader";
import DcaOrderContainer from "../dca-order-container/DcaOrderContainer";
import LimitOrderContainer from "../limit-order-container/LimitOrderContainer";
import SwapCardContainer from "../swap-card-container/SwapCardContainer";

/** How long the skeleton covers the card after switching between Swap, DCA and Limit. */
const TAB_SWITCH_SKELETON_MS = 300;

const noop = () => undefined;

/** Switches the swap card between Swap, DCA and Limit through the `type` query parameter. */
const SwapContainer: React.FC = () => {
  const router = useRouter();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const swapValue = useAtomValue(SwapState.swap);
  const swapType = toSwapCardType(router.query.type);
  const [switching, setSwitching] = useState(false);
  const previousType = useRef(swapType);

  useEffect(() => {
    if (previousType.current === swapType) return;
    previousType.current = swapType;
    setSwitching(true);
    const timer = setTimeout(() => setSwitching(false), TAB_SWITCH_SKELETON_MS);
    return () => clearTimeout(timer);
  }, [swapType]);

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

  if (switching) {
    return (
      <SwapCardWrapper>
        <SwapCardHeader
          copied={false}
          copyURL={noop}
          slippage={0}
          changeSlippage={noop}
          themeKey={themeKey}
          swapType={swapType}
          changeSwapType={changeSwapType}
        />
        <OrderCardSkeleton />
      </SwapCardWrapper>
    );
  }

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
