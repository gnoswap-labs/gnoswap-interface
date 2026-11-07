import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { ERROR_VALUE } from "@common/errors/adena";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { QUERY_KEY } from "@query/query-keys";
import { DexEvent, DexEventType } from "@repositories/common";

export interface OrderMessageData {
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenAAmount: string;
  tokenBAmount?: string;
}

interface SubmitOrderTransactionParams {
  action: DexEventType;
  messageData: OrderMessageData;
  send: () => Promise<WalletResponse<{ hash: string }>>;
  /** Called once the wallet accepted the transaction. */
  onBroadcast?: () => void;
}

/**
 * Actions that pay escrowed input or accrued output back to the owner. A
 * wrapped-GNOT side arrives as WUGNOT, so these check the receipt for it and
 * offer the unwrap notice, as the swap does.
 */
const ORDER_PAYOUT_ACTIONS: DexEventType[] = [DexEvent.DCA_STOP, DexEvent.DCA_CLAIM, DexEvent.LIMIT_CANCEL];

const ORDER_QUERY_KEYS = [
  QUERY_KEY.dcaOrders,
  QUERY_KEY.dcaOrder,
  QUERY_KEY.dcaExecutions,
  QUERY_KEY.limitOrders,
  QUERY_KEY.limitOrderFills,
];

/**
 * Broadcasts an order transaction the way the swap does: the waiting modal,
 * the result modal, the snackbar, and refreshed balances and order lists once
 * the transaction lands.
 */
export const useOrderTransaction = () => {
  const queryClient = useQueryClient();
  const { getMessage } = useMessage();
  const { enqueueEvent } = useTransactionEventStore();
  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal();
  const { broadcastLoading, broadcastSuccess, broadcastError, broadcastRejected } = useBroadcastHandler();
  const { updateBalances, refetchGrc20Balances } = useTokenData(true);

  const invalidateOrders = useCallback(
    () => Promise.all(ORDER_QUERY_KEYS.map(key => queryClient.invalidateQueries([key]))),
    [queryClient],
  );

  const submit = useCallback(
    ({ action, messageData, send, onBroadcast }: SubmitOrderTransactionParams) => {
      broadcastLoading(getMessage(action, "pending", messageData));
      openTransactionConfirmModal();

      send()
        .then(response => {
          if (response?.code === 0 || response?.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
            enqueueEvent({
              txHash: response?.data?.hash,
              action,
              checkWugnotTransfer: ORDER_PAYOUT_ACTIONS.includes(action),
              formatData: () => messageData,
              onUpdate: async () => {
                await Promise.all([refetchGrc20Balances(), updateBalances(), invalidateOrders()]);
              },
              onEmit: async () => {
                await Promise.all([refetchGrc20Balances(), invalidateOrders()]);
              },
            });
          }

          if (response?.code === 0) {
            onBroadcast?.();
            broadcastSuccess(getMessage(action, "success", messageData, response.data?.hash));
            openTransactionConfirmModal();
            return;
          }

          if (response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status) {
            broadcastRejected(getMessage(action, "error", messageData));
          } else {
            broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          }
          openTransactionConfirmModal();
        })
        .catch(error => {
          console.error(`Failed to broadcast ${action}`, error);
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          openTransactionConfirmModal();
        });
    },
    [
      broadcastError,
      broadcastLoading,
      broadcastRejected,
      broadcastSuccess,
      enqueueEvent,
      getMessage,
      invalidateOrders,
      openTransactionConfirmModal,
      refetchGrc20Balances,
      updateBalances,
    ],
  );

  return { submit, invalidateOrders };
};
