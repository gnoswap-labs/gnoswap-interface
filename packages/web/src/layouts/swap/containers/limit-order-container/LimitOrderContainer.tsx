import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import React, { useCallback } from "react";

import { useLimitOrderHandler } from "@hooks/order/data/use-limit-order-handler";
import { getQueryString, useOrderQueryTokens } from "@hooks/order/data/use-order-query-tokens";
import { SwapCardType } from "@models/order/order-type";
import { ThemeState } from "@states/index";

import LimitOrderCard from "../../components/limit-order-card/LimitOrderCard";

interface LimitOrderContainerProps {
  swapType: SwapCardType;
  changeSwapType: (type: SwapCardType) => void;
}

const LimitOrderContainer: React.FC<LimitOrderContainerProps> = ({ swapType, changeSwapType }) => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const handler = useLimitOrderHandler();
  const { changeSellAmount, setLimitPrice, changeExpiry } = handler;

  // A shared link may carry `amount`, `price` and `expiry`.
  const applyQuery = useCallback(
    (query: Record<string, string | string[] | undefined>) => {
      const amount = getQueryString(query.amount);
      const price = getQueryString(query.price);
      const expiry = Number(getQueryString(query.expiry));
      if (amount && BigNumber(amount).isGreaterThan(0)) changeSellAmount(amount);
      if (price && BigNumber(price).isGreaterThan(0)) setLimitPrice(price);
      if (Number.isInteger(expiry) && expiry > 0) changeExpiry(expiry);
    },
    [changeExpiry, changeSellAmount, setLimitPrice],
  );
  useOrderQueryTokens(applyQuery);

  return (
    <LimitOrderCard
      swapType={swapType}
      changeSwapType={changeSwapType}
      copied={handler.copied}
      copyURL={handler.copyURL}
      slippage={handler.slippage}
      changeSlippage={handler.changeSlippage}
      maxSlippage={handler.maxSlippage}
      themeKey={themeKey}
      isLoading={handler.isLoadingConfig}
      connectedWallet={handler.connected}
      tokenA={handler.tokenA}
      tokenB={handler.tokenB}
      tokenABalance={handler.tokenABalance}
      makeMaxAmountMessages={handler.makeMaxAmountMessages}
      maxAmountDependsOn={handler.maxAmountDependsOn}
      tokenBBalance={handler.tokenBBalance}
      sellAmount={handler.sellAmount}
      sellAmountUsd={handler.sellAmountUsd}
      buyAmount={handler.buyAmount}
      buyAmountUsd={handler.buyAmountUsd}
      changeTokenA={handler.changeTokenA}
      changeTokenB={handler.changeTokenB}
      changeSellAmount={handler.changeSellAmount}
      changeBuyAmount={handler.changeBuyAmount}
      switchTokens={handler.switchTokens}
      limitPrice={handler.limitPrice}
      marketPrice={handler.marketPrice}
      changeLimitPrice={handler.changeLimitPrice}
      stepPrice={handler.stepPrice}
      applyPreset={handler.applyPreset}
      expiry={handler.expiry}
      expiryOptions={handler.expiryOptions}
      changeExpiry={handler.changeExpiry}
      buttonState={handler.buttonState}
      buttonText={handler.buttonText}
      minTradingText={handler.minTradingText}
      onClickButton={handler.onClickButton}
    />
  );
};

export default LimitOrderContainer;
