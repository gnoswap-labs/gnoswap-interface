import { DexEventType } from "@repositories/common";

import { useGetNotifications } from "@query/common";
import { makeRandomId, wait } from "@utils/common";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useMessage } from "./use-message";
import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";

const DEFAULT_SNACKBAR_TIMEOUT = 3_000;
const TX_RESULT_SNACKBAR_TIMEOUT = 4_000;
const UPDATING_SNACKBAR_TIMEOUT = 60_000;

function makeSnackbarConfig(
  type: SnackbarType,
  timeout = DEFAULT_SNACKBAR_TIMEOUT,
): SnackbarOptions {
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

  async function onEmitCommon() {
    await refetchNotifications();
  }

  function enqueueEvent({
    txHash,
    action,
    visibleEmitResult = false,
    formatData = () => ({}),
    onUpdate = async () => {},
    onEmit,
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
  }) {
    if (!txHash) {
      return;
    }

    enqueue(undefined, makeSnackbarConfig("pending"));

    const updatingSnackbarConfig = makeSnackbarConfig(
      "updating",
      UPDATING_SNACKBAR_TIMEOUT,
    );

    let alreadyEmitted = false;

    eventStore.addEvent(
      txHash,
      async event => {
        const messageType = event.status === "SUCCESS" ? "success" : "error";
        const message = getMessage(
          action,
          messageType,
          formatData(event.data),
          txHash,
        );
        enqueue(
          message,
          makeSnackbarConfig(messageType, TX_RESULT_SNACKBAR_TIMEOUT),
        );
        onUpdate();

        if (visibleEmitResult && event.status === "SUCCESS") {
          wait<boolean>(async () => true, TX_RESULT_SNACKBAR_TIMEOUT).then(
            () => {
              enqueue(undefined, updatingSnackbarConfig);

              if (alreadyEmitted) {
                change(updatingSnackbarConfig.id, "updating-done");

                wait<boolean>(async () => true, 3_000).then(() => {
                  dequeue(updatingSnackbarConfig.id);
                });
              }
            },
          );
        }
      },
      async () => {
        console.log("emitted event");
        alreadyEmitted = true;
        onEmitCommon();

        if (onEmit !== undefined) {
          onEmit();
        }

        if (visibleEmitResult) {
          change(updatingSnackbarConfig.id, "updating-done");

          wait<boolean>(async () => true, 3_000).then(() => {
            dequeue(updatingSnackbarConfig.id);
          });
        }
      },
    );
  }

  return { enqueueEvent };
};
