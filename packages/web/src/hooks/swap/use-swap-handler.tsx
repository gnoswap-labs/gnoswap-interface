import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ERROR_VALUE } from "@common/errors/adena";
import { DEFAULT_GAS_FEE, MINIMUM_GNOT_SWAP_AMOUNT } from "@common/values";
import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import { PAGE_PATH } from "@constants/page.constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useMessage } from "@hooks/common/use-message";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { EstimatedRoute, SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { QUERY_KEY } from "@query/query-keys";
import { useGetSwapFee } from "@query/router";
import { DexEvent } from "@repositories/common";
import { SwapRouteSuccessResponse } from "@repositories/swap/response/swap-route-response";
import { CommonState, SwapState } from "@states/index";
import { checkGnotPath, isGNOTPath, toNativePath } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";
import { matchInputNumber } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { isEmptyObject } from "@utils/validation-utils";

import { useSwap } from "./use-swap";
import { rawBySqrtX96 } from "@utils/swap-utils";

type SwapButtonStateType =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "SELECT_TOKEN"
  | "ENTER_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "INSUFFICIENT_BALANCE"
  | "INSUFFICIENT_LIQUIDITY"
  | "WRAP"
  | "UNWRAP"
  | "SWAP"
  | "HIGHT_PRICE_IMPACT";

export type PriceImpactStatus = "LOW" | "HIGH" | "MEDIUM" | "POSITIVE" | "NONE";

function estimatePriceImpactByRoutes(
  tokenInPath: string,
  routes: EstimatedRoute[],
) {
  let amountInBN = BigNumber(0);
  let amountOutBN = BigNumber(0);
  let estimatedAmountOutBN = BigNumber(0);

  for (const route of routes) {
    let currentTokenInPath = tokenInPath;

    const poolTickPrices = route.pools.map(pool => {
      const isReversePrice = currentTokenInPath === pool.tokenB;
      if (isReversePrice) {
        currentTokenInPath = pool.tokenA;
        return 1 / rawBySqrtX96(pool.price);
      }

      currentTokenInPath = pool.tokenB;
      return rawBySqrtX96(pool.price);
    });

    const routePrice = poolTickPrices.reduce(
      (price, poolTickPrice) => price * poolTickPrice,
      1,
    );

    amountInBN = amountInBN.plus(route.amountIn.toString());
    amountOutBN = amountOutBN.plus(route.amountOut.toString());
    estimatedAmountOutBN = estimatedAmountOutBN.plus(
      BigNumber(route.amountIn.toString()).multipliedBy(routePrice),
    );
  }

  if (amountOutBN.isZero()) {
    return BigNumber(0);
  }

  return amountOutBN
    .minus(estimatedAmountOutBN)
    .multipliedBy(100)
    .dividedBy(estimatedAmountOutBN);
}

function compareAmountFn(
  amountA: string | number | bigint,
  amountB: string | number | bigint,
) {
  const amountValueA = BigNumber(`${amountA}`.replace(/,/g, ""));
  const amountValueB = BigNumber(`${amountB}`.replace(/,/g, ""));

  if (amountValueA.isEqualTo(amountValueB)) {
    return 0;
  }

  return amountValueA.isGreaterThan(amountValueB) ? 1 : -1;
}

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
  const queryClient = useQueryClient();
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
  const { t } = useTranslation();

  const [swapRateAction, setSwapRateAction] = useState<"ATOB" | "BTOA">("BTOA");
  const [tokenAAmount = "", setTokenAAmount] = useState(
    defaultTokenAAmount ?? undefined,
  );

  const estimateFlagRef = useRef(0);

  const [tokenBAmount = "", setTokenBAmount] = useState(() =>
    !defaultTokenAAmount
      ? defaultTokenBAmount
        ? defaultTokenBAmount
        : undefined
      : undefined,
  );

  const [submitted, setSubmitted] = useState(false);

  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const [openedConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const { data: swapFee } = useGetSwapFee();
  const {
    isSameToken,
    estimatedRoutes,
    estimatedAmount,
    tokenAmountLimit,
    swapState,
    swap,
    wrap,
    unwrap,
    updateSwapAmount,
    resetSwapAmount,
  } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage,
    swapFee,
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

  const { getMessage } = useMessage();

  const gnotToken = useMemo(
    () => tokens.find(item => item.symbol === "GNOT"),
    [tokens],
  );
  const defaultGasFeeAmount = useMemo(
    () =>
      BigNumber(DEFAULT_GAS_FEE)
        .shiftedBy(-(gnotToken?.decimals ?? 0))
        .toNumber(),
    [gnotToken?.decimals],
  );
  const gasFeeUSD = useMemo(
    () =>
      getTokenUSDPrice(
        checkGnotPath(gnotToken?.path ?? ""),
        defaultGasFeeAmount,
      ) ?? 0,
    [defaultGasFeeAmount, getTokenUSDPrice, gnotToken?.path],
  );

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
        amount: defaultGasFeeAmount,
        currency: "GNOT",
      },
      gasFeeUSD,
    }));
  }, [defaultGasFeeAmount, estimatedRoutes, gasFeeUSD, tokenA, tokenB]);

  const tokenABalance = useMemo(() => {
    if (isSwitchNetwork || !tokenA) return "-";

    // Only the balance in the swap card should be formatted the same with price
    return formatPrice(displayBalanceMap?.[tokenA.priceID], {
      isKMB: false,
      usd: false,
    });
  }, [isSwitchNetwork, displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (isSwitchNetwork || !tokenB) return "-";

    // Only the balance in the swap card should be formatted the same with price
    return formatPrice(displayBalanceMap?.[tokenB.priceID], {
      isKMB: false,
      usd: false,
    });
  }, [isSwitchNetwork, displayBalanceMap, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (
      !Number(tokenAAmount) ||
      !tokenA ||
      !tokenPrices[checkGnotPath(tokenA.priceID)].usd
    ) {
      return null;
    }
    return BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenA.priceID)].usd)
      .toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (
      !Number(tokenBAmount) ||
      !tokenB ||
      !tokenPrices[checkGnotPath(tokenB.priceID)]?.usd
    ) {
      return null;
    }
    return BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenB.priceID)].usd)
      .toNumber();
  }, [tokenB, tokenBAmount, tokenPrices]);

  const priceImpact = useMemo(() => {
    if (!tokenA || !tokenB) {
      return BigNumber(0);
    }

    const hasUSDPrice =
      !!tokenPrices[checkGnotPath(tokenA.path)]?.usd &&
      !!tokenPrices[checkGnotPath(tokenB.path)]?.usd;

    if (hasUSDPrice) {
      const tokenAUSDValue = tokenPrices[checkGnotPath(tokenA.path)]?.usd || 0;
      const tokenBUSDValue = tokenPrices[checkGnotPath(tokenB.path)]?.usd || 0;

      const tokenAUSDAmount =
        (makeDisplayTokenAmount(tokenA, tokenAAmount) || 0) *
        Number(tokenAUSDValue);

      const tokenBUSDAmount =
        (makeDisplayTokenAmount(tokenB, tokenBAmount) || 0) *
        Number(tokenBUSDValue);

      const priceImpactNum =
        tokenAUSDAmount !== 0
          ? BigNumber(tokenBUSDAmount - tokenAUSDAmount)
              .multipliedBy(100)
              .dividedBy(tokenAUSDAmount)
          : BigNumber(0);
      return BigNumber(priceImpactNum.toFixed(2));
    }

    return estimatePriceImpactByRoutes(
      checkGnotPath(tokenA.path),
      estimatedRoutes,
    );
  }, [
    estimatedRoutes,
    tokenA,
    tokenAAmount,
    tokenB,
    tokenBAmount,
    tokenPrices,
  ]);

  const priceImpactStatus: PriceImpactStatus = useMemo(() => {
    if (!priceImpact) return "NONE";

    if (priceImpact.isGreaterThan(0)) return "POSITIVE";

    if (
      priceImpact.isLessThanOrEqualTo(0) &&
      priceImpact.isGreaterThanOrEqualTo(-4.99)
    )
      return "LOW";

    if (
      priceImpact.isLessThanOrEqualTo(-5) &&
      priceImpact.isGreaterThanOrEqualTo(-9.99)
    )
      return "MEDIUM";

    if (
      priceImpact.isLessThanOrEqualTo(-10) &&
      priceImpact.isGreaterThanOrEqualTo(-100)
    )
      return "HIGH";

    return "NONE";
  }, [priceImpact]);

  const swapButtonState: SwapButtonStateType = useMemo(() => {
    if (!connectedWallet) {
      return "WALLET_LOGIN";
    }
    if (isSwitchNetwork) {
      return "SWITCH_NETWORK";
    }
    if (!tokenA || !tokenB) {
      return "SELECT_TOKEN";
    }
    if (!Number(tokenAAmount) && !Number(tokenBAmount)) {
      return "ENTER_AMOUNT";
    }
    if (
      (Number(tokenAAmount) < 0.000001 && type === "EXACT_IN") ||
      (Number(tokenBAmount) < 0.000001 && type === "EXACT_OUT") ||
      (isGNOTPath(toNativePath(tokenA.path)) &&
        BigNumber(tokenAAmount).isLessThan(MINIMUM_GNOT_SWAP_AMOUNT))
    ) {
      return "AMOUNT_TOO_LOW";
    }

    if (priceImpactStatus === "HIGH" && estimatedRoutes.length !== 0) {
      return "HIGHT_PRICE_IMPACT";
    }

    if (compareAmountFn(tokenAAmount, tokenABalance) > 0) {
      return "INSUFFICIENT_BALANCE";
    }

    if (!isSameToken && swapState === "NO_LIQUIDITY") {
      return "INSUFFICIENT_LIQUIDITY";
    }
    if (
      !isSameToken &&
      Number(tokenAAmount) > 0 &&
      tokenBAmount === "0" &&
      !isLoading &&
      type === "EXACT_IN"
    ) {
      return "INSUFFICIENT_LIQUIDITY";
    }

    if (
      ((Number(tokenBAmount) > 0 &&
        tokenAAmount === "0" &&
        !isLoading &&
        type === "EXACT_OUT") ||
        estimatedRoutes.length === 0) &&
      !isSameToken
    ) {
      return "INSUFFICIENT_LIQUIDITY";
    }
    if (isSameToken) {
      if (isNativeToken(tokenA)) {
        return "WRAP";
      }
      return "UNWRAP";
    }
    return "SWAP";
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
    priceImpactStatus,
    estimatedRoutes.length,
  ]);

  const swapButtonText = useMemo(() => {
    switch (swapButtonState) {
      case "WALLET_LOGIN":
        return t("Swap:swapButton.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "SELECT_TOKEN":
        return t("Swap:swapButton.selectToken");
      case "ENTER_AMOUNT":
        return t("Swap:swapButton.enterAmount");
      case "AMOUNT_TOO_LOW":
        return t("Swap:swapButton.amtLow");
      case "INSUFFICIENT_BALANCE":
        return t("Swap:swapButton.insuffiBalance");
      case "INSUFFICIENT_LIQUIDITY":
        return t("Swap:swapButton.insuffiLiq");
      case "WRAP":
        return t("Swap:swapButton.wrap");
      case "UNWRAP":
        return t("Swap:swapButton.unwrap");
      case "HIGHT_PRICE_IMPACT":
        return t("Swap:swapButton.swapAnyway");
      case "SWAP":
      default:
        return t("Swap:swapButton.swap");
    }
  }, [swapButtonState, t]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: formatPrice(tokenAUSD, { usd: true, isKMB: false }),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: formatPrice(tokenBUSD, { usd: true, isKMB: false }),
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

    const protocolFee = `${(swapFee || 0) / 100}%`;

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
        gasFee: {
          amount: defaultGasFeeAmount,
          currency: "GNOT",
        },
        gasFeeUSD,
        swapRateAction,
        swapRate1USD,
        protocolFee,
      };
    }

    const tokenAUSDValue = tokenPrices[checkGnotPath(tokenA.path)]?.usd || 1;
    const tokenBUSDValue = tokenPrices[checkGnotPath(tokenB.path)]?.usd || 1;

    const swapRate =
      swapRateAction === "ATOB"
        ? Number(tokenBAmount) / Number(tokenAAmount)
        : Number(tokenAAmount) / Number(tokenBAmount);
    const swapRateUSD =
      type === "EXACT_IN"
        ? BigNumber(tokenBAmount).multipliedBy(tokenBUSDValue).toNumber()
        : BigNumber(tokenAAmount).multipliedBy(tokenAUSDValue).toNumber();

    return {
      tokenA,
      tokenB,
      swapDirection: type,
      swapRate,
      swapRateUSD,
      priceImpact: priceImpact?.isGreaterThan(100)
        ? 100
        : Number(priceImpact?.toFixed(2)),
      guaranteedAmount: {
        amount: tokenAmountLimit || 0,
        currency: (type === "EXACT_IN" ? tokenB : tokenA).symbol,
      },
      gasFee: {
        amount: defaultGasFeeAmount,
        currency: "GNOT",
      },
      gasFeeUSD: gasFeeUSD,
      swapRateAction,
      swapRate1USD,
      direction: type,
      protocolFee,
    };
  }, [
    tokenA,
    tokenB,
    isSameToken,
    type,
    tokenAAmount,
    tokenBAmount,
    tokenAmountLimit,
    swapRateAction,
    type,
    gnotToken,
    defaultGasFeeAmount,
    gasFeeUSD,
    tokenPrices,
    priceImpact,
    swapFee,
  ]);

  const isAvailSwap = useMemo(() => {
    return (
      swapButtonState === "SWAP" ||
      swapButtonState === "WRAP" ||
      swapButtonState === "UNWRAP" ||
      swapButtonState === "HIGHT_PRICE_IMPACT"
    );
  }, [swapButtonState]);

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
        isWrapOrUnwrap={
          swapButtonState === "WRAP" || swapButtonState === "UNWRAP"
        }
        priceImpactStatus={priceImpactStatus}
        title={(() => {
          switch (swapButtonState) {
            case "SWAP":
              return t("Swap:confirmSwapModal.confirmBtn.swap");
            case "WRAP":
              return t("Swap:confirmSwapModal.confirmBtn.wrap");
            case "UNWRAP":
              return t("Swap:confirmSwapModal.confirmBtn.unwrap");
            case "HIGHT_PRICE_IMPACT":
              return t("Swap:confirmSwapModal.confirmBtn.swapAnyway");
            default:
              return "";
          }
        })()}
      />,
    );
  }, [
    submitted,
    swapResult,
    swapSummaryInfo,
    swapTokenInfo,
    swapButtonState,
    priceImpactStatus,
    isLoading,
    t,
  ]);

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
    resetSwapAmount();
    updateBalances();
    queryClient.removeQueries({
      queryKey: [QUERY_KEY.router],
    });
  }, [queryClient]);

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
      updateSwapAmount(value);

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
      const value = handleAmount(changed, tokenB);

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

      if (!!Number(value) && tokenA?.symbol) {
        setIsLoading(true);
      } else {
        setTokenAAmount("0");
      }

      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_OUT",
      }));
      updateSwapAmount(value);
      setTokenBAmount(value);
    },
    [isSameToken, tokenA, tokenB],
  );

  const isSameTokenFn = useCallback(
    (tokenA_: TokenModel | null, tokenB_: TokenModel | null) => {
      if (!tokenA_ || !tokenB_) {
        return false;
      }
      if (isNativeToken(tokenA_)) {
        return tokenA_.wrappedPath === tokenB_.path;
      }
      if (isNativeToken(tokenB_)) {
        return tokenA_.path === tokenB_.wrappedPath;
      }
      return false;
    },
    [],
  );

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      const changedSwapDirection = type;
      if (isSameTokenFn(tokenB, token)) {
        // changedSwapDirection = type;
        setTokenAAmount(tokenAAmount);
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
    [
      tokenA,
      tokenB,
      type,
      tokenBAmount,
      tokenAAmount,
      isSameToken,
      isSameTokenFn,
    ],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      const changedSwapDirection = type;
      if (isSameTokenFn(tokenA, token)) {
        // changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
        setTokenAAmount(tokenAAmount);
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
    [
      tokenA,
      type,
      tokenBAmount,
      tokenAAmount,
      swapValue,
      isSameToken,
      isSameTokenFn,
    ],
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
      if (router.pathname === PAGE_PATH.TOKEN) {
        let url =
          window?.location?.host +
          PAGE_PATH.TOKEN +
          "?path=" +
          router.getTokenPath();
        const query = {
          to: tokenB?.path,
          from: tokenA?.path,
        };
        if (query.to && query.from) {
          url += `&tokenA=${query.from}&tokenB=${query.to}`;
        } else if (query.to) {
          url += `&tokenB=${query.to}`;
        } else if (query.from) {
          url += `&tokenA=${query.from}`;
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
      throw new Error(`Copy Error! , ${e}`);
    }
  };

  const handleWrapAndUnwrap = () => {
    if (!tokenA || !tokenB) {
      return;
    }

    const isExactIn = type === "EXACT_IN";
    const swapAmount = isExactIn ? tokenAAmount : tokenBAmount;

    const messageData = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: swapAmount,
      tokenBAmount: swapAmount,
    };

    if (isNativeToken(tokenA)) {
      broadcastLoading(getMessage(DexEvent.WRAP, "pending", messageData));
      openTransactionConfirmModal();

      wrap(swapAmount)
        .then(response => {
          if (response?.code === 0) {
            broadcastPending({ txHash: response.data?.hash });
            setTimeout(() => {
              const tokenAAmountStr = tokenAAmount;
              const tokenBAmountStr = tokenBAmount;
              broadcastSuccess(
                getMessage(
                  DexEvent.WRAP,
                  "success",
                  {
                    ...messageData,
                    tokenAAmount: tokenAAmountStr || "0",
                    tokenBAmount: tokenBAmountStr || "0",
                  },
                  response.data?.hash,
                ),
                onFinishSwap,
              );
            }, 1000);
            openTransactionConfirmModal();
          } else if (
            response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(getMessage(DexEvent.WRAP, "error", messageData));
            openTransactionConfirmModal();
          } else {
            broadcastError(
              getMessage(
                DexEvent.WRAP,
                "error",
                messageData,
                response?.data?.hash,
              ),
            );
            openTransactionConfirmModal();
          }
        })
        .catch(() => {
          setSwapResult({
            success: false,
            hash: "",
          });
        });
    } else {
      broadcastLoading(getMessage(DexEvent.UNWRAP, "pending", messageData));
      openTransactionConfirmModal();

      unwrap(swapAmount)
        .then(response => {
          if (response?.status === "success") {
            broadcastPending({ txHash: response.data?.hash });
            setTimeout(() => {
              const tokenAAmountStr = tokenAAmount;
              const tokenBAmountStr = tokenBAmount;
              broadcastSuccess(
                getMessage(
                  DexEvent.UNWRAP,
                  "success",
                  {
                    ...messageData,
                    tokenAAmount: tokenAAmountStr || "0",
                    tokenBAmount: tokenBAmountStr || "0",
                  },
                  response.data?.hash,
                ),
                onFinishSwap,
              );
            }, 1000);
            openTransactionConfirmModal();
          } else if (
            response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(
              getMessage(DexEvent.UNWRAP, "error", messageData),
            );
            openTransactionConfirmModal();
          } else {
            broadcastError(
              getMessage(
                DexEvent.UNWRAP,
                "error",
                messageData,
                response?.data?.hash,
              ),
            );
            openTransactionConfirmModal();
          }
        })
        .catch(() => {
          setSwapResult({
            success: false,
            hash: "",
          });
        });
    }
    return;
  };

  function executeSwap() {
    if (!tokenA || !tokenB) {
      return;
    }
    setSubmitted(true);

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

    // Handle Wrap and Unwrap
    if (isSameToken) {
      handleWrapAndUnwrap();
      return;
    }

    broadcastLoading(getMessage(DexEvent.SWAP, "pending", broadcastMessage));
    openTransactionConfirmModal();

    swap(estimatedRoutes, swapAmount)
      .then(response => {
        if (response) {
          if (response.code === 0) {
            const responseData = response?.data as SwapRouteSuccessResponse;
            broadcastPending({ txHash: responseData.hash });
            setTimeout(() => {
              const tokenAAmountStr = isExactIn
                ? tokenAAmount
                : responseData.resultAmount;
              const tokenBAmountStr = isExactIn
                ? responseData.resultAmount
                : tokenBAmount;
              broadcastSuccess(
                getMessage(
                  DexEvent.SWAP,
                  "success",
                  {
                    ...broadcastMessage,
                    tokenAAmount: tokenAAmountStr || "0",
                    tokenBAmount: tokenBAmountStr || "0",
                  },
                  responseData.hash,
                ),
                onFinishSwap,
              );
            }, 1000);
            openTransactionConfirmModal();
          } else if (
            response.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(
              getMessage(
                DexEvent.SWAP,
                "error",
                broadcastMessage,
                response.data?.hash,
              ),
            );
            openTransactionConfirmModal();
          } else {
            broadcastError(
              getMessage(
                DexEvent.SWAP,
                "error",
                broadcastMessage,
                response.type === ERROR_VALUE.TRANSACTION_FAILED.type
                  ? response.data?.hash
                  : undefined,
              ),
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
      if (swapState === "NO_LIQUIDITY") {
        if (type === "EXACT_IN") {
          setTokenBAmount("");
        } else {
          setTokenAAmount("");
        }
        return;
      }

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
  }, []);

  useEffect(() => {
    if (!tokenA?.symbol || !tokenB?.symbol) {
      return;
    }
    if (estimateFlagRef.current === 0) {
      if (!!defaultTokenAAmount) {
        estimateFlagRef.current += 1;
        changeTokenAAmount(defaultTokenAAmount);
        return;
      }
      if (!!defaultTokenBAmount) {
        estimateFlagRef.current += 1;
        changeTokenBAmount(defaultTokenBAmount);
        return;
      }
    }

    if (!!Number(tokenAAmount) || !!Number(tokenBAmount)) {
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
    priceImpactStatus,
    isSameToken,
  };
};
