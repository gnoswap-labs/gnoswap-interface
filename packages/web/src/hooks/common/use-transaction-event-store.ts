import React from "react";
import { DexEventType } from "@repositories/common";

import { useGetNotifications } from "@query/common";
import { makeRandomId } from "@utils/common";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useMessage } from "./use-message";
import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";

const DEFAULT_SNACKBAR_TIMEOUT = 3_000;
const TX_RESULT_SNACKBAR_TIMEOUT = 4_000;
const UPDATING_SNACKBAR_TIMEOUT = 60_000;

function makeSnackbarConfig(type: SnackbarType, timeout = DEFAULT_SNACKBAR_TIMEOUT): SnackbarOptions {
  return {
    id: makeRandomId(),
    type,
    closeable: true,
    timeout,
  };
}

export const useTransactionEventStore = () => {
  const { eventStore } = useGnoswapContext();
  const { enqueue, dequeue, change } = useSnackbar();
  const { getMessage } = useMessage();
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
    formatData = () => ({}),
    onUpdate = async () => {},
    onEmit,
    onSuccess,
  }: {
    txHash?: string;
    action: DexEventType;
    visibleEmitResult?: boolean;
    formatData?: (result: string[] | null) => {
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
      },
    );
  }

  return { enqueueEvent };
};
