import { useNotice } from "@hooks/common/use-notice";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { AmountModel } from "@models/common/amount-model";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { CommonState, SwapState } from "@states/index";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSwap } from "./use-swap";
import { TNoticeType } from "src/context/NoticeContext";
import {
  checkGnotPath,
  isGNOTPath,
  makeRandomId,
  toNativePath,
} from "@utils/common";
import { matchInputNumber } from "@utils/number-utils";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { formatUsdNumber } from "@utils/stake-position-utils";
import useRouter from "@hooks/common/use-custom-router";
import { isEmptyObject } from "@utils/validation-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import {
  makeBroadcastSwapMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import { ERROR_VALUE } from "@common/errors/adena";
import { MINIMUM_GNOT_SWAP_AMOUNT } from "@common/values";

function handleAmount(changed: string, token: TokenModel | null) {
  let value = changed;
  const decimals = token?.decimals || 0;
  if (!value || BigNumber(value).isZero()) {
    value = changed;
  } else {
    value = BigNumber(value).toFixed(decimals || 0, 1);
  }

  if (BigNumber(changed).isEqualTo(value)) {
    const dotIndex = changed.indexOf(".");
    if (dotIndex === -1 || changed.length - dotIndex - 1 < decimals) {
      value = changed;
    }
  }

  return value;
}

export const useSwapHandler = () => {
  const router = useRouter();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const {
    tokenA = null,
    tokenB = null,
    type = "EXACT_IN",
    tokenAAmount: defaultTokenAAmount,
    tokenBAmount: defaultTokenBAmount,
  } = swapValue;

  const [swapRateAction, setSwapRateAction] = useState<"ATOB" | "BTOA">("BTOA");
  const [tokenAAmount, setTokenAAmount] = useState<string>(
    defaultTokenAAmount ?? "",
  );
  const [tokenBAmount, setTokenBAmount] = useState<string>(
    !defaultTokenAAmount && defaultTokenBAmount ? defaultTokenBAmount : "",
  );
  const [submitted, setSubmitted] = useState(false);

  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const [gasFeeAmount] = useState<AmountModel>({
    amount: 0.000001,
    currency: "GNOT",
  });
  const [openedConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setNotice } = useNotice();
  const {
    connected: connectedWallet,
    isSwitchNetwork,
    switchNetwork,
  } = useWallet();
  const {
    tokens,
    tokenPrices,
    displayBalanceMap,
    updateTokens,
    updateTokenPrices,
    updateBalances,
    getTokenUSDPrice,
  } = useTokenData();
  const { slippage, changeSlippage } = useSlippage();
  const { openModal } = useConnectWalletModal();
  const {
    isSameToken,
    estimatedRoutes,
    estimatedAmount,
    tokenAmountLimit,
    swapState,
    swap,
    estimateSwapRoute,
  } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage,
  });

  const { openModal: openTransactionConfirmModal } =
    useTransactionConfirmModal();
  const {
    broadcastSuccess,
    broadcastLoading,
    broadcastPending,
    broadcastError,
    broadcastRejected,
  } = useBroadcastHandler();

  usePreventScroll(openedConfirmModal);

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
    if (tokenA && !Number.isNaN(displayBalanceMap[tokenA.priceID])) {
      return BigNumber(displayBalanceMap[tokenA.priceID] || 0).toFormat();
    }
    return "-";
  }, [displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && !Number.isNaN(displayBalanceMap[tokenB.priceID])) {
      return BigNumber(displayBalanceMap[tokenB.priceID] || 0).toFormat();
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
    if (!Number(tokenAAmount) && !Number(tokenBAmount)) {
      return "Enter Amount";
    }
    if (
      (Number(tokenAAmount) < 0.000001 && type === "EXACT_IN") ||
      (Number(tokenBAmount) < 0.000001 && type === "EXACT_OUT") ||
      (isGNOTPath(toNativePath(tokenA.path)) &&
        BigNumber(tokenAAmount).isLessThan(MINIMUM_GNOT_SWAP_AMOUNT))
    ) {
      return "Amount Too Low";
    }

    if (
      connectedWallet &&
      Number(tokenAAmount) > Number(parseFloat(tokenABalance.replace(/,/g, "")))
    ) {
      return "Insufficient Balance";
    }

    if (!isSameToken && swapState === "NO_LIQUIDITY") {
      return "Insufficient Liquidity";
    }
    if (
      Number(tokenAAmount) > 0 &&
      tokenBAmount === "0" &&
      !isLoading &&
      type === "EXACT_IN"
    ) {
      return "Insufficient Liquidity";
    }
    if (
      Number(tokenBAmount) > 0 &&
      tokenAAmount === "0" &&
      !isLoading &&
      type === "EXACT_OUT"
    ) {
      return "Insufficient Liquidity";
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
    tokenBAmount,
    type,
    isSameToken,
    swapState,
    tokenABalance,
    isLoading,
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
      tokenADecimals: tokenA?.decimals,
      tokenBDecimals: tokenB?.decimals,
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
    const swapRate1USD =
      swapRateAction === "ATOB"
        ? getTokenUSDPrice(checkGnotPath(tokenA.path), 1) || 1
        : getTokenUSDPrice(checkGnotPath(tokenB.path), 1) || 1;
    if (isSameToken) {
      return {
        tokenA,
        tokenB,
        swapDirection: "EXACT_IN",
        swapRate: 1,
        swapRateUSD: getTokenUSDPrice(checkGnotPath(tokenA.path), 1) || 1,
        priceImpact: 0,
        guaranteedAmount: {
          amount: Number(tokenAAmount),
          currency: tokenB.symbol,
        },
        gasFee: gasFeeAmount,
        gasFeeUSD: BigNumber(gasFeeAmount.amount).multipliedBy(1).toNumber(),
        swapRateAction,
        swapRate1USD,
      };
    }
    const targetTokenB = type === "EXACT_IN" ? tokenB : tokenA;
    const tokenAUSDValue = tokenPrices[checkGnotPath(tokenA.path)]?.usd || 1;
    const tokenBUSDValue = tokenPrices[checkGnotPath(tokenB.path)]?.usd || 1;

    const tokenAUSDAmount =
      (makeDisplayTokenAmount(tokenA, tokenAAmount) || 0) *
      Number(tokenAUSDValue);

    const tokenBUSDAmount =
      (makeDisplayTokenAmount(tokenB, tokenBAmount) || 0) *
      Number(tokenBUSDValue);

    const swapRate =
      swapRateAction === "ATOB"
        ? Number(tokenBAmount) / Number(tokenAAmount)
        : Number(tokenAAmount) / Number(tokenBAmount);
    const swapRateUSD =
      type === "EXACT_IN"
        ? BigNumber(tokenBAmount).multipliedBy(tokenBUSDValue).toNumber()
        : BigNumber(tokenAAmount).multipliedBy(tokenAUSDValue).toNumber();
    const priceImpactNum = tokenAUSDAmount !== 0 ? BigNumber(tokenBUSDAmount - tokenAUSDAmount)
      .multipliedBy(100)
      .dividedBy(tokenAUSDAmount) : BigNumber(0);
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
        amount: makeDisplayTokenAmount(targetTokenB, tokenAmountLimit) || 0,
        currency: targetTokenB.symbol,
      },
      gasFee: gasFeeAmount,
      gasFeeUSD,
      swapRateAction,
      swapRate1USD,
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
    swapRateAction,
  ]);

  const isAvailSwap = useMemo(() => {
    if (swapState !== "SUCCESS") {
      return false;
    }
    if (!connectedWallet) {
      return false;
    }
    if (isSwitchNetwork) {
      return false;
    }
    if (!tokenA || !tokenB) {
      return false;
    }
    if (!tokenAAmount && !tokenBAmount) {
      return false;
    }
    if (
      (Number(tokenAAmount) !== 0 && Number(tokenAAmount) < 0.000001) ||
      Number(tokenBAmount) < 0.000001 ||
      (isGNOTPath(toNativePath(tokenA.path)) &&
        BigNumber(tokenAAmount).isLessThan(MINIMUM_GNOT_SWAP_AMOUNT))
    ) {
      return false;
    }

    if (
      Number(tokenAAmount) > Number(parseFloat(tokenABalance.replace(/,/g, "")))
    ) {
      return false;
    }
    if (
      Number(tokenBAmount) >
      Number(parseFloat(tokenBBalance.replace(/,/g, ""))) &&
      type === "EXACT_OUT"
    ) {
      return false;
    }
    if (
      Number(tokenAAmount) > 0 &&
      !Number(tokenBAmount) &&
      type === "EXACT_IN"
    ) {
      return false;
    }
    if (
      Number(tokenBAmount) > 0 &&
      !Number(tokenAAmount) &&
      type === "EXACT_OUT"
    ) {
      return false;
    }
    return true;
  }, [
    swapState,
    connectedWallet,
    isSwitchNetwork,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    tokenABalance,
    tokenBBalance,
    type,
  ]);

  const openConfirmModal = useCallback(() => {
    if (!swapSummaryInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <ConfirmSwapModal
        submitted={true}
        swapTokenInfo={swapTokenInfo}
        swapSummaryInfo={swapSummaryInfo}
        swapResult={swapResult}
        swap={executeSwap}
        close={closeModal}
      />,
    );
  }, [submitted, swapResult, swapSummaryInfo, swapTokenInfo]);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const closeModal = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
    setSwapResult(null);
  }, []);

  const onFinishSwap = useCallback(() => {
    closeModal();
    setTokenAAmount("0");
    setTokenBAmount("0");
  }, []);

  useEffect(() => {
    if (!tokens.length) {
      return;
    }
    const interval = setInterval(() => {
      updateBalances();
    }, 10000);
    return () => clearInterval(interval);
  }, [tokens.length, updateBalances]);

  const changeTokenAAmount = useCallback(
    (changed: string, none?: boolean) => {
      const value = handleAmount(changed, tokenA);
      estimateSwapRoute(value);

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
      if (!!Number(value) && tokenB?.symbol) {
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
    [isSameToken, setSwapValue, tokenA, tokenB?.symbol],
  );

  useEffect(() => {
    setSwapValue(prev => ({
      ...prev,
      tokenAAmount,
      tokenBAmount,
    }));
  }, [setSwapValue, tokenAAmount, tokenBAmount]);

  const changeTokenBAmount = useCallback(
    (changed: string, none?: boolean) => {
      const value = handleAmount(changed, tokenA);

      if (none) {
        setIsLoading(false);
        return;
      }

      if (!matchInputNumber(value)) {
        return;
      }

      if (!!Number(value) && tokenA?.symbol) {
        setIsLoading(true);
      } else {
        setTokenAAmount("0");
      }

      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_OUT",
      }));
      estimateSwapRoute(value);
      setTokenBAmount(value);
    },
    [isSameToken, tokenA, tokenB?.symbol],
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
      if (!!Number(tokenAAmount)) {
        setIsLoading(true);
      }
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
      if (!!Number(tokenAAmount)) {
        setIsLoading(true);
      }
    },
    [tokenA, type, tokenBAmount, tokenAAmount, swapValue],
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
  }, [isSameToken, tokenA, tokenB, type, tokenBAmount, tokenAAmount]);

  const copyURL = async () => {
    try {
      if (router.pathname === "/tokens/[token-path]") {
        let url =
          window?.location?.host + "/tokens/" + router.query?.["token-path"];
        const query = {
          to: tokenB?.path,
          from: tokenA?.path,
        };
        if (query.to && query.from) {
          url += `?tokenA=${query.from}&tokenB=${query.to}`;
        } else if (query.to) {
          url += `?tokenB=${query.to}`;
        } else if (query.from) {
          url += `?tokenA=${query.from}`;
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        return;
      }
      let url = window?.location?.host + "/swap";
      const query = {
        to: tokenB?.path,
        from: tokenA?.path,
      };
      if (query.to && query.from) {
        url += `?from=${query.from}&to=${query.to}`;
      } else if (query.to) {
        url += `?to=${query.to}`;
      } else if (query.from) {
        url += `?from=${query.from}`;
      }
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
    if (isSameToken) {
      setNotice(null, {
        timeout: 50000,
        type: "pending",
        closeable: true,
        id: makeRandomId(),
      });

      setTimeout(() => {
        setNotice(
          {
            title: "Swap",
            description: `Swapped <span>${Number(
              swapTokenInfo.tokenAAmount,
            ).toLocaleString("en-US", {
              maximumFractionDigits: 6,
            })}</span> <span>${swapTokenInfo?.tokenA?.symbol
              }</span> for <span>${Number(
                swapTokenInfo.tokenBAmount,
              ).toLocaleString("en-US", {
                maximumFractionDigits: 6,
              })}</span> <span>${swapTokenInfo?.tokenB?.symbol}</span>`,
          },
          {
            timeout: 50000,
            type: "success" as TNoticeType,
            closeable: true,
            id: makeRandomId(),
          },
        );
      }, 1000);
      return;
    }

    const isExactIn = type === "EXACT_IN";
    const swapAmount = isExactIn ? tokenAAmount : tokenBAmount;

    const broadcastMessage = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: isExactIn
        ? tokenAAmount
        : makeDisplayTokenAmount(tokenA, estimatedAmount || 0)?.toString() ||
        "0",
      tokenBAmount: isExactIn
        ? makeDisplayTokenAmount(tokenB, estimatedAmount || 0)?.toString() ||
        "0"
        : tokenBAmount,
    };

    broadcastLoading(makeBroadcastSwapMessage("pending", broadcastMessage));
    openTransactionConfirmModal();

    swap(estimatedRoutes, swapAmount)
      .then(response => {
        if (response) {
          if (response.code === 0) {
            broadcastPending();
            setTimeout(() => {
              const tokenAAmountStr = isExactIn
                ? tokenAAmount
                : response.data?.resultAmount;
              const tokenBAmountStr = isExactIn
                ? response.data?.resultAmount
                : tokenBAmount;
              broadcastSuccess(
                makeBroadcastSwapMessage("success", {
                  ...broadcastMessage,
                  tokenAAmount: tokenAAmountStr || "0",
                  tokenBAmount: tokenBAmountStr || "0",
                }),
                onFinishSwap,
              );
            }, 1000);
            openTransactionConfirmModal();
          } else if (response.type === ERROR_VALUE.TRANSACTION_REJECTED.type) {
            broadcastRejected(
              makeBroadcastSwapMessage("error", broadcastMessage),
            );
            openTransactionConfirmModal();
          } else {
            broadcastError(
              makeBroadcastSwapMessage("error", broadcastMessage),
              onFinishSwap,
            );
            openTransactionConfirmModal();
          }
        }

        setSwapResult({
          success: response?.code === 0,
          hash: response?.data?.hash || "",
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
    if (!tokenA || !tokenB) {
      return;
    }

    if (swapState !== "SUCCESS" && estimatedAmount === null) {
      return;
    }

    if (type === "EXACT_IN") {
      const amount = makeDisplayTokenAmount(tokenB, estimatedAmount || 0) || 0;
      setTokenBAmount(amount.toString());
    } else {
      const amount = makeDisplayTokenAmount(tokenA, estimatedAmount || 0) || 0;
      setTokenAAmount(amount.toString());
    }
  }, [swapState, estimatedAmount, type, tokenA, tokenB]);

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
    if (!isEmptyObject(router?.query)) return;
    setTokenAAmount("");
    setTokenBAmount("");
  }, []);

  useEffect(() => {
    if (!tokenA?.symbol || !tokenB?.symbol) {
      return;
    }

    if (
      (defaultTokenAAmount || defaultTokenBAmount) &&
      (!!Number(tokenAAmount) || !!Number(tokenBAmount))
    ) {
      setIsLoading(true);
    }
  }, [
    defaultTokenBAmount,
    defaultTokenAAmount,
    tokenA?.symbol,
    tokenAAmount,
    tokenBAmount,
    type,
    tokenB?.symbol,
  ]);

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
    isLoading: swapState === "LOADING",
    setSwapValue,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    swapValue,
    setSwapRateAction,
    setTokenAAmount,
  };
};
