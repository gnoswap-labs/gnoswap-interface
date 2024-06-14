import React, { useEffect, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapDirectionType } from "@common/values";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import useRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";
import { GNOT_TOKEN_DEFAULT } from "@common/values/token-constant";

const SwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { tokens } = useTokenData();

  const {
    connectedWallet,
    copied,
    swapTokenInfo,
    swapSummaryInfo,
    swapRouteInfos,
    isAvailSwap,
    swapButtonText,
    submitted,
    swapResult,
    openedConfirmModal,
    changeTokenA,
    changeTokenAAmount,
    changeTokenB,
    changeTokenBAmount,
    changeSlippage,
    switchSwapDirection,
    openConfirmModal,
    openConnectWallet,
    closeModal,
    copyURL,
    executeSwap,
    isSwitchNetwork,
    switchNetwork,
    isLoading,
    setSwapValue,
    setSwapRateAction,
  } = useSwapHandler();

  useEffect(() => {
    if (!initialized && tokens.length > 0) {
      setInitialized(true);
    }
  }, [tokens]);

  useEffect(() => {
    if (router.pathname !== router.asPath) return;
    setSwapValue({
      tokenA: GNOT_TOKEN_DEFAULT,
      tokenB: null,
      type: "EXACT_IN",
      tokenAAmount: "",
    });
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const query = router.query;
    const currentTokenA =
      tokens.find(token => token.path === query.from) || null;
    const currentTokenB = tokens.find(token => token.path === query.to) || null;
    const direction = query.direction as SwapDirectionType;
    const tokenAAmountQuery = (query.token_a_amount ?? "") as string;
    const tokenBAmountQuery = (query.token_b_amount ?? "") as string;
    if (!currentTokenA && !currentTokenB) return;
    setSwapValue({
      tokenA: currentTokenA,
      tokenB: currentTokenB,
      type: direction,
      tokenAAmount: tokenAAmountQuery,
      tokenBAmount: tokenBAmountQuery,
    });
  }, [initialized, router.query, tokens]);

  return (
    <SwapCard
      connectedWallet={connectedWallet}
      copied={copied}
      swapTokenInfo={swapTokenInfo}
      swapSummaryInfo={swapSummaryInfo}
      swapRouteInfos={swapRouteInfos}
      isAvailSwap={isAvailSwap}
      swapButtonText={swapButtonText}
      submitted={submitted}
      swapResult={swapResult}
      openedConfirmModal={openedConfirmModal}
      changeTokenA={changeTokenA}
      changeTokenAAmount={changeTokenAAmount}
      changeTokenB={changeTokenB}
      changeTokenBAmount={changeTokenBAmount}
      changeSlippage={changeSlippage}
      switchSwapDirection={switchSwapDirection}
      openConfirmModal={openConfirmModal}
      openConnectWallet={openConnectWallet}
      closeModal={closeModal}
      copyURL={copyURL}
      swap={executeSwap}
      themeKey={themeKey}
      isSwitchNetwork={isSwitchNetwork}
      switchNetwork={switchNetwork}
      isLoading={isLoading}
      setSwapRateAction={setSwapRateAction}
    />
  );
};

export default SwapContainer;
