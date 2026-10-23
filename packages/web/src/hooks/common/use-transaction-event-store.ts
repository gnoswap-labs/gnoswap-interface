import { DexEventType } from "@repositories/common";
import React from "react";
import axios from "axios";

import { GNOT_TOKEN } from "@common/values/token-constant";
import type { EventStatus } from "@common/modules/event-store/types";
import type { PositionModel } from "@models/position/position-model";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { PAGE_PATH } from "@constants/page.constant";
import { useWrap } from "@hooks/swap/data/use-wrap";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetNotifications } from "@query/common";
import { delay, makeRandomId } from "@utils/common";
import { formatRate } from "@utils/new-number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import useCustomRouter from "./use-custom-router";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useMessage } from "./use-message";
import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";

const DEFAULT_SNACKBAR_TIMEOUT = 3_000;
const TX_RESULT_SNACKBAR_TIMEOUT = 4_000;
const UPDATING_SNACKBAR_TIMEOUT = 60_000;
const BADGE_SNACKBAR_TIMEOUT = 0;
const WUGNOT_CHANGE_THRESHOLD = 10000;
const WUGNOT_RECEIPT_RETRY_INTERVAL = 1_200;
const WUGNOT_RECEIPT_RETRY_DEADLINE = 8_000;

function waitForWugnotRetry(signal: AbortSignal): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  const timer = setTimeout(() => {
    signal.removeEventListener("abort", onAbort);
    resolve();
  }, WUGNOT_RECEIPT_RETRY_INTERVAL);
  function onAbort() {
    clearTimeout(timer);
    resolve();
  }
  signal.addEventListener("abort", onAbort, { once: true });
  return promise;
}

function makeSnackbarConfig(type: SnackbarType, timeout = DEFAULT_SNACKBAR_TIMEOUT): SnackbarOptions {
  return {
    id: makeRandomId(),
    type,
    closeable: true,
    timeout,
  };
}

export const useTransactionEventStore = () => {
  const { account } = useWallet();
  const { eventStore, tokenRepository, poolRepository, positionRepository } = useGnoswapContext();
  const { hasBadgeSnackbar, enqueue, change } = useSnackbar();
  const router = useCustomRouter();
  const { unwrapAll } = useWrap();
  const { getMessage, getReceiveWugnotMessage, getStakePositionMessage } = useMessage();
  const { refetch: refetchNotifications } = useGetNotifications();

  // Keep a live account generation so receipt checks stay stale after A → B → A transitions.
  const accountScopeRef = React.useRef({ address: account?.address, generation: 0 });
  if (accountScopeRef.current.address !== account?.address) {
    accountScopeRef.current = {
      address: account?.address,
      generation: accountScopeRef.current.generation + 1,
    };
  }
  const renderedAccountScope = accountScopeRef.current;
  const mountedRef = React.useRef(false);
  const activeTransferChecksRef = React.useRef<Set<AbortController>>(new Set());

  React.useEffect(() => {
    mountedRef.current = true;
    const transferChecks = activeTransferChecksRef.current;
    return () => {
      mountedRef.current = false;
      transferChecks.forEach(controller => controller.abort());
      transferChecks.clear();
    };
  }, []);

  React.useEffect(() => {
    const transferChecks = activeTransferChecksRef.current;
    transferChecks.forEach(controller => controller.abort());
    transferChecks.clear();
  }, [renderedAccountScope]);

  async function onEmitCommon() {
    await refetchNotifications();
  }

  function enqueueEvent({
    txHash,
    action,
    visibleEmitResult = false,
    checkWugnotTransfer = false,
    checkStakePosition = false,
    formatData = () => ({}),
    onUpdate = async () => {},
    onEmit,
    onSuccess,
  }: {
    txHash?: string;
    action: DexEventType;
    visibleEmitResult?: boolean;
    checkWugnotTransfer?: boolean;
    checkStakePosition?: boolean;
    formatData?: (result: string[] | null) => {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
      target?: string;
    };
    onUpdate?: (status: EventStatus) => Promise<void>;
    onEmit?: (status: EventStatus) => Promise<void>;
    onSuccess?: () => Promise<void>;
  }) {
    const eventAccountScope = renderedAccountScope;
    const isCurrentAccountScope = () =>
      mountedRef.current &&
      accountScopeRef.current.generation === eventAccountScope.generation &&
      accountScopeRef.current.address === eventAccountScope.address;

    if (!txHash) {
      return;
    }

    const pendingSnackbarConfig = makeSnackbarConfig("pending");
    enqueue({ txHash }, pendingSnackbarConfig);

    const updatingSnackbarConfig = makeSnackbarConfig("updating", UPDATING_SNACKBAR_TIMEOUT);
    const receiveWugnotSnackbarConfig = makeSnackbarConfig("receive-wugnot", BADGE_SNACKBAR_TIMEOUT);
    if (eventAccountScope.address) {
      receiveWugnotSnackbarConfig.accountAddress = eventAccountScope.address;
    }
    const stakePositionSnackbarConfig = makeSnackbarConfig("stake-position", BADGE_SNACKBAR_TIMEOUT);
    let updatingSnackbarEnqueued = false;
    let alreadyEmitted = false;
    let wugnotCheckStarted = false;

    eventStore.addEvent(
      txHash,
      async event => {
        const messageType = event.status === "SUCCESS" ? "success" : "error";
        const message = getMessage(action, messageType, formatData(event.data), txHash);
        enqueue(message, makeSnackbarConfig(messageType, TX_RESULT_SNACKBAR_TIMEOUT));
        await onUpdate(event.status);

        if (visibleEmitResult && event.status === "SUCCESS") {
          // Show updating snackbar after TX_RESULT_SNACKBAR_TIMEOUT
          setTimeout(() => {
            enqueue({ txHash: message.txHash }, updatingSnackbarConfig);
            updatingSnackbarEnqueued = true;

            if (onSuccess) {
              onSuccess();
            }

            if (alreadyEmitted) {
              change(updatingSnackbarConfig.id, "updating-done");
            }
          }, TX_RESULT_SNACKBAR_TIMEOUT);
        }
      },
      async event => {
        console.log("emitted event");
        alreadyEmitted = true;
        onEmitCommon();

        if (onEmit) {
          await onEmit(event.status);
        }

        if (visibleEmitResult && updatingSnackbarEnqueued) {
          // Change state only if the snack bar is already visible
          change(updatingSnackbarConfig.id, "updating-done");
        }

        // An open receive badge still needs its balance refreshed after each successful swap.
        if (
          checkWugnotTransfer &&
          eventAccountScope.address &&
          event.status === "SUCCESS" &&
          !wugnotCheckStarted &&
          isCurrentAccountScope()
        ) {
          wugnotCheckStarted = true;
          const controller = new AbortController();
          activeTransferChecksRef.current.add(controller);
          void enqueueWugnotChangeEvent(
            txHash,
            eventAccountScope.address,
            receiveWugnotSnackbarConfig,
            controller.signal,
            isCurrentAccountScope,
          )
            .catch(error => {
              if (isCurrentAccountScope()) console.error(error);
            })
            .finally(() => activeTransferChecksRef.current.delete(controller));
        }

        if (checkStakePosition && account && !hasBadgeSnackbar && event.status === "SUCCESS" && event.data) {
          const positionMintResponseSize = 4;
          if (event.data.length < positionMintResponseSize) {
            return;
          }

          const positionId = event.data[event.data.length - positionMintResponseSize];

          // Indexing can lag behind the block; do not block other transaction events while polling.
          void enqueueStakePositionEvent(positionId, stakePositionSnackbarConfig).catch(console.error);
        }
      },
    );
  }

  async function enqueueWugnotChangeEvent(
    txHash: string,
    address: string,
    config: SnackbarOptions,
    signal: AbortSignal,
    isCurrentAccountScope: () => boolean,
  ) {
    const deadline = Date.now() + WUGNOT_RECEIPT_RETRY_DEADLINE;
    while (!signal.aborted && isCurrentAccountScope() && Date.now() < deadline) {
      const balances = await tokenRepository.getGrc20BalanceReceiptByAddress(address, txHash);
      if (signal.aborted || !isCurrentAccountScope() || Date.now() >= deadline) return;

      if (balances.accountBalanceApplied === true) {
        const delta = balances.balanceChanges?.find(change => change.path === WRAPPED_GNOT_PATH)?.amount;
        const wugnotChange = new BigNumber(delta ?? "0");
        if (!wugnotChange.isFinite() || wugnotChange.isLessThan(WUGNOT_CHANGE_THRESHOLD)) return;

        const wugnotBalance = balances.data.find(balance => balance.path === WRAPPED_GNOT_PATH);
        if (!wugnotBalance) return;
        const balance = new BigNumber(wugnotBalance.amount);
        if (!balance.isFinite() || balance.isLessThanOrEqualTo(0)) return;

        const tokenAAmount = (makeDisplayTokenAmount(GNOT_TOKEN, wugnotBalance.amount) || 0).toLocaleString("en-US", {
          maximumFractionDigits: GNOT_TOKEN.decimals,
        });
        enqueue(
          getReceiveWugnotMessage(txHash, tokenAAmount, () => unwrapAll(txHash)),
          config,
        );
        return;
      }

      // Pending receipts never expose an unverified balance.
      if (deadline - Date.now() < WUGNOT_RECEIPT_RETRY_INTERVAL) return;
      await waitForWugnotRetry(signal);
    }
  }

  async function enqueueStakePositionEvent(positionId: string, config: SnackbarOptions) {
    const deadline = Date.now() + 8_000;
    let retryDelay = 500;
    let position: PositionModel | null = null;
    while (true) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      try {
        position = await positionRepository.getPositionById(positionId, remaining);
      } catch (error) {
        if (
          !axios.isAxiosError(error) ||
          (error.response && error.response.status !== 404 && error.response.status < 500)
        ) {
          console.error(error);
          return;
        }
      }

      if (position?.tokenUri) break;
      const waitRemaining = deadline - Date.now();
      if (waitRemaining <= 0) break;
      await delay(Math.min(retryDelay, waitRemaining));
      retryDelay *= 2;
    }
    if (!position) return;

    const poolPath = position.poolPath;
    const positionLogoUrl = position.tokenUri;
    const pool = await poolRepository.getPoolDetailByPoolPath(poolPath).catch(e => {
      console.error(e);
      return null;
    });
    if (!pool) {
      return;
    }

    // Only enqueue staking guidance for pools that actually have a staking incentive.
    const hasStakingIncentive = pool.incentivized || (pool.rewardTokens && pool.rewardTokens.length > 0);
    if (!hasStakingIncentive) {
      return;
    }

    const apr = (() => {
      if (!pool.stakingApr) return "-";
      if (!Number(pool.stakingApr)) return "0%";

      return formatRate(pool.stakingApr);
    })();

    const onClick = () => {
      router.push(`${PAGE_PATH.POOL_STAKE}?poolPath=${poolPath}&positionId=${positionId}`);
    };
    const onClickLink = () => {
      router.push(`${PAGE_PATH.POOL}?poolPath=${poolPath}#staking`);
    };
    enqueue(getStakePositionMessage(positionId, apr, positionLogoUrl, onClick, onClickLink), config);
  }

  return { enqueueEvent };
};
