import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MIN_GNOT_DEPOSIT_AMOUNT } from "@common/clients/wallet-client/transaction-messages";
import ConfirmLimitOrderModal from "@components/order/confirm-limit-order-modal/ConfirmLimitOrderModal";
import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSlippage } from "@hooks/common/use-slippage";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { LIMIT_EXPIRY_OPTIONS } from "@models/order/limit-order-model";
import { SWAP_CARD_TYPE } from "@models/order/order-type";
import { LimitOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useEstimateOrderNetworkFee, useGetLimitConfig } from "@query/order";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { CreateLimitOrderRequest } from "@repositories/order/request";
import { OrderState, SwapState } from "@states/index";
import { formatOrderDateTime, trimFractionZeros } from "@utils/order-format-utils";
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

type EditedSide = "sell" | "buy";

function floorToDecimals(value: BigNumber.Value, decimals: number): string {
  const number = BigNumber(value);
  if (!number.isFinite() || number.isLessThanOrEqualTo(0)) return "";
  return number.decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed();
}

export const useLimitOrderHandler = () => {
  const { t } = useTranslation();
  const { orderRepository } = useGnoswapContext();
  const { slippage, changeSlippage } = useSlippage();
  const { openModal: openConnectWallet } = useConnectWalletModal();
  const { submit } = useOrderTransaction();

  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const [sellAmount, setSellAmount] = useAtom(OrderState.limitSellAmount);
  const [limitPrice, setLimitPrice] = useAtom(OrderState.limitPrice);
  const [expiry, setExpiry] = useAtom(OrderState.limitExpiry);
  const [buyInput, setBuyInput] = useState("");
  const [editedSide, setEditedSide] = useState<EditedSide>("sell");

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
    formatNetworkFee,
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

  /**
   * The pair whose limit price is already initialized. The market price only
   * seeds the field once per pair; after that an empty field is the user's
   * edit (e.g. select-all → delete before typing) and must stay empty.
   */
  const pricedPairKey = useRef<string | null>(null);
  const pairKey = tokenA && tokenB ? `${tokenA.path}|${tokenB.path}` : null;

  useEffect(() => {
    if (!pairKey || pricedPairKey.current === pairKey) return;
    if (limitPrice) {
      // A price already set for this pair (URL, restored state) counts as initialized.
      pricedPairKey.current = pairKey;
      return;
    }
    if (marketPrice) {
      pricedPairKey.current = pairKey;
      setLimitPrice(marketPrice);
    }
  }, [limitPrice, marketPrice, pairKey, setLimitPrice]);

  const isValidPrice = BigNumber(limitPrice || 0).isGreaterThan(0);

  const buyAmount = useMemo(() => {
    if (editedSide === "buy") return buyInput;
    if (!tokenB || !isValidPrice || !sellAmount) return "";
    return floorToDecimals(BigNumber(sellAmount).multipliedBy(limitPrice), tokenB.decimals);
  }, [buyInput, editedSide, isValidPrice, limitPrice, sellAmount, tokenB]);

  const sellUsd = useMemo(() => calculateUsdValue(sellAmount, getUsdPrice(tokenA)), [getUsdPrice, sellAmount, tokenA]);
  const buyUsd = useMemo(() => calculateUsdValue(buyAmount, getUsdPrice(tokenB)), [buyAmount, getUsdPrice, tokenB]);

  const makingAmount = tokenA ? (makeRawTokenAmount(tokenA, sellAmount || "0") ?? "0") : "0";
  const takingAmount =
    tokenA && tokenB && isValidPrice ? calculateTakingAmount(makingAmount, limitPrice, tokenA, tokenB) : "0";

  // The Limit realm's own minimums: `minMakingAmount` raw input and a positive `takingAmount`.
  // Native GNOT must also reach the wrap minimum, or no Deposit could be built.
  const minMakingAmount = getLimitMinMakingAmount(
    config?.minMakingAmount || DEFAULT_MIN_MAKING_AMOUNT,
    !!tokenA && isNativeTokenPath(tokenA.path),
    MIN_GNOT_DEPOSIT_AMOUNT,
  );
  const isAmountTooLow =
    BigNumber(makingAmount).isGreaterThan(0) && isLimitAmountTooLow(makingAmount, takingAmount, minMakingAmount);
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

  const slippageBps = toLimitSlippageBps(slippage, config?.maxSlippageBps ?? MAX_LIMIT_SLIPPAGE_BPS);

  const createRequest = useMemo((): Omit<CreateLimitOrderRequest, "expiresAt"> | null => {
    if (buttonState !== "PLACE_ORDER" || !tokenA || !tokenB) return null;
    return { tokenIn: tokenA, tokenOut: tokenB, makingAmount, takingAmount, slippageBps };
  }, [buttonState, makingAmount, slippageBps, takingAmount, tokenA, tokenB]);

  const debouncedCreateRequest = useDebounce(createRequest, INPUT_DEBOUNCE_MS);
  const { data: networkFee } = useEstimateOrderNetworkFee(
    [
      SWAP_CARD_TYPE.LIMIT,
      debouncedCreateRequest?.tokenIn.path,
      debouncedCreateRequest?.tokenOut.path,
      debouncedCreateRequest?.makingAmount,
      debouncedCreateRequest?.takingAmount,
      debouncedCreateRequest?.slippageBps,
      expiry,
    ],
    debouncedCreateRequest
      ? () =>
          orderRepository.makeCreateLimitOrderMessages({
            ...debouncedCreateRequest,
            expiresAt: Math.floor(Date.now() / 1000) + expiry,
          })
      : null,
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
    const fee = formatNetworkFee(networkFee);
    return {
      tokenIn: tokenA,
      tokenOut: tokenB,
      sellAmount: sellAmount || "0",
      sellAmountUsd: formatUsd(sellUsd),
      buyAmount: makeDisplayTokenAmountString(tokenB, takingAmount) ?? "0",
      buyAmountUsd: formatUsd(buyUsd),
      limitPrice: formatRate(isValidPrice ? limitPrice : null).text,
      expiry: expiryLabel(expiry),
      expiresAt: formatOrderDateTime(Math.floor(Date.now() / 1000) + expiry),
      slippage: `${trimFractionZeros(BigNumber(slippageBps).dividedBy(100).toFixed(2))}%`,
      networkGasFee: fee.text,
      networkGasFeeUsd: fee.usd,
    };
  }, [
    buyUsd,
    expiry,
    expiryLabel,
    formatNetworkFee,
    formatRate,
    formatUsd,
    isValidPrice,
    limitPrice,
    networkFee,
    sellAmount,
    sellUsd,
    slippageBps,
    takingAmount,
    tokenA,
    tokenB,
  ]);

  /**
   * A new pair starts again from its market price, so Sell becomes the source
   * of truth again: a kept Buy input would no longer match `sell × price`.
   */
  const resetPairInputs = useCallback(() => {
    // Re-seed from the market price even when the resulting pair is unchanged.
    pricedPairKey.current = null;
    setLimitPrice("");
    setEditedSide("sell");
    setBuyInput("");
  }, [setLimitPrice]);

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

  const changeSellAmount = useCallback(
    (value: string) => {
      setEditedSide("sell");
      setSellAmount(value);
    },
    [setSellAmount],
  );

  /** Editing Buy keeps the limit price and moves the sell amount: `sell = buy / limitPrice`. */
  const changeBuyAmount = useCallback(
    (value: string) => {
      setEditedSide("buy");
      setBuyInput(value);
      if (!tokenA || !isValidPrice) return;
      setSellAmount(value ? floorToDecimals(BigNumber(value).dividedBy(limitPrice), tokenA.decimals) : "");
    },
    [isValidPrice, limitPrice, setSellAmount, tokenA],
  );

  const changeLimitPrice = useCallback(
    (value: string) => {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
      setEditedSide("sell");
      setLimitPrice(value);
    },
    [setLimitPrice],
  );

  const stepPrice = useCallback(
    (direction: 1 | -1) => {
      setEditedSide("sell");
      setLimitPrice(prev => stepLimitPrice(prev || marketPrice || "", direction));
    },
    [marketPrice, setLimitPrice],
  );

  const applyPreset = useCallback(
    (percent: number) => {
      if (!marketPrice) return;
      setEditedSide("sell");
      setLimitPrice(percent === 0 ? marketPrice : applyLimitPricePreset(marketPrice, percent));
    },
    [marketPrice, setLimitPrice],
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
      tokenAAmount: trimFractionZeros(BigNumber(sellAmount).toFormat(tokenA.decimals)),
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
        setBuyInput("");
        setEditedSide("sell");
      },
    });
  }, [createRequest, expiry, orderRepository, sellAmount, setSellAmount, submit, takingAmount, tokenA, tokenB]);

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
    tokenBBalance,
    connected,
    sellAmount,
    sellAmountUsd: formatUsd(sellUsd),
    buyAmount,
    buyAmountUsd: formatUsd(buyUsd),
    limitPrice,
    marketPrice,
    expiry,
    expiryOptions: expiryOptions.map(option => ({ value: option.duration, label: expiryLabel(option.duration) })),
    isLoadingConfig,
    buttonState,
    buttonText,
    minTradingText,
    copied,
    slippage,
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
    setLimitPrice,
    onClickButton,
  };
};
