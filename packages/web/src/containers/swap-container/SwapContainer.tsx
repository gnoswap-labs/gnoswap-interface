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
import { numberToUSD } from "@utils/number-utils";

const SwapContainer: React.FC = () => {
  const { connected: connectedWallet, connectAdenaClient } = useWallet();
  const { tokenPrices, balances, updateTokenPrices, updateBalances } = useTokenData();
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

  useEffect(() => {
    updateTokenPrices();
  }, []);

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
    const numberValue = value.replace(/\D/, "");
    setSwapDirection("EXACT_IN");
    setTokenAAmount(numberValue);
    if (tokenA && tokenB && BigNumber(numberValue).isGreaterThan(0)) {
      getExpectedSwap(numberValue).then(amount => setTokenBAmount(amount || ""));
    }
  }, [getExpectedSwap, tokenA, tokenB]);

  const changeTokenBAmount = useCallback((value: string) => {
    const numberValue = value.replace(/\D/, "");
    setSwapDirection("EXACT_OUT");
    setTokenBAmount(numberValue);
    if (tokenA && tokenB && BigNumber(numberValue).isGreaterThan(0)) {
      getExpectedSwap(numberValue).then(amount => setTokenAAmount(amount || ""));
    }
  }, [getExpectedSwap, tokenA, tokenB]);

  const changeSlippage = useCallback((value: string) => {
    setSlippage(BigNumber(value).toNumber());
  }, [setSlippage]);

  const tokenABalance = useMemo(() => {
    if (tokenA && balances[tokenA.priceId]) {
      return BigNumber(balances[tokenA.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && balances[tokenB.priceId]) {
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

  const swapError = useMemo(() => {
    return null;
  }, []);

  const isAvailSwap = useMemo(() => {
    return swapError === null;
  }, [swapError]);

  const changeTokenA = useCallback((token: TokenModel) => {
    setTokenA(token);
  }, []);

  const changeTokenB = useCallback((token: TokenModel) => {
    setTokenB(token);
  }, []);

  const switchSwapDirection = useCallback(() => {
    const preTokenA = tokenA ? { ...tokenA } : null;
    const preTokenAAmount = tokenAAmount;
    const preTokenB = tokenB ? { ...tokenB } : null;
    const preTokenBAmount = tokenBAmount;
    const preSwapDirection = swapDirection;

    setTokenA(preTokenB);
    setTokenAAmount(preTokenBAmount);
    setTokenB(preTokenA);
    setTokenBAmount(preTokenAAmount);
    setSwapDirection(preSwapDirection === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN");

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

  return (
    <SwapCard
      connectedWallet={connectedWallet}
      copied={copied}
      swapTokenInfo={swapTokenInfo}
      swapSummaryInfo={swapSummaryInfo}
      swapRouteInfos={swapRouteInfos}
      isAvailSwap={isAvailSwap}
      swapError={swapError}
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
