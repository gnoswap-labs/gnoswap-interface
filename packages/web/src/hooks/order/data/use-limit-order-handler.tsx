import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { MIN_GNOT_DEPOSIT_AMOUNT } from "@common/clients/wallet-client/transaction-messages";
import ConfirmLimitOrderModal from "@components/order/confirm-limit-order-modal/ConfirmLimitOrderModal";
import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { LIMIT_EXPIRY_OPTIONS } from "@models/order/limit-order-model";
import { LimitOrderSide, SWAP_CARD_TYPE } from "@models/order/order-type";
import { LimitOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useLimitMarketPrices } from "@providers/limit-market-price-provider/LimitMarketPriceProvider";
import { useGetLimitConfig } from "@query/order";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { CreateLimitOrderRequest } from "@repositories/order/request";
import { OrderState, SwapState } from "@states/index";
import { calculateLimitMinimumReceived } from "@utils/order-amount-utils";
import {
  calculatePriceDeviation,
  formatBps,
  formatOrderDateTime,
  formatOrderRate,
  invertOrderRate,
  trimFractionZeros,
} from "@utils/order-format-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { isNativeTokenPath, makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

import { useConfirmOrderModal } from "../ui/use-confirm-order-modal";
import { getOrderButtonText, useOrderFormCommon } from "./use-order-form-common";
import {
  applyLimitPricePreset,
  calculateMakingAmount,
  calculateTakingAmount,
  calculateUsdValue,
  DEFAULT_MIN_MAKING_AMOUNT,
  formatLimitPriceInput,
  getAvailableExpiryOptions,
  getLimitMinMakingAmount,
  getOrderButtonState,
  hasWhitelistedPoolForPair,
  isLimitAmountTooLow,
  MAX_LIMIT_SLIPPAGE_BPS,
  stepLimitPrice,
  toLimitSlippageBps,
} from "./use-order-handler.utils";
import { useOrderTransaction } from "./use-order-transaction";

const INPUT_DEBOUNCE_MS = 300;
const QUOTE_REFETCH_INTERVAL = 10_000;

/** Drops the digits a token cannot hold (`0.1234567` → `0.123456` for 6 decimals); other input is kept as is. */
function truncateToDecimals(value: string, decimals: number): string {
  const [, fraction] = value.split(".");
  if (!fraction || fraction.length <= decimals) return value;
  return BigNumber(value).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed();
}

export const useLimitOrderHandler = () => {
  const { t } = useTranslation();
  const { orderRepository } = useGnoswapContext();
  const [slippage, changeSlippage] = useAtom(OrderState.limitSlippage);
  const { openModal: openConnectWallet } = useConnectWalletModal();
  const { submit } = useOrderTransaction();

  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const [fundingAmountInput, setFundingAmountInput] = useAtom(OrderState.limitSellAmount);
  const [buyAmountInput, setBuyAmountInput] = useAtom(OrderState.limitBuyAmount);
  const [orderSide, setOrderSide] = useAtom(OrderState.limitOrderSide);
  const [limitPrice, setLimitPrice] = useAtom(OrderState.limitPrice);
  const [pricedPairKey, setPricedPairKey] = useAtom(OrderState.limitPricePairKey);
  const [pricePreset, setPricePreset] = useAtom(OrderState.limitPricePreset);
  const [expiry, setExpiry] = useAtom(OrderState.limitExpiry);

  const tokenA = swapValue.tokenA ?? null;
  const tokenB = swapValue.tokenB ?? null;

  const changeSellAmount = useCallback(
    (value: string) => {
      setFundingAmountInput(value);
      setBuyAmountInput("");
    },
    [setBuyAmountInput, setFundingAmountInput],
  );
  const changeBuyAmount = useCallback(
    (value: string) => {
      setBuyAmountInput(value);
      setFundingAmountInput("");
    },
    [setBuyAmountInput, setFundingAmountInput],
  );

  const {
    connected,
    isSwitchNetwork,
    switchNetwork,
    copied,
    copyUrl,
    getUsdPrice,
    tokenABalance,
    tokenBBalance,
    isSameToken,
    formatUsd,
  } = useOrderFormCommon(tokenA, tokenB);

  const {
    data: config,
    isLoading: isLoadingConfig,
    isError: isConfigError,
    refetch: refetchConfig,
  } = useGetLimitConfig();
  const whitelistedPools =
    !isConfigError && Array.isArray(config?.whitelistedPools) ? config.whitelistedPools : undefined;
  const whitelistedPoolsRef = useRef(whitelistedPools);
  whitelistedPoolsRef.current = whitelistedPools;
  const hasWhitelistedPool = useMemo<boolean | null>(() => {
    if (!tokenA || !tokenB || isSameToken || !whitelistedPools) return null;
    return hasWhitelistedPoolForPair(whitelistedPools, getSwapTokenPath(tokenA), getSwapTokenPath(tokenB));
  }, [isSameToken, tokenA, tokenB, whitelistedPools]);
  const isPoolCheckFailed = hasWhitelistedPool === null && !!tokenA && !!tokenB && !isSameToken;

  const expiryOptions = useMemo(
    () => getAvailableExpiryOptions(config?.minDurationSec, config?.maxDurationSec),
    [config?.maxDurationSec, config?.minDurationSec],
  );

  useEffect(() => {
    if (expiryOptions.length > 0 && !expiryOptions.some(option => option.duration === expiry)) {
      setExpiry(expiryOptions[0].duration);
    }
  }, [expiry, expiryOptions, setExpiry]);

  // Typed Buy quantities use an exact-output quote. Max and old `amount=` links
  // remain funding budgets, so neither their quote nor their amount depends on the limit price.
  // The router quote only checks that the order can be filled; it never prices the form.
  const isBuyQuantity = orderSide === "buy" && (buyAmountInput !== "" || fundingAmountInput === "");
  const debouncedFundingAmount = useDebounce(fundingAmountInput, INPUT_DEBOUNCE_MS);
  const debouncedBuyAmount = useDebounce(buyAmountInput, INPUT_DEBOUNCE_MS);
  const quotedAmount = isBuyQuantity ? debouncedBuyAmount : debouncedFundingAmount;
  const quoteAmount = BigNumber(quotedAmount || 0).isGreaterThan(0) ? quotedAmount : "1";
  const quoteExactType = isBuyQuantity ? "EXACT_OUT" : "EXACT_IN";
  const { data: routes } = useGetRoutes(
    tokenA && tokenB && !isSameToken
      ? { inputToken: tokenA, outputToken: tokenB, tokenAmount: quoteAmount, exactType: quoteExactType }
      : null,
    { refetchInterval: QUOTE_REFETCH_INTERVAL },
  );
  const hasLiquidity = !isSameToken && routes?.status !== "NO_LIQUIDITY";

  // The pool's spot rate is the same for any order size. A Buy prices its base, the output token, so the
  // rate is inverted at full precision; only the price field and the display round it.
  const { getPrice } = useLimitMarketPrices();
  const spotRate = getPrice(
    tokenA && tokenB ? { tokenIn: getSwapTokenPath(tokenA), tokenOut: getSwapTokenPath(tokenB) } : null,
  );
  const spotMarketPrice = useMemo(
    () => (orderSide === "buy" ? invertOrderRate(spotRate) : spotRate),
    [orderSide, spotRate],
  );
  /** The market price as the limit price field takes it, which the Market preset fills in. */
  const marketPrice = useMemo(
    () => (spotMarketPrice ? formatLimitPriceInput(spotMarketPrice) || null : null),
    [spotMarketPrice],
  );
  const defaultPreset = orderSide === "buy" ? -10 : 10;

  // Preserve manual prices (including an empty edit), but keep presets tied to
  // the latest market price. Pair ownership survives switching to Swap or DCA.
  const pairKey = tokenA && tokenB ? `${tokenA.path}|${tokenB.path}` : null;

  useEffect(() => {
    if (!pairKey) return;
    if (pricedPairKey === pairKey) {
      if (pricePreset !== null && spotMarketPrice) {
        const nextPrice = applyLimitPricePreset(spotMarketPrice, pricePreset);
        if (nextPrice !== limitPrice) setLimitPrice(nextPrice);
      }
      return;
    }
    if (limitPrice && pricedPairKey === null) {
      // A typed or restored (URL) price not bound to a pair yet belongs to this one.
      setPricedPairKey(pairKey);
      return;
    }
    if (limitPrice) {
      // A new pair starts from a fresh market price in the selected Buy/Sell perspective.
      setLimitPrice("");
      setPricedPairKey(null);
      setPricePreset(defaultPreset);
      return;
    }
    if (spotMarketPrice) {
      setPricedPairKey(pairKey);
      setPricePreset(defaultPreset);
      setLimitPrice(applyLimitPricePreset(spotMarketPrice, defaultPreset));
    }
  }, [
    defaultPreset,
    limitPrice,
    pairKey,
    pricePreset,
    pricedPairKey,
    setLimitPrice,
    setPricePreset,
    setPricedPairKey,
    spotMarketPrice,
  ]);

  const isValidPrice = BigNumber(limitPrice || 0).isGreaterThan(0);

  useEffect(() => {
    if (!tokenA || !fundingAmountInput) return;
    const truncated = truncateToDecimals(fundingAmountInput, tokenA.decimals);
    if (truncated !== fundingAmountInput) setFundingAmountInput(truncated);
  }, [fundingAmountInput, setFundingAmountInput, tokenA]);
  useEffect(() => {
    if (!tokenB || !buyAmountInput) return;
    const truncated = truncateToDecimals(buyAmountInput, tokenB.decimals);
    if (truncated !== buyAmountInput) setBuyAmountInput(truncated);
  }, [buyAmountInput, setBuyAmountInput, tokenB]);

  const fundingBudget = tokenA ? (makeRawTokenAmount(tokenA, fundingAmountInput || "0") ?? "0") : "0";
  const takingAmount =
    tokenA && tokenB && isValidPrice
      ? isBuyQuantity
        ? (makeRawTokenAmount(tokenB, buyAmountInput || "0") ?? "0")
        : calculateTakingAmount(fundingBudget, limitPrice, tokenA, tokenB, orderSide)
      : "0";
  const makingAmount =
    orderSide === "buy"
      ? tokenA && tokenB && isValidPrice
        ? calculateMakingAmount(takingAmount, limitPrice, tokenA, tokenB)
        : "0"
      : fundingBudget;
  const enteredAmount = isBuyQuantity ? buyAmountInput : fundingAmountInput;
  const sellAmount =
    orderSide === "buy"
      ? tokenA && isValidPrice && enteredAmount
        ? (makeDisplayTokenAmountString(tokenA, makingAmount) ?? "")
        : ""
      : fundingAmountInput;
  const hasRawAmounts = BigNumber(makingAmount).isGreaterThan(0) && BigNumber(takingAmount).isGreaterThan(0);
  const buyAmount = isBuyQuantity
    ? buyAmountInput
    : tokenB && isValidPrice && fundingAmountInput
      ? (makeDisplayTokenAmountString(tokenB, takingAmount) ?? "")
      : "";
  const sellUsd = useMemo(() => calculateUsdValue(sellAmount, getUsdPrice(tokenA)), [getUsdPrice, sellAmount, tokenA]);
  const buyUsd = useMemo(() => calculateUsdValue(buyAmount, getUsdPrice(tokenB)), [buyAmount, getUsdPrice, tokenB]);
  /** The sell amount as sent: the raw making amount in display units. */
  const sentSellAmount = tokenA ? (makeDisplayTokenAmountString(tokenA, makingAmount) ?? "0") : "0";

  // The Limit realm's own minimums: `minMakingAmount` raw input and a positive `takingAmount`.
  // Native GNOT must also reach the wrap minimum, or no Deposit could be built.
  const minMakingAmount = getLimitMinMakingAmount(
    config?.minMakingAmount || DEFAULT_MIN_MAKING_AMOUNT,
    !!tokenA && isNativeTokenPath(tokenA.path),
    MIN_GNOT_DEPOSIT_AMOUNT,
  );
  // Checked on the raw amounts whenever a positive amount is entered: one that rounds down to a
  // raw 0 (or a raw 0 output) must not reach Place Order.
  const isAmountTooLow =
    BigNumber(enteredAmount || 0).isGreaterThan(0) &&
    isValidPrice &&
    isLimitAmountTooLow(makingAmount, takingAmount, minMakingAmount);
  const minTradingText = tokenA
    ? t("Swap:limit.minTrading", {
        amount: makeDisplayTokenAmountString(tokenA, minMakingAmount) ?? minMakingAmount,
        symbol: tokenA.displaySymbol,
      })
    : "";

  const buttonState = getOrderButtonState({
    connected,
    isSwitchNetwork,
    isPaused: !!config?.halted?.execute,
    hasTokens: !!tokenA && !!tokenB,
    // Without a price there is nothing to order yet.
    amount: isValidPrice ? enteredAmount : "",
    requiredAmount: sellAmount,
    balance: tokenABalance,
    hasLiquidity,
    hasWhitelistedPool: hasWhitelistedPool === true,
    isPoolCheckFailed,
    isAmountTooLow,
  });

  const buttonText = getOrderButtonText(buttonState, t, t("Swap:dca.placeOrder"));

  const maxSlippageBps = config?.maxSlippageBps ?? MAX_LIMIT_SLIPPAGE_BPS;
  const slippageBps = toLimitSlippageBps(slippage, maxSlippageBps);
  // The settings show the tolerance actually confirmed and sent, and accept no more than the realm does.
  const effectiveSlippage = BigNumber(slippageBps).dividedBy(100).toNumber();
  const maxSlippage = BigNumber(maxSlippageBps).dividedBy(100).toNumber();
  const executionFee = formatBps(config?.executionFeeBps);
  const minimumReceived = useMemo(
    () =>
      tokenB && hasRawAmounts
        ? (makeDisplayTokenAmountString(tokenB, calculateLimitMinimumReceived(takingAmount, slippageBps)) ?? "")
        : "",
    [hasRawAmounts, slippageBps, takingAmount, tokenB],
  );

  const createRequest = useMemo((): Omit<CreateLimitOrderRequest, "expiresAt"> | null => {
    if (buttonState !== "PLACE_ORDER" || !tokenA || !tokenB || !hasRawAmounts || hasWhitelistedPool !== true) {
      return null;
    }
    return {
      tokenIn: tokenA,
      tokenOut: tokenB,
      baseToken: orderSide === "buy" ? tokenB : tokenA,
      makingAmount,
      takingAmount,
      slippageBps,
    };
  }, [
    buttonState,
    hasRawAmounts,
    hasWhitelistedPool,
    makingAmount,
    orderSide,
    slippageBps,
    takingAmount,
    tokenA,
    tokenB,
  ]);

  /**
   * The CreateOrder messages for a native making amount of `rawAmount` at the
   * current price (the market price until one is set), so Max reserves the
   * storage and measured cost of this order. This simulation requires a known, directly whitelisted pair.
   */
  const maxAmountPrice = isValidPrice ? limitPrice : marketPrice;
  const makeMaxAmountMessages = useCallback(
    async (rawAmount: string) => {
      if (!tokenA || !tokenB || isSameToken || !maxAmountPrice || hasWhitelistedPool !== true) return [];
      const maxTakingAmount = calculateTakingAmount(rawAmount, maxAmountPrice, tokenA, tokenB, orderSide);
      if (!BigNumber(maxTakingAmount).isGreaterThan(0)) return [];
      const maxMakingAmount =
        orderSide === "buy" ? calculateMakingAmount(maxTakingAmount, maxAmountPrice, tokenA, tokenB) : rawAmount;
      if (!BigNumber(maxMakingAmount).isGreaterThan(0)) return [];
      return orderRepository.makeCreateLimitOrderMessages({
        tokenIn: tokenA,
        tokenOut: tokenB,
        baseToken: orderSide === "buy" ? tokenB : tokenA,
        makingAmount: maxMakingAmount,
        takingAmount: maxTakingAmount,
        slippageBps,
        expiresAt: Math.floor(Date.now() / 1000) + expiry,
      });
    },
    [expiry, hasWhitelistedPool, isSameToken, maxAmountPrice, orderRepository, orderSide, slippageBps, tokenA, tokenB],
  );
  // What else the Max estimate was priced for, so an answer for another order is not written back.
  const maxAmountDependsOn = useMemo(
    () => [tokenB?.path, maxAmountPrice, expiry, slippageBps, orderSide],
    [expiry, maxAmountPrice, orderSide, slippageBps, tokenB?.path],
  );

  const expiryLabel = useCallback(
    (duration: number) => {
      const option = LIMIT_EXPIRY_OPTIONS.find(item => item.duration === duration);
      return option ? t(`Swap:limit.expiryOption.${option.key}`) : `${duration}s`;
    },
    [t],
  );

  const summary: LimitOrderSummary | null = useMemo(() => {
    if (!tokenA || !tokenB) return null;
    const baseToken = orderSide === "buy" ? tokenB : tokenA;
    const quoteToken = orderSide === "buy" ? tokenA : tokenB;
    return {
      tokenIn: tokenA,
      tokenOut: tokenB,
      sellAmount: sentSellAmount,
      sellAmountUsd: formatUsd(sellUsd),
      buyAmount: makeDisplayTokenAmountString(tokenB, takingAmount) ?? "0",
      buyAmountUsd: formatUsd(buyUsd),
      minimumReceived,
      limitPrice: isValidPrice
        ? `1 ${baseToken.displaySymbol} = ${formatOrderRate(limitPrice)} ${quoteToken.displaySymbol}`
        : "-",
      limitPriceDeviation: calculatePriceDeviation(limitPrice, spotMarketPrice),
      expiresAt: formatOrderDateTime(Math.floor(Date.now() / 1000) + expiry),
      expiryDurationSec: expiry,
      slippage: `${trimFractionZeros(BigNumber(slippageBps).dividedBy(100).toFixed(2))}%`,
      executionFee,
    };
  }, [
    buyUsd,
    expiry,
    executionFee,
    formatUsd,
    isValidPrice,
    limitPrice,
    orderSide,
    spotMarketPrice,
    minimumReceived,
    sellUsd,
    sentSellAmount,
    slippageBps,
    takingAmount,
    tokenA,
    tokenB,
  ]);

  /** Changing a pair or intent requires a new quote and a price in the correct units. */
  const resetPairInputs = useCallback(
    (side: LimitOrderSide = orderSide) => {
      setPricedPairKey(null);
      setLimitPrice("");
      setPricePreset(side === "buy" ? -10 : 10);
    },
    [orderSide, setLimitPrice, setPricePreset, setPricedPairKey],
  );

  const changeOrderSide = useCallback(
    (side: LimitOrderSide) => {
      if (side === orderSide) return;
      resetPairInputs(side);
      setOrderSide(side);
      // The base asset stays the same, while funding and receiving tokens reverse.
      // Do not reinterpret an amount entered in a different token denomination.
      setFundingAmountInput("");
      setBuyAmountInput("");
      setSwapValue(prev => ({ ...prev, tokenA: prev.tokenB, tokenB: prev.tokenA }));
    },
    [orderSide, resetPairInputs, setBuyAmountInput, setFundingAmountInput, setOrderSide, setSwapValue],
  );

  // Shared links already contain the actual input/output pair; do not reverse it again.
  const restoreOrderSide = useCallback(
    (side: LimitOrderSide) => {
      if (side !== orderSide) {
        resetPairInputs(side);
        setFundingAmountInput("");
        setBuyAmountInput("");
      }
      setOrderSide(side);
    },
    [orderSide, resetPairInputs, setBuyAmountInput, setFundingAmountInput, setOrderSide],
  );

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      resetPairInputs();
      setSwapValue(prev => ({
        ...prev,
        tokenA: token,
        tokenB: prev.tokenB?.path === token.path ? prev.tokenA : prev.tokenB,
      }));
    },
    [resetPairInputs, setSwapValue],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      resetPairInputs();
      setSwapValue(prev => ({
        ...prev,
        tokenB: token,
        tokenA: prev.tokenA?.path === token.path ? prev.tokenB : prev.tokenA,
      }));
    },
    [resetPairInputs, setSwapValue],
  );

  const switchTokens = useCallback(() => {
    resetPairInputs();
    setSwapValue(prev => ({ ...prev, tokenA: prev.tokenB, tokenB: prev.tokenA }));
  }, [resetPairInputs, setSwapValue]);

  const changeLimitPrice = useCallback(
    (value: string) => {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
      setPricePreset(null);
      setLimitPrice(value);
    },
    [setLimitPrice, setPricePreset],
  );

  /** A price from a shared link, for the pair the link restores rather than the one held before. */
  const restoreLimitPrice = useCallback(
    (value: string) => {
      setPricedPairKey(null);
      setPricePreset(null);
      setLimitPrice(value);
    },
    [setLimitPrice, setPricePreset, setPricedPairKey],
  );

  const stepPrice = useCallback(
    (direction: 1 | -1) => {
      setPricePreset(null);
      setLimitPrice(prev => stepLimitPrice(prev || spotMarketPrice || "", direction));
    },
    [setLimitPrice, setPricePreset, spotMarketPrice],
  );

  const applyPreset = useCallback(
    (percent: number) => {
      if (!spotMarketPrice) return;
      setPricePreset(percent);
      setLimitPrice(applyLimitPricePreset(spotMarketPrice, percent));
    },
    [setLimitPrice, setPricePreset, spotMarketPrice],
  );

  const copyURL = useCallback(
    () =>
      copyUrl({
        type: SWAP_CARD_TYPE.LIMIT,
        side: orderSide,
        from: tokenA?.path,
        to: tokenB?.path,
        amount: orderSide === "sell" ? sellAmount : undefined,
        buyAmount: orderSide === "buy" ? buyAmount : undefined,
        price: limitPrice,
        expiry,
      }),
    [buyAmount, copyUrl, expiry, limitPrice, orderSide, sellAmount, tokenA?.path, tokenB?.path],
  );

  const placeOrder = useCallback(() => {
    if (!tokenA || !tokenB || !createRequest) return;
    const currentWhitelistedPools = whitelistedPoolsRef.current;
    if (
      !currentWhitelistedPools ||
      !hasWhitelistedPoolForPair(currentWhitelistedPools, getSwapTokenPath(tokenA), getSwapTokenPath(tokenB))
    ) {
      return;
    }

    const messageData = {
      tokenASymbol: tokenA.displaySymbol,
      tokenBSymbol: tokenB.displaySymbol,
      tokenAAmount: trimFractionZeros(BigNumber(sentSellAmount).toFormat(tokenA.decimals)),
      tokenBAmount: trimFractionZeros(
        BigNumber(makeDisplayTokenAmountString(tokenB, takingAmount) ?? 0).toFormat(tokenB.decimals),
      ),
    };

    submit({
      action: DexEvent.LIMIT_ORDER,
      messageData,
      send: () =>
        orderRepository.sendCreateLimitOrder({
          ...createRequest,
          expiresAt: Math.floor(Date.now() / 1000) + expiry,
        }),
      onBroadcast: () => {
        setFundingAmountInput("");
        setBuyAmountInput("");
      },
    });
  }, [
    createRequest,
    expiry,
    orderRepository,
    sentSellAmount,
    setBuyAmountInput,
    setFundingAmountInput,
    submit,
    takingAmount,
    tokenA,
    tokenB,
  ]);

  const closeConfirmModalRef = useRef<() => void>(() => undefined);

  const renderConfirmModal = useCallback(
    () =>
      summary ? (
        <ConfirmLimitOrderModal
          summary={summary}
          confirm={() => {
            closeConfirmModalRef.current();
            placeOrder();
          }}
          close={() => closeConfirmModalRef.current()}
        />
      ) : (
        <></>
      ),
    [placeOrder, summary],
  );

  const { opened: isConfirmOpened, openModal, closeModal } = useConfirmOrderModal(renderConfirmModal);
  closeConfirmModalRef.current = closeModal;
  useEffect(() => {
    if (isConfirmOpened && buttonState !== "PLACE_ORDER") closeModal();
  }, [buttonState, closeModal, isConfirmOpened]);

  const onClickButton = useCallback(() => {
    switch (buttonState) {
      case "WALLET_LOGIN":
        openConnectWallet();
        return;
      case "SWITCH_NETWORK":
        switchNetwork();
        return;
      case "POOL_CHECK_FAILED":
        void refetchConfig();
        return;
      case "PLACE_ORDER":
        openModal();
        return;
      default:
        return;
    }
  }, [buttonState, openConnectWallet, openModal, refetchConfig, switchNetwork]);

  return {
    orderSide,
    changeOrderSide,
    restoreOrderSide,
    tokenA,
    tokenB,
    tokenABalance,
    makeMaxAmountMessages,
    maxAmountDependsOn,
    tokenBBalance,
    connected,
    sellAmount,
    sellAmountUsd: formatUsd(sellUsd),
    buyAmount,
    buyAmountUsd: formatUsd(buyUsd),
    minimumReceived,
    executionFee,
    limitPrice,
    limitPriceUsd: formatUsd(
      isValidPrice ? calculateUsdValue(limitPrice, getUsdPrice(orderSide === "buy" ? tokenA : tokenB)) : null,
    ),
    marketPrice,
    selectedPreset: pricePreset,
    expiry,
    expiryOptions: expiryOptions.map(option => ({ value: option.duration, label: expiryLabel(option.duration) })),
    isLoadingConfig,
    buttonState,
    buttonText,
    minTradingText,
    copied,
    slippage: effectiveSlippage,
    maxSlippage,
    changeSlippage,
    copyURL,
    changeTokenA,
    changeTokenB,
    switchTokens,
    changeSellAmount,
    changeBuyAmount,
    changeLimitPrice,
    stepPrice,
    applyPreset,
    changeExpiry: setExpiry,
    setLimitPrice: restoreLimitPrice,
    onClickButton,
  };
};
