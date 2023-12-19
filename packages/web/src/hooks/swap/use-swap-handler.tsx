import { useNotice } from "@hooks/common/use-notice";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { AmountModel } from "@models/common/amount-model";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { SwapState } from "@states/index";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSwap } from "./use-swap";
import { SwapRouteResponse } from "@repositories/swap/response/swap-route-response";
import { TNoticeType } from "src/context/NoticeContext";
import { checkGnotPath, makeRandomId } from "@utils/common";
import { matchInputNumber } from "@utils/number-utils";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { formatUsdNumber } from "@utils/stake-position-utils";

export const useSwapHandler = () => {
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const {
    tokenA = null,
    tokenB = null,
    type = "EXACT_IN",
    tokenAAmount: defaultTokenAAmount,
  } = swapValue;

  const [tokenAAmount, setTokenAAmount] = useState<string>(
    defaultTokenAAmount ?? "",
  );
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const [gasFeeAmount] = useState<AmountModel>({
    amount: 0.000001,
    currency: "GNOT",
  });
  const [openedConfirmModal, setOpenedConfirModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setNotice } = useNotice();
  const {
    connected: connectedWallet,
    isSwitchNetwork,
    switchNetwork,
  } = useWallet();
  const {
    tokenPrices,
    displayBalanceMap,
    updateTokens,
    updateTokenPrices,
    updateBalances,
    getTokenUSDPrice,
    getTokenPriceRate,
  } = useTokenData();
  const { slippage, changeSlippage } = useSlippage();
  const { openModal } = useConnectWalletModal();
  const {
    isSameToken,
    estimatedRoutes,
    tokenAmountLimit,
    swapState,
    swap,
    estimateSwapRoute,
    wrapToken,
    unwrapToken,
  } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage,
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
        currency: "ugnot",
      },
      gasFeeUSD: 1,
    }));
  }, [estimatedRoutes, tokenA, tokenB]);

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
    if (!tokenA || !tokenPrices[checkGnotPath(tokenA.path)]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenA.path)].usd)
      .toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!tokenB || !tokenPrices[checkGnotPath(tokenB.path)]) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenB.path)].usd)
      .toNumber();
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
    if (!isSameToken && swapState === "NO_LIQUIDITY") {
      return "Insufficient Liquidity";
    }

    if (type === "EXACT_IN") {
      if (
        Number(tokenAAmount) >
        Number(parseFloat(tokenABalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    } else {
      if (
        Number(tokenBAmount) >
        Number(parseFloat(tokenBBalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    }
    if (isSameToken) {
      if (isNativeToken(tokenA)) {
        return "Wrap";
      }
      return "Unwrap";
    }
    return "Swap";
  }, [
    connectedWallet,
    isSwitchNetwork,
    tokenA,
    tokenB,
    tokenAAmount,
    isSameToken,
    type,
    tokenBAmount,
    swapState,
    tokenABalance,
    tokenBBalance,
  ]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: formatUsdNumber(tokenAUSD.toString()),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: formatUsdNumber(tokenBUSD.toString()),
      direction: type,
      slippage,
    };
  }, [
    slippage,
    type,
    tokenA,
    tokenAAmount,
    tokenABalance,
    tokenAUSD,
    tokenB,
    tokenBAmount,
    tokenBBalance,
    tokenBUSD,
  ]);

  const swapSummaryInfo: SwapSummaryInfo | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }
    if (isSameToken) {
      return {
        tokenA,
        tokenB,
        swapDirection: "EXACT_IN",
        swapRate: 1,
        swapRateUSD: getTokenUSDPrice(tokenA.priceId, 1) || 1,
        priceImpact: 0,
        guaranteedAmount: {
          amount: Number(tokenAAmount),
          currency: tokenB.symbol,
        },
        gasFee: gasFeeAmount,
        gasFeeUSD: BigNumber(gasFeeAmount.amount).multipliedBy(1).toNumber(),
      };
    }
    const targetTokenA = type === "EXACT_IN" ? tokenA : tokenB;
    const targetTokenB = type === "EXACT_IN" ? tokenB : tokenA;
    const inputAmount = type === "EXACT_IN" ? tokenAAmount : tokenBAmount;
    const outputAmount = type === "EXACT_IN" ? tokenBAmount : tokenAAmount;

    const tokenAUSDPrice = getTokenUSDPrice(tokenA.priceId, 1);
    const tokenPairPriceRate = getTokenPriceRate(
      targetTokenA.priceId,
      targetTokenB.priceId,
    );
    const swapRate = tokenPairPriceRate ? tokenPairPriceRate : 0;
    const swapRateUSD = tokenAUSDPrice
      ? Number((Number(tokenAAmount) * tokenAUSDPrice).toFixed(4))
      : 0;
    const priceImpactNum = BigNumber(
      swapRate * Number(inputAmount) - Number(outputAmount),
    )
      .multipliedBy(100)
      .dividedBy(swapRate * Number(inputAmount))
      .abs();
    const priceImpact = priceImpactNum.isGreaterThan(100)
      ? 100
      : Number(priceImpactNum.toFixed(2));
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
  }, [
    tokenA,
    tokenB,
    isSameToken,
    type,
    tokenAAmount,
    tokenBAmount,
    gasFeeAmount,
    tokenAmountLimit,
  ]);

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
    if (
      (Number(tokenAAmount) !== 0 && Number(tokenAAmount) < 0.000001) ||
      Number(tokenBAmount) < 0.000001
    ) {
      return false;
    }
    if (type === "EXACT_IN") {
      if (
        Number(tokenAAmount) >
        Number(parseFloat(tokenABalance.replace(/,/g, "")))
      ) {
        return false;
      }
    } else {
      if (
        Number(tokenBAmount) >
        Number(parseFloat(tokenBBalance.replace(/,/g, "")))
      ) {
        return false;
      }
    }
    return true;
  }, [
    isLoading,
    connectedWallet,
    isSwitchNetwork,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    type,
    tokenABalance,
    tokenBBalance,
  ]);

  const checkBalance = useCallback(
    (token: TokenModel, amount: string) => {
      const tokenBalance = displayBalanceMap[token.priceId] || 0;
      return BigNumber(tokenBalance).isGreaterThan(amount);
    },
    [displayBalanceMap],
  );

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

  const changeTokenAAmount = useCallback(
    (value: string, none?: boolean) => {
      if (isSameToken) {
        setTokenAAmount(value);
        setTokenBAmount(value);

        setSwapValue(prev => ({
          ...prev,
          tokenAAmount: value,
          tokenBAmount: value,
          type: "EXACT_IN",
        }));
        return;
      }
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
      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_IN",
      }));
      setTokenAAmount(value);
    },
    [isSameToken],
  );

  useEffect(() => {
    setSwapValue(prev => ({
      ...prev,
      tokenAAmount,
      tokenBAmount,
    }));
  }, [setSwapValue, tokenAAmount, tokenBAmount]);

  const changeTokenBAmount = useCallback(
    (value: string, none?: boolean) => {
      if (isSameToken) {
        setTokenAAmount(value);
        setTokenBAmount(value);
        setSwapValue(prev => ({
          ...prev,
          tokenAAmount: value,
          tokenBAmount: value,
          type: "EXACT_IN",
        }));
        return;
      }
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
      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_OUT",
      }));
      setTokenBAmount(value);
    },
    [isSameToken],
  );

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      let changedSwapDirection = type;
      if (tokenB?.symbol === token.symbol) {
        changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
        setTokenAAmount(tokenBAmount);
        setTokenBAmount(tokenAAmount);
      }
      setSwapValue(prev => ({
        tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
        tokenB:
          prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
        type: changedSwapDirection,
      }));
    },
    [tokenA, tokenB, type, tokenBAmount, tokenAAmount],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      let changedSwapDirection = type;
      if (tokenA?.symbol === token.symbol) {
        changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
        setTokenAAmount(tokenBAmount);
        setTokenBAmount(tokenAAmount);
      }
      setSwapValue(prev => ({
        tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
        tokenA:
          prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
        type: changedSwapDirection,
      }));
    },
    [tokenA, type, tokenBAmount, tokenAAmount],
  );

  const switchSwapDirection = useCallback(() => {
    if (isSameToken) {
      setSwapValue(prev => ({
        tokenA: prev.tokenB,
        tokenB: prev.tokenA,
        type: "EXACT_IN",
      }));
      return;
    }
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
  }, [isSameToken, tokenA, tokenB, type, tokenAAmount, tokenBAmount]);

  const copyURL = async () => {
    try {
      const protocol = window?.location?.protocol || "";
      const host = window?.location?.host || "";
      const url = `${protocol}://${host}/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  function unwrapBySwapResposne(swapReponse: SwapRouteResponse) {
    if (!tokenA || !tokenB) {
      return;
    }
    const { resultToken, resultAmount, slippageAmount } = swapReponse;
    if (isNativeToken(tokenB) && type === "EXACT_IN") {
      unwrapToken(resultToken, BigNumber(resultAmount).toString());
    }
    if (isNativeToken(tokenA) && type === "EXACT_OUT") {
      const difference = BigNumber(slippageAmount).minus(resultAmount);
      if (difference.isGreaterThan(0)) {
        unwrapToken(resultToken, difference.toString());
      }
    }
  }

  function executeSwap() {
    if (!tokenA || !tokenB) {
      return;
    }
    setSubmitted(true);
    if (isSameToken) {
      setNotice(null, {
        timeout: 50000,
        type: "pending",
        closeable: true,
        id: makeRandomId(),
      });
      const nativeProcess = isNativeToken(tokenA)
        ? wrapToken(tokenA, tokenAAmount)
        : unwrapToken(tokenA, tokenAAmount);
      nativeProcess.then(response => {
        setTimeout(() => {
          if (response === false) {
            setNotice(null, {
              timeout: 50000,
              type: "error" as TNoticeType,
              closeable: true,
              id: makeRandomId(),
            });
          } else {
            setNotice(null, {
              timeout: 50000,
              type: "success" as TNoticeType,
              closeable: true,
              id: makeRandomId(),
            });
          }
        }, 1000);
        if (response !== false) {
          setSwapResult({
            success: true,
            hash: (response as unknown as SwapRouteResponse)?.hash || "",
          });
        } else {
          setSwapResult({
            success: false,
            hash: "",
          });
        }
      });
      return;
    }
    const swapAmount = type === "EXACT_IN" ? tokenAAmount : tokenBAmount;
    swap(estimatedRoutes, swapAmount)
      .then(result => {
        if (result !== false) {
          setNotice(null, {
            timeout: 50000,
            type: "pending",
            closeable: true,
            id: makeRandomId(),
          });
          setTimeout(() => {
            if (!!result) {
              if (typeof result !== "boolean") {
                unwrapBySwapResposne(result);
              }
              setNotice(null, {
                timeout: 50000,
                type: "success" as TNoticeType,
                closeable: true,
                id: makeRandomId(),
              });
            } else {
              setNotice(null, {
                timeout: 50000,
                type: "error" as TNoticeType,
                closeable: true,
                id: makeRandomId(),
              });
            }
          }, 1000);
        }
        setSwapResult({
          success: !!result,
          hash: (result as unknown as SwapRouteResponse)?.hash || "",
        });
      })
      .catch(() => {
        setSwapResult({
          success: false,
          hash: "",
        });
      });
  }

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
    // setSwapValue({
    //   tokenA: null,
    //   tokenB: null,
    //   type: "EXACT_IN",
    // });
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
    if (isSameToken) {
      setIsLoading(() => false);
      return;
    }
    const isExactIn = type === "EXACT_IN";
    const changedAmount = isExactIn ? tokenAAmount : tokenBAmount;

    if (
      Number.isNaN(changedAmount) ||
      BigNumber(changedAmount).isLessThanOrEqualTo(0)
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      estimateSwapRoute(changedAmount).then(result => {
        const isError = result === null;
        const expectedAmount = isError ? "" : result.amount;
        if (isError) {
          if (isExactIn) {
            setTokenBAmount("0");
          } else {
            setTokenAAmount("0");
          }
        } else {
          if (
            !checkBalance(tokenA, tokenAAmount) ||
            !checkBalance(tokenB, tokenBAmount)
          ) {
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
  }, [type, tokenA, tokenAAmount, tokenB, tokenBAmount, isSameToken]);

  return {
    slippage,
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
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
  };
};
