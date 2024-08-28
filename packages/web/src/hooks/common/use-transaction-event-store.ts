import { DexEventType } from "@repositories/common";

import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";
import { useGnoswapContext } from "./use-gnoswap-context";
import { makeRandomId } from "@utils/common";
import { useMessage } from "./use-message";
import { useGetNotifications } from "@query/common";

const DEFAULT_SNACKBAR_TIMEOUT = 3_000;
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
  const { enqueue, dequeue } = useSnackbar();
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
        enqueue(message, makeSnackbarConfig(messageType));
        onUpdate();

        if (visibleEmitResult && event.status === "SUCCESS") {
          setTimeout(() => {
            enqueue(undefined, updatingSnackbarConfig);
          }, 3_000);
        }
      },
      async () => {
        console.log("emitted event");
        onEmitCommon();

        if (onEmit !== undefined) {
          onEmit();
        }

        if (visibleEmitResult) {
          setTimeout(() => {
            dequeue(updatingSnackbarConfig.id);
          }, 3_000);
        }
      },
    );
  }

  return { enqueueEvent };
};
