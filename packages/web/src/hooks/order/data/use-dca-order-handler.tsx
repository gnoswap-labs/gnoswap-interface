import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import ConfirmDcaOrderModal from "@components/order/confirm-dca-order-modal/ConfirmDcaOrderModal";
import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSlippage } from "@hooks/common/use-slippage";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { DcaIntervalUnit, getDcaIntervalUnit } from "@models/order/dca-order-model";
import { toDisplayAmount } from "@models/order/mapper/order-mapper";
import { SWAP_CARD_TYPE } from "@models/order/order-type";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useEstimateOrderNetworkFee, useGetDcaConfig, useGetDcaSchedule } from "@query/order";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { getDcaDepositAmount } from "@repositories/order/order.message";
import { CreateDcaOrderRequest } from "@repositories/order/request";
import { OrderState, SwapState } from "@states/index";
import { formatBps, formatOrderDateTime, trimFractionZeros } from "@utils/order-format-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

import { useConfirmOrderModal } from "../ui/use-confirm-order-modal";
import { getOrderButtonText, useOrderFormCommon } from "./use-order-form-common";
import {
  calculateAmountPerExecution,
  calculateMaxExecutionCount,
  calculateUsdValue,
  clampExecutionCount,
  DEFAULT_MAX_DCA_EXECUTION_COUNT,
  DEFAULT_MIN_ORDER_USD,
  getAvailableDcaIntervals,
  getOrderButtonState,
  isDcaAmountTooLow,
  MIN_DCA_EXECUTION_COUNT,
} from "./use-order-handler.utils";
import { useOrderTransaction } from "./use-order-transaction";

const INPUT_DEBOUNCE_MS = 300;
const QUOTE_REFETCH_INTERVAL = 10_000;

export const useDcaOrderHandler = () => {
  const { t } = useTranslation();
  const { orderRepository } = useGnoswapContext();
  const { slippage, changeSlippage } = useSlippage();
  const { openModal: openConnectWallet } = useConnectWalletModal();
  const { submit } = useOrderTransaction();

  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const [sellAmount, setSellAmount] = useAtom(OrderState.dcaSellAmount);
  const [interval, setInterval] = useAtom(OrderState.dcaInterval);
  const [executionCountInput, setExecutionCountInput] = useAtom(OrderState.dcaExecutionCount);

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
    isSameToken,
    formatUsd,
    formatRate,
    formatNetworkFee,
  } = useOrderFormCommon(tokenA, tokenB);

  const { data: config, isLoading: isLoadingConfig } = useGetDcaConfig();

  const intervalOptions = useMemo(() => getAvailableDcaIntervals(config?.allowedIntervals), [config]);

  // An interval the admin removed falls back to the first one still allowed.
  useEffect(() => {
    if (intervalOptions.length > 0 && !intervalOptions.some(option => option.interval === interval)) {
      setInterval(intervalOptions[0].interval);
    }
  }, [interval, intervalOptions, setInterval]);

  const minOrderUsd = Number(config?.minOrderUsd) || DEFAULT_MIN_ORDER_USD;
  const sellUsd = useMemo(() => calculateUsdValue(sellAmount, getUsdPrice(tokenA)), [getUsdPrice, sellAmount, tokenA]);

  const maxExecutionCount = useMemo(
    () =>
      calculateMaxExecutionCount(sellUsd, config?.maxExecutionCount ?? DEFAULT_MAX_DCA_EXECUTION_COUNT, minOrderUsd),
    [config?.maxExecutionCount, minOrderUsd, sellUsd],
  );

  const executionCount = Math.max(MIN_DCA_EXECUTION_COUNT, Math.floor(Number(executionCountInput)) || 0);

  const amountPerExecutionRaw = useMemo(() => {
    if (!tokenA) return "0";
    return calculateAmountPerExecution(makeRawTokenAmount(tokenA, sellAmount || "0") ?? "0", executionCount);
  }, [executionCount, sellAmount, tokenA]);

  const amountPerExecution = tokenA ? toDisplayAmount(tokenA, amountPerExecutionRaw) : "0";

  /** What is escrowed. Differs from the typed amount when it does not split evenly. */
  const actualSellAmount = useMemo(() => {
    if (!tokenA || !sellAmount) return null;
    const actual = makeDisplayTokenAmountString(tokenA, getDcaDepositAmount(amountPerExecutionRaw, executionCount));
    if (!actual || BigNumber(actual).isEqualTo(sellAmount)) return null;
    return actual;
  }, [amountPerExecutionRaw, executionCount, sellAmount, tokenA]);

  // Quote one execution to show the rate and detect a missing pool.
  const debouncedAmountPerExecution = useDebounce(amountPerExecution, INPUT_DEBOUNCE_MS);
  const quoteAmount = BigNumber(debouncedAmountPerExecution).isGreaterThan(0) ? debouncedAmountPerExecution : "1";
  const { data: routes } = useGetRoutes(
    tokenA && tokenB && !isSameToken
      ? { inputToken: tokenA, outputToken: tokenB, tokenAmount: quoteAmount, exactType: "EXACT_IN" }
      : null,
    { refetchInterval: QUOTE_REFETCH_INTERVAL },
  );

  const hasLiquidity = !isSameToken && routes?.status !== "NO_LIQUIDITY";
  const rate = useMemo(() => {
    if (!tokenB || routes?.status !== "SUCCESS") return null;
    const output = makeDisplayTokenAmountString(tokenB, routes.amount);
    if (!output) return null;
    return BigNumber(output).dividedBy(quoteAmount).toFixed();
  }, [quoteAmount, routes, tokenB]);

  const scheduleRequest = useDebounce(
    tokenA && tokenB && !isSameToken
      ? {
          inputToken: getSwapTokenPath(tokenA),
          outputToken: getSwapTokenPath(tokenB),
          interval,
          executionCount,
        }
      : null,
    INPUT_DEBOUNCE_MS,
  );
  const {
    data: schedule,
    isFetching: isFetchingSchedule,
    refetch: refetchSchedule,
  } = useGetDcaSchedule(scheduleRequest);

  const isAmountTooLow = useMemo(() => {
    if (isDcaAmountTooLow(sellUsd, executionCount, minOrderUsd)) return true;
    if (!config?.minAmountPerExecution || !BigNumber(sellAmount || 0).isGreaterThan(0)) return false;
    return BigNumber(amountPerExecutionRaw).isLessThan(config.minAmountPerExecution);
  }, [amountPerExecutionRaw, config?.minAmountPerExecution, executionCount, minOrderUsd, sellAmount, sellUsd]);

  const buttonState = getOrderButtonState({
    connected,
    isSwitchNetwork,
    isPaused: !!config?.halted?.execute,
    hasTokens: !!tokenA && !!tokenB,
    amount: sellAmount,
    balance: tokenABalance,
    hasLiquidity,
    isAmountTooLow,
  });

  const buttonText = getOrderButtonText(buttonState, t, t("Swap:dca.placeOrder"));

  const createRequest: CreateDcaOrderRequest | null = useMemo(() => {
    if (buttonState !== "PLACE_ORDER" || !tokenA || !tokenB || !schedule) return null;
    return {
      inputToken: tokenA,
      outputToken: tokenB,
      interval,
      slotOffset: schedule.slotOffset,
      amountPerExecution: amountPerExecutionRaw,
      executionCount,
    };
  }, [amountPerExecutionRaw, buttonState, executionCount, interval, schedule, tokenA, tokenB]);

  const debouncedCreateRequest = useDebounce(createRequest, INPUT_DEBOUNCE_MS);
  const { data: networkFee, isFetching: isFetchingNetworkFee } = useEstimateOrderNetworkFee(
    [
      SWAP_CARD_TYPE.DCA,
      debouncedCreateRequest?.inputToken.path,
      debouncedCreateRequest?.outputToken.path,
      debouncedCreateRequest?.interval,
      debouncedCreateRequest?.slotOffset,
      debouncedCreateRequest?.amountPerExecution,
      debouncedCreateRequest?.executionCount,
    ],
    debouncedCreateRequest ? () => orderRepository.makeCreateDcaOrderMessages(debouncedCreateRequest) : null,
  );

  const summary: DcaOrderSummary | null = useMemo(() => {
    if (!tokenA || !tokenB) return null;
    const formattedRate = formatRate(rate);
    const fee = formatNetworkFee(networkFee);
    return {
      inputToken: tokenA,
      outputToken: tokenB,
      sellAmount: sellAmount || "0",
      sellAmountUsd: formatUsd(sellUsd),
      actualSellAmount,
      intervalUnit: (getDcaIntervalUnit(interval) ?? "minute") as DcaIntervalUnit,
      executionCount,
      rate: formattedRate.text,
      rateUsd: formattedRate.usd,
      amountPerOrder: trimFractionZeros(BigNumber(amountPerExecution).toFormat(tokenA.decimals, BigNumber.ROUND_DOWN)),
      estimatedEndDate: formatOrderDateTime(schedule?.estimatedEndAt),
      routerFee: formatBps(config?.routerFeeBps),
      networkGasFee: fee.text,
      networkGasFeeUsd: fee.usd,
    };
  }, [
    actualSellAmount,
    amountPerExecution,
    config?.routerFeeBps,
    executionCount,
    formatNetworkFee,
    formatRate,
    formatUsd,
    interval,
    networkFee,
    rate,
    schedule?.estimatedEndAt,
    sellAmount,
    sellUsd,
    tokenA,
    tokenB,
  ]);

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => ({
        ...prev,
        tokenA: token,
        tokenB: prev.tokenB?.path === token.path ? prev.tokenA : prev.tokenB,
      }));
    },
    [setSwapValue],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => ({
        ...prev,
        tokenB: token,
        tokenA: prev.tokenA?.path === token.path ? prev.tokenB : prev.tokenA,
      }));
    },
    [setSwapValue],
  );

  /** Swaps the tokens only; the typed amount stays, priced against the new sell token. */
  const switchTokens = useCallback(() => {
    setSwapValue(prev => ({ ...prev, tokenA: prev.tokenB, tokenB: prev.tokenA }));
  }, [setSwapValue]);

  const changeSellAmount = useCallback((value: string) => setSellAmount(value), [setSellAmount]);

  const changeExecutionCount = useCallback(
    (value: string) => {
      if (value !== "" && !/^\d+$/.test(value)) return;
      setExecutionCountInput(value);
    },
    [setExecutionCountInput],
  );

  const commitExecutionCount = useCallback(() => {
    setExecutionCountInput(`${clampExecutionCount(Number(executionCountInput), maxExecutionCount)}`);
  }, [executionCountInput, maxExecutionCount, setExecutionCountInput]);

  const copyURL = useCallback(
    () =>
      copyUrl({
        type: SWAP_CARD_TYPE.DCA,
        from: tokenA?.path,
        to: tokenB?.path,
        amount: sellAmount,
        interval,
        count: executionCount,
      }),
    [copyUrl, executionCount, interval, sellAmount, tokenA?.path, tokenB?.path],
  );

  const placeOrder = useCallback(async () => {
    if (!tokenA || !tokenB) return;

    // The slot can roll over while the modal was open, so the schedule is read again right before sending.
    const latestSchedule = (await refetchSchedule()).data ?? schedule;
    if (!latestSchedule) return;

    const orderedAmount = makeDisplayTokenAmountString(
      tokenA,
      getDcaDepositAmount(amountPerExecutionRaw, executionCount),
    );
    const messageData = {
      tokenASymbol: tokenA.displaySymbol,
      tokenBSymbol: tokenB.displaySymbol,
      tokenAAmount: trimFractionZeros(BigNumber(orderedAmount ?? "0").toFormat(tokenA.decimals)),
    };

    submit({
      action: DexEvent.DCA_ORDER,
      messageData,
      send: () =>
        orderRepository.sendCreateDcaOrder({
          inputToken: tokenA,
          outputToken: tokenB,
          interval,
          slotOffset: latestSchedule.slotOffset,
          amountPerExecution: amountPerExecutionRaw,
          executionCount,
        }),
      onBroadcast: () => setSellAmount(""),
    });
  }, [
    amountPerExecutionRaw,
    executionCount,
    interval,
    orderRepository,
    refetchSchedule,
    schedule,
    setSellAmount,
    submit,
    tokenA,
    tokenB,
  ]);

  const closeConfirmModalRef = useRef<() => void>(() => undefined);

  const renderConfirmModal = useCallback(
    () =>
      summary ? (
        <ConfirmDcaOrderModal
          summary={summary}
          isLoading={isFetchingSchedule || !schedule}
          confirm={() => {
            closeConfirmModalRef.current();
            void placeOrder();
          }}
          close={() => closeConfirmModalRef.current()}
        />
      ) : (
        <></>
      ),
    [isFetchingSchedule, placeOrder, schedule, summary],
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
        // Refresh the slot and end date the modal shows.
        void refetchSchedule();
        openModal();
        return;
      default:
        return;
    }
  }, [buttonState, openConnectWallet, openModal, refetchSchedule, switchNetwork]);

  return {
    tokenA,
    tokenB,
    tokenABalance,
    connected,
    sellAmount,
    sellAmountUsd: formatUsd(sellUsd),
    interval,
    intervalOptions,
    executionCountInput,
    maxExecutionCount,
    summary,
    isLoadingConfig,
    isLoadingDetail: isFetchingNetworkFee,
    buttonState,
    buttonText,
    copied,
    slippage,
    changeSlippage,
    copyURL,
    changeTokenA,
    changeTokenB,
    switchTokens,
    changeSellAmount,
    changeInterval: setInterval,
    changeExecutionCount,
    commitExecutionCount,
    setExecutionCountInput,
    onClickButton,
  };
};
