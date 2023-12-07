import React, { useCallback, useEffect, useMemo, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useSwap } from "@hooks/swap/use-swap";
import { TokenModel } from "@models/token/token-model";
import { useTokenData } from "@hooks/token/use-token-data";
import BigNumber from "bignumber.js";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapDirectionType } from "@common/values";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { AmountModel } from "@models/common/amount-model";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapResponse } from "@repositories/swap";
import { matchInputNumber, numberToUSD } from "@utils/number-utils";
import { SwapState } from "@states/index";
import { useAtomValue, useAtom } from "jotai";
import { ThemeState } from "@states/index";
import { useRouter } from "next/router";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useNotice } from "@hooks/common/use-notice";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { TNoticeType } from "src/context/NoticeContext";
import { useSlippage } from "@hooks/common/use-slippage";

const SwapContainer: React.FC = () => {
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN", tokenAAmount: defaultTokenAAmount } = swapValue;
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const { setNotice } = useNotice();

  const [query, setQuery] = useState<{ [key in string]: string | null }>({});
  const [initialized, setInitialized] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork, switchNetwork } = useWallet();
  const { tokens, tokenPrices, displayBalanceMap, updateTokens, updateTokenPrices, updateBalances, getTokenUSDPrice, getTokenPriceRate } = useTokenData();
  const [tokenAAmount, setTokenAAmount] = useState<string>(defaultTokenAAmount ?? "");
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const { slippage, changeSlippage } = useSlippage();

  const [gasFeeAmount] = useState<AmountModel>({
    amount: 0.000001,
    currency: "GNOT"
  });
  const [openedConfirmModal, setOpenedConfirModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { openModal } = useConnectWalletModal();

  const { estimatedRoutes, tokenAmountLimit, swap, estimateSwapRoute } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage
  });

  usePreventScroll(openedConfirmModal || submitted);

  const swapRouteInfos: SwapRouteInfo[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }
    return estimatedRoutes.map(route => ({
      version: "V1",
      from: tokenA,
      to: tokenB,
      pools: route.pools,
      weight: route.quote,
      gasFee: {
        amount: 1,
        currency: "ugnot"
      },
      gasFeeUSD: 1
    }));
  }, [estimatedRoutes, tokenA, tokenB]);

  const checkBalance = useCallback((token: TokenModel, amount: string) => {
    const tokenBalance = displayBalanceMap[token.priceId] || 0;
    return BigNumber(tokenBalance).isGreaterThan(amount);
  }, [displayBalanceMap]);

  const tokenABalance = useMemo(() => {
    if (tokenA && !Number.isNaN(displayBalanceMap[tokenA.priceId])) {
      return BigNumber(displayBalanceMap[tokenA.priceId] || 0).toFormat();
    }
    return "-";
  }, [displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && !Number.isNaN(displayBalanceMap[tokenB.priceId])) {
      return BigNumber(displayBalanceMap[tokenB.priceId] || 0).toFormat();
    }
    return "-";
  }, [displayBalanceMap, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[tokenA.path]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount).multipliedBy(tokenPrices[tokenA.path].usd).toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!tokenB || !tokenPrices[tokenB.path]) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount).multipliedBy(tokenPrices[tokenB.path].usd).toNumber();
  }, [tokenB, tokenBAmount, tokenPrices]);

  const swapButtonText = useMemo(() => {
    if (!connectedWallet) {
      return "Wallet Login";
    }
    if (isSwitchNetwork) {
      return "Switch to Gnoland";
    }
    if (!tokenA || !tokenB) {
      return "Select a Token";
    }
    if (!Number(tokenAAmount) && !Number(tokenAAmount)) {
      return "Enter Amount";
    }
    if (
      (Number(tokenAAmount) < 0.000001 && type === "EXACT_IN") ||
      (Number(tokenBAmount) < 0.000001 && type === "EXACT_OUT")
    ) {
      return "Amount Too Low";
    }

    if (type === "EXACT_IN") {
      if (
        Number(tokenAAmount) > Number(parseFloat(tokenABalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    } else {
      if (
        Number(tokenBAmount) > Number(parseFloat(tokenBBalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    }
    return "Swap";
  }, [connectedWallet, tokenA, tokenB, isSwitchNetwork, tokenAAmount, tokenBAmount, type, tokenBBalance, tokenABalance]);

  const openConfirmModal = useCallback(() => {
    setOpenedConfirModal(true);
  }, []);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const closeModal = useCallback(() => {
    setSubmitted(false);
    setSwapResult(null);
    setOpenedConfirModal(false);
    updateBalances();
  }, [updateBalances]);

  const changeTokenAAmount = useCallback((value: string, none?: boolean) => {
    if (none) {
      setIsLoading(false);
      return;
    }
    if (!matchInputNumber(value)) {
      return;
    }
    if (!!Number(value)) {
      setIsLoading(true);
    } else {
      setTokenBAmount("0");
    }
    setSwapValue((prev) => ({
      ...prev,
      type: "EXACT_IN",
    }));
    setTokenAAmount(value);
    setQuery({ ...query, direction: "EXACT_IN" });
  }, [query, setTokenBAmount]);

  const changeTokenBAmount = useCallback((value: string, none?: boolean) => {
    if (none) {
      setIsLoading(false);
      return;
    }
    if (!matchInputNumber(value)) {
      return;
    }
    if (!!Number(value)) {
      setIsLoading(true);
    } else {
      setTokenAAmount("0");
    }
    setSwapValue((prev) => ({
      ...prev,
      type: "EXACT_OUT",
    }));
    setTokenBAmount(value);
    setQuery({ ...query, direction: "EXACT_OUT" });
  }, [query]);

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
      direction: type,
      slippage
    };
  }, [slippage, type, tokenA, tokenAAmount, tokenABalance, tokenAUSD, tokenB, tokenBAmount, tokenBBalance, tokenBUSD]);

  const swapSummaryInfo: SwapSummaryInfo | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }
    const targetTokenA = type === "EXACT_IN" ? tokenA : tokenB;
    const targetTokenB = type === "EXACT_IN" ? tokenB : tokenA;
    const inputAmount = type === "EXACT_IN" ? tokenAAmount : tokenBAmount;
    const outputAmount = type === "EXACT_IN" ? tokenBAmount : tokenAAmount;

    const tokenAUSDPrice = getTokenUSDPrice(tokenA.path, 1);
    const tokenPairPriceRate = getTokenPriceRate(targetTokenA.path, targetTokenB.path);
    const swapRate = tokenPairPriceRate ? tokenPairPriceRate : 0;
    const swapRateUSD = tokenAUSDPrice ? Number((Number(tokenAAmount) * tokenAUSDPrice).toFixed(4)) : 0;
    const priceImpactNum = BigNumber(swapRate * Number(inputAmount) - Number(outputAmount))
      .multipliedBy(100)
      .dividedBy(swapRate * Number(inputAmount))
      .abs();
    const priceImpact = priceImpactNum.isGreaterThan(100) ? 100 : Number(priceImpactNum.toFixed(2));
    const gasFeeUSD = BigNumber(gasFeeAmount.amount).multipliedBy(1).toNumber();

    return {
      tokenA,
      tokenB,
      swapDirection: type,
      swapRate,
      swapRateUSD,
      priceImpact,
      guaranteedAmount: {
        amount: tokenAmountLimit,
        currency: targetTokenB.symbol,
      },
      gasFee: gasFeeAmount,
      gasFeeUSD,
    };
  }, [tokenA, tokenB, type, tokenAAmount, tokenBAmount, tokenAUSD, gasFeeAmount, tokenAmountLimit]);

  const isAvailSwap = useMemo(() => {
    if (isLoading) return false;
    if (!connectedWallet) {
      return false;
    }
    if (isSwitchNetwork) {
      return false;
    }
    if (!tokenA || !tokenB) {
      return false;
    }
    if (!tokenAAmount && !tokenAAmount) {
      return false;
    }
    if (Number(tokenAAmount) !== 0 && Number(tokenAAmount) < 0.000001 || Number(tokenBAmount) < 0.000001) {
      return false;
    }
    if (type === "EXACT_IN") {
      if (Number(tokenAAmount) > Number(parseFloat(tokenABalance.replace(/,/g, "")))) {
        return false;
      }
    } else {
      if (Number(tokenBAmount) > Number(parseFloat(tokenBBalance.replace(/,/g, "")))) {
        return false;
      }
    }
    return true;
  }, [connectedWallet, tokenA, tokenB, isSwitchNetwork, tokenAAmount, tokenBAmount, type, tokenBBalance, tokenABalance, isLoading]);

  const changeTokenA = useCallback((token: TokenModel) => {
    let changedSwapDirection = type;
    if (tokenB?.symbol === token.symbol) {
      changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
      setTokenAAmount(tokenBAmount);
      setTokenBAmount(tokenAAmount);
    }
    setSwapValue((prev) => ({
      tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
      tokenB: prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
      type: changedSwapDirection,
    }));
    setQuery({ ...query, tokenA: token.path });
  }, [tokenA, tokenB, type, tokenBAmount, tokenAAmount, query]);

  const changeTokenB = useCallback((token: TokenModel) => {
    let changedSwapDirection = type;
    if (tokenA?.symbol === token.symbol) {
      changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
      setTokenAAmount(tokenBAmount);
      setTokenBAmount(tokenAAmount);
    }
    setSwapValue((prev) => ({
      tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
      tokenA: prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
      type: changedSwapDirection,
    }));
    setQuery({ ...query, tokenB: token.path });
  }, [tokenA, type, tokenBAmount, tokenAAmount, query]);

  const switchSwapDirection = useCallback(() => {
    const preTokenA = tokenA ? { ...tokenA } : null;
    const preTokenB = tokenB ? { ...tokenB } : null;
    const changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";

    if (!!Number(tokenAAmount || 0) && !!Number(tokenBAmount || 0)) {
      setIsLoading(true);
    }
    setSwapValue(() => ({
      tokenA: preTokenB,
      tokenB: preTokenA,
      type: changedSwapDirection,
    }));
    if (changedSwapDirection === "EXACT_IN") {
      setTokenAAmount(tokenBAmount);
      if (!preTokenA || !preTokenB) {
        setTokenBAmount(tokenAAmount);
      }
    } else {
      setTokenBAmount(tokenAAmount);
      if (!preTokenA || !preTokenB) {
        setTokenAAmount(tokenBAmount);
      }
    }
    setQuery({
      tokenA: preTokenB?.path || null,
      tokenB: preTokenA?.path || null,
      direction: changedSwapDirection
    });
  }, [type, tokenA, tokenAAmount, tokenB, tokenBAmount]);

  const copyURL = async () => {
    try {
      const url = `https://gnoswap.io/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  function executeSwap() {
    if (!tokenA || !tokenB) {
      return;
    }
    setSubmitted(true);
    const swapAmount = type === "EXACT_IN" ? tokenAAmount : tokenBAmount;
    swap(estimatedRoutes, swapAmount).then(result => {
      if (result !== false) {
        setNotice(null, { timeout: 50000, type: "pending", closeable: true, id: Math.random() * 19999 });
        setTimeout(() => {
          if (!!result) {
            setNotice(null, { timeout: 50000, type: "success" as TNoticeType, closeable: true, id: Math.random() * 19999 });
          } else {
            setNotice(null, { timeout: 50000, type: "error" as TNoticeType, closeable: true, id: Math.random() * 19999 });
          }
        }, 1000);
      }
      setSwapResult({
        success: result !== null,
        hash: (result as unknown as SwapResponse)?.tx_hash || "",
      });
    }).catch(() => {
      setSwapResult({
        success: false,
        hash: "",
      });
    });
  }

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });
  }, []);

  useEffect(() => {
    if (defaultTokenAAmount) {
      setIsLoading(true);
    }
  }, [defaultTokenAAmount]);


  useEffect(() => {
    if (!tokenA || !tokenB) {
      return;
    }
    const isExactIn = type === "EXACT_IN";
    const changedAmount = isExactIn ? tokenAAmount : tokenBAmount;

    if (Number.isNaN(changedAmount) || BigNumber(changedAmount).isLessThanOrEqualTo(0)) {
      return;
    }

    const timeout = setTimeout(() => {
      estimateSwapRoute(changedAmount).then(result => {
        const isError = result === null;
        const expectedAmount = isError ? "" : result.amount;
        if (isError) {
        } else {
          if (!checkBalance(tokenA, tokenAAmount) ||
            !checkBalance(tokenB, tokenBAmount)) {
          }

          if (isExactIn) {
            setTokenBAmount(expectedAmount);
          } else {
            setTokenAAmount(expectedAmount);
          }
        }
        setIsLoading(() => false);
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [type, tokenA, tokenAAmount, tokenB, tokenBAmount]);

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
      setSwapValue({
        tokenA: currentTokenA,
        tokenB: currentTokenB,
        type: direction,
      });
      setQuery({
        tokenA: currentTokenA?.path || null,
        tokenB: currentTokenB?.path || null,
        direction,
      });
      return;
    }
  }, [initialized, router, tokenA?.path, tokenB?.path, tokens]);

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
    />
  );
};

export default SwapContainer;
