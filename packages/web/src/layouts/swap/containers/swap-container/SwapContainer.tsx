import { useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react";

import { GNOT_TOKEN_DEFAULT } from "@common/values/token-constant";
import useRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/data/use-swap-handler";
import { useGetTokens } from "@query/token";
import {
  getOriginToken,
  getSwapExtensionByOriginPath,
  getSwapExtensionForTokenSelector,
  swapExtensions,
} from "@resources/swap-extension";
import { ThemeState } from "@states/index";

import SwapCard from "../../components/swap-card/SwapCard";

const SwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { data: { tokens = [] } = {} } = useGetTokens(true);
  const originTokens = useMemo(
    () =>
      swapExtensions
        .map(extension => getOriginToken(extension, tokens))
        .filter(token => token !== null),
    [tokens],
  );

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
    isRefetching,
    setSwapValue,
    setSwapRateAction,
    priceImpactStatus,
    setTokenAAmount,
    isSameToken,
    handleResetEstimatedLiquidity,
    initializeSwapTokenInputAmount,
  } = useSwapHandler();
  const additionalTokenATokens = useMemo(() => {
    const extension = getSwapExtensionForTokenSelector(swapTokenInfo.tokenA?.path, swapTokenInfo.tokenB?.path);
    if (!extension) return [];
    const originToken = originTokens.find(token => token.path === extension.originTokenPath);
    return originToken ? [originToken] : [];
  }, [originTokens, swapTokenInfo.tokenA?.path, swapTokenInfo.tokenB?.path]);
  const additionalTokenBTokens = useMemo(() => {
    const extension = getSwapExtensionForTokenSelector(swapTokenInfo.tokenB?.path, swapTokenInfo.tokenA?.path);
    if (!extension) return [];
    const originToken = originTokens.find(token => token.path === extension.originTokenPath);
    return originToken ? [originToken] : [];
  }, [originTokens, swapTokenInfo.tokenA?.path, swapTokenInfo.tokenB?.path]);

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
    });
    setTokenAAmount("");
  }, []);

  useEffect(() => {
    const query = router.query;
    if (!query.from && !query.to) {
      setSwapValue({
        tokenA: GNOT_TOKEN_DEFAULT,
        tokenB: null,
        type: "EXACT_IN",
      });
      setTokenAAmount("");
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const query = router.query;
    let currentTokenA = [...tokens, ...originTokens].find(token => token.path === query.from) || null;
    let currentTokenB = [...tokens, ...originTokens].find(token => token.path === query.to) || null;
    const tokenAExtension = getSwapExtensionByOriginPath(currentTokenA?.path);
    const tokenBExtension = getSwapExtensionByOriginPath(currentTokenB?.path);
    if (tokenAExtension && currentTokenB?.path !== tokenAExtension.grc20WrappedTokenPath) {
      currentTokenB = tokens.find(token => token.path === tokenAExtension.grc20WrappedTokenPath) || null;
    }
    if (tokenBExtension && currentTokenA?.path !== tokenBExtension.grc20WrappedTokenPath) {
      currentTokenA = tokens.find(token => token.path === tokenBExtension.grc20WrappedTokenPath) || null;
    }
    const tokenAAmountQuery = (query.token_a_amount ?? "") as string;
    const tokenBAmountQuery = (query.token_b_amount ?? "") as string;
    const direction = tokenAAmountQuery || tokenAExtension || tokenBExtension ? "EXACT_IN" : tokenBAmountQuery ? "EXACT_OUT" : "EXACT_IN";
    if (!currentTokenA && !currentTokenB) return;
    setSwapValue({
      tokenA: currentTokenA,
      tokenB: currentTokenB,
      type: direction,
      tokenAAmount: tokenAAmountQuery,
      tokenBAmount: tokenBAmountQuery,
    });
  }, [initialized, originTokens, router.query, tokens]);

  // Initialize token information when component mounts/unmounts
  useEffect(() => {
    initializeSwapTokenInputAmount();

    return () => initializeSwapTokenInputAmount();
  }, []);

  return (
    <SwapCard
      connectedWallet={connectedWallet}
      copied={copied}
      swapTokenInfo={swapTokenInfo}
      swapSummaryInfo={swapSummaryInfo}
      swapRouteInfos={swapRouteInfos}
      additionalTokenATokens={additionalTokenATokens}
      additionalTokenBTokens={additionalTokenBTokens}
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
      priceImpactStatus={priceImpactStatus}
      resetEstimatedLiquidity={handleResetEstimatedLiquidity}
      isSameToken={isSameToken}
      isRefetching={isRefetching}
    />
  );
};

export default SwapContainer;
