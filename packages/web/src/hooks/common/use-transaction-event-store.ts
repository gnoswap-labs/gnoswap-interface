import { DexEventType } from "@repositories/common";

import { SnackbarOptions, SnackbarType, useSnackbar } from "./use-snackbar";
import { useGnoswapContext } from "./use-gnoswap-context";
import { makeRandomId } from "@utils/common";
import { useMessage } from "./use-message";

function makeNoticeConfig(type: SnackbarType): SnackbarOptions {
  const timeout = 50000;
  return {
    id: makeRandomId(),
    type,
    closeable: true,
    timeout,
  };
}

export const useTransactionEventStore = () => {
  const { eventStore } = useGnoswapContext();
  const { enqueue } = useSnackbar();
  const { getMessage } = useMessage();

  function enqueueEvent({
    txHash,
    action,
    formatData = () => ({}),
    callback = async () => {},
  }: {
    txHash?: string;
    action: DexEventType;
    formatData?: (result: string[] | null) => {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
    };
    callback?: () => Promise<void>;
  }) {
    if (!txHash) {
      return;
    }

    const pendingMessage = getMessage(
      action,
      "pending",
      formatData(null),
      txHash,
    );
    enqueue(pendingMessage, makeNoticeConfig("pending"));

    eventStore.addEvent(txHash, async event => {
      const messageType = event.status === "SUCCESS" ? "success" : "error";
      const message = getMessage(
        action,
        messageType,
        formatData(event.data),
        txHash,
      );
      enqueue(message, makeNoticeConfig(messageType));
      await callback();
    });
  }

  return { enqueueEvent };
};
