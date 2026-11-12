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
import { SWAP_CARD_TYPE } from "@models/order/order-type";
import { LimitOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useGetLimitConfig } from "@query/order";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { CreateLimitOrderRequest } from "@repositories/order/request";
import { OrderState, SwapState } from "@states/index";
import { calculateLimitMinimumReceived } from "@utils/order-amount-utils";
import { calculatePriceDeviation, formatBps, formatOrderDateTime, trimFractionZeros } from "@utils/order-format-utils";
import { isNativeTokenPath, makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

import { useConfirmOrderModal } from "../ui/use-confirm-order-modal";
import { getOrderButtonText, useOrderFormCommon } from "./use-order-form-common";
import {
  applyLimitPricePreset,
  calculateTakingAmount,
  calculateUsdValue,
  DEFAULT_MIN_MAKING_AMOUNT,
  formatLimitPriceInput,
  getAvailableExpiryOptions,
  getLimitMinMakingAmount,
  getOrderButtonState,
  isLimitAmountTooLow,
  MAX_LIMIT_SLIPPAGE_BPS,
  stepLimitPrice,
  toLimitSlippageBps,
} from "./use-order-handler.utils";
import { useOrderTransaction } from "./use-order-transaction";

const INPUT_DEBOUNCE_MS = 300;
const QUOTE_REFETCH_INTERVAL = 10_000;

function floorToDecimals(value: BigNumber.Value, decimals: number): string {
  const number = BigNumber(value);
  if (!number.isFinite() || number.isLessThanOrEqualTo(0)) return "";
  return number.decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed();
}

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
  const [sellAmount, setSellAmount] = useAtom(OrderState.limitSellAmount);
  const [limitPrice, setLimitPrice] = useAtom(OrderState.limitPrice);
  const [pricedPairKey, setPricedPairKey] = useAtom(OrderState.limitPricePairKey);
  const [pricePreset, setPricePreset] = useAtom(OrderState.limitPricePreset);
  const [expiry, setExpiry] = useAtom(OrderState.limitExpiry);

  const tokenA = swapValue.tokenA ?? null;
  const tokenB = swapValue.tokenB ?? null;

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
    formatRate,
  } = useOrderFormCommon(tokenA, tokenB);

  const { data: config, isLoading: isLoadingConfig } = useGetLimitConfig();

  const expiryOptions = useMemo(
    () => getAvailableExpiryOptions(config?.minDurationSec, config?.maxDurationSec),
    [config?.maxDurationSec, config?.minDurationSec],
  );

  useEffect(() => {
    if (expiryOptions.length > 0 && !expiryOptions.some(option => option.duration === expiry)) {
      setExpiry(expiryOptions[0].duration);
    }
  }, [expiry, expiryOptions, setExpiry]);

  // Market price, quoted at the amount being sold so it reflects the price impact of this order.
  const debouncedSellAmount = useDebounce(sellAmount, INPUT_DEBOUNCE_MS);
  const quoteAmount = BigNumber(debouncedSellAmount || 0).isGreaterThan(0) ? debouncedSellAmount : "1";
  const { data: routes } = useGetRoutes(
    tokenA && tokenB && !isSameToken
      ? { inputToken: tokenA, outputToken: tokenB, tokenAmount: quoteAmount, exactType: "EXACT_IN" }
      : null,
    { refetchInterval: QUOTE_REFETCH_INTERVAL },
  );
  const hasLiquidity = !isSameToken && routes?.status !== "NO_LIQUIDITY";
  const marketPrice = useMemo(() => {
    if (!tokenB || routes?.status !== "SUCCESS") return null;
    const output = makeDisplayTokenAmountString(tokenB, routes.amount);
    if (!output) return null;
    return formatLimitPriceInput(BigNumber(output).dividedBy(quoteAmount)) || null;
  }, [quoteAmount, routes, tokenB]);

  // Preserve manual prices (including an empty edit), but keep presets tied to
  // fresh router quotes. Pair ownership survives switching to Swap or DCA.
  const pairKey = tokenA && tokenB ? `${tokenA.path}|${tokenB.path}` : null;

  useEffect(() => {
    if (!pairKey) return;
    if (pricedPairKey === pairKey) {
      if (pricePreset !== null && marketPrice) {
        const nextPrice = pricePreset === 0 ? marketPrice : applyLimitPricePreset(marketPrice, pricePreset);
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
      // The price of another pair: start again from its market price +10%.
      setLimitPrice("");
      setPricedPairKey(null);
      setPricePreset(10);
      return;
    }
    if (marketPrice) {
      setPricedPairKey(pairKey);
      setPricePreset(10);
      setLimitPrice(applyLimitPricePreset(marketPrice, 10));
    }
  }, [limitPrice, marketPrice, pairKey, pricePreset, pricedPairKey, setLimitPrice, setPricePreset, setPricedPairKey]);

  const isValidPrice = BigNumber(limitPrice || 0).isGreaterThan(0);

  const buyAmount = useMemo(() => {
    if (!tokenB || !isValidPrice || !sellAmount) return "";
    return floorToDecimals(BigNumber(sellAmount).multipliedBy(limitPrice), tokenB.decimals);
  }, [isValidPrice, limitPrice, sellAmount, tokenB]);

  const sellUsd = useMemo(() => calculateUsdValue(sellAmount, getUsdPrice(tokenA)), [getUsdPrice, sellAmount, tokenA]);
  const buyUsd = useMemo(() => calculateUsdValue(buyAmount, getUsdPrice(tokenB)), [buyAmount, getUsdPrice, tokenB]);

  // A sell amount restored from a link, or kept from a token with more decimals, can hold digits the
  // input token cannot represent; trim them so the form shows what will be sent.
  useEffect(() => {
    if (!tokenA || !sellAmount) return;
    const truncated = truncateToDecimals(sellAmount, tokenA.decimals);
    if (truncated !== sellAmount) setSellAmount(truncated);
  }, [sellAmount, setSellAmount, tokenA]);

  const makingAmount = tokenA ? (makeRawTokenAmount(tokenA, sellAmount || "0") ?? "0") : "0";
  const takingAmount =
    tokenA && tokenB && isValidPrice ? calculateTakingAmount(makingAmount, limitPrice, tokenA, tokenB) : "0";
  const hasRawAmounts = BigNumber(makingAmount).isGreaterThan(0) && BigNumber(takingAmount).isGreaterThan(0);
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
    BigNumber(sellAmount || 0).isGreaterThan(0) &&
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
    amount: isValidPrice ? sellAmount : "",
    balance: tokenABalance,
    hasLiquidity,
    isAmountTooLow,
  });

  const buttonText = getOrderButtonText(buttonState, t, t("Swap:limit.startToOrder"));

  const maxSlippageBps = config?.maxSlippageBps ?? MAX_LIMIT_SLIPPAGE_BPS;
  const slippageBps = toLimitSlippageBps(slippage, maxSlippageBps);
  // The settings show the tolerance actually confirmed and sent, and accept no more than the realm does.
  const effectiveSlippage = BigNumber(slippageBps).dividedBy(100).toNumber();
  const maxSlippage = BigNumber(maxSlippageBps).dividedBy(100).toNumber();
  const executionFee = formatBps(config?.executionFeeBps);
  const minimumReceived = useMemo(
    () =>
      tokenB && hasRawAmounts
        ? makeDisplayTokenAmountString(tokenB, calculateLimitMinimumReceived(takingAmount, slippageBps)) ?? ""
        : "",
    [hasRawAmounts, slippageBps, takingAmount, tokenB],
  );

  const createRequest = useMemo((): Omit<CreateLimitOrderRequest, "expiresAt"> | null => {
    if (buttonState !== "PLACE_ORDER" || !tokenA || !tokenB || !hasRawAmounts) return null;
    return { tokenIn: tokenA, tokenOut: tokenB, makingAmount, takingAmount, slippageBps };
  }, [buttonState, hasRawAmounts, makingAmount, slippageBps, takingAmount, tokenA, tokenB]);

  /**
   * The CreateOrder messages for a native making amount of `rawAmount` at the
   * current price (the market price until one is set), so Max reserves the
   * storage and measured cost of this order. Built regardless of the button state.
   */
  const maxAmountPrice = isValidPrice ? limitPrice : marketPrice;
  const makeMaxAmountMessages = useCallback(
    async (rawAmount: string) => {
      if (!tokenA || !tokenB || isSameToken || !maxAmountPrice) return [];
      const maxTakingAmount = calculateTakingAmount(rawAmount, maxAmountPrice, tokenA, tokenB);
      if (!BigNumber(maxTakingAmount).isGreaterThan(0)) return [];
      return orderRepository.makeCreateLimitOrderMessages({
        tokenIn: tokenA,
        tokenOut: tokenB,
        makingAmount: rawAmount,
        takingAmount: maxTakingAmount,
        slippageBps,
        expiresAt: Math.floor(Date.now() / 1000) + expiry,
      });
    },
    [expiry, isSameToken, maxAmountPrice, orderRepository, slippageBps, tokenA, tokenB],
  );
  // What else the Max estimate was priced for, so an answer for another order is not written back.
  const maxAmountDependsOn = useMemo(
    () => [tokenB?.path, maxAmountPrice, expiry, slippageBps],
    [expiry, maxAmountPrice, slippageBps, tokenB?.path],
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
    return {
      tokenIn: tokenA,
      tokenOut: tokenB,
      sellAmount: sentSellAmount,
      sellAmountUsd: formatUsd(sellUsd),
      buyAmount: makeDisplayTokenAmountString(tokenB, takingAmount) ?? "0",
      buyAmountUsd: formatUsd(buyUsd),
      minimumReceived,
      limitPrice: formatRate(isValidPrice ? limitPrice : null).text,
      limitPriceDeviation: calculatePriceDeviation(limitPrice, marketPrice),
      expiresAt: formatOrderDateTime(Math.floor(Date.now() / 1000) + expiry),
      expiryDurationSec: expiry,
      slippage: `${trimFractionZeros(BigNumber(slippageBps).dividedBy(100).toFixed(2))}%`,
      executionFee,
    };
  }, [
    buyUsd,
    expiry,
    executionFee,
    formatRate,
    formatUsd,
    isValidPrice,
    limitPrice,
    marketPrice,
    minimumReceived,
    sellUsd,
    sentSellAmount,
    slippageBps,
    takingAmount,
    tokenA,
    tokenB,
  ]);

  /** A new pair starts again from its market price. */
  const resetPairInputs = useCallback(() => {
    // Re-seed from the market price even when the resulting pair is unchanged.
    setPricedPairKey(null);
    setLimitPrice("");
    setPricePreset(10);
  }, [setLimitPrice, setPricePreset, setPricedPairKey]);

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
      setLimitPrice(prev => stepLimitPrice(prev || marketPrice || "", direction));
    },
    [marketPrice, setLimitPrice, setPricePreset],
  );

  const applyPreset = useCallback(
    (percent: number) => {
      if (!marketPrice) return;
      setPricePreset(percent);
      setLimitPrice(percent === 0 ? marketPrice : applyLimitPricePreset(marketPrice, percent));
    },
    [marketPrice, setLimitPrice, setPricePreset],
  );

  const copyURL = useCallback(
    () =>
      copyUrl({
        type: SWAP_CARD_TYPE.LIMIT,
        from: tokenA?.path,
        to: tokenB?.path,
        amount: sellAmount,
        price: limitPrice,
        expiry,
      }),
    [copyUrl, expiry, limitPrice, sellAmount, tokenA?.path, tokenB?.path],
  );

  const placeOrder = useCallback(() => {
    if (!tokenA || !tokenB || !createRequest) return;

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
        setSellAmount("");
      },
    });
  }, [createRequest, expiry, orderRepository, sentSellAmount, setSellAmount, submit, takingAmount, tokenA, tokenB]);

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

  const { openModal, closeModal } = useConfirmOrderModal(renderConfirmModal);
  closeConfirmModalRef.current = closeModal;

  const onClickButton = useCallback(() => {
    switch (buttonState) {
      case "WALLET_LOGIN":
        openConnectWallet();
        return;
      case "SWITCH_NETWORK":
        switchNetwork();
        return;
      case "PLACE_ORDER":
        openModal();
        return;
      default:
        return;
    }
  }, [buttonState, openConnectWallet, openModal, switchNetwork]);

  return {
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
    limitPriceUsd: formatUsd(isValidPrice ? calculateUsdValue(limitPrice, getUsdPrice(tokenB)) : null),
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
    changeSellAmount: setSellAmount,
    changeLimitPrice,
    stepPrice,
    applyPreset,
    changeExpiry: setExpiry,
    setLimitPrice: restoreLimitPrice,
    onClickButton,
  };
};
