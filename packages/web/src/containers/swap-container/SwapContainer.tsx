import React, { useCallback, useMemo, useState } from "react";
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

const SwapContainer: React.FC = () => {
  const { connected: connectedWallet } = useWallet();
  const { balances, updateBalances } = useTokenData();
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
  const { swap } = useSwap();

  const openConfirmModal = useCallback(() => {
    setOpenedConfirModal(true);
  }, []);

  const openConnectWallet = useCallback(() => {
    setOpenedConfirModal(false);
  }, []);

  const closeModal = useCallback(() => {
    setSubmitted(false);
    setSwapResult(null);
    setOpenedConfirModal(false);
    updateBalances();
  }, [updateBalances]);

  const changeTokenAAmount = useCallback((value: string) => {
    setSwapDirection("EXACT_IN");
    setTokenAAmount(value);
  }, []);

  const changeTokenBAmount = useCallback((value: string) => {
    setSwapDirection("EXACT_OUT");
    setTokenBAmount(value);
  }, []);

  const changeSlippage = useCallback((value: string) => {
    setSlippage(BigNumber(value).toNumber());
  }, [setSlippage]);

  const tokenABalance = useMemo(() => {
    if (tokenA && balances[tokenA.priceId]) {
      return "$" + BigNumber(balances[tokenA.priceId] || 0).toFixed();
    }
    return "-";
  }, [balances, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && balances[tokenB.priceId]) {
      return "$" + BigNumber(balances[tokenB.priceId] || 0).toFixed();
    }
    return "-";
  }, [balances, tokenB]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    const tokenAUSD = BigNumber(tokenAAmount).multipliedBy(1).toNumber();
    const tokenBUSD = BigNumber(tokenBAmount).multipliedBy(swapRate).toNumber();
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      direction: swapDirection,
      slippage
    };
  }, [slippage, swapDirection, swapRate, tokenA, tokenAAmount, tokenABalance, tokenB, tokenBAmount, tokenBBalance]);

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
    return true;
  }, []);

  const swapError = useMemo(() => {
    return null;
  }, []);

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
    swap(
      tokenA,
      tokenAAmount,
      tokenB,
      tokenBAmount,
      10000,
      swapDirection
    ).then(result => {
      setSwapResult({
        success: result !== null,
        hash: ""
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
