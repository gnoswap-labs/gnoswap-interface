import { DexEventType } from "@repositories/common";
import React from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useWrap } from "@hooks/swap/data/use-wrap";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetNotifications } from "@query/common";
import { makeRandomId } from "@utils/common";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useMessage } from "./use-message";
import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";

const DEFAULT_SNACKBAR_TIMEOUT = 3_000;
const TX_RESULT_SNACKBAR_TIMEOUT = 4_000;
const UPDATING_SNACKBAR_TIMEOUT = 60_000;
const BADGE_SNACKBAR_TIMEOUT = 0;
const WUGNOT_CHANGE_THRESHOLD = 10000;

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
  const { eventStore, tokenRepository } = useGnoswapContext();
  const { hasBadgeSnackbar, enqueue, dequeue, change } = useSnackbar();
  const { fetchWugnotBalance, unwrapAll } = useWrap();
  const { getMessage, getReceiveWugnotMessage } = useMessage();
  const { refetch: refetchNotifications } = useGetNotifications();

  // ref to track the active timer
  const activeTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Clean up all timers when unmounting components
  React.useEffect(() => {
    return () => {
      activeTimersRef.current.forEach(timer => clearTimeout(timer));
      activeTimersRef.current.clear();
    };
  }, []);

  async function onEmitCommon() {
    await refetchNotifications();
  }

  // Function to safely set a timer
  const safeSetTimeout = (callback: () => void, delay: number, id?: number) => {
    // Remove the old timer if it exists
    if (id && activeTimersRef.current.has(id)) {
      clearTimeout(activeTimersRef.current.get(id)!);
    }

    const timer = setTimeout(() => {
      if (id) activeTimersRef.current.delete(id);
      callback();
    }, delay);

    if (id) activeTimersRef.current.set(id, timer);
    return timer;
  };

  function enqueueEvent({
    txHash,
    action,
    visibleEmitResult = false,
    checkWugnotTransfer = false,
    formatData = () => ({}),
    onUpdate = async () => {},
    onEmit,
    onSuccess,
  }: {
    txHash?: string;
    action: DexEventType;
    visibleEmitResult?: boolean;
    checkWugnotTransfer?: boolean;
    formatData?: (
      result: string[] | null,
    ) => {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
      target?: string;
    };
    onUpdate?: () => Promise<void>;
    onEmit?: () => Promise<void>;
    onSuccess?: () => Promise<void>;
  }) {
    if (!txHash) {
      return;
    }

    const pendingSnackbarConfig = makeSnackbarConfig("pending");
    enqueue(undefined, pendingSnackbarConfig);

    const updatingSnackbarConfig = makeSnackbarConfig("updating", UPDATING_SNACKBAR_TIMEOUT);
    const receiveWugnotSnackbarConfig = makeSnackbarConfig("receive-wugnot", BADGE_SNACKBAR_TIMEOUT);
    let updatingSnackbarEnqueued = false;
    let alreadyEmitted = false;

    eventStore.addEvent(
      txHash,
      async event => {
        const messageType = event.status === "SUCCESS" ? "success" : "error";
        const message = getMessage(action, messageType, formatData(event.data), txHash);
        enqueue(message, makeSnackbarConfig(messageType, TX_RESULT_SNACKBAR_TIMEOUT));
        await onUpdate();

        if (visibleEmitResult && event.status === "SUCCESS") {
          // Show updating snackbar after TX_RESULT_SNACKBAR_TIMEOUT
          safeSetTimeout(() => {
            enqueue({ txHash: message.txHash }, updatingSnackbarConfig);
            updatingSnackbarEnqueued = true;

            if (onSuccess) {
              onSuccess();
            }

            if (alreadyEmitted) {
              // change to updating-done only if already emitted
              change(updatingSnackbarConfig.id, "updating-done");

              // set a timer to allow enough time for the updating-done status to be displayed
              safeSetTimeout(
                () => dequeue(updatingSnackbarConfig.id),
                DEFAULT_SNACKBAR_TIMEOUT,
                updatingSnackbarConfig.id,
              );
            }
          }, TX_RESULT_SNACKBAR_TIMEOUT);
        }
      },
      async () => {
        console.log("emitted event");
        alreadyEmitted = true;
        onEmitCommon();

        if (onEmit) {
          await onEmit();
        }

        if (visibleEmitResult && updatingSnackbarEnqueued) {
          // Change state only if the snack bar is already visible
          change(updatingSnackbarConfig.id, "updating-done");

          // If a timer was previously set, cancel it and set a new one
          safeSetTimeout(() => dequeue(updatingSnackbarConfig.id), DEFAULT_SNACKBAR_TIMEOUT, updatingSnackbarConfig.id);
        }

        // if the wugnot transfer is not checked or the account is not connected, return
        if (!checkWugnotTransfer || !account || hasBadgeSnackbar) {
          return;
        }

        // get the transfer history
        const wugnotPath = WRAPPED_GNOT_PATH;
        const transferHistoryResponse = await tokenRepository
          .getGrc20TransferHistoryByTxHash(txHash, wugnotPath)
          .catch(e => {
            console.error(e);
            return {
              data: [],
            };
          });

        const transferHistory = transferHistoryResponse.data;
        if (transferHistory.length === 0) {
          return;
        }

        const wugnotChange = transferHistory.reduce((acc, history): BigNumber => {
          const amount = new BigNumber(history.tokenAmount);

          if (account.address === history.fromAddress) {
            return acc.minus(amount);
          }

          if (account.address === history.toAddress) {
            return acc.plus(amount);
          }

          return acc;
        }, BigNumber(0));

        if (wugnotChange.isLessThan(WUGNOT_CHANGE_THRESHOLD)) {
          return;
        }

        const wugnotBalance = await fetchWugnotBalance();

        const tokenAAmount = (makeDisplayTokenAmount(GNOT_TOKEN, wugnotBalance.toString()) || 0).toLocaleString(
          "en-US",
          { maximumFractionDigits: 2 },
        );
        enqueue(
          getReceiveWugnotMessage(txHash, tokenAAmount, () => unwrapAll()),
          receiveWugnotSnackbarConfig,
        );
      },
    );
  }

  return { enqueueEvent };
};
