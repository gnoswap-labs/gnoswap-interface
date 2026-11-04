import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import React, { useCallback } from "react";

import { useDcaOrderHandler } from "@hooks/order/data/use-dca-order-handler";
import { getQueryString, useOrderQueryTokens } from "@hooks/order/data/use-order-query-tokens";
import { SwapCardType } from "@models/order/order-type";
import { ThemeState } from "@states/index";

import DcaOrderCard from "../../components/dca-order-card/DcaOrderCard";

interface DcaOrderContainerProps {
  swapType: SwapCardType;
  changeSwapType: (type: SwapCardType) => void;
}

const DcaOrderContainer: React.FC<DcaOrderContainerProps> = ({ swapType, changeSwapType }) => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const handler = useDcaOrderHandler();
  const { changeSellAmount, changeInterval, setExecutionCountInput } = handler;

  // A shared link may carry `amount`, `interval` and `count`.
  const applyQuery = useCallback(
    (query: Record<string, string | string[] | undefined>) => {
      const amount = getQueryString(query.amount);
      const interval = Number(getQueryString(query.interval));
      const count = Number(getQueryString(query.count));
      if (amount && BigNumber(amount).isGreaterThan(0)) changeSellAmount(amount);
      if (Number.isInteger(interval) && interval > 0) changeInterval(interval);
      if (Number.isInteger(count) && count > 0) setExecutionCountInput(`${count}`);
    },
    [changeInterval, changeSellAmount, setExecutionCountInput],
  );
  useOrderQueryTokens(applyQuery);

  return (
    <DcaOrderCard
      swapType={swapType}
      changeSwapType={changeSwapType}
      copied={handler.copied}
      copyURL={handler.copyURL}
      themeKey={themeKey}
      isLoading={handler.isLoadingConfig}
      connectedWallet={handler.connected}
      tokenA={handler.tokenA}
      tokenB={handler.tokenB}
      tokenABalance={handler.tokenABalance}
      sellAmount={handler.sellAmount}
      sellAmountUsd={handler.sellAmountUsd}
      changeTokenA={handler.changeTokenA}
      changeTokenB={handler.changeTokenB}
      changeSellAmount={handler.changeSellAmount}
      switchTokens={handler.switchTokens}
      interval={handler.interval}
      intervalOptions={handler.intervalOptions}
      changeInterval={handler.changeInterval}
      executionCountInput={handler.executionCountInput}
      maxExecutionCount={handler.maxExecutionCount}
      changeExecutionCount={handler.changeExecutionCount}
      commitExecutionCount={handler.commitExecutionCount}
      summary={handler.summary}
      buttonState={handler.buttonState}
      buttonText={handler.buttonText}
      minTradingText={handler.minTradingText}
      onClickButton={handler.onClickButton}
    />
  );
};

export default DcaOrderContainer;
