import React, { useCallback, useEffect, useMemo, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useSwap } from "@hooks/swap/use-swap";
import { TokenModel } from "@models/token/token-model";
import { useTokenData } from "@hooks/token/use-token-data";
import BigNumber from "bignumber.js";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapDirectionType, amountEmptyNumberInit } from "@common/values";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { AmountModel } from "@models/common/amount-model";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapResponse } from "@repositories/swap";
import { matchInputNumber, numberToUSD } from "@utils/number-utils";
import { SwapError } from "@common/errors/swap";
import { useRouter } from "next/router";

const SwapContainer: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState<{ [key in string]: string | null }>({});
  const [initialized, setInitialized] = useState(false);
  const { connected: connectedWallet, connectAdenaClient } = useWallet();
  const { tokens, tokenPrices, balances, updateTokens, updateTokenPrices, updateBalances } = useTokenData();
  const [swapError, setSwapError] = useState<SwapError | null>(null);
  const [tokenA, setTokenA] = useState<TokenModel | null>(null);
  const [tokenAAmount, setTokenAAmount] = useState<string>("0");
  const [tokenB, setTokenB] = useState<TokenModel | null>(null);
  const [tokenBAmount, setTokenBAmount] = useState<string>("0");
  const [swapDirection, setSwapDirection] = useState<SwapDirectionType>("EXACT_IN");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const [swapRate] = useState<number>(1);
  const [slippage, setSlippage] = useState(10);
  const [gasFeeAmount] = useState<AmountModel>(amountEmptyNumberInit);
  const [swapRouteInfos] = useState<SwapRouteInfo[]>([]);
  const [openedConfirmModal, setOpenedConfirModal] = useState(false);
  const { swap, getExpectedSwap } = useSwap({
    tokenA,
    tokenB,
    direction: swapDirection,
    slippage
  });

  const checkBalance = useCallback((token: TokenModel, amount: string) => {
    const tokenBalance = balances[token.priceId] || 0;
    return BigNumber(tokenBalance).isGreaterThan(amount);
  }, [balances]);

  const tokenABalance = useMemo(() => {
    if (tokenA && !Number.isNaN(balances[tokenA.priceId])) {
      return BigNumber(balances[tokenA.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && !Number.isNaN(balances[tokenB.priceId])) {
      return BigNumber(balances[tokenB.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[tokenA.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount).multipliedBy(tokenPrices[tokenA.priceId].usd).toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!tokenB || !tokenPrices[tokenB.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount).multipliedBy(tokenPrices[tokenB.priceId].usd).toNumber();
  }, [tokenB, tokenBAmount, tokenPrices]);

  const swapButtonText = useMemo(() => {
    if (!connectedWallet) {
      return "Connect Wallet";
    }
    if (!tokenA || !tokenB) {
      return "Insufficient Balance";
    }
    if (swapError) {
      return swapError.message;
    }
    return "Swap";
  }, [connectedWallet, swapError, tokenA, tokenB]);

  const openConfirmModal = useCallback(() => {
    setOpenedConfirModal(true);
  }, []);

  const openConnectWallet = useCallback(() => {
    connectAdenaClient();
  }, [connectAdenaClient]);

  const closeModal = useCallback(() => {
    setSubmitted(false);
    setSwapResult(null);
    setOpenedConfirModal(false);
    updateBalances();
  }, [updateBalances]);

  const changeTokenAAmount = useCallback((value: string) => {
    if (!matchInputNumber(value)) {
      return;
    }
    setSwapDirection("EXACT_IN");
    setTokenAAmount(value);
    setQuery({ ...query, direction: "EXACT_IN" });
  }, [query]);

  const changeTokenBAmount = useCallback((value: string) => {
    if (!matchInputNumber(value)) {
      return;
    }
    setSwapDirection("EXACT_OUT");
    setTokenBAmount(value);
    setQuery({ ...query, direction: "EXACT_OUT" });
  }, [query]);

  const changeSlippage = useCallback((value: string) => {
    setSlippage(BigNumber(value).toNumber());
  }, [setSlippage]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: numberToUSD(tokenAUSD),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: numberToUSD(tokenBUSD),
      direction: swapDirection,
      slippage
    };
  }, [slippage, swapDirection, tokenA, tokenAAmount, tokenABalance, tokenAUSD, tokenB, tokenBAmount, tokenBBalance, tokenBUSD]);

  const swapSummaryInfo: SwapSummaryInfo | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }
    const swapRateUSD = BigNumber(swapRate).multipliedBy(1).toNumber();
    const gasFeeUSD = BigNumber(gasFeeAmount.amount).multipliedBy(1).toNumber();
    return {
      tokenA,
      tokenB,
      swapDirection,
      swapRate,
      swapRateUSD,
      priceImpact: 0.1,
      guaranteedAmount: {
        amount: BigNumber(tokenBAmount).toNumber(),
        currency: tokenB.symbol,
      },
      gasFee: gasFeeAmount,
      gasFeeUSD,
    };
  }, [gasFeeAmount, swapDirection, swapRate, tokenA, tokenB, tokenBAmount]);

  const isAvailSwap = useMemo(() => {
    if (!tokenA || !tokenB) {
      return false;
    }
    return swapError === null;
  }, [swapError, tokenA, tokenB]);

  const changeTokenA = useCallback((token: TokenModel) => {
    setTokenA(token);
    setQuery({ ...query, tokenA: token.path });
  }, [query]);

  const changeTokenB = useCallback((token: TokenModel) => {
    setTokenB(token);
    setQuery({ ...query, tokenB: token.path });
  }, [query]);

  const switchSwapDirection = useCallback(() => {
    const preTokenA = tokenA ? { ...tokenA } : null;
    const preTokenB = tokenB ? { ...tokenB } : null;
    const changedSwapDirection = swapDirection === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";

    setTokenA(preTokenB);
    setTokenB(preTokenA);
    setSwapDirection(changedSwapDirection);
    if (changedSwapDirection === "EXACT_IN") {
      setTokenAAmount(tokenBAmount);
    } else {
      setTokenBAmount(tokenAAmount);
    }
    setQuery({
      tokenA: preTokenB?.path || null,
      tokenB: preTokenA?.path || null,
      direction: changedSwapDirection
    });
  }, [swapDirection, tokenA, tokenAAmount, tokenB, tokenBAmount]);

  const copyURL = async () => {
    try {
      const url = `https://gnoswap.io/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 500);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  function executeSwap() {
    if (!tokenA || !tokenB) {
      return;
    }
    setSubmitted(true);
    swap(tokenAAmount, tokenBAmount).then(result => {
      setSwapResult({
        success: result !== null,
        hash: (result as SwapResponse)?.tx_hash || "",
      });
    });
  }

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
  }, []);

  useEffect(() => {
    if (!tokenA || !tokenB) {
      return;
    }
    const isExactIn = swapDirection === "EXACT_IN";
    const changedAmount = isExactIn ? tokenAAmount : tokenBAmount;
    if (Number.isNaN(changedAmount) || BigNumber(changedAmount).isLessThanOrEqualTo(0)) {
      return;
    }
    getExpectedSwap(changedAmount).then(result => {
      const isError = result === null;
      const expectedAmount = isError ? "" : result;
      let swapError = null;
      if (isError) {
        swapError = new SwapError("INSUFFICIENT_BALANCE");
      }
      if (!checkBalance(tokenA, tokenAAmount) ||
        !checkBalance(tokenB, tokenBAmount)) {
        swapError = new SwapError("INSUFFICIENT_BALANCE");
      }

      if (isExactIn) {
        setTokenBAmount(expectedAmount);
      } else {
        setTokenAAmount(expectedAmount);
      }
      setSwapError(swapError);
    });
  }, [checkBalance, getExpectedSwap, swapDirection, tokenA, tokenAAmount, tokenB, tokenBAmount]);

  useEffect(() => {
    const queryValues = [];
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        queryValues.push(`${key}=${value}`);
      }
    }
    if (queryValues.length > 0) {
      const path = `${router.pathname}?${queryValues.join("&")}`;
      router.replace(path);
    }
  }, [query]);

  useEffect(() => {
    if (tokens.length === 0 || Object.keys(router.query).length === 0) {
      return;
    }
    if (!initialized) {
      setInitialized(true);
      const query = router.query;
      const currentTokenA = tokens.find(token => token.path === query.tokenA) || null;
      const currentTokenB = tokens.find(token => token.path === query.tokenB) || null;
      const direction: SwapDirectionType = query.direction === "EXACT_OUT" ? "EXACT_OUT" : "EXACT_IN";

      setTokenA(currentTokenA);
      setTokenB(currentTokenB);
      setSwapDirection(direction);
      setQuery({
        tokenA: currentTokenA?.path || null,
        tokenB: currentTokenB?.path || null,
        direction
      });
      return;
    }
  }, [initialized, router, swapDirection, tokenA?.path, tokenB?.path, tokens]);

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
    />
  );
};

export default SwapContainer;
