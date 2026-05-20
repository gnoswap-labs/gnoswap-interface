import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ERROR_VALUE } from "@common/errors/adena";
import { ERROR_VALUE as SWAP_ERROR_VALUE } from "@common/errors/swap";
import { DEFAULT_GAS_FEE, MINIMUM_GNOT_SWAP_AMOUNT } from "@common/values";
import { GNOT_TOKEN } from "@common/values/token-constant";
import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import { PAGE_PATH } from "@constants/page.constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useMessage } from "@hooks/common/use-message";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useReferral } from "@hooks/common/use-referral";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { EstimatedRoute, SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { QUERY_KEY } from "@query/query-keys";
import { useGetSwapFee } from "@query/router";
import { DexEvent } from "@repositories/common";
import { SwapRouteSuccessResponse } from "@repositories/swap-router/response/swap-route-response";
import { CommonState, SwapState } from "@states/index";
import { checkGnotPath, isGNOTPath, toNativePath } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";
import { nullish } from "@utils/nullish-utils";
import { matchInputNumber } from "@utils/number-utils";
import { isAmountLessThanTokenMinimum, makeDisplayTokenAmount } from "@utils/token-utils";
import { isEmptyObject } from "@utils/validation-utils";

import { handleAmount } from "./use-swap-handler.utils";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { useSwap } from "./use-swap";

type SwapButtonStateType =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "SELECT_TOKEN"
  | "ENTER_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "LOADING"
  | "INSUFFICIENT_BALANCE"
  | "INSUFFICIENT_LIQUIDITY"
  | "WRAP"
  | "UNWRAP"
  | "SWAP"
  | "HIGHT_PRICE_IMPACT";

export type PriceImpactStatus = "LOW" | "HIGH" | "MEDIUM" | "POSITIVE" | "NONE";

export enum SwapRateAction {
  ATOB = "ATOB",
  BTOA = "BTOA",
}

function estimatePriceImpactByRoutes(
  tokenInPath: string,
  routes: EstimatedRoute[],
  swapFeeRate: number,
  isExactOut: boolean,
) {
  let amountInBN = BigNumber(0);
  let amountOutBN = BigNumber(0);
  let estimatedAmountBN = BigNumber(0);

  for (const route of routes) {
    let currentTokenInPath = tokenInPath;

    const poolTickPrices = route.pools.map(pool => {
      const isReversePrice = currentTokenInPath === pool.tokenB;
      if (isReversePrice) {
        currentTokenInPath = pool.tokenA;
        return 1 / pool.price;
      }

      currentTokenInPath = pool.tokenB;
      return pool.price;
    });

    const routePrice = poolTickPrices.reduce((price, poolTickPrice) => price * poolTickPrice, 1);

    const amountOutWithSwapFee = BigNumber(route.amountOut.toString()).multipliedBy(1 - swapFeeRate / 100);

    amountInBN = amountInBN.plus(route.amountIn.toString());
    amountOutBN = amountOutBN.plus(amountOutWithSwapFee);

    if (isExactOut) {
      estimatedAmountBN = estimatedAmountBN.plus(BigNumber(route.amountOut.toString()).dividedBy(routePrice));
    } else {
      estimatedAmountBN = estimatedAmountBN.plus(BigNumber(route.amountIn.toString()).multipliedBy(routePrice));
    }
  }

  if (isExactOut) {
    if (estimatedAmountBN.isZero()) {
      return BigNumber(0);
    }
    return amountInBN.minus(estimatedAmountBN).multipliedBy(100).dividedBy(estimatedAmountBN);
  } else {
    if (amountOutBN.isZero()) {
      return BigNumber(0);
    }
    return amountOutBN.minus(estimatedAmountBN).multipliedBy(100).dividedBy(estimatedAmountBN);
  }
}

function compareAmountFn(amountA: string | number | bigint, amountB: string | number | bigint) {
  const amountValueA = BigNumber(`${amountA}`.replace(/,/g, ""));
  const amountValueB = BigNumber(`${amountB}`.replace(/,/g, ""));

  if (amountValueA.isEqualTo(amountValueB)) {
    return 0;
  }

  return amountValueA.isGreaterThan(amountValueB) ? 1 : -1;
}

export const useSwapHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const [, setSwapConfirmModalState] = useAtom(SwapState.swapConfirmModalState);

  const { removeReferrerFromLocalStorage } = useReferral();
  const {
    tokenA = null,
    tokenB = null,
    type = "EXACT_IN",
    tokenAAmount: defaultTokenAAmount,
    tokenBAmount: defaultTokenBAmount,
  } = swapValue;
  const { t } = useTranslation();
  const { enqueueEvent } = useTransactionEventStore();

  const [swapRateAction, setSwapRateAction] = useState<SwapRateAction>(SwapRateAction.BTOA);
  const [tokenAAmount = "", setTokenAAmount] = useState(defaultTokenAAmount ?? undefined);

  const estimateFlagRef = useRef(0);

  const [tokenBAmount = "", setTokenBAmount] = useState(() =>
    !defaultTokenAAmount ? (defaultTokenBAmount ? defaultTokenBAmount : undefined) : undefined,
  );

  const prevPriceImpact = useRef<BigNumber>(BigNumber(0));

  const [submitted, setSubmitted] = useState(false);

  const [copied, setCopied] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResultInfo | null>(null);
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork, switchNetwork } = useWallet();
  const { tokens, tokenPrices, displayBalanceMap, updateBalances, getTokenUSDPrice, refetchGrc20Balances } =
    useTokenData();
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
    displayNetworkFee,
    updateSwapAmount,
    resetSwapAmount,
    isTyping,
    isRefetching,
    isLoadingGasInfo,
    handleResetEstimatedLiquidity,
  } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage,
    swapFee,
  });

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal();
  const { broadcastSuccess, broadcastLoading, broadcastError, broadcastRejected } = useBroadcastHandler();

  usePreventScroll(openedConfirmModal);

  const { getMessage } = useMessage();

  const gnotToken = useMemo(() => tokens.find(item => item.symbol === "GNOT"), [tokens]);
  const defaultGasFeeAmount = useMemo(
    () =>
      BigNumber(DEFAULT_GAS_FEE)
        .shiftedBy(-(gnotToken?.decimals ?? GNOT_TOKEN.decimals))
        .toNumber(),
    [gnotToken?.decimals],
  );
  const gasFeeUSD = useMemo(
    () => getTokenUSDPrice(checkGnotPath(gnotToken?.path ?? ""), defaultGasFeeAmount) ?? 0,
    [defaultGasFeeAmount, getTokenUSDPrice, gnotToken?.path],
  );

  const swapRouteInfos: SwapRouteInfo[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }

    if (estimatedRoutes === null) {
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
      greaterThan1Decimals: 6,
    });
  }, [isSwitchNetwork, displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (isSwitchNetwork || !tokenB) return "-";

    // Only the balance in the swap card should be formatted the same with price
    return formatPrice(displayBalanceMap?.[tokenB.priceID], {
      isKMB: false,
      usd: false,
      greaterThan1Decimals: 6,
    });
  }, [isSwitchNetwork, displayBalanceMap, tokenB]);

  const quotedTokenAAmount = useMemo(() => {
    return type === "EXACT_OUT" && estimatedAmount !== null ? estimatedAmount : tokenAAmount;
  }, [estimatedAmount, tokenAAmount, type]);

  const quotedTokenBAmount = useMemo(() => {
    return type === "EXACT_IN" && estimatedAmount !== null ? estimatedAmount : tokenBAmount;
  }, [estimatedAmount, tokenBAmount, type]);

  useEffect(() => {
    if (estimatedAmount === null) {
      return;
    }

    if (type === "EXACT_IN") {
      setTokenBAmount(estimatedAmount);
    } else {
      setTokenAAmount(estimatedAmount);
    }
  }, [estimatedAmount, type]);

  const tokenAUSD = useMemo(() => {
    if (!Number(quotedTokenAAmount) || !tokenA || !tokenPrices[checkGnotPath(tokenA.priceID)]?.usd) {
      return null;
    }
    return BigNumber(quotedTokenAAmount).multipliedBy(tokenPrices[checkGnotPath(tokenA.priceID)].usd).toNumber();
  }, [quotedTokenAAmount, tokenA, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!Number(quotedTokenBAmount) || !tokenB || !tokenPrices[checkGnotPath(tokenB.priceID)]?.usd) {
      return null;
    }
    return BigNumber(quotedTokenBAmount).multipliedBy(tokenPrices[checkGnotPath(tokenB.priceID)].usd).toNumber();
  }, [quotedTokenBAmount, tokenB, tokenPrices]);

  const getValidUSDValue = useCallback(
    (token: TokenModel) => {
      const bnValue = BigNumber(tokenPrices[checkGnotPath(token.path)]?.usd);
      if (bnValue.isNaN() || !bnValue.gt(0)) return null;
      return bnValue.toNumber();
    },
    [tokenPrices],
  );

  const priceImpact = useMemo(() => {
    if (!tokenA || !tokenB) {
      return BigNumber(0);
    }

    if (estimatedAmount === null) {
      return prevPriceImpact.current || BigNumber(0);
    }

    const tokenAUSDValue = getValidUSDValue(tokenA);
    const tokenBUSDValue = getValidUSDValue(tokenB);
    const hasUSDPrice = tokenAUSDValue !== null && tokenBUSDValue !== null;

    if (hasUSDPrice) {
      const tokenAUSDValue = tokenPrices[checkGnotPath(tokenA.path)]?.usd || 0;
      const tokenBUSDValue = tokenPrices[checkGnotPath(tokenB.path)]?.usd || 0;

      const tokenAUSDAmount = BigNumber(quotedTokenAAmount || 0)
        .multipliedBy(tokenAUSDValue)
        .toNumber();
      const tokenBUSDAmount = BigNumber(quotedTokenBAmount || 0)
        .multipliedBy(tokenBUSDValue)
        .toNumber();

      const priceImpactNum =
        tokenAUSDAmount !== 0
          ? BigNumber(tokenBUSDAmount - tokenAUSDAmount)
              .multipliedBy(100)
              .dividedBy(tokenAUSDAmount)
          : BigNumber(0);
      return BigNumber(priceImpactNum.toFixed(2));
    }

    if (estimatedRoutes === null) {
      return BigNumber(0);
    }

    const priceImpactNum = estimatePriceImpactByRoutes(
      checkGnotPath(tokenA.path),
      estimatedRoutes,
      (swapFee || 0) / 100,
      type === "EXACT_OUT",
    );
    prevPriceImpact.current = BigNumber(priceImpactNum.toFixed(2));
    return BigNumber(priceImpactNum.toFixed(2));
  }, [
    estimatedAmount,
    estimatedRoutes,
    getValidUSDValue,
    quotedTokenAAmount,
    quotedTokenBAmount,
    swapFee,
    tokenA,
    tokenB,
    tokenPrices,
    type,
  ]);

  const priceImpactStatus: PriceImpactStatus = useMemo(() => {
    if (!priceImpact) return "NONE";

    if (priceImpact.isGreaterThan(0)) return "POSITIVE";

    if (priceImpact.isLessThanOrEqualTo(0) && priceImpact.isGreaterThanOrEqualTo(-4.99)) return "LOW";

    if (priceImpact.isLessThanOrEqualTo(-5) && priceImpact.isGreaterThanOrEqualTo(-9.99)) return "MEDIUM";

    if (priceImpact.isLessThanOrEqualTo(-10) && priceImpact.isGreaterThanOrEqualTo(-100)) return "HIGH";

    return "NONE";
  }, [priceImpact]);

  const formatPriceImpact = useCallback((priceImpact: BigNumber | null | undefined) => {
    if (!priceImpact) return 0;

    if (priceImpact.isLessThan(-100)) return -100;

    return Number(priceImpact.toFixed(2));
  }, []);

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
      (type === "EXACT_IN" && isAmountLessThanTokenMinimum(tokenA, tokenAAmount)) ||
      (type === "EXACT_OUT" && isAmountLessThanTokenMinimum(tokenB, tokenBAmount)) ||
      (isGNOTPath(toNativePath(tokenA.path)) && BigNumber(tokenAAmount).isLessThan(MINIMUM_GNOT_SWAP_AMOUNT))
    ) {
      return "AMOUNT_TOO_LOW";
    }

    if (compareAmountFn(tokenAAmount, tokenABalance) > 0) {
      return "INSUFFICIENT_BALANCE";
    }

    if (estimatedRoutes === null) {
      return "LOADING";
    }

    if (
      !isSameToken &&
      (swapState === "NO_LIQUIDITY" ||
        (type === "EXACT_IN" && Number(tokenAAmount) > 0 && tokenBAmount === "0" && !isLoading) ||
        (type === "EXACT_OUT" && Number(tokenBAmount) > 0 && tokenAAmount === "0" && !isLoading) ||
        estimatedRoutes.length === 0)
    ) {
      return "INSUFFICIENT_LIQUIDITY";
    }

    if (isSameToken) {
      if (isNativeToken(tokenA)) {
        return "WRAP";
      }
      return "UNWRAP";
    }

    if (priceImpactStatus === "HIGH" && estimatedRoutes.length !== 0) {
      return "HIGHT_PRICE_IMPACT";
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
    estimatedRoutes?.length,
  ]);

  const swapButtonText = useMemo(() => {
    switch (swapButtonState) {
      case "WALLET_LOGIN":
        return t("common:btn.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "SELECT_TOKEN":
        return t("Swap:swapButton.selectToken");
      case "ENTER_AMOUNT":
        return t("Swap:swapButton.enterAmount");
      case "LOADING":
        return t("Swap:swapButton.review");
      case "AMOUNT_TOO_LOW":
        return t("Swap:swapButton.amtLow");
      case "INSUFFICIENT_BALANCE":
        return t("common:btn.insuffiBal");
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
    const tokenAPriceGrade =
      tokenPrices[checkGnotPath(tokenA?.path || "")]?.priceGradeType || TOKEN_PRICE_GRADE_TYPE.NONE;
    const tokenBPriceGrade =
      tokenPrices[checkGnotPath(tokenB?.path || "")]?.priceGradeType || TOKEN_PRICE_GRADE_TYPE.NONE;

    return {
      tokenA,
      tokenAAmount: quotedTokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: formatPrice(tokenAUSD, { usd: true, isKMB: false, approx: true }),
      tokenAPriceGrade,
      tokenB,
      tokenBAmount: quotedTokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: formatPrice(tokenBUSD, { usd: true, isKMB: false, approx: true }),
      tokenBPriceGrade,
      direction: type,
      slippage,
      tokenADecimals: tokenA?.decimals,
      tokenBDecimals: tokenB?.decimals,
    };
  }, [
    slippage,
    type,
    tokenA,
    quotedTokenAAmount,
    tokenABalance,
    tokenAUSD,
    tokenB,
    quotedTokenBAmount,
    tokenBBalance,
    tokenBUSD,
    tokenPrices,
  ]);

  const initializeSwapTokenInputAmount = useCallback(() => {
    setSwapValue(prev => ({
      ...prev,
      type: "EXACT_IN",
      tokenAAmount: "",
      tokenBAmount: "",
      isEarnChanged: false,
      isReverted: false,
      isKeepToken: false,
    }));
    setTokenAAmount("");
    setTokenBAmount("");
    resetSwapAmount();
  }, [resetSwapAmount, setSwapValue]);

  const swapSummaryInfo: SwapSummaryInfo | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }
    const swapRate1USD =
      swapRateAction === SwapRateAction.ATOB
        ? getTokenUSDPrice(checkGnotPath(tokenA.path), 1) || 1
        : getTokenUSDPrice(checkGnotPath(tokenB.path), 1) || 1;

    const protocolFee = `${(swapFee || 0) / 100}%`;
    const routerFee = (swapFee || 0) / 100;

    const networkFeeAmount = Number(displayNetworkFee?.amount ?? 0) || defaultGasFeeAmount;
    const networkFeeUSD = Number(displayNetworkFee?.usdValue ?? 0) || gasFeeUSD;
    const gasEstimateSuccess = !!displayNetworkFee && displayNetworkFee.amount != "0";

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
          amount: networkFeeAmount,
          currency: "GNOT",
        },
        gasFeeUSD: networkFeeUSD,
        swapRateAction,
        swapRate1USD,
        protocolFee,
        routerFee,
        gasEstimateSuccess,
      };
    }

    const tokenAUSDValue = tokenPrices[checkGnotPath(tokenA.path)]?.usd || 1;
    const tokenBUSDValue = tokenPrices[checkGnotPath(tokenB.path)]?.usd || 1;

    const swapRate =
      swapRateAction === SwapRateAction.ATOB
        ? Number(quotedTokenBAmount) / Number(quotedTokenAAmount)
        : Number(quotedTokenAAmount) / Number(quotedTokenBAmount);
    const swapRateUSD =
      type === "EXACT_IN"
        ? BigNumber(quotedTokenBAmount).multipliedBy(tokenBUSDValue).toNumber()
        : BigNumber(quotedTokenAAmount).multipliedBy(tokenAUSDValue).toNumber();

    return {
      tokenA,
      tokenB,
      swapDirection: type,
      swapRate,
      swapRateUSD,
      priceImpact: formatPriceImpact(priceImpact),

      guaranteedAmount: {
        amount: tokenAmountLimit || 0,
        currency: (type === "EXACT_IN" ? tokenB : tokenA).symbol,
      },
      gasFee: {
        amount: networkFeeAmount,
        currency: "GNOT",
      },
      gasFeeUSD: networkFeeUSD,
      swapRateAction,
      swapRate1USD,
      direction: type,
      protocolFee,
      routerFee,
      gasEstimateSuccess,
    };
  }, [
    tokenA,
    tokenB,
    isSameToken,
    type,
    quotedTokenAAmount,
    quotedTokenBAmount,
    tokenAmountLimit,
    swapRateAction,
    type,
    gnotToken,
    defaultGasFeeAmount,
    gasFeeUSD,
    tokenPrices,
    priceImpact,
    formatPriceImpact,
    swapFee,
    displayNetworkFee,
  ]);

  // If the data required for the modal configuration is updated, update the modal data as well
  useEffect(() => {
    if (!swapTokenInfo || !swapSummaryInfo) return;

    setSwapConfirmModalState(prev => ({
      ...prev,
      swapTokenInfo,
      swapSummaryInfo,
      isRefetching,
      estimatedAmount,
      tokenAmountLimit,
    }));
  }, [swapTokenInfo, swapSummaryInfo, isRefetching, estimatedAmount, tokenAmountLimit]);

  const isAvailSwap = useMemo(() => {
    return (
      swapButtonState === "SWAP" ||
      swapButtonState === "WRAP" ||
      swapButtonState === "UNWRAP" ||
      swapButtonState === "HIGHT_PRICE_IMPACT"
    );
  }, [swapButtonState]);

  const executeSwapRef = useRef(executeSwap);
  executeSwapRef.current = executeSwap;

  const executeLatestSwap = useCallback((swapTokenInfo: SwapTokenInfo, estimatedAmount: string | null) => {
    executeSwapRef.current(swapTokenInfo, estimatedAmount);
  }, []);

  const confirmModalTitle = useMemo(() => {
    switch (swapButtonState) {
      case "SWAP":
        return t("Swap:confirmSwapModal.title");
      case "WRAP":
        return t("Swap:confirmSwapModal.confirmBtn.wrap");
      case "UNWRAP":
        return t("Swap:confirmSwapModal.confirmBtn.unwrap");
      case "HIGHT_PRICE_IMPACT":
        return t("Swap:swapButton.swapAnyway");
      default:
        return "";
    }
  }, [swapButtonState, t]);

  const closeModal = useCallback(() => {
    setOpenedModal(false);
    setOpenedConfirmModal(false);
    setModalContent(null);
    setSwapResult(null);
  }, [setModalContent, setOpenedModal]);

  const renderConfirmModalContent = useCallback(
    () => (
      <ConfirmSwapModal
        submitted={true}
        swapResult={swapResult}
        setSwapRateAction={setSwapRateAction}
        swap={executeLatestSwap}
        close={closeModal}
        isWrapOrUnwrap={swapButtonState === "WRAP" || swapButtonState === "UNWRAP"}
        isLoading={isRefetching}
        priceImpactStatus={priceImpactStatus}
        connectedWallet={connectedWallet}
        title={confirmModalTitle}
      />
    ),
    [
      closeModal,
      confirmModalTitle,
      connectedWallet,
      executeLatestSwap,
      isRefetching,
      priceImpactStatus,
      swapButtonState,
      swapResult,
    ],
  );

  const openConfirmModal = useCallback(() => {
    if (!swapSummaryInfo) {
      return;
    }
    setOpenedModal(true);
    setOpenedConfirmModal(true);
    setModalContent(renderConfirmModalContent());
  }, [renderConfirmModalContent, setModalContent, setOpenedModal, swapSummaryInfo]);

  useEffect(() => {
    if (!openedConfirmModal) {
      return;
    }

    setModalContent(renderConfirmModalContent());
  }, [openedConfirmModal, renderConfirmModalContent, setModalContent]);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const onFinishSwap = useCallback(() => {
    closeModal();
    setTokenAAmount("0");
    setTokenBAmount("0");
    resetSwapAmount();
    refetchGrc20Balances();
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
      const result = handleAmount(changed, tokenA, tokenAAmount);

      // If invalid decimal places, don't update or trigger loading
      if (!result.isValid) {
        setIsLoading(false);
        return;
      }

      if (isSameToken) {
        setTokenAAmount(result.value);
        setTokenBAmount(result.value);
        setSwapValue(prev => ({
          ...prev,
          tokenAAmount: result.value,
          tokenBAmount: result.value,
          type: "EXACT_IN",
        }));
        updateSwapAmount(result.value);
        return;
      }

      if (none) {
        setIsLoading(false);
        return;
      }
      if (!matchInputNumber(result.value)) {
        return;
      }
      if (!!Number(result.value) && tokenB?.symbol) {
        setIsLoading(true);
      } else {
        setTokenBAmount("0");
      }

      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_IN",
      }));
      updateSwapAmount(result.value);
      setTokenAAmount(result.value);
    },
    [isSameToken, setSwapValue, tokenA, tokenAAmount, tokenB?.symbol],
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
      const result = handleAmount(changed, tokenB, tokenBAmount);

      if (!result.isValid) {
        setIsLoading(false);
        return;
      }

      if (isSameToken) {
        setTokenAAmount(result.value);
        setTokenBAmount(result.value);
        setSwapValue(prev => ({
          ...prev,
          tokenAAmount: result.value,
          tokenBAmount: result.value,
          type: "EXACT_IN",
        }));
        return;
      }

      if (none) {
        setIsLoading(false);
        return;
      }

      if (!matchInputNumber(result.value)) {
        return;
      }

      if (!!Number(result.value) && tokenA?.symbol) {
        setIsLoading(true);
      } else {
        setTokenAAmount("0");
      }

      setSwapValue(prev => ({
        ...prev,
        type: "EXACT_OUT",
      }));
      updateSwapAmount(result.value);
      setTokenBAmount(result.value);
    },
    [isSameToken, tokenA, tokenB, tokenBAmount],
  );

  const isSameTokenFn = useCallback((tokenA_: TokenModel | null, tokenB_: TokenModel | null) => {
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
  }, []);

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      const changedSwapDirection = type;
      if (isSameTokenFn(tokenB, token)) {
        // changedSwapDirection = type;
        setTokenAAmount(tokenAAmount);
        setTokenBAmount(tokenAAmount);
      }
      setSwapValue(prev => ({
        tokenA: prev.tokenB?.path === token.path ? prev.tokenB : token,
        tokenB: prev.tokenB?.path === token.path ? prev.tokenA : prev.tokenB,
        type: changedSwapDirection,
      }));
      if (!!Number(tokenAAmount)) {
        setIsLoading(true);
      }
    },
    [tokenA, tokenB, type, tokenBAmount, tokenAAmount, isSameToken, isSameTokenFn],
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
        tokenB: prev.tokenA?.path === token.path ? prev.tokenA : token,
        tokenA: prev.tokenA?.path === token.path ? prev.tokenB : prev.tokenA,
        type: changedSwapDirection,
      }));
      if (!!Number(tokenAAmount)) {
        setIsLoading(true);
      }
    },
    [tokenA, type, tokenBAmount, tokenAAmount, swapValue, isSameToken, isSameTokenFn],
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
        let url = window?.location?.host + PAGE_PATH.TOKEN + "?path=" + router.getTokenPath();
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
          if (response?.code === 0 || response?.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: response?.data?.hash,
              action: DexEvent.WRAP,
              formatData: response => {
                if (!response) {
                  return messageData;
                }

                return {
                  ...messageData,
                  tokenAAmount: response[0],
                  tokenBAmount: response[1],
                };
              },
              onUpdate: async () => {
                await refetchGrc20Balances();
                await updateBalances();
              },
              onEmit: async () => {
                await refetchGrc20Balances();
              },
            });
          }

          if (response?.code === 0) {
            openTransactionConfirmModal();
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
          } else if (
            response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(getMessage(DexEvent.WRAP, "error", messageData));
            openTransactionConfirmModal();
          } else {
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
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
          if (response?.code === 0 || response?.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: response?.data?.hash,
              action: DexEvent.UNWRAP,
              formatData: () => messageData,
              onUpdate: async () => {
                await refetchGrc20Balances();
                await updateBalances();
              },
              onEmit: async () => {
                await refetchGrc20Balances();
              },
            });
          }

          if (response?.status === "success") {
            const tokenAAmountStr = tokenAAmount;
            const tokenBAmountStr = tokenBAmount;
            openTransactionConfirmModal();
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
          } else if (
            response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(getMessage(DexEvent.UNWRAP, "error", messageData));
            openTransactionConfirmModal();
          } else {
            openTransactionConfirmModal();
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
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

  function executeSwap(swapTokenInfo: SwapTokenInfo, estimatedAmount: string | null) {
    if (!tokenA || !tokenB) {
      return;
    }

    if (estimatedRoutes === null) {
      return;
    }

    setSubmitted(true);

    const isExactIn = type === "EXACT_IN";
    const swapAmount = isExactIn ? swapTokenInfo.tokenAAmount : swapTokenInfo.tokenBAmount;

    const broadcastMessage = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: isExactIn ? swapTokenInfo.tokenAAmount : nullish.handleFalsy(estimatedAmount, "0"),
      tokenBAmount: isExactIn ? nullish.handleFalsy(estimatedAmount, "0") : swapTokenInfo.tokenBAmount,
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
          if (response.code === 0 || response.type === ERROR_VALUE.TRANSACTION_FAILED.type) {
            enqueueEvent({
              txHash: response?.data?.hash,
              action: DexEvent.SWAP,
              checkWugnotTransfer: true,
              formatData: response => {
                if (!response) {
                  return broadcastMessage;
                }

                const [amount0, amount1] = response;

                return {
                  ...broadcastMessage,
                  tokenAAmount: makeDisplayTokenAmount(tokenA, BigNumber(amount0).abs().toString())?.toString() || "0",
                  tokenBAmount: makeDisplayTokenAmount(tokenB, BigNumber(amount1).abs().toString())?.toString() || "0",
                };
              },
              onUpdate: async () => {
                await refetchGrc20Balances();
                await updateBalances();
              },
              onEmit: async () => {
                await refetchGrc20Balances();
              },
            });
          }

          if (response.code === 0) {
            const responseData = response?.data as SwapRouteSuccessResponse;
            openTransactionConfirmModal();
            broadcastSuccess(getMessage(DexEvent.SWAP, "success", broadcastMessage, responseData.hash), onFinishSwap);
            removeReferrerFromLocalStorage();
          } else if (
            response.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
          ) {
            broadcastRejected(getMessage(DexEvent.SWAP, "error", broadcastMessage, response.data?.hash));
            openTransactionConfirmModal();
          } else {
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
            openTransactionConfirmModal();
          }
        }

        setSwapResult({
          success: response?.code === 0,
          hash: response?.data?.hash || "",
        });
      })
      .catch(e => {
        if (e.status === SWAP_ERROR_VALUE.DRY_SWAP_DEVIATION_EXCEEDED.status) {
          broadcastError(BROADCAST_ERROR_VALUE.SLIPPAGE_EXCEEDED);
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        }
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
      if (swapState === "NO_LIQUIDITY" || swapState === "NONE") {
        if (type === "EXACT_IN") {
          setTokenBAmount("");
        } else {
          setTokenAAmount("");
        }
        return;
      }
    }
  }, [swapState, estimatedAmount, type, tokenA, tokenB]);

  useEffect(() => {
    if (!isEmptyObject(router?.query)) return;
    return () =>
      setSwapValue({
        tokenA: null,
        tokenB: null,
        type: "EXACT_IN",
        tokenAAmount: "",
        tokenBAmount: "",
        isEarnChanged: false,
        isReverted: false,
        isKeepToken: false,
      });
  }, []);

  useEffect(() => {
    // Do not execute unless both tokens A and B are selected
    if (!tokenA?.symbol || !tokenB?.symbol) {
      return;
    }

    // Handle default values when no user input exists
    if (estimateFlagRef.current === 0) {
      if (defaultTokenAAmount) {
        estimateFlagRef.current += 1;
        changeTokenAAmount(defaultTokenAAmount);
        return;
      }
      if (defaultTokenBAmount) {
        estimateFlagRef.current += 1;
        changeTokenBAmount(defaultTokenBAmount);
        return;
      }
    }

    // Special handling for isSameToken case
    if (!isSameToken) {
      const isUserInput = tokenAAmount !== "" || tokenBAmount !== "";
      if (isUserInput) {
        return;
      }
    }
    // Special handling for isSameToken case
    if (tokenAAmount && !tokenBAmount) {
      setTokenBAmount(tokenAAmount);
      return;
    }
  }, [
    tokenA,
    tokenB,
    defaultTokenAAmount,
    defaultTokenBAmount,
    tokenAAmount,
    tokenBAmount,
    isSameToken,
    changeTokenAAmount,
    changeTokenBAmount,
  ]);

  // useEffect to manage loading state when token amount changes
  useEffect(() => {
    if (!tokenA?.symbol || !tokenB?.symbol) return;

    if (!!Number(tokenAAmount) || !!Number(tokenBAmount)) {
      setIsLoading(true);
    }
  }, [tokenA?.symbol, tokenB?.symbol, tokenAAmount, tokenBAmount]);

  return {
    slippage,
    connectedWallet,
    copied,
    displayNetworkFee,
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
    isLoading: swapState === "LOADING" || isTyping,
    isLoadingGasInfo,
    isRefetching,
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
    handleResetEstimatedLiquidity,
    initializeSwapTokenInputAmount,
  };
};
