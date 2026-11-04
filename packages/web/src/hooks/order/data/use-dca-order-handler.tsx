import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { MIN_GNOT_DEPOSIT_AMOUNT } from "@common/clients/wallet-client/transaction-messages";
import ConfirmDcaOrderModal from "@components/order/confirm-dca-order-modal/ConfirmDcaOrderModal";
import useDebounce from "@hooks/common/use-debounce";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { DcaIntervalUnit, getDcaIntervalUnit } from "@models/order/dca-order-model";
import { toDisplayAmount } from "@models/order/mapper/order-mapper";
import { SWAP_CARD_TYPE } from "@models/order/order-type";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useEstimateOrderNetworkFee, useGetDcaConfig, useGetDcaSchedule } from "@query/order";
import { useGetPoolList } from "@query/pools";
import { useGetRoutes } from "@query/router";
import { DexEvent } from "@repositories/common";
import { getDcaDepositAmount } from "@repositories/order/order.message";
import { CreateDcaOrderRequest } from "@repositories/order/request";
import { OrderState, SwapState } from "@states/index";
import { formatBps, formatOrderDateTime, trimFractionZeros } from "@utils/order-format-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { isNativeTokenPath, makeDisplayTokenAmountString, makeRawTokenAmount } from "@utils/token-utils";

import { useConfirmOrderModal } from "../ui/use-confirm-order-modal";
import { getOrderButtonText, useOrderFormCommon } from "./use-order-form-common";
import {
  calculateAmountPerExecution,
  calculateMaxExecutionCount,
  calculateUsdValue,
  clampExecutionCount,
  DEFAULT_MAX_DCA_EXECUTION_COUNT,
  DEFAULT_MIN_AMOUNT_PER_EXECUTION,
  getAvailableDcaIntervals,
  getDcaMinAmountPerExecution,
  getOrderButtonState,
  hasDirectPoolForPair,
  hasWhitelistedPoolForPair,
  isDcaAmountTooLow,
  isExecutionCountWithinLimit,
} from "./use-order-handler.utils";
import { useOrderTransaction } from "./use-order-transaction";

const INPUT_DEBOUNCE_MS = 300;
const BPS_DENOMINATOR = 10_000;

/** The realm accepts a slot offset in [0, interval). */
const isSlotWithinInterval = (slotOffset: number, interval: number) => slotOffset >= 0 && slotOffset < interval;

/** Whether two requests place the same order; the slot is read at send time. */
const isSameDcaOrder = (a: CreateDcaOrderRequest, b: CreateDcaOrderRequest) =>
  a.inputToken.path === b.inputToken.path &&
  a.outputToken.path === b.outputToken.path &&
  a.interval === b.interval &&
  a.amountPerExecution === b.amountPerExecution &&
  a.executionCount === b.executionCount;
const QUOTE_REFETCH_INTERVAL = 10_000;
/** The DCA keeper syncs the pool whitelist with the market every minute. */
const CONFIG_REFETCH_INTERVAL = 60_000;
/** The pool list only answers whether a pair has a pool, which rarely changes. */
const POOL_LIST_STALE_TIME = 60_000;

export const useDcaOrderHandler = () => {
  const { t } = useTranslation();
  const { orderRepository } = useGnoswapContext();
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

  const {
    data: config,
    isLoading: isLoadingConfig,
    isError: isConfigError,
    refetch: refetchConfig,
  } = useGetDcaConfig({ refetchInterval: CONFIG_REFETCH_INTERVAL });

  const intervalOptions = useMemo(() => getAvailableDcaIntervals(config?.allowedIntervals), [config]);

  // An interval the admin removed falls back to the first one still allowed.
  useEffect(() => {
    if (intervalOptions.length > 0 && !intervalOptions.some(option => option.interval === interval)) {
      setInterval(intervalOptions[0].interval);
    }
  }, [interval, intervalOptions, setInterval]);

  const minAmountPerExecution = config?.minAmountPerExecution || DEFAULT_MIN_AMOUNT_PER_EXECUTION;
  const sellUsd = useMemo(() => calculateUsdValue(sellAmount, getUsdPrice(tokenA)), [getUsdPrice, sellAmount, tokenA]);
  const sellAmountRaw = tokenA ? (makeRawTokenAmount(tokenA, sellAmount || "0") ?? "0") : "0";

  const maxExecutionCount = useMemo(
    () =>
      calculateMaxExecutionCount(
        sellAmountRaw,
        config?.maxExecutionCount ?? DEFAULT_MAX_DCA_EXECUTION_COUNT,
        minAmountPerExecution,
      ),
    [config?.maxExecutionCount, minAmountPerExecution, sellAmountRaw],
  );

  /**
   * The realm's own cap. The input can hold any count (a shared link or restored
   * state sets it without the blur clamp), so the effective count is clamped to
   * it before anything is quoted, scheduled, confirmed or sent. The sell-based
   * cap `floor(sell / minAmountPerExecution)` needs no clamp here: above it one
   * execution sells less than the minimum, which AMOUNT_TOO_LOW already blocks.
   */
  const realmMaxExecutionCount = config?.maxExecutionCount ?? DEFAULT_MAX_DCA_EXECUTION_COUNT;
  const executionCount = clampExecutionCount(Math.floor(Number(executionCountInput)), realmMaxExecutionCount);

  // Bring a restored count above the realm cap back into the field once the config is known.
  useEffect(() => {
    if (!config) return;
    if (Number(executionCountInput) > realmMaxExecutionCount) {
      setExecutionCountInput(`${realmMaxExecutionCount}`);
    }
  }, [config, executionCountInput, realmMaxExecutionCount, setExecutionCountInput]);

  const amountPerExecutionRaw = useMemo(() => {
    if (!tokenA) return "0";
    return calculateAmountPerExecution(sellAmountRaw, executionCount);
  }, [executionCount, sellAmountRaw, tokenA]);

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

  // The DCA realm only swaps in a whitelisted pool of this exact pair (any fee tier)
  // and rejects CreateOrder without one, even when the router finds a multi-hop
  // route. The keeper adds and removes pools as the market moves; the order-api
  // indexes the realm's whitelist events into the DCA config.
  const whitelistedPools = config?.whitelistedPools;
  // An order-api from before the whitelist omits it; the pair then only needs a
  // pool of its own, read from the app-wide pool list.
  const isLegacyConfig = !!config && !Array.isArray(whitelistedPools);
  const {
    data: pools,
    isError: isPoolListError,
    refetch: refetchPools,
  } = useGetPoolList({
    refetchInterval: false,
    staleTime: POOL_LIST_STALE_TIME,
    enabled: isLegacyConfig,
  });
  // null while the pair cannot be checked yet. A failed refresh keeps any cached
  // list, which still answers the check; without one the order stays blocked
  // rather than signing a CreateOrder the realm may reject.
  const hasWhitelistedPool: boolean | null = useMemo(() => {
    if (!tokenA || !tokenB || isSameToken) return null;
    const inputTokenPath = getSwapTokenPath(tokenA);
    const outputTokenPath = getSwapTokenPath(tokenB);
    if (whitelistedPools) return hasWhitelistedPoolForPair(whitelistedPools, inputTokenPath, outputTokenPath);
    if (isLegacyConfig && pools) return hasDirectPoolForPair(pools, inputTokenPath, outputTokenPath);
    return null;
  }, [isLegacyConfig, isSameToken, pools, tokenA, tokenB, whitelistedPools]);
  const isPoolCheckFailed =
    hasWhitelistedPool === null &&
    (isLegacyConfig ? isPoolListError : isConfigError) &&
    !!tokenA &&
    !!tokenB &&
    !isSameToken;
  // What the owner receives per input: the realm deducts its execution fee from
  // the router output of each execution before crediting the order.
  const executionFeeBps = config?.executionFeeBps ?? 0;
  const rate = useMemo(() => {
    if (!tokenB || routes?.status !== "SUCCESS") return null;
    const output = makeDisplayTokenAmountString(tokenB, routes.amount);
    if (!output) return null;
    const ownerOutput = BigNumber(output).multipliedBy(BPS_DENOMINATOR - executionFeeBps).dividedBy(BPS_DENOMINATOR);
    return ownerOutput.dividedBy(quoteAmount).toFixed();
  }, [executionFeeBps, quoteAmount, routes, tokenB]);

  const currentScheduleRequest = useMemo(
    () =>
      tokenA && tokenB && !isSameToken
        ? {
            inputToken: getSwapTokenPath(tokenA),
            outputToken: getSwapTokenPath(tokenB),
            interval,
            executionCount,
          }
        : null,
    [executionCount, interval, isSameToken, tokenA, tokenB],
  );
  const scheduleRequest = useDebounce(currentScheduleRequest, INPUT_DEBOUNCE_MS);
  const {
    data: schedule,
    isFetching: isFetchingSchedule,
    isPreviousData: isPreviousSchedule,
    refetch: refetchSchedule,
  } = useGetDcaSchedule(scheduleRequest);
  // The slot belongs to the interval, pair and count it was scheduled for. While the
  // debounced request lags the form, or the query still shows the previous request's
  // data, the schedule is not this form's and nothing is confirmed or sent with it.
  const isScheduleCurrent =
    !isPreviousSchedule && JSON.stringify(scheduleRequest) === JSON.stringify(currentScheduleRequest);

  // The DCA realm's own minimum: each execution must sell `minAmountPerExecution` raw units.
  // A native GNOT deposit must also reach the wrap minimum, or no Deposit could be built.
  const minOrderAmountPerExecution = getDcaMinAmountPerExecution(
    minAmountPerExecution,
    !!tokenA && isNativeTokenPath(tokenA.path),
    executionCount,
    MIN_GNOT_DEPOSIT_AMOUNT,
  );
  const isAmountTooLow =
    BigNumber(sellAmount || 0).isGreaterThan(0) && isDcaAmountTooLow(amountPerExecutionRaw, minOrderAmountPerExecution);
  const minTradingText = tokenA
    ? t("Swap:dca.minTrading", {
        amount: toDisplayAmount(tokenA, minOrderAmountPerExecution),
        symbol: tokenA.displaySymbol,
      })
    : "";

  const buttonState = getOrderButtonState({
    connected,
    isSwitchNetwork,
    isPaused: !!config?.halted?.execute,
    hasTokens: !!tokenA && !!tokenB,
    amount: sellAmount,
    balance: tokenABalance,
    hasLiquidity,
    hasWhitelistedPool: hasWhitelistedPool !== false,
    isPoolCheckFailed,
    isAmountTooLow,
  });

  const buttonText = getOrderButtonText(buttonState, t, t("Swap:dca.placeOrder"));

  const createRequest: CreateDcaOrderRequest | null = useMemo(() => {
    // An unchecked pair (whitelist still loading) is never submitted.
    if (buttonState !== "PLACE_ORDER" || !tokenA || !tokenB || !schedule || hasWhitelistedPool !== true) return null;
    if (!isScheduleCurrent) return null;
    if (!isExecutionCountWithinLimit(executionCount, realmMaxExecutionCount)) return null;
    return {
      inputToken: tokenA,
      outputToken: tokenB,
      interval,
      slotOffset: schedule.slotOffset,
      amountPerExecution: amountPerExecutionRaw,
      executionCount,
    };
  }, [
    amountPerExecutionRaw,
    buttonState,
    executionCount,
    hasWhitelistedPool,
    interval,
    isScheduleCurrent,
    realmMaxExecutionCount,
    schedule,
    tokenA,
    tokenB,
  ]);

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

  /**
   * The CreateOrder messages for a native deposit of `rawAmount`, split over the
   * current count, so Max reserves the storage and measured cost of this order.
   * Built regardless of the button state: Max is pressed before an amount is set.
   */
  const makeMaxAmountMessages = useCallback(
    async (rawAmount: string) => {
      if (!tokenA || !tokenB || isSameToken) return [];
      const perExecution = calculateAmountPerExecution(rawAmount, executionCount);
      if (!BigNumber(perExecution).isGreaterThan(0)) return [];
      return orderRepository.makeCreateDcaOrderMessages({
        inputToken: tokenA,
        outputToken: tokenB,
        interval,
        slotOffset: schedule?.slotOffset ?? 0,
        amountPerExecution: perExecution,
        executionCount,
      });
    },
    [executionCount, interval, isSameToken, orderRepository, schedule?.slotOffset, tokenA, tokenB],
  );
  // What else the Max estimate was priced for, so an answer for another order is not written back.
  const maxAmountDependsOn = useMemo(() => [tokenB?.path, interval, executionCount], [executionCount, interval, tokenB?.path]);

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
      executionFee: formatBps(config?.executionFeeBps),
      networkGasFee: fee.text,
      networkGasFeeUsd: fee.usd,
    };
  }, [
    actualSellAmount,
    amountPerExecution,
    config?.executionFeeBps,
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

  // The request of the latest render, to recheck the form after an await.
  const createRequestRef = useRef(createRequest);
  createRequestRef.current = createRequest;

  const placeOrder = useCallback(async () => {
    // Only a form that can be placed right now is sent: Place Order state
    // (balance, halt, minimum, whitelist) and the count within the realm cap.
    const request = createRequest;
    if (!request) return;

    // The slot can roll over while the modal was open, so the schedule is read again right before sending.
    // `request` exists only while the attached schedule query is this request's, so the refetch is too.
    const latestSchedule = (await refetchSchedule()).data ?? schedule;
    if (!latestSchedule || !isSlotWithinInterval(latestSchedule.slotOffset, request.interval)) return;
    // The form can stop being valid while the schedule refreshes.
    const current = createRequestRef.current;
    if (!current || !isSameDcaOrder(current, request)) return;

    const orderedAmount = makeDisplayTokenAmountString(
      request.inputToken,
      getDcaDepositAmount(request.amountPerExecution, request.executionCount),
    );
    const messageData = {
      tokenASymbol: request.inputToken.displaySymbol,
      tokenBSymbol: request.outputToken.displaySymbol,
      tokenAAmount: trimFractionZeros(BigNumber(orderedAmount ?? "0").toFormat(request.inputToken.decimals)),
    };

    submit({
      action: DexEvent.DCA_ORDER,
      messageData,
      send: () => orderRepository.sendCreateDcaOrder({ ...request, slotOffset: latestSchedule.slotOffset }),
      onBroadcast: () => setSellAmount(""),
    });
  }, [createRequest, orderRepository, refetchSchedule, schedule, setSellAmount, submit]);

  const closeConfirmModalRef = useRef<() => void>(() => undefined);

  const renderConfirmModal = useCallback(
    () =>
      summary ? (
        <ConfirmDcaOrderModal
          summary={summary}
          isLoading={isFetchingSchedule || !createRequest}
          confirm={() => {
            closeConfirmModalRef.current();
            void placeOrder();
          }}
          close={() => closeConfirmModalRef.current()}
        />
      ) : (
        <></>
      ),
    [createRequest, isFetchingSchedule, placeOrder, summary],
  );

  const { opened: isConfirmOpened, openModal, closeModal } = useConfirmOrderModal(renderConfirmModal);
  closeConfirmModalRef.current = closeModal;

  // An open confirmation closes once the form can no longer be placed (balance,
  // halt, minimum, ...); the button then tells why.
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
        void (isLegacyConfig ? refetchPools() : refetchConfig());
        return;
      case "PLACE_ORDER":
        // Refresh the slot and end date the modal shows.
        void refetchSchedule();
        openModal();
        return;
      default:
        return;
    }
  }, [
    buttonState,
    isLegacyConfig,
    openConnectWallet,
    openModal,
    refetchConfig,
    refetchPools,
    refetchSchedule,
    switchNetwork,
  ]);

  return {
    tokenA,
    tokenB,
    tokenABalance,
    makeMaxAmountMessages,
    maxAmountDependsOn,
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
    minTradingText,
    copied,
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
